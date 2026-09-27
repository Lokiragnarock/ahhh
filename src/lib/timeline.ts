import type { Attempt, BlockLog, ErrorEntry } from "./practice-types";
import { dayKey } from "./practice-store";

// Turns the practice logs into "when, how much, where" for the timeline.
// Time on task is the union of study blocks and test attempts, so a test
// taken inside a block isn't counted twice.

export interface TopicEvent {
  at: string;
  type: "topic-state";
  device: string;
  slug: string;
  from: string;
  to: string;
}

interface Span {
  start: number;
  end: number;
  device: string;
}

export interface Session {
  start: number;
  end: number;
  minutes: number;
}

const NO_DEVICE = "Before tracking";
const MAX_TEST_MS = 4 * 3600000; // a test left open overnight shouldn't count as a day of study

function spans(blocks: BlockLog[], attempts: Attempt[]): Span[] {
  const out: Span[] = [];
  for (const b of blocks) {
    const start = Date.parse(b.startedAt);
    if (!Number.isNaN(start) && b.minutes > 0) out.push({ start, end: start + b.minutes * 60000, device: b.device ?? NO_DEVICE });
  }
  for (const a of attempts) {
    const start = Date.parse(a.date);
    const ms = Math.min(a.durationSec * 1000, MAX_TEST_MS);
    if (!Number.isNaN(start) && ms > 0) out.push({ start, end: start + ms, device: a.device ?? NO_DEVICE });
  }
  return out.sort((x, y) => x.start - y.start);
}

// Overlapping or back-to-back (within 10 min) spans become one sitting.
function merge(list: Span[], gapMs = 10 * 60000): Session[] {
  const out: Session[] = [];
  for (const s of list) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end + gapMs) {
      last.minutes += Math.max(0, s.end - Math.max(s.start, last.end)) / 60000;
      last.end = Math.max(last.end, s.end);
    } else {
      out.push({ start: s.start, end: s.end, minutes: (s.end - s.start) / 60000 });
    }
  }
  return out;
}

// Exact union (no gap bridging) for minute totals.
function union(list: Span[]): [number, number][] {
  const out: [number, number][] = [];
  for (const s of list) {
    const last = out[out.length - 1];
    if (last && s.start <= last[1]) last[1] = Math.max(last[1], s.end);
    else out.push([s.start, s.end]);
  }
  return out;
}

export interface Timeline {
  byDay: Map<string, number>; // YYYY-MM-DD -> minutes
  byHour: number[]; // 24, minutes by local hour of day
  byWeekday: number[]; // 7, Monday first
  byDevice: { device: string; minutes: number }[];
  sessions: Session[];
}

export function buildTimeline(blocks: BlockLog[], attempts: Attempt[]): Timeline {
  const all = spans(blocks, attempts);
  const byDay = new Map<string, number>();
  const byHour = Array(24).fill(0) as number[];
  const byWeekday = Array(7).fill(0) as number[];

  // Walk each union interval hour by hour so time crossing midnight or an
  // hour boundary lands in the right bucket.
  for (const [start, end] of union(all)) {
    let t = start;
    while (t < end) {
      const d = new Date(t);
      const next = Math.min(end, new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + 1).getTime());
      const min = (next - t) / 60000;
      const k = dayKey(d);
      byDay.set(k, (byDay.get(k) ?? 0) + min);
      byHour[d.getHours()] += min;
      byWeekday[(d.getDay() + 6) % 7] += min;
      t = next;
    }
  }

  const devices = new Map<string, Span[]>();
  for (const s of all) devices.set(s.device, [...(devices.get(s.device) ?? []), s]);
  const byDevice = Array.from(devices.entries())
    .map(([device, list]) => ({ device, minutes: union(list).reduce((m, [a, b]) => m + (b - a) / 60000, 0) }))
    .sort((a, b) => b.minutes - a.minutes);

  return { byDay, byHour, byWeekday, byDevice, sessions: merge(all) };
}

