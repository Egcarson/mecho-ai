"use client";

import { Archive, Search } from "lucide-react";

import type { ProjectWorkflowFilter } from "./projects-page";

type ProjectsToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;

  workflowFilter: ProjectWorkflowFilter;

  onWorkflowFilterChange: (value: ProjectWorkflowFilter) => void;

  showArchived: boolean;

  onShowArchivedChange: (value: boolean) => void;
};

const workflowOptions: {
  label: string;
  value: ProjectWorkflowFilter;
}[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Social",
    value: "social",
  },
  {
    label: "Campaign",
    value: "campaign",
  },
  {
    label: "Speech",
    value: "speech",
  },
];

export function ProjectsToolbar({
  search,
  onSearchChange,
  workflowFilter,
  onWorkflowFilterChange,
  showArchived,
  onShowArchivedChange,
}: ProjectsToolbarProps) {
  return (
    <div
      className="
        mt-10
        flex
        flex-col
        gap-4

        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      <div
        className="
          relative
          w-full
          max-w-md
        "
      >
        <Search
          className="
            absolute
            left-4
            top-1/2
            size-4
            -translate-y-1/2
            text-muted-foreground
          "
        />

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search projects..."
          className="
            h-11
            w-full
            rounded-full
            border
            border-border/70
            bg-background
            pl-11
            pr-4
            text-sm
            outline-none
            transition-colors

            placeholder:text-muted-foreground

            focus:border-mecho-purple/35
          "
        />
      </div>

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-2
        "
      >
        {workflowOptions.map((option) => {
          const active = workflowFilter === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onWorkflowFilterChange(option.value)}
              className={`
                  rounded-full
                  border
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition-colors

                  ${
                    active
                      ? `
                        border-mecho-purple/30
                        bg-mecho-purple-soft
                        text-mecho-purple
                      `
                      : `
                        border-border/70
                        text-muted-foreground
                        hover:bg-muted/40
                        hover:text-foreground
                      `
                  }
                `}
            >
              {option.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onShowArchivedChange(!showArchived)}
          className={`
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            px-4
            py-2
            text-sm
            font-medium
            transition-colors

            ${
              showArchived
                ? `
                  border-mecho-purple/30
                  bg-mecho-purple-soft
                  text-mecho-purple
                `
                : `
                  border-border/70
                  text-muted-foreground
                  hover:bg-muted/40
                  hover:text-foreground
                `
            }
          `}
        >
          <Archive className="size-4" />
          Archived
        </button>
      </div>
    </div>
  );
}
