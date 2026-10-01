import { History, SearchX } from "lucide-react";

type HistoryEmptyStateProps = {
  hasSearch: boolean;
};

export function HistoryEmptyState({ hasSearch }: HistoryEmptyStateProps) {
  const Icon = hasSearch ? SearchX : History;

  return (
    <div
      className="
        mt-10
        flex
        min-h-[320px]
        flex-col
        items-center
        justify-center
        rounded-[1.75rem]
        border
        border-dashed
        border-border/70
        px-6
        text-center
      "
    >
      <div
        className="
          flex
          size-12
          items-center
          justify-center
          rounded-2xl
          bg-mecho-purple-soft/50
          text-mecho-purple
        "
      >
        <Icon className="size-5" />
      </div>

      <h2
        className="
          mt-5
          text-xl
          font-semibold
          tracking-[-0.03em]
        "
      >
        {hasSearch ? "No matching generations" : "No generation history yet"}
      </h2>

      <p
        className="
          mt-2
          max-w-sm
          text-sm
          leading-6
          text-muted-foreground
        "
      >
        {hasSearch
          ? "Try another project name, workflow or search term."
          : "Your Social, Campaign and Speech generations will appear here."}
      </p>
    </div>
  );
}
