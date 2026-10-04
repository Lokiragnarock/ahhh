import { randomUUID } from "node:crypto";
import { db } from "./db";

export interface Player {
  id: string;
  handle: string | null;
  displayName: string;
  role: "owner" | "player";
}

interface PlayerRow {
  id: string;
  handle: string | null;
  display_name: string;
  role: "owner" | "player";
}

const toPlayer = (r: PlayerRow): Player => ({
  id: r.id,
  handle: r.handle,
  displayName: r.display_name,
  role: r.role,
});

// The player behind a device key, via a non-revoked device_keys row. One
// statement: last_seen is bumped at most once an hour, in the same round trip.
export async function resolvePlayer(deviceKey: string): Promise<Player | null> {
  const rows = (await db().query(
    `with d as (
       select player_id from device_keys where key = $1 and revoked_at is null
     ), touch as (
       update device_keys set last_seen = now()
        where key = $1 and revoked_at is null
          and (last_seen is null or last_seen < now() - interval '1 hour')
     )
     select p.id, p.handle, p.display_name, p.role
       from d join profiles p on p.id = d.player_id`,
    [deviceKey]
  )) as PlayerRow[];
  return rows[0] ? toPlayer(rows[0]) : null;
}

function slugify(name: string): string {
  return name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 30) || "player";
}

// Creates a player and binds the device key to them in one transaction. A key
// that is already bound just returns its player.
export async function onboardPlayer(deviceKey: string, displayName: string): Promise<Player> {
  const existing = await resolvePlayer(deviceKey);
  if (existing) return existing;

  const sql = db();
  const name = displayName.trim().slice(0, 40) || "Player";
  const base = slugify(name);

  for (let attempt = 0; attempt < 3; attempt++) {
    const taken = new Set(
      ((await sql.query("select handle from profiles where handle like $1", [`${base}%`])) as { handle: string }[]).map(
        (r) => r.handle
      )
    );
    let handle = base;
    for (let n = 2; taken.has(handle); n++) handle = `${base}-${n}`;

    const id = randomUUID();
    try {
      await sql.transaction((txn) => [
        txn.query(
          "insert into profiles (id, display_name, exam_type, handle, role, tracks) values ($1, $2, 'gmat', $3, 'player', '{gmat}')",
          [id, name, handle]
        ),
        txn.query("insert into device_keys (key, player_id) values ($1, $2)", [deviceKey, id]),
      ]);
      return { id, handle, displayName: name, role: "player" };
    } catch (err) {
      // A concurrent onboarding either took the handle or bound this key.
      const bound = await resolvePlayer(deviceKey);
      if (bound) return bound;
      if (attempt === 2) throw err;
    }
  }
  throw new Error("onboarding failed");
}
