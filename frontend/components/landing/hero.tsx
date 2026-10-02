"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import {
  ArrowRight,
  Check,
  ImageIcon,
  Mic2,
  Play,
  WandSparkles,
} from "lucide-react";

const previewStates = [
  {
    platform: "Instagram",
    language: "Pidgin",
    headline: "Fresh drop. Fresh confidence.",
    body: "Your new look no suppose blend in. Step out with pieces made to carry your style with confidence.",
  },
  {
    platform: "Facebook",
    language: "Yoruba",
    headline: "Aṣọ tuntun. Ìgboyà tuntun.",
    body: "Ṣe ìfarahàn rẹ ní ọ̀nà tó yàtọ̀. Jẹ́ kí ara rẹ sọ ìtàn rẹ pẹ̀lú ìgboyà.",
  },
  {
    platform: "LinkedIn",
    language: "English",
    headline: "A collection designed to be noticed.",
    body: "Introducing a new fashion collection shaped around confidence, individuality and modern expression.",
  },
  {
    platform: "X",
    language: "Hausa",
    headline: "Sabon salo. Sabuwar kwarin gwiwa.",
    body: "Ka fito da salonka da kwarin gwiwa tare da sabbin kaya da aka kirkira domin ka bambanta.",
  },
];

export function Hero() {
  const [activePreview, setActivePreview] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActivePreview((current) => (current + 1) % previewStates.length);
    }, 5200);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const preview = previewStates[activePreview];

  return (
    <section
      id="home"
      className="
        relative
        isolate
        overflow-hidden
        bg-background
        px-4
        pb-24
        pt-36

        sm:px-6
        sm:pb-28
        sm:pt-40

        lg:px-8
        lg:pb-32
        lg:pt-44
      "
    >
      {/* =====================================================
          AMBIENT CREATIVE BACKGROUND

          Background motion is deliberately slow and continuous.
          Nothing here changes the layout or moves the interface.
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          overflow-hidden
        "
      >
        <motion.div
          animate={{
            x: ["-4%", "4%", "-4%"],
            y: ["0%", "3%", "0%"],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-[10%]
            top-[6%]
            h-[420px]
            w-[620px]
            rounded-full
            bg-mecho-purple/10
            blur-[150px]

            dark:bg-mecho-purple/16
          "
        />

        <motion.div
          animate={{
            x: ["3%", "-4%", "3%"],
            y: ["2%", "-2%", "2%"],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            right-[-8%]
            top-[24%]
            h-[360px]
            w-[420px]
            rounded-full
            bg-[#ff7a1a]/10
            blur-[150px]

            dark:bg-[#ff7a1a]/12
          "
        />

        {/* Very faint editorial wordmark */}

        <span
          className="
            absolute
            left-1/2
            top-[41%]
            -translate-x-1/2
            whitespace-nowrap
            text-[8rem]
            font-semibold
            tracking-[-0.08em]
            text-foreground/[0.018]

            sm:text-[12rem]

            lg:text-[17rem]
          "
        >
          CREATE
        </span>
      </div>

      <div
        className="
          relative
          mx-auto
          max-w-7xl
        "
      >
        {/* =====================================================
            HERO MESSAGE
        ====================================================== */}

        <div
          className="
            mx-auto
            max-w-5xl
            text-center
          "
        >
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-mecho-purple/15
                bg-background/70
                px-4
                py-2
                text-xs
                font-semibold
                text-mecho-purple
                shadow-sm
                backdrop-blur-xl
              "
            >
              <WandSparkles className="size-3.5" />
              Creative intelligence, without the complexity
            </span>
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.9,
              delay: 0.08,
            }}
            className="
              mx-auto
              mt-7
              max-w-5xl
              text-[3.15rem]
              font-semibold
              leading-[0.98]
              tracking-[-0.065em]

              sm:text-[4.5rem]

              lg:text-[5.7rem]
            "
          >
            Turn one idea into{" "}
            <span className="text-mecho-gradient">content that moves.</span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.9,
              delay: 0.16,
            }}
            className="
              mx-auto
              mt-7
              max-w-2xl
              text-base
              leading-7
              text-muted-foreground

              sm:text-lg
              sm:leading-8
            "
          >
            Mecho turns your idea, product or message into content built for the
            right audience, platform and language — then carries it into
            visuals, video and voice.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.9,
              delay: 0.24,
            }}
            className="
              mt-8
              flex
              flex-col
              items-center
            "
          >
            <Link
              href="/signup"
              className="
                group
                inline-flex
                h-13
                items-center
                justify-center
                gap-2
                rounded-full
                bg-mecho-gradient
                px-7
                text-sm
                font-semibold
                text-white
                shadow-[0_14px_38px_rgba(111,44,255,0.20)]
                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:shadow-[0_18px_48px_rgba(111,44,255,0.28)]
              "
            >
              Start for free
              <ArrowRight
                className="
                  size-4
                  transition-transform
                  duration-300

                  group-hover:translate-x-0.5
                "
              />
            </Link>

            <span
              className="
                mt-3
                inline-flex
                items-center
                gap-1.5
                text-xs
                text-muted-foreground
              "
            >
              <Check className="size-3.5" />
              No credit card required
            </span>
          </motion.div>
        </div>

        {/* =====================================================
            CREATIVE PRODUCT STORY

            The shell itself never moves.

            Motion only happens inside the experience:
            idea → Mecho → changing output.
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 1,
            delay: 0.35,
          }}
          className="
            relative
            mx-auto
            mt-16
            max-w-5xl

            sm:mt-20
          "
        >
          {/* Static premium glow */}

          <div
            aria-hidden="true"
            className="
              absolute
              -inset-x-10
              -inset-y-8
              -z-10
              rounded-[4rem]
              bg-mecho-gradient
              opacity-[0.07]
              blur-[80px]
            "
          />

          <div
            className="
              overflow-hidden
              rounded-[2rem]
              border
              border-border/70
              bg-background/88
              shadow-[0_40px_120px_rgba(47,1,117,0.10)]
              backdrop-blur-2xl
            "
          >
            {/* -----------------------------------------------
                IDEA
            ------------------------------------------------ */}

            <div
              className="
                border-b
                border-border/60
                px-5
                py-5

                sm:px-7
                sm:py-6
              "
            >
              <div
                className="
                  flex
                  flex-col
                  justify-between
                  gap-4

                  sm:flex-row
                  sm:items-center
                "
              >
                <div>
                  <p
                    className="
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-muted-foreground
                    "
                  >
                    Your idea
                  </p>

                  <p
                    className="
                      mt-1.5
                      text-sm
                      font-medium

                      sm:text-base
                    "
                  >
                    “Help me launch my new fashion collection.”
                  </p>
                </div>

                <div
                  className="
                    inline-flex
                    w-fit
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-border/60
                    bg-muted/25
                    px-3
                    py-2
                  "
                >
                  <span
                    className="
                      relative
                      flex
                      size-2
                    "
                  >
                    <span
                      className="
                        absolute
                        inline-flex
                        h-full
                        w-full
                        animate-ping
                        rounded-full
                        bg-emerald-400
                        opacity-30
                      "
                    />

                    <span
                      className="
                        relative
                        inline-flex
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
                    Mecho is creating
                  </span>
                </div>
              </div>
            </div>

            {/* -----------------------------------------------
                FLOW
            ------------------------------------------------ */}

            <div
              className="
                relative
                grid

                lg:grid-cols-[0.82fr_1.18fr]
              "
            >
              {/* Creative direction */}

              <div
                className="
                  relative
                  border-b
                  border-border/60
                  p-5

                  sm:p-7

                  lg:border-b-0
                  lg:border-r
                "
              >
                <p
                  className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-mecho-purple
                  "
                >
                  Creative direction
                </p>

                <h3
                  className="
                    mt-3
                    max-w-xs
                    text-xl
                    font-semibold
                    leading-tight
                    tracking-[-0.04em]

                    sm:text-2xl
                  "
                >
                  Launch with confidence, not just another post.
                </h3>

                <div
                  className="
                    mt-8
                    grid
                    grid-cols-2
                    gap-x-5
                    gap-y-6
                  "
                >
                  <Direction label="Audience" value="Young fashion buyers" />

                  <Direction label="Objective" value="Launch collection" />

                  <Direction label="Tone" value="Confident" />

                  <div>
                    <p
                      className="
                        text-xs
                        text-muted-foreground
                      "
                    >
                      Adapting for
                    </p>

                    <div
                      className="
                        relative
                        mt-1
                        h-5
                        overflow-hidden
                      "
                    >
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={`${preview.platform}-${preview.language}`}
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          exit={{
                            opacity: 0,
                          }}
                          transition={{
                            duration: 0.65,
                            ease: "easeInOut",
                          }}
                          className="
                            absolute
                            inset-0
                            text-sm
                            font-medium
                          "
                        >
                          {preview.platform} · {preview.language}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------
                  GENERATED CREATIVE
              ---------------------------------------------- */}

              <div
                className="
                  relative
                  min-h-[340px]
                  p-5

                  sm:p-7
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <p
                    className="
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-muted-foreground
                    "
                  >
                    Generated direction
                  </p>

                  {/* progress dots */}

                  <div className="flex gap-1.5">
                    {previewStates.map((_, index) => (
                      <span
                        key={index}
                        className={`
                            h-1.5
                            rounded-full
                            transition-all
                            duration-700

                            ${
                              index === activePreview
                                ? "w-5 bg-mecho-purple"
                                : "w-1.5 bg-border"
                            }
                          `}
                      />
                    ))}
                  </div>
                </div>

                {/* Fixed-height content stage prevents layout movement */}

                <div
                  className="
                    relative
                    mt-7
                    min-h-[175px]
                  "
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${preview.platform}-${preview.language}`}
                      initial={{
                        opacity: 0,
                        filter: "blur(3px)",
                      }}
                      animate={{
                        opacity: 1,
                        filter: "blur(0px)",
                      }}
                      exit={{
                        opacity: 0,
                        filter: "blur(2px)",
                      }}
                      transition={{
                        duration: 0.75,
                        ease: "easeInOut",
                      }}
                      className="
                        absolute
                        inset-0
                      "
                    >
                      <p
                        className="
                          text-xs
                          font-medium
                          text-mecho-purple
                        "
                      >
                        {preview.platform} · {preview.language}
                      </p>

                      <h3
                        className="
                          mt-3
                          max-w-xl
                          text-2xl
                          font-semibold
                          leading-[1.08]
                          tracking-[-0.045em]

                          sm:text-3xl
                        "
                      >
                        {preview.headline}
                      </h3>

                      <p
                        className="
                          mt-4
                          max-w-xl
                          text-sm
                          leading-7
                          text-muted-foreground
                        "
                      >
                        {preview.body}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Creative output rail */}

                <div
                  className="
                    mt-7
                    flex
                    flex-wrap
                    items-center
                    gap-2
                    border-t
                    border-border/60
                    pt-5
                  "
                >
                  <MediaOutput icon={ImageIcon} label="Visual" />

                  <MediaOutput icon={Play} label="Video" />

                  <MediaOutput icon={Mic2} label="Voice" />

                  <span
                    className="
                      ml-auto
                      hidden
                      text-xs
                      text-muted-foreground

                      sm:inline
                    "
                  >
                    One direction. Multiple ways to express it.
                  </span>
                </div>
              </div>

              {/* ---------------------------------------------
                  FLOWING CONNECTION

                  Continuous, horizontal and subtle.
                  It suggests ideas flowing through Mecho
                  without physically moving the interface.
              ---------------------------------------------- */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  left-[calc(41%-28px)]
                  top-[88px]
                  hidden
                  h-px
                  w-14
                  overflow-hidden
                  bg-border/50

                  lg:block
                "
              >
                <motion.div
                  animate={{
                    x: ["-100%", "220%"],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="
                    h-full
                    w-1/2
                    bg-mecho-gradient
                  "
                />
              </div>
            </div>
          </div>

          {/* Product capabilities */}

          <div
            className="
              mt-7
              flex
              flex-wrap
              items-center
              justify-center
              gap-x-3
              gap-y-2
              text-xs
              font-medium
              text-muted-foreground
            "
          >
            <span>Social</span>
            <Separator />
            <span>Campaigns</span>
            <Separator />
            <span>Speeches</span>
            <Separator />
            <span>Visuals</span>
            <Separator />
            <span>Video</span>
            <Separator />
            <span>Voice</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Direction({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        className="
          text-xs
          text-muted-foreground
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-sm
          font-medium
        "
      >
        {value}
      </p>
    </div>
  );
}

function MediaOutput({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        border-border/70
        bg-background
        px-3
        py-2
        text-xs
        font-medium
        shadow-sm
      "
    >
      <Icon
        className="
          size-3.5
          text-mecho-purple
        "
      />

      {label}
    </div>
  );
}

function Separator() {
  return (
    <span
      aria-hidden="true"
      className="
        size-1
        rounded-full
        bg-border
      "
    />
  );
}
