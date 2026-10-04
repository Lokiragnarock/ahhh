import { NextResponse } from "next/server";
import { currentSyncKey } from "@/lib/sync/server";
import { resolvePlayer } from "@/lib/gmat/players";

export const dynamic = "force-dynamic";

// The GMAT player behind this device, or null (no key, no database, or not
// onboarded yet).
export async function GET() {
  const key = currentSyncKey();
  if (!key || !process.env.DATABASE_URL) return NextResponse.json({ player: null });
  try {
    const p = await resolvePlayer(key);
    return NextResponse.json({ player: p && { handle: p.handle, displayName: p.displayName, role: p.role } });
  } catch {
    return NextResponse.json({ player: null });
  }
}
