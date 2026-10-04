import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { currentSyncKey } from "@/lib/sync/server";
import { db } from "@/lib/gmat/db";
import { resolvePlayer } from "@/lib/gmat/players";
import { topicOfNode } from "@/lib/gmat/nodes";
import { answerLetter } from "@/lib/gmat/questions";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface AnswerIn {
  questionId: string;
  selected: string | null;
}

// Body: { node, answers: [{ questionId, selected }], timeSeconds? }.
// One practice set for one node -> one tests row plus its attempts rows.
// Correctness is derived here from questions.correct_answer; the client's own
// verdict is never read.
// 503 when there is no key/database (practice stays local); 409 {onboard}
// when this device has no player yet (practice also stays local).
export async function POST(req: NextRequest) {
  const key = currentSyncKey();
  if (!key || !process.env.DATABASE_URL) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  let body: { node?: unknown; answers?: unknown; timeSeconds?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const topic = typeof body.node === "string" ? topicOfNode(body.node) : null;
  if (!topic) return NextResponse.json({ error: "unknown node" }, { status: 400 });
  if (!Array.isArray(body.answers) || body.answers.length === 0 || body.answers.length > 200) {
    return NextResponse.json({ error: "answers required" }, { status: 400 });
  }
  const answers: AnswerIn[] = [];
  for (const a of body.answers as Record<string, unknown>[]) {
    if (!a || typeof a.questionId !== "string" || !UUID.test(a.questionId)) {
      return NextResponse.json({ error: "bad answer" }, { status: 400 });
    }
    const selected = typeof a.selected === "string" ? a.selected.slice(0, 1).toUpperCase() : null;
    answers.push({ questionId: a.questionId, selected });
  }
  const seconds = typeof body.timeSeconds === "number" && body.timeSeconds >= 0 ? Math.round(body.timeSeconds) : null;

  try {
    const player = await resolvePlayer(key);
    if (!player) return NextResponse.json({ onboard: true }, { status: 409 });

    const sql = db();
    const topics = (await sql.query("select id from topics where exam_type = 'gmat' and name = $1", [topic])) as {
      id: string;
    }[];
    if (!topics[0]) return NextResponse.json({ error: "unknown topic" }, { status: 400 });

    const keyRows = (await sql.query("select id, correct_answer from questions where id = any($1::uuid[])", [
      answers.map((a) => a.questionId),
    ])) as { id: string; correct_answer: string | null }[];
    const keyOf = new Map(keyRows.map((q) => [q.id, answerLetter(q.correct_answer)]));
    if (answers.some((a) => !keyOf.get(a.questionId))) return NextResponse.json({ error: "unknown question" }, { status: 400 });
    const graded = answers.map((a) => ({ ...a, correct: a.selected !== null && a.selected === keyOf.get(a.questionId) }));

    const testId = randomUUID();
    const score = graded.filter((a) => a.correct).length;
    await sql.transaction((txn) => [
      txn.query(
        "insert into tests (id, player_id, topic_id, score, total, time_seconds, grading_mode) values ($1, $2, $3, $4, $5, $6, 'auto')",
        [testId, player.id, topics[0].id, score, answers.length, seconds]
      ),
      ...graded.map((a) =>
        txn.query("insert into attempts (test_id, question_id, selected_answer, is_correct) values ($1, $2, $3, $4)", [
          testId,
          a.questionId,
          a.selected,
          a.correct,
        ])
      ),
    ]);
    return NextResponse.json({ ok: true, testId });
  } catch {
    return NextResponse.json({ error: "could not record" }, { status: 500 });
  }
}
