"use client";

import { type ChangeEvent, useMemo, useRef, useState } from "react";

import { FileText, Paperclip, X } from "lucide-react";

import { toast } from "sonner";

import { WorkflowShell } from "@/components/dashboard/create/workflow-shell";

import {
  contentLengths,
  contentObjectives,
  contentTones,
  languages,
} from "@/components/dashboard/create/workflow-options";

import type {
  GenerationPhase,
  GenerationResponse,
  Option,
  ProjectResponse,
  SpeechData,
} from "@/components/dashboard/create/workflow-types";

import { ChoiceGrid } from "@/components/dashboard/create/shared/choice-grid";
import { ReviewRow } from "@/components/dashboard/create/shared/review-row";
import { TagInput } from "@/components/dashboard/create/shared/tag-input";

import { SpeechMemoryBuilder } from "./speech-memory-builder";
import { SpeechGenerationExperience } from "./speech-generation-experience";

import { authFetch } from "@/lib/auth-fetch";

const INITIAL_DATA: SpeechData = {
  brief: "",
  memories: [],
  objective: "",
  audiences: [],
  tone: "",
  language: "",
  length: "",
  document: null,
  targetDurationMinutes: null,
};

export function SpeechCreate() {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState<SpeechData>(INITIAL_DATA);

  const [generationPhase, setGenerationPhase] =
    useState<GenerationPhase>("idle");

  const [generation, setGeneration] = useState<GenerationResponse | null>(null);

  const [projectUid, setProjectUid] = useState<string | null>(null);

  const [lastError, setLastError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const steps = useMemo(
    () => [
      {
        title: "Tell Mecho about the speech",
        description:
          "Describe the occasion, who the speech is for, and anything important Mecho should understand.",
      },
      {
        title: "What memories should Mecho include?",
        description:
          "Add meaningful moments or experiences that should shape the speech.",
      },
      {
        title: "What should this speech achieve?",
        description: "Choose the main purpose behind the speech.",
      },
      {
        title: "Who will hear this speech?",
        description: "Add one or more groups of people who will be listening.",
      },
      {
        title: "How should the speech feel?",
        description:
          "Choose the tone that best fits the occasion and audience.",
      },
      {
        title: "Which language should Mecho use?",
        description: "Choose the language for the speech.",
      },
      {
        title: "How long should the speech be?",
        description:
          "Choose the overall length and optionally give Mecho an exact speaking-time target.",
      },
      {
        title: "Review your speech",
        description: "Check everything before Mecho starts writing.",
      },
    ],
    [],
  );

  const isLastStep = step === steps.length - 1;

  function updateField<K extends keyof SpeechData>(
    field: K,
    value: SpeechData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function canContinue() {
    switch (step) {
      case 0:
        return Boolean(formData.brief.trim() || formData.document);

      case 1:
        return formData.memories.length > 0;

      case 2:
        return Boolean(formData.objective);

      case 3:
        return formData.audiences.length > 0;

      case 4:
        return Boolean(formData.tone);

      case 5:
        return Boolean(formData.language);

      case 6:
        return Boolean(formData.length);

      case 7:
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

  function handleDocumentChange(event: ChangeEvent<HTMLInputElement>) {
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
       * ---------------------------------------------
       * 1. CREATE PROJECT
       * ---------------------------------------------
       */

      if (!activeProjectUid) {
        setGenerationPhase("creating_project");

        const projectResponse = await fetch("/api/projects", {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: createProjectName(formData.brief),

            workflow: "speech",

            objective: formData.objective,

            tone: formData.tone,

            audiences: formData.audiences,

            languages: [formData.language],

            length: formData.length,

            target_duration_minutes: formData.targetDurationMinutes,

            description: formData.brief.trim() || undefined,
          }),
        });

        if (!projectResponse.ok) {
          throw new Error(
            await getApiError(
              projectResponse,
              "Couldn't create the speech project.",
            ),
          );
        }

        const project = (await projectResponse.json()) as ProjectResponse;

        activeProjectUid = project.uid;

        setProjectUid(project.uid);

        /*
         * ---------------------------------------------
         * 2. OPTIONAL DOCUMENT UPLOAD
         * ---------------------------------------------
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
       * ---------------------------------------------
       * 3. GENERATE SPEECH
       * ---------------------------------------------
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

            memories: formData.memories,
          }),
        },
      );

      if (!generationResponse.ok) {
        throw new Error(
          await getApiError(
            generationResponse,
            "Mecho couldn't generate this speech.",
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
          : "Something went wrong while creating the speech.";

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
      <SpeechGenerationExperience
        phase={generationPhase}
        hasDocument={Boolean(formData.document)}
        documentName={formData.document?.name ?? null}
        language={formData.language}
        generation={generation}
        error={lastError}
        onBack={returnToReview}
        onRetry={retryGeneration}
      />
    );
  }

  return (
    <WorkflowShell
      eyebrow="Speech"
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
      {/* =================================================
          STEP 0 — SPEECH BRIEF + DOCUMENT
      ================================================== */}

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
            placeholder="e.g. I’m giving a wedding speech for my brother Emma. I want it to celebrate his journey, our years growing up together, and his relationship with Choice..."
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
                    <p
                      className="
                        truncate
                        text-sm
                        font-medium
                        text-foreground
                      "
                    >
                      {formData.document.name}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-muted-foreground
                      "
                    >
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

                <p
                  className="
                    text-xs
                    text-muted-foreground/70
                  "
                >
                  PDF, DOCX or TXT
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleDocumentChange}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* =================================================
          STEP 1 — MEMORIES
      ================================================== */}

      {step === 1 && (
        <SpeechMemoryBuilder
          values={formData.memories}
          onChange={(memories) => updateField("memories", memories)}
        />
      )}

      {/* =================================================
          STEP 2 — OBJECTIVE
      ================================================== */}

      {step === 2 && (
        <ChoiceGrid
          options={contentObjectives}
          selected={formData.objective}
          onSelect={(value) => updateField("objective", value)}
        />
      )}

      {/* =================================================
          STEP 3 — AUDIENCES
      ================================================== */}

      {step === 3 && (
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
            placeholder="e.g. Family and close friends"
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
            Add each audience separately if different groups will be listening.
          </p>
        </div>
      )}

      {/* =================================================
          STEP 4 — TONE
      ================================================== */}

      {step === 4 && (
        <ChoiceGrid
          options={contentTones}
          selected={formData.tone}
          onSelect={(value) => updateField("tone", value)}
        />
      )}

      {/* =================================================
          STEP 5 — LANGUAGE
      ================================================== */}

      {step === 5 && (
        <ChoiceGrid
          options={languages}
          selected={formData.language}
          onSelect={(value) => updateField("language", value)}
        />
      )}

      {/* =================================================
          STEP 6 — LENGTH + DURATION
      ================================================== */}

      {step === 6 && (
        <div
          className="
            mx-auto
            w-full
            max-w-2xl
            space-y-6
          "
        >
          <ChoiceGrid
            options={contentLengths}
            selected={formData.length}
            onSelect={(value) => updateField("length", value)}
          />

          <div
            className="
              rounded-[1.25rem]
              border
              border-border/60
              bg-background/70
              p-5
            "
          >
            <label
              htmlFor="speech-duration"
              className="
                text-sm
                font-medium
                text-foreground
              "
            >
              Target speaking time
            </label>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-muted-foreground
              "
            >
              Optional. Give Mecho a more precise duration for the finished
              speech.
            </p>

            <div
              className="
                mt-4
                flex
                items-center
                gap-3
              "
            >
              <input
                id="speech-duration"
                type="number"
                min={1}
                max={60}
                value={formData.targetDurationMinutes ?? ""}
                onChange={(event) => {
                  const value = event.target.value;

                  updateField(
                    "targetDurationMinutes",
                    value ? Number(value) : null,
                  );
                }}
                placeholder="5"
                className="
                  h-11
                  w-28
                  rounded-xl
                  border
                  border-border/70
                  bg-background
                  px-4
                  text-sm
                  outline-none
                  transition-all

                  focus:border-mecho-purple/30
                  focus:ring-4
                  focus:ring-mecho-purple/5
                "
              />

              <span
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                minutes
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          STEP 7 — REVIEW
      ================================================== */}

      {step === 7 && <SpeechReview formData={formData} getLabel={getLabel} />}
    </WorkflowShell>
  );
}

type SpeechReviewProps = {
  formData: SpeechData;

  getLabel: (options: Option[], value: string) => string;
};

function SpeechReview({ formData, getLabel }: SpeechReviewProps) {
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
        label="Speech"
        value={formData.brief.trim() || "Using supporting document"}
      />

      <ReviewRow
        label="Objective"
        value={getLabel(contentObjectives, formData.objective)}
      />

      <ReviewRow label="Audiences" value={formData.audiences.join(", ")} />

      <ReviewRow label="Tone" value={getLabel(contentTones, formData.tone)} />

      <ReviewRow
        label="Language"
        value={getLabel(languages, formData.language)}
      />

      <ReviewRow
        label="Length"
        value={getLabel(contentLengths, formData.length)}
      />

      <ReviewRow
        label="Target duration"
        value={
          formData.targetDurationMinutes
            ? `${formData.targetDurationMinutes} minutes`
            : "No exact duration"
        }
      />

      <ReviewRow
        label="Memories"
        value={`${formData.memories.length} ${
          formData.memories.length === 1 ? "memory" : "memories"
        } added`}
      />

      {formData.document ? (
        <ReviewRow label="Document" value={formData.document.name} last />
      ) : (
        <ReviewRow label="Source" value="Typed speech brief" last />
      )}
    </div>
  );
}

function createProjectName(brief: string) {
  const clean = brief.replace(/\s+/g, " ").trim();

  if (!clean) {
    return "Speech";
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
    // Ignore invalid JSON response.
  }

  return fallback;
}
