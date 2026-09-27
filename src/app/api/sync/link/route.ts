import { NextRequest, NextResponse } from "next/server";
import { KV_ENABLED } from "@/lib/sync/kv";
import { currentSyncKey, generateSyncKey } from "@/lib/sync/server";
import { SYNC_COOKIE, SYNC_COOKIE_MAX_AGE } from "@/lib/sync/shared";

export const dynamic = "force-dynamic";

// Reads back this device's own sync key so the UI can show the `?sync=<key>`
// link without anyone opening DevTools (the cookie is httpOnly). Mints one on
// the spot if this device isn't linked yet, same as the duel route does.
export async function GET(req: NextRequest) {
  if (!KV_ENABLED) return NextResponse.json({ configured: false });

  let key = currentSyncKey();
  const isNewKey = !key;
  if (!key) key = generateSyncKey();

  const res = NextResponse.json({ configured: true, key, path: `/?sync=${key}` });
  if (isNewKey) {
    res.cookies.set(SYNC_COOKIE, key, {
      httpOnly: true,
      secure: req.nextUrl.protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: SYNC_COOKIE_MAX_AGE,
    });
  }
  return res;
}
