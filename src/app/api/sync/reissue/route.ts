import { NextRequest, NextResponse } from "next/server";
import { undoReissueDeviceKey, reissueDeviceKey } from "@/lib/gmat/devices";
import { KV_ENABLED } from "@/lib/sync/kv";
import { generateSyncKey, rekeyUser, requireLiveKey } from "@/lib/sync/server";
import { SYNC_COOKIE, SYNC_COOKIE_MAX_AGE } from "@/lib/sync/shared";

export const dynamic = "force-dynamic";

// Swaps this device's sync key for a fresh one, carrying all progress across
// and revoking the old link everywhere. Neon goes first, then Redis; if Redis
// fails the Neon change is undone so the old link keeps working.
export async function POST(req: NextRequest) {
  if (!KV_ENABLED) return NextResponse.json({ error: "sync not configured" }, { status: 400 });
  const oldKey = await requireLiveKey();
  if (oldKey instanceof NextResponse) return oldKey;
  if (!oldKey) return NextResponse.json({ error: "no sync key" }, { status: 401 });

  const newKey = generateSyncKey();
  let moved = false;
  try {
    moved = await reissueDeviceKey(oldKey, newKey);
    await rekeyUser(oldKey, newKey);
  } catch (err) {
    console.error("reissue failed", err);
    if (moved) {
      try {
        await undoReissueDeviceKey(oldKey, newKey);
      } catch (undoErr) {
        console.error("reissue rollback failed", undoErr);
      }
    }
    return NextResponse.json({ error: "reissue failed, your current link still works" }, { status: 500 });
  }

  const res = NextResponse.json({ configured: true, key: newKey, path: `/?sync=${newKey}`, link: `/?sync=${newKey}` });
  res.cookies.set(SYNC_COOKIE, newKey, {
    httpOnly: true,
    secure: req.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: SYNC_COOKIE_MAX_AGE,
  });
  return res;
}
