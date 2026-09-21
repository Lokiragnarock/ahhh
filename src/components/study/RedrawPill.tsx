"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// The only way out of Focus. Deliberately not a close button: it always
// leads to the redraw step, never back to the note or the map.
export function RedrawPill({ slug }: { slug: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    try {
      await fetch("/api/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, state: "studied" }),
      });
    } catch {
      // Non-fatal — the redraw step still proceeds even if the write failed.
    }
    router.push(`/redraw/${encodeURIComponent(slug)}`);
  }

  return (
    <button type="button" onClick={handleClick} disabled={pending} className="sp-pill">
      {pending ? "…" : "Redraw the map"}
    </button>
  );
}
