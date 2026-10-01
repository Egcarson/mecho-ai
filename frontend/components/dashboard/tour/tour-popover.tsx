"use client";

import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";

import { motion } from "motion/react";

import type { CSSProperties } from "react";

import type { DashboardTourStep } from "./tour-data";

import { TourProgress } from "./tour-progress";

type TourPopoverProps = {
  step: DashboardTourStep;

  stepNumber: number;
  totalSteps: number;

  isFirst: boolean;
  isLast: boolean;

  isCentered: boolean;

  style?: CSSProperties;

  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
};

/**
 * Pure presentation component.
 *
 * Position calculation and DOM target discovery deliberately live in
 * DashboardTour rather than here.
 */
export function TourPopover({
  step,
  stepNumber,
  totalSteps,
  isFirst,
  isLast,
  isCentered,
  style,
  onBack,
  onNext,
  onSkip,
  onComplete,
}: TourPopoverProps) {
  return (
    <motion.section
      key={step.id}
      initial={{
        opacity: 0,
        y: 12,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: 6,
        scale: 0.985,
      }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
      }}
      role="dialog"
      aria-modal="true"
      aria-label={step.title}
      className={`
        fixed
        z-[100]
        w-[calc(100vw-2rem)]
        max-w-[390px]
        overflow-hidden
        rounded-[1.6rem]
        border
        border-white/10
        bg-background/96
        shadow-[0_30px_100px_rgba(0,0,0,0.35)]
        backdrop-blur-2xl

        ${
          isCentered
            ? `
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
            `
            : ""
        }
      `}
      style={isCentered ? undefined : style}
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-14
          -top-14
          size-36
          rounded-full
          bg-mecho-purple/15
          blur-[50px]
        "
      />

      <div
        className="
          relative
          p-5

          sm:p-6
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <TourProgress current={stepNumber} total={totalSteps} />

          {!isLast && (
            <button
              type="button"
              onClick={onSkip}
              className="
                -mr-1
                -mt-1
                flex
                size-8
                items-center
                justify-center
                rounded-full
                text-muted-foreground
                transition-colors

                hover:bg-muted
                hover:text-foreground
              "
              aria-label="Skip tour"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <p
          className="
            mt-6
            text-[10px]
            font-bold
            uppercase
            tracking-[0.16em]
            text-mecho-purple
          "
        >
          {isLast ? "Ready" : `Step ${stepNumber} of ${totalSteps}`}
        </p>

        <h2
          className="
            mt-2
            text-2xl
            font-semibold
            tracking-[-0.04em]
          "
        >
          {step.title}
        </h2>

        <p
          className="
            mt-3
            text-sm
            leading-6
            text-muted-foreground
          "
        >
          {step.description}
        </p>

        <div
          className="
            mt-7
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <div>
            {!isFirst && (
              <button
                type="button"
                onClick={onBack}
                className="
                  inline-flex
                  h-10
                  items-center
                  gap-2
                  rounded-full
                  px-3
                  text-sm
                  font-medium
                  text-muted-foreground
                  transition-colors

                  hover:bg-muted
                  hover:text-foreground
                "
              >
                <ArrowLeft className="size-4" />
                Back
              </button>
            )}
          </div>

          {isLast ? (
            <button
              type="button"
              onClick={onComplete}
              className="
                inline-flex
                h-11
                items-center
                gap-2
                rounded-full
                bg-mecho-gradient
                px-5
                text-sm
                font-semibold
                text-white
                shadow-[0_12px_30px_rgba(111,44,255,0.25)]
              "
            >
              <Check className="size-4" />
              Start creating
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="
                inline-flex
                h-11
                items-center
                gap-2
                rounded-full
                bg-mecho-gradient
                px-5
                text-sm
                font-semibold
                text-white
                shadow-[0_12px_30px_rgba(111,44,255,0.25)]
              "
            >
              Next
              <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}
