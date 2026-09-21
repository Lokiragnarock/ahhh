"use client";

import { ViewMode } from "@/lib/types";

const OPTIONS: { key: ViewMode; label: string }[] = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
];

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div className="flex items-center bg-surface-container-low p-1 rounded-lg">
      {OPTIONS.map((opt) => {
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={
              active
                ? "px-space-sm py-1 rounded bg-surface-container-lowest font-label-sm text-label-sm text-on-surface shadow-sm font-semibold transition-colors"
                : "px-space-sm py-1 rounded font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
