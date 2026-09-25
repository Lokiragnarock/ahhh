import fs from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import { getAllTopics } from "./vault";
import { Question, QuestionType, RenderedQuestion, TYPE_ORDER } from "./question-types";

export const QUESTIONS_DIR = path.join(process.cwd(), "content", "tests", "taxation");

const TYPES: QuestionType[] = ["mcq", "short", "long", "case"];

function isQuestion(q: unknown): q is Question {
  if (!q || typeof q !== "object") return false;
  const o = q as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.node === "string" &&
    typeof o.unit === "string" &&
    typeof o.question === "string" &&
    TYPES.includes(o.type as QuestionType)
  );
}

function md(src: string): string {
  return marked.parse(src, { gfm: true, async: false }) as string;
}

function inline(src: string): string {
  return marked.parseInline(src, { gfm: true, async: false }) as string;
}

function render(q: Question): RenderedQuestion {
  const marks =
    typeof q.marks === "number"
      ? q.marks
      : q.marking_scheme?.reduce((s, p) => s + p.marks, 0) ?? 1;
  return {
    ...q,
    marks,
    difficulty: q.difficulty ?? "medium",
    questionHtml: md(q.question),
    optionsHtml: q.options?.map((o) => inline(o)),
    explanationHtml: q.explanation ? md(q.explanation) : undefined,
    modelAnswerHtml: q.model_answer ? md(q.model_answer) : undefined,
    schemeHtml: q.marking_scheme?.map((p) => inline(p.point)),
  };
}

export async function getQuestions(): Promise<RenderedQuestion[]> {
  let files: string[];
  try {
    files = (await fs.readdir(QUESTIONS_DIR)).filter((f) => f.toLowerCase().endsWith(".json")).sort();
  } catch {
    return [];
  }

  const seen = new Set<string>();
  const out: RenderedQuestion[] = [];
  for (const file of files) {
    let data: unknown;
    try {
      data = JSON.parse(await fs.readFile(path.join(QUESTIONS_DIR, file), "utf8"));
    } catch {
      continue;
    }
    if (!Array.isArray(data)) continue;
    for (const q of data) {
      if (!isQuestion(q) || seen.has(q.id)) continue;
      seen.add(q.id);
      out.push(render(q));
    }
  }
  return out;
}

export function sortByType<T extends { type: QuestionType; id: string }>(qs: T[]): T[] {
  return [...qs].sort(
    (a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type) || a.id.localeCompare(b.id, undefined, { numeric: true })
  );
}

export function unitSort(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true });
}

export interface NodeIndex {
  id: string;
  unit: string;
  title: string;
  slug?: string;
  qCount: number;
}

export interface UnitIndex {
  unit: string;
  qCount: number;
  nodes: NodeIndex[];
}

function unitFromSlug(slug: string): string {
  const i = slug.indexOf(" - ");
  return i === -1 ? slug : slug.slice(0, i).trim();
}

// Units -> nodes, merging question-bank nodes with topic notes from the vault.
export async function getPracticeIndex(): Promise<{ questions: RenderedQuestion[]; units: UnitIndex[] }> {
  const [questions, topics] = await Promise.all([getQuestions(), getAllTopics()]);
  const nodes = new Map<string, NodeIndex>();
  for (const t of topics) {
    nodes.set(t.id, { id: t.id, unit: unitFromSlug(t.slug), title: t.title.replace(new RegExp(`^${t.id}\\s*[—–-]\\s*`), ""), slug: t.slug, qCount: 0 });
  }
  for (const q of questions) {
    const n = nodes.get(q.node) ?? { id: q.node, unit: q.unit, title: q.node, qCount: 0 };
    n.unit = q.unit;
    n.qCount += 1;
    nodes.set(q.node, n);
  }
  const units = new Map<string, UnitIndex>();
  nodes.forEach((n) => {
    const u = units.get(n.unit) ?? { unit: n.unit, qCount: 0, nodes: [] };
    u.nodes.push(n);
    u.qCount += n.qCount;
    units.set(n.unit, u);
  });
  const list = Array.from(units.values()).sort((a, b) => unitSort(a.unit, b.unit));
  for (const u of list) u.nodes.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  return { questions, units: list };
}
