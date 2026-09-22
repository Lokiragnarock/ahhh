import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import {
  Flashcard,
  NoteSection,
  TopicNode,
  TopicState,
  UnitGroup,
} from "./study-types";

// The vault is the source of truth. Read at request time — never cached,
// never rebuilt — so edits made in Obsidian show up on the next page load.
const rawVaultDir = process.env.VAULT_RECALL_PATH;
if (!rawVaultDir) {
  throw new Error("VAULT_RECALL_PATH is not set. Copy .env.example to .env.local and set it.");
}
export const VAULT_DIR = rawVaultDir;

const VALID_STATES: TopicState[] = ["unstudied", "studied", "mapped", "drilled"];

marked.setOptions({ gfm: true, breaks: false });

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/i, "");
}

function sectionFromFilename(filename: string): string {
  // "Unit 3A - HP-1 Chargeability and Ownership.md" -> "Unit 3A"
  const base = slugFromFilename(filename);
  const dashIdx = base.indexOf(" - ");
  return dashIdx === -1 ? base : base.slice(0, dashIdx).trim();
}

interface SplitSections {
  lead: string;
  sections: { heading: string; body: string }[];
}

function splitSections(markdown: string): SplitSections {
  const lines = markdown.split(/\r?\n/);
  const sections: { heading: string; bodyLines: string[] }[] = [];
  let current: { heading: string; bodyLines: string[] } | null = null;
  const leadLines: string[] = [];

  for (const line of lines) {
    const headingMatch = /^##\s+(.+?)\s*$/.exec(line);
    if (headingMatch) {
      if (current) sections.push(current);
      current = { heading: headingMatch[1].trim(), bodyLines: [] };
    } else if (current) {
      current.bodyLines.push(line);
    } else {
      leadLines.push(line);
    }
  }
  if (current) sections.push(current);

  return {
    lead: leadLines.join("\n"),
    sections: sections.map((s) => ({ heading: s.heading, body: s.bodyLines.join("\n") })),
  };
}

function extractMermaid(body: string): string | null {
  const match = /```mermaid\s*\r?\n([\s\S]*?)```/.exec(body);
  return match ? match[1].trim() : null;
}

function extractFlashcards(body: string): Flashcard[] {
  const cards: Flashcard[] = [];
  const lines = body.split(/\r?\n/);
  let pendingQ: string | null = null;
  for (const line of lines) {
    const qMatch = /^Q:\s*(.+)$/.exec(line.trim());
    const aMatch = /^A:\s*(.+)$/.exec(line.trim());
    if (qMatch) {
      pendingQ = qMatch[1].trim();
    } else if (aMatch && pendingQ) {
      cards.push({ q: pendingQ, a: aMatch[1].trim() });
      pendingQ = null;
    }
  }
  return cards;
}

function parseNote(filename: string, raw: string): TopicNode | null {
  const { data, content } = matter(raw);
  if (!data.node) return null; // not a topic node (MOC, cheat sheet, etc.)

  const { lead, sections: rawSections } = splitSections(content);

  const h1Match = /^#\s+(.+?)\s*$/m.exec(lead);
  const title = h1Match ? h1Match[1].trim() : slugFromFilename(filename);
  const leadBody = h1Match ? lead.slice(h1Match.index! + h1Match[0].length) : lead;
  const leadHtml = marked.parse(leadBody.trim()) as string;

  const sections: NoteSection[] = [];
  let mermaid: string | null = null;
  let flashcards: Flashcard[] = [];

  if (leadBody.trim()) {
    sections.push({ heading: "Overview", html: leadHtml });
  }

  for (const raw of rawSections) {
    const headingLower = raw.heading.toLowerCase();
    if (headingLower === "concept map") {
      mermaid = extractMermaid(raw.body);
      continue; // hidden during reading, shown only on reveal
    }
    if (headingLower === "flashcards") {
      flashcards = extractFlashcards(raw.body);
      continue; // stripped from the reading view
    }
    sections.push({ heading: raw.heading, html: marked.parse(raw.body.trim()) as string });
  }

  const stateRaw = typeof data.state === "string" ? data.state.toLowerCase() : "unstudied";
  const state: TopicState = VALID_STATES.includes(stateRaw as TopicState)
    ? (stateRaw as TopicState)
    : "unstudied";

  const minutes: number =
    typeof data.minutes === "number"
      ? data.minutes
      : typeof data.weight === "number"
        ? data.weight * 15 // planning-number fallback: 15 min per weight point
        : 30;

  return {
    id: String(data.node),
    slug: slugFromFilename(filename),
    title,
    docTitle: typeof data.title === "string" ? data.title : title,
    section: typeof data.section === "string" ? data.section : sectionFromFilename(filename),
    minutes,
    deps: Array.isArray(data.deps) ? data.deps.map(String) : [],
    state,
    examFocus: Boolean(data.exam_focus),
    sections,
    mermaid,
    flashcards,
  };
}

export async function getAllTopics(): Promise<TopicNode[]> {
  let filenames: string[];
  try {
    filenames = (await fs.readdir(VAULT_DIR)).filter((f) => f.toLowerCase().endsWith(".md"));
  } catch {
    return [];
  }

  const notes = await Promise.all(
    filenames.map(async (filename) => {
      try {
        const raw = await fs.readFile(path.join(VAULT_DIR, filename), "utf8");
        return parseNote(filename, raw);
      } catch {
        return null;
      }
    })
  );

  return notes.filter((n): n is TopicNode => n !== null);
}

export async function getTopic(slug: string): Promise<TopicNode | null> {
  const filePath = path.join(VAULT_DIR, `${slug}.md`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return parseNote(`${slug}.md`, raw);
  } catch {
    return null;
  }
}

export async function getUnitGroups(): Promise<UnitGroup[]> {
  const topics = await getAllTopics();
  const groups = new Map<string, TopicNode[]>();
  for (const topic of topics) {
    const list = groups.get(topic.section) ?? [];
    list.push(topic);
    groups.set(topic.section, list);
  }
  return Array.from(groups.entries())
    .map(([id, topicsList]) => ({
      id,
      label: id,
      minutes: topicsList.reduce((s, t) => s + t.minutes, 0),
      topics: topicsList,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export async function setTopicState(slug: string, state: TopicState): Promise<boolean> {
  if (!VALID_STATES.includes(state)) return false;
  const filePath = path.join(VAULT_DIR, `${slug}.md`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    return false;
  }

  const fmMatch = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(raw);
  if (!fmMatch) return false;

  const frontmatterFull = fmMatch[0];
  const frontmatterBody = fmMatch[1];

  let updatedBody: string;
  if (/^state:\s*.*$/m.test(frontmatterBody)) {
    updatedBody = frontmatterBody.replace(/^state:\s*.*$/m, `state: ${state}`);
  } else {
    updatedBody = `${frontmatterBody}\nstate: ${state}`;
  }

  const updatedFull = frontmatterFull.replace(frontmatterBody, updatedBody);
  const newRaw = updatedFull + raw.slice(frontmatterFull.length);

  await fs.writeFile(filePath, newRaw, "utf8");
  return true;
}
