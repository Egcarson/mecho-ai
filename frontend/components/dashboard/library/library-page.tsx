"use client";

import { useEffect, useMemo, useState } from "react";

import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";

import { toast } from "sonner";

import {
  getLibrary,
  type LibraryItem,
  type LibraryMediaType,
} from "@/lib/library";

import { LibraryGrid } from "./library-grid";

import { LibraryEmptyState } from "./library-empty-state";

const tabs: {
  label: string;
  value: "all" | LibraryMediaType;
}[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Voice",
    value: "voice",
  },
  {
    label: "Images",
    value: "image",
  },
  {
    label: "Videos",
    value: "video",
  },
];

/**
 * Library currently receives the complete media collection from the API.
 *
 * Until the backend supports page/limit or offset/limit, pagination is
 * intentionally performed client-side after search and media filtering.
 */
const ITEMS_PER_PAGE = 12;

export function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"all" | LibraryMediaType>("all");

  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);

  /**
   * Load the complete Library once.
   *
   * The current backend endpoint does not support pagination parameters,
   * so filtering and pagination happen locally for the MVP.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadLibrary() {
      setLoading(true);

      try {
        const response = await getLibrary();

        if (cancelled) {
          return;
        }

        setItems(response);
      } catch (error) {
        if (cancelled) {
          return;
        }

        toast.error("We couldn't load your library", {
          description:
            error instanceof Error
              ? error.message
              : "Please try again in a moment.",
        });
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadLibrary();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Apply media-type filtering and search BEFORE pagination.
   *
   * This ensures page counts always represent the filtered result rather
   * than the complete unfiltered Library.
   */
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesTab =
        activeTab === "all" ? true : item.media_type === activeTab;

      const matchesQuery =
        !normalizedQuery ||
        item.project_name.toLowerCase().includes(normalizedQuery) ||
        item.workflow.toLowerCase().includes(normalizedQuery) ||
        (item.language || "").toLowerCase().includes(normalizedQuery) ||
        (item.platform || "").toLowerCase().includes(normalizedQuery) ||
        (item.voice_name || "").toLowerCase().includes(normalizedQuery);

      return matchesTab && matchesQuery;
    });
  }, [items, activeTab, query]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
  );

  /**
   * Reset pagination whenever the result set changes because of search
   * or media-type filtering.
   *
   * Example:
   * user is on page 4 of All → switches to Voice → begin at page 1.
   */
  useEffect(() => {
    setPage(1);
  }, [activeTab, query]);

  /**
   * Safety net for cases where items are removed or the dataset changes
   * and the current page becomes larger than the available page count.
   */
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;

    const end = start + ITEMS_PER_PAGE;

    return filteredItems.slice(start, end);
  }, [filteredItems, page]);

  const rangeStart =
    filteredItems.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;

  const rangeEnd = Math.min(page * ITEMS_PER_PAGE, filteredItems.length);

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-7xl
        px-4
        pb-24
        pt-8

        sm:px-6
        sm:pt-10

        lg:px-8
        lg:pt-12
      "
    >
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <header className="mb-8">
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.16em]
            text-mecho-purple
          "
        >
          Library
        </p>

        <h1
          className="
            mt-2
            text-3xl
            font-semibold
            tracking-[-0.04em]

            sm:text-4xl
          "
        >
          Your generated media
        </h1>

        <p
          className="
            mt-3
            max-w-2xl
            text-sm
            leading-7
            text-muted-foreground

            sm:text-base
          "
        >
          Everything Mecho has created for you — voice, images, and video.
        </p>
      </header>

      {/* ======================================================
          FILTERS + SEARCH
      ====================================================== */}

      <div
        className="
          mb-6
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
            inline-flex
            w-full
            max-w-full
            flex-wrap
            gap-2
          "
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`
                    inline-flex
                    h-11
                    items-center
                    rounded-full
                    px-4
                    text-sm
                    font-medium
                    transition-all
                    duration-300

                    ${
                      isActive
                        ? `
                          bg-mecho-purple
                          text-white
                          shadow-[0_10px_26px_rgba(53,16,79,0.18)]
                        `
                        : `
                          border
                          border-border/70
                          bg-background
                          text-muted-foreground

                          hover:border-mecho-purple/25
                          hover:bg-mecho-purple-soft
                          hover:text-mecho-purple
                        `
                    }
                  `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          className="
            relative
            w-full

            lg:max-w-sm
          "
        >
          <Search
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              size-4
              -translate-y-1/2
              text-muted-foreground
            "
          />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search project, language, platform..."
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

              placeholder:text-muted-foreground/70

              focus:border-mecho-purple/35
            "
          />
        </div>
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      {loading ? (
        <div
          className="
            flex
            min-h-[40vh]
            items-center
            justify-center
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              text-sm
              text-muted-foreground
            "
          >
            <Loader2 className="size-4 animate-spin" />
            Loading your library...
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <LibraryEmptyState activeTab={activeTab} />
      ) : (
        <>
          {/* ==================================================
              MEDIA GRID
          ================================================== */}

          <LibraryGrid items={paginatedItems} />

          {/* ==================================================
              PAGINATION
          ================================================== */}

          <div
            className="
              mt-10
              flex
              flex-col
              gap-4
              border-t
              border-border/60
              pt-6

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* Result count */}

            <p
              className="
                text-center
                text-xs
                text-muted-foreground

                sm:text-left
              "
            >
              Showing{" "}
              <span className="font-medium text-foreground">{rangeStart}</span>
              {" – "}
              <span className="font-medium text-foreground">{rangeEnd}</span>
              {" of "}
              <span className="font-medium text-foreground">
                {filteredItems.length}
              </span>
            </p>

            {totalPages > 1 && (
              <LibraryPagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            )}
          </div>
        </>
      )}
    </main>
  );
}

