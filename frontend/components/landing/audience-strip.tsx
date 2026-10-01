"use client";

import { motion } from "motion/react";

const audiences = [
  "Content Creators",
  "Founders",
  "Small Businesses",
  "Social Media Managers",
  "Agencies",
  "Personal Brands",
];

export function AudienceStrip() {
  const repeatedAudiences = [...audiences, ...audiences];

  return (
    <section
      className="
        relative
        overflow-hidden
        border-y border-border/70
        bg-background
        py-10
        sm:py-12
      "
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="mb-8 text-center">
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.18em]
              text-mecho-purple
            "
          >
            Made for people growing something
          </p>

          <p
            className="
              mx-auto mt-3
              max-w-2xl
              text-lg
              font-medium
              tracking-[-0.02em]
              text-foreground
              sm:text-xl
            "
          >
            Whether you know exactly what to say or need help figuring it out,
            Mecho helps you create marketing people notice and respond to.
          </p>
        </div>

        {/* Moving audience row */}
        <div className="relative overflow-hidden">
          {/* Left fade */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute inset-y-0 left-0 z-10
              w-16
              bg-gradient-to-r
              from-background
              to-transparent
              sm:w-28
            "
          />

          {/* Right fade */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute inset-y-0 right-0 z-10
              w-16
              bg-gradient-to-l
              from-background
              to-transparent
              sm:w-28
            "
          />

          <motion.div
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex w-max items-center"
          >
            {repeatedAudiences.map((audience, index) => (
              <div
                key={`${audience}-${index}`}
                className="flex shrink-0 items-center"
              >
                <span
                  className="
                    whitespace-nowrap
                    px-5
                    text-sm
                    font-medium
                    text-muted-foreground
                    sm:px-7
                    sm:text-base
                  "
                >
                  {audience}
                </span>

                <span
                  aria-hidden="true"
                  className="
                    shrink-0
                    text-sm
                    font-medium
                    text-border
                    sm:text-base
                  "
                >
                  |
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
