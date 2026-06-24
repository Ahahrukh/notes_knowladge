import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopic, listInterview } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const diffColor: Record<string, string> = {
  easy: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40",
  medium: "bg-amber-500/20 text-amber-200 border-amber-500/40",
  hard: "bg-rose-500/20 text-rose-200 border-rose-500/40",
};

export default async function InterviewPage({
  params,
}: {
  params: { topicSlug: string };
}) {
  const [topic, questions] = await Promise.all([
    getTopic(params.topicSlug),
    listInterview(params.topicSlug),
  ]);
  if (!topic) {
    notFound();
    return null;
  }

  return (
    <div>
      <div className="text-sm text-slate-400 mb-1">
        <Link href={`/topics/${topic.slug}`} className="hover:text-white">
          ← {topic.title}
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-white">
        🎯 {topic.title} — Interview Questions
      </h1>
      <p className="text-slate-300 mt-2">
        Hinglish me asked-in-interview questions, answer ke saath.
      </p>

      {questions.length === 0 ? (
        <p className="mt-6 text-slate-400">Abhi koi question add nahi hua.</p>
      ) : (
        <ol className="mt-6 space-y-4">
          {questions.map((q, i) => (
            <li
              key={i}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">
                  Q{q.order}. {q.question}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded border ${diffColor[q.difficulty]}`}
                >
                  {q.difficulty}
                </span>
              </div>
              <pre className="mt-3 whitespace-pre-wrap text-slate-200 text-[15px] leading-7 font-sans">
                {q.answer}
              </pre>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
