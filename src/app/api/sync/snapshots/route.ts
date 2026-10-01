import { NextResponse } from "next/server";
import { currentSyncKey, listSnapshots } from "@/lib/sync/server";

export const dynamic = "force-dynamic";

// This person's own server-side backups, from their own key only. 204 when
// the device isn't linked, so nobody can ask about anyone else's.
export async function GET() {
  const key = currentSyncKey();
  if (!key) return new NextResponse(null, { status: 204 });
  return NextResponse.json({ snapshots: await listSnapshots(key) });
}
