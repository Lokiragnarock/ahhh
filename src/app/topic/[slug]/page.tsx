import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTopics, getTopic } from "@/lib/vault";

// Screen 2: Topic note, embedded. 1100px card, 20% sticky sidebar + 80%
// content, hairline rules between sections. Full-width ENTER FOCUS at the
// bottom of the content column.
export const dynamic = "force-dynamic";

export default async function TopicPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const [topic, allTopics] = await Promise.all([getTopic(slug), getAllTopics()]);
  if (!topic) notFound();

  const depTopics = topic.deps
    .map((depId) => allTopics.find((t) => t.id === depId))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <main className="sp-page">
      <div className="px-5 py-10">
        <div className="max-w-[1100px] mx-auto mb-4">
          <Link href="/" className="text-[12px] uppercase tracking-[0.08em] text-[#888] hover:text-[#111]">
            &larr; Territory
          </Link>
        </div>

        <div className="sp-dossier">
          <aside className="sp-sidebar">
            <div className="sp-meta-block">
              <div className="sp-label">Node</div>
              <div className="sp-value">{topic.id}</div>
            </div>
            <div className="sp-meta-block">
              <div className="sp-label">Unit</div>
              <div className="sp-value">{topic.section}</div>
            </div>
            <div className="sp-meta-block">
              <div className="sp-label">Minutes</div>
              <div className="sp-value">{topic.minutes}</div>
            </div>
            <div className="sp-meta-block">
              <div className="sp-label">State / Studied</div>
              <div className="sp-value capitalize">{topic.state}</div>
            </div>
            <div className="sp-meta-block">
              <div className="sp-label">Exam focus</div>
              <div className="sp-value">{topic.examFocus ? "Yes" : "No"}</div>
            </div>
            <hr className="sp-divider" />
            <div className="sp-meta-block">
              <div className="sp-label">Depends on</div>
              <div className="sp-value">
                {depTopics.length === 0 ? (
                  <span className="text-[#888]">None</span>
                ) : (
                  <div className="flex flex-col gap-1">
                    {depTopics.map((d) => (
                      <Link key={d.slug} href={`/topic/${encodeURIComponent(d.slug)}`} className="hover:underline">
                        {d.id}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          <div className="sp-content">
            <header className="pb-7 border-b border-[#e5e5e5] mb-0">
              <h1 className="sp-h1 mb-2">{topic.title}</h1>
              <p className="text-[15px] text-[#555]">{topic.docTitle}</p>
            </header>

            {topic.sections.map((section, i) => (
              <section key={i} className="sp-section">
                <h2 className="sp-h2">{section.heading}</h2>
                <div className="sp-body" dangerouslySetInnerHTML={{ __html: section.html }} />
              </section>
            ))}

            <div className="pt-8">
              <Link
                href={`/focus/${encodeURIComponent(topic.slug)}`}
                className="block w-full text-center bg-[#111] hover:bg-black text-white text-[13px] font-bold uppercase tracking-[0.08em] py-4"
              >
                Enter focus
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
