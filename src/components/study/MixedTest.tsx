"use client";

import Link from "next/link";
import { useState } from "react";

export interface PoolCard {
  q: string;
  a: string;
  topicId: string;
  topicSlug: string;
}

type Judgment = "missed" | "shaky" | "got-it";

interface RecordedJudgment {
  card: PoolCard;
  judgment: Judgment;
}

async function postState(slug: string, state: string, force?: boolean) {
  try {
    await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, state, force }),
    });
  } catch {
    // Non-fatal, results still render either way.
  }
}

// Screen 7's card loop, same shell as DrillDeck but pulling from a mixed
// pool of every drilled topic's flashcards. Ends on a per-topic results
// breakdown and an error-log send via the same /api/state route.
export function MixedTest({ pool }: { pool: PoolCard[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [records, setRecords] = useState<RecordedJudgment[]>([]);
  const [finished, setFinished] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const total = pool.length;
  const current = pool[index];

  function handleJudge(judgment: Judgment) {
    const next = [...records, { card: current, judgment }];
    setRecords(next);

    if (index + 1 < total) {
      setIndex(index + 1);
      setRevealed(false);
      return;
    }
    setFinished(true);
  }

  if (finished) {
    const byTopic = new Map<string, { topicId: string; topicSlug: string; total: number; missed: number }>();
    for (const rec of records) {
      const entry = byTopic.get(rec.card.topicSlug) ?? {
        topicId: rec.card.topicId,
        topicSlug: rec.card.topicSlug,
        total: 0,
        missed: 0,
      };
      entry.total += 1;
      if (rec.judgment === "missed") entry.missed += 1;
      byTopic.set(rec.card.topicSlug, entry);
    }
    const groups = Array.from(byTopic.values());
    const missedTopics = groups.filter((g) => g.missed > 0);

    async function handleSend() {
      setSending(true);
      for (const g of missedTopics) {
        await postState(g.topicSlug, "studied", true);
      }
      setSending(false);
      setSent(true);
    }

    return (
      <div className="sp-drill-card">
        <div className="sp-h1 mb-6">Results</div>
        <ul className="sp-results-list">
          {groups.map((g) => (
            <li key={g.topicSlug} className="sp-results-item">
              {g.missed > g.total / 2 && <span className="sp-miss-dot" />}
              <span className="sp-results-topic">{g.topicId}</span>
              <span className="sp-results-count">{g.total} cards</span>
            </li>
          ))}
        </ul>

        {sent ? (
          <p className="sp-body-text mt-6">Sent.</p>
        ) : (
          <button
            type="button"
            disabled={sending || missedTopics.length === 0}
            onClick={handleSend}
            className="sp-pill-static mt-6"
          >
            {missedTopics.length === 0 ? "No misses" : sending ? "…" : "Send misses to error log"}
          </button>
        )}

        <div className="mt-6">
          <Link href="/" className="sp-quiet-link">
            Territory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sp-drill-card">
      <div className="sp-drill-header">
        <div className="sp-label">{current.topicId}</div>
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
          <button type="button" className="sp-judge-btn sp-judge-missed" onClick={() => handleJudge("missed")}>
            Missed
          </button>
          <button type="button" className="sp-judge-btn" onClick={() => handleJudge("shaky")}>
            Shaky
          </button>
          <button type="button" className="sp-judge-btn" onClick={() => handleJudge("got-it")}>
            Got it
          </button>
        </div>
      )}
    </div>
  );
}
