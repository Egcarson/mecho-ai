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
      {/* =====================================================
          AMBIENT BRAND GLOWS
      ====================================================== */}

      <motion.div
        aria-hidden="true"
        animate={{
          x: ["-3%", "4%", "-3%"],
          y: ["0%", "3%", "0%"],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          left-[-9rem]
          top-[8%]
          h-80
          w-80
          rounded-full
          bg-mecho-purple/30
          blur-[140px]
        "
      />

      <motion.div
        aria-hidden="true"
        animate={{
          x: ["3%", "-3%", "3%"],
          y: ["2%", "-2%", "2%"],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          bottom-[-5rem]
          right-[-7rem]
          h-80
          w-80
          rounded-full
          bg-mecho-orange/20
          blur-[140px]
        "
      />

      {/* Large background brand word */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[46%]
          -translate-x-1/2
          -translate-y-1/2
          select-none
          whitespace-nowrap
          text-[8rem]
          font-semibold
          tracking-[-0.09em]
          text-foreground/[0.018]

          sm:text-[12rem]

          lg:text-[18rem]

          dark:text-white/[0.018]
        "
      >
        MECHO
      </span>

      <div
        className="
          relative
          mx-auto
          max-w-7xl
          px-4

          sm:px-6

          lg:px-8
        "
      >
        {/* =====================================================
            BRAND STORY
        ====================================================== */}

        <div
          className="
            grid
            gap-14

            lg:grid-cols-[0.95fr_1.05fr]
            lg:items-end
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
              About the name
            </p>

            <h2
              className="
                mt-5
                text-5xl
                font-semibold
                leading-[0.94]
                tracking-[-0.06em]

                sm:text-6xl

                lg:text-[5.4rem]
              "
            >
              Message
              <span className="text-mecho-orange"> + </span>
              <span className="text-mecho-gradient">Echo.</span>
            </h2>

            <p
              className="
                mt-7
                max-w-lg
                text-lg
                leading-8
                text-muted-foreground

                sm:text-xl

                dark:text-white/60
              "
            >
              That&apos;s where Mecho gets its name.
            </p>
          </div>

          {/* Right */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              max-w-2xl

              lg:pb-2
            "
          >
            <p
              className="
                text-3xl
                font-medium
                leading-[1.12]
                tracking-[-0.045em]

                sm:text-4xl

                lg:text-[3rem]
              "
            >
              A message begins somewhere.
              <br />
              <span
                className="
                  text-muted-foreground

                  dark:text-white/45
                "
              >
                An echo carries it further.
              </span>
            </p>

            <div
              className="
                mt-8
                flex
                items-center
                gap-3
                text-sm
                font-medium
                text-muted-foreground

                dark:text-white/45
              "
            >
              <span>Message</span>

              <span
                className="
                  h-px
                  w-10
                  bg-border

                  dark:bg-white/15
                "
              />

              <span
                className="
                  font-semibold
                  text-foreground

                  dark:text-white
                "
              >
                Mecho
              </span>

              <span
                className="
                  h-px
                  w-10
                  bg-border

                  dark:bg-white/15
                "
              />

              <span className="text-mecho-orange">Echo</span>
            </div>
          </motion.div>
        </div>

        {/* =====================================================
            ECHO VISUAL
        ====================================================== */}

        <div
          className="
            relative
            mt-20
            overflow-hidden
            border-t
            border-border/70
            pt-14

            sm:mt-24
            sm:pt-16

            dark:border-white/10
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
            "
          >
            <div
              className="
                relative
                flex
                h-[250px]
                w-full
                max-w-4xl
                items-center
                justify-center

                sm:h-[300px]
              "
            >
              {/* Echo rings */}

              {[0, 1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  animate={{
                    scale: [0.72, 1.2],
                    opacity: [0.32, 0],
                  }}
                  transition={{
                    duration: 3.8,
                    repeat: Infinity,
                    delay: ring * 0.8,
                    ease: "easeOut",
                  }}
                  className="
                      absolute
                      h-28
                      w-28
                      rounded-full
                      border
                      border-mecho-purple/45

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
                    "0 0 50px rgba(111,44,255,0.20)",
                    "0 0 0 rgba(111,44,255,0)",
                  ],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  relative
                  z-10
                  flex
                  size-24
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-border/70
                  bg-background/75
                  backdrop-blur-xl

                  sm:size-28

                  dark:border-white/10
                  dark:bg-white/5
                "
              >
                <span
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-foreground

                    dark:text-white
                  "
                >
                  Mecho
                </span>
              </motion.div>

              {/* Message label */}

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

              {/* Echo label */}

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

          {/* One closing line only */}

          <p
            className="
              mx-auto
              mt-2
              max-w-xl
              text-center
              text-base
              font-medium
              leading-7
              tracking-[-0.02em]
              text-foreground

              sm:text-lg

              dark:text-white/75
            "
          >
            One message.
            <span className="text-mecho-gradient">
              {" "}
              More ways to make it matter.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
