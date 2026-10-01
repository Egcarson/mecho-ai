"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { ArrowRight, Clock3, Loader2 } from "lucide-react";

import { getGenerationHistory, type HistoryItem } from "@/lib/history";

import { RecentWorkItem } from "./recent-work-item";

export function RecentWork() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setFailed(false);

      try {
        const response = await getGenerationHistory({
          page: 1,
          limit: 4,
        });

        if (cancelled) {
          return;
        }

        setItems(response.items);
      } catch {
        if (!cancelled) {
          setFailed(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && !failed && !items.length) {
    return null;
  }

  return (
    <section
      className="
        mx-auto
        mt-16
        w-full
        max-w-4xl

        sm:mt-20
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
              tracking-[0.16em]
              text-muted-foreground
            "
          >
            Recent work
          </p>

          <h2
            className="
              mt-2
              text-xl
              font-semibold
              tracking-[-0.03em]
              text-foreground

              sm:text-2xl
            "
          >
            Pick up where you left off
          </h2>
        </div>

        {!loading && !failed && items.length > 0 && (
          <Link
            href="/dashboard/history"
            className="
                hidden
                shrink-0
                items-center
                gap-1.5
                text-sm
                font-medium
                text-muted-foreground
                transition-colors

                hover:text-mecho-purple

                sm:flex
              "
          >
            View history
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>

      <div
        className="
          mt-6
          overflow-hidden
          rounded-[1.5rem]
          border
          border-border/60
          bg-background/70
          p-1
          backdrop-blur-xl
        "
      >
        {loading && <LoadingState />}

        {!loading && failed && <ErrorState />}

        {!loading && !failed && items.length > 0 && (
          <div
            className="
                divide-y
                divide-border/50
              "
          >
            {items.map((item) => (
              <RecentWorkItem key={item.uid} item={item} />
            ))}
          </div>
        )}
      </div>

      {!loading && !failed && items.length > 0 && (
        <Link
          href="/dashboard/history"
          className="
              mt-4
              flex
              items-center
              justify-center
              gap-1.5
              text-sm
              font-medium
              text-muted-foreground
              transition-colors

              hover:text-mecho-purple

              sm:hidden
            "
        >
          View all history
          <ArrowRight className="size-3.5" />
        </Link>
      )}
    </section>
  );
}

function LoadingState() {
  return (
    <div
      className="
        flex
        min-h-[210px]
        items-center
        justify-center
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          text-sm
          text-muted-foreground
        "
      >
        <Loader2
          className="
            size-4
            animate-spin
          "
        />
        Loading recent work...
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div
      className="
        flex
        min-h-[180px]
        flex-col
        items-center
        justify-center
        px-6
        text-center
      "
    >
      <div
        className="
          flex
          size-10
          items-center
          justify-center
          rounded-full
          bg-muted
          text-muted-foreground
        "
      >
        <Clock3 className="size-4" />
      </div>

      <p
        className="
          mt-4
          text-sm
          font-medium
          text-foreground
        "
      >
        Recent work is unavailable right now.
      </p>

      <p
        className="
          mt-1
          text-xs
          text-muted-foreground
        "
      >
        Your dashboard is still ready for something new.
      </p>
    </div>
  );
}
