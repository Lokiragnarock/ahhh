import { notFound } from "next/navigation";
import { getTopic } from "@/lib/vault";
import { DrillDeck } from "@/components/study/DrillDeck";
import { FlowBar } from "@/components/study/FlowBar";
import { getTopicFlow } from "@/lib/flow";

// Screen 6: Drill. Server fetch, client deck does the card-by-card work.
export const dynamic = "force-dynamic";

export default async function DrillPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const [topic, flow] = await Promise.all([getTopic(slug), getTopicFlow(slug)]);
  if (!topic || !flow) notFound();

  return (
    <main className="sp-page">
      <FlowBar flow={flow} current="drill" />
      <DrillDeck flashcards={topic.flashcards} slug={topic.slug} nodeId={topic.id} next={flow.afterDrill} />
    </main>
  );
}
