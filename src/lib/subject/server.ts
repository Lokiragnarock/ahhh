import { cookies } from "next/headers";
import { DEFAULT_SUBJECT, isValidSubjectSlug, SUBJECT_COOKIE } from "./shared";

// The caller's current subject slug. Just the cookie, validated for shape —
// no filesystem check here (vault.ts / questions.ts already fall back to an
// empty list when a subject folder doesn't exist, which is the same thing a
// stale or tampered cookie would produce). Outside a request (build time)
// cookies() throws, which also means "use the default".
export function currentSubject(): string {
  try {
    const slug = cookies().get(SUBJECT_COOKIE)?.value;
    return isValidSubjectSlug(slug) ? slug : DEFAULT_SUBJECT;
  } catch {
    return DEFAULT_SUBJECT;
  }
}
