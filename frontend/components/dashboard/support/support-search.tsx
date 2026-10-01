"use client";

import { Search, X } from "lucide-react";

type SupportSearchProps = {
  value: string;

  onChange: (value: string) => void;
};

/**
 * SupportSearch
 *
 * This is intentionally client-side only.
 * The current FAQ/help dataset is small enough that server search
 * would add complexity without improving the experience.
 */
export function SupportSearch({ value, onChange }: SupportSearchProps) {
  return (
    <div
      className="
        relative
        mx-auto
        mt-8
        w-full
        max-w-2xl
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
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search help..."
        className="
          h-14
          w-full
          rounded-2xl
          border
          border-border/70
          bg-background/90
          pl-11
          pr-11
          text-sm
          outline-none
          shadow-[0_16px_50px_rgba(47,1,117,0.05)]
          backdrop-blur-xl
          transition-all

          placeholder:text-muted-foreground/60

          focus:border-mecho-purple/30
          focus:ring-4
          focus:ring-mecho-purple/5
        "
      />

      {value && (
        <button
          type="button"
          aria-label="Clear support search"
          onClick={() => onChange("")}
          className="
            absolute
            right-3
            top-1/2
            flex
            size-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            text-muted-foreground
            transition-colors

            hover:bg-muted
            hover:text-foreground
          "
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
