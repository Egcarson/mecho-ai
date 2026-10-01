"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Megaphone, MessageSquareText, Mic2 } from "lucide-react";

const workflows = [
  {
    id: "social",
    title: "Social",
    description:
      "Create content made for the feed — posts, promotions, visuals, video and more.",
    href: "/dashboard/create/social",
    icon: MessageSquareText,
  },
  {
    id: "campaign",
    title: "Campaign",
    description:
      "Shape awareness, public-interest, institutional or event communication.",
    href: "/dashboard/create/campaign",
    icon: Megaphone,
  },
  {
    id: "speech",
    title: "Speech",
    description:
      "Build a speech around the occasion, audience, tone and what you want people to feel.",
    href: "/dashboard/create/speech",
    icon: Mic2,
  },
];

export default function CreatePage() {
  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-background
        px-4
        pb-16
        pt-12
        text-foreground

        sm:px-6
        sm:pt-16

        lg:px-8
        lg:pt-20
      "
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[10%]
          top-[20%]
          size-[360px]
          rounded-full
          bg-mecho-purple/8
          blur-[140px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[8%]
          right-[8%]
          size-[320px]
          rounded-full
          bg-mecho-orange/7
          blur-[140px]
        "
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Intro */}
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
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.16em]
              text-mecho-purple
            "
          >
            Create
          </p>

          <h1
            className="
              mt-4
              text-4xl
              font-semibold
              leading-[1.04]
              tracking-[-0.055em]

              sm:text-5xl
              lg:text-6xl
            "
          >
            What are we creating today?
          </h1>

          <p
            className="
              mx-auto
              mt-5
              max-w-xl
              text-base
              leading-7
              text-muted-foreground

              sm:text-lg
            "
          >
            Choose a starting point. Mecho will guide the rest, one step at a
            time.
          </p>
        </motion.div>

        {/* Workflow selector */}
        <div
          className="
            mt-12
            grid
            gap-4

            md:grid-cols-3
          "
        >
          {workflows.map((workflow, index) => {
            const Icon = workflow.icon;

            return (
              <motion.div
                key={workflow.id}
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.55,
                  delay: 0.08 + index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={workflow.href}
                  className="
                    group
                    relative
                    flex
                    min-h-[280px]
                    flex-col
                    overflow-hidden
                    rounded-[1.75rem]
                    border
                    border-border/70
                    bg-background/85
                    p-6

                    shadow-[0_20px_70px_rgba(47,1,117,0.06)]
                    backdrop-blur-xl

                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:border-mecho-purple/25
                    hover:shadow-[0_26px_80px_rgba(47,1,117,0.11)]
                  "
                >
                  {/* glow */}
                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      -right-12
                      -top-12
                      size-36
                      rounded-full
                      bg-mecho-purple/0
                      blur-3xl

                      transition-colors
                      duration-500

                      group-hover:bg-mecho-purple/10
                    "
                  />

                  <div
                    className="
                      relative
                      flex
                      size-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-mecho-purple-soft
                      text-mecho-purple
                    "
                  >
                    <Icon className="size-5" />
                  </div>

                  <div className="relative mt-auto">
                    <h2
                      className="
                        text-2xl
                        font-semibold
                        tracking-[-0.04em]
                      "
                    >
                      {workflow.title}
                    </h2>

                    <p
                      className="
                        mt-3
                        text-sm
                        leading-6
                        text-muted-foreground
                      "
                    >
                      {workflow.description}
                    </p>

                    <div
                      className="
                        mt-6
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-mecho-purple
                      "
                    >
                      Start
                      <ArrowRight
                        className="
                          size-4
                          transition-transform
                          duration-300

                          group-hover:translate-x-1
                        "
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* helper line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.4,
          }}
          className="
            mx-auto
            mt-8
            max-w-lg
            text-center
            text-sm
            leading-6
            text-muted-foreground
          "
        >
          Not sure which one fits? Go back home and tell Mecho what you want to
          achieve.
        </motion.p>
      </div>
    </main>
  );
}
