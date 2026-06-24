"use client";

import { useState } from "react";
import ProjectCodeExplainer from "./ProjectCodeExplainer";
import type { IndustryProject } from "@/lib/projects";

export default function ProjectTabs({
  projects,
}: {
  projects: IndustryProject[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];

  return (
    <section className="space-y-5">
      <div
        role="tablist"
        aria-label="Industry projects"
        className="flex gap-2 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/50 p-2"
      >
        {projects.map((project, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={project.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${project.slug}-panel`}
              id={`${project.slug}-tab`}
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 rounded-md px-4 py-2 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-brand-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="block">Project {index + 1}</span>
              <span className="mt-0.5 block max-w-[210px] truncate text-xs opacity-75">
                {project.title}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${activeProject.slug}-panel`}
        aria-labelledby={`${activeProject.slug}-tab`}
      >
        <ProjectCodeExplainer project={activeProject} />
      </div>
    </section>
  );
}
