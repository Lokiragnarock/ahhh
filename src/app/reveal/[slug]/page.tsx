import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopic } from "@/lib/vault";
import { FlowBar } from "@/components/study/FlowBar";
import { getTopicFlow } from "@/lib/flow";
import { MermaidMap } from "@/components/study/MermaidMap";
import { NodeChecklist, ChecklistNode } from "@/components/study/NodeChecklist";
import { MarkMappedPill } from "@/components/study/MarkMappedPill";

// Screen 5: Reveal and diff. 60% mermaid map card, 40% checklist + scratch
// pad. Plain string parsing of the raw mermaid text pulls out node ids and
// labels, no library involved on the server side.
export const dynamic = "force-dynamic";

function parseMermaidNodes(mermaidText: string): ChecklistNode[] {
  const seen = new Set<string>();
  const nodes: ChecklistNode[] = [];
  const pattern = /([A-Za-z0-9_-]+)\s*[[{]"([^"]*)"[\]}]/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(mermaidText)) !== null) {
    const id = match[1];
    if (seen.has(id)) continue;
    seen.add(id);
    const label = match[2].replace(/<br\s*\/?>/gi, " ").trim();
    nodes.push({ id, label: label || id });
  }
  return nodes;
}

export default async function RevealPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const [topic, flow] = await Promise.all([getTopic(slug), getTopicFlow(slug)]);
  if (!topic || !flow) notFound();

  const nodes = topic.mermaid ? parseMermaidNodes(topic.mermaid) : [];

  return (
    <main className="sp-page">
      <FlowBar flow={flow} current="reveal" />
      <div className="px-5 py-10">
        <div className="max-w-[1200px] mx-auto mb-4">
          <Link href="/" className="text-[12px] uppercase tracking-[0.08em] text-[#888] hover:text-[#111]">
            &larr; Territory
          </Link>
        </div>

        <div className="sp-reveal-layout">
          <div className="sp-reveal-map">
            <div className="sp-label mb-3">{topic.id}</div>
            {topic.mermaid ? (
              <MermaidMap definition={topic.mermaid} />
            ) : (
              <p className="sp-body-text">No concept map on this note yet.</p>
            )}
          </div>

          <div className="sp-reveal-side">
            <div className="sp-h2 mb-4">Nodes</div>
            <NodeChecklist nodes={nodes} />

            <div className="sp-h2 mb-4 sp-reveal-scratch-label">Scratch pad</div>
            <textarea
              className="sp-textarea"
              placeholder="Notes on what you missed, purely for yourself."
              rows={8}
            />
          </div>
        </div>

        <div className="sp-reveal-actions">
          <MarkMappedPill slug={topic.slug} />
          <Link href={`/redraw/${encodeURIComponent(topic.slug)}`} className="sp-quiet-link">
            Needs another pass
          </Link>
        </div>
      </div>
    </main>
  );
}
