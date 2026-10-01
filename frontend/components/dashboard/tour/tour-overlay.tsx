"use client";

import { motion } from "motion/react";

export type TourTargetRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type TourOverlayProps = {
  targetRect: TourTargetRect | null;
};

/**
 * TourOverlay
 *
 * For targeted steps, the highlighted rectangle itself creates the dark
 * backdrop using a very large box-shadow. That leaves a transparent
 * "window" around the active UI element.
 *
 * A separate transparent interaction layer prevents accidental clicks
 * on the dashboard while onboarding is active.
 */
export function TourOverlay({ targetRect }: TourOverlayProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className="
          fixed
          inset-0
          z-[80]
          cursor-default
        "
      />

      {targetRect ? (
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={{
            top: targetRect.top - 7,

            left: targetRect.left - 7,

            width: targetRect.width + 14,

            height: targetRect.height + 14,
          }}
          transition={{
            duration: 0.32,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            pointer-events-none
            fixed
            z-[81]
            rounded-[1.15rem]
            border
            border-white/20
          "
          style={{
            boxShadow:
              "0 0 0 9999px rgba(6, 3, 12, 0.72), 0 14px 60px rgba(111, 44, 255, 0.24)",
          }}
        />
      ) : (
        <motion.div
          aria-hidden="true"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="
            pointer-events-none
            fixed
            inset-0
            z-[81]
            bg-black/65
            backdrop-blur-[2px]
          "
        />
      )}
    </>
  );
}
