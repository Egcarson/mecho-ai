"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import { FileText, Paperclip, X } from "lucide-react";
import { toast } from "sonner";

import { WorkflowShell } from "@/components/dashboard/create/workflow-shell";
import { ChoiceGrid } from "@/components/dashboard/create/shared/choice-grid";
import { ReviewRow } from "@/components/dashboard/create/shared/review-row";
import { SocialGenerationExperience } from "@/components/dashboard/create/social/social-generation-experience";
import { TagInput } from "@/components/dashboard/create/shared/tag-input";

import {
  contentObjectives,
  contentTones,
  languages,
  platforms,
} from "@/components/dashboard/create/workflow-options";

import {
  socialStoryLengths,
  type GenerationPhase,
  type GenerationResponse,
  type Option,
  type ProjectResponse,
  type SocialData,
} from "@/components/dashboard/create/workflow-types";

import { authFetch } from "@/lib/auth-fetch";

const initialData: SocialData = {
  subject: "",
  objective: "",
  audiences: [],
  platforms: [],
  tone: "",
  languages: [],
  story_length: "",
  document: null,
};

const allowedDocumentExtensions = [".pdf", ".docx", ".txt"];

export function SocialCreate() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState<SocialData>(initialData);

  const [projectUid, setProjectUid] = useState<string | null>(null);

  const [generationPhase, setGenerationPhase] =
    useState<GenerationPhase>("idle");

  const [generation, setGeneration] = useState<GenerationResponse | null>(null);

  const [lastError, setLastError] = useState("");

  const isStorytelling = formData.objective === "storytelling";

  const steps = useMemo(() => {
    const baseSteps = [
      {
        id: "idea",
        title: "What are you creating around?",
        description:
          "Tell Mecho about your idea, or attach a document with the details. You can also do both.",
      },
      {
        id: "objective",
        title: "What should this content achieve?",
        description:
          "Choose the outcome that matters most for this piece of content.",
      },
    ];

    if (isStorytelling) {
      baseSteps.push({
        id: "story_length",
        title: "How much room should the story have?",
        description: "Choose how developed you want the story to feel.",
      });
    }
    baseSteps.push(
      {
        id: "audience",
        title: "Who should this connect with?",
        description: "Describe the audience you want Mecho to create this for.",
      },
      {
        id: "platforms",
        title: "Where should this content appear?",
        description: "Choose every platform you want Mecho to create for.",
      },
      {
        id: "tone",
        title: "How should it sound?",
        description:
          "Choose the tone that best fits your message and audience.",
      },
      {
        id: "languages",
        title: "Which languages should Mecho create it in?",
        description:
          "Choose one or more languages. Mecho will adapt the content for each one.",
      },
      {
        id: "review",
        title: "Everything look good?",
        description: "Review your direction before Mecho starts creating.",
      },
    );
    return baseSteps;
  }, [isStorytelling]);

  function getStoryLengthGuidance(value: string) {
    switch (value) {
      case "short":
        return "Keep the story concise and focused, with a clear beginning, development, and payoff.";

      case "medium":
        return "Give the story enough room for context, progression, emotional development, and a satisfying payoff.";

      case "long":
        return "Develop the story fully with richer context, stronger narrative progression, detail, and emotional depth.";

      case "extended":
        return "Create an extended, highly developed story with substantial context, narrative progression, detail, emotional depth, and a complete payoff.";

      default:
        return "";
    }
  }

  const isLastStep = step === steps.length - 1;

  const isProcessing =
    generationPhase === "creating_project" ||
    generationPhase === "uploading_document" ||
    generationPhase === "generating";

  function updateField<K extends keyof SocialData>(
    key: K,
    value: SocialData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function togglePlatform(value: string) {
    setFormData((current) => {
      const exists = current.platforms.includes(value);

      return {
        ...current,

        platforms: exists
          ? current.platforms.filter((item) => item !== value)
          : [...current.platforms, value],
      };
    });
  }

  function toggleLanguage(value: string) {
    setFormData((current) => {
      const exists = current.languages.includes(value);

      return {
        ...current,

        languages: exists
          ? current.languages.filter((item) => item !== value)
          : [...current.languages, value],
      };
    });
  }

  function canContinue() {
    const currentStep = steps[step]?.id;

    switch (currentStep) {
      case "idea":
        return Boolean(formData.subject.trim() || formData.document);

      case "objective":
        return Boolean(formData.objective);

      case "story_length":
        return Boolean(formData.story_length);

      case "audience":
        return formData.audiences.length > 0;

      case "platforms":
        return formData.platforms.length > 0;

      case "tone":
        return Boolean(formData.tone);

      case "languages":
        return formData.languages.length > 0;

      case "review":
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

  function handleDocumentChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const extension = getFileExtension(file.name).toLowerCase();

    if (!allowedDocumentExtensions.includes(extension)) {
      toast.error("Unsupported file type. Only PDF, DOCX and TXT are allowed.");

      event.target.value = "";

      return;
    }

    updateField("document", file);

    event.target.value = "";
  }

  function removeDocument() {
    updateField("document", null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function runGeneration({
    reuseProjectUid,
  }: {
    reuseProjectUid?: string;
  } = {}) {
    if (isProcessing) {
      return;
    }

    setLastError("");
    setGeneration(null);

    try {
      let activeProjectUid = reuseProjectUid;

      /*
       * CREATE PROJECT ONLY WHEN
       * WE DON'T ALREADY HAVE ONE.
       */

      if (!activeProjectUid) {
        setGenerationPhase("creating_project");

        const projectResponse = await fetch("/api/projects", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: createProjectName(formData.subject, formData.document),

            workflow: "social",

            objective: formData.objective,

            tone: formData.tone,

            audiences: formData.audiences,

            languages: formData.languages,

            platforms: formData.platforms,

            description: formData.subject.trim() || undefined,
          }),
        });

        if (!projectResponse.ok) {
          throw new Error(
            await getApiError(
              projectResponse,
              "Mecho couldn't create your project.",
            ),
          );
        }

        const project = (await projectResponse.json()) as ProjectResponse;

        activeProjectUid = project.uid;

        setProjectUid(project.uid);

        /*
         * DOCUMENT IS UPLOADED
         * ONLY ON INITIAL
         * PROJECT CREATION.
         */

        if (formData.document) {
          setGenerationPhase("uploading_document");

          const documentBody = new FormData();

          documentBody.append("file", formData.document);

          const documentResponse = await authFetch(
            `/api/projects/${project.uid}/document`,
            {
              method: "POST",

              body: documentBody,
            },
          );

          if (!documentResponse.ok) {
            throw new Error(
              await getApiError(
                documentResponse,
                "Mecho couldn't read that document.",
              ),
            );
          }
        }
      }

      if (!activeProjectUid) {
        throw new Error("Mecho couldn't determine the active project.");
      }

      /*
       * GENERATE CONTENT
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
            input_content: formData.subject.trim(),
            memories: [],
          }),
        },
      );

      if (!generationResponse.ok) {
        throw new Error(
          await getApiError(
            generationResponse,
            "Mecho couldn't create your content.",
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
          : "Mecho couldn't create your content.";

      setLastError(message);

      setGenerationPhase("failed");

      toast.error(message);
    }
  }

  async function retryGeneration() {
    await runGeneration({
      reuseProjectUid: projectUid ?? undefined,
    });
  }

  async function handleGenerate() {
    await runGeneration();
  }

  function returnToReview() {
    setGenerationPhase("idle");

    setLastError("");

    setGeneration(null);

    setStep(steps.length - 1);
  }

  /*
   * Once generation starts,
   * the wizard becomes the
   * guided Mecho generation
   * experience.
   */

  if (generationPhase !== "idle") {
    return (
      <SocialGenerationExperience
        phase={generationPhase}
        hasDocument={Boolean(formData.document)}
        documentName={formData.document?.name ?? null}
        platforms={getLabels(platforms, formData.platforms)}
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
      eyebrow="Social"
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
      {/* =============================================
        IDEA + OPTIONAL DOCUMENT
    ============================================== */}

      {steps[step].id === "idea" && (
        <div className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/80 transition-all focus-within:border-mecho-purple/30 focus-within:ring-4 focus-within:ring-mecho-purple/5">
          <textarea
            value={formData.subject}
            onChange={(event) => updateField("subject", event.target.value)}
            autoFocus
            rows={5}
            placeholder="e.g. I’m launching a new clothing collection next month and want people to start talking about it..."
            className="min-h-[180px] w-full resize-none bg-transparent px-5 py-4 text-[17px] font-medium leading-7 tracking-[-0.015em] outline-none placeholder:font-normal placeholder:text-muted-foreground/50"
          />

          <div className="border-t border-border/60 px-4 py-3">
            {formData.document ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-mecho-purple-soft text-mecho-purple">
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
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
              onChange={handleDocumentChange}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* =============================================
        OBJECTIVE
    ============================================== */}

      {steps[step].id === "objective" && (
        <ChoiceGrid
          options={contentObjectives}
          selected={formData.objective}
          onSelect={(value) => {
            updateField("objective", value);

            if (value !== "storytelling") {
              updateField("story_length", "");
            }
          }}
        />
      )}

      {/* =============================================
        STORY LENGTH — STORYTELLING ONLY
    ============================================== */}

      {steps[step].id === "story_length" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {socialStoryLengths.map((item) => {
            const active = formData.story_length === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => updateField("story_length", item.value)}
                className={`rounded-[1.25rem] border p-4 text-left transition-all ${
                  active
                    ? "border-mecho-purple/35 bg-mecho-purple-soft"
                    : "border-border/70 bg-background hover:bg-muted/30"
                }`}
              >
                <p className="text-sm font-semibold">{item.label}</p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* =============================================
        AUDIENCE
    ============================================== */}

      {steps[step].id === "audience" && (
        <div className="mx-auto w-full max-w-2xl">
          <TagInput
            values={formData.audiences}
            onChange={(audiences) => updateField("audiences", audiences)}
            placeholder="e.g. Young fashion buyers in Lagos"
            addLabel="Add"
          />

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Add each audience separately. Mecho will adapt the content to speak
            clearly to all of them.
          </p>
        </div>
      )}

      {/* =============================================
        PLATFORMS
    ============================================== */}

      {steps[step].id === "platforms" && (
        <ChoiceGrid
          options={platforms}
          selected={formData.platforms}
          multiple
          onSelect={togglePlatform}
        />
      )}

      {/* =============================================
        TONE
    ============================================== */}

      {steps[step].id === "tone" && (
        <ChoiceGrid
          options={contentTones}
          selected={formData.tone}
          onSelect={(value) => updateField("tone", value)}
        />
      )}

      {/* =============================================
        LANGUAGES
    ============================================== */}

      {steps[step].id === "languages" && (
        <ChoiceGrid
          options={languages}
          selected={formData.languages}
          multiple
          onSelect={toggleLanguage}
        />
      )}

      {/* =============================================
        REVIEW
    ============================================== */}

      {steps[step].id === "review" && (
        <div className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/80">
          <ReviewRow
            label="Idea"
            value={formData.subject || "Using attached document"}
          />

          {formData.document && (
            <ReviewRow label="Document" value={formData.document.name} />
          )}

          <ReviewRow
            label="Objective"
            value={getLabel(contentObjectives, formData.objective)}
          />

          {formData.objective === "storytelling" && (
            <ReviewRow
              label="Story length"
              value={getLabel(socialStoryLengths, formData.story_length)}
            />
          )}

          <ReviewRow label="Audiences" value={formData.audiences.join(", ")} />

          <ReviewRow
            label="Platforms"
            value={getLabels(platforms, formData.platforms)}
          />

          <ReviewRow
            label="Tone"
            value={getLabel(contentTones, formData.tone)}
          />

          <ReviewRow
            label="Languages"
            value={getLabels(languages, formData.languages)}
            last
          />
        </div>
      )}
    </WorkflowShell>
  );
}

function createProjectName(subject: string, document: File | null) {
  const cleaned = subject.trim();

  if (cleaned) {
    if (cleaned.length <= 56) {
      return cleaned;
    }

    return `${cleaned.slice(0, 53)}...`;
  }

  if (document) {
    return document.name.replace(/\.[^/.]+$/, "");
  }

  return "Untitled social project";
}

function getFileExtension(filename: string) {
  const lastDot = filename.lastIndexOf(".");

  if (lastDot === -1) {
    return "";
  }

  return filename.slice(lastDot);
}

function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return "0 KB";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.ceil(bytes / 1024)} KB`;
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
      const messages = body.detail
        .map((error: unknown) => {
          if (typeof error !== "object" || error === null) {
            return null;
          }

          const item = error as {
            loc?: Array<string | number>;
            msg?: string;
          };

          const field =
            item.loc?.filter((part) => part !== "body").join(".") ?? "";

          if (!item.msg) {
            return null;
          }

          return field ? `${field}: ${item.msg}` : item.msg;
        })
        .filter(Boolean);

      if (messages.length > 0) {
        return messages.join("\n");
      }
    }

    if (typeof body?.message === "string") {
      return body.message;
    }
  } catch {
    //
  }

  return fallback;
}
