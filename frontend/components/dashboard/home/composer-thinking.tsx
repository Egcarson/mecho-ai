"use client";

import { AnimatePresence, motion } from "motion/react";

import { thinkingMessages } from "./dashboard-data";

type ComposerThinkingProps = {
  prompt: string;
  thinkingStep: number;
};

export function ComposerThinking({
  prompt,
  thinkingStep,
}: ComposerThinkingProps) {
  return (
    <motion.div
      key="composer-thinking"
      initial={{
        opacity: 0,
        y: 10,
        scale: 0.985,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: -8,
        scale: 0.99,
        filter: "blur(4px)",
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        relative
        min-h-[205px]
        overflow-hidden
        rounded-[2rem]
        border
        border-border/80
        bg-background/92
        p-7
        shadow-[0_30px_100px_rgba(47,1,117,0.10)]
        backdrop-blur-2xl

        sm:min-h-[220px]
        sm:p-8
      "
    >
      <motion.div
        aria-hidden="true"
        animate={{
          x: ["-120%", "220%"],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          pointer-events-none
          absolute
          bottom-0
          top-0
          w-32
          rotate-12
          bg-gradient-to-r
          from-transparent
          via-mecho-purple/5
          to-transparent
          blur-xl
        "
      />

      <div
        className="
          relative
          flex
          min-h-[145px]
          flex-col
          items-center
          justify-center
          text-center
        "
      >
        <div
          className="
            relative
            flex
            size-11
            items-center
            justify-center
          "
        >
          <motion.span
            animate={{
              scale: [1, 1.9, 1.9],
              opacity: [0.24, 0, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="
              absolute
              inset-0
              rounded-full
              bg-mecho-purple
            "
          />

          <motion.div
            animate={{
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              relative
              z-10
              flex
              size-10
              items-center
              justify-center
              rounded-full
              bg-mecho-purple-soft
              text-sm
              font-bold
              text-mecho-purple
            "
          >
            M
          </motion.div>
        </div>

        <p
          className="
            mt-5
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-mecho-purple
          "
        >
          Mecho
        </p>

        <div className="mt-2 min-h-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={thinkingStep}
              initial={{
                opacity: 0,
                y: 7,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -6,
                filter: "blur(4px)",
              }}
              transition={{
                duration: 0.5,
              }}
              className="
                text-base
                font-medium
                tracking-[-0.02em]
                text-foreground

                sm:text-lg
              "
            >
              {thinkingMessages[thinkingStep]}
              ...
            </motion.p>
          </AnimatePresence>
        </div>

        <p
          className="
            mt-2
            max-w-md
            truncate
            text-xs
            text-muted-foreground
          "
        >
          “{prompt}”
        </p>
      </div>
    </motion.div>
  );
}
