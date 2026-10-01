type TourProgressProps = {
  current: number;
  total: number;
};

export function TourProgress({ current, total }: TourProgressProps) {
  return (
    <div
      className="
        flex
        items-center
        gap-1.5
      "
      aria-label={`Tour step ${current} of ${total}`}
    >
      {Array.from({
        length: total,
      }).map((_, index) => {
        const active = index <= current - 1;

        return (
          <span
            key={index}
            className={`
                h-1
                rounded-full
                transition-all
                duration-300

                ${
                  active
                    ? `
                      w-5
                      bg-mecho-purple
                    `
                    : `
                      w-2
                      bg-border
                    `
                }
              `}
          />
        );
      })}
    </div>
  );
}
