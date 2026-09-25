import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTopics, getTopic } from "@/lib/vault";
import { getQuestions } from "@/lib/questions";
import { TopNav } from "@/components/TopNav";
import { LastMiniScore, TopicErrors } from "@/components/practice/TopicPractice";
import { RoundToggles } from "@/components/practice/Rounds";
import { getTopicFlow, topicHref } from "@/lib/flow";

// Screen 2: Topic note, embedded. 1100px card, 20% sticky sidebar + 80%
// content, hairline rules between sections. Full-width ENTER FOCUS at the
// bottom of the content column.
export const dynamic = "force-dynamic";

export default async function TopicPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const [topic, allTopics, questions, flow] = await Promise.all([
    getTopic(slug),
    getAllTopics(),
    getQuestions(),
    getTopicFlow(slug),
  ]);
  if (!topic) notFound();
  const questionCount = questions.filter((q) => q.node === topic.id).length;

  const depTopics = topic.deps
    .map((depId) => allTopics.find((t) => t.id === depId))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <main className="sp-page pt-12">
      <TopNav />
      <div className="px-5 py-10">
        <div className="max-w-[1100px] mx-auto mb-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/" className="text-[12px] uppercase tracking-[0.08em] text-[#888] hover:text-[#111] mr-auto">
            &larr; Territory
          </Link>
          {flow?.prev && (
            <Link href={topicHref(flow.prev)} className="sp-quiet-link">
              &larr; Prev · {flow.prev.id}
            </Link>
          )}
          {flow?.next && (
            <Link href={topicHref(flow.next)} className="sp-quiet-link">
              Next · {flow.next.id} &rarr;
            </Link>
          )}
        </div>

        <div className="sp-dossier">
          <aside className="sp-sidebar">
            <div className="sp-meta-block">
              <div className="sp-label">Node</div>
              <div className="sp-value">{topic.id}</div>
            </div>
            <div className="sp-meta-block">
              <div className="sp-label">Unit</div>
              <div className="sp-value">
                {topic.unit}
                {topic.section !== topic.unit && <span className="text-[#888]"> · {topic.section}</span>}
              </div>
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
            <div className="sp-meta-block">
              <div className="sp-label">Mini test</div>
              <div className="sp-value">
                {questionCount > 0 ? <LastMiniScore node={topic.id} /> : <span className="text-[#888]">No questions yet</span>}
              </div>
            </div>
            <div className="sp-meta-block">
              <div className="sp-label">Rounds</div>
              <RoundToggles node={topic.id} withDates />
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

            <TopicErrors node={topic.id} />

            {topic.sections.map((section, i) => (
              <section key={i} className="sp-section">
                <h2 className="sp-h2">{section.heading}</h2>
                <div className="sp-body" dangerouslySetInnerHTML={{ __html: section.html }} />
              </section>
            ))}

            <div className="pt-8 flex gap-3">
              <Link
                href={`/focus/${encodeURIComponent(topic.slug)}`}
                className="block flex-1 text-center bg-[#111] hover:bg-black text-white text-[13px] font-bold uppercase tracking-[0.08em] py-4"
              >
                Enter focus
              </Link>
              {questionCount > 0 && (
                <Link
                  href={`/practice/topic/${encodeURIComponent(topic.id)}`}
                  className="block text-center bg-white hover:bg-[#f2f2f2] text-[#111] border border-[#111] text-[13px] font-bold uppercase tracking-[0.08em] py-4 px-8"
                >
                  Mini test · {questionCount}
                </Link>
              )}
            </div>
            {flow && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-[#e5e5e5]">
                {flow.prev ? (
                  <Link href={topicHref(flow.prev)} className="sp-quiet-link">
                    &larr; {flow.prev.id}
                  </Link>
                ) : (
                  <span />
                )}
                <Link href={flow.afterMini.href} className="sp-btn sp-btn-ghost">
                  {flow.afterMini.label}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
