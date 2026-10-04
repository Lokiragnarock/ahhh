"use client";

import { createContext, useContext } from "react";
import { DEFAULT_TRACK, type TrackSlug } from "./tracks";

// Current track, threaded from the root layout like the subject.
const TrackContext = createContext<TrackSlug>(DEFAULT_TRACK);

export function TrackProvider({ track, children }: { track: TrackSlug; children: React.ReactNode }) {
  return <TrackContext.Provider value={track}>{children}</TrackContext.Provider>;
}

export function useTrack(): TrackSlug {
  return useContext(TrackContext);
}
