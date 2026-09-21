"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { CalendarEvent, TAG_COLORS, TAG_TEXT_COLORS } from "@/lib/types";
import { dayLabel, durationLabel, minutesSinceMidnight, to12Hour } from "@/lib/date-utils";

const START_HOUR = 6;
const END_HOUR = 23;
const ROW_HEIGHT = 64; // px per hour
const RANGE_MINUTES = (END_HOUR - START_HOUR) * 60;
const ALL_DAY_THRESHOLD_MIN = 12 * 60; // events this long (or longer) render as an all-day banner

function isAllDay(ev: CalendarEvent): boolean {
  const dur = minutesSinceMidnight(ev.end) - minutesSinceMidnight(ev.start);
  return dur >= ALL_DAY_THRESHOLD_MIN;
}

export function DayView({
  dateIso,
  todayIso,
  events,
  onNavigate,
  onEventClick,
  onAddClick,
}: {
  dateIso: string;
  todayIso: string;
  events: CalendarEvent[];
  onNavigate: (delta: number) => void;
  onEventClick: (event: CalendarEvent) => void;
  onAddClick: () => void;
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const dayEvents = events
    .filter((e) => e.date === dateIso)
    .sort((a, b) => a.start.localeCompare(b.start));
  const allDayEvents = dayEvents.filter(isAllDay);
  const timedEvents = dayEvents.filter((e) => !isAllDay(e));

  const isToday = dateIso === todayIso;
  const nowMinutes = now ? now.getHours() * 60 + now.getMinutes() : null;
  const showLiveLine =
    isToday && nowMinutes !== null && nowMinutes >= START_HOUR * 60 && nowMinutes <= END_HOUR * 60;
  const liveLineTop = showLiveLine
    ? ((nowMinutes! - START_HOUR * 60) / RANGE_MINUTES) * 100
    : 0;

  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  return (
    <section className="flex flex-col bg-surface-container-lowest rounded-xl shadow-sm p-space-lg gap-space-md">
      <div className="flex flex-wrap items-center justify-between gap-space-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            {dayLabel(dateIso)}
          </h2>
          {isToday && (
            <span className="font-label-sm text-label-sm text-primary font-bold">Today</span>
          )}
        </div>
        <div className="flex items-center gap-space-sm">
          <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-lg">
            <button
              type="button"
              aria-label="Previous day"
              onClick={() => onNavigate(-1)}
              className="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next day"
              onClick={() => onNavigate(1)}
              className="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <button
            type="button"
            onClick={onAddClick}
            className="flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-primary-container hover:bg-tertiary-container text-on-primary font-label-sm text-label-sm shadow-sm transition-transform active:scale-95"
          >
            <Plus size={16} />
            <span>New Study Block</span>
          </button>
        </div>
      </div>

      {allDayEvents.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {allDayEvents.map((ev) => (
            <button
              key={ev.id}
              type="button"
              onClick={() => onEventClick(ev)}
              className="w-full text-left px-space-md py-space-sm rounded-lg font-headline-sm text-headline-sm transition-[filter] hover:brightness-95"
              style={{ backgroundColor: TAG_COLORS[ev.tag], color: TAG_TEXT_COLORS[ev.tag] }}
            >
              {ev.title}
            </button>
          ))}
        </div>
      )}

      <div className="relative w-full pt-space-xs overflow-x-auto">
        <div className="relative" style={{ height: (END_HOUR - START_HOUR) * ROW_HEIGHT }}>
          {showLiveLine && (
            <div
              className="absolute left-14 right-0 z-30 pointer-events-none flex items-center"
              style={{ top: `${liveLineTop}%` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-error ring-4 ring-error/20 -ml-1" />
              <div className="h-px bg-error w-full opacity-90" />
            </div>
          )}

          {hours.map((h, i) => (
            <div
              key={h}
              className="absolute left-0 right-0 flex items-start"
              style={{ top: i * ROW_HEIGHT }}
            >
              <span className="w-14 font-code text-code text-on-surface-variant/70 shrink-0 select-none">
                {String(h).padStart(2, "0")}:00
              </span>
              <div className="flex-1 h-px bg-surface-container-high mt-2.5 ml-2" />
            </div>
          ))}

          {timedEvents.map((ev) => {
            const startMin = Math.max(minutesSinceMidnight(ev.start), START_HOUR * 60);
            const endMin = Math.min(minutesSinceMidnight(ev.end), END_HOUR * 60);
            const top = ((startMin - START_HOUR * 60) / 60) * ROW_HEIGHT;
            const height = Math.max(((endMin - startMin) / 60) * ROW_HEIGHT, 32);

            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => onEventClick(ev)}
                className="absolute left-16 right-0 rounded-lg p-space-sm shadow-sm transition-all hover:brightness-95 z-10 text-left overflow-hidden"
                style={{ top, height, backgroundColor: TAG_COLORS[ev.tag] }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide shrink-0"
                      style={{ color: TAG_TEXT_COLORS[ev.tag], backgroundColor: "rgba(255,255,255,0.5)" }}
                    >
                      {ev.tag}
                    </span>
                    <h3
                      className="font-headline-sm text-headline-sm truncate"
                      style={{ color: TAG_TEXT_COLORS[ev.tag] }}
                    >
                      {ev.title}
                    </h3>
                  </div>
                  <span
                    className="font-code text-code font-medium shrink-0"
                    style={{ color: TAG_TEXT_COLORS[ev.tag] }}
                  >
                    {to12Hour(ev.start)} – {to12Hour(ev.end)} • {durationLabel(ev.start, ev.end)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
