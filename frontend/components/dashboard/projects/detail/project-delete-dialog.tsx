"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { deleteProject, type ProjectDetail } from "@/lib/projects";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ProjectDeleteDialogProps = {
  project: ProjectDetail;
  open: boolean;

  onOpenChange: (open: boolean) => void;

  onDeleted: () => void;
};

export function ProjectDeleteDialog({
  project,
  open,
  onOpenChange,
  onDeleted,
}: ProjectDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (deleting) {
      return;
    }

    setDeleting(true);

    try {
      await deleteProject(project.uid);

      toast.success("Project deleted.");

      onOpenChange(false);

      onDeleted();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't delete project.",
      );

      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          sm:max-w-md
        "
      >
        <DialogHeader>
          <div
            className="
              mb-3
              flex
              size-11
              items-center
              justify-center
              rounded-xl
              bg-destructive/10
              text-destructive
            "
          >
            <Trash2 className="size-5" />
          </div>

          <DialogTitle>Delete this project?</DialogTitle>

          <DialogDescription
            className="
              leading-6
            "
          >
            <strong
              className="
                font-medium
                text-foreground
              "
            >
              {project.name}
            </strong>{" "}
            and its saved generations will no longer be available. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
            className="
              inline-flex
              h-10
              items-center
              justify-center
              rounded-full
              border
              border-border/70
              px-5
              text-sm
              font-medium
              transition-colors

              hover:bg-muted/50

              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            Keep project
          </button>

          <button
            type="button"
            onClick={() => {
              void handleDelete();
            }}
            disabled={deleting}
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-full
              bg-destructive
              px-5
              text-sm
              font-semibold
              text-destructive-foreground

              disabled:pointer-events-none
              disabled:opacity-60
            "
          >
            {deleting ? (
              <Loader2
                className="
                  size-4
                  animate-spin
                "
              />
            ) : (
              <Trash2 className="size-4" />
            )}
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
