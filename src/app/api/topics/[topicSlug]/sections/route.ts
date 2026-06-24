import { NextResponse } from "next/server";
import { listSections } from "@/lib/queries";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, Section } from "@/lib/models";

export async function GET(
  _req: Request,
  { params }: { params: { topicSlug: string } }
) {
  return NextResponse.json(await listSections(params.topicSlug));
}

export async function POST(
  req: Request,
  { params }: { params: { topicSlug: string } }
) {
  const body = (await req.json()) as Section;
  if (!body?.slug || !body?.title) {
    return NextResponse.json({ error: "slug & title required" }, { status: 400 });
  }
  const db = await getDb();
  await db.collection<Section>(COLLECTIONS.sections).updateOne(
    { topicSlug: params.topicSlug, slug: body.slug },
    { $set: { ...body, topicSlug: params.topicSlug } },
    { upsert: true }
  );
  return NextResponse.json({ ok: true });
}
