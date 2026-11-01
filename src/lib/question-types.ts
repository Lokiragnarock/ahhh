export type QuestionType = "mcq" | "short" | "long" | "case";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  node: string;
  unit: string;
  type: QuestionType;
  marks: number;
  difficulty: Difficulty;
  question: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  model_answer?: string;
  marking_scheme?: { point: string; marks: number }[];
  // Imported exam banks (GRE). `html`: question, options and explanation are
  // already HTML, so they skip markdown. `format` widens an mcq beyond one
  // letter: qc = Quantitative Comparison (shown as four lettered options),
  // multi = pick every right letter (answer "A,C,F"), numeric = type a
  // number (answer "36"), fraction = type numerator and denominator (answer
  // "7/9"; any equal fraction counts).
  html?: boolean;
  format?: QuestionFormat;
  unitAfter?: string; // numeric entry: unit shown after the box, e.g. "%"
  nodeTitle?: string; // node name when the subject has no topic notes yet
  alsoNodes?: { id: string; title?: string }[]; // extra nodes this question also counts towards
  source?: string; // where an imported question came from
}

export type QuestionFormat = "single" | "qc" | "multi" | "numeric" | "fraction";

export const FORMAT_LABEL: Record<QuestionFormat, string> = {
  single: "MCQ",
  qc: "Quant Comparison",
  multi: "Select all",
  numeric: "Numeric entry",
  fraction: "Fraction entry",
};

// Does question q belong to node n (its own node, or one it also counts to)?
export function inNode(q: Pick<Question, "node" | "alsoNodes">, node: string): boolean {
  return q.node === node || (q.alsoNodes?.some((x) => x.id === node) ?? false);
}

// Parse a typed number: "36", "-2.5", "97,5" or "3/4". NaN if not a number.
export function parseEntry(raw: string | undefined): number {
  const s = (raw ?? "").trim().replace(/\s/g, "").replace(",", ".");
  if (!s) return NaN;
  const frac = /^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/.exec(s);
  if (frac) {
    const d = Number(frac[2]);
    return d === 0 ? NaN : Number(frac[1]) / d;
  }
  return /^-?(\d+\.?\d*|\.\d+)$/.test(s) ? Number(s) : NaN;
}

function near(a: number, b: number): boolean {
  return Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(b));
}

// Is this answer right? Covers every format; `choice` holds the letter (or
// sorted letters for multi), `text` the typed entry.
export function isCorrect(q: Question, a: { choice?: string; text?: string } | undefined): boolean {
  const key = (q.answer ?? "").toUpperCase();
  const format = q.format ?? "single";
  if (format === "numeric" || format === "fraction") {
    const got = parseEntry(a?.text);
    const want = parseEntry(q.answer);
    return !Number.isNaN(got) && !Number.isNaN(want) && near(got, want);
  }
  if (format === "multi") {
    const norm = (v: string) => v.toUpperCase().split(",").map((x) => x.trim()).filter(Boolean).sort().join(",");
    return Boolean(a?.choice) && norm(a!.choice!) === norm(key);
  }
  return Boolean(a?.choice) && a!.choice === key;
}

// Has the student put down an answer of any kind?
export function hasAnswer(q: Question, a: { choice?: string; text?: string } | undefined): boolean {
  const format = q.format ?? "single";
  if (format === "numeric" || format === "fraction") return Boolean(a?.text?.trim());
  return Boolean(a?.choice);
}

// Question with markdown pre-rendered on the server, safe to pass to client components.
export interface RenderedQuestion extends Question {
  questionHtml: string;
  optionsHtml?: string[];
  explanationHtml?: string;
  modelAnswerHtml?: string;
  schemeHtml?: string[];
}

export const TYPE_ORDER: QuestionType[] = ["mcq", "short", "long", "case"];

export const TYPE_LABEL: Record<QuestionType, string> = {
  mcq: "MCQ",
  short: "Short · 5",
  long: "Long · 10",
  case: "Case · 15",
};

export function optionLetter(option: string): string {
  const m = /^\s*\(?([A-Za-z])[).:]/.exec(option);
  return m ? m[1].toUpperCase() : option.trim().charAt(0).toUpperCase();
}

// Plain text from imported HTML (GRE): drops figures and data stimuli
// (marked with <!--stim--> ... <!--/stim-->), tags and common entities.
export function plainText(html: string): string {
  return html
    .replace(/<!--stim-->[\s\S]*?<!--\/stim-->/g, " ")
    .replace(/<svg[\s\S]*?<\/svg>/g, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

// Question text fit for snippet(): imported HTML questions go through
// plainText first; markdown questions pass as they are.
export function questionSource(q: Pick<Question, "question" | "html">): string {
  return q.html ? plainText(q.question) : q.question;
}

export function snippet(markdown: string, max = 180): string {
  const plain = markdown
    .replace(/\|/g, " ")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? plain.slice(0, max - 1) + "…" : plain;
}
