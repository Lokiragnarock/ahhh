"use client";

import { createContext, useContext } from "react";
import { DEFAULT_TRACK, type TrackSlug } from "./tracks";

export type PlayerRole = "owner" | "player" | null;

// Current track, threaded from the root layout like the subject. `role` is
// the GMAT player's role (null on AHH, or when this device has no player);
// the nav reads it to show owner-only links.
const TrackContext = createContext<{ track: TrackSlug; role: PlayerRole }>({ track: DEFAULT_TRACK, role: null });

export function TrackProvider({
  track,
  role = null,
  children,
}: {
  track: TrackSlug;
  role?: PlayerRole;
  children: React.ReactNode;
}) {
  return <TrackContext.Provider value={{ track, role }}>{children}</TrackContext.Provider>;
}

export function useTrack(): TrackSlug {
  return useContext(TrackContext).track;
}

export function useRole(): PlayerRole {
  return useContext(TrackContext).role;
}
