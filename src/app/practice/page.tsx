import { TopNav } from "@/components/TopNav";
import { PracticeHub } from "@/components/practice/PracticeHub";
import { getPracticeIndex } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function PracticePage() {
  const { questions, units } = await getPracticeIndex();
  const mockPool = {
    short: questions.filter((q) => q.type === "short").length,
    long: questions.filter((q) => q.type === "long").length,
    case: questions.filter((q) => q.type === "case").length,
  };
  return (
    <main className="sp-page">
      <TopNav />
      <PracticeHub units={units} mockPool={mockPool} total={questions.length} />
    </main>
  );
}
