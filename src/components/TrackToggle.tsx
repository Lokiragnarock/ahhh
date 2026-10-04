"use client";

import { useState } from "react";
import { useTrack } from "@/lib/tracks-context";
import type { TrackSlug } from "@/lib/tracks";

// Header button that flips between the AHH and GMAT tracks. Labelled with the
// track you would switch to.
export function TrackToggle() {
  const track = useTrack();
  const [busy, setBusy] = useState(false);
  const [asking, setAsking] = useState(false);
  const [name, setName] = useState("");
  const target: TrackSlug = track === "ahh" ? "gmat" : "ahh";

  async function flip() {
    if (busy) return;
    setBusy(true);
    try {
      // First time on GMAT from this device: ask for a name before switching.
      if (target === "gmat") {
        const me = await fetch("/api/gmat/me")
          .then((r) => r.json() as Promise<{ player: unknown }>)
          .catch(() => ({ player: {} }));
        if (!me.player) {
          setAsking(true);
          return;
        }
      }
      await switchTrack();
    } finally {
      setBusy(false);
    }
  }

  async function onboard() {
    const n = name.trim();
    if (busy || !n) return;
    setBusy(true);
    try {
      // A failure here (no storage configured) still lets the switch happen;
      // practice just stays local.
      await fetch("/api/gmat/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: n }),
      }).catch(() => {});
      await switchTrack();
    } finally {
      setBusy(false);
    }
  }

  async function switchTrack() {
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
  }

  if (asking) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onboard();
        }}
        className="shrink-0 flex items-center gap-1"
      >
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={40}
          className="w-24 px-2 py-1 border border-[#ccc] bg-transparent text-[11px] font-semibold uppercase tracking-[0.09em] outline-none focus:border-[#111]"
        />
        <button
          type="submit"
          disabled={busy || !name.trim()}
          className="px-2 py-1 border border-[#ccc] hover:border-[#111] text-[11px] font-semibold uppercase tracking-[0.09em] disabled:opacity-60"
        >
          Go
        </button>
      </form>
    );
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
