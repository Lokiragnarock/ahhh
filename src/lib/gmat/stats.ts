import { db } from "./db";
import {
  derivePlan,
  isInterpolatedTotal,
  lookupPercentile,
  minTotalForPercentile,
  PERCENTILE_COHORT,
  requiredSectionSum,
  sectionKeyFromLabel,
  type SectionKey,
  type TargetPlan,
} from "./scoring";
import { nodesOfTopic } from "./nodes";

// Reads behind /gmat/status and /gmat/versus. Server-only.
//
// UNITS: a diagnostic is scaled points (60-90 sections, 205-805 total). Tests
// are quiz accuracy, a percentage. The two are never added or put in one
// column; test figures are "pp" (percentage points), never "points".

export interface Sitting {
  id: string;
  source: "official" | "in-app";
  takenOn: string;
  totalScore: number;
  percentile: number;
  sections: { key: SectionKey; scaled: number; percentile: number | null }[];
}

export interface Standing {
  sitting: Sitting;
  plan: TargetPlan | null;
  // Scaled points still needed: required section sum minus the sitting's sum.
  scaledNeeded: number | null;
  targetPercentileFloor: number | null;
  targetInterpolated: boolean;
  cohort: string;
}

interface SittingRow {
  id: string;
  source: "official" | "in-app";
  taken_on: string;
  total_score: number;
  percentile: number | null;
}

// The player's most recent diagnostic. taken_on is cast to text so a `date`
// does not become a Date at local midnight and render a day off.
export async function latestSitting(playerId: string): Promise<Sitting | null> {
  const sql = db();
  const rows = (await sql.query(
    `select id, source, taken_on::text as taken_on, total_score, percentile
       from diagnostics where player_id = $1
      order by taken_on desc, created_at desc limit 1`,
    [playerId]
  )) as SittingRow[];
  const r = rows[0];
  if (!r) return null;
  const secs = (await sql.query(
    "select section, scaled_score, percentile from diagnostic_sections where diagnostic_id = $1",
    [r.id]
  )) as { section: string; scaled_score: number; percentile: number | null }[];
  const sections: Sitting["sections"] = [];
  for (const s of secs) {
    const key = sectionKeyFromLabel(s.section);
    if (key) sections.push({ key, scaled: s.scaled_score, percentile: s.percentile });
  }
  return {
    id: r.id,
    source: r.source,
    takenOn: r.taken_on,
    totalScore: r.total_score,
    percentile: r.percentile ?? lookupPercentile(r.total_score),
    sections,
  };
}

// Part A. The target comes from profiles.target_percentile alone, resolved to
// a score at read time (target_total is stale and ignored).
export async function standing(playerId: string): Promise<Standing | null> {
  const sitting = await latestSitting(playerId);
  if (!sitting) return null;
  const prof = (await db().query("select target_percentile from profiles where id = $1", [playerId])) as {
    target_percentile: number | null;
  }[];
  const floor = prof[0]?.target_percentile ?? null;
  const targetTotal = floor === null ? null : minTotalForPercentile(floor);

  const current: Partial<Record<SectionKey, number>> = {};
  for (const s of sitting.sections) current[s.key] = s.scaled;
  const full = current.QR !== undefined && current.VR !== undefined && current.DI !== undefined;

  const plan = targetTotal !== null && full ? derivePlan(current as Record<SectionKey, number>, targetTotal) : null;
  const scaledNeeded =
    targetTotal !== null && full
      ? Math.max(0, requiredSectionSum(targetTotal) - (current.QR! + current.VR! + current.DI!))
      : null;
  return {
    sitting,
    plan,
    scaledNeeded,
    targetPercentileFloor: floor,
    targetInterpolated: targetTotal !== null && isInterpolatedTotal(targetTotal),
    cohort: PERCENTILE_COHORT,
  };
}

// ---------------------------------------------------------------- Part B

// Below this many sessions the first and recent windows share rows, so the
// movement would partly measure a sitting against itself and is withheld.
export const MIN_SESSIONS_FOR_MOVEMENT = 10;
export const RECENT_WINDOW = 5;

export interface TopicStat {
  topic: string;
  section: string;
  // Planner nodes that practise this topic (several nodes can share one).
  nodes: string[];
  sessions: number;
  recentMedianPct: number | null;
  // Percentage points, recent window average minus first window average.
  movementPp: number | null;
  movementReliable: boolean;
}

interface TopicRow {
  player_id: string;
  topic: string;
  section: string;
  sessions: number;
  recent_median: string | number | null;
  first_avg: string | number | null;
  recent_avg: string | number | null;
}

