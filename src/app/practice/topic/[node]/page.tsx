import { TopNav } from "@/components/TopNav";
import { TestRunner } from "@/components/practice/TestRunner";
import { getQuestions } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function MiniTestPage({ params }: { params: { node: string } }) {
  const node = decodeURIComponent(params.node);
  const pool = (await getQuestions()).filter((q) => q.node === node);
  return (
    <main className="sp-page pt-12">
      <TopNav />
      <TestRunner pool={pool} kind="mini" scope={node} />
    </main>
  );
}
