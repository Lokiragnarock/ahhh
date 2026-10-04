"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { DiagQuestion } from "@/lib/gmat/questions";
import { lookupPercentile, sectionScore, totalScore, type SectionKey } from "@/lib/gmat/scoring";
import { ordinal } from "@/lib/gmat/format";

// The 64-question adaptive sim: three timed sections, IRT-style ability
// estimate per section mapped onto the 60-90 scale. On finish only the three
// scaled scores are posted; the server recomputes the total and percentiles.

type Phase = "setup" | "quiz" | "interstitial" | "results";

interface SectionDef {
  key: SectionKey;
  label: string;
  count: number;
  minutes: number;
}

const SECTIONS: SectionDef[] = [
  { key: "QR", label: "Quantitative Reasoning", count: 21, minutes: 45 },
  { key: "VR", label: "Verbal Reasoning", count: 23, minutes: 45 },
  { key: "DI", label: "Data Insights", count: 20, minutes: 45 },
];

interface Answered {
  question: DiagQuestion;
  correct: boolean;
}

interface SectionResult {
  section: SectionDef;
  theta: number;
  timeSeconds: number;
  answered: Answered[];
}

const diffValue = (d: DiagQuestion["difficulty"]) => (d === "easy" ? -1 : d === "hard" ? 1 : 0);
const pCorrect = (theta: number, difficulty: number) => 1 / (1 + Math.exp(-(theta - difficulty)));

// Next question: the topic picked fewest times so far, then the difficulty
// closest to the current ability estimate within it.
function pickNext(pool: DiagQuestion[], byTopic: Map<string, number>, theta: number): DiagQuestion | null {
  if (pool.length === 0) return null;
  const topics = Array.from(new Set(pool.map((q) => q.topic)));
  let target = topics[0];
  let min = Infinity;
  for (const t of topics) {
    const c = byTopic.get(t) ?? 0;
    if (c < min) {
      min = c;
      target = t;
    }
  }
  let best: DiagQuestion | null = null;
  let bestDist = Infinity;
  for (const q of pool) {
    if (q.topic !== target) continue;
    const dist = Math.abs(diffValue(q.difficulty) - theta);
    if (dist < bestDist) {
      bestDist = dist;
      best = q;
    }
  }
  return best;
}

