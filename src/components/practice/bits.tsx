"use client";

import { reps, useAttempts, useBlocks, useErrors } from "@/lib/practice-store";

export function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="sp-stat">
      <div className="sp-label">{label}</div>
      <div className="sp-stat-value">{value}</div>
      {sub && <div className="sp-stat-sub">{sub}</div>}
    </div>
  );
}

export function RepsStrip() {
  const [attempts] = useAttempts();
  const [errors] = useErrors();
  const [blocks] = useBlocks();
  const r = reps(attempts, errors, blocks);
  return (
    <div className="sp-stat-grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      <Stat label="Tests taken" value={r.tests} />
      <Stat label="Questions done" value={r.questions} />
      <Stat label="Errors logged" value={r.errorsLogged} />
      <Stat label="Re-solves" value={r.resolves} />
      <Stat label="Mastered" value={r.errorsMastered} />
      <Stat label="Blocks" value={r.blocks} />
    </div>
  );
}

export function Sparkline({ values, width = 120, height = 28 }: { values: number[]; width?: number; height?: number }) {
  if (values.length === 0) return <span className="text-[12px] text-[#bbb]">—</span>;
  const pad = 3;
  const x = (i: number) => (values.length === 1 ? width / 2 : pad + (i * (width - pad * 2)) / (values.length - 1));
  const y = (v: number) => pad + ((100 - v) * (height - pad * 2)) / 100;
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const last = values[values.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Trend, latest ${last}%`}>
      <line x1={0} x2={width} y1={y(50)} y2={y(50)} stroke="#eee" strokeDasharray="2 3" />
      {values.length > 1 && <polyline points={points} fill="none" stroke="#111" strokeWidth={1.5} />}
      <circle cx={x(values.length - 1)} cy={y(last)} r={2.5} fill="#111" />
    </svg>
  );
}

export function PageHead({ title, kicker, children }: { title: string; kicker?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        {kicker && <div className="sp-label">{kicker}</div>}
        <h1 className="sp-h1">{title}</h1>
      </div>
      {children}
    </div>
  );
}
