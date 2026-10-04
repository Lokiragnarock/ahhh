import { NextRequest, NextResponse } from "next/server";
import { getAllTopics, listSubjects } from "@/lib/vault";
import { roundCount, stateCounts } from "@/lib/rounds-core";
import type { RoundsState } from "@/lib/practice-types";
import { KV_ENABLED } from "@/lib/sync/kv";
import {
  currentSyncKey,
  generateSyncKey,
  loadAllNames,
  loadRecord,
  requireLiveKey,
  setUserName,
} from "@/lib/sync/server";
import { SYNC_COOKIE, SYNC_COOKIE_MAX_AGE } from "@/lib/sync/shared";

export const dynamic = "force-dynamic";

function parseRounds(raw: string | null | undefined): RoundsState {
  if (!raw) return { topics: {} };
  try {
    const parsed = JSON.parse(raw) as RoundsState;
    return parsed && typeof parsed === "object" && parsed.topics ? parsed : { topics: {} };
  } catch {
    return { topics: {} };
  }
}

// The leaderboard needs no key of its own: everyone in `ahhh:names` gets
// scored straight off the same synced record SyncAgent already keeps current
// (`<subject>.practice.rounds.v1`), so there's nothing extra to write on
// round completion. Every subject is scored, and the headline ranking is the
// sum across all of them; the per-subject boards ride along for the UI's
// collapsible breakdown.
interface Score {
  r1: number;
  r2: number;
  r3: number;
  studied: number;
  mapped: number;
  drilled: number;
}

const rank = (a: { drilled: number; mapped: number; studied: number; name: string }, b: typeof a) =>
  b.drilled - a.drilled || b.mapped - a.mapped || b.studied - a.studied || a.name.localeCompare(b.name);

export async function GET() {
  if (!KV_ENABLED) {
    return NextResponse.json({ configured: false, entries: [], totalTopics: 0, subjects: [] });
  }

  const subjects = await listSubjects("ahh");
  const [names, topicsBySubject] = await Promise.all([
    loadAllNames(),
    Promise.all(subjects.map((s) => getAllTopics(s.slug))),
  ]);
  const nodeIdsBySubject = topicsBySubject.map((ts) => ts.map((t) => t.id));
  const myKey = currentSyncKey();

  const people = await Promise.all(
    Object.entries(names).map(async ([key, name]) => {
      const record = await loadRecord(key);
      const perSubject: Score[] = subjects.map((s, i) => {
        const rounds = parseRounds(record[`${s.slug}.practice.rounds.v1`]?.v);
        const nodeIds = nodeIdsBySubject[i];
        const counts = stateCounts(rounds, nodeIds);
        return {
          r1: roundCount(rounds, nodeIds, "R1"),
          r2: roundCount(rounds, nodeIds, "R2"),
          r3: roundCount(rounds, nodeIds, "R3"),
          studied: counts.studied,
          mapped: counts.mapped,
          drilled: counts.drilled,
        };
      });
      return { name, isYou: key === myKey, perSubject };
    })
  );

  const sum = (list: Score[]): Score =>
    list.reduce(
      (acc, x) => ({
        r1: acc.r1 + x.r1,
        r2: acc.r2 + x.r2,
        r3: acc.r3 + x.r3,
        studied: acc.studied + x.studied,
        mapped: acc.mapped + x.mapped,
        drilled: acc.drilled + x.drilled,
      }),
      { r1: 0, r2: 0, r3: 0, studied: 0, mapped: 0, drilled: 0 }
    );

  const entries = people.map((p) => ({ name: p.name, isYou: p.isYou, ...sum(p.perSubject) })).sort(rank);

  const bySubject = subjects.map((s, i) => ({
    slug: s.slug,
    label: s.label,
    totalTopics: nodeIdsBySubject[i].length,
    entries: people
      .map((p) => ({ name: p.name, isYou: p.isYou, ...p.perSubject[i] }))
      .sort(rank),
  }));

  return NextResponse.json({
    configured: true,
    entries,
    totalTopics: nodeIdsBySubject.reduce((n, ids) => n + ids.length, 0),
    subjects: bySubject,
  });
}

// Body: { name: string }. Registers (or renames) the caller in the duel. If
// this device has no sync key yet, mints one and links it so the leaderboard
// has something to read progress from — same key the sync link (?sync=<key>)
// would set, so opening that URL on another device joins that device too.
export async function POST(req: NextRequest) {
  if (!KV_ENABLED) {
    return NextResponse.json({ error: "duel storage not configured" }, { status: 503 });
  }

  let body: { name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 40) : "";
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  let key = await requireLiveKey();
  if (key instanceof NextResponse) return key;
  const isNewKey = !key;
  if (!key) key = generateSyncKey();

  await setUserName(key, name);

  const res = NextResponse.json({ ok: true, key, syncHref: `/?sync=${key}` });
  if (isNewKey) {
    res.cookies.set(SYNC_COOKIE, key, {
      httpOnly: true,
      secure: req.nextUrl.protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: SYNC_COOKIE_MAX_AGE,
    });
  }
  return res;
}
