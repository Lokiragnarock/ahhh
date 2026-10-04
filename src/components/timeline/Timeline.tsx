"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { dayKey, fmtDate, pct, useAllOf } from "@/lib/practice-store";
import type { Attempt, BlockLog, ErrorEntry } from "@/lib/practice-types";
import { trackOfSubject } from "@/lib/tracks";
import { subjectLabel, type SubjectInfo } from "@/lib/subject/shared";
import {
  buildFeed,
  buildTimeline,
  FeedDay,
  FeedItem,
  fmtMinutes,
  fmtTimeOfDay,
  streaks,
  TopicEvent,
  typicalStart,
} from "@/lib/timeline";
import { PageHead, Stat } from "@/components/practice/bits";

// Blocks and tests logged before devices were recorded.
const UNTRACKED = "Before tracking";

const WEEKS = 26; // six months
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// Sequential ramp, light -> dark: none, <30m, <1h, <2h, 2h+. Colours come
// from the track tokens (grey for AHH, blue tints for GMAT).
const LEVELS = [0, 1, 2, 3, 4].map((i) => `var(--sp-heat-${i})`);
const LEVEL_LABELS = ["No study", "Under 30m", "30m–1h", "1–2h", "2h+"];

function level(min: number): number {
  if (min < 1) return 0;
  if (min < 30) return 1;
  if (min < 60) return 2;
  if (min < 120) return 3;
  return 4;
}

function parseDay(k: string): Date {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function longDay(k: string): string {
  return parseDay(k).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function useTopicEvents(): TopicEvent[] {
  const [events, setEvents] = useState<TopicEvent[]>([]);
  useEffect(() => {
    fetch("/api/activity", { cache: "no-store" })
      .then((r) => (r.status === 200 ? r.json() : { events: [] }))
      .then((d: { events: TopicEvent[] }) => setEvents(d.events.filter((e) => e.type === "topic-state")))
      .catch(() => {});
  }, []);
  return events;
}

type Filter = "all" | "gmat" | "notes";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "gmat", label: "GMAT" },
  { id: "notes", label: "Notes" },
];
const FILTER_KEY = "timeline.filter.v1";

// Notes = the AHH track's subjects (the university-subject notes prep).
function inFilter(subject: string, f: Filter): boolean {
  return f === "all" || (f === "gmat" ? trackOfSubject(subject) === "gmat" : trackOfSubject(subject) === "ahh");
}

