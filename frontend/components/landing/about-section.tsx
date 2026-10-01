"use client";

import { motion } from "motion/react";

export function AboutSection() {
  return (
    <section
      id="about"
      className="
        relative
        scroll-mt-24
        overflow-hidden
        bg-[#fbf9ff]
        py-24
        text-foreground
        sm:py-28
        lg:scroll-mt-28
        lg:py-32
        dark:bg-[#12091f]
        dark:text-white
      "
    >
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-[-9rem] top-[8%]
          h-80 w-80
          rounded-full
          bg-mecho-purple/30
          blur-[140px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute bottom-[-5rem] right-[-7rem]
          h-80 w-80
          rounded-full
          bg-mecho-orange/20
          blur-[140px]
        "
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="
            grid
            gap-16
            lg:grid-cols-[0.9fr_1.1fr]
            lg:items-center
            lg:gap-24
          "
        >
          {/* Left */}
          <div>
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#c8a7ff]
              "
            >
              About Mecho
            </p>

            <h2
              className="
                mt-5
                text-5xl
                font-semibold
                leading-[0.95]
                tracking-[-0.055em]
                sm:text-6xl
                lg:text-[5.2rem]
              "
            >
              Message
              <span className="text-mecho-orange"> + </span>
              Echo.
            </h2>

            <p
              className="
                mt-7
                max-w-xl
                text-lg
                leading-8
                text-muted-foreground
                dark:text-white/65
                sm:text-xl
              "
            >
              That&apos;s where Mecho gets its name.
            </p>
          </div>

          {/* Right */}
          <div>
            <motion.p
              initial={{
                opacity: 0,
                y: 18,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.35,
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                max-w-2xl
                text-2xl
                font-medium
                leading-[1.45]
                tracking-[-0.03em]
                text-foreground
                dark:text-white
                sm:text-3xl
                lg:text-[2.1rem]
              "
            >
              What you want to say is only the beginning.
            </motion.p>

            <motion.p
              initial={{
                opacity: 0,
                y: 18,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.35,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                mt-7
                max-w-2xl
                text-base
                leading-8
                text-foreground
                dark:text-white/60
                sm:text-lg
              "
            >
              Mecho helps turn a goal, message, product or rough thought into
              something made for the people you want to reach. It can shape the
              content, adapt the language, give it a voice, and carry the same
              direction into visuals and video.
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 16,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.4,
              }}
              transition={{
                duration: 0.65,
                delay: 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                mt-10
                border-l-2
                border-mecho-orange
                pl-5
              "
            >
              <p
                className="
                  max-w-xl
                  text-lg
                  font-medium
                  leading-8
                  text-foreground
                  dark:text-white/85
                "
              >
                One direction. Many ways to reach people.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Echo visualization */}
        <div
          className="
            relative
            mt-20
            overflow-hidden
            border-t
            border-border/70
            pt-14
            dark:border-white/10
            sm:mt-24
            sm:pt-16
          "
        >
          <div className="flex items-center justify-center">
            <div
              className="
                relative
                flex h-[230px]
                w-full
                max-w-3xl
                items-center
                justify-center
                sm:h-[280px]
              "
            >
              {/* Rings */}
              {[0, 1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  animate={{
                    scale: [0.75, 1.15],
                    opacity: [0.35, 0],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    delay: ring * 0.65,
                    ease: "easeOut",
                  }}
                  className="
                    absolute
                    h-28 w-28
                    rounded-full
                    border
                    border-mecho-purple/50
                    sm:h-36
                    sm:w-36
                  "
                />
              ))}

              {/* Center */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(111,44,255,0)",
                    "0 0 45px rgba(111,44,255,0.25)",
                    "0 0 0 rgba(111,44,255,0)",
                  ],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  relative z-10
                  flex size-24
                  items-center
                  justify-center
                  rounded-full
                  border border-border/70
                  bg-background/70
                  backdrop-blur-xl
                  dark:border-white/10
                  dark:bg-white/5
                  sm:size-28
                "
              >
                <span
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-muted-foreground
                    dark:text-white
                  "
                >
                  Mecho
                </span>
              </motion.div>

              {/* Left label */}
              <div
                className="
                  absolute
                  left-0
                  top-1/2
                  -translate-y-1/2
                  sm:left-[8%]
                "
              >
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-muted-foreground/70
                    dark:text-white/35
                  "
                >
                  Message
                </p>
              </div>

              {/* Right label */}
              <div
                className="
                  absolute
                  right-0
                  top-1/2
                  -translate-y-1/2
                  sm:right-[8%]
                "
              >
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-mecho-orange
                  "
                >
                  Echo
                </p>
              </div>
            </div>
          </div>

          <p
            className="
              mx-auto
              mt-2
              max-w-2xl
              text-center
              text-sm
              leading-7
              text-muted-foreground/70
              dark:text-white/45
              sm:text-base
            "
          >
            Start with what you have. Mecho helps turn it into something that
            can travel further.
          </p>
        </div>
      </div>
    </section>
  );
}
