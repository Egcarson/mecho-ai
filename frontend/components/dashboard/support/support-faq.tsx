"use client";

import { ChevronDown, CircleHelp } from "lucide-react";

import { useState } from "react";

import type { SupportFaq } from "./support-data";

type SupportFaqProps = {
  items: SupportFaq[];
};

/**
 * SupportFaq
 *
 * Accordion behavior is kept local to this component so search/filter
 * state in SupportPage stays simple.
 */
export function SupportFaq({ items }: SupportFaqProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div
        className="
          mt-6
          rounded-[1.5rem]
          border
          border-dashed
          border-border/70
          px-5
          py-12
          text-center
        "
      >
        <CircleHelp
          className="
            mx-auto
            size-5
            text-muted-foreground
          "
        />

        <p
          className="
            mt-3
            text-sm
            font-medium
          "
        >
          No help articles matched that search.
        </p>

        <p
          className="
            mt-1
            text-xs
            text-muted-foreground
          "
        >
          Try another word or contact support below.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-14">
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
          Frequently asked
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
          Quick answers.
        </h2>
      </div>

      <div
        className="
          mt-6
          divide-y
          divide-border/60
          border-y
          border-border/60
        "
      >
        {items.map((item) => {
          const open = openId === item.id;

          return (
            <div key={item.id}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : item.id)}
                className="
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-5
                    py-5
                    text-left

                    sm:py-6
                  "
              >
                <span
                  className="
                      text-sm
                      font-medium
                      leading-6

                      sm:text-[15px]
                    "
                >
                  {item.question}
                </span>

                <ChevronDown
                  className={`
                      size-4
                      shrink-0
                      text-muted-foreground
                      transition-transform
                      duration-200

                      ${open ? "rotate-180" : ""}
                    `}
                />
              </button>

              {open && (
                <div
                  className="
                      max-w-3xl
                      pb-6
                      pr-10
                      text-sm
                      leading-7
                      text-muted-foreground
                    "
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
