import { NextResponse } from "next/server";
import { listInterview } from "@/lib/queries";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, InterviewQuestion } from "@/lib/models";

export async function GET(
  _req: Request,
  { params }: { params: { topicSlug: string } }
) {
  return NextResponse.json(await listInterview(params.topicSlug));
}

export async function POST(
  req: Request,
  { params }: { params: { topicSlug: string } }
) {
  const body = (await req.json()) as InterviewQuestion;
  if (!body?.question || !body?.answer) {
    return NextResponse.json(
      { error: "question & answer required" },
      { status: 400 }
    );
  }
  const db = await getDb();
  await db.collection<InterviewQuestion>(COLLECTIONS.interview).insertOne({
    ...body,
    topicSlug: params.topicSlug,
  });
  return NextResponse.json({ ok: true });
}
