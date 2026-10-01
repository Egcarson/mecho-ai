"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteGeneration, type ProjectGeneration } from "@/lib/projects";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type GenerationDeleteDialogProps = {
  projectUid: string;
  generation: ProjectGeneration;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: (generationUid: string) => void;
};

export function GenerationDeleteDialog({
  projectUid,
  generation,
  open,
  onOpenChange,
  onDeleted,
}: GenerationDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (deleting) return;

    setDeleting(true);

    try {
      await deleteGeneration(projectUid, generation.uid);

      toast.success("Generation deleted.");

      onOpenChange(false);

      onDeleted(generation.uid);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Couldn't delete this generation.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          overflow-hidden
          rounded-[1.5rem]
          border
          border-border/60
          bg-background
          p-0
          shadow-[0_30px_100px_rgba(20,10,30,0.14)]

          sm:max-w-md
        "
      >
        <div className="p-6 sm:p-7">
          <DialogHeader>
            <div
              className="
                mb-4
                flex
                size-11
                items-center
                justify-center
                rounded-xl
                bg-red-500/8
                text-red-600

                dark:text-red-400
              "
            >
              <Trash2 className="size-5" />
            </div>

            <DialogTitle
              className="
                text-xl
                tracking-[-0.03em]
              "
            >
              Delete this generation?
            </DialogTitle>

            <DialogDescription
              className="
                mt-2
                leading-6
              "
            >
              This generated result will be permanently removed from the
              project. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter
            className="
              mt-7
              gap-2
            "
          >
            <button
              type="button"
              disabled={deleting}
              onClick={() => onOpenChange(false)}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                rounded-full
                border
                border-border/60
                bg-background
                px-5
                text-sm
                font-medium
                text-foreground/75
                transition-all

                hover:border-mecho-purple/20
                hover:bg-mecho-purple-soft/40
                hover:text-mecho-purple

                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              Keep generation
            </button>

            <button
              type="button"
              disabled={deleting}
              onClick={() => {
                void handleDelete();
              }}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-full
                bg-red-600
                px-5
                text-sm
                font-semibold
                text-white
                transition-all

                hover:bg-red-700

                dark:bg-red-600
                dark:hover:bg-red-500

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
        </div>
      </DialogContent>
    </Dialog>
  );
}
