"use client";

import { ERROR_TYPES, ErrorType } from "@/lib/practice-types";

export interface ErrorFieldValues {
  errorType: ErrorType;
  what: string;
  why: string;
  correct: string;
  avoid: string;
}

export const EMPTY_FIELDS: ErrorFieldValues = {
  errorType: "Knowledge gap",
  what: "",
  why: "",
  correct: "",
  avoid: "",
};

const FIELDS: { key: Exclude<keyof ErrorFieldValues, "errorType">; label: string; hint: string }[] = [
  { key: "what", label: "What I did", hint: "The answer or step you actually wrote" },
  { key: "why", label: "Why it happened", hint: "The real cause, not just 'careless'" },
  { key: "correct", label: "Correct method", hint: "Section, rule, or working that gets full marks" },
  { key: "avoid", label: "How to avoid next time", hint: "A concrete check or trigger" },
];

export function ErrorFields({
  value,
  onChange,
}: {
  value: ErrorFieldValues;
  onChange: (v: ErrorFieldValues) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="sp-label">Error type</div>
        <div className="flex flex-wrap gap-2">
          {ERROR_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ ...value, errorType: t })}
              className={`sp-chip cursor-pointer ${value.errorType === t ? "sp-chip-dark" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <div className="sp-label">{f.label}</div>
            <textarea
              className="sp-textarea"
              rows={3}
              placeholder={f.hint}
              value={value[f.key]}
              onChange={(e) => onChange({ ...value, [f.key]: e.target.value })}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
