type ReviewRowProps = {
  label: string;
  value: string;
  last?: boolean;
};

export function ReviewRow({ label, value, last = false }: ReviewRowProps) {
  return (
    <div
      className={`
        grid
        gap-2
        px-5
        py-4

        sm:grid-cols-[140px_1fr]

        ${last ? "" : "border-b border-border/60"}
      `}
    >
      <p
        className="
          text-xs
          font-semibold
          uppercase
          tracking-[0.12em]
          text-muted-foreground
        "
      >
        {label}
      </p>

      <p
        className="
          text-sm
          leading-6
          text-foreground
        "
      >
        {value}
      </p>
    </div>
  );
}
