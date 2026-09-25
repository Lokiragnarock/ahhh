import type { QuestionType } from "./question-types";
import type { Paper, TestKind } from "./paper";

export interface QuestionResult {
  questionId: string;
  node: string;
  unit: string;
  type: QuestionType;
  marks: number;
  score: number | null; // null = skipped (any-N section)
  counted: boolean;
  section?: string;
}

export interface Attempt {
  id: string;
  kind: Exclude<TestKind, "resolve">;
  scope: string;
  date: string; // ISO
  durationSec: number;
  score: number;
  max: number;
  results: QuestionResult[];
}

export const ERROR_TYPES = [
  "Knowledge gap",
  "Calculation-procedure",
  "Misread question",
  "Format-presentation",
  "Recall-forgot",
] as const;
export type ErrorType = (typeof ERROR_TYPES)[number];

export type ErrorSource = "mini" | "sectional" | "mock" | "manual";
export type ErrorStatus = "open" | "re-solving" | "mastered";

export interface ReviewEvent {
  date: string; // ISO
  clean: boolean;
}

export interface ErrorEntry {
  id: string;
  questionId?: string;
  questionText?: string;
  node: string;
  unit: string;
  source: ErrorSource;
  errorType: ErrorType;
  scoreText?: string; // e.g. "2/5"
  what: string;
  why: string;
  correct: string;
  avoid: string;
  createdAt: string;
  status: ErrorStatus;
  reviews: ReviewEvent[];
  nextReview: string; // YYYY-MM-DD
}

export type Round = "R1" | "R2" | "R3";
export const ROUNDS: Round[] = ["R1", "R2", "R3"];

export interface BlockLog {
  id: string;
  round: Round;
  node?: string;
  startedAt: string;
  endedAt: string;
  minutes: number;
  complete: boolean;
}

export interface BlockTimer {
  id: string;
  round: Round;
  node?: string;
  firstStart: number; // ms epoch
  runningSince: number | null; // ms epoch of the current running segment
  accumulatedMs: number; // time banked before the current segment
}

export interface AnswerState {
  choice?: string;
  text?: string;
  revealed?: boolean;
  ticks?: number[];
  override?: number | null;
  skipped?: boolean;
}

export interface SessionState {
  key: string; // `${kind}:${scope}`
  paper: Paper;
  startedAt: number;
  endedAt: number | null;
  answers: Record<string, AnswerState>;
  phase: "answer" | "mark";
}
