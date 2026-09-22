import Link from "next/link";
import { getAllTopics } from "@/lib/vault";
import { MixedTest, PoolCard } from "@/components/study/MixedTest";

// Screen 7: Mixed test. Pool is every flashcard from every "drilled" topic
// across the vault, tagged with its origin topic for the results breakdown.
export const dynamic = "force-dynamic";

export default async function TestPage() {
  const topics = await getAllTopics();
  const drilledTopics = topics.filter((t) => t.state === "drilled");

  const pool: PoolCard[] = drilledTopics.flatMap((topic) =>
    topic.flashcards.map((card) => ({
      q: card.q,
      a: card.a,
      topicId: topic.id,
      topicSlug: topic.slug,
    }))
  );

  if (pool.length === 0) {
    return (
      <main className="sp-page">
        <div className="sp-focus-column">
          <p className="sp-body-text">Nothing drilled yet. Drill a topic first.</p>
          <Link href="/" className="sp-quiet-link">
            Territory
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="sp-page">
      <MixedTest pool={pool} />
    </main>
  );
}
