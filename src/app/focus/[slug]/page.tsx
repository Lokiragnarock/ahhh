import { notFound } from "next/navigation";
import { getTopic } from "@/lib/vault";
import { RedrawPill } from "@/components/study/RedrawPill";

// Screen 3: Focus. Edge to edge, single 70ch column from 120px top.
// No header, no footer, no nav, no card, no progress, no timer, no close,
// no back. The mermaid concept map and flashcards are already stripped out
// of `topic.sections` by the vault parser — they never reach this screen.
export const dynamic = "force-dynamic";

export default async function FocusPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const topic = await getTopic(slug);
  if (!topic) notFound();

  return (
    <main className="sp-page">
      <div className="sp-focus-column">
        <h1 className="sp-h1">{topic.title}</h1>
        {topic.sections.map((section, i) => (
          <section key={i} className="sp-section">
            <h2 className="sp-h2">{section.heading}</h2>
            <div className="sp-body" dangerouslySetInnerHTML={{ __html: section.html }} />
          </section>
        ))}
      </div>
      <RedrawPill slug={topic.slug} />
    </main>
  );
}
