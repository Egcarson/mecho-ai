"use client";

import { ArrowRight } from "lucide-react";

import { motion } from "motion/react";

import { workflows, type WorkflowId } from "./dashboard-data";

type DirectWorkflowsProps = {
  onSelect: (workflow: WorkflowId) => void;
};

export function DirectWorkflows({ onSelect }: DirectWorkflowsProps) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
        delay: 0.18,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        mx-auto
        mt-16
        w-full
        max-w-4xl
        border-t
        border-border/60
        pt-8

        sm:mt-24
      "
    >
      <div
        className="
          flex
          flex-col
          gap-2

          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.16em]
              text-mecho-purple
            "
          >
            Or start directly
          </p>

          <h2
            className="
              mt-2
              text-xl
              font-semibold
              tracking-[-0.03em]
              text-foreground

              sm:text-2xl
            "
          >
            Already know what you want to create?
          </h2>
        </div>

        <p className="text-sm text-muted-foreground">
          Pick a workflow and jump straight in.
        </p>
      </div>

      <div
        className="
          mt-6
          grid
          gap-px
          overflow-hidden
          rounded-[1.5rem]
          border
          border-border/70
          bg-border/70

          md:grid-cols-3
        "
      >
        {workflows.map((workflow) => {
          const Icon = workflow.icon;

          return (
            <button
              key={workflow.id}
              type="button"
              onClick={() => onSelect(workflow.id)}
              className="
                  group
                  relative
                  bg-background
                  p-5
                  text-left
                  transition-colors
                  duration-300

                  hover:bg-muted/30

                  sm:p-6
                "
            >
              <div
                className="
                    flex
                    size-10
                    items-center
                    justify-center
                    rounded-full
                    bg-mecho-purple-soft
                    text-mecho-purple
                    transition-transform
                    duration-300

                    group-hover:scale-105
                  "
              >
                <Icon className="size-[18px]" />
              </div>

              <h3
                className="
                    mt-5
                    text-lg
                    font-semibold
                    tracking-[-0.025em]
                    text-foreground
                  "
              >
                {workflow.title}
              </h3>

              <p
                className="
                    mt-2
                    text-sm
                    leading-6
                    text-muted-foreground
                  "
              >
                {workflow.description}
              </p>

              <div
                className="
                    mt-5
                    flex
                    items-center
                    text-xs
                    font-medium
                    text-mecho-purple
                    opacity-0
                    transition-all
                    duration-300

                    group-hover:translate-x-1
                    group-hover:opacity-100
                  "
              >
                Start creating
                <ArrowRight className="ml-1.5 size-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
