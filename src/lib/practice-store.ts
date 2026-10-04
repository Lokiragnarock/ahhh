"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Attempt,
  BlockLog,
  BlockTimer,
  ErrorEntry,
  ErrorType,
  Round,
  RoundsState,
  SessionState,
} from "./practice-types";
import { ERROR_TYPES, ROUNDS } from "./practice-types";
import { STORE_EVENT } from "./sync/shared";
import { notifyStore, setLocal } from "./sync/client";
import { useSubject } from "./subject/context";

// localStorage keys are namespaced per subject ("<subject>.practice.*") so
// switching subjects switches the whole progress record — attempts, errors,
// blocks, rounds, the lot. isSyncedKey (sync/shared.ts) matches this pattern
// generically, so a new subject syncs with no further code changes.
export function KEYS(subject: string) {
  return {
    attempts: `${subject}.practice.attempts.v1`,
    errors: `${subject}.practice.errors.v1`,
    blocks: `${subject}.practice.blocks.v1`,
    timer: `${subject}.practice.blockTimer.v1`,
    session: `${subject}.practice.session.v1`,
    rounds: `${subject}.practice.rounds.v1`,
  } as const;
}

export const CLOCK_START = "2026-09-25";
export const STUDY_MIN = 45;
export const LOG_MIN = 15;

// ---------------------------------------------------------------- storage

export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStored<T>(key: string, value: T) {
  setLocal(key, value === null || value === undefined ? null : JSON.stringify(value));
  notifyStore(key);
}

export function updateStored<T>(key: string, fallback: T, fn: (prev: T) => T) {
  writeStored(key, fn(readStored(key, fallback)));
}

// localStorage-backed state that stays in sync across components and tabs.
export function useStored<T>(key: string, fallback: T) {
  const fallbackRef = useRef(fallback);
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const load = () => setValue(readStored(key, fallbackRef.current));
    load();
    setHydrated(true);
    const onLocal = (e: Event) => {
      if ((e as CustomEvent).detail === key) load();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) load();
    };
    window.addEventListener(STORE_EVENT, onLocal);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(STORE_EVENT, onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      updateStored(key, fallbackRef.current, (prev) =>
        typeof next === "function" ? (next as (p: T) => T)(prev) : next
      );
    },
    [key]
  );

  return [value, update, hydrated] as const;
}

const EMPTY: never[] = [];
export const useAttempts = () => useStored<Attempt[]>(KEYS(useSubject()).attempts, EMPTY);
export const useErrors = () => useStored<ErrorEntry[]>(KEYS(useSubject()).errors, EMPTY);
export const useBlocks = () => useStored<BlockLog[]>(KEYS(useSubject()).blocks, EMPTY);

// Blocks from every subject on this device, for views that want the whole day
// rather than the current subject tab. Blocks are stored per subject, so this
// scans localStorage for every "<subject>.practice.blocks.v1" key.
export type SubjectBlock = BlockLog & { subject: string };
const BLOCKS_KEY = /^([a-z0-9][a-z0-9-]*)\.practice\.blocks\.v1$/;

export function readAllBlocks(): SubjectBlock[] {
  const out: SubjectBlock[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      const m = key && BLOCKS_KEY.exec(key);
      if (!m) continue;
      for (const b of readStored<BlockLog[]>(key, [])) out.push({ ...b, subject: m[1] });
    }
  } catch {
    // storage unavailable: no blocks to show
  }
  return out;
}

