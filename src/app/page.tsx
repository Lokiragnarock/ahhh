import Link from "next/link";
import { getUnitGroups, listSubjects } from "@/lib/vault";
import { currentSubject } from "@/lib/subject/server";
import { currentTrack } from "@/lib/tracks-server";
import { TRACKS } from "@/lib/tracks";
import { subjectLabel } from "@/lib/subject/shared";
import { Treemap } from "@/components/study/Treemap";
import { TopNav } from "@/components/TopNav";
import { SubjectTabs } from "@/components/SubjectTabs";
import { RoundsBoard, RoundsStrip, TerritoryStats, UpNext } from "@/components/practice/Rounds";
import type { FlowTopic } from "@/lib/flow";

// Screen 1: Territory. Reads the vault at request time — no caching, no
// rebuild — so edits made in Obsidian show up on refresh.
export const dynamic = "force-dynamic";

export default async function TerritoryPage() {
  const subject = currentSubject();
  const track = currentTrack();
  const [units, subjects] = await Promise.all([getUnitGroups(subject), listSubjects(track)]);
  const topics = units.flatMap((u) => u.topics);
  const lite = (t: (typeof topics)[number]): FlowTopic & { minutes: number } => ({
    id: t.id,
    slug: t.slug,
    unit: t.unit,
    title: t.title.replace(new RegExp(`^(${t.id}|${t.unit})\\s*[—–-]\\s*`), ""),
    minutes: t.minutes,
  });
  const ordered = topics.map(lite);
  const board = units.map((u) => ({ unit: u.id, topics: u.topics.map(lite) }));

  return (
    <main className="sp-page pt-12">
      <TopNav />
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10">
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-8">
          <h1 className="sp-h1">Territory</h1>
          <Link href="/calendar" className="text-[12px] uppercase tracking-[0.08em] text-[#888] hover:text-[#111]">
            Old calendar &rarr;
          </Link>
        </div>

        <SubjectTabs subjects={subjects} current={subject} />

        {topics.length === 0 && subjects.length === 0 && track !== "ahh" ? (
          <p className="text-[14.5px] text-[#555] max-w-[60ch]">No {TRACKS[track].label} notes yet.</p>
        ) : topics.length === 0 ? (
          <p className="text-[14.5px] text-[#555] max-w-[60ch]">
            No topic notes found for <strong>{subjectLabel(subject)}</strong> under{" "}
            <code>{`content/recall/${subject}`}</code>. A topic note needs a <code>node</code> field in its
            frontmatter to appear here.
          </p>
        ) : (
          <>
            <RoundsStrip topics={ordered} />
            <UpNext topics={ordered} />

            <TerritoryStats topics={ordered} />

            <div className="mb-12">
              <Treemap units={units} />
            </div>

            <h2 className="sp-h2 mb-4">Rounds by unit</h2>
            <RoundsBoard units={board} />
          </>
        )}
      </div>
    </main>
  );
}
