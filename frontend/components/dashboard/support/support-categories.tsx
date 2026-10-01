"use client";

import type { SupportCategory, SupportCategoryId } from "./support-data";

type SupportCategoriesProps = {
  categories: SupportCategory[];

  selectedCategory: SupportCategoryId | null;

  onSelect: (category: SupportCategoryId | null) => void;
};

/**
 * Categories act as lightweight FAQ filters.
 *
 * They are not navigation routes because all help content currently
 * lives on this page.
 */
export function SupportCategories({
  categories,
  selectedCategory,
  onSelect,
}: SupportCategoriesProps) {
  return (
    <section
      className="
        mt-12

        sm:mt-14
      "
    >
      <div
        className="
          flex
          items-end
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.14em]
              text-mecho-purple
            "
          >
            Popular help
          </p>

          <h2
            className="
              mt-2
              text-2xl
              font-semibold
              tracking-[-0.04em]

              sm:text-3xl
            "
          >
            Start with a topic.
          </h2>
        </div>

        {selectedCategory && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="
              hidden
              text-xs
              font-medium
              text-muted-foreground
              transition-colors

              hover:text-foreground

              sm:block
            "
          >
            Show all
          </button>
        )}
      </div>

      <div
        className="
          mt-6
          grid
          gap-3

          sm:grid-cols-2

          lg:grid-cols-3
        "
      >
        {categories.map((category) => {
          const Icon = category.icon;

          const active = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(active ? null : category.id)}
              className={`
                  group
                  flex
                  min-h-[132px]
                  items-start
                  gap-4
                  rounded-[1.35rem]
                  border
                  p-5
                  text-left
                  transition-all

                  ${
                    active
                      ? `
                        border-mecho-purple/25
                        bg-mecho-purple-soft/45
                      `
                      : `
                        border-border/60
                        bg-background/75

                        hover:-translate-y-0.5
                        hover:border-mecho-purple/15
                        hover:bg-muted/20
                      `
                  }
                `}
            >
              <span
                className={`
                    flex
                    size-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    transition-colors

                    ${
                      active
                        ? `
                          bg-mecho-purple
                          text-white
                        `
                        : `
                          bg-muted/60
                          text-muted-foreground

                          group-hover:bg-mecho-purple-soft
                          group-hover:text-mecho-purple
                        `
                    }
                  `}
              >
                <Icon className="size-4.5" />
              </span>

              <span>
                <span
                  className="
                      block
                      text-sm
                      font-semibold
                      tracking-[-0.015em]
                    "
                >
                  {category.title}
                </span>

                <span
                  className="
                      mt-1.5
                      block
                      text-xs
                      leading-5
                      text-muted-foreground
                    "
                >
                  {category.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
