"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AudioLines,
  Clapperboard,
  Globe2,
  Images,
  Megaphone,
  MessageSquareText,
  Mic2,
} from "lucide-react";

const workflows = [
  {
    id: "social",
    title: "Social Content",
    short: "Social",
    icon: MessageSquareText,
    description:
      "Turn a rough thought, offer or goal into content made for the platform, audience and tone you need.",
    eyebrow: "Instagram · Friendly · English",
    headline: "Weekend plans? Let us handle the food.",
    body: "Fresh meals, zero kitchen stress. Order ahead and enjoy your weekend while we take care of the cooking.",
    tags: ["Objective", "Audience", "Tone", "Language", "Platform"],
  },
  {
    id: "campaign",
    title: "Campaigns",
    short: "Campaign",
    icon: Megaphone,
    description:
      "Build coordinated campaign messaging around your objective, audience, key message and desired action.",
    eyebrow: "Campaign · Conversion",
    headline: "Make registration feel worth acting on.",
    body: "Lead with the outcome people care about, create urgency around the deadline, and make the next step obvious.",
    tags: ["Objective", "Audience", "Tone", "Language", "Duration"],
  },
  {
    id: "speech",
    title: "Speeches",
    short: "Speech",
    icon: Mic2,
    description:
      "Create speeches shaped around the event, audience, tone, memories and moments that actually matter.",
    eyebrow: "Speech · Warm · Personal",
    headline: "Something worth saying. In a way that feels like you.",
    body: "Bring the occasion, the people and the memories together into a speech that feels personal, natural and right for the moment.",
    tags: ["Event", "Memories", "Audience", "Tone", "Language"],
  },
];

const extensions = [
  {
    title: "Languages",
    description: "Adapt the message naturally across local languages.",
    icon: Globe2,
  },
  {
    title: "Voice",
    description: "Give the content a natural Nigerian voice.",
    icon: AudioLines,
  },
  {
    title: "Visuals",
    description: "Create visuals that match the message and campaign.",
    icon: Images,
  },
  {
    title: "Video",
    description: "Carry the same direction into motion.",
    icon: Clapperboard,
  },
];

