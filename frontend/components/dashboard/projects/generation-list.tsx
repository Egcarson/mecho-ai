"use client";

import { useEffect, useState } from "react";

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
  const [visibleGenerations, setVisibleGenerations] = useState(generations);

  useEffect(() => {
    setVisibleGenerations(generations);
  }, [generations]);

  function handleDeleted(generationUid: string) {
    setVisibleGenerations((current) =>
      current.filter((generation) => generation.uid !== generationUid),
    );
  }

  if (visibleGenerations.length === 0) {
    return (
      <section className="mt-12">
        <div
          className="
            rounded-[1.5rem]
            border
            border-dashed
            border-border/70
            px-6
            py-14
            text-center
          "
        >
          <h2
            className="
              text-lg
              font-semibold
              tracking-[-0.025em]
            "
          >
            No generations yet
          </h2>

          <p
            className="
              mx-auto
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
      </section>
    );
  }

  return (
    <section className="mt-12">
      <div
        className="
          mb-5
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
              tracking-[-0.035em]
            "
          >
            Generations
          </h2>
        </div>

        <span
          className="
            text-xs
            text-muted-foreground
          "
        >
          {visibleGenerations.length}{" "}
          {visibleGenerations.length === 1 ? "generation" : "generations"}
        </span>
      </div>

      <div className="grid gap-3">
        {visibleGenerations.map((generation) => (
          <GenerationCard
            key={generation.uid}
            projectUid={projectUid}
            generation={generation}
            onDeleted={handleDeleted}
          />
        ))}
      </div>
    </section>
  );
}
