import Link from "next/link";
import { notFound } from "next/navigation";
import { getSection, getTopic, listSections } from "@/lib/queries";
import ContentRenderer from "@/components/ContentRenderer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function SectionPage({
  params,
}: {
  params: { topicSlug: string; sectionSlug: string };
}) {
  const [topic, section, all] = await Promise.all([
    getTopic(params.topicSlug),
    getSection(params.topicSlug, params.sectionSlug),
    listSections(params.topicSlug),
  ]);
  if (!topic || !section) notFound();

  const idx = all.findIndex((s) => s.slug === section.slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
      <aside className="md:sticky md:top-20 h-fit">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <Link
            href={`/topics/${topic.slug}`}
            className="flex items-center gap-2 text-white font-semibold mb-3"
          >
            <span className="text-2xl">{topic.icon ?? "📘"}</span>
            <span>{topic.title}</span>
          </Link>
          <nav className="text-sm space-y-1">
            {all.map((s) => (
              <Link
                key={s.slug}
                href={`/topics/${topic.slug}/${s.slug}`}
                className={`block px-2 py-1.5 rounded ${
                  s.slug === section.slug
                    ? "bg-brand-500/20 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
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

      <article>
        <div className="text-sm text-slate-400 mb-1">
          <Link href="/topics" className="hover:text-white">Topics</Link> /{" "}
          <Link href={`/topics/${topic.slug}`} className="hover:text-white">
            {topic.title}
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-white">{section.title}</h1>
        {section.summary && (
          <p className="text-slate-300 mt-2">{section.summary}</p>
        )}
        <div className="mt-6">
          <ContentRenderer blocks={section.content} />
        </div>

        <div className="mt-12 flex justify-between border-t border-slate-800 pt-6">
          {prev ? (
            <Link
              href={`/topics/${topic.slug}/${prev.slug}`}
              className="text-slate-300 hover:text-white"
            >
              ← {prev.title}
            </Link>
          ) : <span />}
          {next ? (
            <Link
              href={`/topics/${topic.slug}/${next.slug}`}
              className="text-slate-300 hover:text-white"
            >
              {next.title} →
            </Link>
          ) : <span />}
        </div>
      </article>
    </div>
  );
}
