import { getDb } from "./mongodb";
import { COLLECTIONS, Topic, Section, InterviewQuestion } from "./models";

export async function listTopics(): Promise<Topic[]> {
  const db = await getDb();
  return db
    .collection<Topic>(COLLECTIONS.topics)
    .find({}, { projection: { _id: 0 } })
    .sort({ order: 1 })
    .toArray();
}

export async function getTopic(slug: string): Promise<Topic | null> {
  const db = await getDb();
  return db
    .collection<Topic>(COLLECTIONS.topics)
    .findOne({ slug }, { projection: { _id: 0 } });
}

export async function listSections(topicSlug: string): Promise<Section[]> {
  const db = await getDb();
  return db
    .collection<Section>(COLLECTIONS.sections)
    .find({ topicSlug }, { projection: { _id: 0 } })
    .sort({ order: 1 })
    .toArray();
}

export async function getSection(
  topicSlug: string,
  slug: string
): Promise<Section | null> {
  const db = await getDb();
  return db
    .collection<Section>(COLLECTIONS.sections)
    .findOne({ topicSlug, slug }, { projection: { _id: 0 } });
}

export async function listInterview(topicSlug: string): Promise<InterviewQuestion[]> {
  const db = await getDb();
  return db
    .collection<InterviewQuestion>(COLLECTIONS.interview)
    .find({ topicSlug }, { projection: { _id: 0 } })
    .sort({ order: 1 })
    .toArray();
}
