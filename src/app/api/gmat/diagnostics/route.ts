import { NextRequest, NextResponse } from "next/server";
import { currentSyncKey } from "@/lib/sync/server";
import { db } from "@/lib/gmat/db";
import { resolvePlayer, type Player } from "@/lib/gmat/players";
import { getDiagnosticPool } from "@/lib/gmat/questions";
import {
  lookupPercentile,
  lookupSectionPercentile,
  SECTION_KEYS,
  SECTION_LABELS,
  SECTION_MAX,
  SECTION_MIN,
  totalScore,
  type SectionKey,
} from "@/lib/gmat/scoring";

export const dynamic = "force-dynamic";

// The caller's player, or the response to send instead: 503 when there is no
// key/database, 409 {onboard} when this device has no player yet.
async function playerOrReply(): Promise<{ reply: NextResponse; player?: undefined } | { player: Player; reply?: undefined }> {
  const key = currentSyncKey();
  if (!key || !process.env.DATABASE_URL) {
    return { reply: NextResponse.json({ error: "not configured" }, { status: 503 }) };
  }
  try {
    const player = await resolvePlayer(key);
    if (!player) return { reply: NextResponse.json({ onboard: true }, { status: 409 }) };
    return { player };
  } catch {
    return { reply: NextResponse.json({ error: "database unavailable" }, { status: 503 }) };
  }
}

// The question pool the in-app sim draws from.
export async function GET() {
  const r = await playerOrReply();
  if (r.reply) return r.reply;
  return NextResponse.json({ questions: await getDiagnosticPool() });
}

const isScaled = (v: unknown): v is number =>
  typeof v === "number" && Number.isInteger(v) && v >= SECTION_MIN && v <= SECTION_MAX;

// 'YYYY-MM-DD', a real calendar day, not in the future.
function validPastDate(s: unknown, today: string): s is string {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s && s <= today;
}

// Body: { source?: 'in-app' | 'official', sections: { QR, VR, DI }, takenOn?, timeSeconds? }.
// Only the three 60-90 section scores are trusted; the total and every
// percentile are recomputed here. An in-app sitting is dated by the server's
// day; an official one by the date typed in (it is a past sitting).
// (player, day, source) is unique, so re-recording the same day updates.
export async function POST(req: NextRequest) {
  const r = await playerOrReply();
  if (r.reply) return r.reply;

  let body: { source?: unknown; sections?: Record<string, unknown>; takenOn?: unknown; timeSeconds?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const source = body.source === "official" ? "official" : "in-app";
  const secs = body.sections ?? {};
  for (const k of SECTION_KEYS) {
    if (!isScaled(secs[k])) {
      return NextResponse.json({ error: `${k} must be a whole number from ${SECTION_MIN} to ${SECTION_MAX}` }, { status: 400 });
    }
  }
  const scaled = secs as Record<SectionKey, number>;
  const today = new Date().toISOString().slice(0, 10);
  if (source === "official" && !validPastDate(body.takenOn, today)) {
    return NextResponse.json({ error: "takenOn must be a past date (YYYY-MM-DD)" }, { status: 400 });
  }
  const takenOn = source === "official" ? (body.takenOn as string) : today;
  const seconds = typeof body.timeSeconds === "number" && body.timeSeconds >= 0 ? Math.round(body.timeSeconds) : null;

  const total = totalScore(scaled.QR, scaled.VR, scaled.DI);
  const percentile = lookupPercentile(total);

  try {
    // One statement: the sitting upsert and its three section rows.
    await db().query(
      `with d as (
         insert into diagnostics (player_id, source, taken_on, total_score, percentile, time_seconds)
         values ($1, $2, $3::date, $4::int, $5::int, $6::int)
         on conflict (player_id, taken_on, source) do update
           set total_score = excluded.total_score, percentile = excluded.percentile,
               time_seconds = excluded.time_seconds
         returning id
       )
       insert into diagnostic_sections (diagnostic_id, section, scaled_score, percentile)
       select d.id, v.section, v.scaled, v.pct
         from d, (values ($7::text, $8::int, $9::int), ($10::text, $11::int, $12::int), ($13::text, $14::int, $15::int))
              as v(section, scaled, pct)
       on conflict (diagnostic_id, section) do update
         set scaled_score = excluded.scaled_score, percentile = excluded.percentile`,
      [
        r.player.id,
        source,
        takenOn,
        total,
        percentile,
        seconds,
        ...SECTION_KEYS.flatMap((k) => [SECTION_LABELS[k], scaled[k], lookupSectionPercentile(k, scaled[k])]),
      ]
    );
    return NextResponse.json({ ok: true, totalScore: total, percentile });
  } catch {
    return NextResponse.json({ error: "could not record" }, { status: 500 });
  }
}