export function useAllBlocks(): SubjectBlock[] {
  const [blocks, setBlocks] = useState<SubjectBlock[]>([]);
  useEffect(() => {
    const load = () => setBlocks(readAllBlocks());
    load();
    const onLocal = (e: Event) => {
      if (BLOCKS_KEY.test(String((e as CustomEvent).detail))) load();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || BLOCKS_KEY.test(e.key)) load();
    };
    window.addEventListener(STORE_EVENT, onLocal);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(STORE_EVENT, onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return blocks;
}
// Same idea for attempts, errors and blocks, each tagged with its subject.
// Used by the shared timeline.
export type Tagged<T> = T & { subject: string };

function readAllOf<T>(kind: "attempts" | "errors" | "blocks"): Tagged<T>[] {
  const re = new RegExp("^([a-z0-9][a-z0-9-]*)\\.practice\\." + kind + "\\.v1$");
  const out: Tagged<T>[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      const m = key && re.exec(key);
      if (!m) continue;
      for (const x of readStored<T[]>(key, [])) out.push({ ...x, subject: m[1] });
    }
  } catch {
    // storage unavailable: nothing to show
  }
  return out;
}

export function useAllOf<T>(kind: "attempts" | "errors" | "blocks"): Tagged<T>[] {
  const [items, setItems] = useState<Tagged<T>[]>([]);
  useEffect(() => {
    const re = new RegExp("\\.practice\\." + kind + "\\.v1$");
    const load = () => setItems(readAllOf<T>(kind));
    load();
    const onLocal = (e: Event) => {
      if (re.test(String((e as CustomEvent).detail))) load();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || re.test(e.key)) load();
    };
    window.addEventListener(STORE_EVENT, onLocal);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(STORE_EVENT, onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, [kind]);
  return items;
}
export const useBlockTimer = () => useStored<BlockTimer | null>(KEYS(useSubject()).timer, null);
export const useSession = () => useStored<SessionState | null>(KEYS(useSubject()).session, null);
const EMPTY_ROUNDS: RoundsState = { topics: {} };
export const useRounds = () => useStored<RoundsState>(KEYS(useSubject()).rounds, EMPTY_ROUNDS);

// ---------------------------------------------------------------- helpers

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function dayKey(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function addDays(key: string, n: number): string {
  const [y, m, d] = key.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d + n));
}

export function pct(score: number, max: number): number {
  return max > 0 ? Math.round((score / max) * 100) : 0;
}

export function fmtClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function fmtDate(iso: string): string {
  const d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// ---------------------------------------------------------------- error book

export type NewError = Omit<ErrorEntry, "id" | "createdAt" | "status" | "reviews" | "nextReview">;

export function makeError(input: NewError, now = new Date()): ErrorEntry {
  return {
    ...input,
    id: uid(),
    createdAt: now.toISOString(),
    status: "open",
    reviews: [],
    nextReview: addDays(dayKey(now), 1),
  };
}

export function cleanStreak(e: ErrorEntry): number {
  let n = 0;
  for (let i = e.reviews.length - 1; i >= 0 && e.reviews[i].clean; i--) n++;
  return n;
}

// Spaced re-solve: 1 day after logging, then 3, then 7; three clean in a row = mastered.
export function applyReview(e: ErrorEntry, clean: boolean, now = new Date()): ErrorEntry {
  const next: ErrorEntry = { ...e, reviews: [...e.reviews, { date: now.toISOString(), clean }] };
  const today = dayKey(now);
  if (!clean) return { ...next, status: "re-solving", nextReview: addDays(today, 1) };
  const streak = cleanStreak(next);
  if (streak >= 3) return { ...next, status: "mastered", nextReview: "" };
  return { ...next, status: "re-solving", nextReview: addDays(today, streak === 1 ? 3 : 7) };
}

export function isDue(e: ErrorEntry, today = dayKey()): boolean {
  return e.status !== "mastered" && e.nextReview !== "" && e.nextReview <= today;
}

export function countByType(errors: ErrorEntry[]): Record<ErrorType, number> {
  const out = Object.fromEntries(ERROR_TYPES.map((t) => [t, 0])) as Record<ErrorType, number>;
  for (const e of errors) out[e.errorType] = (out[e.errorType] ?? 0) + 1;
  return out;
}

export function errorsToMarkdown(errors: ErrorEntry[]): string {
  const byUnit = new Map<string, Map<string, ErrorEntry[]>>();
  for (const e of errors) {
    const nodes = byUnit.get(e.unit) ?? new Map<string, ErrorEntry[]>();
    nodes.set(e.node, [...(nodes.get(e.node) ?? []), e]);
    byUnit.set(e.unit, nodes);
  }
  const cmp = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });
  const lines: string[] = [`# Error book — exported ${dayKey()}`, ""];
  for (const unit of Array.from(byUnit.keys()).sort(cmp)) {
    lines.push(`## ${unit}`, "");
    const nodes = byUnit.get(unit)!;
    for (const node of Array.from(nodes.keys()).sort(cmp)) {
      lines.push(`### ${node}`, "");
      for (const e of nodes.get(node)!) {
        const head = e.questionId ? `${e.questionId}` : "Manual entry";
        lines.push(`#### ${head} — ${e.errorType} (${e.status}${e.scoreText ? `, scored ${e.scoreText}` : ""})`);
        if (e.questionText) lines.push(`> ${e.questionText}`);
        lines.push("");
        if (e.what) lines.push(`- **What I did:** ${e.what}`);
        if (e.why) lines.push(`- **Why it happened:** ${e.why}`);
        if (e.correct) lines.push(`- **Correct method:** ${e.correct}`);
        if (e.avoid) lines.push(`- **How to avoid next time:** ${e.avoid}`);
        lines.push(
          `- **Source:** ${e.source} · logged ${e.createdAt.slice(0, 10)} · re-solves ${e.reviews.length} (${e.reviews.filter((r) => r.clean).length} clean)`,
          ""
        );
      }
    }
  }
  return lines.join("\n");
}

// ---------------------------------------------------------------- stats

export interface SeriesPoint {
  date: string;
  pct: number;
  kind: Attempt["kind"];
}

