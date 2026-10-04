"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { chooseNextBlock, type BlockNode } from "@/lib/gmat/next-block";
import type { ErrorEntry, BlockTimer } from "@/lib/practice-types";
import {
  currentRound,
  finishBlock,
  KEYS,
  readStored,
  uid,
  useAllOf,
  useRoundsOf,
  writeStored,
} from "@/lib/practice-store";
import { currentDevice } from "@/lib/sync/client";
import { subjectLabel } from "@/lib/subject/shared";

// The one decision on the GMAT home: which block to study next, chosen by
// chooseNextBlock from this device's rounds and error book. State is
// client-side (localStorage), so the server only hands over topic metadata.
export function NextBlockCard({
  nodes,
  sectionGap,
}: {
  nodes: BlockNode[];
  sectionGap: Record<string, number>;
}) {
  const subjects = useMemo(() => Array.from(new Set(nodes.map((n) => n.subject))), [nodes]);
  const rounds = useRoundsOf(subjects);
  const allErrors = useAllOf<ErrorEntry>("errors");
  const errors = useMemo(() => allErrors.filter((e) => subjects.includes(e.subject)), [allErrors, subjects]);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const next = useMemo(
    () => (rounds ? chooseNextBlock({ nodes, rounds, errors, sectionGap }) : null),
    [nodes, rounds, errors, sectionGap]
  );

  // Cookie first so the Focus page and the block timer read the node's own
  // subject, then a full navigation so the root layout re-reads that cookie.
  async function start(node: BlockNode) {
    setBusy(true);
    setFailed(false);
    try {
      const res = await fetch("/api/subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: node.subject }),
      });
      if (!res.ok) throw new Error("subject");

      const keys = KEYS(node.subject);
      const running = readStored<BlockTimer | null>(keys.timer, null);
      if (running?.node !== node.id) {
        finishBlock(node.subject); // logs a block left over from another node
        const t = Date.now();
        const ids = nodes.filter((n) => n.subject === node.subject).map((n) => n.id);
        const timer: BlockTimer = {
          id: uid(),
          round: currentRound(rounds?.[node.subject] ?? { topics: {} }, ids),
          node: node.id,
          firstStart: t,
          runningSince: t,
          accumulatedMs: 0,
          device: currentDevice(),
        };
        writeStored(keys.timer, timer);
      }
      window.location.assign(`/focus/${encodeURIComponent(node.slug)}`);
    } catch {
      setBusy(false);
      setFailed(true);
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 mb-3">
        <h2 className="sp-h2 !mb-0">Next block</h2>
        <span className="sp-sub !mt-0">Chosen for you</span>
      </div>
      <div className="sp-panel">
        {!next ? (
          <div className="sp-sub !mt-0">Working out your next block…</div>
        ) : next.kind === "diagnostic" ? (
          <>
            <div className="text-[22px] font-semibold text-[color:var(--sp-ink-strong)]">Full-length diagnostic</div>
            <div className="sp-sub">{next.reason}</div>
            <Link href="/gmat/diagnostic" className="sp-btn mt-5">
              Sit the diagnostic
            </Link>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="sp-chip sp-chip-dark sp-num">{next.node.id}</span>
              <span className="sp-chip">{subjectLabel(next.node.subject)}</span>
            </div>
            <div className="text-[22px] font-semibold text-[color:var(--sp-ink-strong)]">
              {next.node.title.replace(/^[A-Z]-\d+:\s*/, "")}
            </div>
            <div className="sp-sub">{next.reason}</div>
            <button type="button" className="sp-btn mt-5" disabled={busy} onClick={() => start(next.node)}>
              {busy ? "Starting…" : "Start block"}
            </button>
            {failed && <p className="sp-sub">Could not start the block. Try again.</p>}
          </>
        )}
      </div>
    </section>
  );
}
