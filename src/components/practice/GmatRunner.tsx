"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { optionLetter, RenderedQuestion } from "@/lib/question-types";
import type { AnswerState, Attempt, SessionState } from "@/lib/practice-types";
import { fmtClock, KEYS, readStored, uid, updateStored } from "@/lib/practice-store";
import { currentDevice } from "@/lib/sync/client";
import { useSubject } from "@/lib/subject/context";
import { recordGmatAttempt } from "@/lib/gmat/client";
import { build, Props, QuestionBlock, Results, scorePaper, Sessions } from "./TestRunner";

const SECS_PER_Q = 128; // 45 min / 21 questions, about 2.133 min each
const MAX_EDITS = 3;

// Reading Comprehension stems open with the passage, then the question in the
// last paragraph. Split there so the passage can sit beside the question.
function splitPassage(html: string, verbal: boolean): { passage: string; question: string } | null {
  const paras = html.match(/<p[\s>]/g)?.length ?? 0;
  const labelled = /^\s*<p[^>]*>\s*(<strong>)?\s*passage/i.test(html);
  if (!(labelled ? paras >= 2 : verbal && paras >= 3)) return null;
  const at = html.lastIndexOf("<p");
  return { passage: html.slice(0, at), question: html.slice(at) };
}

export function GmatRunner({ pool, kind, scope, resolveEntryId, next, limit }: Props) {
  const subject = useSubject();
  const keys = useMemo(() => KEYS(subject), [subject]);
  const key = `${kind}:${scope}`;
  const qmap = useMemo(() => new Map(pool.map((q) => [q.id, q])), [pool]);
  const [session, setSession] = useState<SessionState | null>(null);
  const [done, setDone] = useState<{ attempt: Attempt | null } | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [pending, setPending] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [viewing, setViewing] = useState<number | null>(null); // review stage: question being revisited
  const [ending, setEnding] = useState(false);
  const finishing = useRef(false);

  const fresh = useCallback((): SessionState => {
    const paper = build(pool, kind, scope, limit);
    const count = paper.sections.reduce((n, s) => n + s.questionIds.length, 0);
    return {
      key,
      paper: { ...paper, durationMin: (count * SECS_PER_Q) / 60 },
      startedAt: Date.now(),
      endedAt: null,
      answers: {},
      phase: "answer",
      gmatIndex: 0,
      gmatStage: "answer",
      gmatEdits: 0,
    };
  }, [key, pool, kind, scope, limit]);

  useEffect(() => {
    const stored = readStored<Sessions>(keys.session, {})[key];
    // A session left by the old scrolling runner has no gmatStage and an
    // untimed start, so resuming it would auto-submit at once. Start fresh.
    if (stored?.gmatStage && stored.paper.sections.some((s) => s.questionIds.length > 0) && stored.paper.sections.every((s) => s.questionIds.every((id) => qmap.has(id)))) {
      setSession(stored);
    } else {
      setSession(fresh());
    }
  }, [key, qmap, fresh, keys]);

  useEffect(() => {
    if (!session || done) return;
    updateStored<Sessions>(keys.session, {}, (prev) => ({ ...prev, [key]: session }));
  }, [session, key, done, keys]);

  useEffect(() => {
    if (!session || done) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [session, done]);

  const paper = session?.paper;
  const allIds = useMemo(() => (paper ? paper.sections.flatMap((s) => s.questionIds) : []), [paper]);
  const durationMs = allIds.length * SECS_PER_Q * 1000;
  const startedAt = session?.startedAt ?? 0;
  const elapsed = session ? (session.endedAt ?? now) - startedAt : 0;
  const timeUp = session !== null && allIds.length > 0 && elapsed >= durationMs;

  const finish = useCallback(
    (endedAt: number) => {
      if (!session || !paper || finishing.current) return;
      finishing.current = true;
      const answers = session.answers;
      const { results, score, max } = scorePaper(paper, answers, qmap);
      const attempt: Attempt = {
        id: uid(),
        kind: kind as Attempt["kind"],
        scope,
        date: new Date(session.startedAt).toISOString(),
        durationSec: Math.round((endedAt - session.startedAt) / 1000),
        score,
        max,
        results,
        device: currentDevice(),
      };
      updateStored<Attempt[]>(keys.attempts, [], (prev) => [...prev, attempt]);
      recordGmatAttempt(results, answers, attempt.durationSec);
      updateStored<Sessions>(keys.session, {}, (prev) => {
        const rest = { ...prev };
        delete rest[key];
        return rest;
      });
      setSession({ ...session, endedAt });
      setDone({ attempt });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [session, paper, qmap, kind, scope, keys, key]
  );

  // Clock hits zero: straight to results, unanswered counts as wrong.
  useEffect(() => {
    if (timeUp && !done) finish(startedAt + durationMs);
  }, [timeUp, done, finish, startedAt, durationMs]);

  const index = session?.gmatIndex ?? 0;
  const stage = session?.gmatStage ?? "answer";
  const edits = session?.gmatEdits ?? 0;
  const openId = stage === "answer" ? allIds[index] : viewing !== null ? allIds[viewing] : undefined;

  // Each screen starts from whatever answer is already on record.
  useEffect(() => {
    setPending(openId ? session?.answers[openId]?.choice ?? null : null);
    setConfirming(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId]);

  if (!session || !paper) {
    return <div className="sp-wrap"><p className="sp-label">Loading paper…</p></div>;
  }

  const answers = session.answers;

  function patch(id: string, p: Partial<AnswerState>) {
    setSession((s) => (s ? { ...s, answers: { ...s.answers, [id]: { ...s.answers[id], ...p } } } : s));
  }

  function restart() {
    finishing.current = false;
    setDone(null);
    setViewing(null);
    setEnding(false);
    setSession(fresh());
  }

  function confirmAnswer() {
    if (!pending || !openId) return;
    if (stage === "answer") {
      patch(openId, { choice: pending });
      const last = index + 1 >= allIds.length;
      setSession((s) => (s ? { ...s, gmatIndex: last ? index : index + 1, gmatStage: last ? "review" : "answer" } : s));
    } else {
      const changed = pending !== answers[openId]?.choice;
      if (changed) {
        patch(openId, { choice: pending });
        setSession((s) => (s ? { ...s, gmatEdits: (s.gmatEdits ?? 0) + 1 } : s));
      }
      setViewing(null);
    }
    setConfirming(false);
    window.scrollTo({ top: 0 });
  }

  const header = (
    <div className="sp-timer-bar">
      <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="sp-label mb-0 truncate">{paper.title}</div>
          <div className="text-[12px] text-[color:var(--sp-muted)]">
            {done
              ? "Done"
              : stage === "answer"
              ? `Question ${index + 1} of ${allIds.length}`
              : viewing !== null
              ? `Question ${viewing + 1} of ${allIds.length}`
              : "Review and edit"}
          </div>
        </div>
        <div
          className={`text-[20px] font-semibold tabular-nums ${
            !done && durationMs - elapsed < 300000 ? "text-[#e03e3e]" : "text-[color:var(--sp-ink)]"
          }`}
        >
          {done ? fmtClock(elapsed) : fmtClock(durationMs - elapsed)}
        </div>
      </div>
    </div>
  );

  if (done) {
    let n = 0;
    return (
      <div>
        {header}
        <div className="max-w-[860px] mx-auto px-4 pt-8 pb-32">
          <Results
            paper={paper}
            kind={kind}
            attempt={done.attempt}
            answers={answers}
            qmap={qmap}
            resolveEntryId={resolveEntryId}
            onRestart={restart}
            next={next}
          />
          {allIds.map((id) => {
            const q = qmap.get(id);
            if (!q) return null;
            n += 1;
            return <QuestionBlock key={id} n={n} q={q} a={answers[id]} phase="done" optional={false} canReveal onChange={() => {}} />;
          })}
        </div>
      </div>
    );
  }

  if (allIds.length === 0) {
    return (
      <div>
        {header}
        <div className="max-w-[860px] mx-auto px-4 pt-8">
          <div className="sp-panel">
            <p className="sp-body-text">No questions in this pool yet.</p>
            <Link href="/practice" className="sp-quiet-link">Back to practice</Link>
          </div>
        </div>
      </div>
    );
  }

  const q = openId ? qmap.get(openId) : undefined;
  const editable = stage === "answer" || edits < MAX_EDITS;
  const changed = stage === "review" && !!q && pending !== null && pending !== answers[q.id]?.choice;

  return (
    <div>
      {header}
      <div className="max-w-[1200px] mx-auto px-4 pt-8 pb-32">
        {q ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <button
                type="button"
                className={`sp-btn sp-btn-sm ${answers[q.id]?.bookmarked ? "" : "sp-btn-ghost"}`}
                aria-pressed={!!answers[q.id]?.bookmarked}
                onClick={() => patch(q.id, { bookmarked: !answers[q.id]?.bookmarked })}
              >
                {answers[q.id]?.bookmarked ? "Bookmarked" : "Bookmark"}
              </button>
              {stage === "review" && (
                <span className="text-[12.5px] text-[color:var(--sp-muted)]">
                  {editable ? `Edits left: ${MAX_EDITS - edits} of ${MAX_EDITS}` : "No edits left. View only."}
                </span>
              )}
            </div>
            <QuestionScreen q={q} choice={pending} editable={editable} onPick={(l) => setPending(l)} />
            <div className="max-w-[860px] flex flex-wrap items-center gap-3 pt-4 mt-4 border-t border-[color:var(--sp-line)]">
              {confirming ? (
                <>
                  <span className="text-[13px] text-[color:var(--sp-ink)]">
                    {stage === "answer" ? "Confirm this answer?" : "Change your answer? This uses one edit."}
                  </span>
                  <button type="button" className="sp-btn" onClick={confirmAnswer}>Confirm answer</button>
                  <button type="button" className="sp-btn sp-btn-ghost" onClick={() => setConfirming(false)}>Cancel</button>
                </>
              ) : stage === "answer" ? (
                <button type="button" className="sp-btn" disabled={!pending} onClick={() => setConfirming(true)}>
                  Next
                </button>
              ) : (
                <>
                  {changed && (
                    <button type="button" className="sp-btn" onClick={() => setConfirming(true)}>
                      Save change
                    </button>
                  )}
                  <button type="button" className="sp-btn sp-btn-ghost" onClick={() => setViewing(null)}>
                    Return to review
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="max-w-[860px]">
            <div className="sp-panel mb-6">
              <div className="sp-label">Review and edit</div>
              <p className="sp-body-text mb-2">
                Open any question to look again or bookmark it. You can change up to {MAX_EDITS} answers in total.
              </p>
              <div className="text-[13px] text-[#555]">
                Edits left <strong className="text-[color:var(--sp-ink)]">{MAX_EDITS - edits} of {MAX_EDITS}</strong>
              </div>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2 mb-6">
              {allIds.map((id, i) => {
                const a = answers[id];
                return (
                  <button key={id} type="button" className="sp-option !mb-0 !text-center" onClick={() => setViewing(i)}>
                    <div className="text-[15px] font-semibold">{i + 1}</div>
                    <div className="text-[11px] text-[color:var(--sp-muted)]">{a?.choice ? "Answered" : "Unanswered"}</div>
                    <div className="text-[11px] text-[color:var(--sp-muted)]">{a?.bookmarked ? "Bookmarked" : " "}</div>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[color:var(--sp-line)]">
              {ending ? (
                <>
                  <span className="text-[13px]">End the section and submit? You cannot return.</span>
                  <button type="button" className="sp-btn" onClick={() => finish(Date.now())}>Confirm</button>
                  <button type="button" className="sp-btn sp-btn-ghost" onClick={() => setEnding(false)}>Cancel</button>
                </>
              ) : (
                <button type="button" className="sp-btn" onClick={() => setEnding(true)}>End section</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionScreen({
  q,
  choice,
  editable,
  onPick,
}: {
  q: RenderedQuestion;
  choice: string | null;
  editable: boolean;
  onPick: (letter: string) => void;
}) {
  const split = splitPassage(q.questionHtml, q.unit.toLowerCase().includes("verbal") || q.node.startsWith("V-"));
  const stem = split ? split.question : q.questionHtml;

  const body = (
    <div>
      <div className="sp-q-text mb-4" dangerouslySetInnerHTML={{ __html: stem }} />
      {(q.options ?? []).map((opt, i) => {
        const letter = optionLetter(opt);
        const chosen = choice === letter;
        return (
          <button
            key={i}
            type="button"
            className={`sp-option ${chosen ? "sp-option-chosen" : ""}`}
            aria-pressed={chosen}
            disabled={!editable}
            onClick={() => onPick(letter)}
          >
            <span dangerouslySetInnerHTML={{ __html: q.optionsHtml?.[i] ?? opt }} />
          </button>
        );
      })}
    </div>
  );

  if (!split) return <div className="max-w-[860px]">{body}</div>;
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:h-[calc(100vh-190px)]">
      <div className="sp-q-text lg:overflow-y-auto lg:pr-4 lg:border-r lg:border-[color:var(--sp-line)]" dangerouslySetInnerHTML={{ __html: split.passage }} />
      <div className="lg:overflow-y-auto">{body}</div>
    </div>
  );
}
