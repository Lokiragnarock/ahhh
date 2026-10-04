// Full database snapshot into the Obsidian vault, keeping three generations.
//
// This exists so that no SQL is unrecoverable. `npm run db:migrate` and
// `npm run db:seed` both run this first, so the state immediately before any
// schema change or reseed is always on disk — and so are the two states before
// that. A migration that drops a column, a seed that truncates, a hand-written
// UPDATE with a bad WHERE: all of them are now one `npm run db:restore` away
// from being undone.
//
// Distinct from vault-sync.mjs, which writes readable markdown for a human.
// This writes exact JSON for a machine. They can share a folder but not a job:
// a markdown table of test scores cannot be replayed into Postgres.
//
// Usage: npm run db:snapshot
// Env:   VAULT_PATH overrides the output folder (shared with vault-sync).

import { neon } from "@neondatabase/serverless";
import {
  readFileSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  renameSync,
  existsSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const VAULT_PATH =
  process.env.VAULT_PATH ?? "D:\\Lokesh\\Christ\\Y3\\Y3\\Second Brain\\StudyDuel";

const SNAPSHOT_ROOT = join(VAULT_PATH, "Snapshots");

// current -> n-1 -> n-2, then dropped. Three deep because the failure mode
// this guards against is often noticed one action late: the destructive
// command runs, something else runs after it, and only then does anyone look.
const GENERATIONS = ["current", "n-1", "n-2"];

// Dump order matters for restore: parents before children, so foreign keys
// resolve on the way back in.
const TABLES = [
  "profiles",
  "topics",
  "questions",
  "tests",
  "attempts",
  "schedule_events",
  "diagnostics",
  "diagnostic_sections",
];

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
try {
  for (const line of readFileSync(join(root, ".env.local"), "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* optional when vars are already set */
}

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// Rotate before writing. Oldest goes first so no rename ever lands on an
// occupied name.
function rotate() {
  mkdirSync(SNAPSHOT_ROOT, { recursive: true });

  const oldest = join(SNAPSHOT_ROOT, GENERATIONS[GENERATIONS.length - 1]);
  if (existsSync(oldest)) rmSync(oldest, { recursive: true, force: true });

  for (let i = GENERATIONS.length - 1; i > 0; i--) {
    const from = join(SNAPSHOT_ROOT, GENERATIONS[i - 1]);
    const to = join(SNAPSHOT_ROOT, GENERATIONS[i]);
    if (existsSync(from)) renameSync(from, to);
  }

  const current = join(SNAPSHOT_ROOT, GENERATIONS[0]);
  mkdirSync(current, { recursive: true });
  return current;
}

// Date and timestamp columns are cast to text rather than selected raw.
//
// This is not cosmetic. The driver hands a `date` back as a JS Date at local
// midnight; JSON.stringify then writes it as a UTC instant, and east of
// Greenwich that is the previous day. Restoring the snapshot inserts that
// earlier date and the row silently moves back one day. Caught in testing:
// a diagnostic taken on 2026-08-17 restored as 2026-08-16.
//
// src/lib/db.ts documents the same trap for the API routes. Same fix here.
const TEXT_CAST_TYPES = new Set([
  "date",
  "timestamp with time zone",
  "timestamp without time zone",
]);

// A table that does not exist yet is not an error — this script runs BEFORE
// migrations, so on a fresh database most of these are legitimately absent.
// Recording that distinguishes "table was not there" from "table was there and
// empty", which matters when deciding what a restore should recreate.
async function dumpTable(name) {
  const cols = await sql.query(
    `select column_name, data_type
       from information_schema.columns
      where table_schema = 'public' and table_name = $1
      order by ordinal_position`,
    [name]
  );

  if (cols.length === 0) return { table: name, existed: false, rows: [] };

  const selectList = cols
    .map(({ column_name, data_type }) => {
      const ident = `"${column_name.replace(/"/g, '""')}"`;
      return TEXT_CAST_TYPES.has(data_type) ? `${ident}::text as ${ident}` : ident;
    })
    .join(", ");

  // sql.query(), not sql`` — identifiers cannot be bound as parameters, so
  // this is a plain string query. The table name comes from the TABLES
  // constant and the columns from information_schema, never from input.
  const rows = await sql.query(`select ${selectList} from ${name}`);
  return { table: name, existed: true, rows };
}

const takenAt = new Date().toISOString();
const dumps = [];
for (const table of TABLES) {
  dumps.push(await dumpTable(table));
}

const dir = rotate();

for (const dump of dumps) {
  writeFileSync(
    join(dir, `${dump.table}.json`),
    JSON.stringify(dump, null, 2),
    "utf8"
  );
}

const manifest = {
  takenAt,
  tables: dumps.map((d) => ({
    table: d.table,
    existed: d.existed,
    rows: d.rows.length,
  })),
};
writeFileSync(join(dir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");

// A readable companion, so the snapshot is legible in Obsidian without opening
// JSON. Frontmatter matches the vault's note convention.
const lines = [
  "---",
  "title: StudyDuel - DB Snapshot",
  "type: db-snapshot",
  `created: ${takenAt.slice(0, 10)}`,
  "tags: [studyduel, database, snapshot]",
  "---",
  "",
  "# StudyDuel database snapshot",
  "",
  `> Taken ${takenAt}. Generation \`current\`.`,
  "> Restore with \`npm run db:restore\` (defaults to this generation).",
  "> Older states are in \`../n-1\` and \`../n-2\`.",
  "",
  "| Table | Rows | Present |",
  "|---|---:|---|",
  ...dumps.map(
    (d) => `| ${d.table} | ${d.rows.length} | ${d.existed ? "yes" : "no"} |`
  ),
  "",
  "The JSON beside this file is the restorable copy — this table is only for reading.",
  "",
];
writeFileSync(join(dir, "Snapshot.md"), lines.join("\n"), "utf8");

console.log(`Snapshot written to ${dir}`);
for (const d of dumps) {
  console.log(`  ${d.table.padEnd(20)} ${d.existed ? String(d.rows.length) : "(absent)"}`);
}
