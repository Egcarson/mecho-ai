"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

type DashboardEntryLoaderProps = {
  visible: boolean;
};

/**
 * Full dashboard entry splash.
 *
 * The layout stays physically stable after entry.
 * Motion is limited to soft opacity changes and a slow progress pass
 * so the loader feels calm rather than "galloping".
 */
export function DashboardEntryLoader({ visible }: DashboardEntryLoaderProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="dashboard-entry-loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-background px-6"
        >
          {/* Ambient Mecho glow — opacity only, no scale movement */}
          <motion.div
            aria-hidden="true"
            animate={{
              opacity: [0.18, 0.28, 0.18],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mecho-gradient blur-[120px] sm:h-[440px] sm:w-[440px]"
          />

          <div className="relative flex flex-col items-center text-center">
            {/* Logo shell */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 6,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex size-20 items-center justify-center rounded-[1.6rem] border border-border/60 bg-background/85 shadow-[0_24px_80px_rgba(47,1,117,0.10)] backdrop-blur-xl sm:size-24"
            >
              {/* Soft glow inside shell */}
              <motion.div
                aria-hidden="true"
                animate={{
                  opacity: [0.06, 0.12, 0.06],
                }}
                transition={{
                  duration: 3.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-[inherit] bg-mecho-gradient"
              />

              {/* Logo stays completely still */}
              <div className="relative flex items-center justify-center">
                <div className="relative size-10 sm:size-12">
                  <Image
                    src="/logo.svg"
                    alt="Mecho AI"
                    fill
                    priority
                    className="object-contain"
                    sizes="48px"
                  />
                </div>
              </div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{
                opacity: 0,
                y: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.32,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6"
            >
              <p className="text-sm font-semibold tracking-[0.22em] text-foreground">
                MECHO AI
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Preparing your creative workspace
              </p>
            </motion.div>

            {/* Calm progress indicator */}
            <div className="mt-7 h-[2px] w-28 overflow-hidden rounded-full bg-muted">
              <motion.div
                animate={{
                  x: ["-110%", "220%"],
                }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-full w-1/2 rounded-full bg-mecho-gradient"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
