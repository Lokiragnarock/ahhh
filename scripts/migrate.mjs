// Applies every .sql file in db/migrations, in filename order.
//
// Uses the WebSocket Client rather than the HTTP driver the app uses: HTTP
// sends one statement per request, while a migration file is a script. The
// Client speaks the full Postgres protocol, so each file runs as a single
// multi-statement batch inside one transaction — a file either applies
// completely or not at all.
//
// Every migration is written to be safe to re-run (create ... if not exists,
// on conflict do update), so there is no applied-migrations ledger to keep.
//
// Usage: npm run db:migrate

import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Client, neonConfig } from "@neondatabase/serverless";

// Node 22+ ships a global WebSocket, so no `ws` dependency is needed.
if (typeof WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = WebSocket;
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvLocal() {
  const env = {};
  try {
    for (const line of readFileSync(join(root, ".env.local"), "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* optional */
  }
  return env;
}

// Migrations prefer the unpooled connection. DDL is the workload a
// transaction-mode pooler handles worst, and Vercel's Neon integration hands
// you DATABASE_URL_UNPOOLED alongside the pooled one for exactly this. Falls
// back to the pooled URL when that is all there is.
const env = { ...loadEnvLocal(), ...process.env };
const DATABASE_URL =
  env.DATABASE_URL_UNPOOLED || env.POSTGRES_URL_NON_POOLING || env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error(
    "Error: no connection string found. Set DATABASE_URL (or " +
      "DATABASE_URL_UNPOOLED) in .env.local and re-run."
  );
  process.exit(1);
}

if (!env.DATABASE_URL_UNPOOLED && !env.POSTGRES_URL_NON_POOLING) {
  console.log("Note: using the pooled connection — no unpooled URL was set.\n");
}

const dir = join(root, "db", "migrations");
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.error(`Error: no .sql files found in ${dir}`);
  process.exit(1);
}

const client = new Client(DATABASE_URL);

try {
  await client.connect();
  for (const file of files) {
    process.stdout.write(`Applying ${file} ... `);
    await client.query(readFileSync(join(dir, file), "utf8"));
    console.log("ok");
  }
  console.log(`\nApplied ${files.length} migration${files.length === 1 ? "" : "s"}.`);
} catch (err) {
  // A failure to open the socket arrives as an ErrorEvent with an empty
  // message, which prints as "[object ErrorEvent]" and reads as a silent
  // failure. Dig for the wrapped cause before giving up on a reason.
  const detail =
    err?.message ||
    err?.error?.message ||
    err?.cause?.message ||
    err?.code ||
    err?.error?.code ||
    "";

  // A Postgres error explains itself; anything else here means the connection
  // never opened, and the connection string is the thing to look at.
  const reachedDatabase = Boolean(err?.severity || err?.routine);

  console.error(`\nMigration failed: ${detail || "could not connect"}`);
  if (!reachedDatabase) {
    console.error(
      "The database was never reached. Check that the connection string is " +
        "current and that the Neon project still exists."
    );
  }
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
