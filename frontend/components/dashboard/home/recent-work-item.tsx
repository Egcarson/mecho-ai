"use client";

import Link from "next/link";

import { ArrowUpRight, Megaphone, MessageSquareText, Mic2 } from "lucide-react";

import type { HistoryItem } from "@/lib/history";

type RecentWorkItemProps = {
  item: HistoryItem;
};

const workflowConfig = {
  social: {
    label: "Social",
    icon: MessageSquareText,
  },

  campaign: {
    label: "Campaign",
    icon: Megaphone,
  },

  speech: {
    label: "Speech",
    icon: Mic2,
  },
};

export function RecentWorkItem({ item }: RecentWorkItemProps) {
  const config = workflowConfig[item.workflow];

  const Icon = config?.icon ?? MessageSquareText;

  const href =
    item.status === "completed"
      ? `/dashboard/projects/${item.project_uid}/generations/${item.uid}`
      : `/dashboard/projects/${item.project_uid}`;

  const preview =
    item.input_content?.trim() ||
    getOutputPreview(item.output_content) ||
    "Open this work to continue.";

  return (
    <Link
      href={href}
      className="
        group
        flex
        min-w-0
        items-center
        gap-4
        rounded-2xl
        px-3
        py-3
        transition-colors
        duration-300

        hover:bg-muted/35

        sm:px-4
        sm:py-4
      "
    >
      <div
        className="
          flex
          size-11
          shrink-0
          items-center
          justify-center
          rounded-2xl
          bg-mecho-purple-soft
          text-mecho-purple
        "
      >
        <Icon className="size-[18px]" />
      </div>

      <div className="min-w-0 flex-1">
        <div
          className="
            flex
            min-w-0
            items-center
            gap-2
          "
        >
          <h3
            className="
              truncate
              text-sm
              font-semibold
              tracking-[-0.02em]
              text-foreground

              sm:text-[15px]
            "
          >
            {item.project_name}
          </h3>

          <StatusDot status={item.status} />
        </div>

        <p
          className="
            mt-1
            truncate
            text-sm
            text-muted-foreground
          "
        >
          {preview}
        </p>

        <div
          className="
            mt-2
            flex
            items-center
            gap-2
            text-xs
            text-muted-foreground/75
          "
        >
          <span>{config?.label ?? formatLabel(item.workflow)}</span>

          <span aria-hidden="true">·</span>

          <span>{formatDate(item.created_at)}</span>
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
          text-muted-foreground
          transition-all
          duration-300

          group-hover:bg-background
          group-hover:text-mecho-purple
        "
      >
        <ArrowUpRight className="size-4" />
      </div>
    </Link>
  );
}

function StatusDot({ status }: { status: HistoryItem["status"] }) {
  const label =
    status === "completed"
      ? "Completed"
      : status === "failed"
        ? "Failed"
        : status === "processing"
          ? "Processing"
          : "Pending";

  return (
    <span
      title={label}
      aria-label={label}
      className={`
        size-1.5
        shrink-0
        rounded-full

        ${
          status === "completed"
            ? "bg-emerald-500"
            : status === "failed"
              ? "bg-red-500"
              : status === "processing"
                ? "bg-amber-500"
                : "bg-muted-foreground/50"
        }
      `}
    />
  );
}

function getOutputPreview(output: string | null) {
  if (!output) {
    return "";
  }

  try {
    const parsed = JSON.parse(output);

    if (typeof parsed?.title === "string") {
      return parsed.title;
    }

    if (typeof parsed?.speech === "string") {
      return parsed.speech;
    }

    if (Array.isArray(parsed?.generated) && parsed.generated.length) {
      const first = parsed.generated[0];

      return first?.title || first?.hook || first?.main_message || "";
    }
  } catch {
    return output;
  }

  return "";
}

function formatDate(value: string) {
  const date = new Date(value);

  const now = new Date();

  const difference = now.getTime() - date.getTime();

  const minutes = Math.floor(difference / 60000);

  const hours = Math.floor(difference / 3600000);

  const days = Math.floor(difference / 86400000);

  if (minutes >= 0 && minutes < 1) {
    return "Just now";
  }

  if (minutes >= 1 && minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours >= 1 && hours < 24) {
    return `${hours}h ago`;
  }

  if (days === 1) {
    return "Yesterday";
  }

  if (days > 1 && days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
