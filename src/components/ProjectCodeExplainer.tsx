import CodeBlock from "./CodeBlock";
import type { IndustryProject } from "@/lib/projects";
import { projectCode } from "@/lib/projects";

export default function ProjectCodeExplainer({
  project,
}: {
  project: IndustryProject;
}) {
  return (
    <section
      id={project.slug}
      className="scroll-mt-24 border border-slate-800 bg-slate-900/50 rounded-lg p-4 sm:p-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="rounded bg-brand-500/15 px-2 py-1 text-brand-100">
              {project.level}
            </span>
            <span>{project.stack.join(" + ")}</span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            {project.title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            {project.summary}
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            <span className="font-medium text-slate-200">Industry use:</span>{" "}
            {project.businessUse}
          </p>
        </div>
        <div className="min-w-0 rounded-md border border-slate-800 bg-slate-950/60 p-3 text-sm">
          <div className="text-slate-400">Run</div>
          <code className="mt-1 block break-words text-brand-100">
            {project.runCommand}
          </code>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {project.files.map((file) => (
          <div
            key={file}
            className="rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2"
          >
            <div className="text-xs uppercase tracking-wide text-slate-500">
              File
            </div>
            <code className="mt-1 block break-words text-sm text-slate-200">
              {file}
            </code>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white">Project Code</h3>
        <CodeBlock language="python" value={projectCode(project)} />
      </div>

      <div className="mt-7">
        <h3 className="text-lg font-semibold text-white">
          Line-by-line Explanation
        </h3>
        <div className="mt-3 space-y-3">
          {project.lines.map((line, index) => (
            <div
              key={`${project.slug}-${index}`}
              className="grid grid-cols-1 gap-3 rounded-md border border-slate-800 bg-slate-950/40 p-3 lg:grid-cols-[92px_minmax(0,1fr)_minmax(220px,0.9fr)]"
            >
              <div className="text-sm font-semibold text-brand-100">
                Line {index + 1}
              </div>
              <div className="min-w-0">
                <code className="block whitespace-pre-wrap break-words rounded bg-slate-900 px-2 py-1.5 text-[13px] leading-6 text-slate-100">
                  {line.code}
                </code>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {line.purpose}
                </p>
              </div>
              <div className="rounded border border-slate-800 bg-slate-900/70 p-2 text-sm leading-6 text-slate-300">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Parameters / alternatives
                </div>
                {line.parameters ?? "Is line me direct parameter nahi hai."}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
