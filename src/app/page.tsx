import Link from "next/link";
import { listTopics } from "@/lib/queries";
import TopicCard from "@/components/TopicCard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function HomePage() {
  let topics = [] as Awaited<ReturnType<typeof listTopics>>;
  let dbError: string | null = null;
  try {
    topics = await listTopics();
  } catch (e: any) {
    dbError = e?.message ?? "DB connection failed";
  }

  return (
    <div className="space-y-12">
      <section className="text-center pt-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          Seekho. Samjho. <span className="text-brand-500">Crack karo.</span>
        </h1>
        <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
          Python, Numpy, Pandas, Matplotlib, SQL, ML fundamentals aur Docker ke notes —
          <strong> Hinglish</strong> me, basic se advance tak, code examples
          aur line-by-line meaning ke saath. Interview prep bhi included.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/topics"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-md font-medium"
          >
            Browse Topics
          </Link>
          <Link
            href="/projects"
            className="px-5 py-2.5 border border-slate-700 hover:border-brand-500 text-slate-200 rounded-md font-medium"
          >
            Projects Code
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-white">AI Learning Steps</h2>
          <p className="mt-1 text-sm text-slate-400">
            Follow the cards in step order: foundation, data tools, ML bridge,
            then GenAI production systems.
          </p>
        </div>
        {dbError ? (
          <div className="border border-red-500/40 bg-red-500/10 text-red-200 p-4 rounded-md">
            <p className="font-medium">MongoDB se connect nahi ho paya.</p>
            <p className="text-sm mt-1 opacity-80">{dbError}</p>
            <p className="text-sm mt-2">
              Check karo <code>.env.local</code> me <code>MONGODB_URI</code> set
              hai, aur ek baar <code>npm run seed</code> chala lo.
            </p>
          </div>
        ) : topics.length === 0 ? (
          <div className="border border-slate-700 bg-slate-900/60 p-6 rounded-md">
            <p className="text-slate-200">Abhi koi topic nahi mila.</p>
            <p className="text-sm text-slate-400 mt-1">
              Terminal me chalao:{" "}
              <code className="text-brand-100">npm run seed</code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((t) => (
              <TopicCard key={t.slug} topic={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
