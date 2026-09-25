"use client";

import Link from "next/link";
import type { UnitIndex } from "@/lib/questions";
import type { SessionState } from "@/lib/practice-types";
import { fmtDate, isDue, KEYS, lastAttempt, pct, useAttempts, useErrors, useStored } from "@/lib/practice-store";
import { PageHead, RepsStrip } from "./bits";

const NO_SESSIONS: Record<string, SessionState> = {};

export function PracticeHub({
  units,
  mockPool,
  total,
}: {
  units: UnitIndex[];
  mockPool: { short: number; long: number; case: number };
  total: number;
}) {
  const [attempts] = useAttempts();
  const [errors] = useErrors();
  const [sessions] = useStored(KEYS.session, NO_SESSIONS);
  const due = errors.filter((e) => isDue(e)).length;
  const lastMock = lastAttempt(attempts, "mock", "mock");
  const mockReady = mockPool.short + mockPool.long + mockPool.case > 0;

  return (
    <div className="sp-wrap">
      <PageHead title="Practice" kicker={`Taxation Law · ${total} questions in the bank`}>
        {due > 0 && (
          <Link href="/errors" className="sp-btn sp-btn-ghost">
            {due} error{due === 1 ? "" : "s"} due to re-solve
          </Link>
        )}
      </PageHead>

      <div className="mb-8">
        <RepsStrip />
      </div>

      <div className="sp-panel mb-8 flex flex-wrap items-center gap-6">
        <div className="flex-1 min-w-[240px]">
          <div className="sp-label">R3 · Full ESE mock</div>
          <div className="text-[18px] font-semibold text-[#111] mb-1">50 marks · 2 hours</div>
          <div className="text-[13px] text-[#555]">
            A: any 3 of 5 short · B: any 2 of 3 long · C: 1 case. Pool now: {mockPool.short} short, {mockPool.long} long,{" "}
            {mockPool.case} case.
          </div>
        </div>
        <div className="text-right">
          <div className="sp-label">Last mock</div>
          <div className="text-[20px] font-semibold tabular-nums">
            {lastMock ? `${pct(lastMock.score, lastMock.max)}%` : "—"}
          </div>
          {lastMock && <div className="text-[12px] text-[#888]">{fmtDate(lastMock.date)}</div>}
        </div>
        {mockReady ? (
          <Link href="/practice/mock" className="sp-btn">
            {sessions["mock:mock"] ? "Resume mock" : "Full mock"}
          </Link>
        ) : (
          <span className="sp-btn opacity-40">Full mock</span>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {units.map((u) => {
          const lastSec = lastAttempt(attempts, "sectional", u.unit);
          return (
            <section key={u.unit} className="sp-panel">
              <div className="flex flex-wrap items-center gap-4 border-b border-[#111] pb-3 mb-1">
                <div className="flex-1 min-w-[160px]">
                  <h2 className="sp-h2 !mb-0">{u.unit}</h2>
                  <div className="text-[12px] text-[#888]">
                    {u.nodes.length} node{u.nodes.length === 1 ? "" : "s"} · {u.qCount} questions
                  </div>
                </div>
                <div className="text-right">
                  <div className="sp-label !mb-0">Last sectional</div>
                  <div className="text-[15px] font-semibold tabular-nums">
                    {lastSec ? `${pct(lastSec.score, lastSec.max)}%` : "—"}
                  </div>
                </div>
                {u.qCount > 0 ? (
                  <Link href={`/practice/unit/${encodeURIComponent(u.unit)}`} className="sp-btn">
                    {sessions[`sectional:${u.unit}`] ? "Resume sectional" : "Sectional test"}
                  </Link>
                ) : (
                  <span className="sp-btn opacity-40">Sectional test</span>
                )}
              </div>
              <ul>
                {u.nodes.map((n) => {
                  const last = lastAttempt(attempts, "mini", n.id);
                  const tries = attempts.filter((a) => a.kind === "mini" && a.scope === n.id).length;
                  return (
                    <li key={n.id} className="sp-row">
                      <span className="font-semibold w-12 shrink-0">{n.id}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[#333] line-clamp-2">
                          {n.slug ? (
                            <Link href={`/topic/${encodeURIComponent(n.slug)}`} className="hover:underline">
                              {n.title}
                            </Link>
                          ) : (
                            n.title
                          )}
                        </div>
                        <div className="sm:hidden text-[12px] text-[#888] mt-0.5">
                          {n.qCount} q · {last ? `${pct(last.score, last.max)}% ×${tries}` : "not taken"}
                        </div>
                      </div>
                      <span className="hidden sm:block text-[12px] text-[#888] w-12 text-right shrink-0">{n.qCount} q</span>
                      <span className="hidden sm:block text-[13px] tabular-nums w-24 text-right shrink-0">
                        {last ? (
                          <>
                            <strong>{pct(last.score, last.max)}%</strong>
                            <span className="text-[#888]"> ×{tries}</span>
                          </>
                        ) : (
                          <span className="text-[#bbb]">not taken</span>
                        )}
                      </span>
                      {n.qCount > 0 ? (
                        <Link
                          href={`/practice/topic/${encodeURIComponent(n.id)}`}
                          className="sp-btn sp-btn-ghost sp-btn-sm w-[96px] shrink-0"
                        >
                          {sessions[`mini:${n.id}`] ? "Resume" : "Mini test"}
                        </Link>
                      ) : (
                        <span className="sp-btn sp-btn-ghost sp-btn-sm w-[96px] shrink-0 opacity-40">No qs</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
        {units.length === 0 && <p className="sp-body-text">No questions found in content/tests/taxation.</p>}
      </div>
    </div>
  );
}