const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export function DiagnosticSim() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [loading, setLoading] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [pools, setPools] = useState<Record<SectionKey, DiagQuestion[]>>({ QR: [], VR: [], DI: [] });
  const [sectionIdx, setSectionIdx] = useState(0);
  const [theta, setTheta] = useState(0);
  const [byTopic, setByTopic] = useState<Map<string, number>>(new Map());
  const [remaining, setRemaining] = useState<DiagQuestion[]>([]);
  const [current, setCurrent] = useState<DiagQuestion | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [selected, setSelected] = useState("");
  const [answered, setAnswered] = useState<Answered[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [results, setResults] = useState<SectionResult[]>([]);
  const [saveFailed, setSaveFailed] = useState(false);
  const startedAt = useRef<number | null>(null);
  const sectionStart = useRef(0);
  const onTimeout = useRef<() => void>(() => {});
  const saved = useRef(false);

  async function begin() {
    setLoading(true);
    setSetupError(null);
    try {
      const res = await fetch("/api/gmat/diagnostics", { cache: "no-store" });
      if (!res.ok) throw new Error(res.status === 409 ? "No player on this device yet." : "Could not load questions.");
      const { questions } = (await res.json()) as { questions: DiagQuestion[] };
      const grouped: Record<SectionKey, DiagQuestion[]> = { QR: [], VR: [], DI: [] };
      for (const q of questions) grouped[q.section].push(q);
      for (const s of SECTIONS) {
        if (grouped[s.key].length < s.count) {
          throw new Error(`Not enough ${s.label} questions (need ${s.count}, found ${grouped[s.key].length}).`);
        }
      }
      setPools(grouped);
      setResults([]);
      startSection(0, grouped);
    } catch (err) {
      setSetupError(err instanceof Error ? err.message : "Could not load questions.");
    } finally {
      setLoading(false);
    }
  }

  function startSection(idx: number, override?: Record<SectionKey, DiagQuestion[]>) {
    const s = SECTIONS[idx];
    const pool = (override ?? pools)[s.key];
    const first = pickNext(pool, new Map(), 0);
    setSectionIdx(idx);
    setTheta(0);
    setByTopic(new Map());
    setAnsweredCount(0);
    setAnswered([]);
    setSelected("");
    setSecondsLeft(s.minutes * 60);
    startedAt.current = sectionStart.current = Date.now();
    setRemaining(pool.filter((q) => q.id !== first?.id));
    setCurrent(first);
    setPhase("quiz");
  }

  // Section timer: wall-clock based so a throttled background tab stays honest.
  useEffect(() => {
    if (phase !== "quiz") return;
    const id = setInterval(() => {
      if (startedAt.current === null) return;
      const left = Math.max(0, SECTIONS[sectionIdx].minutes * 60 - Math.floor((Date.now() - startedAt.current) / 1000));
      setSecondsLeft(left);
      if (left <= 0) onTimeout.current();
    }, 1000);
    return () => clearInterval(id);
  }, [phase, sectionIdx]);

  // Save once when results are reached. Only the section scores go up.
  useEffect(() => {
    if (phase !== "results" || saved.current || results.length < SECTIONS.length) return;
    saved.current = true;
    const sections: Record<SectionKey, number> = { QR: 60, VR: 60, DI: 60 };
    for (const r of results) sections[r.section.key] = sectionScore(r.theta);
    const timeSeconds = results.reduce((n, r) => n + r.timeSeconds, 0);
    fetch("/api/gmat/diagnostics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "in-app", sections, timeSeconds }),
    })
      .then((res) => {
        if (!res.ok) setSaveFailed(true);
      })
      .catch(() => setSaveFailed(true));
  }, [phase, results]);

  function next() {
    if (!current) return;
    const s = SECTIONS[sectionIdx];
    const d = diffValue(current.difficulty);
    const correct = selected !== "" && selected === current.answer;
    const nextTheta = correct ? theta + 0.4 * (1 - pCorrect(theta, d)) : theta - 0.4 * pCorrect(theta, d);
    const list = [...answered, { question: current, correct }];
    const topics = new Map(byTopic);
    topics.set(current.topic, (topics.get(current.topic) ?? 0) + 1);
    const count = answeredCount + 1;

    setAnswered(list);
    setByTopic(topics);
    setAnsweredCount(count);
    setTheta(nextTheta);
    setSelected("");

    if (count >= s.count) {
      finishSection(list, nextTheta);
      return;
    }
    const nq = pickNext(remaining, topics, nextTheta);
    setRemaining(remaining.filter((q) => q.id !== nq?.id));
    setCurrent(nq);
  }

  onTimeout.current = () => {
    const s = SECTIONS[sectionIdx];
    const list = current && answeredCount < s.count ? [...answered, { question: current, correct: false }] : answered;
    finishSection(list, theta);
  };

  function finishSection(list: Answered[], finalTheta: number) {
    const s = SECTIONS[sectionIdx];
    const timeSeconds = Math.floor((Date.now() - sectionStart.current) / 1000);
    startedAt.current = null;
    setResults((prev) => [...prev, { section: s, theta: finalTheta, timeSeconds, answered: list }]);
    setPhase(sectionIdx >= SECTIONS.length - 1 ? "results" : "interstitial");
  }

  function reset() {
    setPhase("setup");
    setPools({ QR: [], VR: [], DI: [] });
    setResults([]);
    setCurrent(null);
    setAnswered([]);
    setSaveFailed(false);
    saved.current = false; // a retake saves too
  }

  if (phase === "setup") {
    return (
      <div className="sp-panel flex flex-col gap-4">
        <p className="sp-body-text">
          Mirrors the GMAT Focus Edition. Difficulty adapts to how you do, and the result is an estimated total with a percentile. Sections
          run back to back; the timer for each starts when you continue.
        </p>
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.key} className="sp-row">
              <span className="flex-1">{s.label}</span>
              <span className="text-[12px] text-[color:var(--sp-muted)] sp-num">
                {s.count} questions · {s.minutes} min
              </span>
            </li>
          ))}
          <li className="sp-row font-semibold">
            <span className="flex-1">Total</span>
            <span className="sp-num text-[12px]">64 questions · 2h 15m</span>
          </li>
        </ul>
        {setupError && <p className="sp-error text-[13px]">{setupError}</p>}
        <button onClick={begin} disabled={loading} className="sp-btn w-fit">
          {loading ? "Loading questions…" : "Begin diagnostic"}
        </button>
      </div>
    );
  }

  if (phase === "quiz" && current) {
    const s = SECTIONS[sectionIdx];
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="sp-num text-[12px] text-[color:var(--sp-muted)]">
            {s.label} · {answeredCount + 1} / {s.count}
          </span>
          <span className={`sp-num text-[18px] font-semibold ${secondsLeft <= 60 ? "sp-delta-neg" : ""}`}>{fmtTime(secondsLeft)}</span>
        </div>
        <div className="sp-panel">
          <div className="sp-q-text mb-4" dangerouslySetInnerHTML={{ __html: current.questionHtml }} />
          <div>
            {current.optionsHtml.map((html, i) => {
              const letter = current.letters[i];
              return (
                <button
                  key={letter + i}
                  type="button"
                  onClick={() => setSelected(letter)}
                  className={`sp-option ${selected === letter ? "sp-option-chosen" : ""}`}
                >
                  <span dangerouslySetInnerHTML={{ __html: html }} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={next} disabled={!selected} className="sp-btn">
            Next
          </button>
        </div>
      </div>
    );
  }

  if (phase === "interstitial") {
    const nextS = SECTIONS[sectionIdx + 1];
    return (
      <div className="sp-panel flex flex-col items-start gap-4">
        <h2 className="sp-h2 !mb-0">Section complete</h2>
        {nextS && (
          <p className="sp-body-text">
            Next: {nextS.label} ({nextS.count} questions, {nextS.minutes} minutes)
          </p>
        )}
        <button onClick={() => startSection(sectionIdx + 1)} className="sp-btn">
          Continue
        </button>
      </div>
    );
  }

  if (phase === "results") {
    const scaled = { QR: 60, VR: 60, DI: 60 } as Record<SectionKey, number>;
    for (const r of results) scaled[r.section.key] = sectionScore(r.theta);
    const total = totalScore(scaled.QR, scaled.VR, scaled.DI);
    return (
      <div className="flex flex-col gap-6">
        <div className="sp-stat-grid grid-cols-2 sm:grid-cols-4">
          <Stat label={`Total · ${ordinal(lookupPercentile(total))} pct`} value={total} />
          {SECTIONS.map((s) => (
            <Stat key={s.key} label={s.key} value={scaled[s.key]} />
          ))}
        </div>
        {results.map((r) => {
          const byTopicStats = new Map<string, { correct: number; total: number }>();
          for (const a of r.answered) {
            const t = byTopicStats.get(a.question.topic) ?? { correct: 0, total: 0 };
            t.total += 1;
            if (a.correct) t.correct += 1;
            byTopicStats.set(a.question.topic, t);
          }
          return (
            <div key={r.section.key} className="sp-panel">
              <div className="flex items-center justify-between mb-2">
                <span className="sp-label !mb-0">{r.section.label}</span>
                <span className="sp-num text-[12px] text-[color:var(--sp-muted)]">
                  {fmtTime(r.timeSeconds)} / {r.section.minutes}:00
                </span>
              </div>
              <ul>
                {Array.from(byTopicStats).map(([topic, t]) => (
                  <li key={topic} className="sp-row">
                    <span className="flex-1">{topic}</span>
                    <span className={`sp-num ${t.correct / t.total >= 0.8 ? "sp-delta-pos" : t.correct / t.total < 0.5 ? "sp-delta-neg" : ""}`}>
                      {t.correct} / {t.total}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {saveFailed && (
          <p className="sp-error text-[13px]">This sitting could not be saved. The scores above are right but will not appear in your status.</p>
        )}
        <div className="flex flex-wrap gap-3">
          <Link href="/gmat/status" className="sp-btn sp-btn-ghost">
            View status
          </Link>
          <button onClick={reset} className="sp-btn">
            Retake
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="sp-stat">
      <div className="sp-label">{label}</div>
      <div className="sp-stat-value sp-num">{value}</div>
    </div>
  );
}
