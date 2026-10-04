import { NextRequest, NextResponse } from "next/server";
import { isValidSubjectSlug, SUBJECT_COOKIE, SUBJECT_COOKIE_MAX_AGE } from "@/lib/subject/shared";
import { trackOfSubject, trackSubjectCookie } from "@/lib/tracks";

export const dynamic = "force-dynamic";

// Body: { subject: "<slug>" }. Sets the subject_key cookie so every
// force-dynamic page reads the picked subject's content on the next render.
// The client does a router.refresh()/reload after this resolves.
export async function POST(req: NextRequest) {
  let body: { subject?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!isValidSubjectSlug(body.subject)) {
    return NextResponse.json({ error: "a valid subject slug is required" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true, subject: body.subject });
  res.cookies.set(SUBJECT_COOKIE, body.subject, {
    httpOnly: false,
    secure: req.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: SUBJECT_COOKIE_MAX_AGE,
  });
  // Remember it as this track's last subject (see /api/track).
  res.cookies.set(trackSubjectCookie(trackOfSubject(body.subject)), body.subject, {
    httpOnly: false,
    secure: req.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: SUBJECT_COOKIE_MAX_AGE,
  });
  return res;
}
