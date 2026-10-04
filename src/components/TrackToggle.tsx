"use client";

import { useState } from "react";
import { useTrack } from "@/lib/tracks-context";
import type { TrackSlug } from "@/lib/tracks";

// Header button that flips between the AHH and GMAT tracks. Labelled with the
// track you would switch to.
export function TrackToggle() {
  const track = useTrack();
  const [busy, setBusy] = useState(false);
  const target: TrackSlug = track === "ahh" ? "gmat" : "ahh";

  async function flip() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track: target }),
      });
      if (!res.ok) return;
      const { home } = (await res.json()) as { home: string };
      // Full navigation, not router.push: a soft push to the page you are
      // already on keeps the old server render and ignores the new cookie.
      window.location.assign(home);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={flip}
      disabled={busy}
      title={`Switch to ${target.toUpperCase()}`}
      className={`shrink-0 px-2 py-1 border border-[#ccc] hover:border-[#111] text-[11px] font-semibold uppercase tracking-[0.09em] ${
        track === "gmat" ? "text-[#111]" : "text-[#888] hover:text-[#111]"
      } ${busy ? "opacity-60" : ""}`}
    >
      {target.toUpperCase()}
    </button>
  );
}
