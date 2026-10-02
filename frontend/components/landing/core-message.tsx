"use client";

import { motion } from "motion/react";
import { ArrowDownRight, Languages, Layers3, WandSparkles } from "lucide-react";

const messages = [
  {
    number: "01",
    eyebrow: "Bring the intention",
    title: "Start with what you mean.",
    description:
      "An idea. A product. A campaign. A speech. Even a rough thought. Tell Mecho what you're trying to achieve — not how to prompt it.",
    note: "No perfect prompt required.",
    icon: WandSparkles,
    word: "IDEA",
  },
  {
    number: "02",
    eyebrow: "Shape the message",
    title: "Make it belong.",
    description:
      "Mecho shapes the direction around the audience, platform, tone and language — so the message feels made for where it's going.",
    note: "Audience • Platform • Tone • Language",
    icon: Languages,
    word: "ADAPT",
  },
  {
    number: "03",
    eyebrow: "Let it expand",
    title: "One direction. More ways to express it.",
    description:
      "Carry the same creative thought into content, visuals, video and natural voice without rebuilding everything from scratch.",
    note: "Content • Visuals • Video • Voice",
    icon: Layers3,
    word: "ECHO",
  },
];

export function CoreMessage() {
  return (
    <section
      className="
        relative
        isolate
        overflow-hidden
        border-y
        border-border/60
        bg-background
        px-4
        py-24

        sm:px-6
        sm:py-28

        lg:px-8
        lg:py-36
      "
    >
      {/* =====================================================
          AMBIENT MECHO CANVAS
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
            x: ["-5%", "4%", "-5%"],
            y: ["0%", "4%", "0%"],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -left-40
            top-[12%]
            h-[460px]
            w-[460px]
            rounded-full
            bg-mecho-purple/8
            blur-[150px]
          "
        />

        <motion.div
          animate={{
            x: ["3%", "-3%", "3%"],
            y: ["2%", "-3%", "2%"],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -right-32
            bottom-[8%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#ff7a1a]/8
            blur-[150px]
          "
        />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            SECTION INTRO
        ====================================================== */}

        <div
          className="
            grid
            gap-8

            lg:grid-cols-[0.9fr_1.1fr]
            lg:items-end
          "
        >
          <div>
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-mecho-purple
              "
            >
              The Mecho way
            </p>

            <h2
              className="
                mt-5
                max-w-3xl
                text-4xl
                font-semibold
                leading-[0.98]
                tracking-[-0.06em]

                sm:text-5xl

                lg:text-[4.8rem]
              "
            >
              Creativity starts
              <br />
              <span className="text-mecho-gradient">before the output.</span>
            </h2>
          </div>

          <div
            className="
              max-w-xl

              lg:ml-auto
            "
          >
            <p
              className="
                text-base
                leading-8
                text-muted-foreground

                sm:text-lg
              "
            >
              Mecho does more than generate. It carries your intention through
              the decisions that make communication feel right.
            </p>

            <div
              className="
                mt-6
                flex
                items-center
                gap-3
                text-sm
                font-medium
              "
            >
              <span>Idea</span>

              <span
                className="
                  h-px
                  w-8
                  bg-border
                "
              />

              <span>Direction</span>

              <span
                className="
                  h-px
                  w-8
                  bg-border
                "
              />

              <span>Expression</span>
            </div>
          </div>
        </div>

        {/* =====================================================
            CREATIVE STORY
        ====================================================== */}

        <div
          className="
            relative
            mt-20

            sm:mt-24

            lg:mt-32
          "
        >
          {/* Vertical journey line */}

          <div
            aria-hidden="true"
            className="
              absolute
              left-[41px]
              top-20
              hidden
              h-[calc(100%-10rem)]
              w-px
              overflow-hidden
              bg-border/60

              md:block
            "
          >
            <motion.div
              animate={{
                y: ["-100%", "350%"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
              className="
                h-32
                w-full
                bg-mecho-gradient
              "
            />
          </div>

          <div className="space-y-8">
            {messages.map((item, index) => (
              <MessageMoment key={item.number} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type MessageMomentProps = {
  item: (typeof messages)[number];
  index: number;
};

function MessageMoment({ item, index }: MessageMomentProps) {
  const Icon = item.icon;

  const reversed = index === 1;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 22,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[2rem]
        border
        border-border/60
        bg-background/75
        shadow-[0_25px_90px_rgba(47,1,117,0.055)]
        backdrop-blur-xl

        sm:rounded-[2.5rem]
      "
    >
      {/* giant background word */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-7
          right-4
          select-none
          text-[6rem]
          font-semibold
          leading-none
          tracking-[-0.08em]
          text-foreground/[0.025]

          sm:text-[9rem]

          lg:-bottom-12
          lg:right-8
          lg:text-[13rem]
        "
      >
        {item.word}
      </span>

      {/* soft hover color */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-24
          -top-32
          size-[320px]
          rounded-full
          bg-mecho-gradient
          opacity-0
          blur-[110px]
          transition-opacity
          duration-700

          group-hover:opacity-[0.08]
        "
      />

      <div
        className={`
          relative
          grid
          gap-8
          px-5
          py-7

          sm:p-8

          md:grid-cols-[150px_1fr]
          md:gap-12

          lg:grid-cols-[190px_1fr]
          lg:p-12

          ${reversed ? "lg:[&>div:last-child]:pl-12" : ""}
        `}
      >
        {/* ===================================================
            OVERSIZED NUMBER
        ==================================================== */}

        <div
          className="
            min-w-0
        "
        >
          <span
            className="
                block
                max-w-full
                text-[4.75rem]
                font-semibold
                leading-[0.82]
                tracking-[-0.075em]
                text-mecho-gradient

                sm:text-[6rem]

                md:text-[7rem]

                lg:text-[9rem]
                "
          >
            {item.number}
          </span>

          <div
            className="
                mt-5
                flex
                size-11
                items-center
                justify-center
                rounded-full
                border
                border-border/70
                bg-background
                text-mecho-purple
                shadow-sm

                md:mt-8
                "
          >
            <Icon className="size-4" />
          </div>
        </div>

        {/* ===================================================
            MESSAGE
        ==================================================== */}

        <div
          className="
            relative
            max-w-4xl
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-mecho-purple
              "
            >
              {item.eyebrow}
            </span>

            <span
              className="
                h-px
                w-10
                bg-border
              "
            />

            <ArrowDownRight
              className="
                size-4
                text-muted-foreground/50
              "
            />
          </div>

          <h3
            className="
              mt-5
              max-w-3xl
              text-3xl
              font-semibold
              leading-[1.02]
              tracking-[-0.05em]

              sm:text-4xl

              lg:text-[3.6rem]
            "
          >
            {item.title}
          </h3>

          <p
            className="
              mt-6
              max-w-2xl
              text-sm
              leading-7
              text-muted-foreground

              sm:text-base
              sm:leading-8
            "
          >
            {item.description}
          </p>

          <div
            className="
              mt-8
              inline-flex
              items-center
              rounded-full
              border
              border-border/60
              bg-muted/25
              px-4
              py-2.5
              text-xs
              font-medium
              text-muted-foreground
            "
          >
            {item.note}
          </div>
        </div>
      </div>

      {/* bottom creative line */}

      <div
        aria-hidden="true"
        className="
          h-[2px]
          w-full
          overflow-hidden
          bg-border/30
        "
      >
        <motion.div
          initial={{
            scaleX: 0,
          }}
          whileInView={{
            scaleX: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 1.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            h-full
            origin-left
            bg-mecho-gradient
          "
        />
      </div>
    </motion.article>
  );
}
