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

export async function mergeRecord(key: string, incoming: SyncRecord): Promise<SyncRecord> {
  const merged = mergeRecords(await loadRecord(key), incoming);
  await kv("SET", `${ns(key)}:record`, JSON.stringify(merged));
  return merged;
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
