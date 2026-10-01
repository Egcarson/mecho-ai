"use client";

import Link from "next/link";
import {
  Archive,
  ArchiveRestore,
  ArrowUpRight,
  FileText,
  MoreHorizontal,
  Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  archiveProject,
  toggleProjectFavorite,
  updateProject,
  type ProjectListItem,
} from "@/lib/projects";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ProjectStatusPill } from "./project-status-pill";

type ProjectCardProps = {
  project: ProjectListItem;

  onProjectChange: (project: ProjectListItem) => void;
};

export function ProjectCard({ project, onProjectChange }: ProjectCardProps) {
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const [archiveLoading, setArchiveLoading] = useState(false);

  async function handleFavorite() {
    if (favoriteLoading) {
      return;
    }

    setFavoriteLoading(true);

    try {
      await toggleProjectFavorite(project.uid);

      onProjectChange({
        ...project,
        is_favorite: !project.is_favorite,
      });

      toast.success(
        project.is_favorite ? "Removed from favorites." : "Added to favorites.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't update favorite.",
      );
    } finally {
      setFavoriteLoading(false);
    }
  }

  async function handleArchive() {
    if (archiveLoading) {
      return;
    }

    setArchiveLoading(true);

    try {
      if (project.is_archived) {
        /*
         * Restore via PATCH because
         * /archive is documented as
         * an archive action, not a
         * toggle.
         */

        await updateProject(project.uid, {
          is_archived: false,
        });

        onProjectChange({
          ...project,
          is_archived: false,
        });

        toast.success("Project restored.");
      } else {
        await archiveProject(project.uid);

        onProjectChange({
          ...project,
          is_archived: true,
        });

        toast.success("Project archived.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't update project.",
      );
    } finally {
      setArchiveLoading(false);
    }
  }

  return (
    <article
      className="
        group
        relative
        rounded-[1.5rem]
        border
        border-border/70
        bg-background/80
        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:border-mecho-purple/20
        hover:shadow-[0_18px_60px_rgba(47,1,117,0.06)]
      "
    >
      <Link
        href={`/dashboard/projects/${project.uid}`}
        className="
          block
          p-5
          pr-24

          sm:p-6
          sm:pr-28
        "
      >
        <div
          className="
            min-w-0
          "
        >
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.13em]
                text-muted-foreground
              "
            >
              {formatLabel(project.workflow)}
            </p>

            <ProjectStatusPill status={project.status} />

            {project.is_archived && (
              <span
                className="
                  rounded-full
                  bg-muted/60
                  px-2.5
                  py-1
                  text-[10px]
                  font-medium
                  text-muted-foreground
                "
              >
                Archived
              </span>
            )}
          </div>

          <h2
            className="
              mt-3
              truncate
              text-lg
              font-semibold
              tracking-[-0.025em]
            "
          >
            {project.name}
          </h2>

          {project.description && (
            <p
              className="
                mt-2
                line-clamp-2
                max-w-2xl
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              {project.description}
            </p>
          )}

          <div
            className="
              mt-5
              flex
              flex-wrap
              items-center
              gap-x-5
              gap-y-2
              text-xs
              text-muted-foreground
            "
          >
            <span
              className="
                inline-flex
                items-center
                gap-1.5
              "
            >
              <FileText className="size-3.5" />
              {project.generation_count}{" "}
              {project.generation_count === 1 ? "generation" : "generations"}
            </span>

            {(project.languages?.length ?? 0) > 0 && (
              <span>
                {project.languages?.slice(0, 3).map(formatLabel).join(" · ")}
              </span>
            )}

            {(project.platforms?.length ?? 0) > 0 && (
              <span>
                {project.platforms?.slice(0, 3).map(formatLabel).join(" · ")}
              </span>
            )}

            <span>
              {formatProjectDate(
                project.last_generated_at ?? project.updated_at,
              )}
            </span>
          </div>
        </div>
      </Link>

      {/* Quick actions */}

      <div
        className="
          absolute
          right-4
          top-4
          flex
          items-center
          gap-1.5

          sm:right-5
          sm:top-5
        "
      >
        <TooltipProvider delayDuration={250}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  void handleFavorite();
                }}
                disabled={favoriteLoading}
                aria-label={
                  project.is_favorite
                    ? "Remove from favorites"
                    : "Mark as favorite"
                }
                className="
                  inline-flex
                  size-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-border/60
                  bg-background/70
                  text-muted-foreground
                  transition-all
                  duration-200

                  hover:border-mecho-purple/20
                  hover:bg-mecho-purple-soft/50
                  hover:text-mecho-purple

                  disabled:pointer-events-none
                  disabled:opacity-50
                "
              >
                <Star
                  className={`
                    size-4
                    transition-all
                    duration-200

                    ${project.is_favorite ? "fill-amber-400 text-amber-400" : ""}
                  `}
                />
              </button>
            </TooltipTrigger>

            <TooltipContent
              side="bottom"
              sideOffset={8}
              className="
                rounded-lg
                border
                border-border/60
                bg-foreground
                px-3
                py-1.5
                text-[11px]
                font-medium
                text-background
                shadow-lg
              "
            >
              {project.is_favorite
                ? "Remove from favorites"
                : "Mark as favorite"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Project actions"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-full
                text-muted-foreground
                transition-colors

                hover:bg-muted/60
                hover:text-foreground
              "
            >
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48"
            onClick={(event) => event.stopPropagation()}
          >
            <DropdownMenuItem
              disabled={archiveLoading}
              onSelect={() => {
                void handleArchive();
              }}
            >
              {project.is_archived ? (
                <ArchiveRestore className="size-4" />
              ) : (
                <Archive className="size-4" />
              )}

              {project.is_archived ? "Restore project" : "Archive project"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          href={`/dashboard/projects/${project.uid}`}
          aria-label="Open project"
          className="
            hidden
            size-9
            items-center
            justify-center
            rounded-full
            text-muted-foreground
            transition-colors

            hover:bg-muted/60
            hover:text-mecho-purple

            sm:flex
          "
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatProjectDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
