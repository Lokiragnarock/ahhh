// The Next-block chooser behind the GMAT home card. Pure: no I/O, no clock
// beyond the `now` argument, so it can be unit-tested with plain fixtures.
// Order (PRD 3.1): due error-book retries, then the weakest high-leverage
// node whose prerequisites are studied, then the full-length diagnostic.
import { topicStateFromRounds } from "../rounds-core";
import type { ErrorEntry, RoundsState } from "../practice-types";
import type { TopicState } from "../study-types";

export interface BlockNode {
  id: string;
  slug: string;
  subject: string;
  title: string;
  examFocus: boolean;
  weight: number;
  deps: string[];
  state: TopicState; // synced/vault state; rounds can only raise it
}

export type NextBlock =
  | { kind: "node"; node: BlockNode; reason: string }
  | { kind: "diagnostic"; reason: string };

// Exam-focus nodes in the order Diagnostic 1 ranked them.
export const STAR_ORDER = ["D-1", "D-2", "Q-3", "Q-4", "Q-10", "V-2", "V-3", "V-4", "S-3"];

const STAR_REASON: Record<string, string> = {
  "D-1": "DS method: your weakest section's root cause",
  "D-2": "DS traps: the next layer of your weakest section",
  "Q-3": "Rates/Ratios/Percent: Quant's clearest gap at 22nd pct",
  "Q-4": "Ratios and mixtures: the same Quant gap, second half",
  "Q-10": "Rates and work: where the Quant gap costs most time",
  "V-2": "CR core: assumption, strengthen, weaken",
  "V-3": "CR second tier: evaluate, boldface, flaw",
  "V-4": "CR inference and discrepancy questions",
  "S-3": "End-of-section pacing: where time is being lost",
};

const SECTION_OF_SUBJECT: Record<string, string> = {
  "gmat-quant": "Quant",
  "gmat-verbal": "Verbal",
  "gmat-di": "Data Insights",
  "gmat-strategy": "Strategy",
};

const DUE_AFTER_DAYS = 2;
const RANK: Record<TopicState, number> = { unstudied: 0, studied: 1, mapped: 2, drilled: 3 };
const natural = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });

export interface ChooserInput {
  nodes: BlockNode[];
  rounds: Record<string, RoundsState>; // by subject
  errors: Pick<ErrorEntry, "node" | "status" | "createdAt">[];
  // Scaled points still needed per subject (from the latest diagnostic's plan).
  sectionGap: Record<string, number>;
  now?: number;
}

export function chooseNextBlock({ nodes, rounds, errors, sectionGap, now = Date.now() }: ChooserInput): NextBlock {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const stateOf = (n: BlockNode): TopicState => {
    const fromRounds = topicStateFromRounds(rounds[n.subject] ?? { topics: {} }, n.id);
    return RANK[fromRounds] > RANK[n.state] ? fromRounds : n.state;
  };
  const sectionOf = (n: BlockNode) => SECTION_OF_SUBJECT[n.subject] ?? n.subject;

  // 1. Due retries: unresolved misses older than two days, most misses first.
  const cutoff = now - DUE_AFTER_DAYS * 86400000;
  const due = new Map<string, { count: number; oldest: string }>();
  for (const e of errors) {
    if (e.status === "mastered" || !byId.has(e.node) || Date.parse(e.createdAt) > cutoff) continue;
    const d = due.get(e.node);
    due.set(e.node, { count: (d?.count ?? 0) + 1, oldest: d && d.oldest < e.createdAt ? d.oldest : e.createdAt });
  }
  const worst = Array.from(due.entries()).sort(
    ([, a], [, b]) => b.count - a.count || a.oldest.localeCompare(b.oldest)
  )[0];
  if (worst) {
    const [id, { count }] = worst;
    return {
      kind: "node",
      node: byId.get(id)!,
      reason: `${count} ${count === 1 ? "miss" : "misses"} from ${id} ${count === 1 ? "is" : "are"} due for a retry`,
    };
  }

  // 2. Lowest band, highest leverage. A node whose prerequisite is unstudied
  // gives way to that prerequisite.
  const todo = nodes.filter((n) => stateOf(n) !== "drilled");
  const ranked = STAR_ORDER.map((id) => byId.get(id)).filter((n): n is BlockNode => !!n && n.examFocus);
  const extra = todo.filter((n) => n.examFocus && !ranked.includes(n)).sort((a, b) => natural(a.id, b.id));
  const star = [...ranked, ...extra].filter((n) => todo.includes(n));
  const rest = todo
    .filter((n) => !star.includes(n))
    .sort(
      (a, b) =>
        (sectionGap[b.subject] ?? 0) - (sectionGap[a.subject] ?? 0) || b.weight - a.weight || natural(a.id, b.id)
    );

  for (const n of [...star, ...rest]) {
    const base = firstUnstudiedDep(n, byId, stateOf);
    const pick = base ?? n;
    const own = STAR_REASON[pick.id];
    const reason = base
      ? `${base.id} comes first: ${n.id} builds on it`
      : own ??
        (stateOf(pick) === "unstudied"
          ? `Highest-weight unstudied topic in ${sectionOf(pick)}`
          : `Studied but not drilled yet, in ${sectionOf(pick)}`);
    return { kind: "node", node: pick, reason };
  }

  // 3. Everything drilled: re-measure.
  return { kind: "diagnostic", reason: "Every topic is drilled. Re-measure with a full-length diagnostic." };
}

// Walks prerequisites depth-first; the visited set keeps a dependency cycle
// in the notes from looping.
function firstUnstudiedDep(
  n: BlockNode,
  byId: Map<string, BlockNode>,
  stateOf: (n: BlockNode) => TopicState,
  seen = new Set<string>()
): BlockNode | null {
  seen.add(n.id);
  for (const id of n.deps) {
    const d = byId.get(id);
    if (!d || seen.has(id) || stateOf(d) !== "unstudied") continue;
    return firstUnstudiedDep(d, byId, stateOf, seen) ?? d;
  }
  return null;
}
