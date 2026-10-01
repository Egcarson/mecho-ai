"use client";

import { ArrowLeft, Check, Loader2, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

import type {
  GenerationPhase,
  GenerationResponse,
} from "@/components/dashboard/create/workflow-types";
import { AmbientBackground } from "@/components/dashboard/create/shared/ambient-background";

import { SocialResult } from "./social-result";

type SocialGenerationExperienceProps = {
  phase: GenerationPhase;
  hasDocument: boolean;
  documentName: string | null;
  platforms: string;
  languages: string;
  generation: GenerationResponse | null;
  error: string;
  onBack: () => void;
  onRetry: () => void;
};

export function SocialGenerationExperience({
  phase,
  hasDocument,
  documentName,
  platforms,
  languages,
  generation,
  error,
  onBack,
  onRetry,
}: SocialGenerationExperienceProps) {
  if (phase === "completed" && generation) {
    return <SocialResult generation={generation} onBack={onBack} />;
  }

  if (phase === "failed") {
    return (
      <main
        className="
          relative
          flex
          min-h-screen
          items-center
          justify-center
          overflow-hidden
          bg-background
          px-4
          py-12
        "
      >
        <AmbientBackground />

        <motion.div
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            relative
            z-10
            w-full
            max-w-xl
            text-center
          "
        >
          <motion.button
            type="button"
            onClick={onRetry}
            whileHover={{
              scale: 1.06,
            }}
            whileTap={{
              scale: 0.94,
            }}
            aria-label="Retry generation"
            title="Try again"
            className="
              group
              mx-auto
              flex
              size-12
              items-center
              justify-center
              rounded-full
              bg-muted
              text-muted-foreground

              transition-colors
              duration-300

              hover:bg-mecho-purple-soft
              hover:text-mecho-purple

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-mecho-purple/10
            "
          >
            <RefreshCw
              className="
                size-5
                transition-transform
                duration-500
                group-hover:rotate-180
              "
            />
          </motion.button>

          <h1
            className="
              mt-6
              text-3xl
              font-semibold
              tracking-[-0.045em]

              sm:text-4xl
            "
          >
            We hit a snag.
          </h1>

          <p
            className="
              mx-auto
              mt-4
              max-w-md
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            {error || "Mecho couldn't finish this creation."}
          </p>

          <div
            className="
              mt-8
              flex
              flex-wrap
              items-center
              justify-center
              gap-3
            "
          >
            <button
              type="button"
              onClick={onBack}
              className="
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-border/70
                px-5

                text-sm
                font-medium

                transition-colors

                hover:bg-muted/50
              "
            >
              <ArrowLeft className="size-4" />
              Back to review
            </button>

            <button
              type="button"
              onClick={onRetry}
              className="
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-full
                bg-mecho-gradient
                px-5

                text-sm
                font-semibold
                text-white

                transition-all
                duration-300

                hover:-translate-y-0.5
              "
            >
              <RefreshCw className="size-4" />
              Try again
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  const stages = [
    {
      id: "project",
      label: "Setting up your project",
      active: phase === "creating_project",
      complete: phase === "uploading_document" || phase === "generating",
    },

    ...(hasDocument
      ? [
          {
            id: "document",
            label: "Reading your document",
            active: phase === "uploading_document",
            complete: phase === "generating",
          },
        ]
      : []),

    {
      id: "generation",
      label: "Creating your content",
      active: phase === "generating",
      complete: false,
    },
  ];

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-background
        px-4
        py-12
        text-foreground

        sm:px-6
      "
    >
      <AmbientBackground />

      <motion.section
        initial={{
          opacity: 0,
          y: 18,
          scale: 0.99,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          z-10
          w-full
          max-w-2xl
        "
      >
        <div className="text-center">
          <div
            className="
              relative
              mx-auto
              flex
              size-12
              items-center
              justify-center
            "
          >
            <motion.span
              animate={{
                scale: [1, 1.9, 1.9],
                opacity: [0.22, 0, 0],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="
                absolute
                inset-0
                rounded-full
                bg-mecho-purple
              "
            />

            <motion.div
              animate={{
                scale: [1, 1.06, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                relative
                z-10
                flex
                size-11
                items-center
                justify-center
                rounded-full
                bg-mecho-purple-soft
                text-sm
                font-bold
                text-mecho-purple
              "
            >
              M
            </motion.div>
          </div>

          <p
            className="
              mt-5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-mecho-purple
            "
          >
            Mecho
          </p>

          <h1
            className="
              mt-3
              text-3xl
              font-semibold
              tracking-[-0.045em]

              sm:text-4xl
            "
          >
            Bringing it together...
          </h1>

          <p
            className="
              mx-auto
              mt-4
              max-w-lg
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            {getPhaseDescription(
              phase,
              hasDocument,
              documentName,
              platforms,
              languages,
            )}
          </p>
        </div>

        <div
          className="
            mx-auto
            mt-10
            max-w-md
          "
        >
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className="
                  relative
                  flex
                  gap-4
                "
            >
              {index < stages.length - 1 && (
                <div
                  className="
                      absolute
                      left-[15px]
                      top-8
                      h-[calc(100%-12px)]
                      w-px
                      bg-border/70
                    "
                />
              )}

              <div
                className="
                    relative
                    z-10
                    flex
                    size-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    bg-background
                  "
              >
                {stage.complete ? (
                  <div
                    className="
                        flex
                        size-full
                        items-center
                        justify-center
                        rounded-full
                        border-mecho-purple/20
                        bg-mecho-purple-soft
                        text-mecho-purple
                      "
                  >
                    <Check className="size-3.5" />
                  </div>
                ) : stage.active ? (
                  <Loader2
                    className="
                        size-4
                        animate-spin
                        text-mecho-purple
                      "
                  />
                ) : (
                  <span
                    className="
                        size-2
                        rounded-full
                        bg-border
                      "
                  />
                )}
              </div>

              <div
                className="
                    min-h-[62px]
                    pt-1
                  "
              >
                <p
                  className={`
                      text-sm
                      font-medium

                      ${
                        stage.active || stage.complete
                          ? "text-foreground"
                          : "text-muted-foreground/60"
                      }
                    `}
                >
                  {stage.label}
                </p>

                {stage.active && (
                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 4,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="
                        mt-1
                        text-xs
                        leading-5
                        text-muted-foreground
                      "
                  >
                    {getStageHelper(stage.id, documentName)}
                  </motion.p>
                )}
              </div>
            </div>
          ))}
        </div>

        <p
          className="
            mt-7
            text-center
            text-xs
            text-muted-foreground/70
          "
        >
          You can stay here while Mecho finishes your content.
        </p>
      </motion.section>
    </main>
  );
}

function getPhaseDescription(
  phase: GenerationPhase,
  hasDocument: boolean,
  documentName: string | null,
  platforms: string,
  languages: string,
) {
  if (phase === "creating_project") {
    return "Saving your direction so everything Mecho creates stays organised in one place.";
  }

  if (phase === "uploading_document") {
    return documentName
      ? `Reading ${documentName} and pulling out the useful context behind your idea.`
      : "Reading your document and understanding its context.";
  }

  if (phase === "generating") {
    const destination = platforms || "your platforms";

    const language = languages || "your languages";

    return `Shaping the message for ${destination} and adapting it for ${language}.`;
  }

  if (hasDocument) {
    return "Mecho is bringing your idea and document together.";
  }

  return "Mecho is bringing your direction together.";
}

function getStageHelper(stage: string, documentName: string | null) {
  switch (stage) {
    case "project":
      return "Saving your creative direction.";

    case "document":
      return documentName
        ? `Extracting useful context from ${documentName}.`
        : "Reading the source material.";

    case "generation":
      return "Using your goal, audience, tone, platforms and languages to build the content.";

    default:
      return "";
  }
}
