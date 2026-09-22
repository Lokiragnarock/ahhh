"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Reveal screen's primary action: writes the "mapped" state, then advances
// to drill. Follows RedrawPill's non-fatal fetch pattern.
export function MarkMappedPill({ slug }: { slug: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    try {
      await fetch("/api/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, state: "mapped" }),
      });
    } catch {
      // Non-fatal, still proceed to drill.
    }
    router.push(`/drill/${encodeURIComponent(slug)}`);
  }

  return (
    <button type="button" onClick={handleClick} disabled={pending} className="sp-pill">
      {pending ? "…" : "Mark as mapped"}
    </button>
  );
}
