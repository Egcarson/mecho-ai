"use client";

import { useEffect, useMemo, useState } from "react";

import { ArrowLeft, Check, Copy, Languages } from "lucide-react";

import { toast } from "sonner";

import { MediaActions } from "@/components/dashboard/create/media/media-actions";

import { VoiceGenerator } from "@/components/dashboard/create/media/voice-generator";

import { ImageGenerator } from "@/components/dashboard/create/media/image-generator";

/**
 * Shape returned inside the generated campaign response.
 */
type CampaignLanguageContent = {
  language: string;
  title: string;
  theme: string;
  main_message: string;
  supporting_content: string[];
  next_step: string;
};

type CampaignGenerateResponse = {
  generated: CampaignLanguageContent[];
};

/**
 * Only fields required by this result page.
 *
 * project_uid is also reused by media generators so generated
 * images can link back to the correct project/generation route.
 */
type CampaignResultGeneration = {
  uid: string;
  project_uid: string;
  output_content: string;
};

type CampaignResultProps = {
  generation: CampaignResultGeneration;
  onBack: () => void;
  backLabel?: string;
};

export function CampaignResult({
  generation,
  onBack,
  backLabel = "Back to project setup",
}: CampaignResultProps) {
  /**
   * Parse the stored JSON once per generation output.
   */
  const parsed = useMemo(
    () => parseCampaignOutput(generation.output_content),
    [generation.output_content],
  );

  const [activeLanguage, setActiveLanguage] = useState(
    parsed.generated[0]?.language ?? "",
  );

  const [copied, setCopied] = useState(false);

  /**
   * ------------------------------------------------------------
   * MEDIA PANEL STATE
   * ------------------------------------------------------------
   *
   * Voice and Image behave as mutually exclusive panels.
   * A language change closes them because their generation context
   * would otherwise point at the previous language.
   */
  const [showVoiceGenerator, setShowVoiceGenerator] = useState(false);

  const [showImageGenerator, setShowImageGenerator] = useState(false);

  /**
   * Make sure activeLanguage remains valid if another generation is
   * loaded into this component.
   */
  useEffect(() => {
    const firstLanguage = parsed.generated[0]?.language ?? "";

    if (!parsed.generated.some((item) => item.language === activeLanguage)) {
      setActiveLanguage(firstLanguage);

      closeMediaPanels();
    }
  }, [parsed.generated, activeLanguage]);

  const current =
    parsed.generated.find((item) => item.language === activeLanguage) ??
    parsed.generated[0];

  /**
   * Graceful fallback for malformed/legacy stored output.
   */
  if (!current) {
    return (
      <main
        className="
          mx-auto
          flex
          min-h-[70vh]
          w-full
          max-w-5xl
          items-center
          justify-center
          px-4
        "
      >
        <div className="text-center">
          <h1
            className="
              text-2xl
              font-semibold
              tracking-[-0.04em]
            "
          >
            Campaign result unavailable
          </h1>

          <p
            className="
              mt-3
              text-sm
              text-muted-foreground
            "
          >
            Mecho couldn&apos;t read this saved campaign output.
          </p>

          <button
            type="button"
            onClick={onBack}
            className="
              mt-6
              inline-flex
              h-10
              items-center
              justify-center
              rounded-full
              border
              border-border/60
              px-5
              text-sm
              font-medium
              transition-colors

              hover:bg-muted/50
            "
          >
            {backLabel}
          </button>
        </div>
      </main>
    );
  }

  const copyText = buildCampaignCopy(current);

  function closeMediaPanels() {
    setShowVoiceGenerator(false);

    setShowImageGenerator(false);
  }

  function handleLanguageChange(language: string) {
    setActiveLanguage(language);

    /**
     * A media panel created for English should not remain visible
     * after switching to Yoruba, etc.
     */
    closeMediaPanels();
  }

  function toggleVoiceGenerator() {
    setShowVoiceGenerator((currentState) => {
      const next = !currentState;

      if (next) {
        setShowImageGenerator(false);
      }

      return next;
    });
  }

  function toggleImageGenerator() {
    setShowImageGenerator((currentState) => {
      const next = !currentState;

      if (next) {
        setShowVoiceGenerator(false);
      }

      return next;
    });
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(copyText);

      setCopied(true);

      toast.success("Campaign copied.");

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      toast.error("Couldn't copy campaign.");
    }
  }

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
      "
    >
      {/* ======================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[8%]
          top-[14%]
          size-[320px]
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
          size-[280px]
          rounded-full
          bg-mecho-orange/6
          blur-[140px]
        "
      />

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-5xl
          px-4
          pb-20
          pt-8

          sm:px-6
          sm:pt-10

          lg:px-8
          lg:pt-12
        "
      >
        {/* ======================================================
            BACK
        ====================================================== */}

        <button
          type="button"
          onClick={onBack}
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
          <ArrowLeft className="size-4" />

          {backLabel}
        </button>

        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <div
          className="
            mt-10
            flex
            flex-col
            gap-6

            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div>
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
                mt-3
                max-w-3xl
                text-4xl
                font-semibold
                tracking-[-0.05em]

                sm:text-5xl
              "
            >
              Your campaign is ready.
            </h1>

            <p
              className="
                mt-4
                max-w-2xl
                text-sm
                leading-6
                text-muted-foreground

                sm:text-base
              "
            >
              Review the message, switch languages, and prepare it for
              distribution.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void handleCopy();
            }}
            className="
              inline-flex
              h-10
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-border/60
              bg-background
              px-4
              text-sm
              font-medium
              text-foreground/75
              transition-all

              hover:border-mecho-purple/20
              hover:bg-mecho-purple-soft/40
              hover:text-mecho-purple
            "
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}

            {copied ? "Copied" : "Copy campaign"}
          </button>
        </div>

        {/* ======================================================
            LANGUAGE SELECTOR
        ====================================================== */}

        {parsed.generated.length > 1 && (
          <div
            className="
              mt-10
              flex
              flex-wrap
              gap-2
            "
          >
            {parsed.generated.map((item) => {
              const active = item.language === current.language;

              return (
                <button
                  key={item.language}
                  type="button"
                  onClick={() => handleLanguageChange(item.language)}
                  className={`
                      inline-flex
                      h-9
                      items-center
                      gap-2
                      rounded-full
                      border
                      px-3.5
                      text-xs
                      font-medium
                      transition-all

                      ${
                        active
                          ? `
                            border-mecho-purple/20
                            bg-mecho-purple-soft/70
                            text-mecho-purple
                          `
                          : `
                            border-border/60
                            bg-background
                            text-muted-foreground

                            hover:border-mecho-purple/15
                            hover:text-foreground
                          `
                      }
                    `}
                >
                  <Languages className="size-3.5" />

                  {formatLabel(item.language)}
                </button>
              );
            })}
          </div>
        )}

        {/* ======================================================
            CAMPAIGN CONTENT
        ====================================================== */}

        <section
          className="
            mt-8
            overflow-hidden
            rounded-[1.75rem]
            border
            border-border/60
            bg-background/85
            shadow-[0_22px_80px_rgba(39,12,61,0.06)]
            backdrop-blur-xl
          "
        >
          <div
            className="
              border-b
              border-border/60
              px-6
              py-7

              sm:px-8
              sm:py-8
            "
          >
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.13em]
                text-muted-foreground
              "
            >
              Campaign title
            </p>

            <h2
              className="
                mt-3
                max-w-3xl
                text-3xl
                font-semibold
                leading-tight
                tracking-[-0.04em]

                sm:text-4xl
              "
            >
              {current.title}
            </h2>

            {current.theme && (
              <p
                className="
                  mt-4
                  max-w-3xl
                  text-base
                  leading-7
                  text-mecho-purple

                  sm:text-lg
                "
              >
                {current.theme}
              </p>
            )}
          </div>

          <div
            className="
              px-6
              py-7

              sm:px-8
              sm:py-9
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.13em]
                  text-muted-foreground
                "
              >
                Main message
              </p>

              <p
                className="
                  mt-4
                  text-base
                  leading-8
                  text-foreground/90
                "
              >
                {current.main_message}
              </p>
            </div>

            {current.supporting_content.length > 0 && (
              <div
                className="
                  mt-9
                  border-t
                  border-border/60
                  pt-8
                "
              >
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.13em]
                    text-muted-foreground
                  "
                >
                  Supporting message
                </p>

                <div
                  className="
                    mt-4
                    space-y-5
                  "
                >
                  {current.supporting_content.map((paragraph, index) => (
                    <p
                      key={index}
                      className="
                          text-base
                          leading-8
                          text-foreground/80
                        "
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {current.next_step && (
              <div
                className="
                  mt-9
                  rounded-2xl
                  border
                  border-mecho-purple/12
                  bg-mecho-purple-soft/35
                  p-5

                  sm:p-6
                "
              >
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.13em]
                    text-mecho-purple
                  "
                >
                  Next step
                </p>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-foreground/85

                    sm:text-base
                  "
                >
                  {current.next_step}
                </p>
              </div>
            )}

            {/* ==================================================
                MEDIA ACTIONS

                Campaign has no social platform variants.

                Therefore:
                  source_language = current.language
                  source_variant  = "campaign"

                Quick Design still shows no language/variant fields.
                These values are only backend context.
            ================================================== */}

            <MediaActions
              onVoice={toggleVoiceGenerator}
              onImage={toggleImageGenerator}
            />

            {/* ==================================================
                VOICE
            ================================================== */}

            {showVoiceGenerator && (
              <VoiceGenerator
                projectUid={generation.project_uid}
                generationUid={generation.uid}
                language={current.language}
                platform="campaign"
              />
            )}

            {/* ==================================================
                IMAGE

                projectUid is already available from the generation,
                so ImageGenerator does not need another request merely
                to discover the project.
            ================================================== */}

            {showImageGenerator && (
              <ImageGenerator
                projectUid={generation.project_uid}
                generationUid={generation.uid}
                sourceLanguage={current.language}
                sourceVariant="campaign"
              />
            )}
          </div>
        </section>

        {/* ======================================================
            BOTTOM BACK ACTION
        ====================================================== */}

        <button
          type="button"
          onClick={onBack}
          className="
            mt-6
            inline-flex
            h-11
            items-center
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

          {backLabel}
        </button>
      </div>
    </main>
  );
}

/**
 * Safely parse campaign output.
 *
 * Never assume stored output_content is valid JSON. Returning an
 * empty collection lets the UI show its fallback rather than throw.
 */
function parseCampaignOutput(value: string): CampaignGenerateResponse {
  try {
    const parsed = JSON.parse(value) as CampaignGenerateResponse;

    if (Array.isArray(parsed.generated)) {
      return parsed;
    }
  } catch {
    // Intentionally fall through to the safe empty response below.
  }

  return {
    generated: [],
  };
}

/**
 * Produces the plain-text version used by "Copy campaign".
 */
function buildCampaignCopy(campaign: CampaignLanguageContent) {
  const sections = [
    campaign.title,
    campaign.theme,
    campaign.main_message,
    ...campaign.supporting_content,
    campaign.next_step,
  ].filter(Boolean);

  return sections.join("\n\n");
}

/**
 * Human-readable backend enum/string labels.
 */
function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
