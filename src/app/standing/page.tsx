import { TopNav } from "@/components/TopNav";
import { Standing } from "@/components/practice/Standing";
import { getPracticeIndex } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function StandingPage() {
  const { units } = await getPracticeIndex();
  return (
    <main className="sp-page">
      <TopNav />
      <Standing units={units.map((u) => ({ unit: u.unit, nodes: u.nodes.map((n) => ({ id: n.id, title: n.title })) }))} />
    </main>
  );
}
