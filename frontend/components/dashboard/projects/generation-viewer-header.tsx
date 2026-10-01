"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, MoreHorizontal, Trash2 } from "lucide-react";

import {
  deleteGeneration,
  type ProjectDetail,
  type ProjectGeneration,
} from "@/lib/projects";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GenerationDeleteDialog } from "./generation-delete-dialog";

type GenerationViewerHeaderProps = {
  project: ProjectDetail;
  generation: ProjectGeneration;
  compact?: boolean;
};

export function GenerationViewerHeader({
  project,
  generation,
  compact = false,
}: GenerationViewerHeaderProps) {
  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <header className="mb-8">
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div>
            <Link
              href={`/dashboard/projects/${project.uid}`}
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
              Back to project
            </Link>

            {!compact && (
              <div className="mt-6">
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-mecho-purple
                  "
                >
                  {formatLabel(project.workflow)}
                </p>

                <h1
                  className="
                    mt-2
                    text-3xl
                    font-semibold
                    tracking-[-0.04em]

                    sm:text-4xl
                  "
                >
                  {project.name}
                </h1>

                <p
                  className="
                    mt-3
                    text-sm
                    text-muted-foreground
                  "
                >
                  Generated{" "}
                  {formatDate(generation.completed_at ?? generation.created_at)}
                </p>
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Generation actions"
                className="
                  inline-flex
                  size-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-border/60
                  bg-background
                  text-foreground/60
                  transition-all
                  duration-200

                  hover:border-mecho-purple/20
                  hover:bg-mecho-purple-soft/50
                  hover:text-mecho-purple

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-mecho-purple/20
                "
              >
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="
                w-48
                rounded-xl
                border
                border-border/60
                bg-background/95
                p-1.5
                shadow-[0_18px_60px_rgba(20,10,30,0.12)]
                backdrop-blur-xl
              "
            >
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4" />
                Delete generation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <GenerationDeleteDialog
        projectUid={project.uid}
        generation={generation}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => {
          router.push(`/dashboard/projects/${project.uid}`);

          router.refresh();
        }}
      />
    </>
  );
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
