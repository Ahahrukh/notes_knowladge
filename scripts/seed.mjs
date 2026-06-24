// Seed MongoDB with Hinglish content from per-topic modules.
//
// To add a new topic:
//   1. Create scripts/content/<slug>.mjs exporting { topic, sections, interview }
//   2. Import + add it to MODULES below
//   3. Run: npm run seed
//
// Existing topics upsert by slug — safe to re-seed anytime.

import { MongoClient } from "mongodb";

import * as python from "./content/python.mjs";
import * as environment from "./content/environment.mjs";
import * as numpy from "./content/numpy.mjs";
import * as pandas from "./content/pandas.mjs";
import * as matplotlib from "./content/matplotlib.mjs";
import * as sql from "./content/sql.mjs";
import * as mlFundamentals from "./content/ml-fundamentals.mjs";
import * as docker from "./content/docker.mjs";
import * as fastapi from "./content/fastapi.mjs";
import * as llmApis from "./content/llm-apis.mjs";
import * as promptEng from "./content/prompt-engineering.mjs";
import * as vectorDb from "./content/vector-db.mjs";
import * as rag from "./content/rag.mjs";
import * as langchain from "./content/langchain.mjs";
import * as agenticAi from "./content/agentic-ai.mjs";
import * as mathematics from "./content/mathematics.mjs";

const MODULES = [
  python,
  environment,
  numpy,
  pandas,
  matplotlib,
  sql,
  mlFundamentals,
  docker,
  fastapi,
  llmApis,
  promptEng,
  vectorDb,
  rag,
  langchain,
  agenticAi,
  mathematics,
];

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "notes_knowladge";
if (!uri) {
  console.error("❌ MONGODB_URI missing. Set it in .env.local");
  process.exit(1);
}

const topics = MODULES.map((m) => m.topic);
const sections = MODULES.flatMap((m) => m.sections ?? []);
const interview = MODULES.flatMap((m) => m.interview ?? []);

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  // ---- TOPICS: upsert by slug ----
  const topicsCol = db.collection("topics");
  for (const t of topics) {
    await topicsCol.updateOne(
      { slug: t.slug },
      { $set: { ...t, createdAt: new Date() } },
      { upsert: true },
    );
  }
  await topicsCol.createIndex({ slug: 1 }, { unique: true });

  // ---- SECTIONS: replace per topic (removed sections don't linger) ----
  const sectionsCol = db.collection("sections");
  for (const t of topics) {
    const own = sections.filter((s) => s.topicSlug === t.slug);
    await sectionsCol.deleteMany({ topicSlug: t.slug });
    if (own.length) await sectionsCol.insertMany(own);
  }
  await sectionsCol.createIndex({ topicSlug: 1, slug: 1 }, { unique: true });

  // ---- INTERVIEW: replace per topic ----
  const intCol = db.collection("interview_questions");
  for (const t of topics) {
    const own = interview.filter((q) => q.topicSlug === t.slug);
    await intCol.deleteMany({ topicSlug: t.slug });
    if (own.length) await intCol.insertMany(own);
  }
  await intCol.createIndex({ topicSlug: 1, order: 1 });

  console.log(
    `✅ Seeded: ${topics.length} topics, ${sections.length} sections, ${interview.length} interview Qs`,
  );
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