// Per-attempt % for each group key (node or unit), counting only scored, counted results.
export function seriesBy(attempts: Attempt[], key: "node" | "unit"): Map<string, SeriesPoint[]> {
  const out = new Map<string, SeriesPoint[]>();
  const sorted = [...attempts].sort((a, b) => a.date.localeCompare(b.date));
  for (const a of sorted) {
    const agg = new Map<string, { s: number; m: number }>();
    for (const r of a.results) {
      if (!r.counted || r.score === null) continue;
      const g = agg.get(r[key]) ?? { s: 0, m: 0 };
      g.s += r.score;
      g.m += r.marks;
      agg.set(r[key], g);
    }
    agg.forEach((g, k) => {
      out.set(k, [...(out.get(k) ?? []), { date: a.date, pct: pct(g.s, g.m), kind: a.kind }]);
    });
  }
  return out;
}

export function lastAttempt(attempts: Attempt[], kind: Attempt["kind"], scope: string): Attempt | undefined {
  return attempts
    .filter((a) => a.kind === kind && a.scope === scope)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

export function reps(attempts: Attempt[], errors: ErrorEntry[], blocks: BlockLog[]) {
  return {
    tests: attempts.length,
    questions: attempts.reduce((s, a) => s + a.results.filter((r) => r.score !== null).length, 0),
    errorsLogged: errors.length,
    errorsMastered: errors.filter((e) => e.status === "mastered").length,
    resolves: errors.reduce((s, e) => s + e.reviews.length, 0),
    blocks: blocks.filter((b) => b.complete).length,
  };
}

export function minutesByRound(blocks: BlockLog[]): Record<Round, number> {
  const out = Object.fromEntries(ROUNDS.map((r) => [r, 0])) as Record<Round, number>;
  for (const b of blocks) {
    if (dayKey(new Date(b.startedAt)) < CLOCK_START) continue;
    out[b.round] += b.minutes;
  }
  return out;
}

// ---------------------------------------------------------------- block timer

export function blockElapsed(t: BlockTimer, now = Date.now()): number {
  return t.accumulatedMs + (t.runningSince !== null ? now - t.runningSince : 0);
}

export function blockPhase(ms: number): "study" | "log" | "done" {
  if (ms < STUDY_MIN * 60000) return "study";
  if (ms < (STUDY_MIN + LOG_MIN) * 60000) return "log";
  return "done";
}

// Idempotent: logs the running block once (by id) and clears the timer.
export function finishBlock(subject: string, now = Date.now()) {
  const keys = KEYS(subject);
  const t = readStored<BlockTimer | null>(keys.timer, null);
  if (!t) return;
  const ms = Math.min(blockElapsed(t, now), (STUDY_MIN + LOG_MIN) * 60000);
  const minutes = Math.round(ms / 60000);
  if (minutes >= 1) {
    updateStored<BlockLog[]>(keys.blocks, [], (prev) =>
      prev.some((b) => b.id === t.id)
        ? prev
        : [
            ...prev,
            {
              id: t.id,
              round: t.round,
              node: t.node,
              startedAt: new Date(t.firstStart).toISOString(),
              endedAt: new Date(now).toISOString(),
              minutes,
              complete: blockPhase(ms) === "done",
              device: t.device,
            },
          ]
    );
  }
  writeStored(keys.timer, null);
}

// ---------------------------------------------------------------- rounds

export {
  roundDone,
  roundCount,
  currentRound,
  setRound,
  topicStateFromRounds,
  stateCounts,
} from "./rounds-core";

// ---------------------------------------------------------------- backup

export function exportAll(subject: string) {
  const keys = KEYS(subject);
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    attempts: readStored<Attempt[]>(keys.attempts, []),
    errors: readStored<ErrorEntry[]>(keys.errors, []),
    blocks: readStored<BlockLog[]>(keys.blocks, []),
    rounds: readStored<RoundsState>(keys.rounds, { topics: {} }),
  };
}

function mergeById<T extends { id: string }>(current: T[], incoming: unknown): T[] {
  if (!Array.isArray(incoming)) return current;
  const map = new Map(current.map((x) => [x.id, x]));
  for (const x of incoming) if (x && typeof x.id === "string") map.set(x.id, x as T);
  return Array.from(map.values());
}

export function importAll(subject: string, data: unknown): { attempts: number; errors: number; blocks: number } {
  const keys = KEYS(subject);
  const d = (data ?? {}) as Record<string, unknown>;
  const attempts = mergeById(readStored<Attempt[]>(keys.attempts, []), d.attempts);
  const errors = mergeById(readStored<ErrorEntry[]>(keys.errors, []), d.errors);
  const blocks = mergeById(readStored<BlockLog[]>(keys.blocks, []), d.blocks);
  writeStored(keys.attempts, attempts);
  writeStored(keys.errors, errors);
  writeStored(keys.blocks, blocks);
  const incoming = d.rounds as RoundsState | undefined;
  if (incoming && typeof incoming === "object" && incoming.topics) {
    const cur = readStored<RoundsState>(keys.rounds, { topics: {} });
    const topics = { ...cur.topics };
    for (const [n, r] of Object.entries(incoming.topics)) topics[n] = { ...(topics[n] ?? {}), ...r };
    writeStored(keys.rounds, { topics, r3Complete: cur.r3Complete ?? incoming.r3Complete });
  }
  return { attempts: attempts.length, errors: errors.length, blocks: blocks.length };
}
