"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ImageIcon, MessageSquareText, Play } from "lucide-react";

const outputs = [
  {
    id: "content",
    label: "Content",
    icon: MessageSquareText,
    eyebrow: "Instagram ad",
    meta: "Confident · English",
    title: "Own the room before you say a word.",
    content:
      "A new collection for people who want their style to speak first — bold, effortless and made to stand out without trying too hard.",
    action: "Shop the collection",
  },
  {
    id: "visual",
    label: "Visual",
    icon: ImageIcon,
    eyebrow: "Creative direction",
    meta: "Editorial · Social",
    title: "Confidence you can see.",
    content:
      "A clean fashion visual with strong styling, natural movement and a premium editorial feel built to stop the scroll.",
    action: "Create visual",
  },
  {
    id: "video",
    label: "Video",
    icon: Play,
    eyebrow: "Video concept",
    meta: "Short-form · 15 sec",
    title: "Walk in. Stand out.",
    content:
      "Start with close-up details, reveal the full look through movement, then finish with one strong product moment and a clear call to action.",
    action: "Create video",
  },
];

export function HeroShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % outputs.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [paused]);

  const current = outputs[active];
  const ActiveIcon = current.icon;

  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      {/* soft atmosphere */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -left-8 top-[18%]
          size-36 rounded-full
          bg-mecho-purple/10
          blur-[80px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -bottom-6 right-0
          size-32 rounded-full
          bg-mecho-orange/10
          blur-[80px]
        "
      />

      <motion.div
        animate={{
          y: [-10, 10, -10],
          x: [-3, 3, -3],
          rotate: [-0.4, 0.4, -0.4],
        }}
        transition={{
          y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          },
          x: {
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        style={{ willChange: "transform" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="
          relative
          overflow-hidden
          rounded-[1.75rem]
          border border-border/80
          bg-background/92
          p-5
          shadow-[0_28px_70px_rgba(47,1,117,0.12)]
          backdrop-blur-xl
          sm:p-6
        "
      >
        {/* top */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-[-0.01em] text-foreground">
            Mecho
          </p>

          <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
            <span className="relative flex size-2">
              <motion.span
                animate={{
                  scale: [1, 1.8, 1.8],
                  opacity: [0.45, 0, 0],
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

              <span className="relative size-2 rounded-full bg-emerald-500" />
            </span>
            Creating
          </div>
        </div>

        {/* idea */}
        <div className="mt-6">
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-muted-foreground
            "
          >
            Your idea
          </p>

          <p
            className="
              mt-2
              max-w-md
              text-[1.05rem]
              font-medium
              leading-7
              tracking-[-0.025em]
              text-foreground
              sm:text-lg
            "
          >
            I&apos;m launching a new clothing collection and I want more young
            people to notice it and order.
          </p>
        </div>

        {/* subtle processing line */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border/80" />

          <motion.span
            animate={{
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.14em]
              text-muted-foreground
            "
          >
            shaped by Mecho
          </motion.span>

          <div className="h-px flex-1 bg-border/80" />
        </div>

        {/* result */}
        <div className="min-h-[215px]">
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
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="
                      text-xs
                      font-semibold
                      text-mecho-purple
                    "
                  >
                    {current.eyebrow}
                  </p>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {current.meta}
                  </p>
                </div>

                <div
                  className="
                    flex size-8
                    items-center justify-center
                    rounded-full
                    border border-border/70
                    text-muted-foreground
                  "
                >
                  <ActiveIcon className="size-3.5" />
                </div>
              </div>

              <h3
                className="
                  mt-5
                  max-w-md
                  text-[1.55rem]
                  font-semibold
                  leading-[1.08]
                  tracking-[-0.045em]
                  text-foreground
                  sm:text-[1.7rem]
                "
              >
                {current.title}
              </h3>

              <p
                className="
                  mt-3
                  max-w-md
                  text-sm
                  leading-6
                  text-muted-foreground
                  sm:text-[15px]
                "
              >
                {current.content}
              </p>

              <div className="mt-4">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    text-xs
                    font-semibold
                    text-foreground
                  "
                >
                  {current.action}

                  <ArrowUpRight className="size-3.5 text-mecho-purple" />
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* selector */}
        <div
          className="
            mt-5
            flex items-center
            justify-between
            border-t border-border/70
            pt-4
          "
        >
          <div className="flex items-center gap-1.5">
            {outputs.map((output, index) => {
              const Icon = output.icon;
              const isActive = active === index;

              return (
                <button
                  key={output.id}
                  type="button"
                  onClick={() => {
                    setActive(index);
                    setPaused(true);

                    window.setTimeout(() => {
                      setPaused(false);
                    }, 4000);
                  }}
                  className={`
                    flex items-center
                    gap-1.5
                    rounded-full
                    px-3 py-2
                    text-xs
                    font-medium
                    transition-all duration-300

                    ${
                      isActive
                        ? `
                          bg-mecho-purple-soft
                          text-mecho-purple
                        `
                        : `
                          text-muted-foreground
                          hover:text-foreground
                        `
                    }
                  `}
                >
                  <Icon className="size-3.5" />

                  {output.label}
                </button>
              );
            })}
          </div>

          <div className="hidden items-center gap-1.5 sm:flex">
            {outputs.map((output, index) => (
              <span
                key={output.id}
                className={`
                  h-1 rounded-full
                  transition-all duration-500

                  ${
                    active === index ? "w-5 bg-mecho-gradient" : "w-1 bg-border"
                  }
                `}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
