"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Head-to-head accuracy. X is the test number, not the date: players sit
// tests on different schedules, so "your 4th test vs their 4th" is the
// comparison that means something. The owner's line is the accent; everyone
// else is a neutral grey.

export interface ChartPlayer {
  id: string;
  name: string;
  isOwner: boolean;
}

const GREYS = ["#9b9a97", "#c4c2bd", "#6b6a66", "#dcd9d3"];
const AXIS = { fill: "#9b9a97", fontSize: 11, fontFamily: "var(--font-jbmono), monospace" };

function colorOf(p: ChartPlayer, i: number): string {
  return p.isOwner ? "var(--sp-accent)" : GREYS[i % GREYS.length];
}

export function VersusChart({ players, data }: { players: ChartPlayer[]; data: Record<string, number | null>[] }) {
  const ordered = [...players].sort((a, b) => Number(b.isOwner) - Number(a.isOwner));
  const others = ordered.filter((p) => !p.isOwner);
  const color = (p: ChartPlayer) => colorOf(p, others.indexOf(p));
  return (
    <div className="w-full overflow-x-auto overflow-y-hidden">
      <div className="h-[260px] min-w-[480px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="var(--sp-line)" vertical={false} />
            <XAxis dataKey="n" tickLine={false} axisLine={{ stroke: "#e8e5e0" }} tick={AXIS} allowDecimals={false} />
            <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} tick={AXIS} />
            <Tooltip
              labelFormatter={(n) => `Test ${n}`}
              formatter={(v, _k, item) => [`${v}%`, ordered.find((p) => p.id === item.dataKey)?.name ?? ""]}
              contentStyle={{ border: "1px solid #e8e5e0", borderRadius: 8, fontSize: 12, boxShadow: "none" }}
            />
            {ordered.map((p) => (
              <Line
                key={p.id}
                type="monotone"
                dataKey={p.id}
                stroke={color(p)}
                strokeWidth={p.isOwner ? 2 : 1.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: color(p) }}
                connectNulls
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-4 mt-3 text-[12px]">
        {ordered.map((p) => (
          <span key={p.id} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-[2px]" style={{ background: color(p) }} />
            {p.name}
          </span>
        ))}
      </div>
    </div>
  );
}
