import { MessageSquareText } from "lucide-react";

type UnsupportedGenerationViewProps = {
  workflow: string;
};

export function UnsupportedGenerationView({
  workflow,
}: UnsupportedGenerationViewProps) {
  return (
    <div
      className="
        mt-10
        flex
        min-h-[280px]
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
        <MessageSquareText className="size-5" />
      </div>

      <h2
        className="
          mt-5
          text-xl
          font-semibold
          tracking-[-0.03em]
        "
      >
        {formatLabel(workflow)} viewer coming next
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
        This generation is saved. We’ll connect its dedicated result view once
        that workflow is built.
      </p>
    </div>
  );
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