export function streaks(byDay: Map<string, number>, today = new Date()): { current: number; longest: number } {
  const days = Array.from(byDay.keys()).filter((k) => (byDay.get(k) ?? 0) >= 1).sort();
  let longest = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const k of days) {
    const [y, m, d] = k.split("-").map(Number);
    const cur = new Date(y, m - 1, d);
    run = prev && Math.round((cur.getTime() - prev.getTime()) / 86400000) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = cur;
  }
  // Current streak counts back from today, or from yesterday if today is still empty.
  let current = 0;
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!byDay.get(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while ((byDay.get(dayKey(cursor)) ?? 0) >= 1) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { current, longest };
}

// Median start time of sittings, as minutes after midnight.
export function typicalStart(sessions: Session[]): number | null {
  if (sessions.length === 0) return null;
  const mins = sessions.map((s) => {
    const d = new Date(s.start);
    return d.getHours() * 60 + d.getMinutes();
  });
  mins.sort((a, b) => a - b);
  return mins[Math.floor(mins.length / 2)];
}

// ------------------------------------------------------------ activity feed

export type FeedItem =
  | { kind: "block"; at: number; block: BlockLog }
  | { kind: "attempt"; at: number; attempt: Attempt }
  | { kind: "errors-logged"; at: number; count: number }
  | { kind: "resolves"; at: number; count: number; clean: number }
  | { kind: "topic"; at: number; event: TopicEvent };

export interface FeedDay {
  day: string;
  minutes: number;
  devices: string[];
  items: FeedItem[];
}

export function buildFeed(
  timeline: Timeline,
  blocks: BlockLog[],
  attempts: Attempt[],
  errors: ErrorEntry[],
  topicEvents: TopicEvent[]
): FeedDay[] {
  const days = new Map<string, FeedDay>();
  const devices = new Map<string, Set<string>>();
  const get = (k: string) => {
    let d = days.get(k);
    if (!d) days.set(k, (d = { day: k, minutes: timeline.byDay.get(k) ?? 0, devices: [], items: [] }));
    return d;
  };
  const seen = (k: string, device?: string) => {
    if (!device) return;
    devices.set(k, (devices.get(k) ?? new Set()).add(device));
  };

  for (const b of blocks) {
    const at = Date.parse(b.startedAt);
    const k = dayKey(new Date(at));
    get(k).items.push({ kind: "block", at, block: b });
    seen(k, b.device);
  }
  for (const a of attempts) {
    const at = Date.parse(a.date);
    const k = dayKey(new Date(at));
    get(k).items.push({ kind: "attempt", at, attempt: a });
    seen(k, a.device);
  }

  const logged = new Map<string, { at: number; count: number }>();
  const resolves = new Map<string, { at: number; count: number; clean: number }>();
  for (const e of errors) {
    const at = Date.parse(e.createdAt);
    const k = dayKey(new Date(at));
    const l = logged.get(k) ?? { at, count: 0 };
    logged.set(k, { at: Math.max(l.at, at), count: l.count + 1 });
    for (const r of e.reviews) {
      const rat = Date.parse(r.date);
      const rk = dayKey(new Date(rat));
      const v = resolves.get(rk) ?? { at: rat, count: 0, clean: 0 };
      resolves.set(rk, { at: Math.max(v.at, rat), count: v.count + 1, clean: v.clean + (r.clean ? 1 : 0) });
    }
  }
  logged.forEach((v, k) => get(k).items.push({ kind: "errors-logged", ...v }));
  resolves.forEach((v, k) => get(k).items.push({ kind: "resolves", ...v }));

  for (const ev of topicEvents) {
    const at = Date.parse(ev.at);
    const k = dayKey(new Date(at));
    get(k).items.push({ kind: "topic", at, event: ev });
    seen(k, ev.device);
  }

  return Array.from(days.values())
    .map((d) => ({ ...d, devices: Array.from(devices.get(d.day) ?? []), items: d.items.sort((a, b) => b.at - a.at) }))
    .sort((a, b) => b.day.localeCompare(a.day));
}

export function fmtMinutes(min: number): string {
  const m = Math.round(min);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h}h ${r}m` : `${h}h`;
}

export function fmtTimeOfDay(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
