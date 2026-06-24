import { getDb } from "./mongodb";
import { COLLECTIONS, Topic, Section, InterviewQuestion } from "./models";
import { staticInterview, staticSections, staticTopics } from "./staticContent";

async function withStaticFallback<T>(
  dbQuery: () => Promise<T>,
  fallback: () => T
): Promise<T> {
  try {
    return await dbQuery();
  } catch (error) {
    console.warn(
      "MongoDB query failed; using bundled static content fallback.",
      error
    );
    return fallback();
  }
}

export async function listTopics(): Promise<Topic[]> {
  return withStaticFallback(
    async () => {
      const db = await getDb();
      return db
        .collection<Topic>(COLLECTIONS.topics)
        .find({}, { projection: { _id: 0 } })
        .sort({ order: 1 })
        .toArray();
    },
    () => staticTopics
  );
}

export async function getTopic(slug: string): Promise<Topic | null> {
  return withStaticFallback(
    async () => {
      const db = await getDb();
      return db
        .collection<Topic>(COLLECTIONS.topics)
        .findOne({ slug }, { projection: { _id: 0 } });
    },
    () => staticTopics.find((topic) => topic.slug === slug) ?? null
  );
}

export async function listSections(topicSlug: string): Promise<Section[]> {
  return withStaticFallback(
    async () => {
      const db = await getDb();
      return db
        .collection<Section>(COLLECTIONS.sections)
        .find({ topicSlug }, { projection: { _id: 0 } })
        .sort({ order: 1 })
        .toArray();
    },
    () =>
      staticSections
        .filter((section) => section.topicSlug === topicSlug)
        .sort((a, b) => a.order - b.order)
  );
}

export async function getSection(
  topicSlug: string,
  slug: string
): Promise<Section | null> {
  return withStaticFallback(
    async () => {
      const db = await getDb();
      return db
        .collection<Section>(COLLECTIONS.sections)
        .findOne({ topicSlug, slug }, { projection: { _id: 0 } });
    },
    () =>
      staticSections.find(
        (section) => section.topicSlug === topicSlug && section.slug === slug
      ) ?? null
  );
}

export async function listInterview(topicSlug: string): Promise<InterviewQuestion[]> {
  return withStaticFallback(
    async () => {
      const db = await getDb();
      return db
        .collection<InterviewQuestion>(COLLECTIONS.interview)
        .find({ topicSlug }, { projection: { _id: 0 } })
        .sort({ order: 1 })
        .toArray();
    },
    () =>
      staticInterview
        .filter((question) => question.topicSlug === topicSlug)
        .sort((a, b) => a.order - b.order)
  );
}
