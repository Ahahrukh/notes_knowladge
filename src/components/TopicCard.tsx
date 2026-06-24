import Link from "next/link";
import type { Topic } from "@/lib/models";

export default function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="group block rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-brand-500 hover:bg-slate-900 transition"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center text-2xl"
          style={{ background: (topic.color ?? "#0ea5e9") + "22" }}
        >
          <span>{topic.icon ?? "📘"}</span>
        </div>
        <div>
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-brand-100">
            Step {topic.order}
          </div>
          <div className="text-white font-semibold group-hover:text-brand-500">
            {topic.title}
          </div>
          <div className="text-xs text-slate-400">/{topic.slug}</div>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-300 line-clamp-3">
        {topic.description}
      </p>
    </Link>
  );
}