export function ProductSection() {
  const [activeWorkflow, setActiveWorkflow] = useState(0);

  const current = workflows[activeWorkflow];
  const CurrentIcon = current.icon;

  return (
    <section
      id="product"
      className="
        relative
        scroll-mt-24
        overflow-hidden
        bg-background
        py-24
        sm:py-28
        lg:scroll-mt-28
        lg:py-32
      "
    >
      {/* atmosphere */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-[-8rem] top-[12%]
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
        {/* intro */}
        <div className="max-w-3xl">
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.18em]
              text-mecho-purple
            "
          >
            What you can create
          </p>

          <h2
            className="
              mt-5
              text-4xl
              font-semibold
              leading-[1.03]
              tracking-[-0.05em]
              text-foreground
              sm:text-5xl
              lg:text-[3.6rem]
            "
          >
            One place.
            <br />
            More ways to create.
          </h2>

          <p
            className="
              mt-6
              max-w-2xl
              text-base
              leading-8
              text-muted-foreground
              sm:text-lg
            "
          >
            Start with what you need to achieve, then let Mecho shape the
            content and carry it into the formats that make sense.
          </p>
        </div>

        {/* main product experience */}
        <div
          className="
            mt-16
            grid
            overflow-hidden
            rounded-[2rem]
            border border-border/70
            bg-card/55
            shadow-[0_30px_100px_rgba(47,1,117,0.06)]
            backdrop-blur-xl

            sm:mt-20
            lg:grid-cols-[0.78fr_1.22fr]
          "
        >
          {/* workflow selector */}
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
            <p
              className="
                px-2
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-muted-foreground
              "
            >
              Choose a workflow
            </p>

            <div className="mt-4">
              {workflows.map((workflow, index) => {
                const Icon = workflow.icon;
                const isActive = activeWorkflow === index;

                return (
                  <button
                    key={workflow.id}
                    type="button"
                    onClick={() => setActiveWorkflow(index)}
                    className="
                      group
                      relative
                      w-full
                      border-b border-border/60
                      px-2 py-6
                      text-left
                      last:border-b-0
                    "
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`
                          flex size-10
                          shrink-0
                          items-center justify-center
                          rounded-xl
                          transition-all duration-300

                          ${
                            isActive
                              ? "bg-mecho-purple-soft text-mecho-purple"
                              : "bg-muted/60 text-muted-foreground"
                          }
                        `}
                      >
                        <Icon className="size-[18px]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3
                          className={`
                            text-lg
                            font-semibold
                            tracking-[-0.03em]
                            transition-colors duration-300

                            ${
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground group-hover:text-foreground"
                            }
                          `}
                        >
                          {workflow.title}
                        </h3>

                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.p
                              initial={{
                                opacity: 0,
                                height: 0,
                                y: -4,
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
                                max-w-sm
                                overflow-hidden
                                pt-2
                                text-sm
                                leading-6
                                text-muted-foreground
                              "
                            >
                              {workflow.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {isActive && (
                      <motion.span
                        layoutId="product-workflow"
                        className="
                          absolute
                          bottom-[-1px]
                          left-0
                          h-px
                          w-full
                          bg-mecho-gradient
                        "
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* live preview */}
          <div
            className="
              relative
              flex min-h-[470px]
              items-center
              justify-center
              overflow-hidden
              p-6
              sm:p-10
              lg:min-h-[500px]
              lg:p-12
            "
          >
            {/* giant faded workflow number */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                right-[-0.05em]
                top-[-0.18em]
                select-none
                text-[14rem]
                font-bold
                leading-none
                tracking-[-0.08em]
                text-foreground/[0.025]
                sm:text-[18rem]
              "
            >
              0{activeWorkflow + 1}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{
                  opacity: 0,
                  y: 12,
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
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  relative
                  z-10
                  w-full
                  max-w-[520px]
                "
              >
                <motion.div
                  animate={{
                    y: [-7, 7, -7],
                    rotate: [-0.25, 0.25, -0.25],
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
                    rounded-[1.75rem]
                    border border-border/80
                    bg-background
                    p-5
                    shadow-[0_25px_70px_rgba(47,1,117,0.10)]
                    sm:p-6
                  "
                >
                  {/* header */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="
                          flex size-9
                          items-center justify-center
                          rounded-full
                          bg-mecho-purple-soft
                          text-mecho-purple
                        "
                      >
                        <CurrentIcon className="size-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {current.title}
                        </p>

                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          Mecho workspace
                        </p>
                      </div>
                    </div>

                    <span
                      className="
                        rounded-full
                        border border-border/70
                        px-3 py-1.5
                        text-[10px]
                        font-medium
                        text-muted-foreground
                      "
                    >
                      Ready
                    </span>
                  </div>

                  {/* output */}
                  <div className="mt-8">
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.15em]
                        text-mecho-purple
                      "
                    >
                      {current.eyebrow}
                    </p>

                    <h3
                      className="
                        mt-3
                        text-[1.8rem]
                        font-semibold
                        leading-[1.07]
                        tracking-[-0.045em]
                        text-foreground
                        sm:text-[2.05rem]
                      "
                    >
                      {current.headline}
                    </h3>

                    <p
                      className="
                        mt-4
                        text-[15px]
                        leading-7
                        text-muted-foreground
                      "
                    >
                      {current.body}
                    </p>
                  </div>

                  {/* contextual ingredients */}
                  <div
                    className="
                      mt-7
                      flex flex-wrap
                      gap-2
                      border-t border-border/70
                      pt-5
                    "
                  >
                    {current.tags.map((tag) => (
                      <span
                        key={tag}
                        className="
                          rounded-full
                          bg-muted/60
                          px-3 py-1.5
                          text-[11px]
                          font-medium
                          text-muted-foreground
                        "
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* extend the result */}
        <div className="mt-12 sm:mt-14">
          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-mecho-purple
                "
              >
                Take it further
              </p>

              <h3
                className="
                  mt-2
                  text-2xl
                  font-semibold
                  tracking-[-0.035em]
                  text-foreground
                  sm:text-3xl
                "
              >
                The message doesn&apos;t have to stop at text.
              </h3>
            </div>

            <p
              className="
                max-w-md
                text-sm
                leading-6
                text-muted-foreground
                sm:text-right
              "
            >
              Keep the same direction and carry it into the language, voice and
              media your audience connects with.
            </p>
          </div>

          <div
            className="
              mt-7
              grid
              gap-px
              overflow-hidden
              rounded-[1.5rem]
              border border-border/70
              bg-border/70
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {extensions.map((extension, index) => {
              const Icon = extension.icon;

              return (
                <motion.div
                  key={extension.title}
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.3,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    group
                    bg-background
                    p-5
                    transition-colors duration-300
                    hover:bg-muted/30
                    sm:p-6
                  "
                >
                  <div
                    className="
                      flex size-9
                      items-center justify-center
                      rounded-full
                      bg-mecho-orange-soft
                      text-mecho-orange
                      transition-transform duration-300
                      group-hover:scale-105
                    "
                  >
                    <Icon className="size-4" />
                  </div>

                  <h4
                    className="
                      mt-5
                      text-lg
                      font-semibold
                      tracking-[-0.025em]
                      text-foreground
                    "
                  >
                    {extension.title}
                  </h4>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-muted-foreground
                    "
                  >
                    {extension.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
