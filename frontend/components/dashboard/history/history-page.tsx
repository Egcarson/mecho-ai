"use client";

import { useEffect, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { toast } from "sonner";

import { getGenerationHistory, type HistoryItem } from "@/lib/history";

import { HistoryList } from "./history-list";

const ITEMS_PER_PAGE = 8;

export function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      setLoading(true);

      try {
        const response = await getGenerationHistory({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });

        if (cancelled) {
          return;
        }

        setItems(response.items);

        setTotalPages(response.total_pages);

        setTotalItems(response.total);
      } catch (error) {
        if (cancelled) {
          return;
        }

        toast.error(
          error instanceof Error
            ? error.message
            : "Couldn't load your history.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  function goToPage(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const firstItemNumber =
    totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const lastItemNumber = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-6xl
        px-4
        pb-16
        pt-10

        sm:px-6
        sm:pt-12

        lg:px-8
        lg:pt-14
      "
    >
      <div>
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.14em]
            text-muted-foreground
          "
        >
          Your activity
        </p>

        <h1
          className="
            mt-3
            text-4xl
            font-semibold
            tracking-[-0.05em]

            sm:text-5xl
          "
        >
          History
        </h1>

        <p
          className="
            mt-4
            max-w-2xl
            text-base
            leading-7
            text-muted-foreground
          "
        >
          Everything you've created with Mecho, arranged in one timeline.
        </p>
      </div>

      <HistoryList items={items} loading={loading} hasSearch={false} />

      {!loading && totalItems > ITEMS_PER_PAGE && (
        <HistoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          firstItemNumber={firstItemNumber}
          lastItemNumber={lastItemNumber}
          totalItems={totalItems}
          onPageChange={goToPage}
        />
      )}
    </main>
  );
}

type HistoryPaginationProps = {
  currentPage: number;
  totalPages: number;

  firstItemNumber: number;
  lastItemNumber: number;
  totalItems: number;

  onPageChange: (page: number) => void;
};

function HistoryPagination({
  currentPage,
  totalPages,
  firstItemNumber,
  lastItemNumber,
  totalItems,
  onPageChange,
}: HistoryPaginationProps) {
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div
      className="
        mt-8
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
      <p
        className="
          text-sm
          text-muted-foreground
        "
      >
        Showing{" "}
        <span
          className="
            font-medium
            text-foreground
          "
        >
          {firstItemNumber}
        </span>
        {" – "}
        <span
          className="
            font-medium
            text-foreground
          "
        >
          {lastItemNumber}
        </span>{" "}
        of{" "}
        <span
          className="
            font-medium
            text-foreground
          "
        >
          {totalItems}
        </span>
      </p>

      <div
        className="
          flex
          items-center
          gap-1
        "
      >
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          className="
            flex
            size-9
            items-center
            justify-center
            rounded-full
            border
            border-border/60
            text-muted-foreground
            transition-all

            hover:border-mecho-purple/20
            hover:bg-mecho-purple-soft/40
            hover:text-mecho-purple

            disabled:pointer-events-none
            disabled:opacity-35
          "
        >
          <ChevronLeft className="size-4" />
        </button>

        {pages.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="
                    flex
                    size-9
                    items-center
                    justify-center
                    text-sm
                    text-muted-foreground
                  "
              >
                …
              </span>
            );
          }

          const active = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`
                  flex
                  size-9
                  items-center
                  justify-center
                  rounded-full
                  border
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
                        border-transparent
                        text-muted-foreground

                        hover:border-border/60
                        hover:bg-muted/50
                        hover:text-foreground
                      `
                  }
                `}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          className="
            flex
            size-9
            items-center
            justify-center
            rounded-full
            border
            border-border/60
            text-muted-foreground
            transition-all

            hover:border-mecho-purple/20
            hover:bg-mecho-purple-soft/40
            hover:text-mecho-purple

            disabled:pointer-events-none
            disabled:opacity-35
          "
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

function getVisiblePages(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
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
