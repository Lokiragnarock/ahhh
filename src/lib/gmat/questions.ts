import { cache } from "react";
import { marked } from "marked";
import { db } from "./db";
import { GMAT_NODES, nodesOfTopic } from "./nodes";
import { optionLetter, type Difficulty, type Question } from "../question-types";
import { sectionKeyFromLabel, type SectionKey } from "./scoring";

interface Row {
  id: string;
  section: string;
  topic: string;
  question: string;
  type: string;
  options: unknown;
  correct_answer: string | null;
  explanation: string | null;
  difficulty: string | null;
  statement_1: string | null;
  statement_2: string | null;
}

// The five standard DS choices. Some stored DS rows carry only four (no E),
// so the stored options are ignored and the letter in correct_answer is
// resolved against this fixed set.
const DS_OPTIONS = [
  "A) Statement (1) alone is sufficient, but statement (2) alone is not sufficient.",
  "B) Statement (2) alone is sufficient, but statement (1) alone is not sufficient.",
  "C) Both statements together are sufficient, but neither statement alone is sufficient.",
  "D) Each statement alone is sufficient.",
  "E) Statements (1) and (2) together are not sufficient.",
];

export function answerLetter(a: string | null): string | undefined {
  const c = (a ?? "").trim().charAt(0).toUpperCase();
  return /[A-E]/.test(c) ? c : undefined;
}

function dsStem(r: Row): string {
  let q = r.question;
  if (r.statement_1) q += `\n\n(1) ${r.statement_1}`;
  if (r.statement_2) q += `\n\n(2) ${r.statement_2}`;
  // Stems that embed their statements put them on single newlines, which
  // markdown would run together.
  return q.replace(/(?<!\n)\n(?=Statement \([12]\))/g, "\n\n");
}

function toQuestion(r: Row, node: string): Question | null {
  const ds = r.type === "data_sufficiency";
  if (!ds && r.type !== "mcq") return null;
  const options = ds ? DS_OPTIONS : Array.isArray(r.options) ? r.options.map(String) : [];
  const answer = answerLetter(r.correct_answer);
  if (options.length === 0 || !answer) return null;
  const difficulty: Difficulty = r.difficulty === "easy" || r.difficulty === "medium" ? r.difficulty : "hard";
  return {
    id: r.id,
    node,
    unit: r.section,
    type: "mcq",
    marks: 1,
    difficulty,
    question: ds ? dsStem(r) : r.question,
    options,
    answer,
    explanation: r.explanation ?? undefined,
  };
}

// One round trip per request, shared by every caller. Empty (not a crash)
// when DATABASE_URL is unset or the query fails.
const loadRows = cache(async (): Promise<Row[]> => {
  if (!process.env.DATABASE_URL) return [];
  try {
    return (await db().query(
      `select q.id, q.section, q.topic, q.question, q.type, q.options, q.correct_answer,
              q.explanation, q.difficulty, q.statement_1, q.statement_2
         from questions q
         join topics t on t.id = q.topic_id
        where t.exam_type = 'gmat' and q.archived = false
          and q.type in ('mcq', 'data_sufficiency')`
    )) as Row[];
  } catch (err) {
    console.error("GMAT question load failed:", err instanceof Error ? err.message : err);
    return [];
  }
});

// Questions for one gmat-* subject. A shared-pool question appears once per
// node of its topic, with the same id.
export async function getGmatQuestions(subject: string): Promise<Question[]> {
  const out: Question[] = [];
  for (const r of await loadRows()) {
    for (const node of nodesOfTopic(r.topic, subject)) {
      const q = toQuestion(r, node);
      if (q) out.push(q);
    }
  }
  const order = Object.keys(GMAT_NODES);
  return out.sort((a, b) => order.indexOf(a.node) - order.indexOf(b.node) || a.id.localeCompare(b.id));
}

// One question of the adaptive diagnostic. Markdown is pre-rendered; the
// answer ships to the browser because the sim adapts client-side, the same
// way practice questions already carry theirs.
export interface DiagQuestion {
  id: string;
  section: SectionKey;
  topic: string;
  difficulty: Difficulty;
  questionHtml: string;
  optionsHtml: string[];
  // The letter each option carries, same order as optionsHtml.
  letters: string[];
  answer: string;
}

// Every non-archived question in the three Focus sections, once each (a
// shared-pool question is one row, not one per node).
export async function getDiagnosticPool(): Promise<DiagQuestion[]> {
  const out: DiagQuestion[] = [];
  for (const r of await loadRows()) {
    const section = sectionKeyFromLabel(r.section);
    const q = section && toQuestion(r, "");
    if (!section || !q || !q.options || !q.answer) continue;
    out.push({
      id: q.id,
      section,
      topic: r.topic,
      difficulty: q.difficulty,
      questionHtml: marked.parse(q.question, { gfm: true, async: false }) as string,
      optionsHtml: q.options.map((o) => marked.parseInline(o, { gfm: true, async: false }) as string),
      letters: q.options.map(optionLetter),
      answer: q.answer,
    });
  }
  return out;
}
