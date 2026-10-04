import { cache } from "react";
import { currentSyncKey } from "@/lib/sync/server";
import { resolvePlayer, type Player } from "./players";

// Why a page has no player to show: no database / no device key (nothing can
// be stored), or a key with no player bound to it yet (needs onboarding).
export type PlayerState =
  | { state: "ok"; player: Player }
  | { state: "no-db" }
  | { state: "no-player" };

// The player behind this request's device key. Cached per request so the root
// layout (nav role) and the page share one query.
export const currentPlayer = cache(async (): Promise<PlayerState> => {
  if (!process.env.DATABASE_URL) return { state: "no-db" };
  const key = currentSyncKey();
  if (!key) return { state: "no-player" };
  try {
    const player = await resolvePlayer(key);
    return player ? { state: "ok", player } : { state: "no-player" };
  } catch (err) {
    console.error("GMAT player lookup failed:", err instanceof Error ? err.message : err);
    return { state: "no-db" };
  }
});
