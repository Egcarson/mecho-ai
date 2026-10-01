"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Clock3, MoreHorizontal, Trash2 } from "lucide-react";

import type { ProjectGeneration } from "@/lib/projects";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { GenerationDeleteDialog } from "./generation-delete-dialog";

type GenerationCardProps = {
  projectUid: string;
  generation: ProjectGeneration;
  onDeleted: (generationUid: string) => void;
};

export function GenerationCard({
  projectUid,
  generation,
  onDeleted,
}: GenerationCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
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
          href={`/dashboard/projects/${projectUid}/generations/${generation.uid}`}
          className="
            block
            p-5
            pr-20

            sm:p-6
            sm:pr-24
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4

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
                    rounded-full
                    border
                    border-border/60
                    bg-muted/40
                    px-2.5
                    py-1
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.1em]
                    text-muted-foreground
                  "
                >
                  {formatStatus(generation.status)}
                </span>

                {generation.model && (
                  <span
                    className="
                      text-xs
                      text-muted-foreground
                    "
                  >
                    {generation.model}
                  </span>
                )}
              </div>

              <h3
                className="
                  mt-3
                  text-base
                  font-semibold
                  tracking-[-0.025em]

                  sm:text-lg
                "
              >
                Generated result
              </h3>

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
                {getGenerationPreview(generation.output_content)}
              </p>

              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  items-center
                  gap-x-4
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
                  <Clock3 className="size-3.5" />

                  {formatDate(generation.completed_at ?? generation.created_at)}
                </span>

                {generation.provider && (
                  <span>{formatLabel(generation.provider)}</span>
                )}
              </div>
            </div>
          </div>
        </Link>

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Generation actions"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                className="
                  inline-flex
                  size-9
                  items-center
                  justify-center
                  rounded-full
                  text-foreground/60
                  transition-all
                  duration-200

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

          <Link
            href={`/dashboard/projects/${projectUid}/generations/${generation.uid}`}
            aria-label="Open generation"
            className="
              hidden
              size-9
              items-center
              justify-center
              rounded-full
              text-foreground/60
              transition-colors

              hover:bg-mecho-purple-soft/50
              hover:text-mecho-purple

              sm:flex
            "
          >
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </article>

      <GenerationDeleteDialog
        projectUid={projectUid}
        generation={generation}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={onDeleted}
      />
    </>
  );
}

function formatStatus(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

function getGenerationPreview(outputContent: string) {
  if (!outputContent) {
    return "No preview available.";
  }

  try {
    const parsed = JSON.parse(outputContent);

    if (parsed && typeof parsed === "object") {
      const firstLanguage = parsed.generated?.[0];

      const firstContent = firstLanguage?.contents?.[0];

      if (firstContent?.content && typeof firstContent.content === "string") {
        return firstContent.content;
      }

      if (firstContent?.hook && typeof firstContent.hook === "string") {
        return firstContent.hook;
      }
    }
  } catch {
    // output is not JSON
  }

  return outputContent.replace(/\s+/g, " ").trim();
}
