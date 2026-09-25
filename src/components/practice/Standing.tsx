"use client";

import { ERROR_TYPES, ROUNDS } from "@/lib/practice-types";
import {
  CLOCK_START,
  countByType,
  fmtDate,
  minutesByRound,
  pct,
  SeriesPoint,
  seriesBy,
  useAttempts,
  useBlocks,
  useErrors,
} from "@/lib/practice-store";
import { PageHead, RepsStrip, Sparkline, Stat } from "./bits";

interface UnitLite {
  unit: string;
  nodes: { id: string; title: string }[];
}

function hours(min: number) {
  return (min / 60).toFixed(1);
}

export function Standing({ units }: { units: UnitLite[] }) {
  const [attempts] = useAttempts();
  const [errors] = useErrors();
  const [blocks] = useBlocks();

  const byUnit = seriesBy(attempts, "unit");
  const byNode = seriesBy(attempts, "node");
  const rounds = minutesByRound(blocks);
  const totalMin = ROUNDS.reduce((s, r) => s + rounds[r], 0);
  const types = countByType(errors);
  const maxType = Math.max(1, ...ERROR_TYPES.map((t) => types[t]));
  const papers = attempts
    .filter((a) => a.kind !== "mini")
    .sort((a, b) => b.date.localeCompare(a.date));
  const mocks = attempts.filter((a) => a.kind === "mock").sort((a, b) => a.date.localeCompare(b.date));
  const [y, m, d] = CLOCK_START.split("-").map(Number);
  const t = new Date();
  const day = Math.max(
    1,
    Math.round((new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime() - new Date(y, m - 1, d).getTime()) / 86400000) + 1
  );

  const knownUnits = new Set(units.map((u) => u.unit));
  const extraUnits = Array.from(byUnit.keys()).filter((u) => !knownUnits.has(u));
  const allUnits: UnitLite[] = [...units, ...extraUnits.map((u) => ({ unit: u, nodes: [] }))];

  return (
    <div className="sp-wrap">
      <PageHead title="Standing" kicker={`Day ${day} since ${fmtDate(CLOCK_START)} · reps over hours`} />

      <div className="mb-3">
        <RepsStrip />
      </div>
      <div className="sp-stat-grid grid-cols-2 md:grid-cols-4 mb-10">
        {ROUNDS.map((r) => (
          <Stat key={r} label={`${r} hours`} value={hours(rounds[r])} sub={`${rounds[r]} min`} />
        ))}
        <Stat label="Total hours" value={hours(totalMin)} sub={`${blocks.length} blocks logged`} />
      </div>

      <section className="sp-panel mb-8">
        <h2 className="sp-h2">By unit and node</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px] min-w-[520px]">
            <thead>
              <tr className="text-left">
                <th className="sp-label py-2 font-semibold">Scope</th>
                <th className="sp-label py-2 font-semibold text-right">Latest</th>
                <th className="sp-label py-2 font-semibold text-right">Best</th>
                <th className="sp-label py-2 font-semibold text-right">Attempts</th>
                <th className="sp-label py-2 font-semibold pl-6">Trend</th>
              </tr>
            </thead>
            <tbody>
              {allUnits.map((u) => (
                <UnitRows key={u.unit} u={u} unitSeries={byUnit.get(u.unit) ?? []} byNode={byNode} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <section className="sp-panel">
          <div className="flex items-center justify-between mb-4">
            <h2 className="sp-h2 !mb-0">Sectional &amp; mock history</h2>
            <Sparkline values={mocks.map((a) => pct(a.score, a.max))} width={110} />
          </div>
          {papers.length === 0 ? (
            <p className="text-[13.5px] text-[#888]">No sectional tests or mocks yet.</p>
          ) : (
            <ul>
              {papers.map((a) => (
                <li key={a.id} className="sp-row">
                  <span className="text-[#888] w-16 shrink-0">{fmtDate(a.date)}</span>
                  <span className="sp-chip">{a.kind}</span>
                  <span className="flex-1">{a.kind === "mock" ? "Full mock" : a.scope}</span>
                  <span className="tabular-nums text-[#888]">
                    {a.score}/{a.max}
                  </span>
                  <strong className="tabular-nums w-12 text-right">{pct(a.score, a.max)}%</strong>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="sp-panel">
          <h2 className="sp-h2">Errors</h2>
          <div className="sp-stat-grid grid-cols-3 mb-6">
            <Stat label="Open" value={errors.filter((e) => e.status === "open").length} />
            <Stat label="Re-solving" value={errors.filter((e) => e.status === "re-solving").length} />
            <Stat label="Mastered" value={errors.filter((e) => e.status === "mastered").length} />
          </div>
          <ul className="flex flex-col gap-2">
            {ERROR_TYPES.map((t) => (
              <li key={t} className="flex items-center gap-3 text-[13px]">
                <span className="w-44 shrink-0 text-[#333]">{t}</span>
                <span className="flex-1 h-[6px] bg-[#f0f0f0]">
                  <span className="block h-full bg-[#111]" style={{ width: `${(types[t] / maxType) * 100}%` }} />
                </span>
                <span className="w-6 text-right tabular-nums">{types[t]}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function summary(s: SeriesPoint[]) {
  if (!s.length) return null;
  return { latest: s[s.length - 1].pct, best: Math.max(...s.map((p) => p.pct)), n: s.length };
}

function UnitRows({
  u,
  unitSeries,
  byNode,
}: {
  u: UnitLite;
  unitSeries: SeriesPoint[];
  byNode: Map<string, SeriesPoint[]>;
}) {
  const us = summary(unitSeries);
  return (
    <>
      <tr className="border-t border-[#111]">
        <td className="py-2.5 font-bold uppercase tracking-[0.05em] text-[12px]">{u.unit}</td>
        <Cells s={us} series={unitSeries} bold />
      </tr>
      {u.nodes.map((n) => {
        const series = byNode.get(n.id) ?? [];
        return (
          <tr key={n.id} className="border-t border-[#eee]">
            <td className="py-2 pl-3">
              <span className="font-semibold">{n.id}</span>{" "}
              <span className="text-[#888] hidden sm:inline">{n.title.length > 42 ? n.title.slice(0, 41) + "…" : n.title}</span>
            </td>
            <Cells s={summary(series)} series={series} />
          </tr>
        );
      })}
    </>
  );
}

function Cells({ s, series, bold }: { s: ReturnType<typeof summary>; series: SeriesPoint[]; bold?: boolean }) {
  const dash = <span className="text-[#ccc]">—</span>;
  return (
    <>
      <td className={`text-right tabular-nums ${bold ? "font-semibold" : ""}`}>{s ? `${s.latest}%` : dash}</td>
      <td className="text-right tabular-nums">{s ? `${s.best}%` : dash}</td>
      <td className="text-right tabular-nums text-[#888]">{s ? s.n : 0}</td>
      <td className="pl-6 py-1">
        <Sparkline values={series.map((p) => p.pct)} width={100} height={22} />
      </td>
    </>
  );
}
