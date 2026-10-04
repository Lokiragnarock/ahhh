"use client";

import { useTrack } from "@/lib/tracks-context";
import { TRACKS } from "@/lib/tracks";

// Shared page head: track label eyebrow above the page name. `sub` is an
// optional quiet line under the title.
export function PageHead({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  const track = TRACKS[useTrack()];
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <div className="sp-eyebrow">{track.label}</div>
        <h1 className="sp-h1">{title}</h1>
        {sub && <div className="sp-sub">{sub}</div>}
      </div>
      {children}
    </div>
  );
}
