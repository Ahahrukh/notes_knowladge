import { listTopics } from "@/lib/queries";
import TopicCard from "@/components/TopicCard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const learningPhases = [
  {
    title: "Foundation",
    steps: "Steps 1-3",
    detail: "Python, environment setup, and math intuition.",
  },
  {
    title: "Data Tools",
    steps: "Steps 4-7",
    detail: "NumPy, pandas, Matplotlib, and SQL for real datasets.",
  },
  {
    title: "ML Bridge",
    steps: "Step 8",
    detail: "Machine learning workflow, metrics, baselines, and leakage.",
  },
  {
    title: "Production + GenAI",
    steps: "Steps 9-16",
    detail: "Docker, APIs, LLM APIs, prompts, vector DBs, RAG, LangChain, agents.",
  },
];

export default async function TopicsPage() {
  const topics = await listTopics();
  return (
    <div className="space-y-8">
      <section>
        <div className="text-sm font-medium text-brand-100">
          Step-by-step AI learning path
        </div>
        <h1 className="mt-2 text-3xl font-bold text-white">All Topics</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Topics ko beginner se AI/GenAI production path me arrange kiya gaya
          hai. Pehle programming aur math, phir data tools, phir ML
          fundamentals, aur end me GenAI systems.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {learningPhases.map((phase) => (
          <div
            key={phase.title}
            className="rounded-lg border border-slate-800 bg-slate-900/50 p-4"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-100">
              {phase.steps}
            </div>
            <h2 className="mt-2 font-semibold text-white">{phase.title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              {phase.detail}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((t) => (
          <TopicCard key={t.slug} topic={t} />
        ))}
      </div>
    </div>
  );
}
