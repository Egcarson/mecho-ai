"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  getProject,
  getProjectGenerations,
  type ProjectDetail,
  type ProjectGeneration,
} from "@/lib/projects";

import { ProjectHeader } from "./project-header";
import { ProjectMeta } from "./project-meta";
import { GenerationList } from "./generation-list";

type ProjectDetailPageProps = {
  projectUid: string;
};

export function ProjectDetailPage({ projectUid }: ProjectDetailPageProps) {
  const [project, setProject] = useState<ProjectDetail | null>(null);

  const [generations, setGenerations] = useState<ProjectGeneration[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProject() {
      setLoading(true);

      try {
        const [projectResponse, generationResponse] = await Promise.all([
          getProject(projectUid),

          getProjectGenerations(projectUid, {
            limit: 20,
            offset: 0,
          }),
        ]);

        if (cancelled) {
          return;
        }

        setProject(projectResponse);

        setGenerations(generationResponse.items);
      } catch (error) {
        if (cancelled) {
          return;
        }

        toast.error(
          error instanceof Error ? error.message : "Couldn't load project.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [projectUid]);

  const sortedGenerations = useMemo(() => {
    return [...generations].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [generations]);

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            text-sm
            text-muted-foreground
          "
        >
          <Loader2
            className="
              size-4
              animate-spin
            "
          />
          Loading project...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
          px-4
          text-center
        "
      >
        <div>
          <h1
            className="
              text-2xl
              font-semibold
              tracking-[-0.04em]
            "
          >
            Project not found
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-muted-foreground
            "
          >
            This project may have been deleted or is no longer available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-6xl
        px-4
        pb-16
        pt-8

        sm:px-6
        sm:pt-10

        lg:px-8
        lg:pt-12
      "
    >
      <ProjectHeader
        project={project}
        onProjectChange={setProject}
        onDeleted={() => {
          window.location.href = "/dashboard/projects";
        }}
      />

      <ProjectMeta project={project} />

      <GenerationList projectUid={projectUid} generations={sortedGenerations} />
    </main>
  );
}
