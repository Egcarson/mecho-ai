"use client";

import type { Option } from "@/components/dashboard/create/workflow-types";

type ChoiceGridProps = {
  options: Option[];

  selected: string | string[];

  onSelect: (value: string) => void;

  multiple?: boolean;
};

export function ChoiceGrid({
  options,
  selected,
  onSelect,
  multiple = false,
}: ChoiceGridProps) {
  function isSelected(value: string) {
    if (multiple) {
      return Array.isArray(selected) && selected.includes(value);
    }

    return !Array.isArray(selected) && selected === value;
  }

  return (
    <div
      className="
        mx-auto
        grid
        w-full
        max-w-2xl
        gap-3

        sm:grid-cols-2
      "
    >
      {options.map((option) => {
        const active = isSelected(option.value);

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            aria-pressed={active}
            className={`
                group
                relative
                min-h-[76px]
                rounded-[1.25rem]
                border
                px-5
                py-4
                text-left
                transition-all
                duration-200

                ${
                  active
                    ? `
                      border-mecho-purple/25
                      bg-mecho-purple-soft/55
                      shadow-[0_10px_30px_rgba(111,44,255,0.06)]
                    `
                    : `
                      border-border/60
                      bg-background/70

                      hover:border-mecho-purple/20
                      hover:bg-mecho-purple-soft/25
                    `
                }
              `}
          >
            <div
              className="
                  flex
                  items-start
                  justify-between
                  gap-4
                "
            >
              <span
                className={`
                    text-sm
                    font-medium
                    leading-6
                    transition-colors

                    ${active ? "text-mecho-purple" : "text-foreground/85"}
                  `}
              >
                {option.label}
              </span>

              <span
                className={`
                    mt-0.5
                    flex
                    size-4
                    shrink-0
                    items-center
                    justify-center
                    border
                    transition-all

                    ${multiple ? "rounded-[5px]" : "rounded-full"}

                    ${
                      active
                        ? `
                          border-mecho-purple
                          bg-mecho-purple
                        `
                        : `
                          border-border
                          bg-background
                        `
                    }
                  `}
              >
                {active && (
                  <span
                    className={`
                        bg-white

                        ${
                          multiple
                            ? `
                              size-1.5
                              rounded-[2px]
                            `
                            : `
                              size-1.5
                              rounded-full
                            `
                        }
                      `}
                  />
                )}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
