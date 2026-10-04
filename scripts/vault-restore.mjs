// Restores the database from a vault snapshot written by vault-snapshot.mjs.
//
// The counterpart to the three-generation rotation: this is what makes a
// destructive SQL statement survivable rather than merely recorded.
//
// Usage: npm run db:restore            (restores the `current` generation)
//        npm run db:restore -- n-1     (one state further back)
//        npm run db:restore -- n-2
//        npm run db:restore -- n-1 --dry-run
//
// This REPLACES the contents of every table present in the snapshot. It is
// destructive by design — restoring a state means discarding whatever came
// after it. It refuses to run without --yes unless the target generation is
// strictly newer than nothing, so the sequence is always: look at the
// manifest, then confirm.

import { neon } from "@neondatabase/serverless";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const VAULT_PATH =
  process.env.VAULT_PATH ?? "D:\\Lokesh\\Christ\\Y3\\Y3\\Second Brain\\StudyDuel";
const SNAPSHOT_ROOT = join(VAULT_PATH, "Snapshots");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const confirmed = args.includes("--yes");
const generation = args.find((a) => !a.startsWith("--")) ?? "current";

// Children before parents on the way out, parents before children on the way
// in — the reverse of the dump order, so foreign keys never block either leg.
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
  /* optional */
}

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL.");
  process.exit(1);
}

const dir = join(SNAPSHOT_ROOT, generation);
if (!existsSync(dir)) {
  console.error(`No snapshot at ${dir}.`);
  console.error(`Available: ${["current", "n-1", "n-2"].filter((g) => existsSync(join(SNAPSHOT_ROOT, g))).join(", ") || "none"}`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8"));

console.log(`Snapshot: ${generation}  (taken ${manifest.takenAt})`);
for (const t of manifest.tables) {
  console.log(`  ${t.table.padEnd(20)} ${t.existed ? String(t.rows) : "(absent)"}`);
}

if (dryRun) {
  console.log("\nDry run — nothing written.");
  process.exit(0);
}

if (!confirmed) {
  console.error(
    "\nThis replaces every table listed above and discards anything written since."
  );
  console.error(`Re-run with --yes to proceed:  npm run db:restore -- ${generation} --yes`);
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// Column lists come from the snapshot rows rather than from the live schema:
// the point of a restore is to rebuild the state the snapshot describes, and
// reading today's columns would quietly reintroduce whatever the destructive
// change did.
function columnsOf(rows) {
  return rows.length === 0 ? [] : Object.keys(rows[0]);
}

function quoteIdent(name) {
  return `"${name.replace(/"/g, '""')}"`;
}

let restored = 0;
let skipped = 0;

// Deletes run child-first so foreign keys do not block them.
for (const table of [...TABLES].reverse()) {
  const file = join(dir, `${table}.json`);
  if (!existsSync(file)) continue;
  const dump = JSON.parse(readFileSync(file, "utf8"));
  if (!dump.existed) continue;
  try {
    await sql.query(`delete from ${quoteIdent(table)}`);
  } catch (error) {
    console.error(`  ${table}: could not clear — ${error.message}`);
    process.exit(1);
  }
}

// Inserts run parent-first.
for (const table of TABLES) {
  const file = join(dir, `${table}.json`);
  if (!existsSync(file)) continue;

  const dump = JSON.parse(readFileSync(file, "utf8"));
  if (!dump.existed) {
    console.log(`  ${table.padEnd(20)} skipped (absent in snapshot)`);
    skipped++;
    continue;
  }

  const rows = dump.rows;
  if (rows.length === 0) {
    console.log(`  ${table.padEnd(20)} 0`);
    continue;
  }

  const cols = columnsOf(rows);
  const colList = cols.map(quoteIdent).join(", ");

  // One statement per row. Slower than a single multi-row insert, but a bad
  // row names itself instead of failing an opaque batch — which is what you
  // want at the moment you are already recovering from something.
  for (const row of rows) {
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
    const values = cols.map((c) => {
      const v = row[c];
      // jsonb columns (questions.options, questions.key_points) come back as
      // parsed objects and have to go in as JSON text, not "[object Object]".
      return v !== null && typeof v === "object" && !(v instanceof Date)
        ? JSON.stringify(v)
        : v;
    });
    try {
      // sql.query() rather than the tagged template: the column list is
      // built from the snapshot, so this is a parameterised plain query.
      // Values are always bound, never interpolated.
      await sql.query(
        `insert into ${quoteIdent(table)} (${colList}) values (${placeholders})`,
        values
      );
    } catch (error) {
      console.error(`  ${table}: row failed — ${error.message}`);
      process.exit(1);
    }
  }

  console.log(`  ${table.padEnd(20)} ${rows.length}`);
  restored += rows.length;
}

console.log(`\nRestored ${restored} rows from ${generation}. ${skipped} table(s) skipped.`);
