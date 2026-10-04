// Pieces of the track layer shared by server and client code. A track is a
// group of subjects (ahh = every original subject, gmat = the gmat-* folders)
// with its own nav and its own remembered subject.

export type TrackSlug = "ahh" | "gmat";

// Same pattern as subject_key: plain cookie, no secret.
export const TRACK_COOKIE = "track_key";
export const DEFAULT_TRACK: TrackSlug = "ahh";

export interface TrackNavLink {
  href: string;
  label: string;
}

export interface TrackConfig {
  label: string;
  // Subject folders belong to the track whose prefix they start with. The
  // track with no prefix (ahh) owns everything else. A new track (cat-) is
  // one more entry here plus the TrackSlug union.
  prefix?: string;
  home: string;
  nav: TrackNavLink[];
}

export const TRACKS: Record<TrackSlug, TrackConfig> = {
  ahh: {
    label: "AHH",
    home: "/",
    nav: [
      { href: "/", label: "Territory" },
      { href: "/practice", label: "Practice" },
      { href: "/errors", label: "Error book" },
      { href: "/standing", label: "Standing" },
      { href: "/timeline", label: "Timeline" },
      { href: "/duel", label: "Duel" },
      { href: "/block", label: "Block" },
      { href: "/backup", label: "Backup" },
      { href: "/help", label: "Help" },
    ],
  },
  gmat: {
    label: "GMAT",
    prefix: "gmat-",
    home: "/",
    nav: [
      { href: "/", label: "Territory" },
      { href: "/practice", label: "Practice" },
      { href: "/errors", label: "Error book" },
      { href: "/timeline", label: "Timeline" },
      { href: "/block", label: "Block" },
      { href: "/backup", label: "Backup" },
      { href: "/help", label: "Help" },
    ],
  },
};

export function isValidTrack(t: string | null | undefined): t is TrackSlug {
  return typeof t === "string" && Object.prototype.hasOwnProperty.call(TRACKS, t);
}

export function trackOfSubject(slug: string): TrackSlug {
  for (const [name, cfg] of Object.entries(TRACKS)) {
    if (cfg.prefix && slug.startsWith(cfg.prefix)) return name as TrackSlug;
  }
  return DEFAULT_TRACK;
}

// Per-track memory of the last subject picked, so toggling away and back
// lands where you left off.
export function trackSubjectCookie(track: TrackSlug): string {
  return `subject_key_${track}`;
}

// Stand-in subject for a track with no folders yet. Doesn't exist on disk, so
// every reader returns its empty state instead of falling back to taxation.
export function emptySubjectFor(track: TrackSlug): string {
  const prefix = TRACKS[track].prefix;
  return prefix ? `${prefix}notes` : "taxation";
}
