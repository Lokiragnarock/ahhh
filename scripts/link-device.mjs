// Binds a device key (a planner sync key) to an existing player, so that
// device's GMAT attempts land on that player. Used to link Lokesh's devices.
//
// Usage: npm run db:link -- <handle> <deviceKey> [label]
// Run after 006_planner_players.sql has been applied.

import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
try {
  for (const line of readFileSync(join(root, ".env.local"), "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* optional when vars are already set */
}

const [handle, deviceKey, label] = process.argv.slice(2);
if (!handle || !deviceKey) {
  console.error("Usage: node scripts/link-device.mjs <handle> <deviceKey> [label]");
  process.exit(1);
}
if (!/^[A-Za-z0-9_-]{16,64}$/.test(deviceKey)) {
  console.error("That does not look like a device key (16-64 chars of A-Z a-z 0-9 _ -).");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const player = await sql.query("select id, display_name from profiles where handle = $1", [handle]);
if (player.length === 0) {
  console.error(`No player with handle ${handle}.`);
  process.exit(1);
}

// A key already bound elsewhere (e.g. auto-onboarded as a new player) is
// reported rather than silently moved.
const bound = await sql.query("select player_id from device_keys where key = $1", [deviceKey]);
if (bound.length > 0 && bound[0].player_id !== player[0].id) {
  console.error(`That device key is already bound to another player (${bound[0].player_id}). Delete that binding first.`);
  process.exit(1);
}

await sql.query(
  `insert into device_keys (key, player_id, label) values ($1, $2, $3)
   on conflict (key) do update set revoked_at = null, label = coalesce($3, device_keys.label)`,
  [deviceKey, player[0].id, label ?? null]
);
console.log(`Bound the device to ${player[0].display_name} (${handle}).`);
