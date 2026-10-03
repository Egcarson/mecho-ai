"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { MediaActions } from "@/components/dashboard/create/media/media-actions";
import { VoiceGenerator } from "@/components/dashboard/create/media/voice-generator";
import { ImageGenerator } from "@/components/dashboard/create/media/image-generator";
import type {
  GenerationResponse,
  SocialGenerateResponse,
} from "@/components/dashboard/create/workflow-types";
import { AmbientBackground } from "@/components/dashboard/create/shared/ambient-background";

type SocialResultProps = {
  generation: GenerationResponse;
  onBack: () => void;
  backLabel?: string;
};

type ActiveMedia = "voice" | "image" | null;

/**
 * Displays a completed Social generation.
 *
 * A generation may contain several languages and several platform variants
 * per language. Media generation always uses the exact version currently
 * visible on screen.
 */
export function SocialResult({
  generation,
  onBack,
  backLabel = "Back to project setup",
}: SocialResultProps) {
  /**
   * A single media state guarantees that Voice and Image can never be open
   * at the same time.
   */
  const [activeMedia, setActiveMedia] = useState<ActiveMedia>(null);

  const parsed = useMemo(
    () => parseSocialOutput(generation.output_content),
    [generation.output_content],
  );

  const initialLanguage = parsed?.generated?.[0]?.language ?? "";
  const [activeLanguage, setActiveLanguage] = useState(initialLanguage);

  const languageData =
    parsed?.generated.find((item) => item.language === activeLanguage) ??
    parsed?.generated?.[0] ??
    null;

  const initialPlatform = languageData?.contents?.[0]?.platform ?? "";
  const [activePlatform, setActivePlatform] = useState(initialPlatform);

  const contentData =
    languageData?.contents.find((item) => item.platform === activePlatform) ??
    languageData?.contents?.[0] ??
    null;

  /**
   * Recover safely when a different saved generation is rendered while this
   * component remains mounted.
   */
  useEffect(() => {
    if (!parsed?.generated.length) return;

    const languageStillExists = parsed.generated.some(
      (item) => item.language === activeLanguage,
    );

    if (!languageStillExists) {
      const nextLanguage = parsed.generated[0];

      setActiveLanguage(nextLanguage.language);
      setActivePlatform(nextLanguage.contents?.[0]?.platform ?? "");
      setActiveMedia(null);
    }
  }, [parsed, activeLanguage]);

  useEffect(() => {
    if (!languageData) return;

    const platformStillExists = languageData.contents.some(
      (item) => item.platform === activePlatform,
    );

    if (!platformStillExists) {
      setActivePlatform(languageData.contents?.[0]?.platform ?? "");
      setActiveMedia(null);
    }
  }, [languageData, activePlatform]);

  if (
    !parsed ||
    parsed.generated.length === 0 ||
    !languageData ||
    !contentData
  ) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
        <AmbientBackground />

        <div className="relative z-10 max-w-md text-center">
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">
            Content generated
          </h1>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Mecho returned content, but the result format could not be displayed
            correctly.
          </p>

          <button
            type="button"
            onClick={onBack}
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-full border border-border/70 px-5 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        </div>
      </main>
    );
  }

  const safeParsed = parsed;
  const safeLanguageData = languageData;
  const safeContentData = contentData;

  /**
   * Changing language changes the source content for Voice/Image, so any open
   * media panel is closed before the user generates against stale context.
   */
  function handleLanguageChange(language: string) {
    const selectedLanguage = safeParsed.generated.find(
      (item) => item.language === language,
    );

    if (!selectedLanguage) return;

    setActiveLanguage(language);
    setActivePlatform(selectedLanguage.contents[0]?.platform ?? "");
    setActiveMedia(null);
  }

  /**
   * Platform is also part of Social media-generation context.
   */
  function handlePlatformChange(platform: string) {
    setActivePlatform(platform);
    setActiveMedia(null);
  }

  function toggleMedia(media: Exclude<ActiveMedia, null>) {
    setActiveMedia((current) => (current === media ? null : media));
  }

  async function copyContent() {
    const hashtagText = safeContentData.hashtags
      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
      .join(" ");

    const text = [
      safeContentData.hook,
      "",
      safeContentData.content,
      "",
      safeContentData.call_to_action,
      "",
      hashtagText,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Content copied.");
    } catch {
      toast.error("Couldn't copy the content.");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 pb-16 pt-10 text-foreground sm:px-6 lg:px-8 lg:pt-14">
      <AmbientBackground />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mecho-purple">
            Social
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Your content is ready.
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Switch between languages and platforms to explore each version Mecho
            created.
          </p>
        </motion.div>

        {/* ======================================================
            LANGUAGE SELECTOR
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mt-8 flex flex-wrap gap-2"
        >
          {safeParsed.generated.map((item) => {
            const active = item.language === activeLanguage;

            return (
              <button
                key={item.language}
                type="button"
                onClick={() => handleLanguageChange(item.language)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "border-mecho-purple/30 bg-mecho-purple-soft text-mecho-purple"
                    : "border-border/70 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                {formatEnumLabel(item.language)}
              </button>
            );
          })}
        </motion.div>

        {/* ======================================================
            PLATFORM SELECTOR
        ====================================================== */}

        <div className="mt-5 flex flex-wrap gap-2">
          {safeLanguageData.contents.map((item) => {
            const active = item.platform === activePlatform;

            return (
              <button
                key={item.platform}
                type="button"
                onClick={() => handlePlatformChange(item.platform)}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-foreground text-background"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {formatEnumLabel(item.platform)}
              </button>
            );
          })}
        </div>

        {/* ======================================================
            CURRENT CONTENT
        ====================================================== */}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeLanguage}-${activePlatform}`}
            initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/85 shadow-[0_20px_80px_rgba(47,1,117,0.07)] backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4 border-b border-border/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">
                  {formatEnumLabel(safeContentData.platform)}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatEnumLabel(safeLanguageData.language)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void copyContent()}
                className="inline-flex h-9 items-center justify-center rounded-full border border-border/70 px-4 text-xs font-medium transition-colors hover:bg-muted/50"
              >
                Copy content
              </button>
            </div>

            <div className="space-y-8 px-6 py-7">
              <section>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Hook
                </p>

                <p className="mt-2 text-xl font-semibold leading-8 tracking-[-0.025em]">
                  {safeContentData.hook}
                </p>
              </section>

              <section>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Content
                </p>

                <p className="mt-3 whitespace-pre-wrap text-[15px] leading-7">
                  {safeContentData.content}
                </p>
              </section>

              <section>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Call to action
                </p>

                <p className="mt-3 text-[15px] font-medium leading-7">
                  {safeContentData.call_to_action}
                </p>
              </section>

              {safeContentData.hashtags.length > 0 && (
                <section>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Hashtags
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {safeContentData.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                      >
                        {tag.startsWith("#") ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ======================================================
            MEDIA ACTIONS

            Only one media panel may be active at once.
        ====================================================== */}

        <MediaActions
          activeMedia={activeMedia}
          onVoice={() => toggleMedia("voice")}
          onImage={() => toggleMedia("image")}
          onVideo={() => toast.info("Video generation is coming soon.")}
        />

        {/* ======================================================
            VOICE
        ====================================================== */}

        {activeMedia === "voice" && (
          <VoiceGenerator
            workflow="social"
            projectUid={generation.project_uid}
            generationUid={generation.uid}
            language={safeLanguageData.language}
            platform={safeContentData.platform}
          />
        )}

        {/* ======================================================
            IMAGE

            sourceLanguage/sourceVariant identify exactly the Social
            language/platform version currently displayed.
        ====================================================== */}

        {activeMedia === "image" && (
          <ImageGenerator
            projectUid={generation.project_uid}
            generationUid={generation.uid}
            sourceLanguage={safeLanguageData.language}
            sourceVariant={safeContentData.platform}
            workflow="social"
          />
        )}

        {/* ======================================================
            BOTTOM NAVIGATION
        ====================================================== */}

        <button
          type="button"
          onClick={onBack}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-border/70 px-5 text-sm font-medium transition-colors hover:bg-muted/50"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </button>
      </div>
    </main>
  );
}

/**
 * Safely parse stored Social output so malformed or legacy generation data
 * cannot crash the result screen.
 */
function parseSocialOutput(value: string): SocialGenerateResponse | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);

    if (!parsed || !Array.isArray(parsed.generated)) {
      return null;
    }

    return parsed as SocialGenerateResponse;
  } catch {
    return null;
  }
}

function formatEnumLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
