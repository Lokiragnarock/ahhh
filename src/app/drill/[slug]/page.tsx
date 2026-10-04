import { notFound } from "next/navigation";
import { getTopic } from "@/lib/vault";
import { DrillDeck } from "@/components/study/DrillDeck";
import { FlowBar } from "@/components/study/FlowBar";
import { getTopicFlow, miniHref } from "@/lib/flow";
import { currentSubject } from "@/lib/subject/server";
import { trackOfSubject } from "@/lib/tracks";

// Screen 6: Drill. Server fetch, client deck does the card-by-card work.
export const dynamic = "force-dynamic";

export default async function DrillPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const [topic, flow] = await Promise.all([getTopic(slug), getTopicFlow(slug)]);
  if (!topic || !flow) notFound();

  // GMAT: the drill rolls into 5-10 practice questions on this node (its
  // misses go to the error book from the runner). A node with no bank keeps
  // the flow's own next step. AHH subjects keep the mini test as before.
  const gmat = trackOfSubject(currentSubject()) === "gmat";
  const n = Math.min(10, flow.questionCount);
  const next =
    gmat && flow.questionCount > 0
      ? {
          href: `${miniHref(topic.id)}?n=${n}`,
          label: `${n} practice ${n === 1 ? "question" : "questions"} on ${topic.id}`,
        }
      : flow.afterDrill;

  return (
    <main className="sp-page">
      <FlowBar flow={flow} current="drill" />
      <DrillDeck flashcards={topic.flashcards} slug={topic.slug} nodeId={topic.id} next={next} />
    </main>
  );
}
