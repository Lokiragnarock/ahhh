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

export function snippet(markdown: string, max = 180): string {
  const plain = markdown
    .replace(/\|/g, " ")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? plain.slice(0, max - 1) + "…" : plain;
}
