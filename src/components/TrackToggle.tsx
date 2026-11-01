"use client";

import { useState } from "react";
import { useTrack } from "@/lib/tracks-context";
import { TRACK_SLUGS, TRACKS, type TrackSlug } from "@/lib/tracks";

// Header buttons that switch track: one per track you are not on, each
// labelled with the track it switches to. With two tracks this is the old
// single AHH/GMAT flip.
export function TrackToggle() {
  const track = useTrack();
  const [busy, setBusy] = useState(false);
  const [asking, setAsking] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState<TrackSlug | null>(null);
  const targets = TRACK_SLUGS.filter((t) => t !== track);

  async function flip(to: TrackSlug) {
    if (busy) return;
    setBusy(true);
    setTarget(to);
    try {
      // First time on a heavy track (GMAT) from this device: ask for a name
      // before switching.
      if (TRACKS[to].heavy) {
        const me = await fetch("/api/gmat/me")
          .then((r) => r.json() as Promise<{ player: unknown }>)
          .catch(() => ({ player: {} }));
        if (!me.player) {
          setAsking(true);
          return;
        }
      }
      await switchTrack(to);
    } finally {
      setBusy(false);
    }
  }

  async function onboard() {
    const n = name.trim();
    if (busy || !n || !target) return;
    setBusy(true);
    try {
      // A failure here (no storage configured) still lets the switch happen;
      // practice just stays local.
      await fetch("/api/gmat/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: n }),
      }).catch(() => {});
      await switchTrack(target);
    } finally {
      setBusy(false);
    }
  }

  async function switchTrack(to: TrackSlug) {
    const res = await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track: to }),
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
          className="gradient-button rounded-[7px] px-3 py-1 text-white text-[11px] font-semibold uppercase tracking-[0.09em] disabled:opacity-60"
        >
          Go
        </button>
      </form>
    );
  }

  return (
    <div className="shrink-0 flex items-center gap-1">
      {targets.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => flip(t)}
          disabled={busy}
          title={`Switch to ${TRACKS[t].label}`}
          className={`gradient-button ${
            t === "ahh" ? "gradient-button-variant" : ""
          } rounded-[7px] shrink-0 px-3 py-1 text-white text-[11px] font-semibold uppercase tracking-[0.09em] ${
            busy && target === t ? "opacity-60" : ""
          }`}
        >
          {TRACKS[t].label}
        </button>
      ))}
    </div>
  );
}
