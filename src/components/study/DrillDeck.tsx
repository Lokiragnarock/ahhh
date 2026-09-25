"use client";

import Link from "next/link";
import { useState } from "react";
import { Flashcard } from "@/lib/study-types";
import type { Step } from "@/lib/flow";

type Judgment = "missed" | "shaky" | "got-it";

async function postState(slug: string, state: string, force?: boolean) {
  try {
    await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, state, force }),
    });
  } catch {
    // Non-fatal, the summary still shows either way.
  }
}

// Screen 6's card-by-card drill loop. One topic's flashcards, self-graded
// three ways, ends with a demote (missed anything) or promote (clean run)
// write to the vault.
export function DrillDeck({
  flashcards,
  slug,
  nodeId,
  next,
}: {
  flashcards: Flashcard[];
  slug: string;
  nodeId: string;
  next: Step;
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [judgments, setJudgments] = useState<Judgment[]>([]);
  const [finalized, setFinalized] = useState(false);
  const [sending, setSending] = useState(false);

  if (flashcards.length === 0) {
    return (
      <div className="sp-focus-column">
        <p className="sp-body-text mb-8">No flashcards on this note yet.</p>
        <Link href={next.href} className="sp-pill-static inline-block">
          {next.label}
        </Link>
        <div className="mt-6">
          <Link href={`/topic/${encodeURIComponent(slug)}`} className="sp-quiet-link">
            Back to topic
          </Link>
        </div>
      </div>
    );
  }

  const total = flashcards.length;
  const current = flashcards[index];

  async function handleJudge(judgment: Judgment) {
    const next = [...judgments, judgment];
    setJudgments(next);

    if (index + 1 < total) {
      setIndex(index + 1);
      setRevealed(false);
      return;
    }

    setSending(true);
    const anyMissed = next.some((j) => j === "missed");
    if (anyMissed) {
      await postState(slug, "studied", true);
    } else {
      await postState(slug, "drilled");
    }
    setSending(false);
    setFinalized(true);
  }

  function restart() {
    setIndex(0);
    setRevealed(false);
    setJudgments([]);
    setFinalized(false);
  }

  if (finalized) {
    const missedCount = judgments.filter((j) => j === "missed").length;
    const shakyCount = judgments.filter((j) => j === "shaky").length;
    const anyMissed = missedCount > 0;
    return (
      <div className="sp-drill-card">
        <div className="sp-label mb-3">{nodeId} · drill done</div>
        <h1 className="sp-h1 mb-3">
          {anyMissed ? `${missedCount} missed of ${total}.` : `All ${total} recalled.`}
        </h1>
        <p className="sp-body-text mb-10">
          {anyMissed
            ? "Drill it again now, or carry on and let the mini test and error book catch the gaps."
            : shakyCount > 0
              ? `${shakyCount} shaky. Next step in the loop:`
              : "Clean run. Next step in the loop:"}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={next.href} className="sp-pill-static inline-block">
            {next.label}
          </Link>
          {anyMissed && (
            <button type="button" className="sp-judge-btn !flex-none px-6" onClick={restart}>
              Drill again
            </button>
          )}
        </div>
        <div className="mt-8 flex gap-6">
          <Link href={`/topic/${encodeURIComponent(slug)}`} className="sp-quiet-link">
            Back to note
          </Link>
          {!anyMissed && (
            <button type="button" className="sp-quiet-link" onClick={restart}>
              Drill again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="sp-drill-card">
      <div className="sp-drill-header">
        <div className="sp-label">{nodeId}</div>
        <div className="sp-label">
          {index + 1} of {total}
        </div>
      </div>
      <div className="sp-progress-rail">
        <div className="sp-progress-rail-fill" style={{ width: `${(index / total) * 100}%` }} />
      </div>

      <p className="sp-drill-question">{current.q}</p>

      {revealed && <p className="sp-drill-answer">{current.a}</p>}

      {!revealed ? (
        <button type="button" className="sp-pill-static" onClick={() => setRevealed(true)}>
          Show answer
        </button>
      ) : (
        <div className="sp-judge-row">
          <button type="button" disabled={sending} className="sp-judge-btn sp-judge-missed" onClick={() => handleJudge("missed")}>
            Missed
          </button>
          <button type="button" disabled={sending} className="sp-judge-btn" onClick={() => handleJudge("shaky")}>
            Shaky
          </button>
          <button type="button" disabled={sending} className="sp-judge-btn" onClick={() => handleJudge("got-it")}>
            Got it
          </button>
        </div>
      )}
    </div>
  );
}
