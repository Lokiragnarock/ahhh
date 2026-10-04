import { NextRequest, NextResponse } from "next/server";
import { listSubjects } from "@/lib/vault";
import { currentSubject } from "@/lib/subject/server";
import { isValidSubjectSlug, SUBJECT_COOKIE, SUBJECT_COOKIE_MAX_AGE } from "@/lib/subject/shared";
import {
  emptySubjectFor,
  isValidTrack,
  TRACK_COOKIE,
  trackOfSubject,
  trackSubjectCookie,
  TRACKS,
} from "@/lib/tracks";
import { currentTrack } from "@/lib/tracks-server";

export const dynamic = "force-dynamic";

// Body: { track: "ahh" | "gmat" }. Switching track sets track_key AND
// subject_key (to the target track's remembered subject), and files the
// subject we're leaving under subject_key_<oldTrack>, so currentSubject()
// itself never needs to know about tracks.
export async function POST(req: NextRequest) {
  let body: { track?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!isValidTrack(body.track)) {
    return NextResponse.json({ error: "a valid track is required" }, { status: 400 });
  }
  const track = body.track;
  const oldTrack = currentTrack();

  let subject: string;
  const remembered = req.cookies.get(trackSubjectCookie(track))?.value;
  if (isValidSubjectSlug(remembered) && trackOfSubject(remembered) === track) {
    subject = remembered;
  } else {
    const subjects = await listSubjects(track);
    subject = subjects[0]?.slug ?? emptySubjectFor(track);
  }

  const opts = {
    httpOnly: false,
    secure: req.nextUrl.protocol === "https:",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SUBJECT_COOKIE_MAX_AGE,
  };
  const res = NextResponse.json({ track, subject, home: TRACKS[track].home });
  res.cookies.set(TRACK_COOKIE, track, opts);
  res.cookies.set(SUBJECT_COOKIE, subject, opts);
  if (oldTrack !== track) {
    const leaving = currentSubject();
    if (trackOfSubject(leaving) === oldTrack) res.cookies.set(trackSubjectCookie(oldTrack), leaving, opts);
  }
  return res;
}
