import { NextRequest, NextResponse } from "next/server";
import { currentSyncKey, restoreSnapshot, SNAP_SLOTS, type SnapSlot } from "@/lib/sync/server";

export const dynamic = "force-dynamic";

// Body: { slot: 1 | 2 }. Restores that server-side backup for this device's
// own key. The current state is snapshotted first, so it can be undone.
export async function POST(req: NextRequest) {
  const key = currentSyncKey();
  if (!key) return new NextResponse(null, { status: 204 });

  let slot: unknown;
  try {
    slot = ((await req.json()) as { slot?: unknown }).slot;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!SNAP_SLOTS.includes(slot as SnapSlot)) {
    return NextResponse.json({ error: "slot must be 1 or 2" }, { status: 400 });
  }
  if (!(await restoreSnapshot(key, slot as SnapSlot))) {
    return NextResponse.json({ error: "no such backup" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
