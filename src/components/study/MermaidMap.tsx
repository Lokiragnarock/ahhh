"use client";

import { useEffect, useId, useRef } from "react";
import mermaid from "mermaid";

let mermaidInitialized = false;

function ensureMermaidInit() {
  if (mermaidInitialized) return;
  mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose" });
  mermaidInitialized = true;
}

// Renders a topic's raw mermaid graph text into an SVG on reveal. Init runs
// once module-wide, render runs per mount with a unique id.
export function MermaidMap({ definition }: { definition: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const renderId = `sp-mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    let cancelled = false;
    ensureMermaidInit();

    async function render() {
      try {
        const { svg } = await mermaid.render(renderId, definition);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = "";
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [definition, renderId]);

  return <div ref={containerRef} className="sp-mermaid-container" />;
}
