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
  node: string | null;
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
              q.explanation, q.difficulty, q.statement_1, q.statement_2, q.node
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

// Stable string hash, so an unpinned question lands on the same node every load.
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Questions for one gmat-* subject. A question pinned to a node (questions.node)
// appears under that node only. An unpinned one goes to exactly one node of its
// topic, picked by hashing the start of its stem: RC and table sets share a
// passage, so their questions stay together. Serving it under every node of the
// topic repeated Critical Reasoning 4x and Algebra 3x.
export async function getGmatQuestions(subject: string): Promise<Question[]> {
  const out: Question[] = [];
  for (const r of await loadRows()) {
    let node: string | undefined;
    if (r.node) {
      if (GMAT_NODES[r.node]?.subject === subject) node = r.node;
    } else {
      const nodes = nodesOfTopic(r.topic, subject);
      if (nodes.length) node = nodes[hash(r.question.slice(0, 120).toLowerCase()) % nodes.length];
    }
    const q = node && toQuestion(r, node);
    if (q) out.push(q);
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
