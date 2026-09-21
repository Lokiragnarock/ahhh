export type TagName =
  | "Units 1-2"
  | "Unit III-A"
  | "Unit III-B"
  | "Unit IV"
  | "Unit V"
  | "Revision"
  | "Exam"
  | "Action Item";

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:MM (24h)
  end: string; // HH:MM (24h)
  title: string;
  tag: TagName;
}

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

export const TAG_COLORS: Record<TagName, string> = {
  "Units 1-2": "#DBEDDB",
  "Unit III-A": "#D3E5EF",
  "Unit III-B": "#E8DEEE",
  "Unit IV": "#FBE4E4",
  "Unit V": "#FDECC8",
  Revision: "#EBECD0",
  Exam: "#EBECD0",
  "Action Item": "#EBECD0",
};

// Darker, readable text color paired with each pastel swatch background.
export const TAG_TEXT_COLORS: Record<TagName, string> = {
  "Units 1-2": "#1C542D",
  "Unit III-A": "#1D5373",
  "Unit III-B": "#5E3378",
  "Unit IV": "#7B2A2A",
  "Unit V": "#77490A",
  Revision: "#54542A",
  Exam: "#54542A",
  "Action Item": "#54542A",
};

export const SWATCH_COLORS = [
  "#DBEDDB",
  "#D3E5EF",
  "#E8DEEE",
  "#FBE4E4",
  "#FDECC8",
  "#EBECD0",
] as const;

export const SWATCH_TO_TAG: Record<string, TagName> = {
  "#DBEDDB": "Units 1-2",
  "#D3E5EF": "Unit III-A",
  "#E8DEEE": "Unit III-B",
  "#FBE4E4": "Unit IV",
  "#FDECC8": "Unit V",
  "#EBECD0": "Revision",
};

export type ViewMode = "day" | "week" | "month";
