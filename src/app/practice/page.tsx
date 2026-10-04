import { TopNav } from "@/components/TopNav";
import { PracticeHub } from "@/components/practice/PracticeHub";
import { currentPlayer } from "@/lib/gmat/current";
import { latestSitting } from "@/lib/gmat/stats";
import { getPracticeIndex } from "@/lib/questions";
import { currentTrack } from "@/lib/tracks-server";

export const dynamic = "force-dynamic";

export default async function PracticePage() {
  const { questions, units } = await getPracticeIndex();
  const mockPool = {
    short: questions.filter((q) => q.type === "short").length,
    long: questions.filter((q) => q.type === "long").length,
    case: questions.filter((q) => q.type === "case").length,
  };
  // GMAT swaps the AHH mock card for the full-length diagnostic, which shows
  // the last sitting's score.
  let lastSitting: { total: number; takenOn: string } | null = null;
  if (currentTrack() === "gmat") {
    const me = await currentPlayer();
    if (me.state === "ok") {
      const s = await latestSitting(me.player.id).catch(() => null);
      if (s) lastSitting = { total: s.totalScore, takenOn: s.takenOn };
    }
  }
  return (
    <main className="sp-page">
      <TopNav />
      <PracticeHub units={units} mockPool={mockPool} total={questions.length} lastSitting={lastSitting} />
    </main>
  );
}
