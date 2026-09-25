import { TopNav } from "@/components/TopNav";
import { ErrorBook } from "@/components/practice/ErrorBook";
import { getPracticeIndex } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function ErrorsPage() {
  const { units } = await getPracticeIndex();
  const nodes = units.flatMap((u) => u.nodes.map((n) => ({ id: n.id, unit: n.unit, title: n.title })));
  return (
    <main className="sp-page">
      <TopNav />
      <ErrorBook nodes={nodes} />
    </main>
  );
}
