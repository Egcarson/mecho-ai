"use client";

import Link from "next/link";

import { ArrowUpRight, Megaphone, MessageSquareText, Mic2 } from "lucide-react";

import type { HistoryItem as HistoryItemType } from "@/lib/history";

type HistoryItemProps = {
  item: HistoryItemType;
};

export function HistoryItem({ item }: HistoryItemProps) {
  const completed = item.status === "completed";

  const href = completed
    ? `/dashboard/projects/${item.project_uid}/generations/${item.uid}`
    : `/dashboard/projects/${item.project_uid}`;

  const Icon = getWorkflowIcon(item.workflow);

  return (
    <article
      className="
        group
        rounded-[1.35rem]
        border
        border-border/60
        bg-background/75
        p-5
        transition-all
        duration-300

        hover:border-mecho-purple/20
        hover:bg-background
        hover:shadow-[0_18px_60px_rgba(47,1,117,0.05)]
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5

          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
        <div
          className="
            flex
            min-w-0
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
              bg-mecho-purple-soft/60
              text-mecho-purple
            "
          >
            <Icon className="size-4" />
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
              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.11em]
                  text-muted-foreground
                "
              >
                {formatLabel(item.workflow)}
              </span>

              <span
                className="
                  size-1
                  rounded-full
                  bg-border
                "
              />

              <StatusPill status={item.status} />
            </div>

            <h3
              className="
                mt-2
                truncate
                text-[17px]
                font-semibold
                tracking-[-0.025em]
                text-foreground
              "
            >
              {item.project_name}
            </h3>

            {item.input_content && (
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
                {item.input_content}
              </p>
            )}

            <p
              className="
                mt-4
                text-xs
                text-muted-foreground
              "
            >
              {formatDate(item.created_at)}
            </p>
          </div>
        </div>

        <Link
          href={href}
          className="
            inline-flex
            h-9
            shrink-0
            items-center
            justify-center
            gap-1.5
            self-start
            rounded-full
            border
            border-border/60
            bg-background
            px-4
            text-xs
            font-medium
            text-foreground/70
            transition-all

            hover:border-mecho-purple/20
            hover:bg-mecho-purple-soft/40
            hover:text-mecho-purple
          "
        >
          {completed ? "Open" : "View project"}

          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}

function StatusPill({ status }: { status: string }) {
  const classes = getStatusClasses(status);

  return (
    <span
      className={`
        inline-flex
        h-6
        items-center
        rounded-full
        px-2.5
        text-[11px]
        font-medium

        ${classes}
      `}
    >
      {formatLabel(status)}
    </span>
  );
}

function getStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
      return `
        bg-emerald-500/10
        text-emerald-700

        dark:text-emerald-400
      `;

    case "failed":
      return `
        bg-red-500/10
        text-red-600

        dark:text-red-400
      `;

    case "processing":
      return `
        bg-amber-500/10
        text-amber-700

        dark:text-amber-400
      `;

    default:
      return `
        bg-muted
        text-muted-foreground
      `;
  }
}

function getWorkflowIcon(workflow: string) {
  switch (workflow.toLowerCase()) {
    case "campaign":
      return Megaphone;

    case "speech":
      return Mic2;

    default:
      return MessageSquareText;
  }
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
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
