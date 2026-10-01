import { FolderOpen } from "lucide-react";

type LibraryEmptyStateProps = {
  activeTab: "all" | "voice" | "image" | "video";
};

export function LibraryEmptyState({ activeTab }: LibraryEmptyStateProps) {
  const label =
    activeTab === "all"
      ? "generated media"
      : activeTab === "voice"
        ? "voice files"
        : activeTab === "image"
          ? "images"
          : "videos";

  return (
    <div
      className="
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
          bg-muted/60
          text-muted-foreground
        "
      >
        <FolderOpen className="size-5" />
      </div>

      <h2
        className="
          mt-5
          text-xl
          font-semibold
          tracking-[-0.03em]
        "
      >
        No {label} yet
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
        Once you generate content assets in Mecho, they’ll appear here.
      </p>
    </div>
  );
}
