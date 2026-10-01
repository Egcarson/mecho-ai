"use client";

import { Check, FileText, Loader2, RefreshCw } from "lucide-react";

import type {
  GenerationPhase,
  GenerationResponse,
} from "@/components/dashboard/create/workflow-types";

import { SpeechResult } from "./speech-result";

type SpeechGenerationExperienceProps = {
  phase: GenerationPhase;

  hasDocument: boolean;
  documentName: string | null;

  language: string;

  generation: GenerationResponse | null;

  error: string;

  onBack: () => void;
  onRetry: () => void;
};

export function SpeechGenerationExperience({
  phase,
  hasDocument,
  documentName,
  language,
  generation,
  error,
  onBack,
  onRetry,
}: SpeechGenerationExperienceProps) {
  if (phase === "completed" && generation) {
    return (
      <SpeechResult
        generation={generation}
        language={language}
        onBack={onBack}
      />
    );
  }

  if (phase === "failed") {
    return (
      <main
        className="
          relative
          min-h-screen
          overflow-hidden
        "
      >
        <AmbientBackground />

        <div
          className="
            relative
            mx-auto
            flex
            min-h-screen
            w-full
            max-w-3xl
            items-center
            px-4
            py-14

            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              w-full
              rounded-[1.75rem]
              border
              border-border/60
              bg-background/85
              p-6
              shadow-[0_24px_80px_rgba(39,12,61,0.07)]
              backdrop-blur-xl

              sm:p-8
            "
          >
            <div
              className="
                flex
                size-12
                items-center
                justify-center
                rounded-2xl
                bg-red-500/8
                text-red-600

                dark:text-red-400
              "
            >
              <RefreshCw className="size-5" />
            </div>

            <h1
              className="
                mt-6
                text-3xl
                font-semibold
                tracking-[-0.04em]
              "
            >
              Speech generation failed
            </h1>

            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              {error || "Mecho couldn't complete this speech generation."}
            </p>

            <div
              className="
                mt-7
                flex
                flex-wrap
                gap-3
              "
            >
              <button
                type="button"
                onClick={onRetry}
                className="
                  inline-flex
                  h-10
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

                  hover:-translate-y-0.5
                "
              >
                <RefreshCw className="size-4" />
                Try again
              </button>

              <button
                type="button"
                onClick={onBack}
                className="
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-border/60
                  bg-background
                  px-5
                  text-sm
                  font-medium
                  text-foreground/75
                  transition-all

                  hover:border-mecho-purple/20
                  hover:bg-mecho-purple-soft/40
                  hover:text-mecho-purple
                "
              >
                Back to review
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const stages = getSpeechStages(phase, hasDocument);

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
      "
    >
      <AmbientBackground />

      <div
        className="
          relative
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-4xl
          items-center
          px-4
          py-14

          sm:px-6
          lg:px-8
        "
      >
        <div className="w-full">
          <div className="text-center">
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.14em]
                text-mecho-purple
              "
            >
              Speech
            </p>

            <h1
              className="
                mt-4
                text-4xl
                font-semibold
                tracking-[-0.05em]

                sm:text-5xl
              "
            >
              Mecho is shaping your speech.
            </h1>

            <p
              className="
                mx-auto
                mt-4
                max-w-xl
                text-sm
                leading-6
                text-muted-foreground

                sm:text-base
              "
            >
              {getPhaseDescription(phase, hasDocument)}
            </p>
          </div>

          <div
            className="
              mx-auto
              mt-10
              max-w-2xl
              rounded-[1.75rem]
              border
              border-border/60
              bg-background/85
              p-6
              shadow-[0_24px_80px_rgba(39,12,61,0.06)]
              backdrop-blur-xl

              sm:p-8
            "
          >
            <div className="space-y-6">
              {stages.map((stage) => (
                <GenerationStage
                  key={stage.label}
                  label={stage.label}
                  helper={stage.helper}
                  status={stage.status}
                />
              ))}
            </div>

            <div
              className="
                mt-8
                border-t
                border-border/60
                pt-6
              "
            >
              <div
                className="
                  flex
                  flex-wrap
                  gap-x-5
                  gap-y-2
                  text-xs
                  text-muted-foreground
                "
              >
                {language && (
                  <span>
                    Language:{" "}
                    <span className="text-foreground/80">
                      {formatLabel(language)}
                    </span>
                  </span>
                )}

                {hasDocument && documentName && (
                  <span
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                      "
                  >
                    <FileText className="size-3.5" />

                    {documentName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

type StageStatus = "waiting" | "active" | "completed";

type GenerationStageProps = {
  label: string;
  helper: string;
  status: StageStatus;
};

function GenerationStage({ label, helper, status }: GenerationStageProps) {
  return (
    <div
      className="
        flex
        items-start
        gap-4
      "
    >
      <div
        className={`
          mt-0.5
          flex
          size-9
          shrink-0
          items-center
          justify-center
          rounded-full
          border

          ${
            status === "completed"
              ? `
                border-emerald-500/15
                bg-emerald-500/8
                text-emerald-600

                dark:text-emerald-400
              `
              : status === "active"
                ? `
                  border-mecho-purple/15
                  bg-mecho-purple-soft/70
                  text-mecho-purple
                `
                : `
                  border-border/60
                  bg-muted/30
                  text-muted-foreground
                `
          }
        `}
      >
        {status === "completed" ? (
          <Check className="size-4" />
        ) : status === "active" ? (
          <Loader2
            className="
              size-4
              animate-spin
            "
          />
        ) : (
          <span
            className="
              size-1.5
              rounded-full
              bg-current
              opacity-60
            "
          />
        )}
      </div>

      <div>
        <p
          className={`
            text-sm
            font-medium

            ${
              status === "waiting" ? "text-muted-foreground" : "text-foreground"
            }
          `}
        >
          {label}
        </p>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-muted-foreground
          "
        >
          {helper}
        </p>
      </div>
    </div>
  );
}

function getSpeechStages(phase: GenerationPhase, hasDocument: boolean) {
  const stages: {
    label: string;
    helper: string;
    status: StageStatus;
  }[] = [
    {
      label: "Setting up speech",

      helper: "Preparing the occasion, audience, tone and memories.",

      status: phase === "creating_project" ? "active" : "completed",
    },
  ];

  if (hasDocument) {
    stages.push({
      label: "Reading source material",

      helper:
        "Using your supporting document to add relevant context to the speech.",

      status:
        phase === "uploading_document"
          ? "active"
          : phase === "generating" || phase === "completed"
            ? "completed"
            : "waiting",
    });
  }

  stages.push({
    label: "Writing your speech",

    helper:
      "Weaving your memories and message into a natural, meaningful speech.",

    status:
      phase === "generating"
        ? "active"
        : phase === "completed"
          ? "completed"
          : "waiting",
  });

  return stages;
}

function getPhaseDescription(phase: GenerationPhase, hasDocument: boolean) {
  switch (phase) {
    case "creating_project":
      return "Mecho is preparing your speech context and organizing everything you shared.";

    case "uploading_document":
      return hasDocument
        ? "Mecho is reading your supporting material before writing the speech."
        : "Mecho is preparing your speech.";

    case "generating":
      return "Mecho is turning your memories, objective and context into a natural speech.";

    default:
      return "Mecho is preparing your speech.";
  }
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function AmbientBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[8%]
          top-[18%]
          size-[340px]
          rounded-full
          bg-mecho-purple/7
          blur-[140px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[10%]
          right-[8%]
          size-[300px]
          rounded-full
          bg-mecho-orange/6
          blur-[140px]
        "
      />
    </>
  );
}
