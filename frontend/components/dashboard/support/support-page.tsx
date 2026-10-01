"use client";

import { useMemo, useState } from "react";

import { LifeBuoy, Map } from "lucide-react";

import { SupportCategories } from "./support-categories";

import { SupportContact } from "./support-contact";

import { SupportFaq } from "./support-faq";

import { SupportSearch } from "./support-search";

import {
  SUPPORT_CATEGORIES,
  SUPPORT_FAQS,
  type SupportCategoryId,
} from "./support-data";

import { useDashboardTour } from "@/components/dashboard/tour/use-dashboard-tour";

/**
 * SupportPage
 *
 * Owns high-level FAQ filtering and exposes a convenient way for an
 * existing user to replay dashboard onboarding.
 */
export function SupportPage() {
  const { restartTour } = useDashboardTour();

  const [query, setQuery] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState<SupportCategoryId | null>(null);

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return SUPPORT_FAQS.filter((faq) => {
      const matchesCategory =
        !selectedCategory || faq.category === selectedCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchable = `${faq.question} ${faq.answer}`.toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [query, selectedCategory]);

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-background
        px-4
        pb-28
        pt-8
        text-foreground

        sm:px-6
        sm:pt-10

        lg:px-8
        lg:pb-16
        lg:pt-12
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[8%]
          top-[5%]
          size-[320px]
          rounded-full
          bg-mecho-purple/8
          blur-[140px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-[4%]
          top-[32%]
          size-[280px]
          rounded-full
          bg-mecho-orange/6
          blur-[140px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-6xl
        "
      >
        {/* ====================================================
            HERO
        ==================================================== */}

        <section
          className="
            mx-auto
            max-w-3xl
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex
              size-11
              items-center
              justify-center
              rounded-2xl
              bg-mecho-purple-soft
              text-mecho-purple
            "
          >
            <LifeBuoy className="size-5" />
          </div>

          <p
            className="
              mt-5
              text-xs
              font-semibold
              uppercase
              tracking-[0.16em]
              text-mecho-purple
            "
          >
            Support
          </p>

          <h1
            className="
              mt-3
              text-4xl
              font-semibold
              tracking-[-0.055em]

              sm:text-5xl

              lg:text-6xl
            "
          >
            How can we help?
          </h1>

          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-sm
              leading-7
              text-muted-foreground

              sm:text-base
            "
          >
            Find quick answers, learn how Mecho works, or reach support when
            something needs attention.
          </p>

          <SupportSearch value={query} onChange={setQuery} />

          {/**
           * Keeping the replay action here makes onboarding discoverable
           * even if a user has forgotten where something lives.
           */}
          <button
            type="button"
            onClick={restartTour}
            className="
              mt-5
              inline-flex
              h-10
              items-center
              gap-2
              rounded-full
              border
              border-border/70
              bg-background/80
              px-4
              text-sm
              font-medium
              text-muted-foreground
              backdrop-blur
              transition-all

              hover:border-mecho-purple/20
              hover:bg-mecho-purple-soft/40
              hover:text-mecho-purple
            "
          >
            <Map className="size-4" />
            Take dashboard tour
          </button>
        </section>

        <SupportCategories
          categories={SUPPORT_CATEGORIES}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <SupportFaq items={filteredFaqs} />

        <SupportContact />
      </div>
    </main>
  );
}
