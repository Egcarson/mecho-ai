import { type LibraryItem } from "@/lib/library";

import { MediaLibraryCard } from "./media-library-card";

type LibraryGridProps = {
  items: LibraryItem[];
};

export function LibraryGrid({ items }: LibraryGridProps) {
  return (
    <div
      className="
        grid
        auto-rows-fr
        gap-5

        md:grid-cols-2

        xl:grid-cols-3
      "
    >
      {items.map((item) => (
        <MediaLibraryCard key={item.uid} item={item} />
      ))}
    </div>
  );
}
