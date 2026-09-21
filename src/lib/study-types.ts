// Types for the vault-backed study substrate (Territory / Topic / Focus / Drill).
// Distinct from the old calendar types in ./types.ts, which are no longer used
// by the app shell but are left in place per the build brief.

export type TopicState = "unstudied" | "studied" | "mapped" | "drilled";

export const STATE_ORDER: TopicState[] = ["unstudied", "studied", "mapped", "drilled"];

export const STATE_FILL: Record<TopicState, number> = {
  unstudied: 0,
  studied: 1 / 3,
  mapped: 2 / 3,
  drilled: 1,
};

export interface Flashcard {
  q: string;
  a: string;
}

export interface NoteSection {
  heading: string;
  html: string;
}

export interface TopicNode {
  id: string; // frontmatter `node`, e.g. "HP-1"
  slug: string; // filename without extension, used in routes
  title: string; // display title, from the note's H1
  docTitle: string; // frontmatter `title`, kept for sidebar/reference
  section: string; // unit label, derived from filename prefix e.g. "Unit 3A"
  minutes: number;
  deps: string[];
  state: TopicState;
  examFocus: boolean;
  sections: NoteSection[];
  mermaid: string | null;
  flashcards: Flashcard[];
}

export interface UnitGroup {
  id: string; // section label, e.g. "Unit 3A"
  label: string;
  minutes: number;
  topics: TopicNode[];
}
