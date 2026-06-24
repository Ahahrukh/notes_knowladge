import { NextResponse } from "next/server";
import { listTopics } from "@/lib/queries";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, Topic } from "@/lib/models";

export async function GET() {
  const topics = await listTopics();
  return NextResponse.json(topics);
}

export async function POST(req: Request) {
  const body = (await req.json()) as Topic;
  if (!body?.slug || !body?.title) {
    return NextResponse.json(
      { error: "slug and title required" },
      { status: 400 }
    );
  }
  const db = await getDb();
  await db
    .collection<Topic>(COLLECTIONS.topics)
    .updateOne(
      { slug: body.slug },
      { $set: { ...body, createdAt: new Date() } },
      { upsert: true }
    );
  return NextResponse.json({ ok: true });
}
