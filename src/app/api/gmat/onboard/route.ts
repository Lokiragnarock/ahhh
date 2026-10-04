import { NextRequest, NextResponse } from "next/server";
import { KV_ENABLED } from "@/lib/sync/kv";
import { currentSyncKey, generateSyncKey, setUserName } from "@/lib/sync/server";
import { SYNC_COOKIE, SYNC_COOKIE_MAX_AGE } from "@/lib/sync/shared";
import { onboardPlayer } from "@/lib/gmat/players";

export const dynamic = "force-dynamic";

// Body: { name }. Creates the GMAT player for this device, minting the device
// key first when there is none (same cookie as /api/sync/link).
export async function POST(req: NextRequest) {
  if (!KV_ENABLED || !process.env.DATABASE_URL) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }
  let body: { name?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return NextResponse.json({ error: "a name is required" }, { status: 400 });

  let key = currentSyncKey();
  const isNewKey = !key;
  if (!key) key = generateSyncKey();

  try {
    const p = await onboardPlayer(key, name);
    // Keep the duel's name store in step so both show the same name.
    await setUserName(key, p.displayName).catch(() => {});
    const res = NextResponse.json({ player: { handle: p.handle, displayName: p.displayName, role: p.role } });
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
  } catch {
    return NextResponse.json({ error: "could not onboard" }, { status: 500 });
  }
}
