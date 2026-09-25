import { TopNav } from "@/components/TopNav";
import { TestRunner } from "@/components/practice/TestRunner";
import { getQuestions } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function MockPage() {
  const pool = (await getQuestions()).filter((q) => q.type !== "mcq");
  return (
    <main className="sp-page pt-12">
      <TopNav />
      <TestRunner pool={pool} kind="mock" scope="mock" />
    </main>
  );
}
