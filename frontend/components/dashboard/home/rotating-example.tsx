"use client";

import { AnimatePresence, motion } from "motion/react";

type RotatingExampleProps = {
  example: string;

  visible: boolean;

  onSelect: (example: string) => void;
};

export function RotatingExample({
  example,
  visible,
  onSelect,
}: RotatingExampleProps) {
  return (
    <div
      className="
        mt-5
        flex
        min-h-8
        items-center
        justify-center
        text-center
      "
    >
      <AnimatePresence mode="wait">
        {visible && (
          <motion.button
            key={example}
            type="button"
            onClick={() => onSelect(example)}
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
              y: -7,
              filter: "blur(4px)",
            }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              group
              text-sm
              text-muted-foreground
              transition-colors

              hover:text-foreground
            "
          >
            <span className="mr-1.5 text-muted-foreground/55">Try</span>

            <span
              className="
                border-b
                border-transparent
                transition-colors

                group-hover:border-mecho-purple/30
              "
            >
              “{example}”
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