const num = (v: string | number | null): number | null => {
  if (v === null) return null;
  const n = typeof v === "number" ? v : Number.parseFloat(v);
  return Number.isFinite(n) ? n : null;
};
const round1 = (v: number | null): number | null => (v === null ? null : Math.round(v * 10) / 10);

// Per-topic ground covered, one row per player and topic. Tests are stored
// per topic, not per node, so nodes that share a topic share a row.
async function topicRows(playerIds: string[]): Promise<TopicRow[]> {
  return (await db().query(
    `with graded as (
       select t.player_id, tp.name as topic, tp.section,
              t.score::numeric / t.total * 100 as pct,
              row_number() over (partition by t.player_id, t.topic_id order by t.created_at desc, t.id desc) as rn_recent,
              row_number() over (partition by t.player_id, t.topic_id order by t.created_at asc,  t.id asc)  as rn_first,
              count(*) over (partition by t.player_id, t.topic_id) as sessions
         from tests t join topics tp on tp.id = t.topic_id
        where t.player_id = any($1::uuid[]) and t.pending_review = false and t.total > 0
          and tp.exam_type = 'gmat'
     )
     select player_id, topic, section, max(sessions)::int as sessions,
            percentile_cont(0.5) within group (order by pct) filter (where rn_recent <= $2) as recent_median,
            avg(pct) filter (where rn_first  <= $2) as first_avg,
            avg(pct) filter (where rn_recent <= $2) as recent_avg
       from graded group by player_id, topic, section
      order by sessions desc, topic asc`,
    [playerIds, RECENT_WINDOW]
  )) as TopicRow[];
}

function toStat(r: TopicRow): TopicStat {
  const first = num(r.first_avg);
  const recent = num(r.recent_avg);
  return {
    topic: r.topic,
    section: r.section,
    nodes: nodesOfTopic(r.topic),
    sessions: Number(r.sessions),
    recentMedianPct: round1(num(r.recent_median)),
    movementPp: first === null || recent === null ? null : round1(recent - first),
    movementReliable: Number(r.sessions) >= MIN_SESSIONS_FOR_MOVEMENT,
  };
}

export async function groundCovered(playerId: string): Promise<TopicStat[]> {
  return (await topicRows([playerId])).map(toStat);
}

// ---------------------------------------------------------------- Versus

export interface VersusPlayer {
  id: string;
  name: string;
  isOwner: boolean;
  tests: number;
  latestTotal: number | null;
  topics: TopicStat[];
}

export interface Versus {
  players: VersusPlayer[];
  // One row per test number n; each player's accuracy % on their nth test.
  series: Record<string, number | null>[];
  // Players with at least one test (the chart needs two of them).
  withTests: number;
}

export async function versus(): Promise<Versus> {
  const sql = db();
  const profs = (await sql.query(
    `select id, display_name, role from profiles
      where 'gmat' = any(tracks) order by (role = 'owner') desc, created_at asc`
  )) as { id: string; display_name: string; role: string }[];
  const ids = profs.map((p) => p.id);
  if (ids.length === 0) return { players: [], series: [], withTests: 0 };

  const [tops, totals, tests] = await Promise.all([
    topicRows(ids),
    (async () =>
      (await sql.query(
        `select distinct on (player_id) player_id, total_score from diagnostics
          where player_id = any($1::uuid[]) order by player_id, taken_on desc, created_at desc`,
        [ids]
      )) as { player_id: string; total_score: number }[])(),
    (async () =>
      (await sql.query(
      `select player_id, (score::numeric / total * 100)::float8 as pct,
              row_number() over (partition by player_id order by created_at, id)::int as n
         from tests
        where player_id = any($1::uuid[]) and pending_review = false and total > 0
        order by n`,
      [ids]
    )) as { player_id: string; pct: number; n: number }[])(),
  ]);

  const players: VersusPlayer[] = profs.map((p) => ({
    id: p.id,
    name: p.display_name,
    isOwner: p.role === "owner",
    tests: tests.filter((t) => t.player_id === p.id).length,
    latestTotal: totals.find((t) => t.player_id === p.id)?.total_score ?? null,
    topics: tops.filter((t) => t.player_id === p.id).map(toStat),
  }));

  const maxN = tests.reduce((m, t) => Math.max(m, t.n), 0);
  const series: Versus["series"] = [];
  for (let n = 1; n <= maxN; n++) {
    const row: Record<string, number | null> = { n };
    for (const p of players) {
      const t = tests.find((x) => x.player_id === p.id && x.n === n);
      row[p.id] = t ? Math.round(t.pct * 10) / 10 : null;
    }
    series.push(row);
  }
  return { players, series, withTests: players.filter((p) => p.tests > 0).length };
}
