type ListSkeletonProps = {
  rows?: number;
};

export function ListSkeleton({ rows = 6 }: ListSkeletonProps) {
  return (
    <div
      className="
        overflow-hidden
        rounded-[1.5rem]
        border
        border-border/60
        bg-background
      "
    >
      {Array.from({
        length: rows,
      }).map((_, index) => (
        <div
          key={index}
          className="
            flex
            items-center
            gap-4
            border-b
            border-border/50
            px-4
            py-5

            last:border-b-0

            sm:px-5
          "
        >
          <div
            className="
              size-11
              shrink-0
              rounded-2xl
              bg-muted
            "
          />

          <div className="min-w-0 flex-1">
            <div
              className="
                h-4
                w-40
                rounded-full
                bg-muted
              "
            />

            <div
              className="
                mt-3
                h-3
                w-full
                max-w-lg
                rounded-full
                bg-muted/80
              "
            />

            <div
              className="
                mt-3
                h-3
                w-24
                rounded-full
                bg-muted/60
              "
            />
          </div>

          <div
            className="
              size-8
              shrink-0
              rounded-full
              bg-muted
            "
          />
        </div>
      ))}
    </div>
  );
}
