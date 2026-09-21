"use client";

import { CalendarEvent, TAG_COLORS, TAG_TEXT_COLORS } from "@/lib/types";

export function EventChip({
  event,
  onClick,
}: {
  event: CalendarEvent;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium leading-tight truncate w-full text-left hover:brightness-95 transition-[filter]"
      style={{
        backgroundColor: TAG_COLORS[event.tag],
        color: TAG_TEXT_COLORS[event.tag],
      }}
      title={event.title}
    >
      {event.title}
    </button>
  );
}
