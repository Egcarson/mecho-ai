"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { updateProject, type ProjectDetail } from "@/lib/projects";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ProjectEditDialogProps = {
  project: ProjectDetail;
  open: boolean;

  onOpenChange: (open: boolean) => void;

  onUpdated: (project: ProjectDetail) => void;
};

export function ProjectEditDialog({
  project,
  open,
  onOpenChange,
  onUpdated,
}: ProjectEditDialogProps) {
  const [name, setName] = useState(project.name);

  const [description, setDescription] = useState(project.description ?? "");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(project.name);

    setDescription(project.description ?? "");
  }, [open, project.name, project.description]);

  async function handleSave() {
    const cleanName = name.trim();

    if (!cleanName) {
      toast.error("Project name is required.");

      return;
    }

    setSaving(true);

    try {
      const updated = await updateProject(project.uid, {
        name: cleanName,

        description: description.trim() || null,
      });

      onUpdated(updated);

      onOpenChange(false);

      toast.success("Project updated.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't update project.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          sm:max-w-lg
        "
      >
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>

          <DialogDescription>
            Update how this project appears in your workspace.
          </DialogDescription>
        </DialogHeader>

        <div
          className="
            space-y-5
            py-2
          "
        >
          <div>
            <label
              htmlFor="project-name"
              className="
                text-sm
                font-medium
              "
            >
              Project name
            </label>

            <input
              id="project-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="
                mt-2
                h-11
                w-full
                rounded-xl
                border
                border-border/70
                bg-background
                px-4
                text-sm
                outline-none
                transition-colors

                focus:border-mecho-purple/35
              "
            />
          </div>

          <div>
            <label
              htmlFor="project-description"
              className="
                text-sm
                font-medium
              "
            >
              Description
            </label>

            <textarea
              id="project-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              placeholder="Add a short note about this project..."
              className="
                mt-2
                min-h-[120px]
                w-full
                resize-none
                rounded-xl
                border
                border-border/70
                bg-background
                px-4
                py-3
                text-sm
                leading-6
                outline-none
                transition-colors

                focus:border-mecho-purple/35
              "
            />
          </div>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={saving}
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
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              void handleSave();
            }}
            disabled={saving}
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-full
              bg-mecho-gradient
              px-5
              text-sm
              font-semibold
              text-white

              disabled:pointer-events-none
              disabled:opacity-60
            "
          >
            {saving && (
              <Loader2
                className="
                  size-4
                  animate-spin
                "
              />
            )}
            Save changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
