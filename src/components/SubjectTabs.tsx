"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { SubjectInfo } from "@/lib/subject/shared";

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

  if (subjects.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-8 flex-wrap">
      {subjects.map((s) => {
        const active = s.slug === current;
        return (
          <button
            key={s.slug}
            type="button"
            onClick={() => pick(s.slug)}
            disabled={pending}
            className={`px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.06em] border ${
              active
                ? "bg-[#111] text-white border-[#111]"
                : "bg-white text-[#555] border-[#ccc] hover:border-[#111] hover:text-[#111]"
            } ${switching === s.slug ? "opacity-60" : ""}`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
