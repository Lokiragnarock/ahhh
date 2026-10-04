import { notFound } from "next/navigation";
import { PageHead } from "@/components/PageHead";
import { TopNav } from "@/components/TopNav";
import { Movement, Notice } from "@/components/gmat/bits";
import { VersusChart } from "@/components/gmat/VersusChart";
import { currentPlayer } from "@/lib/gmat/current";
import { RECENT_WINDOW, versus, type Versus } from "@/lib/gmat/stats";

export const dynamic = "force-dynamic";

// Owner-only. Anyone else (or no player at all) gets a 404, so the route does
// not advertise itself.
export default async function VersusPage() {
  const me = await currentPlayer();
  if (me.state !== "ok" || me.player.role !== "owner") notFound();

  let data: Versus | null = null;
  try {
    data = await versus();
  } catch (err) {
    console.error("GMAT versus load failed:", err instanceof Error ? err.message : err);
  }

  return (
    <main className="sp-page pt-12">
      <TopNav />
      <div className="max-w-[900px] mx-auto px-4 md:px-6 py-10">
        <PageHead title="Versus" sub="Everyone on the GMAT track." />
        {!data ? (
          <Notice>The database is not reachable from here.</Notice>
        ) : (
          <div className="flex flex-col gap-8">
            <section className="sp-panel">
              <div className="sp-label">Accuracy by test number</div>
              {data.withTests >= 2 ? (
                <VersusChart players={data.players} data={data.series} />
              ) : (
                <p className="sp-body-text">The chart appears once two players have taken a test.</p>
              )}
              <p className="sp-sub">Quiz accuracy, percent. Test n is each player&apos;s nth test.</p>
            </section>

            <section className="sp-panel overflow-x-auto">
              <table className="w-full min-w-[420px] text-[13.5px] border-collapse">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-[color:var(--sp-muted)]">
                    <th className="py-2 pr-4 font-semibold">Player</th>
                    <th className="py-2 pl-4 font-semibold text-right">Tests taken</th>
                    <th className="py-2 pl-4 font-semibold text-right">Latest diagnostic (scaled)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.players.map((p) => (
                    <tr key={p.id} className="border-t border-[color:var(--sp-line)]">
                      <td className="py-2.5 pr-4">{p.name}</td>
                      <td className="py-2.5 pl-4 text-right sp-num">{p.tests}</td>
                      <td className="py-2.5 pl-4 text-right sp-num">{p.latestTotal ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="sp-panel overflow-x-auto">
              <div className="sp-label">Movement by topic</div>
              <TopicMovement players={data.players} />
              <p className="sp-sub">
                Percentage points of quiz accuracy, first {RECENT_WINDOW} tests to last {RECENT_WINDOW} on a topic; shown from 10 sessions. Tests are stored per topic,
                so nodes sharing a topic share a row.
              </p>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

// One row per topic anyone has practised, one column per player.
function TopicMovement({ players }: { players: Versus["players"] }) {
  const topics = Array.from(new Set(players.flatMap((p) => p.topics.map((t) => t.topic)))).sort();
  if (topics.length === 0) return <p className="sp-body-text">No tests taken yet.</p>;
  return (
    <table className="w-full min-w-[420px] text-[13.5px] border-collapse">
      <thead>
        <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-[color:var(--sp-muted)]">
          <th className="py-2 pr-4 font-semibold">Topic</th>
          {players.map((p) => (
            <th key={p.id} className="py-2 pl-4 font-semibold text-right">
              {p.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {topics.map((topic) => (
          <tr key={topic} className="border-t border-[color:var(--sp-line)]">
            <td className="py-2.5 pr-4">{topic}</td>
            {players.map((p) => {
              const t = p.topics.find((x) => x.topic === topic);
              return (
                <td key={p.id} className="py-2.5 pl-4 text-right sp-num">
                  {t ? <Movement t={t} /> : <span className="text-[color:var(--sp-muted)]">—</span>}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
