import { db } from "./db";

// Moves a GMAT player's device binding from an old sync key to a new one: the
// old row is revoked and a new row for the same player (same label) is
// inserted, in one statement so it's atomic. Returns false when nothing
// changed — the old key wasn't bound, or Neon isn't configured (AHH-only).
export async function reissueDeviceKey(oldKey: string, newKey: string, label?: string): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  const rows = (await db().query(
    `with old as (
       update device_keys set revoked_at = now()
        where key = $1 and revoked_at is null
       returning player_id, label
     ), ins as (
       insert into device_keys (key, player_id, label)
       select $2, player_id, coalesce($3, label) from old
     )
     select count(*)::int as moved from old`,
    [oldKey, newKey, label ?? null]
  )) as { moved: number }[];
  return (rows[0]?.moved ?? 0) > 0;
}

// Reverses reissueDeviceKey when the Redis half failed: the old key works again.
export async function undoReissueDeviceKey(oldKey: string, newKey: string): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  const sql = db();
  await sql.transaction((txn) => [
    txn.query("delete from device_keys where key = $1", [newKey]),
    txn.query("update device_keys set revoked_at = null where key = $1", [oldKey]),
  ]);
}
