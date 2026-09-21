"use client";

import { BookOpen } from "lucide-react";

export function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-14 w-full px-gutter flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-sm min-w-0">
          <BookOpen size={22} className="text-primary shrink-0" strokeWidth={2} />
          <div className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant truncate">
            <span className="truncate">Personal Workspace</span>
            <span className="text-outline-variant">/</span>
            <span className="text-on-surface font-headline-sm text-headline-sm truncate">
              Study Planner
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
