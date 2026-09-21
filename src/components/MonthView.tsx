"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarEvent } from "@/lib/types";
import {
  WEEKDAY_LABELS,
  dayOfMonth,
  isSameMonth,
  monthGrid,
  monthLabel,
} from "@/lib/date-utils";
import { EventChip } from "./EventChip";

const MAX_CHIPS = 3;

export function MonthView({
  viewDate,
  todayIso,
  events,
  onNavigate,
  onDayClick,
  onEventClick,
}: {
  viewDate: string;
  todayIso: string;
  events: CalendarEvent[];
  onNavigate: (delta: number) => void;
  onGoToday?: () => void;
  onDayClick: (dateIso: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}) {
  const grid = monthGrid(viewDate);
  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const ev of events) {
    const list = eventsByDate.get(ev.date) ?? [];
    list.push(ev);
    eventsByDate.set(ev.date, list);
  }
  for (const list of eventsByDate.values()) {
    list.sort((a, b) => a.start.localeCompare(b.start));
  }

  return (
    <div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-space-md py-space-sm gap-space-md">
        <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          {monthLabel(viewDate)}
        </h2>
        <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-lg">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => onNavigate(-1)}
            className="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => onNavigate(1)}
            className="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-surface-container-low py-2 px-1 text-center font-label-sm text-label-sm text-on-surface-variant font-medium">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[1px] bg-surface-container-high p-[1px]">
        {grid.map((dateIso) => {
          const inMonth = isSameMonth(dateIso, viewDate);
          const isToday = dateIso === todayIso;
          const dayEvents = eventsByDate.get(dateIso) ?? [];
          const visible = dayEvents.slice(0, MAX_CHIPS);
          const overflow = dayEvents.length - visible.length;

          return (
            <div
              key={dateIso}
              onClick={() => onDayClick(dateIso)}
              className={
                "min-h-[110px] p-2 flex flex-col gap-1 cursor-pointer transition-colors " +
                (inMonth
                  ? "bg-surface-container-lowest hover:bg-surface-bright"
                  : "bg-surface-container-low/60 opacity-50 hover:opacity-70") +
                (isToday ? " ring-2 ring-primary-container ring-inset rounded-sm shadow-sm" : "")
              }
            >
              <div className="flex justify-between items-center">
                {isToday ? (
                  <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary font-code text-code flex items-center justify-center font-bold">
                    {dayOfMonth(dateIso)}
                  </span>
                ) : (
                  <span className="font-code text-code text-on-surface">
                    {dayOfMonth(dateIso)}
                  </span>
                )}
                {isToday && (
                  <span className="font-label-sm text-label-sm text-primary font-bold">
                    Today
                  </span>
                )}
              </div>
              {visible.map((ev) => (
                <EventChip key={ev.id} event={ev} onClick={() => onEventClick(ev)} />
              ))}
              {overflow > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDayClick(dateIso);
                  }}
                  className="text-left font-label-sm text-[11px] text-on-surface-variant hover:text-on-surface transition-colors pt-0.5"
                >
                  +{overflow} more
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
