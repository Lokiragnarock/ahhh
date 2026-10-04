import { NextResponse } from "next/server";
import { requireLiveKey, loadActivity } from "@/lib/sync/server";

export const dynamic = "force-dynamic";

// The server-side activity log (topic state changes). 204 when not syncing.
export async function GET() {
  const key = await requireLiveKey();
  if (key instanceof NextResponse) return key;
  if (!key) return new NextResponse(null, { status: 204 });
  return NextResponse.json({ events: await loadActivity(key) });
}
