// components/dashboard/create/workflow-shell.tsx

"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type WorkflowShellProps = {
  eyebrow: string;
  title: string;
  description?: string;

  step: number;
  totalSteps: number;

  children: ReactNode;

  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;

  canGoNext?: boolean;
  isLastStep?: boolean;

  nextLabel?: string;
  submitLabel?: string;
};

export function WorkflowShell({
  eyebrow,
  title,
  description,

  step,
  totalSteps,

  children,

  onPrevious,
  onNext,
  onSubmit,

  canGoNext = true,
  isLastStep = false,

  nextLabel = "Next",
  submitLabel = "Generate",
}: WorkflowShellProps) {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-background
        text-foreground
      "
    >
      {/* ambient */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[8%]
          top-[16%]
          size-[340px]
          rounded-full
          bg-mecho-purple/8
          blur-[140px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[8%]
          right-[8%]
          size-[300px]
          rounded-full
          bg-mecho-orange/7
          blur-[140px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          max-w-4xl
          flex-col
          px-4
          pb-10
          pt-10

          sm:px-6
          sm:pt-12

          lg:px-8
          lg:pt-14
        "
      >
        {/* top */}
        <div className="flex items-center justify-between gap-4">
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
              {eyebrow}
            </p>
          </div>

          <p className="text-xs font-medium text-muted-foreground">
            {step + 1} of {totalSteps}
          </p>
        </div>

        {/* progress */}
        <div className="mt-5 h-px w-full bg-border/60">
          <motion.div
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-px bg-mecho-gradient"
          />
        </div>

        {/* question area */}
        <div
          className="
            flex
            flex-1
            items-center
            py-10

            sm:py-14
          "
        >
          <motion.div
            key={step}
            initial={{
              opacity: 0,
              y: 18,
              filter: "blur(4px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: -12,
              filter: "blur(4px)",
            }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full"
          >
            <h1
              className="
                max-w-3xl
                text-4xl
                font-semibold
                leading-[1.04]
                tracking-[-0.055em]

                sm:text-5xl

                lg:text-[3.6rem]
              "
            >
              {title}
            </h1>

            {description && (
              <p
                className="
                  mt-5
                  max-w-xl
                  text-base
                  leading-7
                  text-muted-foreground

                  sm:text-lg
                "
              >
                {description}
              </p>
            )}

            <div className="mt-9">{children}</div>
          </motion.div>
        </div>

        {/* bottom actions */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            border-t
            border-border/60
            pt-5
          "
        >
          <div>
            {step > 0 && onPrevious && (
              <button
                type="button"
                onClick={onPrevious}
                className="
                  inline-flex
                  h-11
                  items-center
                  gap-2
                  rounded-full
                  px-4

                  text-sm
                  font-medium
                  text-muted-foreground

                  transition-colors

                  hover:bg-muted/50
                  hover:text-foreground
                "
              >
                <ArrowLeft className="size-4" />
                Previous
              </button>
            )}
          </div>

          {!isLastStep ? (
            <button
              type="button"
              onClick={onNext}
              disabled={!canGoNext}
              className="
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
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

                disabled:pointer-events-none
                disabled:opacity-40
              "
            >
              {nextLabel}

              <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              disabled={!canGoNext}
              className="
                inline-flex
                h-11
                items-center
                justify-center
                rounded-full
                bg-mecho-gradient
                px-7

                text-sm
                font-semibold
                text-white

                shadow-[0_10px_28px_rgba(111,44,255,0.18)]

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:shadow-[0_14px_36px_rgba(111,44,255,0.26)]

                disabled:pointer-events-none
                disabled:opacity-40
              "
            >
              {submitLabel}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
