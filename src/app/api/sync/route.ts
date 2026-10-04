import { NextRequest, NextResponse } from "next/server";
import { loadRecord, mergeRecord, requireLiveKey } from "@/lib/sync/server";
import type { SyncRecord } from "@/lib/sync/shared";
import { isSyncedKey } from "@/lib/sync/shared";

export const dynamic = "force-dynamic";

// 204 = this device isn't syncing (no key, or storage not configured); the
// client then stays local-only, exactly like before sync existed.
export async function GET() {
  const key = await requireLiveKey();
  if (key instanceof NextResponse) return key;
  if (!key) return new NextResponse(null, { status: 204 });
  return NextResponse.json({ record: await loadRecord(key) });
}

// 410 (from requireLiveKey) = this key was replaced by "Reissue link"; the
// client tells the person to open their new link instead of syncing.
// Body: { record: SyncRecord } with only the entries this device changed.
// Returns the merged record so the device can pick up anything newer.
export async function POST(req: NextRequest) {
  const key = await requireLiveKey();
  if (key instanceof NextResponse) return key;
  if (!key) return new NextResponse(null, { status: 204 });

  let body: { record?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const incoming: SyncRecord = {};
  if (body.record && typeof body.record === "object") {
    for (const [k, e] of Object.entries(body.record as Record<string, unknown>)) {
      const entry = e as { v?: unknown; t?: unknown };
      if (!isSyncedKey(k) || typeof entry?.t !== "number") continue;
      if (entry.v !== null && typeof entry.v !== "string") continue;
      incoming[k] = { v: entry.v, t: entry.t };
    }
  }

  return NextResponse.json({ record: await mergeRecord(key, incoming) });
}
