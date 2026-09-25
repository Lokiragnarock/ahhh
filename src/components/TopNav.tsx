"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { blockElapsed, blockPhase, finishBlock, fmtClock, STUDY_MIN, LOG_MIN, useBlockTimer } from "@/lib/practice-store";

const LINKS = [
  { href: "/", label: "Territory" },
  { href: "/practice", label: "Practice" },
  { href: "/errors", label: "Error book" },
  { href: "/standing", label: "Standing" },
  { href: "/block", label: "Block" },
];

export function TopNav() {
  const pathname = usePathname() ?? "/";
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-[#e5e5e5]">
      <div className="h-12 max-w-[1200px] mx-auto px-4 flex items-center gap-5">
        <nav className="flex items-center gap-5 overflow-x-auto min-w-0 flex-1 no-scrollbar">
          {LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`shrink-0 text-[11px] font-semibold uppercase tracking-[0.09em] py-1 border-b ${
                  active ? "text-[#111] border-[#111]" : "text-[#888] border-transparent hover:text-[#111]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <BlockIndicator />
      </div>
    </header>
  );
}

function BlockIndicator() {
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
    if (timer && phase === "done") finishBlock();
  }, [timer, phase]);

  if (!timer) return null;
  const remaining = phase === "study" ? STUDY_MIN * 60000 - elapsed : (STUDY_MIN + LOG_MIN) * 60000 - elapsed;

  return (
    <Link
      href={phase === "log" ? "/errors" : "/block"}
      className="shrink-0 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#111]"
      title="Block timer"
    >
      <span
        className={`inline-block w-[7px] h-[7px] ${timer.runningSince ? "bg-[#111] animate-pulse" : "bg-[#bbb]"}`}
      />
      <span className="hidden sm:inline">{phase === "study" ? `${timer.round} study` : "Error log"}</span>
      <span className="tabular-nums">{fmtClock(remaining)}</span>
    </Link>
  );
}
