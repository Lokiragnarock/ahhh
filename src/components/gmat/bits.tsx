import { SECTION_SHORT } from "@/lib/gmat/format";
import { MIN_SESSIONS_FOR_MOVEMENT, type TopicStat } from "@/lib/gmat/stats";

// Empty / error state that says what is missing.
export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="sp-panel">
      <p className="sp-body-text">{children}</p>
    </div>
  );
}

// Movement cell: percentage points, first window to recent window. Withheld
// below MIN_SESSIONS_FOR_MOVEMENT, where the two windows share rows.
export function Movement({ t }: { t: TopicStat }) {
  if (t.movementPp === null) return <span className="text-[color:var(--sp-muted)]">—</span>;
  if (!t.movementReliable) {
    return (
      <span className="text-[11px] text-[color:var(--sp-muted)]" title={`Needs ${MIN_SESSIONS_FOR_MOVEMENT} sessions`}>
        too few
      </span>
    );
  }
  const cls = t.movementPp > 0 ? "sp-delta-pos" : t.movementPp < 0 ? "sp-delta-neg" : "";
  return (
    <span className={cls}>
      {t.movementPp > 0 ? "+" : ""}
      {t.movementPp} pp
    </span>
  );
}

// Per-topic ground covered. Tests are stored per topic, so the planner nodes
// sharing a topic are listed beside it.
export function TopicTable({ topics, recentWindow }: { topics: TopicStat[]; recentWindow: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-[13.5px] border-collapse">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-[color:var(--sp-muted)]">
            <th className="py-2 pr-4 font-semibold">Topic</th>
            <th className="py-2 pl-4 font-semibold text-right">Sessions</th>
            <th className="py-2 pl-4 font-semibold text-right">Last {recentWindow} median</th>
            <th className="py-2 pl-4 font-semibold text-right">Movement</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((t) => (
            <tr key={t.topic} className="border-t border-[color:var(--sp-line)]">
              <td className="py-2.5 pr-4">
                {t.topic}
                <span className="ml-2 text-[11px] text-[color:var(--sp-muted)] sp-num">
                  {SECTION_SHORT[t.section] ?? t.section}
                  {t.nodes.length > 0 && ` · ${t.nodes.join(" ")}`}
                </span>
              </td>
              <td className="py-2.5 pl-4 text-right sp-num">{t.sessions}</td>
              <td className="py-2.5 pl-4 text-right sp-num">{t.recentMedianPct === null ? "—" : `${t.recentMedianPct}%`}</td>
              <td className="py-2.5 pl-4 text-right sp-num">
                <Movement t={t} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
