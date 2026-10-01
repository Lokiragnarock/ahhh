"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

let mermaidInitialized = false;

function ensureMermaidInit() {
  if (mermaidInitialized) return;
  // suppressErrorRendering stops mermaid appending its "Syntax error" bomb
  // graphic to <body> when a render fails; we handle failure ourselves.
  mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose", suppressErrorRendering: true });
  mermaidInitialized = true;
}

// mermaid.render is not safe to run concurrently (shared parser state), and
// client-side navigation can start a new page's render while the previous
// one is still in flight. Every render goes through this one queue.
let renderQueue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = renderQueue.then(task, task);
  renderQueue = run.catch(() => undefined);
  return run;
}

// A fresh id per render call. useId repeats across pages after a soft
// navigation, and a stale element with the same id breaks the next render.
let renderCounter = 0;

function removeLeftovers(id: string) {
  document.getElementById(id)?.remove();
  document.getElementById(`d${id}`)?.remove();
}

// Renders a topic's raw mermaid graph text into an SVG on reveal. One retry
// covers transient failures; if both attempts fail the card says so instead
// of staying blank.
export function MermaidMap({ definition }: { definition: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    ensureMermaidInit();

    async function render() {
      for (let attempt = 0; attempt < 2; attempt++) {
        const id = `sp-mermaid-${++renderCounter}`;
        try {
          const { svg } = await enqueue(() => mermaid.render(id, definition));
          if (!cancelled && containerRef.current) containerRef.current.innerHTML = svg;
          return;
        } catch (err) {
          removeLeftovers(id);
          if (attempt === 1) {
            console.error("Concept map failed to render", err);
            if (!cancelled && containerRef.current) {
              containerRef.current.textContent = "This concept map could not be drawn. Reload the page to try again.";
            }
          }
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [definition]);

  return <div ref={containerRef} className="sp-mermaid-container" />;
}
