"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Languages, MessageSquareText, Mic2, ImageIcon } from "lucide-react";

const scenarios = [
  {
    id: "direction",
    label: "Need direction",
    prompt:
      "I run a catering business and I want more weekend orders, but I don't know what to post.",
    title: "Make weekends easier.",
    content:
      "No cooking stress this weekend. Get fresh, ready-to-enjoy meals delivered while you focus on everything else.",
    meta: ["Instagram", "Friendly", "English"],
    icon: MessageSquareText,
    outputLabel: "Social content",
  },
  {
    id: "language",
    label: "Go local",
    prompt:
      "I want to promote my new fashion collection to young Nigerians in a more relatable way.",
    title: "No just wear am. Own am.",
    content:
      "New collection don land. Clean fits, bold style and that confidence wey make people notice you before you even talk.",
    meta: ["Instagram", "Confident", "Pidgin"],
    icon: Languages,
    outputLabel: "Localized content",
  },
  {
    id: "voice",
    label: "Give it a voice",
    prompt:
      "I need something warm and natural for a short promo people can listen to.",
    title: "Make it sound like home.",
    content:
      "Turn your message into natural Nigerian voice content that feels familiar, expressive and made for the people listening.",
    meta: ["Voice", "Warm", "Nigerian"],
    icon: Mic2,
    outputLabel: "Voice-ready",
  },
  {
    id: "visual",
    label: "Make it visual",
    prompt: "I want the campaign to feel more premium and attention-grabbing.",
    title: "Give the message a look.",
    content:
      "Create a visual direction that matches the tone of the campaign, the audience and the platform it is made for.",
    meta: ["Visual", "Premium", "Campaign"],
    icon: ImageIcon,
    outputLabel: "Creative direction",
  },
];

export function MessageExpansion() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % scenarios.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [paused]);

  const current = scenarios[active];
  const ActiveIcon = current.icon;

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-background
        py-20
        sm:py-24
        lg:py-28
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-[-8rem] top-[15%]
          size-72
          rounded-full
          bg-mecho-purple/7
          blur-[120px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute bottom-[5%] right-[-8rem]
          size-72
          rounded-full
          bg-mecho-orange/7
          blur-[120px]
        "
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="
            grid items-center
            gap-14
            lg:grid-cols-[0.82fr_1.18fr]
            lg:gap-20
          "
        >
          {/* Left */}
          <div className="max-w-xl">
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-mecho-purple
              "
            >
              Start wherever you are
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
                lg:text-[3.5rem]
              "
            >
              Bring the message.
              <br />
              Or let Mecho
              <br />
              help you find it.
            </h2>

            <p
              className="
                mt-6
                max-w-lg
                text-base
                leading-7
                text-muted-foreground
                sm:text-lg
                sm:leading-8
              "
            >
              From content and local-language adaptations to natural voice and
              matching visuals, Mecho helps turn what you want to achieve into
              something people can actually connect with.
            </p>
          </div>

          {/* Right */}
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div
              className="
                relative
                overflow-hidden
                rounded-[1.8rem]
                border border-border/80
                bg-card/70
                p-5
                shadow-[0_28px_80px_rgba(47,1,117,0.07)]
                backdrop-blur-xl
                sm:p-6
              "
            >
              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {scenarios.map((scenario, index) => {
                  const Icon = scenario.icon;
                  const isActive = active === index;

                  return (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => {
                        setActive(index);
                        setPaused(true);

                        window.setTimeout(() => {
                          setPaused(false);
                        }, 4500);
                      }}
                      className={`
                        flex items-center gap-1.5
                        rounded-full
                        px-3.5 py-2
                        text-xs
                        font-medium
                        transition-all duration-300

                        ${
                          isActive
                            ? "bg-mecho-purple-soft text-mecho-purple"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }
                      `}
                    >
                      <Icon className="size-3.5" />
                      {scenario.label}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
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
                    y: -6,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* User input */}
                  <div className="mt-6 border-b border-border/70 pb-6">
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-muted-foreground
                      "
                    >
                      You say
                    </p>

                    <p
                      className="
                        mt-3
                        max-w-xl
                        text-lg
                        font-medium
                        leading-7
                        tracking-[-0.025em]
                        text-foreground
                        sm:text-xl
                      "
                    >
                      “{current.prompt}”
                    </p>
                  </div>

                  {/* Result */}
                  <div className="pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="
                            flex size-8
                            items-center justify-center
                            rounded-full
                            bg-mecho-purple-soft
                            text-mecho-purple
                          "
                        >
                          <ActiveIcon className="size-3.5" />
                        </div>

                        <p className="text-xs font-semibold text-mecho-purple">
                          {current.outputLabel}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {scenarios.map((scenario, index) => (
                          <span
                            key={scenario.id}
                            className={`
                              h-1
                              rounded-full
                              transition-all duration-500

                              ${
                                active === index
                                  ? "w-5 bg-mecho-gradient"
                                  : "w-1 bg-border"
                              }
                            `}
                          />
                        ))}
                      </div>
                    </div>

                    <h3
                      className="
                        mt-4
                        max-w-xl
                        text-2xl
                        font-semibold
                        leading-[1.1]
                        tracking-[-0.04em]
                        text-foreground
                        sm:text-[1.8rem]
                      "
                    >
                      {current.title}
                    </h3>

                    <p
                      className="
                        mt-3
                        max-w-xl
                        text-[15px]
                        leading-7
                        text-muted-foreground
                        sm:text-base
                      "
                    >
                      {current.content}
                    </p>

                    <div
                      className="
                        mt-5
                        flex flex-wrap
                        items-center
                        gap-x-3 gap-y-2
                        text-xs
                        font-medium
                        text-muted-foreground
                      "
                    >
                      {current.meta.map((item, index) => (
                        <div key={item} className="flex items-center gap-3">
                          {index > 0 && (
                            <span aria-hidden="true" className="text-border">
                              |
                            </span>
                          )}

                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
