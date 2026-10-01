import { Clock3 } from "lucide-react";

import type { ProjectGeneration } from "@/lib/projects";

import { GenerationCard } from "./generation-card";

type GenerationListProps = {
  projectUid: string;
  generations: ProjectGeneration[];
};

export function GenerationList({
  projectUid,
  generations,
}: GenerationListProps) {
  return (
    <section className="mt-14">
      <div
        className="
          flex
          items-end
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.14em]
              text-muted-foreground
            "
          >
            History
          </p>

          <h2
            className="
              mt-2
              text-2xl
              font-semibold
              tracking-[-0.04em]
            "
          >
            Generations
          </h2>
        </div>

        {generations.length > 0 && (
          <p
            className="
              text-xs
              text-muted-foreground
            "
          >
            {generations.length} shown
          </p>
        )}
      </div>

      {generations.length === 0 ? (
        <div
          className="
            mt-6
            flex
            min-h-[240px]
            flex-col
            items-center
            justify-center
            rounded-[1.5rem]
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
              size-11
              items-center
              justify-center
              rounded-xl
              bg-muted/60
              text-muted-foreground
            "
          >
            <Clock3 className="size-5" />
          </div>

          <h3
            className="
              mt-4
              text-lg
              font-semibold
            "
          >
            No generations yet
          </h3>

          <p
            className="
              mt-2
              max-w-sm
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            Generated content for this project will appear here.
          </p>
        </div>
      ) : (
        <div
          className="
            mt-6
            grid
            gap-3
          "
        >
          {generations.map((generation, index) => (
            <GenerationCard
              key={generation.uid}
              projectUid={projectUid}
              generation={generation}
              number={generations.length - index}
            />
          ))}
        </div>
      )}
    </section>
  );
}
