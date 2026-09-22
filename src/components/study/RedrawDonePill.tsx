"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Redraw screen's primary action. No state write here, reveal owns the
// state transition. Just navigate through to the reveal step.
export function RedrawDonePill({ slug }: { slug: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  function handleClick() {
    setPending(true);
    router.push(`/reveal/${encodeURIComponent(slug)}`);
  }

  return (
    <button type="button" onClick={handleClick} disabled={pending} className="sp-pill">
      {pending ? "…" : "I've drawn it"}
    </button>
  );
}
