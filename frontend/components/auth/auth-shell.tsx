"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import {
  AudioLines,
  Clapperboard,
  Images,
  MessageSquareText,
} from "lucide-react";

import { MechoLogo } from "@/components/brand/mecho-logo";
import { ThemeToggle } from "@/components/theme-toggle";

type AuthShellProps = {
  children: React.ReactNode;
  mode?: "login" | "signup" | "neutral";
};

const capabilities = [
  {
    label: "Content",
    icon: MessageSquareText,
  },
  {
    label: "Voice",
    icon: AudioLines,
  },
  {
    label: "Visuals",
    icon: Images,
  },
  {
    label: "Video",
    icon: Clapperboard,
  },
];

export function AuthShell({ children, mode = "neutral" }: AuthShellProps) {
  const [activeCapability, setActiveCapability] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveCapability((current) => (current + 1) % capabilities.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, []);

  const ActiveIcon = capabilities[activeCapability].icon;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        {/* Brand side */}
        <section
          className="
            relative
            hidden
            overflow-hidden
            border-r border-border/60
            bg-[#fbf9ff]
            px-10 py-10
            text-foreground

            dark:bg-[#12091f]
            dark:text-white

            lg:flex
            lg:flex-col
            lg:justify-between

            xl:px-14
          "
        >
          {/* Ambient purple */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute left-[10%] top-[28%]
              size-[360px]
              rounded-full
              bg-mecho-purple/10
              blur-[140px]

              dark:bg-mecho-purple/20
            "
          />

          {/* Ambient orange */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute bottom-[-7rem] right-[-5rem]
              size-80
              rounded-full
              bg-mecho-orange/10
              blur-[140px]

              dark:bg-mecho-orange/15
            "
          />

          {/* Oversized background word */}
          <div
            aria-hidden="true"
            className="
    pointer-events-none
    absolute
    left-1/2 top-1/2
    -translate-x-1/2
    -translate-y-1/2
    select-none
    whitespace-nowrap
  "
          >
            {/* Upper far blur */}
            <motion.span
              animate={{
                y: [-4, -10, -4],
                opacity: [0.06, 0.12, 0.06],
              }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
      absolute
      left-1/2
      top-1/2
      -translate-x-1/2
      -translate-y-[145%]

      text-[8.5rem]
      font-bold
      leading-none
      tracking-[-0.09em]

      text-mecho-purple/20
      blur-[8px]

      dark:text-white/10

      xl:text-[11rem]
      2xl:text-[13rem]
    "
            >
              MECHO
            </motion.span>

            {/* Upper near blur */}
            <motion.span
              animate={{
                y: [-2, -6, -2],
                opacity: [0.08, 0.16, 0.08],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.15,
              }}
              className="
      absolute
      left-1/2
      top-1/2
      -translate-x-1/2
      -translate-y-[112%]

      text-[8.5rem]
      font-bold
      leading-none
      tracking-[-0.09em]

      text-mecho-purple/16
      blur-[4px]

      dark:text-white/8

      xl:text-[11rem]
      2xl:text-[13rem]
    "
            >
              MECHO
            </motion.span>

            {/* Main sharp word */}
            <motion.span
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
      relative
      z-10
      block

      text-[8.5rem]
      font-bold
      leading-none
      tracking-[-0.09em]

      text-mecho-purple/[0.07]

      dark:text-white/[0.045]

      xl:text-[11rem]
      2xl:text-[13rem]
    "
            >
              MECHO
            </motion.span>

            {/* Lower near blur */}
            <motion.span
              animate={{
                y: [2, 6, 2],
                opacity: [0.08, 0.16, 0.08],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.15,
              }}
              className="
      absolute
      left-1/2
      top-1/2
      -translate-x-1/2
      translate-y-[12%]

      text-[8.5rem]
      font-bold
      leading-none
      tracking-[-0.09em]

      text-mecho-purple/16
      blur-[4px]

      dark:text-white/8

      xl:text-[11rem]
      2xl:text-[13rem]
    "
            >
              MECHO
            </motion.span>

            {/* Lower far blur */}
            <motion.span
              animate={{
                y: [4, 10, 4],
                opacity: [0.06, 0.12, 0.06],
              }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                translate-y-[45%]

                text-[8.5rem]
                font-bold
                leading-none
                tracking-[-0.09em]

                text-mecho-purple/20
                blur-[8px]

                dark:text-white/10

                xl:text-[11rem]
                2xl:text-[13rem]
              "
            >
              MECHO
            </motion.span>
          </div>

          {/* Top */}
          <div className="relative z-20 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="Mecho AI home"
            >
              <MechoLogo className="h-8 w-auto" />

              <span
                className="
                  text-xl
                  font-semibold
                  tracking-[-0.04em]
                  text-foreground
                  dark:text-white
                "
              >
                Mecho AI
              </span>
            </Link>

            <ThemeToggle />
          </div>

          {/* Main visual */}
          <div
            className="
              relative z-10
              mx-auto
              flex w-full
              max-w-[500px]
              items-center
              justify-center
            "
          >
            {/* Floating centerpiece */}
            <motion.div
              animate={{
                y: [-9, 9, -9],
                rotate: [-0.4, 0.4, -0.4],
              }}
              transition={{
                y: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="
                relative
                w-full
                max-w-[390px]
              "
            >
              {/* Main glass card */}
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[2rem]
                  border border-border/70
                  bg-background/75
                  p-7
                  shadow-[0_30px_80px_rgba(47,1,117,0.10)]
                  backdrop-blur-2xl

                  dark:border-white/10
                  dark:bg-white/[0.055]
                "
              >
                {/* subtle internal glow */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute -right-14 -top-14
                    size-40
                    rounded-full
                    bg-mecho-purple/10
                    blur-[70px]
                  "
                />

                <div className="relative">
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-mecho-purple
                    "
                  >
                    Your message, amplified
                  </p>

                  <h1
                    className="
                      mt-4
                      text-[2.5rem]
                      font-semibold
                      leading-[0.98]
                      tracking-[-0.055em]
                      text-foreground

                      dark:text-white
                      xl:text-[3rem]
                    "
                  >
                    Say it your way.
                    <br />
                    <span className="text-mecho-gradient">Make it land.</span>
                  </h1>

                  {/* capability transition */}
                  <div
                    className="
                      mt-8
                      flex items-center
                      border-t border-border/70
                      pt-5

                      dark:border-white/10
                    "
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={capabilities[activeCapability].label}
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: -8,
                        }}
                        transition={{
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="
                          flex items-center
                          gap-3
                        "
                      >
                        <div
                          className="
                            flex size-9
                            items-center
                            justify-center
                            rounded-full
                            bg-mecho-purple-soft
                            text-mecho-purple
                          "
                        >
                          <ActiveIcon className="size-4" />
                        </div>

                        <div>
                          <p
                            className="
                              text-[10px]
                              font-medium
                              uppercase
                              tracking-[0.13em]
                              text-muted-foreground
                              dark:text-white/40
                            "
                          >
                            Creating
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-sm
                              font-semibold
                              text-foreground
                              dark:text-white
                            "
                          >
                            {capabilities[activeCapability].label}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* indicators */}
                    <div className="ml-auto flex items-center gap-1.5">
                      {capabilities.map((capability, index) => (
                        <span
                          key={capability.label}
                          className={`
                              h-1
                              rounded-full
                              transition-all
                              duration-500

                              ${
                                activeCapability === index
                                  ? "w-5 bg-mecho-gradient"
                                  : "w-1 bg-border dark:bg-white/15"
                              }
                            `}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* floating top label */}
              <motion.div
                animate={{
                  y: [4, -5, 4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  -right-5
                  -top-5
                  rounded-full
                  border border-border/70
                  bg-background/85
                  px-4 py-2
                  text-[11px]
                  font-medium
                  text-muted-foreground
                  shadow-[0_12px_35px_rgba(47,1,117,0.08)]
                  backdrop-blur-xl

                  dark:border-white/10
                  dark:bg-[#1b1026]/90
                  dark:text-white/55
                "
              >
                Content that connects
              </motion.div>

              {/* floating bottom label */}
              <motion.div
                animate={{
                  y: [-3, 5, -3],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  -bottom-5
                  -left-5
                  rounded-full
                  border border-border/70
                  bg-background/85
                  px-4 py-2
                  text-[11px]
                  font-medium
                  text-muted-foreground
                  shadow-[0_12px_35px_rgba(47,1,117,0.08)]
                  backdrop-blur-xl

                  dark:border-white/10
                  dark:bg-[#1b1026]/90
                  dark:text-white/55
                "
              >
                Built around your audience
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom */}
          <p
            className="
              relative z-10
              text-xs
              text-muted-foreground
              dark:text-white/35
            "
          >
            © {new Date().getFullYear()} Mecho AI
          </p>
        </section>

        {/* Form side */}
        <section
          className="
            relative
            flex min-h-screen
            items-center
            justify-center
            bg-background
            px-4 py-8

            sm:px-6
            lg:px-10
            xl:px-16
          "
        >
          {/* Mobile header */}
          <div
            className="
              absolute
              left-4 right-4 top-5
              z-20
              flex items-center
              justify-between
              gap-4

              sm:left-6
              sm:right-6

              lg:hidden
            "
          >
            {/* <Link
            href="#home"
            aria-label="Mecho AI home"
            className="
              flex
              items-center
              gap-2.5
            "
          >
            <MechoLogo className="h-8 w-auto" />

            <span
              className="
                hidden
                text-[22px]
                font-semibold
                tracking-[-0.04em]

                sm:inline
              "
            >
              Mecho AI
            </span>
          </Link> */}

            <div className="shrink-0">
              <ThemeToggle />
            </div>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              w-full
              max-w-[520px]
              pt-16
              lg:pt-0
            "
          >
            {children}

            {/* Auth switch — only login/signup */}
            {mode === "login" && (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                New to Mecho?
                <Link
                  href="/signup"
                  className="
                    ml-1.5
                    font-semibold
                    text-mecho-purple
                    transition-opacity
                    hover:opacity-75
                  "
                >
                  Create an account
                </Link>
              </p>
            )}

            {mode === "signup" && (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?
                <Link
                  href="/login"
                  className="
                    ml-1.5
                    font-semibold
                    text-mecho-purple
                    transition-opacity
                    hover:opacity-75
                  "
                >
                  Log in
                </Link>
              </p>
            )}
          </motion.div>
        </section>
      </div>
    </main>
  );
}
