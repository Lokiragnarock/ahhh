import { NextRequest, NextResponse } from "next/server";
import { KV_ENABLED, kv } from "@/lib/sync/kv";

export const dynamic = "force-dynamic";

const NAMES_KEY = "ahhh:names";
const BACKUP_VERSION = 1;

// One entry per sync key discovered under `ahhh:u:*` (see src/lib/sync/server.ts
// for the live read/write path). There is no separate registry of sync keys,
// `ahhh:names` only covers people who joined the duel, so a full backup has to
// SCAN for every `ahhh:u:<key>:*` triplet instead of trusting one index.
interface BackupUserData {
  record: string | null;
  topics: Record<string, string>;
  log: string[];
}

interface BackupPayload {
  version: number;
  exportedAt: string;
  names: Record<string, string>;
  users: Record<string, BackupUserData>;
}

function checkSecret(req: NextRequest): NextResponse | null {
  const secret = process.env.BACKUP_SECRET;
  // Fail closed. If this env var is missing (fresh deploy, typo'd name), the
  // route must refuse rather than quietly serve everyone's data unprotected.
  if (!secret) {
    return NextResponse.json({ error: "BACKUP_SECRET is not configured" }, { status: 501 });
  }

  const fromQuery = req.nextUrl.searchParams.get("secret");
  const authHeader = req.headers.get("authorization");
  const fromHeader = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const provided = fromQuery || fromHeader;

  if (provided !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

async function scanKeys(pattern: string): Promise<string[]> {
  let cursor = "0";
  const keys: string[] = [];
  do {
    const [next, batch] = await kv<[string, string[]]>("SCAN", cursor, "MATCH", pattern, "COUNT", 200);
    cursor = next;
    keys.push(...batch);
  } while (cursor !== "0");
  return keys;
}

async function dumpBackup(): Promise<BackupPayload> {
  const [namesFlat, allKeys] = await Promise.all([
    kv<string[] | null>("HGETALL", NAMES_KEY),
    scanKeys("ahhh:u:*"),
  ]);

  const names: Record<string, string> = {};
  for (let i = 0; namesFlat && i < namesFlat.length; i += 2) names[namesFlat[i]] = namesFlat[i + 1];

  const userKeys = new Set<string>();
  for (const k of allKeys) {
    const m = k.match(/^ahhh:u:(.+):(record|topics|log)$/);
    if (m) userKeys.add(m[1]);
  }

  // A straggler write under a replaced key must not look like a live user.
  const live = (
    await Promise.all(
      Array.from(userKeys).map(async (k) => ((await kv<number>("EXISTS", `ahhh:revoked:${k}`)) === 1 ? null : k))
    )
  ).filter((k): k is string => k !== null);

  const users: Record<string, BackupUserData> = {};
  await Promise.all(
    live.map(async (userKey) => {
      const ns = `ahhh:u:${userKey}`;
      const [record, topicsFlat, log] = await Promise.all([
        kv<string | null>("GET", `${ns}:record`),
        kv<string[] | null>("HGETALL", `${ns}:topics`),
        kv<string[] | null>("LRANGE", `${ns}:log`, 0, -1),
      ]);
      const topics: Record<string, string> = {};
      for (let i = 0; topicsFlat && i < topicsFlat.length; i += 2) topics[topicsFlat[i]] = topicsFlat[i + 1];
      users[userKey] = { record: record ?? null, topics, log: log ?? [] };
    })
  );

  return { version: BACKUP_VERSION, exportedAt: new Date().toISOString(), names, users };
}

function isBackupPayload(data: unknown): data is BackupPayload {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (typeof d.version !== "number" || typeof d.exportedAt !== "string") return false;

  if (!d.names || typeof d.names !== "object") return false;
  if (!Object.values(d.names as Record<string, unknown>).every((v) => typeof v === "string")) return false;

  if (!d.users || typeof d.users !== "object") return false;
  for (const u of Object.values(d.users as Record<string, unknown>)) {
    if (!u || typeof u !== "object") return false;
    const user = u as Record<string, unknown>;
    if (user.record !== null && typeof user.record !== "string") return false;
    if (!user.topics || typeof user.topics !== "object") return false;
    if (!Object.values(user.topics as Record<string, unknown>).every((v) => typeof v === "string")) return false;
    if (!Array.isArray(user.log) || !user.log.every((v) => typeof v === "string")) return false;
  }
  return true;
}

async function restoreBackup(payload: BackupPayload) {
  const nameEntries = Object.entries(payload.names);
  if (nameEntries.length > 0) {
    await kv("DEL", NAMES_KEY);
    for (const [key, name] of nameEntries) await kv("HSET", NAMES_KEY, key, name);
  }

  for (const [userKey, data] of Object.entries(payload.users)) {
    const ns = `ahhh:u:${userKey}`;
    await Promise.all([kv("DEL", `${ns}:record`), kv("DEL", `${ns}:topics`), kv("DEL", `${ns}:log`)]);
    if (data.record !== null) await kv("SET", `${ns}:record`, data.record);
    for (const [slug, state] of Object.entries(data.topics)) await kv("HSET", `${ns}:topics`, slug, state);
    for (const entry of data.log) await kv("RPUSH", `${ns}:log`, entry);
  }
}

// Dumps the entire sync store (every user's record, topics and activity log,
// plus the duel names hash) as one downloadable JSON file.
export async function GET(req: NextRequest) {
  if (!KV_ENABLED) {
    return NextResponse.json({ error: "storage not configured" }, { status: 503 });
  }
  const authError = checkSecret(req);
  if (authError) return authError;

  const backup = await dumpBackup();
  const filename = `study-planner-backup-${backup.exportedAt.replace(/:/g, "-")}.json`;

  return new NextResponse(JSON.stringify(backup, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

// Body: the same shape GET produces. Restores it into Redis, overwriting
// whatever is currently there for each user key included in the payload.
export async function POST(req: NextRequest) {
  if (!KV_ENABLED) {
    return NextResponse.json({ error: "storage not configured" }, { status: 503 });
  }
  const authError = checkSecret(req);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // Validate the whole payload before writing anything. A restore that fails
  // halfway through would leave some users overwritten and others untouched,
  // which is worse than refusing the bad input outright.
  if (!isBackupPayload(body)) {
    return NextResponse.json({ error: "payload does not match backup shape" }, { status: 400 });
  }

  await restoreBackup(body);
  return NextResponse.json({ ok: true, users: Object.keys(body.users).length });
}
