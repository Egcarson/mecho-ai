"use client";

import { Search } from "lucide-react";

export type HistoryFilter = "all" | "social" | "campaign" | "speech";

type HistoryToolbarProps = {
  filter: HistoryFilter;

  search: string;

  onFilterChange: (filter: HistoryFilter) => void;

  onSearchChange: (value: string) => void;
};

const FILTERS: {
  label: string;
  value: HistoryFilter;
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

export function HistoryToolbar({
  filter,
  search,
  onFilterChange,
  onSearchChange,
}: HistoryToolbarProps) {
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
          flex
          flex-wrap
          gap-2
        "
      >
        {FILTERS.map((item) => {
          const active = filter === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onFilterChange(item.value)}
              className={`
                  inline-flex
                  h-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  px-4
                  text-sm
                  font-medium
                  transition-all

                  ${
                    active
                      ? `
                        border-mecho-purple/20
                        bg-mecho-purple-soft/70
                        text-mecho-purple
                      `
                      : `
                        border-border/60
                        bg-background
                        text-muted-foreground

                        hover:border-mecho-purple/15
                        hover:text-foreground
                      `
                  }
                `}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        className="
          flex
          h-10
          w-full
          items-center
          gap-2
          rounded-full
          border
          border-border/60
          bg-background
          px-4
          transition-colors

          focus-within:border-mecho-purple/25

          lg:w-[290px]
        "
      >
        <Search
          className="
            size-4
            shrink-0
            text-muted-foreground
          "
        />

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search history..."
          className="
            min-w-0
            flex-1
            bg-transparent
            text-sm
            outline-none

            placeholder:text-muted-foreground/60
          "
        />
      </div>
    </div>
  );
}
