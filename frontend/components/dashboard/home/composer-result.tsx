"use client";

import { ArrowRight } from "lucide-react";

import { motion } from "motion/react";

import { workflowResults, type WorkflowId } from "./dashboard-data";

type ComposerResultProps = {
  prompt: string;

  workflow: WorkflowId;

  onReset: () => void;

  onContinue: (workflow: WorkflowId) => void;
};

export function ComposerResult({
  prompt,
  workflow,
  onReset,
  onContinue,
}: ComposerResultProps) {
  const result = workflowResults[workflow];

  const ResultIcon = result.icon;

  return (
    <motion.div
      key="composer-result"
      initial={{
        opacity: 0,
        y: 14,
        scale: 0.985,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: -10,
        scale: 0.985,
      }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        relative
        overflow-hidden
        rounded-[2rem]
        border
        border-border/80
        bg-background/92
        shadow-[0_30px_100px_rgba(47,1,117,0.10)]
        backdrop-blur-2xl
      "
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              size-9
              items-center
              justify-center
              rounded-full
              bg-mecho-purple-soft
              text-xs
              font-bold
              text-mecho-purple
            "
          >
            M
          </div>

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.16em]
              text-mecho-purple
            "
          >
            Mecho
          </p>
        </div>

        <p
          className="
            mt-6
            max-w-2xl
            text-sm
            leading-6
            text-muted-foreground
          "
        >
          “{prompt}”
        </p>

        <div
          className="
            mt-7
            border-t
            border-border/70
            pt-7
          "
        >
          <p
            className="
              text-sm
              font-medium
              text-muted-foreground
            "
          >
            I know where I&apos;d start.
          </p>

          <div
            className="
              mt-5
              flex
              items-start
              gap-4
            "
          >
            <motion.div
              initial={{
                scale: 0.85,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                delay: 0.12,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                flex
                size-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-mecho-purple-soft
                text-mecho-purple
              "
            >
              <ResultIcon className="size-5" />
            </motion.div>

            <div>
              <h2
                className="
                  text-3xl
                  font-semibold
                  tracking-[-0.045em]
                  text-foreground
                "
              >
                {result.title}
              </h2>

              <p
                className="
                  mt-3
                  max-w-xl
                  text-[15px]
                  leading-7
                  text-muted-foreground
                "
              >
                {result.description}
              </p>
            </div>
          </div>

          <div
            className="
              mt-6
              flex
              flex-wrap
              gap-2
            "
          >
            {result.context.map((item, index) => (
              <motion.span
                key={item}
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.18 + index * 0.05,

                  duration: 0.35,
                }}
                className="
                    rounded-full
                    border
                    border-border/70
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-muted-foreground
                  "
              >
                {item}
              </motion.span>
            ))}
          </div>

          <div
            className="
              mt-8
              flex
              flex-col
              gap-3

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <button
              type="button"
              onClick={onReset}
              className="
                text-sm
                font-medium
                text-muted-foreground
                transition-colors

                hover:text-foreground
              "
            >
              Try something else
            </button>

            <button
              type="button"
              onClick={() => onContinue(workflow)}
              className="
                inline-flex
                h-11
                items-center
                justify-center
                rounded-full
                bg-mecho-gradient
                px-6
                text-sm
                font-semibold
                text-white
                shadow-[0_10px_28px_rgba(111,44,255,0.18)]
                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:shadow-[0_14px_36px_rgba(111,44,255,0.26)]
              "
            >
              Continue with {result.title}
              <ArrowRight className="ml-2 size-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
