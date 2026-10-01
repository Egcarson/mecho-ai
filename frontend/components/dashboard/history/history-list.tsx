import type { HistoryItem as HistoryItemType } from "@/lib/history";

import { HistoryEmptyState } from "./history-empty-state";

import { HistoryItem } from "./history-item";

type HistoryListProps = {
  items: HistoryItemType[];

  loading: boolean;

  hasSearch: boolean;
};

export function HistoryList({ items, loading, hasSearch }: HistoryListProps) {
  if (loading) {
    return (
      <div
        className="
          mt-8
          space-y-3
        "
      >
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="
                h-[150px]
                animate-pulse
                rounded-[1.35rem]
                border
                border-border/60
                bg-muted/25
              "
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <HistoryEmptyState hasSearch={hasSearch} />;
  }

  return (
    <div
      className="
        mt-8
        space-y-3
      "
    >
      {items.map((item) => (
        <HistoryItem key={item.uid} item={item} />
      ))}
    </div>
  );
}
