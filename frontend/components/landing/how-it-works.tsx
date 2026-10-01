"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  FileText,
  ImageIcon,
  Languages,
  MessageSquareText,
  Mic2,
  Video,
} from "lucide-react";

const steps = [
  {
    number: "01",
    short: "Start",
    title: "Say what you need.",
    description:
      "A goal, a rough thought, a product to promote, or even a document. No perfect prompt needed.",
    preview: {
      eyebrow: "You",
      content:
        "I run a catering business. I want more people ordering for weekends but I don't really know what to post.",
    },
  },
  {
    number: "02",
    short: "Shape",
    title: "Mecho finds the direction.",
    description:
      "Audience, tone, platform and language come together around what you're actually trying to achieve.",
    preview: {
      eyebrow: "Direction",
      content: "Make weekends easier.",
    },
  },
  {
    number: "03",
    short: "Create",
    title: "Bring it to life.",
    description:
      "Get content ready to use, then take it further in the language, voice and format that fits your audience.",
    preview: {
      eyebrow: "Ready",
      content:
        "No cooking stress this weekend. Fresh meals, ready when you are.",
    },
  },
];

const extensions = [
  {
    label: "Languages",
    icon: Languages,
  },
  {
    label: "Voice",
    icon: Mic2,
  },
  {
    label: "Visual",
    icon: ImageIcon,
  },
  {
    label: "Video",
    icon: Video,
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % steps.length);
    }, 4800);

    return () => window.clearInterval(interval);
  }, [paused]);

  const current = steps[active];

  return (
    <section
      id="how-it-works"
      className="
        relative
        scroll-mt-24
        overflow-hidden
        border-y border-border/60
        bg-muted/20
        py-24
        sm:py-28
        lg:scroll-mt-28
        lg:py-32
      "
    >
      {/* Atmosphere */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-[-8rem] top-[15%]
          size-80
          rounded-full
          bg-mecho-purple/8
          blur-[130px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute bottom-[5%] right-[-8rem]
          size-80
          rounded-full
          bg-mecho-orange/8
          blur-[130px]
        "
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.18em]
              text-mecho-purple
            "
          >
            How Mecho works
          </p>

          <h2
            className="
              mt-5
              text-4xl
              font-semibold
              leading-[1.02]
              tracking-[-0.05em]
              text-foreground
              sm:text-5xl
              lg:text-[3.8rem]
            "
          >
            Say what you need.
            <br />
            <span className="text-mecho-gradient">
              Mecho helps with the rest.
            </span>
          </h2>

          <p
            className="
              mx-auto mt-6
              max-w-xl
              text-base
              leading-7
              text-muted-foreground
              sm:text-lg
            "
          >
            From a rough thought to something ready to put in front of people.
          </p>
        </div>

        {/* Main experience */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="
            mt-16
            grid
            overflow-hidden
            rounded-[2rem]
            border border-border/70
            bg-background/80
            shadow-[0_32px_100px_rgba(47,1,117,0.08)]
            backdrop-blur-xl

            lg:mt-20
            lg:grid-cols-[0.82fr_1.18fr]
          "
        >
          {/* Steps */}
          <div
            className="
              border-b border-border/70
              p-4

              sm:p-6
              lg:border-b-0
              lg:border-r
              lg:p-8
            "
          >
            <div className="flex flex-col">
              {steps.map((step, index) => {
                const isActive = active === index;

                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => {
                      setActive(index);
                      setPaused(true);

                      window.setTimeout(() => {
                        setPaused(false);
                      }, 5000);
                    }}
                    className="
                      group
                      relative
                      w-full
                      border-b border-border/60
                      py-6
                      text-left
                      last:border-b-0
                      sm:py-7
                    "
                  >
                    <div className="flex items-start gap-5">
                      {/* Number */}
                      <span
                        className={`
                          mt-0.5
                          text-sm
                          font-semibold
                          transition-colors duration-300

                          ${
                            isActive
                              ? "text-mecho-purple"
                              : "text-muted-foreground/45"
                          }
                        `}
                      >
                        {step.number}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`
                            text-xl
                            font-semibold
                            tracking-[-0.03em]
                            transition-colors duration-300
                            sm:text-2xl

                            ${
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }
                          `}
                        >
                          {step.title}
                        </p>

                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.p
                              initial={{
                                opacity: 0,
                                height: 0,
                                y: -5,
                              }}
                              animate={{
                                opacity: 1,
                                height: "auto",
                                y: 0,
                              }}
                              exit={{
                                opacity: 0,
                                height: 0,
                              }}
                              transition={{
                                duration: 0.35,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="
                                max-w-md
                                overflow-hidden
                                pt-3
                                text-sm
                                leading-6
                                text-muted-foreground
                                sm:text-[15px]
                              "
                            >
                              {step.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <ArrowRight
                        className={`
                          mt-1
                          size-4
                          shrink-0
                          transition-all duration-300

                          ${
                            isActive
                              ? "translate-x-0 text-mecho-purple opacity-100"
                              : "-translate-x-2 text-muted-foreground opacity-0 group-hover:translate-x-0 group-hover:opacity-70"
                          }
                        `}
                      />
                    </div>

                    {/* Active progress */}
                    {isActive && (
                      <motion.span
                        layoutId="how-it-works-progress"
                        className="
                          absolute
                          bottom-[-1px]
                          left-0
                          h-px
                          bg-mecho-gradient
                        "
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: 4.8,
                          ease: "linear",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive preview */}
          <div
            className="
              relative
              flex min-h-[470px]
              items-center
              justify-center
              overflow-hidden
              p-6

              sm:p-10
              lg:min-h-[520px]
              lg:p-12
            "
          >
            {/* Background typography */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                right-[-0.05em]
                top-[-0.18em]
                select-none
                text-[13rem]
                font-bold
                leading-none
                tracking-[-0.08em]
                text-foreground/[0.025]

                sm:text-[17rem]
              "
            >
              {current.number}
            </div>

            {/* Floating card */}
            <motion.div
              animate={{
                y: [-8, 8, -8],
                rotate: [-0.35, 0.35, -0.35],
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
                z-10
                w-full
                max-w-[500px]
              "
            >
              <div
                className="
                  overflow-hidden
                  rounded-[1.75rem]
                  border border-border/80
                  bg-background
                  p-5
                  shadow-[0_25px_70px_rgba(47,1,117,0.10)]

                  sm:p-6
                "
              >
                {/* Card top */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-2">
                      <motion.span
                        animate={{
                          scale: [1, 1.8, 1.8],
                          opacity: [0.5, 0, 0],
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                        }}
                        className="
                          absolute inset-0
                          rounded-full
                          bg-emerald-400
                        "
                      />

                      <span
                        className="
                          relative
                          size-2
                          rounded-full
                          bg-emerald-500
                        "
                      />
                    </span>

                    <span
                      className="
                        text-xs
                        font-medium
                        text-muted-foreground
                      "
                    >
                      Mecho
                    </span>
                  </div>

                  <span
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-muted-foreground
                    "
                  >
                    {current.short}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.number}
                    initial={{
                      opacity: 0,
                      y: 10,
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
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {/* Step 1 */}
                    {active === 0 && (
                      <div className="py-8 sm:py-10">
                        <div
                          className="
                            flex size-10
                            items-center justify-center
                            rounded-full
                            bg-mecho-purple-soft
                            text-mecho-purple
                          "
                        >
                          <MessageSquareText className="size-[18px]" />
                        </div>

                        <p
                          className="
                            mt-6
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.15em]
                            text-muted-foreground
                          "
                        >
                          {current.preview.eyebrow}
                        </p>

                        <p
                          className="
                            mt-3
                            text-xl
                            font-medium
                            leading-8
                            tracking-[-0.025em]
                            text-foreground
                            sm:text-2xl
                          "
                        >
                          “{current.preview.content}”
                        </p>

                        <div
                          className="
                            mt-7
                            flex items-center
                            gap-2
                            text-xs
                            text-muted-foreground
                          "
                        >
                          <FileText className="size-3.5" />
                          Type it, paste it or bring a document.
                        </div>
                      </div>
                    )}

                    {/* Step 2 */}
                    {active === 1 && (
                      <div className="py-8 sm:py-10">
                        <p
                          className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.15em]
                            text-mecho-purple
                          "
                        >
                          {current.preview.eyebrow}
                        </p>

                        <h3
                          className="
                            mt-3
                            text-3xl
                            font-semibold
                            tracking-[-0.045em]
                            text-foreground
                          "
                        >
                          {current.preview.content}
                        </h3>

                        <div
                          className="
                            mt-8
                            flex flex-wrap
                            gap-2
                          "
                        >
                          {[
                            "Weekend orders",
                            "Busy families",
                            "Friendly",
                            "Instagram",
                            "English",
                          ].map((item) => (
                            <span
                              key={item}
                              className="
                                rounded-full
                                border border-border/70
                                px-3 py-2
                                text-xs
                                font-medium
                                text-muted-foreground
                              "
                            >
                              {item}
                            </span>
                          ))}
                        </div>

                        <p
                          className="
                            mt-7
                            max-w-md
                            text-sm
                            leading-6
                            text-muted-foreground
                          "
                        >
                          Mecho keeps the direction focused without making you
                          think like a marketer.
                        </p>
                      </div>
                    )}

                    {/* Step 3 */}
                    {active === 2 && (
                      <div className="py-7 sm:py-9">
                        <p
                          className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.15em]
                            text-mecho-purple
                          "
                        >
                          {current.preview.eyebrow}
                        </p>

                        <h3
                          className="
                            mt-3
                            text-[1.75rem]
                            font-semibold
                            leading-[1.08]
                            tracking-[-0.045em]
                            text-foreground
                            sm:text-[2rem]
                          "
                        >
                          {current.preview.content}
                        </h3>

                        <p
                          className="
                            mt-4
                            text-[15px]
                            leading-7
                            text-muted-foreground
                          "
                        >
                          Let us handle the food while you enjoy your weekend.
                          Fresh meals, made with care and ready when you are.
                        </p>

                        <div className="mt-7 border-t border-border/70 pt-5">
                          <p
                            className="
                              mb-3
                              text-[10px]
                              font-semibold
                              uppercase
                              tracking-[0.14em]
                              text-muted-foreground
                            "
                          >
                            Take it further
                          </p>

                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {extensions.map((extension) => {
                              const Icon = extension.icon;

                              return (
                                <div
                                  key={extension.label}
                                  className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-muted/60
                                    px-3 py-2.5
                                    text-xs
                                    font-medium
                                    text-foreground
                                  "
                                >
                                  <Icon className="size-3.5 text-mecho-purple" />

                                  {extension.label}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Floating accent label */}
              <motion.div
                animate={{
                  y: [4, -4, 4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  -bottom-4
                  -right-2
                  hidden
                  rounded-full
                  border border-border/70
                  bg-background
                  px-4 py-2
                  text-xs
                  font-medium
                  text-muted-foreground
                  shadow-lg

                  sm:block
                "
              >
                From thought → ready to use
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Closing line */}
        <div
          className="
            mt-10
            flex
            items-center
            justify-center
            gap-3
            text-center
            text-sm
            font-medium
            text-muted-foreground
          "
        >
          <span className="h-px w-10 bg-border sm:w-16" />
          Start simple. Go as far as you need.
          <span className="h-px w-10 bg-border sm:w-16" />
        </div>
      </div>
    </section>
  );
}
