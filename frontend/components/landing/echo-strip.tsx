"use client";

import { motion } from "motion/react";

const echoItems = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "X",
  "English",
  "Pidgin",
  "Hausa",
  "Yoruba",
  "Igbo",
];

export function EchoStrip() {
  const items = [...echoItems, ...echoItems];

  return (
    <div className="relative mt-7 max-w-xl overflow-hidden">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />

      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        className="flex w-max items-center gap-3"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="
              flex shrink-0 items-center gap-2
              rounded-full border border-border/70
              bg-background/80
              px-4 py-2
              text-sm font-medium
              text-muted-foreground
              shadow-sm
              backdrop-blur-md
              transition-colors
              hover:border-mecho-purple/30
              hover:text-mecho-purple
            "
          >
            <span
              className="
                size-1.5 rounded-full
                bg-mecho-gradient
              "
            />

            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
