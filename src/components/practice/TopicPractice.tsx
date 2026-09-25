"use client";

import Link from "next/link";
import { fmtDate, isDue, lastAttempt, pct, useAttempts, useErrors } from "@/lib/practice-store";

export function LastMiniScore({ node }: { node: string }) {
  const [attempts] = useAttempts();
  const last = lastAttempt(attempts, "mini", node);
  const tries = attempts.filter((a) => a.kind === "mini" && a.scope === node).length;
  if (!last) return <span className="text-[#888]">Not taken</span>;
  return (
    <span>
      {pct(last.score, last.max)}% <span className="text-[#888] font-normal">({last.score}/{last.max}, {fmtDate(last.date)}, ×{tries})</span>
    </span>
  );
}

export function TopicErrors({ node }: { node: string }) {
  const [errors, , hydrated] = useErrors();
  const open = errors.filter((e) => e.node === node && e.status !== "mastered");
  if (!hydrated || open.length === 0) return null;
  const due = open.filter((e) => isDue(e)).length;

  return (
    <section className="sp-section">
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2 className="sp-h2 !mb-0">Error book for this topic · {open.length}</h2>
        <Link href="/errors" className="sp-quiet-link">
          {due > 0 ? `${due} due` : "Open"} &rarr;
        </Link>
      </div>
      <ul className="flex flex-col gap-4">
        {open.map((e) => (
          <li key={e.id} className="border-l-2 border-[#e03e3e] pl-4">
            <div className="text-[12px] text-[#888] mb-1">
              {e.questionId ?? "Manual"} · {e.errorType}
              {e.scoreText ? ` · ${e.scoreText}` : ""}
            </div>
            {e.questionText && <p className="text-[14px] text-[#111] mb-2">{e.questionText}</p>}
            {e.correct && (
              <p className="text-[13.5px] text-[#333] mb-1 whitespace-pre-wrap">
                <span className="font-semibold text-[#111]">Correct method: </span>
                {e.correct}
              </p>
            )}
            {e.avoid && (
              <p className="text-[13.5px] text-[#333] whitespace-pre-wrap">
                <span className="font-semibold text-[#111]">Avoid: </span>
                {e.avoid}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
