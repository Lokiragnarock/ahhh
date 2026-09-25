import { TopNav } from "@/components/TopNav";
import { TestRunner } from "@/components/practice/TestRunner";
import { getQuestions } from "@/lib/questions";
import { getUnitExit } from "@/lib/flow";

export const dynamic = "force-dynamic";

export default async function SectionalTestPage({ params }: { params: { unit: string } }) {
  const unit = decodeURIComponent(params.unit);
  const [all, next] = await Promise.all([getQuestions(), getUnitExit(unit)]);
  const pool = all.filter((q) => q.unit === unit);
  return (
    <main className="sp-page pt-12">
      <TopNav />
      <TestRunner pool={pool} kind="sectional" scope={unit} next={next} />
    </main>
  );
}
