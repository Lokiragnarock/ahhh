// Pure helpers for turning R1/R2/R3 round completion into a TopicState.
// Framework-agnostic (no "use client", no localStorage) so both the client
// store and server routes can share one definition of "studied".
import type { Round, RoundsState } from "./practice-types";
import { ROUNDS } from "./practice-types";
import type { TopicState } from "./study-types";

export function roundDone(state: RoundsState, node: string, round: Round): boolean {
  return Boolean(state.topics?.[node]?.[round]);
}

export function roundCount(state: RoundsState, nodes: string[], round: Round): number {
  return nodes.filter((n) => roundDone(state, n, round)).length;
}

// R3 done -> drilled, R2 -> mapped, R1 -> studied, none -> unstudied. This is
// the single source of truth for "studied" now; the old vault frontmatter
// `state:` field is no longer read for it.
export function topicStateFromRounds(state: RoundsState, node: string): TopicState {
  if (roundDone(state, node, "R3")) return "drilled";
  if (roundDone(state, node, "R2")) return "mapped";
  if (roundDone(state, node, "R1")) return "studied";
  return "unstudied";
}

export function stateCounts(state: RoundsState, nodes: string[]): Record<TopicState, number> {
  const out: Record<TopicState, number> = { unstudied: 0, studied: 0, mapped: 0, drilled: 0 };
  for (const n of nodes) out[topicStateFromRounds(state, n)]++;
  return out;
}

// First round not yet complete across every topic; R3 once R1 and R2 are done.
export function currentRound(state: RoundsState, nodes: string[]): Round {
  if (nodes.length === 0) return "R1";
  if (roundCount(state, nodes, "R1") < nodes.length) return "R1";
  if (roundCount(state, nodes, "R2") < nodes.length) return "R2";
  return "R3";
}

export function setRound(state: RoundsState, nodes: string[], round: Round, done: boolean): RoundsState {
  const topics = { ...(state.topics ?? {}) };
  const stamp = new Date().toISOString();
  for (const n of nodes) {
    const t = { ...(topics[n] ?? {}) };
    if (done) t[round] = t[round] ?? stamp;
    else delete t[round];
    topics[n] = t;
  }
  return { ...state, topics };
}

export { ROUNDS };
