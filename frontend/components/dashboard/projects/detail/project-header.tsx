"use client";

import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";

import type { ProjectDetail } from "@/lib/projects";
import { ProjectActions } from "./project-actions";

type ProjectHeaderProps = {
  project: ProjectDetail;

  onProjectChange: (project: ProjectDetail) => void;

  onDeleted: () => void;
};

export function ProjectHeader({
  project,
  onProjectChange,
  onDeleted,
}: ProjectHeaderProps) {
  return (
    <header>
      <Link
        href="/dashboard/projects"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-medium
          text-muted-foreground
          transition-colors
          hover:text-foreground
        "
      >
        <ArrowLeft className="size-4" />
        Projects
      </Link>

      <div
        className="
          mt-8
          flex
          flex-col
          gap-5

          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
        <div className="min-w-0">
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.14em]
                text-mecho-purple
              "
            >
              {formatLabel(project.workflow)}
            </span>

            {project.is_favorite && (
              <Star
                className="
                  size-3.5
                  fill-amber-400
                  text-amber-400
                "
              />
            )}
          </div>

          <h1
            className="
              mt-3
              max-w-3xl
              text-4xl
              font-semibold
              tracking-[-0.05em]

              sm:text-5xl
            "
          >
            {project.name}
          </h1>

          {project.description && (
            <p
              className="
                mt-4
                max-w-2xl
                text-base
                leading-7
                text-muted-foreground
              "
            >
              {project.description}
            </p>
          )}
        </div>

        <div
          className="
            flex
            shrink-0
            items-center
            gap-3
          "
        >
          <div
            className="
              rounded-full
              bg-muted/60
              px-3
              py-1.5
              text-xs
              font-medium
              capitalize
              text-muted-foreground
            "
          >
            {formatLabel(project.status)}
          </div>

          <ProjectActions
            project={project}
            onProjectChange={onProjectChange}
            onDeleted={onDeleted}
          />
        </div>
      </div>
    </header>
  );
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
