import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Loader2,
  XCircle,
} from "lucide-react";

import type { ProjectGeneration } from "@/lib/projects";

type GenerationCardProps = {
  projectUid: string;
  generation: ProjectGeneration;
  number: number;
};

export function GenerationCard({
  projectUid,
  generation,
  number,
}: GenerationCardProps) {
  const status = getStatusDetails(generation.status);

  const StatusIcon = status.icon;

  return (
    <Link
      href={`/dashboard/projects/${projectUid}/generations/${generation.uid}`}
      className="
        group
        flex
        items-center
        justify-between
        gap-5
        rounded-[1.35rem]
        border
        border-border/70
        bg-background/70
        p-5
        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:border-mecho-purple/20
        hover:shadow-[0_15px_50px_rgba(47,1,117,0.05)]
      "
    >
      <div
        className="
          flex
          min-w-0
          items-start
          gap-4
        "
      >
        <div
          className="
            flex
            size-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-muted/60
            text-muted-foreground
          "
        >
          <StatusIcon
            className={`
              size-4
              ${status.className}
            `}
          />
        </div>

        <div className="min-w-0">
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
                text-sm
                font-semibold
              "
            >
              Generation {number}
            </p>

            <span
              className="
                rounded-full
                bg-muted/60
                px-2.5
                py-1
                text-[10px]
                font-medium
                capitalize
                text-muted-foreground
              "
            >
              {generation.status}
            </span>
          </div>

          {generation.input_content && (
            <p
              className="
                mt-2
                line-clamp-1
                max-w-2xl
                text-sm
                text-muted-foreground
              "
            >
              {generation.input_content}
            </p>
          )}

          <p
            className="
              mt-2
              text-xs
              text-muted-foreground
            "
          >
            {formatDate(generation.completed_at ?? generation.created_at)}
          </p>
        </div>
      </div>

      <div
        className="
          flex
          size-9
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-border/70
          text-muted-foreground
          transition-all

          group-hover:border-mecho-purple/25
          group-hover:text-mecho-purple
        "
      >
        <ArrowUpRight className="size-4" />
      </div>
    </Link>
  );
}

function getStatusDetails(status: string) {
  switch (status) {
    case "completed":
      return {
        icon: CheckCircle2,
        className: "text-emerald-500",
      };

    case "processing":
      return {
        icon: Loader2,
        className: "animate-spin text-mecho-purple",
      };

    case "failed":
      return {
        icon: XCircle,
        className: "text-red-500",
      };

    default:
      return {
        icon: Clock3,
        className: "text-muted-foreground",
      };
  }
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
