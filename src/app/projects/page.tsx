import ProjectTabs from "@/components/ProjectTabs";
import { industryProjects } from "@/lib/projects";

export const metadata = {
  title: "Industry Projects — Notes Knowladge",
  description:
    "Industry-style Python, NumPy, pandas, and Matplotlib projects with line-by-line explanations.",
};

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <section>
        <div className="text-sm font-medium text-brand-100">
          Python + NumPy + pandas + Matplotlib only
        </div>
        <h1 className="mt-2 text-3xl font-bold text-white">
          Industry Project Code
        </h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Ye projects learning ke liye compact hain, but structure industry
          jaisa hai: config, validation, functions, vectorized calculations,
          report exports, charts, aur har line ka use plus parameters.
        </p>
      </section>

      <ProjectTabs projects={industryProjects} />
    </div>
  );
}
