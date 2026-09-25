"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Round, ROUNDS } from "@/lib/practice-types";
import {
  blockElapsed,
  blockPhase,
  dayKey,
  finishBlock,
  fmtClock,
  LOG_MIN,
  minutesByRound,
  STUDY_MIN,
  uid,
  useBlocks,
  useBlockTimer,
} from "@/lib/practice-store";
import { PageHead, RepsStrip, Stat } from "./bits";

const TOTAL_MS = (STUDY_MIN + LOG_MIN) * 60000;

export function BlockTimerView({ nodes }: { nodes: { id: string; title: string; unit: string }[] }) {
  const [timer, setTimer] = useBlockTimer();
  const [blocks] = useBlocks();
  const [round, setRound] = useState<Round>("R1");
  const [node, setNode] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const last = blocks[blocks.length - 1];
    if (last) setRound(last.round);
  }, [blocks]);

  useEffect(() => {
    if (!timer?.runningSince) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [timer?.runningSince]);

  const elapsed = timer ? blockElapsed(timer, now) : 0;
  const phase = blockPhase(elapsed);

  useEffect(() => {
    if (timer && phase === "done") finishBlock();
  }, [timer, phase]);

  function start() {
    const t = Date.now();
    setNow(t);
    setTimer({ id: uid(), round, node: node || undefined, firstStart: t, runningSince: t, accumulatedMs: 0 });
  }

  function pause() {
    if (!timer) return;
    const t = Date.now();
    setTimer({ ...timer, accumulatedMs: blockElapsed(timer, t), runningSince: null });
  }

  function resume() {
    if (!timer) return;
    const t = Date.now();
    setNow(t);
    setTimer({ ...timer, runningSince: t });
  }

  function reset() {
    if (window.confirm("Discard this block without logging it?")) setTimer(null);
  }

  const today = dayKey();
  const todays = blocks.filter((b) => dayKey(new Date(b.startedAt)) === today);
  const todayMin = todays.reduce((s, b) => s + b.minutes, 0);
  const rounds = minutesByRound(blocks);
  const remaining = phase === "study" ? STUDY_MIN * 60000 - elapsed : TOTAL_MS - elapsed;

  return (
    <div className="sp-wrap">
      <PageHead title="Block" kicker={`${STUDY_MIN} min study · ${LOG_MIN} min error logging`} />

      <section className="sp-panel mb-8">
        {!timer ? (
          <div className="flex flex-col gap-6">
            <div>
              <div className="sp-label">Round</div>
              <div className="flex gap-2">
                {ROUNDS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRound(r)}
                    className={`sp-btn ${round === r ? "" : "sp-btn-ghost"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="text-[12.5px] text-[#888] mt-2">
                R1 first pass over every topic · R2 error-book revisits · R3 full mocks
              </p>
            </div>
            <label className="block">
              <div className="sp-label">Node (optional)</div>
              <select className="sp-select w-full max-w-[420px]" value={node} onChange={(e) => setNode(e.target.value)}>
                <option value="">— none —</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.unit} · {n.id} — {n.title.slice(0, 48)}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <button type="button" className="sp-btn" onClick={start}>
                Start block
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="sp-chip sp-chip-dark">{timer.round}</span>
              {timer.node && <span className="sp-chip">{timer.node}</span>}
              <span className="sp-label !mb-0 ml-1">
                {phase === "study" ? "Study phase" : "Error-log phase"}
                {!timer.runningSince && " · paused"}
              </span>
            </div>
            <div className="text-[64px] md:text-[88px] font-semibold tabular-nums leading-none tracking-[-0.03em] text-[#111] my-4">
              {fmtClock(remaining)}
            </div>
            <div className="relative h-[6px] bg-[#eee] mb-2">
              <div className="absolute inset-y-0 left-0 bg-[#111]" style={{ width: `${Math.min(100, (elapsed / TOTAL_MS) * 100)}%` }} />
              <div className="absolute inset-y-[-4px] w-px bg-[#888]" style={{ left: `${(STUDY_MIN / (STUDY_MIN + LOG_MIN)) * 100}%` }} />
            </div>
            <div className="flex justify-between text-[11px] text-[#888] uppercase tracking-[0.08em] mb-6">
              <span>Study {STUDY_MIN}:00</span>
              <span>Log {LOG_MIN}:00</span>
            </div>

            {phase === "log" && (
              <div className="sp-reveal-box mb-6">
                <p className="text-[14px] mb-3">Stop studying. Log every mistake from this block while it is fresh.</p>
                <Link href="/errors" className="sp-btn">
                  Open error book
                </Link>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {timer.runningSince ? (
                <button type="button" className="sp-btn" onClick={pause}>
                  Pause
                </button>
              ) : (
                <button type="button" className="sp-btn" onClick={resume}>
                  Resume
                </button>
              )}
              <button type="button" className="sp-btn sp-btn-ghost" onClick={() => finishBlock()}>
                End &amp; log {Math.round(elapsed / 60000)} min
              </button>
              <button type="button" className="sp-btn sp-btn-danger" onClick={reset}>
                Reset
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="sp-stat-grid grid-cols-2 md:grid-cols-5 mb-3">
        <Stat label="Today blocks" value={todays.length} sub={`${todays.filter((b) => b.complete).length} complete`} />
        <Stat label="Today min" value={todayMin} />
        {ROUNDS.map((r) => (
          <Stat key={r} label={`${r} total`} value={`${(rounds[r] / 60).toFixed(1)}h`} />
        ))}
      </div>
      <div className="mb-8">
        <RepsStrip />
      </div>

      <section className="sp-panel">
        <h2 className="sp-h2">Today</h2>
        {todays.length === 0 ? (
          <p className="text-[13.5px] text-[#888]">No blocks logged today.</p>
        ) : (
          <ul>
            {[...todays].reverse().map((b) => (
              <li key={b.id} className="sp-row">
                <span className="tabular-nums text-[#888] w-24">
                  {new Date(b.startedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="sp-chip sp-chip-dark">{b.round}</span>
                <span className="flex-1">{b.node ?? "—"}</span>
                <span className="tabular-nums">{b.minutes} min</span>
                <span className={`sp-chip ${b.complete ? "" : "sp-chip-red"}`}>{b.complete ? "complete" : "partial"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
