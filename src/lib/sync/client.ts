"use client";

import { deviceFromUserAgent, isSyncedKey, STORE_EVENT, SyncRecord } from "./shared";

// Passive sync: localStorage stays the working copy on every device. Every
// local write is timestamped; changes are pushed a moment later, and the
// record is pulled whenever a page opens or the tab comes back into view.
// Devices without a sync key get a 204 from /api/sync and never push.

const META_KEY = "sync.meta.v1"; // localStorage key -> ms of its last change
const PUSH_DELAY_MS = 2000;

export const REVOKED_EVENT = "sync-revoked";

let enabled = false;
let revoked = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
const dirty = new Set<string>();

function readMeta(): Record<string, number> {
  try {
    return JSON.parse(window.localStorage.getItem(META_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeMeta(meta: Record<string, number>) {
  try {
    window.localStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch {
    // storage full or unavailable
  }
}

export function notifyStore(key: string) {
  window.dispatchEvent(new CustomEvent(STORE_EVENT, { detail: key }));
}

// The one way app code writes a stored key (`raw` is the JSON string, or null
// to delete). No-ops when nothing changed, so re-saving an identical value on
// page load never makes a stale device look newer than the synced copy.
export function setLocal(key: string, raw: string | null) {
  try {
    if (window.localStorage.getItem(key) === raw) return;
    if (raw === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, raw);
  } catch {
    return; // storage full or unavailable
  }
  if (!isSyncedKey(key)) return;
  const meta = readMeta();
  meta[key] = Date.now();
  writeMeta(meta);
  dirty.add(key);
  schedulePush();
}

export function currentDevice(): string {
  return deviceFromUserAgent(typeof navigator === "undefined" ? null : navigator.userAgent);
}

// Take every remote entry newer than what this device has.
function applyRemote(remote: SyncRecord) {
  const meta = readMeta();
  const changed: string[] = [];
  for (const [key, entry] of Object.entries(remote)) {
    if (!isSyncedKey(key) || entry.t <= (meta[key] ?? 0)) continue;
    try {
      if (entry.v === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, entry.v);
    } catch {
      continue;
    }
    meta[key] = entry.t;
    dirty.delete(key);
    changed.push(key);
  }
  writeMeta(meta);
  changed.forEach(notifyStore);
}

// Local entries the remote copy is missing or has older. Data written before
// this device ever synced has no timestamp: it's uploaded only if the remote
// has nothing for that key (the first synced device seeds the record), and
// otherwise the remote copy wins.
function outgoing(remote: SyncRecord): SyncRecord {
  const meta = readMeta();
  const keys = new Set(Object.keys(meta).filter(isSyncedKey));
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && isSyncedKey(k)) keys.add(k);
  }
  const now = Date.now();
  const out: SyncRecord = {};
  keys.forEach((key) => {
    let t = meta[key];
    if (t === undefined) {
      if (remote[key]) return;
      t = meta[key] = now;
    }
    if (t > (remote[key]?.t ?? 0)) out[key] = { v: window.localStorage.getItem(key), t };
  });
  writeMeta(meta);
  return out;
}

// 410 = the link was replaced on another device: stop syncing and say so.
function markRevoked() {
  enabled = false;
  revoked = true;
  dirty.clear();
  window.dispatchEvent(new Event(REVOKED_EVENT));
}

export function isRevoked() {
  return revoked;
}

async function send(record: SyncRecord, keepalive = false) {
  const res = await fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ record }),
    keepalive,
  });
  if (res.status === 410) return markRevoked();
  if (res.status !== 200) return;
  applyRemote(((await res.json()) as { record: SyncRecord }).record);
}

export async function pull() {
  try {
    const res = await fetch("/api/sync", { cache: "no-store" });
    if (res.status === 410) return markRevoked();
    enabled = res.status === 200;
    if (!enabled) return;
    const { record } = (await res.json()) as { record: SyncRecord };
    applyRemote(record);
    const up = outgoing(record);
    if (Object.keys(up).length) await send(up);
    dirty.clear();
  } catch {
    // offline: local copy keeps working, next pull catches up
  }
}

function schedulePush() {
  if (!enabled) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => void flush(), PUSH_DELAY_MS);
}

export async function flush(keepalive = false) {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = null;
  if (!enabled || dirty.size === 0) return;
  const meta = readMeta();
  const record: SyncRecord = {};
  dirty.forEach((key) => {
    record[key] = { v: window.localStorage.getItem(key), t: meta[key] ?? Date.now() };
  });
  dirty.clear();
  try {
    await send(record, keepalive);
  } catch {
    Object.keys(record).forEach((k) => dirty.add(k)); // retry on next change or pull
  }
}