export function Timeline({ subjects }: { subjects: SubjectInfo[] }) {
  const allBlocks = useAllOf<BlockLog>("blocks");
  const allAttempts = useAllOf<Attempt>("attempts");
  const allErrors = useAllOf<ErrorEntry>("errors");
  const topicEvents = useTopicEvents();

  const [filter, setFilter] = useState<Filter>("all");
  useEffect(() => {
    try {
      const v = window.localStorage.getItem(FILTER_KEY);
      if (v === "all" || v === "gmat" || v === "notes") setFilter(v);
    } catch {
      // storage unavailable: stay on All
    }
  }, []);
  function pick(f: Filter) {
    setFilter(f);
    try {
      window.localStorage.setItem(FILTER_KEY, f);
    } catch {
      // not remembered
    }
  }

  const labels = useMemo(() => new Map(subjects.map((s) => [s.slug, s.label])), [subjects]);
  const label = (slug: string) => labels.get(slug) ?? subjectLabel(slug);

  const blocks = useMemo(() => allBlocks.filter((b) => inFilter(b.subject, filter)), [allBlocks, filter]);
  const attempts = useMemo(() => allAttempts.filter((a) => inFilter(a.subject, filter)), [allAttempts, filter]);
  const errors = useMemo(() => allErrors.filter((e) => inFilter(e.subject, filter)), [allErrors, filter]);
  // Topic events have no subject; they are notes activity.
  const events = useMemo(() => (filter === "gmat" ? [] : topicEvents), [topicEvents, filter]);

  const timeline = useMemo(() => buildTimeline(blocks, attempts), [blocks, attempts]);
  const feed = useMemo(
    () => buildFeed(timeline, blocks, attempts, errors, events),
    [timeline, blocks, attempts, errors, events]
  );

  const today = new Date();
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    return timeline.byDay.get(dayKey(d)) ?? 0;
  });
  const min30 = last30.reduce((s, m) => s + m, 0);
  const active30 = last30.filter((m) => m >= 1).length;
  const { current, longest } = streaks(timeline.byDay, today);
  const start = typicalStart(timeline.sessions);
  const avgSession = timeline.sessions.length
    ? timeline.sessions.reduce((s, x) => s + x.minutes, 0) / timeline.sessions.length
    : 0;

  return (
    <div className="sp-wrap">
      <PageHead title="Timeline" kicker="When, how much, where">
        <div className="sp-seg" role="group" aria-label="Filter by track">
          {FILTERS.map((x) => (
            <button key={x.id} type="button" aria-pressed={filter === x.id} onClick={() => pick(x.id)}>
              {x.label}
            </button>
          ))}
        </div>
      </PageHead>

      <div className="sp-stat-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
        <Stat label="Last 30 days" value={fmtMinutes(min30)} sub={`${active30} of 30 days active`} />
        <Stat label="Current streak" value={`${current}d`} sub={`Longest ${longest}d`} />
        <Stat label="Sittings" value={timeline.sessions.length} sub="blocks and tests, merged" />
        <Stat label="Avg sitting" value={fmtMinutes(avgSession)} />
        <Stat label="Usually starts" value={start === null ? "—" : fmtTimeOfDay(start)} sub="median start time" />
        <Stat label="Top device" value={timeline.byDevice.find((d) => d.device !== UNTRACKED)?.device ?? "—"} />
      </div>

      <section className="sp-panel mb-8">
        <h2 className="sp-h2">Last six months</h2>
        <Heatmap byDay={timeline.byDay} />
      </section>

      <div className="grid gap-8 lg:grid-cols-2 mb-8">
        <section className="sp-panel">
          <h2 className="sp-h2">Time of day</h2>
          <Bars
            values={timeline.byHour}
            labels={timeline.byHour.map((_, h) => `${String(h).padStart(2, "0")}:00`)}
            tick={(i) => (i % 6 === 0 ? String(i).padStart(2, "0") : "")}
            empty="Time of day appears once blocks or tests are logged."
          />
        </section>
        <section className="sp-panel">
          <h2 className="sp-h2">Day of week</h2>
          <Bars values={timeline.byWeekday} labels={WEEKDAYS} tick={(i) => WEEKDAYS[i]} empty="Nothing logged yet." />
        </section>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 mb-8">
        <section className="sp-panel">
          <h2 className="sp-h2">Weekly volume</h2>
          <Weekly byDay={timeline.byDay} />
        </section>
        <section className="sp-panel">
          <h2 className="sp-h2">Where</h2>
          <Devices rows={timeline.byDevice} />
        </section>
      </div>

      <section className="sp-panel">
        <h2 className="sp-h2">Activity</h2>
        <Feed days={feed} label={label} />
      </section>
    </div>
  );
}

// ------------------------------------------------------------ heatmap

