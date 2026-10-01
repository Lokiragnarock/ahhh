"use client";

import { useState } from "react";
import { MermaidMap } from "@/components/study/MermaidMap";

// Optional peek at the concept map from the note page. Collapsed by default so
// the redraw-from-memory step still means something; the map only renders
// once it is opened.
export function ShowMapToggle({ definition }: { definition: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sp-section">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="sp-btn sp-btn-ghost"
      >
        {open ? "Hide map" : "Show map"}
      </button>
      {open && (
        <div className="mt-6">
          <MermaidMap definition={definition} />
        </div>
      )}
    </div>
  );
}
