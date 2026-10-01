"use client";

import { motion } from "motion/react";
import { ArrowRight, Megaphone, MessageSquareText, Mic2 } from "lucide-react";

type Workflow = "social" | "campaign" | "speech";

type MechoIntentResultProps = {
  prompt: string;
  recommended: Workflow;
  onContinue: (workflow: Workflow) => void;
  onReset: () => void;
};

const workflowDetails = {
  social: {
    title: "Social",
    description:
      "This sounds like something that needs content made to catch attention and work naturally on social platforms.",
    icon: MessageSquareText,
    context: ["Instagram", "Facebook", "WhatsApp"],
  },

  campaign: {
    title: "Campaign",
    description:
      "This fits a broader awareness or institutional message where the goal is to inform, mobilize or build participation.",
    icon: Megaphone,
    context: ["Awareness", "Public interest", "Events"],
  },

  speech: {
    title: "Speech",
    description:
      "This sounds like something that should be shaped around a moment, audience and the way you want people to feel.",
    icon: Mic2,
    context: ["Occasion", "Audience", "Tone"],
  },
};

export function MechoIntentResult({
  prompt,
  recommended,
  onContinue,
  onReset,
}: MechoIntentResultProps) {
  const current = workflowDetails[recommended];
  const CurrentIcon = current.icon;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 14,
        scale: 0.985,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        overflow-hidden
        rounded-[2rem]
        border border-border/80
        bg-background/92
        shadow-[0_30px_100px_rgba(47,1,117,0.10)]
        backdrop-blur-2xl
      "
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div
            className="
              flex size-9
              items-center justify-center
              rounded-full
              bg-mecho-purple-soft
              text-mecho-purple
            "
          >
            <span className="text-xs font-bold">M</span>
          </div>

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.16em]
              text-mecho-purple
            "
          >
            Mecho
          </p>
        </div>

        <p
          className="
            mt-6
            max-w-2xl
            text-sm
            leading-6
            text-muted-foreground
          "
        >
          “{prompt}”
        </p>

        <div className="mt-7 border-t border-border/70 pt-7">
          <p
            className="
              text-sm
              font-medium
              text-muted-foreground
            "
          >
            I know where I&apos;d start.
          </p>

          <div className="mt-4 flex items-start gap-4">
            <div
              className="
                flex size-12
                shrink-0
                items-center justify-center
                rounded-2xl
                bg-mecho-purple-soft
                text-mecho-purple
              "
            >
              <CurrentIcon className="size-5" />
            </div>

            <div>
              <h2
                className="
                  text-3xl
                  font-semibold
                  tracking-[-0.045em]
                  text-foreground
                "
              >
                {current.title}
              </h2>

              <p
                className="
                  mt-3
                  max-w-xl
                  text-[15px]
                  leading-7
                  text-muted-foreground
                "
              >
                {current.description}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {current.context.map((item) => (
              <span
                key={item}
                className="
                  rounded-full
                  border border-border/70
                  px-3 py-1.5
                  text-xs
                  font-medium
                  text-muted-foreground
                "
              >
                {item}
              </span>
            ))}
          </div>

          <div
            className="
              mt-8
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <button
              type="button"
              onClick={onReset}
              className="
                text-sm
                font-medium
                text-muted-foreground
                transition-colors
                hover:text-foreground
              "
            >
              Try something else
            </button>

            <button
              type="button"
              onClick={() => onContinue(recommended)}
              className="
                inline-flex
                h-11
                items-center
                justify-center
                rounded-full
                bg-mecho-gradient
                px-6
                text-sm
                font-semibold
                text-white
                shadow-[0_10px_28px_rgba(111,44,255,0.18)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_14px_36px_rgba(111,44,255,0.26)]
              "
            >
              Continue with {current.title}
              <ArrowRight className="ml-2 size-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
