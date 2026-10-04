import { getAllTopics, listSubjects } from "../vault";
import type { TargetPlan } from "./scoring";
import type { BlockNode } from "./next-block";

// Server-side inputs for the Next-block card: topic metadata for every gmat-*
// subject, and the scaled points each subject's section still needs. Study
// state and the error book are read client-side by the card itself.
const SUBJECT_SECTION: Record<string, "QR" | "VR" | "DI"> = {
  "gmat-quant": "QR",
  "gmat-verbal": "VR",
  "gmat-di": "DI",
};

export async function nextBlockInputs(plan: TargetPlan | null) {
  const subjects = await listSubjects("gmat");
  const lists = await Promise.all(subjects.map(async (s) => ({ subject: s.slug, topics: await getAllTopics(s.slug) })));
  const nodes: BlockNode[] = lists.flatMap(({ subject, topics }) =>
    topics.map((t) => ({
      id: t.id,
      slug: t.slug,
      subject,
      title: t.title,
      examFocus: t.examFocus,
      weight: t.weight,
      deps: t.deps,
      state: t.state,
    }))
  );

  const sectionGap: Record<string, number> = {};
  for (const [subject, key] of Object.entries(SUBJECT_SECTION)) {
    const s = plan?.sections.find((x) => x.key === key);
    if (s) sectionGap[subject] = s.gap;
  }
  return { nodes, sectionGap };
}
