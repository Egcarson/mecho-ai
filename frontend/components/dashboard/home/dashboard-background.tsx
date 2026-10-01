"use client";

import { motion } from "motion/react";

export function DashboardBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[12%]
          top-[18%]
          size-[420px]
          rounded-full
          bg-mecho-purple/8
          blur-[150px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[8%]
          right-[8%]
          size-[380px]
          rounded-full
          bg-mecho-orange/7
          blur-[150px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          hidden
          overflow-hidden
          select-none

          lg:block
        "
      >
        <motion.span
          animate={{
            x: [0, 26, 0],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-[3%]
            top-[19%]
            text-[8rem]
            font-bold
            leading-none
            tracking-[-0.08em]
            text-foreground/[0.018]
          "
        >
          CREATE
        </motion.span>

        <motion.span
          animate={{
            x: [0, -20, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            bottom-[14%]
            right-[2%]
            text-[9rem]
            font-bold
            leading-none
            tracking-[-0.08em]
            text-foreground/[0.018]
          "
        >
          ECHO
        </motion.span>
      </div>
    </>
  );
}
