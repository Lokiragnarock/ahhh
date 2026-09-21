"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { CalendarEvent, TAG_COLORS, TAG_TEXT_COLORS } from "@/lib/types";
import { addDays, dayOfMonth, minutesSinceMidnight, weekRangeLabel, weekdayShort } from "@/lib/date-utils";

export function WeekView({
  weekStartIso,
  todayIso,
  events,
  onNavigate,
  onDayClick,
  onEventClick,
}: {
  weekStartIso: string;
  todayIso: string;
  events: CalendarEvent[];
  onNavigate: (delta: number) => void;
  onDayClick: (dateIso: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStartIso, i));

  return (
    <div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-sm p-space-md gap-space-md">
      <div className="flex items-center justify-between gap-space-md">
        <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          {weekRangeLabel(weekStartIso)}
        </h2>
        <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-lg">
          <button
            type="button"
            aria-label="Previous week"
            onClick={() => onNavigate(-1)}
            className="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next week"
            onClick={() => onNavigate(1)}
            className="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-space-xs bg-surface-container-low p-space-xs rounded-xl">
        {days.map((dateIso) => {
          const isToday = dateIso === todayIso;
          const dayEvents = events
            .filter((e) => e.date === dateIso)
            .sort((a, b) => a.start.localeCompare(b.start));
          const plannedMinutes = dayEvents.reduce(
            (sum, e) => sum + (minutesSinceMidnight(e.end) - minutesSinceMidnight(e.start)),
            0
          );

          return (
            <div
              key={dateIso}
              className={
                "flex flex-col gap-space-xs bg-surface-container-lowest rounded-lg p-space-xs min-h-[420px]" +
                (isToday ? " ring-2 ring-primary-container/30 shadow-sm" : "")
              }
            >
              <div
                className={
                  "p-space-xs rounded flex flex-col gap-0.5 " +
                  (isToday ? "bg-primary-container text-on-primary" : "bg-surface-container-low")
                }
              >
                <div className="flex items-center justify-between">
                  <span
                    className={
                      "font-label-sm text-label-sm uppercase " +
                      (isToday ? "text-on-primary" : "text-on-surface-variant")
                    }
                  >
                    {weekdayShort(dateIso)}
                  </span>
                  <span className="font-code text-code font-semibold">{dayOfMonth(dateIso)}</span>
                </div>
                <span
                  className={
                    "font-code text-[10px] " + (isToday ? "text-on-primary/80" : "text-outline")
                  }
                >
                  {(plannedMinutes / 60).toFixed(1)}h planned
                </span>
              </div>

              <div className="flex flex-col gap-space-xs flex-1">
                {dayEvents.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => onEventClick(ev)}
                    className="group relative flex flex-col p-space-xs rounded-lg bg-surface hover:bg-surface-container-low shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all text-left"
                  >
                    <div className="flex items-start justify-between gap-space-xs mb-1">
                      <span className="font-code text-[11px] text-on-surface-variant font-medium">
                        {ev.start} – {ev.end}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: TAG_TEXT_COLORS[ev.tag] }}
                      />
                      <span
                        className="px-1.5 py-0.5 rounded font-label-sm text-[10px] truncate"
                        style={{ backgroundColor: TAG_COLORS[ev.tag], color: TAG_TEXT_COLORS[ev.tag] }}
                      >
                        {ev.tag}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface font-medium leading-tight line-clamp-2">
                      {ev.title}
                    </p>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onDayClick(dateIso)}
                className="w-full py-1 text-center font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded transition-colors mt-auto flex items-center justify-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
