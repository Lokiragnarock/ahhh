"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { buildMini, buildMock, buildSectional, buildSingle, Paper, PaperSection, TestKind } from "@/lib/paper";
import { optionLetter, RenderedQuestion, snippet, TYPE_LABEL } from "@/lib/question-types";
import type { AnswerState, Attempt, ErrorEntry, QuestionResult, SessionState } from "@/lib/practice-types";
import {
  applyReview,
  fmtClock,
  fmtDate,
  KEYS,
  makeError,
  pct,
  readStored,
  uid,
  updateStored,
  useErrors,
} from "@/lib/practice-store";
import { EMPTY_FIELDS, ErrorFieldValues, ErrorFields } from "./ErrorFields";

type Sessions = Record<string, SessionState>;

interface Props {
  pool: RenderedQuestion[];
  kind: TestKind;
  scope: string;
  resolveEntryId?: string;
}

function build(pool: RenderedQuestion[], kind: TestKind, scope: string): Paper {
  if (kind === "mini") return buildMini(pool, scope);
  if (kind === "sectional") return buildSectional(pool, scope);
  if (kind === "mock") return buildMock(pool);
  const q = pool.find((x) => x.id === scope);
  return q ? buildSingle(q) : { kind, scope, title: "Re-solve", durationMin: null, sections: [], notes: ["Question not found."] };
}

function writtenScore(q: RenderedQuestion, a: AnswerState | undefined): number {
  if (!a) return 0;
  if (a.override !== undefined && a.override !== null && !Number.isNaN(a.override)) {
    return Math.max(0, Math.min(q.marks, a.override));
  }
  const ticked = (a.ticks ?? []).reduce((s, i) => s + (q.marking_scheme?.[i]?.marks ?? 0), 0);
  return Math.min(q.marks, ticked);
}

function questionScore(q: RenderedQuestion, a: AnswerState | undefined): number | null {
  if (a?.skipped) return null;
  if (q.type === "mcq") return a?.choice && a.choice === (q.answer ?? "").toUpperCase() ? q.marks : 0;
  return writtenScore(q, a);
}

function isOptional(s: PaperSection) {
  return s.answerAny !== undefined && s.answerAny < s.questionIds.length;
}

export function scorePaper(paper: Paper, answers: Record<string, AnswerState>, qmap: Map<string, RenderedQuestion>) {
  const results: QuestionResult[] = [];
  let score = 0;
  let max = 0;
  for (const s of paper.sections) {
    const qs = s.questionIds.map((id) => qmap.get(id)).filter((q): q is RenderedQuestion => Boolean(q));
    const scored = qs.map((q) => ({ q, score: questionScore(q, answers[q.id]) }));
    let countedIds = new Set(qs.map((q) => q.id));
    if (isOptional(s)) {
      const n = s.answerAny!;
      countedIds = new Set(
        scored
          .filter((x) => x.score !== null)
          .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
          .slice(0, n)
          .map((x) => x.q.id)
      );
      max += qs
        .map((q) => q.marks)
        .sort((a, b) => b - a)
        .slice(0, n)
        .reduce((a, b) => a + b, 0);
    } else {
      max += qs.reduce((a, q) => a + q.marks, 0);
    }
    for (const x of scored) {
      const counted = countedIds.has(x.q.id) && x.score !== null;
      if (counted) score += x.score ?? 0;
      results.push({
        questionId: x.q.id,
        node: x.q.node,
        unit: x.q.unit,
        type: x.q.type,
        marks: x.q.marks,
        score: x.score,
        counted,
        section: paper.kind === "mock" ? s.id : undefined,
      });
    }
  }
  return { results, score, max };
}

