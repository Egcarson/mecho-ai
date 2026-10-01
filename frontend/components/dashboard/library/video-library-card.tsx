import { Clapperboard } from "lucide-react";

import type { LibraryItem } from "@/lib/library";

type VideoLibraryCardProps = {
  item: LibraryItem;
};

export function VideoLibraryCard({ item }: VideoLibraryCardProps) {
  return (
    <div
      className="
        rounded-[1.5rem]
        border
        border-border/70
        bg-background
        p-5
      "
    >
      <div
        className="
          flex
          size-11
          items-center
          justify-center
          rounded-2xl
          bg-muted
          text-muted-foreground
        "
      >
        <Clapperboard className="size-5" />
      </div>

      <h3 className="mt-4 text-base font-semibold">{item.project_name}</h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Video support is ready for when your backend video generation goes live.
      </p>
    </div>
  );
}
