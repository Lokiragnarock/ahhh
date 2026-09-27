// Pieces of the sync layer that both the browser and the server need.

// The sync key lives in this cookie once a device has opened `/?sync=<key>`.
// Anyone holding the key can read and write that progress, so treat the link
// like an "anyone with the link" doc: long, random, not your name.
export const SYNC_COOKIE = "sync_key";
export const SYNC_PARAM = "sync";

// Browsers cap cookie lifetime at 400 days; every visit pushes it out again,
// so a device you use stays linked indefinitely.
export const SYNC_COOKIE_MAX_AGE = 400 * 24 * 60 * 60;

export function isValidSyncKey(key: string | null | undefined): key is string {
  return typeof key === "string" && /^[A-Za-z0-9_-]{16,64}$/.test(key);
}

// localStorage keys that belong to the synced progress record. Anything else
// (including the sync bookkeeping itself) stays on the device. New subjects
// (e.g. "gmat.") get added here.
export const SYNCED_PREFIXES = ["tax.", "study-planner:"] as const;

export function isSyncedKey(key: string): boolean {
  return SYNCED_PREFIXES.some((p) => key.startsWith(p));
}

// Fired on window whenever a stored key changes in this tab, with the key as
// `detail`. Hooks listen to it so remote changes pulled in by sync re-render.
export const STORE_EVENT = "practice-store";

// One value in the synced record: the JSON-encoded localStorage string and
// the ms-epoch time it was last changed on whichever device changed it.
export interface SyncEntry {
  v: string | null; // null = deleted
  t: number;
}
export type SyncRecord = Record<string, SyncEntry>;

// Per-key last-write-wins. Studying happens on one device at a time, so two
// devices changing the same key between syncs is rare; when it happens the
// later change wins.
export function mergeRecords(a: SyncRecord, b: SyncRecord): SyncRecord {
  const out: SyncRecord = { ...a };
  for (const [k, e] of Object.entries(b)) {
    if (!out[k] || e.t > out[k].t) out[k] = e;
  }
  return out;
}

// Coarse "where" for the activity timeline: which kind of device was used.
export function deviceFromUserAgent(ua: string | null | undefined): string {
  if (!ua) return "unknown";
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/iPad/i.test(ua)) return "iPad";
  if (/Android/i.test(ua)) return /Mobile/i.test(ua) ? "Android phone" : "Android tablet";
  if (/Macintosh|Mac OS X/i.test(ua)) return "Mac";
  if (/Windows/i.test(ua)) return "Windows";
  if (/CrOS/i.test(ua)) return "Chromebook";
  if (/Linux/i.test(ua)) return "Linux";
  return "unknown";
}
