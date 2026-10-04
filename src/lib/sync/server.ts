import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { KV_ENABLED, kv } from "./kv";
import { isValidSyncKey, mergeRecords, SYNC_COOKIE, SyncRecord } from "./shared";
import type { TopicState } from "../study-types";

// Everything for one person lives under `ahhh:u:<sync key>:*`:
//   record — JSON SyncRecord mirroring the synced localStorage keys
//   topics — hash of note slug -> topic state (replaces frontmatter writes
//            on the deployed site, where the vault is read-only)
//   log    — append-only list of JSON activity events, for the timeline
const ns = (key: string) => `ahhh:u:${key}`;

// The caller's sync key, or null when this device has none (friends using the
// shared link) or storage isn't configured. Outside a request (build time)
// cookies() throws, which also means "no key".
export function currentSyncKey(): string | null {
  if (!KV_ENABLED) return null;
  try {
    const key = cookies().get(SYNC_COOKIE)?.value;
    return isValidSyncKey(key) ? key : null;
  } catch {
    return null;
  }
}

export async function loadRecord(key: string): Promise<SyncRecord> {
  const raw = await kv<string | null>("GET", `${ns(key)}:record`);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as SyncRecord;
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------- snapshots
// Two rolling server-side copies per person (`snap:1` newest, `snap:2` the one
// before), readable only through that person's own key. Taken before any
// write that would delete or shrink data, and at least every SNAP_EVERY_MS,
// so a bad push or a stale device can't leave the store with nothing to
// restore from. Equal copies never rotate, so snap:2 keeps an older distinct
// version instead of being overwritten by a duplicate.
const SNAP_EVERY_MS = 2 * 24 * 60 * 60 * 1000;
export const SNAP_SLOTS = [1, 2] as const;
export type SnapSlot = (typeof SNAP_SLOTS)[number];

export interface Snapshot {
  at: string; // ISO
  record: SyncRecord;
  topics: Record<string, string>;
}

export interface SnapshotInfo {
  slot: SnapSlot;
  at: string;
  keys: number;
  bytes: number;
}

async function loadSnapshot(key: string, slot: SnapSlot): Promise<Snapshot | null> {
  const raw = await kv<string | null>("GET", `${ns(key)}:snap:${slot}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Snapshot;
  } catch {
    return null;
  }
}

export async function listSnapshots(key: string): Promise<SnapshotInfo[]> {
  const out: SnapshotInfo[] = [];
  for (const slot of SNAP_SLOTS) {
    const raw = await kv<string | null>("GET", `${ns(key)}:snap:${slot}`);
    if (!raw) continue;
    try {
      const snap = JSON.parse(raw) as Snapshot;
      out.push({ slot, at: snap.at, keys: Object.keys(snap.record).length, bytes: raw.length });
    } catch {
      // unreadable copy: skip it rather than offer a restore that would fail
    }
  }
  return out;
}

async function rotateSnapshot(key: string, record: SyncRecord) {
  if (!Object.keys(record).length) return; // nothing worth keeping
  const newest = await loadSnapshot(key, 1);
  if (newest && JSON.stringify(newest.record) === JSON.stringify(record)) return;
  const topics = await loadTopicStates(key);
  const prev = await kv<string | null>("GET", `${ns(key)}:snap:1`);
  if (prev) await kv("SET", `${ns(key)}:snap:2`, prev);
  const snap: Snapshot = { at: new Date().toISOString(), record, topics };
  await kv("SET", `${ns(key)}:snap:1`, JSON.stringify(snap));
}

// True when applying `merged` over `current` would lose data: a key deleted,
// or a value that got much shorter (a stale device pushing a near-empty list).
function shrinks(current: SyncRecord, merged: SyncRecord): boolean {
  return Object.entries(current).some(([k, e]) => {
    if (e.v === null) return false;
    const next = merged[k]?.v;
    return next === null || next === undefined || (next !== e.v && next.length < e.v.length * 0.5);
  });
}

export async function mergeRecord(key: string, incoming: SyncRecord): Promise<SyncRecord> {
  const current = await loadRecord(key);
  const merged = mergeRecords(current, incoming);
  const newest = await loadSnapshot(key, 1);
  const stale = !newest || Date.now() - Date.parse(newest.at) >= SNAP_EVERY_MS;
  if (stale || shrinks(current, merged)) await rotateSnapshot(key, current);
  await kv("SET", `${ns(key)}:record`, JSON.stringify(merged));
  return merged;
}

// Puts a snapshot back as the live record. The current state is snapshotted
// first, so a restore is itself undoable. Every restored entry gets a fresh
// timestamp, otherwise devices would keep their newer local copies on the
// next pull and quietly undo it.
export async function restoreSnapshot(key: string, slot: SnapSlot): Promise<boolean> {
  const snap = await loadSnapshot(key, slot);
  if (!snap) return false;
  await rotateSnapshot(key, await loadRecord(key));
  const now = Date.now();
  const record: SyncRecord = {};
  for (const [k, e] of Object.entries(snap.record)) record[k] = { v: e.v, t: now };
  await kv("SET", `${ns(key)}:record`, JSON.stringify(record));
  await kv("DEL", `${ns(key)}:topics`);
  for (const [slug, state] of Object.entries(snap.topics)) await kv("HSET", `${ns(key)}:topics`, slug, state);
  return true;
}

export async function loadTopicStates(key: string): Promise<Record<string, TopicState>> {
  const flat = await kv<string[] | null>("HGETALL", `${ns(key)}:topics`);
  const out: Record<string, TopicState> = {};
  for (let i = 0; flat && i < flat.length; i += 2) out[flat[i]] = flat[i + 1] as TopicState;
  return out;
}

export async function saveTopicState(key: string, slug: string, state: TopicState) {
  await kv("HSET", `${ns(key)}:topics`, slug, state);
}

export interface ActivityEvent {
  at: string; // ISO
  type: string;
  device: string;
  [field: string]: unknown;
}

export async function appendActivity(key: string, event: ActivityEvent) {
  await kv("RPUSH", `${ns(key)}:log`, JSON.stringify(event));
}

export async function loadActivity(key: string): Promise<ActivityEvent[]> {
  const raw = await kv<string[] | null>("LRANGE", `${ns(key)}:log`, 0, -1);
  return (raw ?? []).flatMap((s) => {
    try {
      return [JSON.parse(s) as ActivityEvent];
    } catch {
      return [];
    }
  });
}

// ---------------------------------------------------------------- duel
// A single hash, `ahhh:names`, maps sync key -> display name. Whoever has a
// name in it shows up on the leaderboard; their progress comes straight out
// of their own synced record (the same `<subject>.practice.rounds.v1` blob
// synced by SyncAgent), so joining the duel needs no extra write path.
const NAMES_KEY = "ahhh:names";

export function generateSyncKey(): string {
  return randomBytes(16).toString("hex"); // 32 chars, well inside the 16-64 key format
}

export async function loadAllNames(): Promise<Record<string, string>> {
  const flat = await kv<string[] | null>("HGETALL", NAMES_KEY);
  const out: Record<string, string> = {};
  for (let i = 0; flat && i < flat.length; i += 2) out[flat[i]] = flat[i + 1];
  return out;
}

export async function setUserName(key: string, name: string) {
  await kv("HSET", NAMES_KEY, key, name);
}

// ---------------------------------------------------------------- reissue
// A sync link is the login, so "reissue" moves everything to a new key and
// kills the old one. Revoked keys leave a tombstone (1 year, longer than any
// cookie can live) so a device still holding the old link gets a 410 instead
// of silently starting a fresh empty record under it.
const REVOKED_TTL_S = 365 * 24 * 60 * 60;
const revokedKey = (key: string) => `ahhh:revoked:${key}`;

export async function isRevokedKey(key: string): Promise<boolean> {
  return (await kv<number>("EXISTS", revokedKey(key))) === 1;
}

// The guard for routes that read or write a person's data: their key, null when
// this device isn't syncing, or a ready-made 410 when the key was replaced.
export async function requireLiveKey(): Promise<string | NextResponse | null> {
  const key = currentSyncKey();
  if (!key) return null;
  if (await isRevokedKey(key)) return NextResponse.json({ error: "link replaced" }, { status: 410 });
  return key;
}

async function scanKeys(pattern: string): Promise<string[]> {
  const found: string[] = [];
  let cursor = "0";
  do {
    const [next, batch] = await kv<[string, string[]]>("SCAN", cursor, "MATCH", pattern, "COUNT", 200);
    cursor = String(next);
    found.push(...batch);
  } while (cursor !== "0");
  return [...new Set(found)]; // SCAN may repeat keys
}

// COPY keeps type and TTL in one command (Redis 6.2+). Older servers reject it,
// so fall back to rebuilding the three shapes this app uses.
async function copyKey(src: string, dst: string) {
  try {
    await kv("COPY", src, dst, "REPLACE");
    return;
  } catch {
    // fall through to the manual copy
  }
  const type = await kv<string>("TYPE", src);
  const ttl = await kv<number>("PTTL", src);
  await kv("DEL", dst);
  if (type === "string") {
    const v = await kv<string | null>("GET", src);
    if (v !== null) await kv("SET", dst, v);
  } else if (type === "hash") {
    const flat = (await kv<string[]>("HGETALL", src)) ?? [];
    for (let i = 0; i < flat.length; i += 2) await kv("HSET", dst, flat[i], flat[i + 1]);
  } else if (type === "list") {
    const items = (await kv<string[]>("LRANGE", src, 0, -1)) ?? [];
    for (const item of items) await kv("RPUSH", dst, item);
  } else if (type !== "none") {
    throw new Error(`cannot copy ${type} key`);
  }
  if (ttl > 0) await kv("PEXPIRE", dst, ttl);
}

// Moves every `ahhh:u:<old>:*` key (record, snap:1/2 strings, topics hash, log
// list) and the leaderboard name from oldKey to newKey. Copy, verify, then
// tombstone and delete, so a failure before the tombstone leaves the old key
// fully working (the half-made copies are cleaned up).
export async function rekeyUser(oldKey: string, newKey: string): Promise<void> {
  const prefix = `${ns(oldKey)}:`;
  const srcs = await scanKeys(`${prefix}*`);
  const dsts = srcs.map((k) => `${ns(newKey)}:${k.slice(prefix.length)}`);
  const name = await kv<string | null>("HGET", NAMES_KEY, oldKey);

  try {
    for (let i = 0; i < srcs.length; i++) await copyKey(srcs[i], dsts[i]);
    if (name !== null) await kv("HSET", NAMES_KEY, newKey, name);

    for (const dst of dsts) {
      if ((await kv<number>("EXISTS", dst)) !== 1) throw new Error("copy verification failed");
    }
    if (name !== null && (await kv<string | null>("HGET", NAMES_KEY, newKey)) !== name) {
      throw new Error("name copy verification failed");
    }
    await kv("SET", revokedKey(oldKey), new Date().toISOString(), "EX", REVOKED_TTL_S);
  } catch (err) {
    // old key untouched; drop the partial copy
    await Promise.allSettled([...dsts.map((d) => kv("DEL", d)), kv("HDEL", NAMES_KEY, newKey)]);
    throw err;
  }

  // New key is complete and the old one is tombstoned. A failure from here is
  // only leftover garbage under a dead key, so it doesn't fail the reissue.
  try {
    if (srcs.length) await kv("DEL", ...srcs);
    await kv("HDEL", NAMES_KEY, oldKey);
  } catch (err) {
    console.error("rekeyUser: old key cleanup failed", err);
  }
}
