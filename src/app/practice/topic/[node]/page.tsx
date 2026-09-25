import { TopNav } from "@/components/TopNav";
import { TestRunner } from "@/components/practice/TestRunner";
import { getQuestions } from "@/lib/questions";
import { getNodeFlow } from "@/lib/flow";
import { FlowBar } from "@/components/study/FlowBar";

export const dynamic = "force-dynamic";

export default async function MiniTestPage({ params }: { params: { node: string } }) {
  const node = decodeURIComponent(params.node);
  const [all, flow] = await Promise.all([getQuestions(), getNodeFlow(node)]);
  const pool = all.filter((q) => q.node === node);
  return (
    <main className="sp-page pt-12">
      <TopNav />
      {flow && <FlowBar flow={flow} current="mini" />}
      <TestRunner pool={pool} kind="mini" scope={node} next={flow?.afterMini} />
    </main>
  );
}