/**
 * Premium responsive pagination.
 *
 * Desktop:
 * Previous  1 2 3 ... 8  Next
 *
 * Mobile:
 * Previous  2 / 8  Next
 */
function LibraryPagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;

  totalPages: number;

  onChange: (page: number) => void;
}) {
  const visiblePages = getVisiblePages(page, totalPages);

  function goToPage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return;
    }

    onChange(nextPage);

    /**
     * Bring users back near the beginning of the media collection when
     * they move between pages.
     */
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <nav
      aria-label="Library pagination"
      className="
        flex
        items-center
        justify-center
        gap-1.5
      "
    >
      {/* Previous */}

      <button
        type="button"
        disabled={page === 1}
        onClick={() => goToPage(page - 1)}
        className="
          inline-flex
          h-9
          items-center
          gap-1.5
          rounded-full
          border
          border-border/70
          bg-background
          px-3
          text-xs
          font-medium
          text-muted-foreground
          transition-colors

          hover:bg-muted
          hover:text-foreground

          disabled:pointer-events-none
          disabled:opacity-40
        "
      >
        <ChevronLeft className="size-3.5" />

        <span
          className="
            hidden

            sm:inline
          "
        >
          Previous
        </span>
      </button>

      {/* Desktop page numbers */}

      <div
        className="
          hidden
          items-center
          gap-1

          sm:flex
        "
      >
        {visiblePages.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="
                    flex
                    size-9
                    items-center
                    justify-center
                    text-xs
                    text-muted-foreground
                  "
              >
                …
              </span>
            );
          }

          const active = item === page;

          return (
            <button
              key={item}
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => goToPage(item)}
              className={`
                  flex
                  size-9
                  items-center
                  justify-center
                  rounded-full
                  text-xs
                  font-medium
                  transition-all

                  ${
                    active
                      ? `
                        bg-mecho-purple
                        text-white
                        shadow-[0_8px_20px_rgba(53,16,79,0.16)]
                      `
                      : `
                        text-muted-foreground

                        hover:bg-muted
                        hover:text-foreground
                      `
                  }
                `}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Mobile page indicator */}

      <div
        className="
          flex
          h-9
          min-w-[72px]
          items-center
          justify-center
          rounded-full
          bg-muted/40
          px-3
          text-xs
          font-medium
          text-muted-foreground

          sm:hidden
        "
      >
        <span className="text-foreground">{page}</span>

        <span className="mx-1">/</span>

        {totalPages}
      </div>

      {/* Next */}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => goToPage(page + 1)}
        className="
          inline-flex
          h-9
          items-center
          gap-1.5
          rounded-full
          border
          border-border/70
          bg-background
          px-3
          text-xs
          font-medium
          text-muted-foreground
          transition-colors

          hover:bg-muted
          hover:text-foreground

          disabled:pointer-events-none
          disabled:opacity-40
        "
      >
        <span
          className="
            hidden

            sm:inline
          "
        >
          Next
        </span>

        <ChevronRight className="size-3.5" />
      </button>
    </nav>
  );
}

type PaginationItem = number | "ellipsis";

/**
 * Prevent the pagination row from becoming enormous when a user has many
 * media pages.
 *
 * Examples:
 *
 * 1 2 3 4 5
 *
 * 1 2 3 ... 10
 *
 * 1 ... 4 5 6 ... 10
 *
 * 1 ... 8 9 10
 */
function getVisiblePages(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}
