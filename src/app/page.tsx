import { getUnitGroups, listSubjects } from "@/lib/vault";
import { currentTrack } from "@/lib/tracks-server";
import { SUBJECT_GROUPS, subjectGroup, subjectLabel } from "@/lib/subject/shared";
import { PageHead } from "@/components/PageHead";
import { TopNav } from "@/components/TopNav";
import { TrackBoxes, type TrackRowData } from "@/components/home/TrackBoxes";

// Home: one row per track. Reads the vault at request time, like Territory.
export const dynamic = "force-dynamic";

const GMAT_ORDER = ["gmat-quant", "gmat-verbal", "gmat-di", "gmat-strategy"];
const GRE_ORDER = ["gre-quant", "gre-verbal", "gre-awa", "gre-strategy"];

// Exam tracks: each subject is its own whole-box section.
async function examSections(
  track: "gmat" | "gre",
  subjects: { slug: string }[],
  order: string[],
) {
  const sorted = [...subjects].sort((a, b) => {
    const ia = order.indexOf(a.slug);
    const ib = order.indexOf(b.slug);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  const prefix = new RegExp(`^${track.toUpperCase()}\\s+`);
  return Promise.all(
    sorted.map(async (s) => {
      const units = await getUnitGroups(s.slug).catch(() => []);
      const n = units.reduce((sum, u) => sum + u.topics.length, 0);
      return {
        key: s.slug,
        label: subjectLabel(s.slug).replace(prefix, ""),
        meta: n > 0 ? `${n} ${n === 1 ? "topic" : "topics"}` : undefined,
        items: [],
        boxLink: { track, slug: s.slug, label: subjectLabel(s.slug) },
      };
    }),
  );
}

export default async function HomePage() {
  const [ahh, gmat, gre] = await Promise.all([
    listSubjects("ahh"),
    listSubjects("gmat"),
    listSubjects("gre"),
  ]);

  // Uni: one section per semester group, each holding subject buttons.
  const uniSections = SUBJECT_GROUPS.map((g) => {
    const subs = ahh.filter((s) => subjectGroup(s.slug) === g.key);
    return {
      key: g.key as string,
      label: g.label as string,
      meta: `${subs.length} ${subs.length === 1 ? "subject" : "subjects"}`,
      items: subs.map((s) => ({ track: "ahh", slug: s.slug, label: subjectLabel(s.slug) })),
    };
  }).filter((s) => s.items.length > 0);

  const [gmatSections, greSections] = await Promise.all([
    examSections("gmat", gmat, GMAT_ORDER),
    examSections("gre", gre, GRE_ORDER),
  ]);

  const rows: TrackRowData[] = [
    { key: "uni", title: "Uni", sub: "AHH", count: ahh.length, sections: uniSections },
    {
      key: "gmat",
      title: "GMAT",
      count: gmat.length,
      sections: gmatSections,
      footerLink: { label: "Status", track: "gmat", href: "/gmat/status" },
    },
    { key: "gre", title: "GRE", count: gre.length, sections: greSections },
    { key: "cat", title: "CAT", tag: "Planned" },
    { key: "ca", title: "CA", sub: "ICAI Intermediate", tag: "Planned" },
  ];

  return (
    <main className="sp-page pt-12">
      <TopNav />
      <div className="max-w-[720px] mx-auto px-4 md:px-6 py-10">
        <PageHead title="Home" />
        <TrackBoxes currentTrack={currentTrack()} rows={rows} />
      </div>
    </main>
  );
}