export function TestRunner({ pool, kind, scope, resolveEntryId }: Props) {
  const key = `${kind}:${scope}`;
  const qmap = useMemo(() => new Map(pool.map((q) => [q.id, q])), [pool]);
  const [session, setSession] = useState<SessionState | null>(null);
  const [done, setDone] = useState<{ attempt: Attempt | null } | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const fresh = useCallback((): SessionState => {
    return { key, paper: build(pool, kind, scope), startedAt: Date.now(), endedAt: null, answers: {}, phase: "answer" };
  }, [key, pool, kind, scope]);

  useEffect(() => {
    const stored = readStored<Sessions>(KEYS.session, {})[key];
    if (stored && stored.paper.sections.every((s) => s.questionIds.every((id) => qmap.has(id)))) {
      setSession(stored);
    } else {
      setSession(fresh());
    }
  }, [key, qmap, fresh]);

  useEffect(() => {
    if (!session || done) return;
    updateStored<Sessions>(KEYS.session, {}, (prev) => ({ ...prev, [key]: session }));
  }, [session, key, done]);

  useEffect(() => {
    if (!session || session.phase !== "answer") return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [session]);

  const paper = session?.paper;
  const durationMs = paper?.durationMin ? paper.durationMin * 60000 : null;
  const elapsed = session ? (session.endedAt ?? now) - session.startedAt : 0;
  const timeUp = durationMs !== null && elapsed >= durationMs;

  useEffect(() => {
    if (session && session.phase === "answer" && timeUp && durationMs !== null) {
      setSession({ ...session, phase: "mark", endedAt: session.startedAt + durationMs });
    }
  }, [session, timeUp, durationMs]);

  if (!session || !paper) {
    return <div className="sp-wrap"><p className="sp-label">Loading paper…</p></div>;
  }

  const allIds = paper.sections.flatMap((s) => s.questionIds);
  const answers = session.answers;
  const phase = done ? "done" : session.phase;
  const reviewing = phase !== "answer";
  const canRevealEarly = kind === "mini" || kind === "resolve";

  function setAnswer(id: string, patch: Partial<AnswerState>) {
    setSession((s) => (s ? { ...s, answers: { ...s.answers, [id]: { ...s.answers[id], ...patch } } } : s));
  }

  function clearSession() {
    updateStored<Sessions>(KEYS.session, {}, (prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function submit() {
    setSession((s) => (s ? { ...s, phase: "mark", endedAt: Date.now() } : s));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finish() {
    const { results, score, max } = scorePaper(paper!, answers, qmap);
    let attempt: Attempt | null = null;
    if (kind !== "resolve") {
      attempt = {
        id: uid(),
        kind,
        scope,
        date: new Date(session!.startedAt).toISOString(),
        durationSec: Math.round(((session!.endedAt ?? Date.now()) - session!.startedAt) / 1000),
        score,
        max,
        results,
      };
      updateStored<Attempt[]>(KEYS.attempts, [], (prev) => [...prev, attempt!]);
    }
    clearSession();
    setDone({ attempt });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    clearSession();
    setDone(null);
    setSession(fresh());
  }

  const answeredCount = allIds.filter((id) => {
    const a = answers[id];
    return a && (a.choice || a.text?.trim() || a.revealed || a.skipped);
  }).length;
  const live = scorePaper(paper, answers, qmap);
  const unmarked = allIds.filter((id) => {
    const q = qmap.get(id);
    const a = answers[id];
    return q && q.type !== "mcq" && !a?.skipped && !a?.revealed && (a?.override ?? null) === null;
  }).length;

  const clock = durationMs !== null ? fmtClock(durationMs - elapsed) : fmtClock(elapsed);
  let qn = 0;

  return (
    <div>
      <div className="sp-timer-bar">
        <div className="max-w-[860px] mx-auto px-4 py-3 flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="sp-label mb-0 truncate">{paper.title}</div>
            <div className="text-[12px] text-[#888]">
              {phase === "answer" ? `${answeredCount} of ${allIds.length} touched` : phase === "mark" ? "Marking" : "Done"}
            </div>
          </div>
          <div className={`text-[20px] font-semibold tabular-nums ${timeUp ? "text-[#e03e3e]" : "text-[#111]"}`}>
            {phase === "answer" ? clock : fmtClock(elapsed)}
          </div>
          {phase === "answer" && (
            <button type="button" className="sp-btn" onClick={submit} disabled={allIds.length === 0}>
              Submit
            </button>
          )}
        </div>
        <div className="sp-progress-rail !mb-0">
          <div
            className="sp-progress-rail-fill"
            style={{ width: `${allIds.length ? (answeredCount / allIds.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-4 pt-8 pb-32">
        {done && (
          <Results
            paper={paper}
            kind={kind}
            attempt={done.attempt}
            answers={answers}
            qmap={qmap}
            resolveEntryId={resolveEntryId}
            onRestart={restart}
          />
        )}

        {phase === "mark" && (
          <div className="sp-panel mb-6">
            <div className="sp-label">Self-marking</div>
            <p className="sp-body-text mb-2">
              MCQs are marked. For each written answer, reveal the model answer and tick the scheme points you actually
              hit. Use the override box if your answer earns part of a point.
            </p>
            <div className="text-[13px] text-[#555]">
              Running score <strong className="text-[#111]">{live.score} / {live.max}</strong>
              {unmarked > 0 && <span className="text-[#e03e3e]"> · {unmarked} written not yet marked</span>}
            </div>
          </div>
        )}

        {phase === "answer" && timeUp && <p className="sp-error text-[13px] mb-4">Time up.</p>}

        {paper.notes.length > 0 && (
          <div className="border border-dashed border-[#ccc] px-4 py-3 mb-6 text-[13px] text-[#555]">
            {paper.notes.map((n) => (
              <div key={n}>{n}</div>
            ))}
          </div>
        )}

        {allIds.length === 0 && (
          <div className="sp-panel">
            <p className="sp-body-text">No questions in this pool yet.</p>
            <Link href="/practice" className="sp-quiet-link">Back to practice</Link>
          </div>
        )}

        {paper.sections.map((s) => (
          <section key={s.id} className="mb-10">
            <div className="flex items-baseline justify-between gap-4 border-b border-[#111] pb-2 mb-1">
              <h2 className="sp-h2 !mb-0">{s.title}</h2>
              {s.instruction && <span className="text-[12px] text-[#888]">{s.instruction}</span>}
            </div>
            {s.questionIds.length === 0 && (
              <p className="text-[13px] text-[#888] py-4">No questions of this type in the bank yet.</p>
            )}
            {s.questionIds.map((id) => {
              const q = qmap.get(id);
              if (!q) return null;
              qn += 1;
              return (
                <QuestionBlock
                  key={id}
                  n={qn}
                  q={q}
                  a={answers[id]}
                  phase={phase}
                  optional={isOptional(s)}
                  canReveal={reviewing || canRevealEarly}
                  onChange={(patch) => setAnswer(id, patch)}
                />
              );
            })}
          </section>
        ))}

        {allIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#e5e5e5]">
            {phase === "answer" && (
              <button type="button" className="sp-btn" onClick={submit}>
                Submit paper
              </button>
            )}
            {phase === "mark" && (
              <button type="button" className="sp-btn" onClick={finish}>
                {kind === "resolve" ? "Finish re-solve" : "Finish marking"}
              </button>
            )}
            {phase !== "done" && (
              <button type="button" className="sp-btn sp-btn-ghost" onClick={restart}>
                {kind === "mini" || kind === "resolve" ? "Restart" : "New paper"}
              </button>
            )}
            <Link href={kind === "resolve" ? "/errors" : "/practice"} className="sp-quiet-link ml-auto">
              {kind === "resolve" ? "Error book" : "Practice hub"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionBlock({
  n,
  q,
  a,
  phase,
  optional,
  canReveal,
  onChange,
}: {
  n: number;
  q: RenderedQuestion;
  a: AnswerState | undefined;
  phase: "answer" | "mark" | "done";
  optional: boolean;
  canReveal: boolean;
  onChange: (patch: Partial<AnswerState>) => void;
}) {
  const reviewing = phase !== "answer";
  const correct = (q.answer ?? "").toUpperCase();
  const score = questionScore(q, a);
  const locked = phase === "done";

  return (
    <div className={`sp-q ${a?.skipped ? "opacity-50" : ""}`}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[13px] font-bold text-[#111] mr-1">Q{n}</span>
        <span className="sp-chip">{TYPE_LABEL[q.type]}</span>
        <span className="sp-chip">{q.marks} {q.marks === 1 ? "mark" : "marks"}</span>
        <span className="sp-chip">{q.difficulty}</span>
        <span className="sp-chip">{q.node}</span>
        {reviewing && score !== null && (
          <span className={`sp-chip ml-auto ${score >= q.marks ? "sp-chip-dark" : "sp-chip-red"}`}>
            {score} / {q.marks}
          </span>
        )}
        {reviewing && score === null && <span className="sp-chip ml-auto">Skipped</span>}
      </div>

      <div className="sp-q-text mb-4" dangerouslySetInnerHTML={{ __html: q.questionHtml }} />

      {q.type === "mcq" ? (
        <div>
          {(q.options ?? []).map((opt, i) => {
            const letter = optionLetter(opt);
            const chosen = a?.choice === letter;
            let cls = "sp-option";
            if (reviewing && letter === correct) cls += " sp-option-correct";
            else if (reviewing && chosen) cls += " sp-option-wrong";
            else if (chosen) cls += " sp-option-chosen";
            return (
              <button
                key={i}
                type="button"
                className={cls}
                disabled={Boolean(a?.choice) || reviewing}
                onClick={() => onChange({ choice: letter })}
              >
                <span dangerouslySetInnerHTML={{ __html: q.optionsHtml?.[i] ?? opt }} />
              </button>
            );
          })}
          {reviewing && !a?.choice && <p className="text-[12.5px] text-[#e03e3e] mt-1">Not answered.</p>}
          {reviewing && q.explanationHtml && (
            <div className="sp-reveal-box">
              <div className="sp-label">Explanation</div>
              <div className="sp-md" dangerouslySetInnerHTML={{ __html: q.explanationHtml }} />
            </div>
          )}
        </div>
      ) : (
        <div>
          {optional && !locked && (
            <div className="mb-3">
              <button
                type="button"
                className="sp-btn sp-btn-ghost sp-btn-sm"
                onClick={() => onChange({ skipped: !a?.skipped })}
              >
                {a?.skipped ? "Attempt this question" : "Skip (not attempting)"}
              </button>
            </div>
          )}
          {!a?.skipped && (
            <>
              <textarea
                className="sp-textarea"
                rows={q.type === "short" ? 6 : 10}
                placeholder="Write here, or on paper. Optional."
                value={a?.text ?? ""}
                readOnly={locked}
                onChange={(e) => onChange({ text: e.target.value })}
              />
              {!a?.revealed ? (
                canReveal && (
                  <button type="button" className="sp-btn sp-btn-ghost mt-3" onClick={() => onChange({ revealed: true })}>
                    Reveal model answer
                  </button>
                )
              ) : (
                <WrittenReveal q={q} a={a} locked={locked} onChange={onChange} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function WrittenReveal({
  q,
  a,
  locked,
  onChange,
}: {
  q: RenderedQuestion;
  a: AnswerState;
  locked: boolean;
  onChange: (patch: Partial<AnswerState>) => void;
}) {
  const ticks = a.ticks ?? [];
  const score = writtenScore(q, a);
  return (
    <div className="sp-reveal-box">
      {q.modelAnswerHtml && (
        <>
          <div className="sp-label">Model answer</div>
          <div className="sp-md mb-5" dangerouslySetInnerHTML={{ __html: q.modelAnswerHtml }} />
        </>
      )}
      {q.marking_scheme && q.marking_scheme.length > 0 && (
        <>
          <div className="sp-label">Marking scheme — tick what you hit</div>
          <ul className="sp-checklist mb-4">
            {q.marking_scheme.map((p, i) => (
              <li key={i} className="sp-checklist-item">
                <label>
                  <input
                    type="checkbox"
                    disabled={locked}
                    checked={ticks.includes(i)}
                    onChange={(e) =>
                      onChange({ ticks: e.target.checked ? [...ticks, i] : ticks.filter((t) => t !== i) })
                    }
                  />
                  <span className="flex-1" dangerouslySetInnerHTML={{ __html: q.schemeHtml?.[i] ?? p.point }} />
                  <span className="text-[#888] tabular-nums">{p.marks}</span>
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="flex flex-wrap items-center gap-3 text-[13px]">
        <span className="sp-label !mb-0">Self score</span>
        <strong className="text-[16px] tabular-nums">
          {score} / {q.marks}
        </strong>
        <label className="flex items-center gap-2 text-[#888]">
          override
          <input
            type="number"
            min={0}
            max={q.marks}
            step={0.5}
            disabled={locked}
            className="sp-input w-20"
            value={a.override ?? ""}
            onChange={(e) => onChange({ override: e.target.value === "" ? null : Number(e.target.value) })}
          />
        </label>
      </div>
    </div>
  );
}

function Results({
  paper,
  kind,
  attempt,
  answers,
  qmap,
  resolveEntryId,
  onRestart,
}: {
  paper: Paper;
  kind: TestKind;
  attempt: Attempt | null;
  answers: Record<string, AnswerState>;
  qmap: Map<string, RenderedQuestion>;
  resolveEntryId?: string;
  onRestart: () => void;
}) {
  const { results, score, max } = attempt ?? scorePaper(paper, answers, qmap);

  if (kind === "resolve") {
    return <ResolveVerdict entryId={resolveEntryId} full={score >= max && max > 0} score={score} max={max} />;
  }

  const misses = results.filter((r) => r.score !== null && r.score < r.marks);
  const secs = attempt?.durationSec ?? 0;

  return (
    <div className="sp-panel mb-10">
      <div className="flex flex-wrap items-end gap-x-10 gap-y-4 mb-6">
        <div>
          <div className="sp-label">Score</div>
          <div className="text-[40px] font-semibold leading-none tabular-nums">
            {score}
            <span className="text-[#888] text-[22px]"> / {max}</span>
          </div>
        </div>
        <div>
          <div className="sp-label">Percent</div>
          <div className="text-[28px] font-semibold leading-none tabular-nums">{pct(score, max)}%</div>
        </div>
        <div>
          <div className="sp-label">Time</div>
          <div className="text-[28px] font-semibold leading-none tabular-nums">{fmtClock(secs * 1000)}</div>
        </div>
      </div>

      <MissList kind={kind} misses={misses} answers={answers} qmap={qmap} />

      <div className="flex flex-wrap gap-3 mt-6">
        <button type="button" className="sp-btn sp-btn-ghost" onClick={onRestart}>
          {kind === "mini" ? "Retake" : "New paper"}
        </button>
        <Link href="/practice" className="sp-btn sp-btn-ghost">Practice hub</Link>
        <Link href="/errors" className="sp-btn sp-btn-ghost">Error book</Link>
      </div>
      <p className="text-[12px] text-[#888] mt-4">Full review of every question is below.</p>
    </div>
  );
}

function MissList({
  kind,
  misses,
  answers,
  qmap,
}: {
  kind: TestKind;
  misses: QuestionResult[];
  answers: Record<string, AnswerState>;
  qmap: Map<string, RenderedQuestion>;
}) {
  const [errors, setErrors] = useErrors();
  const [open, setOpen] = useState<string | null>(null);
  const [fields, setFields] = useState<ErrorFieldValues>(EMPTY_FIELDS);
  const [logged, setLogged] = useState<Record<string, string>>({});
  const source = kind === "resolve" ? "manual" : kind;

  function entryFor(r: QuestionResult, f: ErrorFieldValues): ErrorEntry {
    const q = qmap.get(r.questionId);
    const a = answers[r.questionId];
    const defaultWhat =
      q?.type === "mcq" ? (a?.choice ? `Chose ${a.choice}; correct was ${q.answer}.` : "Left unanswered.") : "";
    return makeError({
      questionId: r.questionId,
      questionText: q ? snippet(q.question) : undefined,
      node: r.node,
      unit: r.unit,
      source,
      scoreText: `${r.score ?? 0}/${r.marks}`,
      errorType: f.errorType,
      what: f.what || defaultWhat,
      why: f.why,
      correct: f.correct || (q?.type === "mcq" && q.explanation ? q.explanation : ""),
      avoid: f.avoid,
    });
  }

  function save(r: QuestionResult) {
    const e = entryFor(r, fields);
    setErrors((prev) => [...prev, e]);
    setLogged((l) => ({ ...l, [r.questionId]: e.id }));
    setOpen(null);
    setFields(EMPTY_FIELDS);
  }

  function logAll() {
    const fresh = misses.filter((r) => !logged[r.questionId]).map((r) => entryFor(r, EMPTY_FIELDS));
    setErrors((prev) => [...prev, ...fresh]);
    setLogged((l) => ({ ...l, ...Object.fromEntries(fresh.map((e) => [e.questionId!, e.id])) }));
  }

  const alreadyOpen = new Set(errors.filter((e) => e.status !== "mastered").map((e) => e.questionId));
  const remaining = misses.filter((r) => !logged[r.questionId]).length;

  if (misses.length === 0) {
    return <p className="sp-body-text">Clean paper. Nothing to log.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e5e5] pb-2 mb-1">
        <div className="sp-h2 !mb-0">Below full marks · {misses.length}</div>
        <button type="button" className="sp-btn sp-btn-sm" disabled={remaining === 0} onClick={logAll}>
          {remaining === 0 ? "All logged" : `Log all misses (${remaining})`}
        </button>
      </div>
      <ul>
        {misses.map((r) => {
          const q = qmap.get(r.questionId);
          return (
            <li key={r.questionId} className="border-b border-[#eee] py-3">
              <div className="flex items-start gap-3">
                <span className="sp-miss-dot mt-[7px]" />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-[#111]">
                    {r.questionId} <span className="text-[#888] font-normal">· {TYPE_LABEL[r.type]}</span>
                  </div>
                  <div className="text-[13px] text-[#555] line-clamp-2">{q ? snippet(q.question, 160) : ""}</div>
                </div>
                <span className="tabular-nums text-[13px] font-semibold shrink-0">
                  {r.score}/{r.marks}
                </span>
                {logged[r.questionId] ? (
                  <span className="sp-chip sp-chip-dark shrink-0">Logged</span>
                ) : (
                  <button
                    type="button"
                    className="sp-btn sp-btn-ghost sp-btn-sm shrink-0"
                    onClick={() => {
                      setOpen(open === r.questionId ? null : r.questionId);
                      setFields(EMPTY_FIELDS);
                    }}
                  >
                    {open === r.questionId ? "Cancel" : "Log"}
                  </button>
                )}
              </div>
              {alreadyOpen.has(r.questionId) && !logged[r.questionId] && (
                <p className="text-[12px] text-[#888] mt-1 ml-[18px]">Already has an open error-book entry.</p>
              )}
              {open === r.questionId && (
                <div className="mt-4 ml-[18px]">
                  <ErrorFields value={fields} onChange={setFields} />
                  <button type="button" className="sp-btn mt-4" onClick={() => save(r)}>
                    Save to error book
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {Object.keys(logged).length > 0 && (
        <p className="text-[12px] text-[#888] mt-3">
          Quick-logged entries can be filled in later from the <Link href="/errors" className="underline">error book</Link>.
        </p>
      )}
    </div>
  );
}

function ResolveVerdict({ entryId, full, score, max }: { entryId?: string; full: boolean; score: number; max: number }) {
  const [errors, setErrors] = useErrors();
  const [verdict, setVerdict] = useState<ErrorEntry | null>(null);
  const entry = errors.find((e) => e.id === entryId);

  function decide(clean: boolean) {
    if (!entry) return;
    const next = applyReview(entry, clean);
    setErrors((prev) => prev.map((e) => (e.id === next.id ? next : e)));
    setVerdict(next);
  }

  return (
    <div className="sp-panel mb-10">
      <div className="sp-label">Re-solve</div>
      <div className="text-[32px] font-semibold tabular-nums mb-4">
        {score} <span className="text-[#888] text-[20px]">/ {max}</span>
      </div>
      {!entry ? (
        <p className="sp-body-text">No error-book entry linked to this re-solve.</p>
      ) : verdict ? (
        <p className="sp-body-text">
          {verdict.status === "mastered"
            ? "Three clean re-solves. Marked mastered."
            : `Next re-solve ${fmtDate(verdict.nextReview)}.`}
        </p>
      ) : (
        <>
          {(entry.correct || entry.avoid) && (
            <div className="sp-reveal-box mb-5">
              {entry.correct && (
                <p className="text-[13.5px] mb-2">
                  <span className="sp-label">Correct method </span>
                  <br />
                  {entry.correct}
                </p>
              )}
              {entry.avoid && (
                <p className="text-[13.5px]">
                  <span className="sp-label">How to avoid </span>
                  <br />
                  {entry.avoid}
                </p>
              )}
            </div>
          )}
          <p className="sp-body-text mb-4">
            Was this a clean re-solve — right method, no slips, without peeking?
            {full ? " You scored full marks." : ""}
          </p>
          <div className="sp-judge-row max-w-[420px]">
            <button type="button" className="sp-judge-btn sp-judge-missed" onClick={() => decide(false)}>
              Not clean
            </button>
            <button type="button" className="sp-judge-btn" onClick={() => decide(true)}>
              Clean
            </button>
          </div>
        </>
      )}
      <div className="mt-6">
        <Link href="/errors" className="sp-quiet-link">Back to error book</Link>
      </div>
    </div>
  );
}

