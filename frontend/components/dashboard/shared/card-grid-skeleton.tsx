type CardGridSkeletonProps = {
  count?: number;
};

export function CardGridSkeleton({ count = 6 }: CardGridSkeletonProps) {
  return (
    <div
      className="
        grid
        gap-4

        sm:grid-cols-2

        xl:grid-cols-3
      "
    >
      {Array.from({
        length: count,
      }).map((_, index) => (
        <div
          key={index}
          className="
            rounded-[1.5rem]
            border
            border-border/60
            bg-background
            p-5
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <div
              className="
                size-10
                rounded-2xl
                bg-muted
              "
            />

            <div
              className="
                h-7
                w-16
                rounded-full
                bg-muted
              "
            />
          </div>

          <div
            className="
              mt-6
              h-5
              w-2/3
              rounded-full
              bg-muted
            "
          />

          <div
            className="
              mt-3
              h-3
              w-full
              rounded-full
              bg-muted/80
            "
          />

          <div
            className="
              mt-2
              h-3
              w-4/5
              rounded-full
              bg-muted/70
            "
          />

          <div
            className="
              mt-8
              flex
              items-center
              justify-between
            "
          >
            <div
              className="
                h-3
                w-20
                rounded-full
                bg-muted/60
              "
            />

            <div
              className="
                h-8
                w-20
                rounded-full
                bg-muted
              "
            />
          </div>
        </div>
      ))}
    </div>
  );
}
