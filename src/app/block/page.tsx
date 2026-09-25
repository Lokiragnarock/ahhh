import { TopNav } from "@/components/TopNav";
import { BlockTimerView } from "@/components/practice/BlockTimerView";
import { getPracticeIndex } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function BlockPage() {
  const { units } = await getPracticeIndex();
  const nodes = units.flatMap((u) => u.nodes.map((n) => ({ id: n.id, title: n.title, unit: n.unit })));
  return (
    <main className="sp-page">
      <TopNav />
      <BlockTimerView nodes={nodes} />
    </main>
  );
}
