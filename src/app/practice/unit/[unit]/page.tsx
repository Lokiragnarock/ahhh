import { TopNav } from "@/components/TopNav";
import { TestRunner } from "@/components/practice/TestRunner";
import { getQuestions } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function SectionalTestPage({ params }: { params: { unit: string } }) {
  const unit = decodeURIComponent(params.unit);
  const pool = (await getQuestions()).filter((q) => q.unit === unit);
  return (
    <main className="sp-page pt-12">
      <TopNav />
      <TestRunner pool={pool} kind="sectional" scope={unit} />
    </main>
  );
}
