import { NextRequest, NextResponse } from "next/server";
import { isValidSyncKey, SYNC_COOKIE, SYNC_COOKIE_MAX_AGE as MAX_AGE, SYNC_PARAM } from "@/lib/sync/shared";

// `/anything?sync=<key>` links this device to that key and redirects to the
// clean URL. `?sync=off` unlinks it. Without the param nothing changes, so the
// shared link keeps working local-only for everyone else.
export function middleware(req: NextRequest) {
  const param = req.nextUrl.searchParams.get(SYNC_PARAM);
  // Inside another site's iframe (Homebase's AHH tab) a lax cookie is neither
  // sent nor stored, so the frame gets a cross-site cookie partitioned to the
  // embedding site: it links that frame only and is invisible elsewhere.
  // Opened directly, the cookie stays lax as before.
  const framed = req.headers.get("sec-fetch-dest") === "iframe" && req.nextUrl.protocol === "https:";
  const cookieOpts = {
    httpOnly: true,
    secure: req.nextUrl.protocol === "https:",
    sameSite: framed ? ("none" as const) : ("lax" as const),
    partitioned: framed || undefined,
    path: "/",
    maxAge: MAX_AGE,
  };

  if (param !== null) {
    const clean = req.nextUrl.clone();
    clean.searchParams.delete(SYNC_PARAM);
    const res = NextResponse.redirect(clean);
    if (param === "off") res.cookies.delete(SYNC_COOKIE);
    else if (isValidSyncKey(param)) res.cookies.set(SYNC_COOKIE, param, cookieOpts);
    return res;
  }

  const existing = req.cookies.get(SYNC_COOKIE)?.value;
  if (!isValidSyncKey(existing)) return NextResponse.next();
  const res = NextResponse.next();
  res.cookies.set(SYNC_COOKIE, existing, cookieOpts);
  return res;
}

export const config = {
  // Pages only — skip API routes, Next internals and static files.
  matcher: ["/((?!api/|_next/|.*\\.[^/]+$).*)"],
};
