"use client";

import { useEffect, useState } from "react";
import { CalendarClock, CalendarDays, Clock, Tag, Trash2, X } from "lucide-react";
import { CalendarEvent, SWATCH_COLORS, SWATCH_TO_TAG, TAG_COLORS, TagName } from "@/lib/types";
import { dayLabel } from "@/lib/date-utils";

export interface PopoverState {
  mode: "create" | "edit";
  date: string;
  event?: CalendarEvent;
}

export function EventPopover({
  state,
  onClose,
  onSave,
  onDelete,
}: {
  state: PopoverState;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState(state.event?.title ?? "");
  const [date, setDate] = useState(state.event?.date ?? state.date);
  const [start, setStart] = useState(state.event?.start ?? "19:00");
  const [end, setEnd] = useState(state.event?.end ?? "21:00");
  const [tag, setTag] = useState<TagName>(state.event?.tag ?? "Units 1-2");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSave() {
    if (!title.trim()) return;
    const finalEnd = end > start ? end : start;
    onSave({
      id: state.event?.id ?? `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim(),
      date,
      start,
      end: finalEnd,
      tag,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-on-surface/15 backdrop-blur-[1.5px] transition-opacity duration-150"
        onClick={onClose}
      />
      <aside
        className="relative z-10 w-full max-w-[400px] bg-surface-container-lowest rounded-xl shadow-xl transition-all duration-200"
        style={{
          boxShadow:
            "0 16px 36px -4px rgba(27, 28, 26, 0.16), 0 4px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-center justify-between px-space-md pt-space-md pb-space-xs">
          <div className="flex items-center gap-space-xs">
            <CalendarClock size={17} className="text-on-surface-variant" />
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {state.mode === "create" ? "New Study Event" : "Edit Study Event"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {state.mode === "edit" && state.event && (
              <button
                type="button"
                onClick={() => onDelete(state.event!.id)}
                className="p-1 rounded text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-colors"
                aria-label="Delete event"
              >
                <Trash2 size={17} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
              aria-label="Close"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="px-space-md pb-space-sm pt-space-xs">
          <div className="group relative">
            <input
              className="w-full bg-transparent font-headline-md text-headline-md text-on-surface font-semibold focus:outline-none placeholder:text-outline/50 transition-colors py-1"
              placeholder="Untitled Event..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <div className="h-[1.5px] w-full bg-surface-container-high group-focus-within:bg-primary transition-colors mt-0.5" />
          </div>
        </div>

        <div className="px-space-md py-space-xs space-y-space-xs font-body-sm text-body-sm">
          {/* Date row */}
          <div className="flex items-center gap-space-sm py-1">
            <div className="w-24 shrink-0 flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
              <CalendarDays size={15} />
              <span>Date</span>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 px-space-sm py-1 rounded bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface font-body-sm text-body-sm font-medium outline-none"
            />
          </div>
          <p className="pl-24 -mt-1 font-code text-[11px] text-outline">{dayLabel(date)}</p>

          {/* Time row */}
          <div className="flex items-center gap-space-sm py-1">
            <div className="w-24 shrink-0 flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
              <Clock size={15} />
              <span>Time</span>
            </div>
            <div className="flex-1 flex items-center gap-1.5 min-w-0">
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="px-2 py-1 rounded bg-surface-container-low text-on-surface font-code text-code font-medium outline-none"
              />
              <span className="text-outline text-xs">–</span>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="px-2 py-1 rounded bg-surface-container-low text-on-surface font-code text-code font-medium outline-none"
              />
            </div>
          </div>

          {/* Category / tag row */}
          <div className="flex flex-col gap-space-xs py-1">
            <div className="flex items-center gap-space-sm">
              <div className="w-24 shrink-0 flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                <Tag size={15} />
                <span>Category</span>
              </div>
              <div className="flex-1 flex items-center gap-space-xs flex-wrap">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-sm text-label-sm font-medium"
                  style={{ backgroundColor: TAG_COLORS[tag] }}
                >
                  {tag}
                </span>
              </div>
            </div>
            <div className="ml-24 pl-space-xs mt-1 p-2 rounded-lg bg-surface-container-low flex items-center gap-1.5">
              {SWATCH_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setTag(SWATCH_TO_TAG[color])}
                  className={
                    "w-5 h-5 rounded-full hover:scale-110 transition-transform " +
                    (TAG_COLORS[tag] === color ? "ring-2 ring-on-surface" : "")
                  }
                  style={{ backgroundColor: color }}
                  aria-label={SWATCH_TO_TAG[color]}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-space-md py-space-md mt-space-xs bg-surface-container-low/50 rounded-b-xl">
          {state.mode === "edit" && state.event ? (
            <button
              type="button"
              onClick={() => onDelete(state.event!.id)}
              className="flex items-center gap-1 font-label-md text-label-md text-error hover:opacity-80 transition-opacity"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!title.trim()}
              className="px-3.5 py-1.5 rounded-lg bg-primary-container hover:bg-tertiary-container text-on-primary font-label-md text-label-md font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