function Heatmap({ byDay }: { byDay: Map<string, number> }) {
  const [hover, setHover] = useState<string | null>(null);
  const today = new Date();
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((today.getDay() + 6) % 7));
  const first = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() - (WEEKS - 1) * 7);
  const todayKey = dayKey(today);

  const weeks = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = new Date(first.getFullYear(), first.getMonth(), first.getDate() + w * 7 + d);
      const k = dayKey(date);
      return { k, date, min: byDay.get(k) ?? 0, future: k > todayKey };
    })
  );

  const cell = 13;
  const gap = 3;
  const left = 30;
  const top = 16;
  const width = left + WEEKS * (cell + gap);
  const height = top + 7 * (cell + gap);
  const hovered = hover ? { k: hover, min: byDay.get(hover) ?? 0 } : null;

  // A label on each week where a month starts, dropped if it would crowd the previous one.
  const monthLabels: number[] = [];
  weeks.forEach((days, w) => {
    const starts = w === 0 || days[0].date.getMonth() !== weeks[w - 1][0].date.getMonth();
    if (starts && (monthLabels.length === 0 || w - monthLabels[monthLabels.length - 1] >= 3)) monthLabels.push(w);
  });

  // On narrow screens the grid scrolls; start at the most recent weeks.
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth;
  }, []);

  return (
    <div>
      <div ref={scroller} className="overflow-x-auto no-scrollbar">
        <svg width={width} height={height} role="img" aria-label="Study minutes per day over the last six months">
          {monthLabels.map((w) => {
            const d0 = weeks[w][0].date;
            return (
              <text key={`m${w}`} x={left + w * (cell + gap)} y={10} fontSize={10} fill="var(--sp-muted)">
                {d0.toLocaleDateString("en-IN", { month: "short" })}
              </text>
            );
          })}
          {[0, 2, 4].map((d) => (
            <text key={d} x={0} y={top + d * (cell + gap) + cell - 3} fontSize={10} fill="var(--sp-muted)">
              {WEEKDAYS[d]}
            </text>
          ))}
          {weeks.map((days, w) =>
            days.map(({ k, min, future }, d) =>
              future ? null : (
                <rect
                  key={k}
                  x={left + w * (cell + gap)}
                  y={top + d * (cell + gap)}
                  width={cell}
                  height={cell}
                  rx={2}
                  style={{ fill: LEVELS[level(min)] }}
                  stroke={hover === k ? "var(--sp-ink)" : "none"}
                  strokeWidth={1.5}
                  onMouseEnter={() => setHover(k)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setHover(k)}
                >
                  <title>{`${longDay(k)}: ${min >= 1 ? fmtMinutes(min) : "no study"}`}</title>
                </rect>
              )
            )
          )}
        </svg>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 text-[12px] text-[color:var(--sp-muted)]">
        <span className="sp-num text-[color:var(--sp-ink)] min-h-[18px]">
          {hovered ? `${longDay(hovered.k)} · ${hovered.min >= 1 ? fmtMinutes(hovered.min) : "no study"}` : "Hover or tap a day"}
        </span>
        <span className="flex items-center gap-1.5">
          Less
          {LEVELS.map((c, i) => (
            <span key={c} title={LEVEL_LABELS[i]} className="inline-block w-[11px] h-[11px] rounded-[2px]" style={{ background: c }} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ bars

function Bars({
  values,
  labels,
  tick,
  empty,
}: {
  values: number[];
  labels: string[];
  tick: (i: number) => string;
  empty: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...values);
  if (max < 1) return <p className="text-[13px] text-[color:var(--sp-muted)]">{empty}</p>;
  const peak = values.indexOf(max);
  const h = 96;
  const shown = hover ?? peak;

  return (
    <div>
      <div className="text-[12px] text-[color:var(--sp-muted)] mb-2 min-h-[18px]">
        <span className="text-[color:var(--sp-ink)] sp-num">{labels[shown]}</span> · {fmtMinutes(values[shown])}
        {hover === null && " (peak)"}
      </div>
      <div className="flex items-end gap-[2px]" style={{ height: h }} onMouseLeave={() => setHover(null)}>
        {values.map((v, i) => (
          <div
            key={i}
            className="flex-1 h-full flex items-end cursor-default"
            onMouseEnter={() => setHover(i)}
            onClick={() => setHover(i)}
            title={`${labels[i]}: ${fmtMinutes(v)}`}
          >
            <div
              className="w-full rounded-t-[4px]"
              style={{
                height: v >= 1 ? Math.max(3, (v / max) * h) : 1,
                background: v >= 1 ? "var(--sp-accent)" : "var(--sp-line)",
                opacity: v >= 1 && hover === i ? 0.7 : 1,
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-[2px] mt-1.5 border-t border-[color:var(--sp-line)] pt-1">
        {values.map((_, i) => (
          <div key={i} className="flex-1 text-[10px] text-[color:var(--sp-muted)] overflow-visible whitespace-nowrap">
            {tick(i)}
          </div>
        ))}
      </div>
    </div>
  );
}

function Weekly({ byDay }: { byDay: Map<string, number> }) {
  const today = new Date();
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((today.getDay() + 6) % 7));
  const weeks = Array.from({ length: 12 }, (_, i) => {
    const start = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() - (11 - i) * 7);
    let min = 0;
    for (let d = 0; d < 7; d++) {
      min += byDay.get(dayKey(new Date(start.getFullYear(), start.getMonth(), start.getDate() + d))) ?? 0;
    }
    return { start, min };
  });
  return (
    <Bars
      values={weeks.map((w) => w.min)}
      labels={weeks.map((w, i) => (i === 11 ? "This week" : `Week of ${fmtDate(dayKey(w.start))}`))}
      tick={(i) => (i % 3 === 2 || i === 11 ? (i === 11 ? "Now" : fmtDate(dayKey(weeks[i].start))) : "")}
      empty="Weekly volume appears once blocks or tests are logged."
    />
  );
}

function Devices({ rows }: { rows: { device: string; minutes: number }[] }) {
  if (rows.length === 0) return <p className="text-[13px] text-[color:var(--sp-muted)]">Nothing logged yet.</p>;
  const total = rows.reduce((s, r) => s + r.minutes, 0);
  const max = Math.max(...rows.map((r) => r.minutes));
  const ordered = [...rows.filter((r) => r.device !== UNTRACKED), ...rows.filter((r) => r.device === UNTRACKED)];
  return (
    <ul className="space-y-3">
      {ordered.map((r) => (
        <li key={r.device}>
          <div className="flex justify-between text-[13px] mb-1">
            <span className={r.device === UNTRACKED ? "text-[color:var(--sp-muted)]" : "text-[color:var(--sp-ink)]"}>{r.device}</span>
            <span className="sp-num text-[color:var(--sp-muted)]">
              {fmtMinutes(r.minutes)} · {pct(r.minutes, total)}%
            </span>
          </div>
          <div className="h-[6px] bg-[#f0f0f0] rounded-[3px]">
            <div
              className="h-full rounded-[3px]"
              style={{ width: `${(r.minutes / max) * 100}%`, background: r.device === UNTRACKED ? "var(--sp-heat-1)" : "var(--sp-accent)" }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

// ------------------------------------------------------------ feed

const KIND_LABEL: Record<string, string> = { mini: "Mini test", sectional: "Sectional", mock: "Mock" };

function topicName(slug: string): string {
  const i = slug.indexOf(" - ");
  return i === -1 ? slug : slug.slice(i + 3);
}

function time(at: number): string {
  return new Date(at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function describe(item: FeedItem): { title: string; detail: string } {
  switch (item.kind) {
    case "block": {
      const b = item.block;
      return {
        title: `${b.round} block${b.node ? ` · ${b.node}` : ""}`,
        detail: `${fmtMinutes(b.minutes)}${b.complete ? "" : " (partial)"}${b.device ? ` · ${b.device}` : ""}`,
      };
    }
    case "attempt": {
      const a = item.attempt;
      return {
        title: `${KIND_LABEL[a.kind] ?? a.kind} · ${a.scope}`,
        detail: `${a.score}/${a.max} (${pct(a.score, a.max)}%) · ${fmtMinutes(a.durationSec / 60)}${a.device ? ` · ${a.device}` : ""}`,
      };
    }
    case "errors-logged":
      return { title: `Logged ${item.count} error${item.count === 1 ? "" : "s"}`, detail: "Error book" };
    case "resolves":
      return {
        title: `Re-solved ${item.count} error${item.count === 1 ? "" : "s"}`,
        detail: `${item.clean} clean`,
      };
    case "topic":
      return {
        title: `${topicName(item.event.slug)} → ${item.event.to}`,
        detail: `was ${item.event.from} · ${item.event.device}`,
      };
  }
}

function Feed({ days, label }: { days: FeedDay[]; label: (slug: string) => string }) {
  const [shown, setShown] = useState(14);
  if (days.length === 0) return <p className="text-[13px] text-[color:var(--sp-muted)]">Your study history will build up here.</p>;
  return (
    <div>
      <ol>
        {days.slice(0, shown).map((d) => (
          <li key={d.day} className="border-t border-[color:var(--sp-line)] first:border-t-0 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <span className="text-[13px] font-semibold text-[color:var(--sp-ink)]">{longDay(d.day)}</span>
              <span className="text-[12px] text-[color:var(--sp-muted)] sp-num">
                {d.minutes >= 1 ? fmtMinutes(d.minutes) : "—"}
                {d.devices.length > 0 && ` · ${d.devices.join(", ")}`}
              </span>
            </div>
            <ul className="space-y-1">
              {d.items.map((item, i) => {
                const { title, detail } = describe(item);
                return (
                  <li key={i} className="grid grid-cols-[44px_1fr] gap-2 text-[13px]">
                    <span className="text-[color:var(--sp-muted)] sp-num">{time(item.at)}</span>
                    <span className="min-w-0">
                      <span className="text-[color:var(--sp-ink)]">{title}</span>
                      <span className="text-[color:var(--sp-muted)]"> · {detail}</span>
                      {item.subject && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-[color:var(--sp-muted)] border border-[color:var(--sp-line)] px-1 py-px whitespace-nowrap">
                          {label(item.subject)}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
      {shown < days.length && (
        <button type="button" className="sp-quiet-link mt-2" onClick={() => setShown((n) => n + 30)}>
          Show older days
        </button>
      )}
    </div>
  );
}
