// Pieces of the subject layer shared by server and client code.

// The current subject lives in this cookie once a tab has been clicked. Same
// pattern as the sync_key cookie: plain, not httpOnly, since it carries no
// secret — just which subfolder of content/recall and content/tests to read.
export const SUBJECT_COOKIE = "subject_key";
export const SUBJECT_COOKIE_MAX_AGE = 400 * 24 * 60 * 60;

// Fallback when no cookie is set yet (first-ever visit, or a stale cookie
// pointing at a subject folder that no longer exists). Taxation is the
// original single subject, so existing users land exactly where they always
// did.
export const DEFAULT_SUBJECT = "taxation";

export function isValidSubjectSlug(slug: string | null | undefined): slug is string {
  return typeof slug === "string" && /^[a-z0-9][a-z0-9-]{0,63}$/.test(slug);
}

// Display name from a folder slug. A handful of subjects need an override
// (an acronym, or a name that isn't just its slug title-cased); everything
// else is plain title-casing of the hyphen-separated words. Deliberately not
// smarter than this — new subjects can add themselves here if the default
// title-casing looks wrong.
const LABEL_OVERRIDES: Record<string, string> = {
  taxation: "Taxation Law",
};
const ACRONYM_WORDS = new Set(["sapm", "sfm", "moc"]);

export function subjectLabel(slug: string): string {
  const override = LABEL_OVERRIDES[slug];
  if (override) return override;
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => (ACRONYM_WORDS.has(word) ? word.toUpperCase() : word[0].toUpperCase() + word.slice(1)))
    .join(" ");
}

export interface SubjectInfo {
  slug: string;
  label: string;
}
