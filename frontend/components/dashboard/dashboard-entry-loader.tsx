"use client";

import { AnimatePresence, motion } from "motion/react";

import { MechoLogo } from "@/components/brand/mecho-logo";

type DashboardEntryLoaderProps = {
  visible: boolean;
};

/**
 * Full dashboard entry splash.
 *
 * This loader is controlled by DashboardLayout rather than Next.js'
 * route loading boundary so that:
 *
 * - it appears consistently on a hard refresh / dashboard entry;
 * - it can remain visible for a deliberate minimum duration;
 * - it fades out smoothly;
 * - it does not restart during normal dashboard navigation.
 */
export function DashboardEntryLoader({ visible }: DashboardEntryLoaderProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="dashboard-entry-loader"
          initial={{
            opacity: 1,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            fixed
            inset-0
            z-[200]
            flex
            items-center
            justify-center
            overflow-hidden
            bg-background
            px-6
          "
        >
          {/* Ambient Mecho glow */}

          <motion.div
            aria-hidden="true"
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.35, 0.55, 0.35],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              left-1/2
              top-1/2
              h-[340px]
              w-[340px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-mecho-gradient
              opacity-30
              blur-[110px]

              sm:h-[440px]
              sm:w-[440px]
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              items-center
              text-center
            "
          >
            {/* Logo shell */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.88,
                y: 8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                flex
                size-20
                items-center
                justify-center
                rounded-[1.6rem]
                border
                border-border/60
                bg-background/85
                shadow-[0_24px_80px_rgba(47,1,117,0.12)]
                backdrop-blur-xl

                sm:size-24
              "
            >
              <motion.div
                aria-hidden="true"
                animate={{
                  opacity: [0.08, 0.18, 0.08],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  inset-0
                  rounded-[inherit]
                  bg-mecho-gradient
                "
              />

              <motion.div
                animate={{
                  scale: [1, 1.045, 1],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  relative
                  flex
                  items-center
                  justify-center
                "
              >
                <MechoLogo
                  className="
                    h-10
                    w-auto

                    sm:h-12
                  "
                />
              </motion.div>
            </motion.div>

            {/* Brand name */}

            <motion.div
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.45,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6"
            >
              <p
                className="
                  text-sm
                  font-semibold
                  tracking-[0.22em]
                  text-foreground
                "
              >
                MECHO AI
              </p>

              <p
                className="
                  mt-2
                  text-xs
                  text-muted-foreground
                "
              >
                Preparing your creative workspace
              </p>
            </motion.div>

            {/* Tiny progress indicator */}

            <div
              className="
                mt-7
                h-[2px]
                w-28
                overflow-hidden
                rounded-full
                bg-muted
              "
            >
              <motion.div
                animate={{
                  x: ["-100%", "150%"],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  h-full
                  w-1/2
                  rounded-full
                  bg-mecho-gradient
                "
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
