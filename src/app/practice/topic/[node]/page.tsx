import { TopNav } from "@/components/TopNav";
import { TestRunner } from "@/components/practice/TestRunner";
import { getQuestions } from "@/lib/questions";
import { getNodeFlow } from "@/lib/flow";
import { FlowBar } from "@/components/study/FlowBar";

export const dynamic = "force-dynamic";

// ?n=5..10 asks that many questions: the short set a GMAT Drill rolls into.
export default async function MiniTestPage({
  params,
  searchParams,
}: {
  params: { node: string };
  searchParams: { n?: string };
}) {
  const node = decodeURIComponent(params.node);
  const [all, flow] = await Promise.all([getQuestions(), getNodeFlow(node)]);
  const pool = all.filter((q) => q.node === node);
  const n = Number(searchParams.n);
  const limit = Number.isInteger(n) && n >= 5 && n <= 10 ? n : undefined;
  return (
    <main className="sp-page pt-12">
      <TopNav />
      {flow && <FlowBar flow={flow} current="mini" />}
      <TestRunner pool={pool} kind="mini" scope={node} next={flow?.afterMini} limit={limit} />
    </main>
  );
}
