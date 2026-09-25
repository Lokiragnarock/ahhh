"use client";

import Link from "next/link";
import { useState } from "react";
import type { FlowTopic } from "@/lib/flow";
import { Round, ROUNDS } from "@/lib/practice-types";
import {
  currentRound,
  fmtDate,
  roundCount,
  roundDone,
  setRound,
  useAttempts,
  useRounds,
} from "@/lib/practice-store";

const ROUND_HINT: Record<Round, string> = {
  R1: "First pass: study, map, flashcards, mini test",
  R2: "Error-book revisit with the notes",
  R3: "Full mock papers",
};

const topicHref = (t: FlowTopic) => `/topic/${encodeURIComponent(t.slug)}`;

export function RoundToggles({ node, withDates = false }: { node: string; withDates?: boolean }) {
  const [rounds, setRounds] = useRounds();
  return (
    <div className={withDates ? "flex flex-col gap-1.5" : "flex gap-1"}>
      {ROUNDS.map((r) => {
        const date = rounds.topics?.[node]?.[r];
        const btn = (
          <button
            key={r}
            type="button"
            title={date ? `${r} done ${fmtDate(date)} — click to undo` : `Mark ${r} complete`}
            onClick={() => setRounds((prev) => setRound(prev, [node], r, !date))}
            className={`sp-chip cursor-pointer min-w-[34px] text-center ${date ? "sp-chip-dark" : ""}`}
          >
            {date ? `${r} ✓` : r}
          </button>
        );
        return withDates ? (
          <div key={r} className="flex items-center gap-2">
            {btn}
            <span className="text-[12px] text-[#888]">{date ? `done ${fmtDate(date)}` : "not done"}</span>
          </div>
        ) : (
          btn
        );
      })}
    </div>
  );
}

export function RoundsStrip({ topics }: { topics: FlowTopic[] }) {
  const [rounds, setRounds, hydrated] = useRounds();
  const [attempts] = useAttempts();
  const nodes = topics.map((t) => t.id);
  const current = currentRound(rounds, nodes);
  const mocks = attempts.filter((a) => a.kind === "mock").length;

  return (
    <div className="sp-stat-grid grid-cols-1 sm:grid-cols-3 mb-6">
      {ROUNDS.map((r) => {
        const n = roundCount(rounds, nodes, r);
        const isCurrent = hydrated && r === current;
        return (
          <div key={r} className={`sp-stat ${isCurrent ? "!bg-[#111] text-white" : ""}`}>
            <div className="flex items-center justify-between">
              <div className={`sp-label ${isCurrent ? "!text-[#bbb]" : ""}`}>
                {r} {isCurrent && "· current"}
              </div>
              {r === "R3" && (
                <button
                  type="button"
                  onClick={() =>
                    setRounds((prev) => ({ ...prev, r3Complete: prev.r3Complete ? undefined : new Date().toISOString() }))
                  }
                  className={`sp-chip cursor-pointer ${rounds.r3Complete ? "sp-chip-dark !border-white" : ""}`}
                >
                  {rounds.r3Complete ? `R3 complete ✓` : "Mark R3 complete"}
                </button>
              )}
            </div>
            <div className={`sp-stat-value ${isCurrent ? "!text-white" : ""}`}>
              {n}
              <span className={isCurrent ? "text-[#999]" : "text-[#aaa]"}>/{nodes.length}</span>
              {r === "R3" && (
                <span className={`text-[13px] font-normal ml-3 ${isCurrent ? "text-[#ccc]" : "text-[#888]"}`}>
                  {mocks} mock{mocks === 1 ? "" : "s"} taken
                </span>
              )}
            </div>
            <div className={`sp-stat-sub ${isCurrent ? "!text-[#aaa]" : ""}`}>{ROUND_HINT[r]}</div>
          </div>
        );
      })}
    </div>
  );
}

