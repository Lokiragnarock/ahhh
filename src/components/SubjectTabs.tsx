"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  SUBJECT_GROUPS,
  hasSubjectGroup,
  subjectGroup,
  type SubjectGroupKey,
  type SubjectInfo,
} from "@/lib/subject/shared";

// Real tabs across every subject folder discovered under content/recall.
// Clicking one sets the subject_key cookie server-side, then refreshes the
// route so every force-dynamic page (which already reads that cookie) picks
// up the new subject on next render.
export function SubjectTabs({ subjects, current }: { subjects: SubjectInfo[]; current: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [switching, setSwitching] = useState<string | null>(null);

  async function pick(slug: string) {
    if (slug === current || pending) return;
    setSwitching(slug);
    try {
      const res = await fetch("/api/subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: slug }),
      });
      if (!res.ok) return;
      startTransition(() => router.refresh());
    } finally {
      setSwitching(null);
    }
  }

  const grouped = subjects.some((s) => hasSubjectGroup(s.slug));
  const currentGroup = subjectGroup(current);
  const [selectedGroup, setSelectedGroup] = useState<SubjectGroupKey | null>(null);
  const activeGroup = selectedGroup ?? currentGroup;

  if (subjects.length === 0) return null;

  const groups = grouped
    ? SUBJECT_GROUPS.filter((g) => subjects.some((s) => subjectGroup(s.slug) === g.key))
    : [];
  const visible = grouped ? subjects.filter((s) => subjectGroup(s.slug) === activeGroup) : subjects;

  return (
    <div className="mb-8">
      {grouped && (
        <div className="flex items-center gap-4 mb-2">
          {groups.map((g) => {
            const on = g.key === activeGroup;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setSelectedGroup(g.key)}
                className={`pb-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] border-b-2 ${
                  on
                    ? "text-[color:var(--sp-ink)] border-[color:var(--sp-accent)]"
                    : "text-[#888] border-transparent hover:text-[color:var(--sp-ink)]"
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      )}
      <div className="flex items-center gap-2 flex-wrap">
      {visible.map((s) => {
        const active = s.slug === current;
        return (
          <button
            key={s.slug}
            type="button"
            onClick={() => pick(s.slug)}
            disabled={pending}
            className={`px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.06em] border ${
              active
                ? "bg-[color:var(--sp-accent)] text-white border-[color:var(--sp-accent)]"
                : "bg-white text-[#555] border-[#ccc] hover:border-[color:var(--sp-accent)] hover:text-[color:var(--sp-ink)]"
            } ${switching === s.slug ? "opacity-60" : ""}`}
          >
            {s.label}
          </button>
        );
      })}
      </div>
    </div>
  );
}
