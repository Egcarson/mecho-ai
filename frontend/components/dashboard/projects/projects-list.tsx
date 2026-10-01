import type { ProjectListItem } from "@/lib/projects";

import { ProjectCard } from "./project-card";
import { ProjectEmptyState } from "./project-empty-state";

type ProjectsListProps = {
  projects: ProjectListItem[];
  loading: boolean;
  hasAnyProjects: boolean;
  search: string;
  showArchived: boolean;

  onProjectChange: (project: ProjectListItem) => void;

  onProjectRemove: (projectUid: string) => void;
};

export function ProjectsList({
  projects,
  loading,
  hasAnyProjects,
  search,
  showArchived,
  onProjectChange,
  onProjectRemove,
}: ProjectsListProps) {
  if (loading) {
    return (
      <div
        className="
          mt-8
          grid
          gap-3
        "
      >
        {Array.from({
          length: 5,
        }).map((_, index) => (
          <div
            key={index}
            className="
                h-[132px]
                animate-pulse
                rounded-[1.5rem]
                border
                border-border/60
                bg-muted/30
              "
          />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <ProjectEmptyState
        hasAnyProjects={hasAnyProjects}
        hasSearch={Boolean(search.trim())}
        showArchived={showArchived}
      />
    );
  }

  return (
    <div
      className="
        mt-8
        grid
        gap-3
      "
    >
      {projects.map((project) => (
        <ProjectCard
          key={project.uid}
          project={project}
          onProjectChange={onProjectChange}
        />
      ))}
    </div>
  );
}
