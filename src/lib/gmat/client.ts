import type { AnswerState, QuestionResult } from "../practice-types";

// Fire-and-forget: sends a finished set to Neon, one POST per node. Any
// failure (no key, no database, not onboarded, offline) is ignored — the
// attempt is already stored locally. Only the chosen letter is sent; the
// server grades it.
export function recordGmatAttempt(
  results: QuestionResult[],
  answers: Record<string, AnswerState>,
  durationSec: number
) {
  const byNode = new Map<string, { questionId: string; selected: string | null }[]>();
  for (const r of results) {
    if (r.score === null) continue; // skipped
    const list = byNode.get(r.node) ?? [];
    list.push({ questionId: r.questionId, selected: answers[r.questionId]?.choice ?? null });
    byNode.set(r.node, list);
  }
  byNode.forEach((list, node) => {
    fetch("/api/gmat/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ node, answers: list, timeSeconds: durationSec }),
      keepalive: true,
    }).catch(() => {});
  });
}
