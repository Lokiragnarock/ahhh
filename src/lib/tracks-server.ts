import { cookies } from "next/headers";
import { DEFAULT_TRACK, isValidTrack, TRACK_COOKIE, type TrackSlug } from "./tracks";

// The caller's current track. Cookie only; outside a request (build time)
// cookies() throws, which means "use the default".
export function currentTrack(): TrackSlug {
  try {
    const t = cookies().get(TRACK_COOKIE)?.value;
    return isValidTrack(t) ? t : DEFAULT_TRACK;
  } catch {
    return DEFAULT_TRACK;
  }
}
