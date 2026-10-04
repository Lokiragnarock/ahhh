import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { TopNav } from "@/components/TopNav";
import { LogOfficial } from "@/components/gmat/LogOfficial";
import { NextBlockCard } from "@/components/gmat/NextBlockCard";
import { Notice, TopicTable } from "@/components/gmat/bits";
import { currentPlayer } from "@/lib/gmat/current";
import { fmtDay, ordinal } from "@/lib/gmat/format";
import { nextBlockInputs } from "@/lib/gmat/next-block-data";
import { groundCovered, RECENT_WINDOW, standing, type Standing, type TopicStat } from "@/lib/gmat/stats";

export const dynamic = "force-dynamic";

// GMAT home. Two halves that answer different questions in different units:
//   Part A, where I stand: scaled points from the latest full-length sitting.
//   Part B, ground covered: quiz accuracy in percentage points (pp).
// They are never summed or put in one column; only Part A says "points".
export default async function StatusPage() {
  const me = await currentPlayer();

  let std: Standing | null = null;
  let topics: TopicStat[] = [];
  let failed = false;
  if (me.state === "ok") {
    try {
      [std, topics] = await Promise.all([standing(me.player.id), groundCovered(me.player.id)]);
    } catch (err) {
      console.error("GMAT status load failed:", err instanceof Error ? err.message : err);
      failed = true;
    }
  }

  const { nodes, sectionGap } = await nextBlockInputs(std?.plan ?? null);

  return (
    <main className="sp-page pt-12">
      <TopNav />
      <div className="max-w-[900px] mx-auto px-4 md:px-6 py-10">
        <PageHead title="Status" sub={me.state === "ok" ? me.player.displayName : undefined} />
        <div className="mb-10">
          <NextBlockCard nodes={nodes} sectionGap={sectionGap} />
        </div>
        {me.state === "no-db" || failed ? (
          <Notice>The database is not reachable from here, so there is nothing to show yet. Practice still works and stays on this device.</Notice>
        ) : me.state === "no-player" ? (
          <Notice>No player on this device yet. Switch to AHH, then tap GMAT to set your name.</Notice>
        ) : (
          <div className="flex flex-col gap-10">
            <PartA std={std} />
            <PartB topics={topics} />
          </div>
        )}
      </div>
    </main>
  );
}

function PartA({ std }: { std: Standing | null }) {
  const plan = std?.plan ?? null;
  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 mb-3">
        <h2 className="sp-h2 !mb-0">Where I stand</h2>
        <span className="sp-sub !mt-0">Scaled points, from full-length sittings</span>
      </div>

      {!std ? (
        <Notice>
          No sitting recorded yet.{" "}
          <Link href="/gmat/diagnostic" className="underline">
            Sit the diagnostic
          </Link>{" "}
          or log an official mock below.
        </Notice>
      ) : (
        <div className="sp-panel">
          <div className="sp-num text-[22px] font-semibold text-[color:var(--sp-ink-strong)]">
            {std.sitting.totalScore}
            {plan && ` → ${plan.targetTotal}`}
            {std.scaledNeeded !== null &&
              ` · ${std.scaledNeeded > 0 ? `+${std.scaledNeeded} scaled needed` : "target reached"}`}
          </div>
          <div className="sp-sub">
            {std.sitting.source === "official" ? "Official mock" : "In-app diagnostic"} · {fmtDay(std.sitting.takenOn)} ·{" "}
            {ordinal(std.sitting.percentile)} percentile
            {plan && (
              <>
                {" "}
                · {plan.targetTotal - std.sitting.totalScore > 0 ? `${plan.targetTotal - std.sitting.totalScore} composite to` : "at"}{" "}
                the {ordinal(plan.targetPercentile)}
                {std.targetPercentileFloor !== null && ` (floor ${ordinal(std.targetPercentileFloor)})`}
              </>
            )}
          </div>

          <div className="overflow-x-auto mt-5">
            <table className="w-full min-w-[420px] text-[13.5px] border-collapse">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-[color:var(--sp-muted)]">
                  <th className="py-2 pr-4 font-semibold">Section</th>
                  <th className="py-2 pl-4 font-semibold text-right">Now</th>
                  <th className="py-2 pl-4 font-semibold text-right">Target</th>
                  <th className="py-2 pl-4 font-semibold text-right">Gap (scaled points)</th>
                </tr>
              </thead>
              <tbody>
                {plan
                  ? plan.sections.map((s) => (
                      <tr key={s.key} className="border-t border-[color:var(--sp-line)]">
                        <td className="py-2.5 pr-4">{s.label}</td>
                        <Num value={s.currentScaled} sub={ordinal(s.currentPercentile)} />
                        <Num value={s.targetScaled} sub={ordinal(s.targetPercentile)} />
                        <td className="py-2.5 pl-4 text-right sp-num font-semibold">
                          {s.gap > 0 ? <span className="sp-delta-neg">+{s.gap}</span> : "—"}
                        </td>
                      </tr>
                    ))
                  : std.sitting.sections.map((s) => (
                      <tr key={s.key} className="border-t border-[color:var(--sp-line)]">
                        <td className="py-2.5 pr-4">{s.key}</td>
                        <Num value={s.scaled} sub={s.percentile === null ? null : ordinal(s.percentile)} />
                        <td className="py-2.5 pl-4 text-right text-[color:var(--sp-muted)]">—</td>
                        <td className="py-2.5 pl-4 text-right text-[color:var(--sp-muted)]">—</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {!plan && (
            <p className="sp-sub">No target percentile set, so no gap is shown.</p>
          )}
          {plan && plan.achievedTotal !== plan.targetTotal && (
            <p className="sp-sub">
              These section targets reach {plan.achievedTotal}: scores are whole numbers, so the split clears {plan.targetTotal} rather than
              landing on it.
            </p>
          )}
          <p className="sp-sub">
            Percentiles: {std.cohort}.
            {std.targetInterpolated && " The target's percentile is interpolated; GMAC's table skips that row."}
          </p>
        </div>
      )}

      <LogOfficial />
    </section>
  );
}

function Num({ value, sub }: { value: number; sub: string | null }) {
  return (
    <td className="py-2.5 pl-4 text-right sp-num">
      {value}
      {sub && <span className="ml-1.5 text-[11px] text-[color:var(--sp-muted)]">{sub}</span>}
    </td>
  );
}

function PartB({ topics }: { topics: TopicStat[] }) {
  const sessions = topics.reduce((n, t) => n + t.sessions, 0);
  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 mb-3">
        <h2 className="sp-h2 !mb-0">Ground covered</h2>
        <span className="sp-sub !mt-0">
          {sessions} {sessions === 1 ? "session" : "sessions"} clocked
        </span>
      </div>
      {topics.length === 0 ? (
        <Notice>
          No tests taken yet.{" "}
          <Link href="/practice" className="underline">
            Start one
          </Link>
          .
        </Notice>
      ) : (
        <div className="sp-panel">
          <TopicTable topics={topics} recentWindow={RECENT_WINDOW} />
          <p className="sp-sub">
            Quiz accuracy in percentage points (pp). Not comparable with the scaled points above: different instrument, different scale.
          </p>
        </div>
      )}
    </section>
  );
}
