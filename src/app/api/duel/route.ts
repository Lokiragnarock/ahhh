import { NextRequest, NextResponse } from "next/server";
import { getAllTopics } from "@/lib/vault";
import { currentSubject } from "@/lib/subject/server";
import { subjectLabel } from "@/lib/subject/shared";
import { roundCount, stateCounts } from "@/lib/rounds-core";
import type { RoundsState } from "@/lib/practice-types";
import { KV_ENABLED } from "@/lib/sync/kv";
import {
  currentSyncKey,
  generateSyncKey,
  loadAllNames,
  loadRecord,
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
// round completion — it just shows up here on the next load.
//
// Tradeoff: duel has no subject concept of its own (unlike the rest of the
// app, it's cross-device and cross-person by design), so "which subject's
// rounds to compare" is resolved from the CALLER's own current-subject
// cookie, not each entrant's. Two friends comparing Taxation progress both
// need their subject tab set to Taxation when they open /duel; if one has
// switched to a different subject, they'll see the leaderboard scored
// against that subject instead, with entrants who've never touched it
// showing zeros. This keeps the route simple and avoids inventing a
// separate "duel subject" the UI would have to expose.
export async function GET() {
  if (!KV_ENABLED) {
    return NextResponse.json({ configured: false, entries: [], totalTopics: 0, subject: null });
  }

  const subject = currentSubject();
  const roundsKey = `${subject}.practice.rounds.v1`;
  const [names, topics] = await Promise.all([loadAllNames(), getAllTopics(subject)]);
  const nodeIds = topics.map((t) => t.id);
  const myKey = currentSyncKey();

  const entries = await Promise.all(
    Object.entries(names).map(async ([key, name]) => {
      const record = await loadRecord(key);
      const rounds = parseRounds(record[roundsKey]?.v);
      const counts = stateCounts(rounds, nodeIds);
      return {
        name,
        isYou: key === myKey,
        r1: roundCount(rounds, nodeIds, "R1"),
        r2: roundCount(rounds, nodeIds, "R2"),
        r3: roundCount(rounds, nodeIds, "R3"),
        studied: counts.studied,
        mapped: counts.mapped,
        drilled: counts.drilled,
      };
    })
  );

  entries.sort((a, b) => b.drilled - a.drilled || b.mapped - a.mapped || b.studied - a.studied || a.name.localeCompare(b.name));

  return NextResponse.json({
    configured: true,
    entries,
    totalTopics: nodeIds.length,
    subject: { slug: subject, label: subjectLabel(subject) },
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

  let key = currentSyncKey();
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
