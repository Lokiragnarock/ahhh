import { notFound } from "next/navigation";
import { getTopic } from "@/lib/vault";
import { DrillDeck } from "@/components/study/DrillDeck";

// Screen 6: Drill. Server fetch, client deck does the card-by-card work.
export const dynamic = "force-dynamic";

export default async function DrillPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const topic = await getTopic(slug);
  if (!topic) notFound();

  return (
    <main className="sp-page">
      <DrillDeck flashcards={topic.flashcards} slug={topic.slug} nodeId={topic.id} />
    </main>
  );
}
