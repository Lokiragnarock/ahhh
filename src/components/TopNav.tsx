"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { blockElapsed, blockPhase, finishBlock, fmtClock, STUDY_MIN, LOG_MIN, useBlockTimer } from "@/lib/practice-store";
import { SyncLinkButton } from "@/components/SyncLinkButton";
import { useSubject } from "@/lib/subject/context";
import { TrackToggle } from "@/components/TrackToggle";
import { useTrack } from "@/lib/tracks-context";
import { TRACKS } from "@/lib/tracks";

export function TopNav() {
  const pathname = usePathname() ?? "/";
  const links = TRACKS[useTrack()].nav;
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-[color:var(--sp-line)]">
      <div className="h-12 max-w-[1200px] mx-auto px-4 flex items-center gap-5">
        <nav className="flex items-center gap-5 overflow-x-auto min-w-0 flex-1 no-scrollbar">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`shrink-0 text-[11px] font-semibold uppercase tracking-[0.09em] py-1 border-b-2 ${
                  active
                    ? "text-[color:var(--sp-ink)] border-[color:var(--sp-accent)]"
                    : "text-[color:var(--sp-muted)] border-transparent hover:text-[color:var(--sp-ink)]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <TrackToggle />
        <SyncLinkButton />
        <BlockIndicator />
      </div>
    </header>
  );
}

function BlockIndicator() {
  const subject = useSubject();
  const [timer] = useBlockTimer();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!timer?.runningSince) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [timer?.runningSince]);

  const elapsed = timer ? blockElapsed(timer, now) : 0;
  const phase = blockPhase(elapsed);

  useEffect(() => {
    if (timer && phase === "done") finishBlock(subject);
  }, [timer, phase, subject]);

  if (!timer) return null;
  const remaining = phase === "study" ? STUDY_MIN * 60000 - elapsed : (STUDY_MIN + LOG_MIN) * 60000 - elapsed;

  return (
    <Link
      href={phase === "log" ? "/errors" : "/block"}
      className="shrink-0 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[color:var(--sp-ink)]"
      title="Block timer"
    >
      <span
        className={`inline-block w-[7px] h-[7px] ${timer.runningSince ? "bg-[color:var(--sp-accent)] animate-pulse" : "bg-[#bbb]"}`}
      />
      <span className="hidden sm:inline">{phase === "study" ? `${timer.round} study` : "Error log"}</span>
      <span className="sp-num">{fmtClock(remaining)}</span>
    </Link>
  );
}
