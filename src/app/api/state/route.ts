import { NextRequest, NextResponse } from "next/server";
import { getTopic, setTopicState } from "@/lib/vault";
import { TopicState } from "@/lib/study-types";

const VALID_STATES: TopicState[] = ["unstudied", "studied", "mapped", "drilled"];
const STATE_RANK: Record<TopicState, number> = { unstudied: 0, studied: 1, mapped: 2, drilled: 3 };

export const dynamic = "force-dynamic";

// The only route in the app that mutates the vault. It only ever touches the
// `state:` line of a note's frontmatter, leaving the rest of the file
// byte-identical.
export async function POST(req: NextRequest) {
  let body: { slug?: string; state?: string; force?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { slug, state, force } = body;
  if (!slug || !state || !VALID_STATES.includes(state as TopicState)) {
    return NextResponse.json({ error: "slug and a valid state are required" }, { status: 400 });
  }

  const current = await getTopic(slug);
  if (!current) {
    return NextResponse.json({ error: "topic not found" }, { status: 404 });
  }

  // Default behaviour is "promote only" — reading a note twice should not
  // demote it. Passing force:true (used by the mixed-test fail path) allows
  // moving backward a band.
  if (!force && STATE_RANK[state as TopicState] < STATE_RANK[current.state]) {
    return NextResponse.json({ ok: true, skipped: true, state: current.state });
  }

  const ok = await setTopicState(slug, state as TopicState);
  if (!ok) {
    return NextResponse.json({ error: "write failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, state });
}
