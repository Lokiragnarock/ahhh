import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopic } from "@/lib/vault";
import { FlowBar } from "@/components/study/FlowBar";
import { getTopicFlow } from "@/lib/flow";
import { RedrawDonePill } from "@/components/study/RedrawDonePill";

// Screen 4: Redraw prompt. Same no-chrome pattern as Focus. No reference
// material, no map, no note sections. Just a prompt to draw from memory.
export const dynamic = "force-dynamic";

export default async function RedrawPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const [topic, flow] = await Promise.all([getTopic(slug), getTopicFlow(slug)]);
  if (!topic || !flow) notFound();

  return (
    <main className="sp-page">
      <FlowBar flow={flow} current="redraw" />
      <div className="sp-focus-column">
        <div className="sp-label mb-3">{topic.id}</div>
        <h1 className="sp-h1 mb-4">Draw the map from memory.</h1>
        <p className="sp-body-text mb-10">
          On paper or a blank screen, sketch the nodes and connections as you remember them.
          No peeking at the note.
        </p>
        <RedrawDonePill slug={topic.slug} />
        <div className="mt-8">
          <Link href={`/reveal/${encodeURIComponent(topic.slug)}`} className="sp-quiet-link">
            Skip
          </Link>
        </div>
      </div>
    </main>
  );
}
