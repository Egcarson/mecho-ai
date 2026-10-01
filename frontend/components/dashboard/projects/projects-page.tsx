"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { getProjects, type ProjectListItem } from "@/lib/projects";

import { ProjectsToolbar } from "./projects-toolbar";
import { ProjectsList } from "./projects-list";

export type ProjectWorkflowFilter = "all" | "social" | "campaign" | "speech";

export function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [workflowFilter, setWorkflowFilter] =
    useState<ProjectWorkflowFilter>("all");

  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      setLoading(true);

      try {
        const response = await getProjects();

        if (cancelled) {
          return;
        }

        setProjects(response.items);
      } catch (error) {
        if (cancelled) {
          return;
        }

        toast.error(
          error instanceof Error ? error.message : "Couldn't load projects.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleProjectChange = useCallback((updatedProject: ProjectListItem) => {
    setProjects((current) =>
      current.map((project) =>
        project.uid === updatedProject.uid ? updatedProject : project,
      ),
    );
  }, []);

  const handleProjectRemove = useCallback((projectUid: string) => {
    setProjects((current) =>
      current.filter((project) => project.uid !== projectUid),
    );
  }, []);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesArchived = showArchived
        ? project.is_archived
        : !project.is_archived;

      const matchesWorkflow =
        workflowFilter === "all" || project.workflow === workflowFilter;

      const matchesSearch =
        !query ||
        project.name.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.objective?.toLowerCase().includes(query);

      return matchesArchived && matchesWorkflow && matchesSearch;
    });
  }, [projects, search, workflowFilter, showArchived]);

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-6xl
        px-4
        pb-16
        pt-10

        sm:px-6
        sm:pt-12

        lg:px-8
        lg:pt-14
      "
    >
      <div>
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.14em]
            text-muted-foreground
          "
        >
          Your work
        </p>

        <h1
          className="
            mt-3
            text-4xl
            font-semibold
            tracking-[-0.05em]

            sm:text-5xl
          "
        >
          Projects
        </h1>

        <p
          className="
            mt-4
            max-w-2xl
            text-base
            leading-7
            text-muted-foreground
          "
        >
          Reopen your saved work, review previous generations, and continue
          where you left off.
        </p>
      </div>

      <ProjectsToolbar
        search={search}
        onSearchChange={setSearch}
        workflowFilter={workflowFilter}
        onWorkflowFilterChange={setWorkflowFilter}
        showArchived={showArchived}
        onShowArchivedChange={setShowArchived}
      />

      <ProjectsList
        projects={filteredProjects}
        loading={loading}
        hasAnyProjects={projects.length > 0}
        search={search}
        showArchived={showArchived}
        onProjectChange={handleProjectChange}
        onProjectRemove={handleProjectRemove}
      />
    </main>
  );
}
