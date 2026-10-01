import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
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
