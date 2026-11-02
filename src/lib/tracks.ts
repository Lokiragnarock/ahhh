// Pieces of the track layer shared by server and client code. A track is a
// group of subjects (ahh = every original subject, gmat = the gmat-* folders,
// gre = the gre-* folders, ca = the ca-* ICAI papers) with its own nav and
// its own remembered subject.
//
// Adding a track (e.g. cat- for the CAT MBA exam) means one more TrackSlug
// member and one more TRACKS entry, plus its content folders. Nothing else in
// the app names a track directly: it reads `heavy`, `scoring`, `sections` and
// `prefix` from here.

export type TrackSlug = "ahh" | "gmat" | "gre" | "ca";

// Same pattern as subject_key: plain cookie, no secret.
export const TRACK_COOKIE = "track_key";
export const DEFAULT_TRACK: TrackSlug = "ahh";

export interface TrackNavLink {
  href: string;
  label: string;
  // Shown only to the owner of a heavy track (see TrackProvider's role).
  ownerOnly?: boolean;
}

// One subject folder of a track, e.g. gmat-quant, with its display name.
export interface TrackSection {
  slug: string;
  label: string;
}

// Which scoring the practice runner applies. "ese" is the university paper
// (marks, self-marking); "gmat-focus" is src/lib/gmat/scoring; null means
// plain right/wrong with no scaled score.
export type ScoringId = "ese" | "gmat-focus" | null;

export interface TrackConfig {
  label: string;
  // Subject folders belong to the track whose prefix they start with. The
  // track with no prefix (ahh) owns everything else.
  prefix?: string;
  home: string;
  nav: TrackNavLink[];
  // Known subject folders, in display order. Their labels feed subjectLabel.
  sections: TrackSection[];
  scoring: ScoringId;
  // GMAT-style heavy layer: Neon question bank, player sign-up, adaptive
  // runner, diagnostic, Versus. A light track reads content/tests and uses
  // the plain runner.
  heavy: boolean;
}

export const TRACKS: Record<TrackSlug, TrackConfig> = {
  ahh: {
    label: "AHH",
    home: "/territory",
    nav: [
      { href: "/", label: "Home" },
      { href: "/territory", label: "Territory" },
      { href: "/practice", label: "Practice" },
      { href: "/errors", label: "Error book" },
      { href: "/standing", label: "Standing" },
      { href: "/timeline", label: "Timeline" },
      { href: "/duel", label: "Duel" },
      { href: "/block", label: "Block" },
      { href: "/backup", label: "Backup" },
      { href: "/help", label: "Help" },
    ],
    // AHH subjects are found on disk; their labels come from subjectLabel.
    sections: [],
    scoring: "ese",
    heavy: false,
  },
  gmat: {
    label: "GMAT",
    prefix: "gmat-",
    home: "/gmat/status",
    nav: [
      { href: "/", label: "Home" },
      { href: "/gmat/status", label: "Status" },
      { href: "/territory", label: "Territory" },
      { href: "/practice", label: "Practice" },
      { href: "/errors", label: "Error book" },
      { href: "/timeline", label: "Timeline" },
      { href: "/block", label: "Block" },
      { href: "/backup", label: "Backup" },
      { href: "/help", label: "Help" },
      { href: "/gmat/versus", label: "Versus", ownerOnly: true },
    ],
    sections: [
      { slug: "gmat-quant", label: "GMAT Quant" },
      { slug: "gmat-verbal", label: "GMAT Verbal" },
      { slug: "gmat-di", label: "GMAT Data Insights" },
      { slug: "gmat-strategy", label: "GMAT Strategy" },
    ],
    scoring: "gmat-focus",
    heavy: true,
  },
  gre: {
    label: "GRE",
    prefix: "gre-",
    home: "/territory",
    nav: [
      { href: "/", label: "Home" },
      { href: "/territory", label: "Territory" },
      { href: "/practice", label: "Practice" },
      { href: "/errors", label: "Error book" },
      { href: "/timeline", label: "Timeline" },
      { href: "/block", label: "Block" },
      { href: "/backup", label: "Backup" },
      { href: "/help", label: "Help" },
    ],
    sections: [
      { slug: "gre-quant", label: "GRE Quant" },
      { slug: "gre-verbal", label: "GRE Verbal" },
      { slug: "gre-awa", label: "GRE Writing" },
      { slug: "gre-strategy", label: "GRE Strategy" },
    ],
    scoring: null,
    heavy: false,
  },
  ca: {
    label: "CA",
    // "ca-" not "ca": a future cat- track must not fall in here.
    prefix: "ca-",
    home: "/territory",
    nav: [
      { href: "/", label: "Home" },
      { href: "/territory", label: "Territory" },
      { href: "/practice", label: "Practice" },
      { href: "/errors", label: "Error book" },
      { href: "/timeline", label: "Timeline" },
      { href: "/block", label: "Block" },
      { href: "/backup", label: "Backup" },
      { href: "/help", label: "Help" },
    ],
    sections: [{ slug: "ca-inter-cma", label: "CA Inter CMA" }],
    // ICAI pass rules (40% per paper, 50% per group) come later as their own module.
    scoring: null,
    heavy: false,
  },
};

export const TRACK_SLUGS = Object.keys(TRACKS) as TrackSlug[];

export function isValidTrack(t: string | null | undefined): t is TrackSlug {
  return typeof t === "string" && Object.prototype.hasOwnProperty.call(TRACKS, t);
}

export function trackOfSubject(slug: string): TrackSlug {
  for (const [name, cfg] of Object.entries(TRACKS)) {
    if (cfg.prefix && slug.startsWith(cfg.prefix)) return name as TrackSlug;
  }
  return DEFAULT_TRACK;
}

// Shorthand for the many places that only ask "does this subject use the
// GMAT-style heavy layer?".
export function isHeavySubject(slug: string): boolean {
  return TRACKS[trackOfSubject(slug)].heavy;
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
