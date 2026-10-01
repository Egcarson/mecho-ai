"use client";

import {
  Archive,
  ArchiveRestore,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  archiveProject,
  toggleProjectFavorite,
  updateProject,
  type ProjectDetail,
} from "@/lib/projects";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ProjectEditDialog } from "./project-edit-dialog";
import { ProjectDeleteDialog } from "./project-delete-dialog";

import { useState } from "react";

type ProjectActionsProps = {
  project: ProjectDetail;

  onProjectChange: (project: ProjectDetail) => void;

  onDeleted: () => void;
};

export function ProjectActions({
  project,
  onProjectChange,
  onDeleted,
}: ProjectActionsProps) {
  const [editOpen, setEditOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

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
      /*
       * Your backend has a dedicated
       * POST /archive route for archiving.
       *
       * Restoring uses PATCH because the
       * archive endpoint is not documented
       * as a toggle.
       */

      if (project.is_archived) {
        const updated = await updateProject(project.uid, {
          is_archived: false,
        });

        onProjectChange(updated);

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
    <>
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <TooltipProvider delayDuration={250}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleFavorite}
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
              className="
                inline-flex
                size-10
                items-center
                justify-center
                rounded-full
                border
                border-border/70
                text-muted-foreground
                transition-all

                hover:bg-muted/50
                hover:text-foreground
              "
            >
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-52 rounded-xl border border-border/60 bg-background/95 p-1.5 shadow-[0_18px_60px_rgba(20,10,30,0.12)] backdrop-blur-xl"
          >
            <DropdownMenuItem onSelect={() => setEditOpen(true)}>
              <Pencil className="size-4" />
              Edit project
            </DropdownMenuItem>

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

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-4" />
              Delete project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProjectEditDialog
        project={project}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={onProjectChange}
      />

      <ProjectDeleteDialog
        project={project}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={onDeleted}
      />
    </>
  );
}