export function UpNext({ topics }: { topics: FlowTopic[] }) {
  const [rounds, , hydrated] = useRounds();
  if (!hydrated || topics.length === 0) return <div className="h-[92px] mb-8" />;
  const nodes = topics.map((t) => t.id);
  const round = currentRound(rounds, nodes);
  const next = topics.find((t) => !roundDone(rounds, t.id, round));
  const href = next ? (round === "R3" ? "/practice/mock" : topicHref(next)) : "/practice/mock";

  return (
    <div className="sp-panel mb-8 flex flex-wrap items-center gap-5 !border-[#111]">
      <div className="flex-1 min-w-[220px]">
        <div className="sp-label">Up next · {round}</div>
        {next ? (
          <div className="text-[18px] font-semibold text-[#111] leading-snug">
            {next.id} <span className="font-normal text-[#555]">{next.title}</span>
            <div className="text-[12px] text-[#888] font-normal mt-0.5">{next.unit}</div>
          </div>
        ) : (
          <div className="text-[18px] font-semibold">Every topic has R3 marked. Keep taking mocks.</div>
        )}
      </div>
      <Link href={href} className="sp-btn">
        Continue →
      </Link>
    </div>
  );
}

export interface BoardUnit {
  unit: string;
  topics: FlowTopic[];
}

export function RoundsBoard({ units }: { units: BoardUnit[] }) {
  const [rounds, setRounds] = useRounds();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {units.map((u) => {
        const nodes = u.topics.map((t) => t.id);
        return (
          <section key={u.unit} className="sp-panel min-w-0">
            <div className="flex flex-wrap items-start gap-3 border-b border-[#111] pb-3 mb-1">
              <div className="flex-1 min-w-[140px]">
                <h2 className="sp-h2 !mb-1">{u.unit}</h2>
                <div className="text-[12px] text-[#888] tabular-nums">
                  {ROUNDS.map((r) => {
                    const n = roundCount(rounds, nodes, r);
                    return (
                      <span key={r} className={`mr-3 ${n === nodes.length ? "text-[#111] font-semibold" : ""}`}>
                        {r} {n}/{nodes.length}
                        {n === nodes.length && " ✓"}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-1 flex-wrap">
                {ROUNDS.map((r) => {
                  const all = roundCount(rounds, nodes, r) === nodes.length;
                  return (
                    <button
                      key={r}
                      type="button"
                      className={`sp-btn sp-btn-sm ${all ? "" : "sp-btn-ghost"}`}
                      title={all ? `Undo ${r} for every topic in ${u.unit}` : `Mark ${r} complete for every topic in ${u.unit}`}
                      onClick={() => setRounds((prev) => setRound(prev, nodes, r, !all))}
                    >
                      {all ? `Unit ${r} ✓` : (
                        <>
                          <span className="hidden sm:inline">Mark unit&nbsp;</span>
                          <span className="sm:hidden">All&nbsp;</span>
                          {r}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <ul>
              {u.topics.map((t) => (
                <li key={t.id} className="sp-row">
                  <span className="font-semibold w-12 shrink-0">{t.id}</span>
                  <Link href={topicHref(t)} className="flex-1 min-w-0 truncate text-[#333] hover:underline">
                    {t.title}
                  </Link>
                  <RoundToggles node={t.id} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export function MarkRoundPrompt({ node }: { node: string }) {
  const [rounds, setRounds, hydrated] = useRounds();
  const [just, setJust] = useState<Round | null>(null);
  if (!hydrated) return null;
  const round: Round | null = !roundDone(rounds, node, "R1") ? "R1" : !roundDone(rounds, node, "R2") ? "R2" : null;
  const done = ROUNDS.filter((r) => roundDone(rounds, node, r));

  let text: string;
  if (just) text = `${just} marked done for ${node}.`;
  else if (round) text = `Finished the ${round === "R1" ? "first pass" : "error-book revisit"} for ${node}?`;
  else text = `${node}: ${done.join(", ")} done.`;

  return (
    <div className="flex flex-wrap items-center gap-3 border border-dashed border-[#ccc] px-4 py-3 mt-6">
      <span className="text-[13px] text-[#555] flex-1 min-w-[200px]">{text}</span>
      {just ? (
        <button
          type="button"
          className="sp-btn sp-btn-ghost sp-btn-sm"
          onClick={() => {
            setRounds((p) => setRound(p, [node], just, false));
            setJust(null);
          }}
        >
          Undo
        </button>
      ) : (
        round && (
          <button
            type="button"
            className="sp-btn sp-btn-sm"
            onClick={() => {
              setRounds((p) => setRound(p, [node], round, true));
              setJust(round);
            }}
          >
            Mark {round} done for this topic
          </button>
        )
      )}
    </div>
  );
}
