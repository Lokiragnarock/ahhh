import { QuestionType, RenderedQuestion, TYPE_LABEL, TYPE_ORDER } from "./question-types";

export type TestKind = "mini" | "sectional" | "mock" | "resolve";

export interface PaperSection {
  id: string;
  title: string;
  instruction?: string;
  answerAny?: number; // count best N attempted
  marksEach?: number;
  questionIds: string[];
}

export interface Paper {
  kind: TestKind;
  scope: string; // node id, unit label, "mock", or question id for a re-solve
  title: string;
  durationMin: number | null; // null = count-up timer
  sections: PaperSection[];
  notes: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function byType(pool: RenderedQuestion[], type: QuestionType) {
  return pool.filter((q) => q.type === type);
}

// Take n questions, spreading picks across units round-robin.
function spread(pool: RenderedQuestion[], n: number): RenderedQuestion[] {
  const groups = new Map<string, RenderedQuestion[]>();
  for (const q of shuffle(pool)) groups.set(q.unit, [...(groups.get(q.unit) ?? []), q]);
  const lists = shuffle(Array.from(groups.values()));
  const out: RenderedQuestion[] = [];
  while (out.length < n && lists.some((l) => l.length)) {
    for (const l of lists) {
      const q = l.shift();
      if (q && out.length < n) out.push(q);
    }
  }
  return out;
}

function typeSections(qs: RenderedQuestion[]): PaperSection[] {
  return TYPE_ORDER.map((t) => ({
    id: t,
    title: TYPE_LABEL[t],
    questionIds: qs.filter((q) => q.type === t).map((q) => q.id),
  })).filter((s) => s.questionIds.length > 0);
}

export function buildMini(pool: RenderedQuestion[], node: string): Paper {
  const qs = pool.filter((q) => q.node === node);
  return { kind: "mini", scope: node, title: `${node} mini test`, durationMin: null, sections: typeSections(qs), notes: [] };
}

export function buildSectional(pool: RenderedQuestion[], unit: string): Paper {
  const unitPool = pool.filter((q) => q.unit === unit);
  const want: [QuestionType, number][] = [["mcq", 8], ["short", 3], ["long", 2]];
  const picked: RenderedQuestion[] = [];
  const notes: string[] = [];
  for (const [t, n] of want) {
    const got = shuffle(byType(unitPool, t)).slice(0, n);
    if (got.length < n) notes.push(`Only ${got.length} of ${n} ${TYPE_LABEL[t]} questions available for ${unit}.`);
    picked.push(...got);
  }
  const marks = picked.reduce((s, q) => s + q.marks, 0);
  const durationMin = Math.max(10, Math.round((marks * 1.4) / 5) * 5);
  return { kind: "sectional", scope: unit, title: `${unit} sectional test`, durationMin, sections: typeSections(picked), notes };
}

export function buildMock(pool: RenderedQuestion[]): Paper {
  const spec: { id: string; type: QuestionType; count: number; any: number; each: number; title: string }[] = [
    { id: "A", type: "short", count: 5, any: 3, each: 5, title: "Section A · Short answer" },
    { id: "B", type: "long", count: 3, any: 2, each: 10, title: "Section B · Long answer" },
    { id: "C", type: "case", count: 1, any: 1, each: 15, title: "Section C · Case study" },
  ];
  const notes: string[] = [];
  const sections: PaperSection[] = spec.map((s) => {
    const got = spread(byType(pool, s.type), s.count);
    if (got.length < s.count) notes.push(`Section ${s.id}: pool has only ${got.length} of ${s.count} questions.`);
    return {
      id: s.id,
      title: s.title,
      instruction:
        s.any === s.count ? `Compulsory. ${s.each} marks.` : `Answer any ${s.any} of ${s.count}. ${s.each} marks each.`,
      answerAny: s.any,
      marksEach: s.each,
      questionIds: got.map((q) => q.id),
    };
  });
  return { kind: "mock", scope: "mock", title: "Full ESE mock", durationMin: 120, sections, notes };
}

export function buildSingle(q: RenderedQuestion): Paper {
  return {
    kind: "resolve",
    scope: q.id,
    title: `Re-solve ${q.id}`,
    durationMin: null,
    sections: [{ id: q.type, title: TYPE_LABEL[q.type], questionIds: [q.id] }],
    notes: [],
  };
}
