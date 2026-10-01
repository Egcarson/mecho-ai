"use client";

import { Check, FileText, Loader2, RefreshCw } from "lucide-react";

import type {
  GenerationPhase,
  GenerationResponse,
} from "@/components/dashboard/create/workflow-types";

import { CampaignResult } from "./campaign-result";

type CampaignGenerationExperienceProps = {
  phase: GenerationPhase;

  hasDocument: boolean;
  documentName: string | null;

  languages: string;

  generation: GenerationResponse | null;

  error: string;

  onBack: () => void;
  onRetry: () => void;
};

export function CampaignGenerationExperience({
  phase,
  hasDocument,
  documentName,
  languages,
  generation,
  error,
  onBack,
  onRetry,
}: CampaignGenerationExperienceProps) {
  if (phase === "completed" && generation) {
    return <CampaignResult generation={generation} onBack={onBack} />;
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
              Campaign generation failed
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
              {error || "Mecho couldn't complete this campaign generation."}
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

  const stages = getStages(hasDocument, phase);

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
              Campaign
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
              Mecho is shaping your campaign.
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
                {languages && (
                  <span>
                    Languages:{" "}
                    <span className="text-foreground/80">{languages}</span>
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

function getStages(hasDocument: boolean, phase: GenerationPhase) {
  const creatingProjectComplete = phase !== "creating_project";

  const documentComplete =
    !hasDocument || phase === "generating" || phase === "completed";

  const generationComplete = phase === "completed";

  const stages = [
    {
      label: "Setting up campaign",
      helper: "Preparing your campaign brief and generation context.",
      status:
        phase === "creating_project"
          ? "active"
          : creatingProjectComplete
            ? "completed"
            : "waiting",
    },
  ] as {
    label: string;
    helper: string;
    status: StageStatus;
  }[];

  if (hasDocument) {
    stages.push({
      label: "Reading source material",
      helper: "Extracting useful context from your supporting document.",
      status:
        phase === "uploading_document"
          ? "active"
          : documentComplete
            ? "completed"
            : "waiting",
    });
  }

  stages.push({
    label: "Creating campaign",
    helper:
      "Shaping the title, theme, main message, supporting content and next step.",
    status:
      phase === "generating"
        ? "active"
        : generationComplete
          ? "completed"
          : "waiting",
  });

  return stages;
}

function getPhaseDescription(phase: GenerationPhase, hasDocument: boolean) {
  switch (phase) {
    case "creating_project":
      return "Mecho is preparing the campaign workspace and organizing your brief.";

    case "uploading_document":
      return hasDocument
        ? "Mecho is reading your source material and grounding the campaign in the information you provided."
        : "Mecho is preparing your campaign.";

    case "generating":
      return "Mecho is turning your objective into a clear, structured campaign message.";

    default:
      return "Mecho is preparing your campaign.";
  }
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
