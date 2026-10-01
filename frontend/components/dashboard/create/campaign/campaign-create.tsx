"use client";

import { type ChangeEvent, useMemo, useRef, useState } from "react";

import { FileText, Paperclip, X } from "lucide-react";

import { toast } from "sonner";

import { WorkflowShell } from "@/components/dashboard/create/workflow-shell";

import {
  contentObjectives,
  contentTones,
  contentLengths,
  languages,
} from "@/components/dashboard/create/workflow-options";

import type {
  CampaignData,
  GenerationPhase,
  GenerationResponse,
  Option,
  ProjectResponse,
} from "@/components/dashboard/create/workflow-types";

import { ChoiceGrid } from "@/components/dashboard/create/shared/choice-grid";
import { ReviewRow } from "@/components/dashboard/create/shared/review-row";
import { TagInput } from "@/components/dashboard/create/shared/tag-input";

import { CampaignGenerationExperience } from "./campaign-generation-experience";

import { authFetch } from "@/lib/auth-fetch";

const INITIAL_DATA: CampaignData = {
  brief: "",
  objective: "",
  audiences: [],
  tone: "",
  languages: [],
  length: "",
  document: null,
};

export function CampaignCreate() {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState<CampaignData>(INITIAL_DATA);

  const [generationPhase, setGenerationPhase] =
    useState<GenerationPhase>("idle");

  const [generation, setGeneration] = useState<GenerationResponse | null>(null);

  const [projectUid, setProjectUid] = useState<string | null>(null);

  const [lastError, setLastError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const steps = useMemo(
    () => [
      {
        title: "What is this campaign about?",
        description:
          "Describe the campaign, initiative, issue, event or public message you want Mecho to develop.",
      },
      {
        title: "What should this campaign achieve?",
        description:
          "Choose the main objective Mecho should build the campaign around.",
      },
      {
        title: "Who should this campaign reach?",
        description:
          "Add one or more audiences. You can be as specific as the campaign requires.",
      },
      {
        title: "How should it sound?",
        description:
          "Choose the tone that best fits the campaign and the people it needs to reach.",
      },
      {
        title: "Which languages should Mecho use?",
        description: "Choose one or more languages for the campaign.",
      },
      {
        title: "How detailed should the campaign be?",
        description:
          "Choose the amount of depth you want in the final campaign message.",
      },
      {
        title: "Review your campaign",
        description: "Check the direction before Mecho starts creating.",
      },
    ],
    [],
  );

  const isLastStep = step === steps.length - 1;

  function updateField<K extends keyof CampaignData>(
    field: K,
    value: CampaignData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleLanguage(value: string) {
    setFormData((current) => {
      const selected = current.languages.includes(value);

      return {
        ...current,

        languages: selected
          ? current.languages.filter((item) => item !== value)
          : [...current.languages, value],
      };
    });
  }

  function canContinue() {
    switch (step) {
      case 0:
        return Boolean(formData.brief.trim() || formData.document);

      case 1:
        return Boolean(formData.objective);

      case 2:
        return formData.audiences.length > 0;

      case 3:
        return Boolean(formData.tone);

      case 4:
        return formData.languages.length > 0;

      case 5:
        return Boolean(formData.length);

      case 6:
        return true;

      default:
        return false;
    }
  }

  function nextStep() {
    if (!canContinue()) {
      return;
    }

    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0));
  }

  function getLabel(options: Option[], value: string) {
    return options.find((option) => option.value === value)?.label ?? value;
  }

  function getLabels(options: Option[], values: string[]) {
    return values.map((value) => getLabel(options, value)).join(", ");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const extension = getFileExtension(file.name);

    const allowedExtensions = ["pdf", "docx", "txt"];

    if (!allowedExtensions.includes(extension)) {
      toast.error("Please upload a PDF, DOCX or TXT file.");

      event.target.value = "";

      return;
    }

    updateField("document", file);

    event.target.value = "";
  }

  function removeDocument() {
    updateField("document", null);
  }

  async function runGeneration({
    reuseProjectUid,
  }: {
    reuseProjectUid?: string;
  } = {}) {
    setLastError("");
    setGeneration(null);

    let activeProjectUid = reuseProjectUid;

    try {
      /*
       * STEP 1:
       * Create project only when
       * we're not retrying an
       * existing one.
       */

      if (!activeProjectUid) {
        setGenerationPhase("creating_project");

        const projectResponse = await fetch("/api/projects", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            name: createProjectName(formData.brief),

            workflow: "campaign",

            objective: formData.objective,

            tone: formData.tone,

            audiences: formData.audiences,

            languages: formData.languages,

            length: formData.length,

            description: formData.brief.trim() || undefined,
          }),
        });

        if (!projectResponse.ok) {
          throw new Error(
            await getApiError(
              projectResponse,
              "Couldn't create the campaign project.",
            ),
          );
        }

        const project = (await projectResponse.json()) as ProjectResponse;

        activeProjectUid = project.uid;

        setProjectUid(project.uid);

        /*
         * STEP 2:
         * Upload supporting document
         * after the project exists.
         */

        if (formData.document) {
          setGenerationPhase("uploading_document");

          const uploadData = new FormData();

          uploadData.append("file", formData.document);

          const uploadResponse = await authFetch(
            `/api/projects/${project.uid}/document`,
            {
              method: "POST",
              body: uploadData,
            },
          );

          if (!uploadResponse.ok) {
            throw new Error(
              await getApiError(
                uploadResponse,
                "Couldn't upload the supporting document.",
              ),
            );
          }
        }
      }

      if (!activeProjectUid) {
        throw new Error("Mecho couldn't determine the active project.");
      }

      /*
       * STEP 3:
       * Generate campaign.
       */

      setGenerationPhase("generating");

      const generationResponse = await authFetch(
        `/api/projects/${activeProjectUid}/generations`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            input_content: formData.brief.trim(),

            memories: "",
          }),
        },
      );

      if (!generationResponse.ok) {
        throw new Error(
          await getApiError(
            generationResponse,
            "Mecho couldn't generate this campaign.",
          ),
        );
      }

      const result = (await generationResponse.json()) as GenerationResponse;

      setGeneration(result);

      setGenerationPhase("completed");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the campaign.";

      setLastError(message);

      setGenerationPhase("failed");

      toast.error(message);
    }
  }

  function handleGenerate() {
    void runGeneration();
  }

  function retryGeneration() {
    void runGeneration({
      reuseProjectUid: projectUid ?? undefined,
    });
  }

  function returnToReview() {
    setGenerationPhase("idle");

    setLastError("");
  }

  if (generationPhase !== "idle") {
    return (
      <CampaignGenerationExperience
        phase={generationPhase}
        hasDocument={Boolean(formData.document)}
        documentName={formData.document?.name ?? null}
        languages={getLabels(languages, formData.languages)}
        generation={generation}
        error={lastError}
        onBack={returnToReview}
        onRetry={retryGeneration}
      />
    );
  }

  return (
    <WorkflowShell
      eyebrow="Campaign"
      title={steps[step].title}
      description={steps[step].description}
      step={step}
      totalSteps={steps.length}
      onPrevious={previousStep}
      onNext={nextStep}
      onSubmit={handleGenerate}
      canGoNext={canContinue()}
      isLastStep={isLastStep}
      submitLabel="Generate"
    >
      {step === 0 && (
        <div
          className="
      overflow-hidden
      rounded-[1.5rem]
      border
      border-border/70
      bg-background/80
      transition-all

      focus-within:border-mecho-purple/30
      focus-within:ring-4
      focus-within:ring-mecho-purple/5
    "
        >
          <textarea
            value={formData.brief}
            onChange={(event) => updateField("brief", event.target.value)}
            autoFocus
            rows={5}
            placeholder="e.g. We want to raise awareness about the rising cost of food in Delta State..."
            className="
        min-h-[180px]
        w-full
        resize-none
        bg-transparent
        px-5
        py-4
        text-[17px]
        font-medium
        leading-7
        tracking-[-0.015em]
        outline-none

        placeholder:font-normal
        placeholder:text-muted-foreground/50
      "
          />

          <div
            className="
        border-t
        border-border/60
        px-4
        py-3
      "
          >
            {formData.document ? (
              <div
                className="
            flex
            items-center
            justify-between
            gap-3
          "
              >
                <div
                  className="
              flex
              min-w-0
              items-center
              gap-3
            "
                >
                  <div
                    className="
                flex
                size-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-mecho-purple-soft
                text-mecho-purple
              "
                  >
                    <FileText className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {formData.document.name}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatFileSize(formData.document.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeDocument}
                  aria-label="Remove document"
                  className="
              flex
              size-9
              shrink-0
              items-center
              justify-center
              rounded-full
              text-muted-foreground
              transition-colors

              hover:bg-muted
              hover:text-foreground
            "
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div
                className="
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
                  onClick={() => fileInputRef.current?.click()}
                  className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-muted-foreground
              transition-colors

              hover:text-foreground
            "
                >
                  <Paperclip className="size-4" />
                  Add a document
                </button>

                <p className="text-xs text-muted-foreground/70">
                  PDF, DOCX or TXT
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <ChoiceGrid
          options={contentObjectives}
          selected={formData.objective}
          onSelect={(value) => updateField("objective", value)}
        />
      )}

      {step === 2 && (
        <div
          className="
            mx-auto
            w-full
            max-w-2xl
          "
        >
          <TagInput
            values={formData.audiences}
            onChange={(audiences) => updateField("audiences", audiences)}
            placeholder="e.g. Parents in Delta State"
            addLabel="Add"
          />

          <p
            className="
              mt-4
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            Add each audience separately. Mecho will shape the campaign so it
            can speak clearly to all of them.
          </p>
        </div>
      )}

      {step === 3 && (
        <ChoiceGrid
          options={contentTones}
          selected={formData.tone}
          onSelect={(value) => updateField("tone", value)}
        />
      )}

      {step === 4 && (
        <ChoiceGrid
          options={languages}
          selected={formData.languages}
          onSelect={toggleLanguage}
          multiple
        />
      )}

      {step === 5 && (
        <ChoiceGrid
          options={contentLengths}
          selected={formData.length}
          onSelect={(value) => updateField("length", value)}
        />
      )}

      {step === 6 && <CampaignReview formData={formData} />}
    </WorkflowShell>
  );

  function CampaignReview({ formData }: { formData: CampaignData }) {
    return (
      <div
        className="
          mx-auto
          w-full
          max-w-2xl
          overflow-hidden
          rounded-[1.5rem]
          border
          border-border/60
          bg-background/70
        "
      >
        <ReviewRow
          label="Campaign"
          value={formData.brief.trim() || "Using supporting document"}
        />

        <ReviewRow
          label="Objective"
          value={getLabel(contentObjectives, formData.objective)}
        />

        <ReviewRow label="Audiences" value={formData.audiences.join(", ")} />

        <ReviewRow label="Tone" value={getLabel(contentTones, formData.tone)} />

        <ReviewRow
          label="Languages"
          value={getLabels(languages, formData.languages)}
        />

        <ReviewRow
          label="Length"
          value={getLabel(contentLengths, formData.length)}
        />

        {formData.document && (
          <ReviewRow label="Document" value={formData.document.name} last />
        )}

        {!formData.document && (
          <ReviewRow label="Source" value="Typed campaign brief" last />
        )}
      </div>
    );
  }
}

type CampaignSourceStepProps = {
  brief: string;
  document: File | null;

  fileInputRef: React.RefObject<HTMLInputElement | null>;

  onBriefChange: (value: string) => void;

  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;

  onRemoveDocument: () => void;
};

function CampaignSourceStep({
  brief,
  document,
  fileInputRef,
  onBriefChange,
  onFileChange,
  onRemoveDocument,
}: CampaignSourceStepProps) {
  return (
    <div
      className="
        mx-auto
        w-full
        max-w-2xl
      "
    >
      <textarea
        value={brief}
        onChange={(event) => onBriefChange(event.target.value)}
        rows={7}
        placeholder="Tell Mecho about the campaign, issue, initiative or message..."
        className="
          min-h-[190px]
          w-full
          resize-none
          rounded-[1.25rem]
          border
          border-border/70
          bg-background
          px-5
          py-4
          text-sm
          leading-7
          outline-none
          transition-all

          placeholder:text-muted-foreground/60

          focus:border-mecho-purple/30
          focus:ring-4
          focus:ring-mecho-purple/5
        "
      />

      <div
        className="
          my-5
          flex
          items-center
          gap-4
        "
      >
        <div
          className="
            h-px
            flex-1
            bg-border/60
          "
        />

        <span
          className="
            text-[11px]
            font-medium
            uppercase
            tracking-[0.12em]
            text-muted-foreground
          "
        >
          or
        </span>

        <div
          className="
            h-px
            flex-1
            bg-border/60
          "
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={onFileChange}
        className="hidden"
      />

      {!document ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-[1.25rem]
            border
            border-dashed
            border-border/70
            px-5
            py-7
            text-sm
            font-medium
            text-muted-foreground
            transition-all

            hover:border-mecho-purple/25
            hover:bg-mecho-purple-soft/30
            hover:text-mecho-purple
          "
        >
          <Paperclip className="size-4" />
          Add supporting document
        </button>
      ) : (
        <div
          className="
            flex
            items-center
            gap-4
            rounded-[1.25rem]
            border
            border-border/60
            bg-muted/20
            p-4
          "
        >
          <div
            className="
              flex
              size-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-mecho-purple-soft/60
              text-mecho-purple
            "
          >
            <FileText className="size-4" />
          </div>

          <div
            className="
              min-w-0
              flex-1
            "
          >
            <p
              className="
                truncate
                text-sm
                font-medium
              "
            >
              {document.name}
            </p>

            <p
              className="
                mt-1
                text-xs
                text-muted-foreground
              "
            >
              {formatFileSize(document.size)}
            </p>
          </div>

          <button
            type="button"
            onClick={onRemoveDocument}
            aria-label="Remove document"
            className="
              inline-flex
              size-8
              shrink-0
              items-center
              justify-center
              rounded-full
              text-muted-foreground
              transition-colors

              hover:bg-muted
              hover:text-foreground
            "
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <p
        className="
          mt-4
          text-xs
          leading-5
          text-muted-foreground
        "
      >
        You can write the campaign brief, upload supporting material, or use
        both.
      </p>
    </div>
  );
}

function createProjectName(brief: string) {
  const clean = brief.replace(/\s+/g, " ").trim();

  if (!clean) {
    return "Campaign";
  }

  const words = clean.split(" ");

  const shortened = words.slice(0, 7).join(" ");

  return words.length > 7 ? `${shortened}…` : shortened;
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function getApiError(response: Response, fallback: string) {
  try {
    const body = await response.json();

    if (typeof body?.detail === "string") {
      return body.detail;
    }

    if (Array.isArray(body?.detail)) {
      return body.detail
        .map((item: { msg?: string }) => item.msg)
        .filter(Boolean)
        .join(", ");
    }

    if (typeof body?.message === "string") {
      return body.message;
    }
  } catch {
    //
  }

  return fallback;
}
