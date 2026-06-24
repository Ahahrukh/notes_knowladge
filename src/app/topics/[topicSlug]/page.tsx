import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopic, listSections } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function TopicPage({
  params,
}: {
  params: { topicSlug: string };
}) {
  const topic = await getTopic(params.topicSlug);
  if (!topic) notFound();
  const sections = await listSections(params.topicSlug);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
      <aside className="md:sticky md:top-20 h-fit">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{topic.icon ?? "📘"}</span>
            <h2 className="text-white font-semibold">{topic.title}</h2>
          </div>
          <nav className="text-sm space-y-1">
            {sections.map((s) => (
              <Link
                key={s.slug}
                href={`/topics/${topic.slug}/${s.slug}`}
                className="block px-2 py-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800"
              >
                {s.order}. {s.title}
              </Link>
            ))}
            <Link
              href={`/topics/${topic.slug}/interview`}
              className="block mt-3 px-2 py-1.5 rounded text-brand-100 hover:text-white hover:bg-brand-500/20 border-t border-slate-800 pt-3"
            >
              🎯 Interview Questions
            </Link>
          </nav>
        </div>
      </aside>

      <section>
        <h1 className="text-3xl font-bold text-white">{topic.title}</h1>
        <p className="text-slate-300 mt-2">{topic.description}</p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-3">Sections</h3>
        <ul className="space-y-2">
          {sections.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/topics/${topic.slug}/${s.slug}`}
                className="block p-4 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-brand-500"
              >
                <div className="text-white font-medium">
                  {s.order}. {s.title}
                </div>
                {s.summary && (
                  <div className="text-sm text-slate-400 mt-1">{s.summary}</div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
