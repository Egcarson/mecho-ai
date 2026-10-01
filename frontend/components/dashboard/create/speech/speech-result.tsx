"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Check, Clock3, Copy, Quote } from "lucide-react";
import { toast } from "sonner";

import { MediaActions } from "@/components/dashboard/create/media/media-actions";
import { VoiceGenerator } from "@/components/dashboard/create/media/voice-generator";

type SpeechGenerateResponse = {
  title: string;
  speech: string;
  key_memories: string[];
  estimated_duration: string;
};

type SpeechResultGeneration = {
  uid: string;
  project_uid: string;
  output_content: string;
};

type SpeechResultProps = {
  generation: SpeechResultGeneration;

  /**
   * Speech output itself does not contain
   * the language, so the workflow/project
   * supplies it.
   */
  language: string;

  onBack: () => void;

  backLabel?: string;
};

export function SpeechResult({
  generation,
  language,
  onBack,
  backLabel = "Back to project setup",
}: SpeechResultProps) {
  const parsed = useMemo(
    () => parseSpeechOutput(generation.output_content),
    [generation.output_content],
  );

  const [copied, setCopied] = useState(false);

  const [showVoiceGenerator, setShowVoiceGenerator] = useState(false);

  if (!parsed) {
    return (
      <main
        className="
          flex
          min-h-[70vh]
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
            Speech result unavailable
          </h1>

          <p
            className="
              mt-3
              text-sm
              text-muted-foreground
            "
          >
            Mecho couldn't read this speech result.
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

  const safeParsed = parsed;

  async function handleCopy() {
    try {
      const copyText = [safeParsed.title, safeParsed.speech]
        .filter(Boolean)
        .join("\n\n");

      await navigator.clipboard.writeText(copyText);

      setCopied(true);

      toast.success("Speech copied.");

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      toast.error("Couldn't copy speech.");
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
      {/* =================================================
          AMBIENT BACKGROUND
      ================================================== */}

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
        {/* =================================================
            RESULT INTRO
        ================================================== */}

        <div
          className="
            flex
            flex-col
            gap-6

            sm:flex-row
            sm:items-end
            sm:justify-between
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
              Speech
            </p>

            <h1
              className="
                mt-3
                text-4xl
                font-semibold
                tracking-[-0.05em]

                sm:text-5xl
              "
            >
              Your speech is ready.
            </h1>

            <div
              className="
                mt-4
                flex
                flex-wrap
                items-center
                gap-x-4
                gap-y-2
                text-sm
                text-muted-foreground
              "
            >
              {safeParsed.estimated_duration && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                  "
                >
                  <Clock3 className="size-4" />

                  {safeParsed.estimated_duration}
                </span>
              )}

              {language && <span>{formatEnumLabel(language)}</span>}
            </div>
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

            {copied ? "Copied" : "Copy speech"}
          </button>
        </div>

        {/* =================================================
            SPEECH
        ================================================== */}

        <section
          className="
            mt-10
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
            <div
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-xl
                bg-mecho-purple-soft/60
                text-mecho-purple
              "
            >
              <Quote className="size-4" />
            </div>

            <h2
              className="
                mt-5
                max-w-3xl
                text-3xl
                font-semibold
                leading-tight
                tracking-[-0.04em]

                sm:text-4xl
              "
            >
              {safeParsed.title}
            </h2>
          </div>

          <div
            className="
              px-6
              py-8

              sm:px-8
              sm:py-10
            "
          >
            <div
              className="
                max-w-3xl
                whitespace-pre-line
                text-[16px]
                leading-8
                text-foreground/88

                sm:text-[17px]
                sm:leading-9
              "
            >
              {safeParsed.speech}
            </div>
          </div>
        </section>

        {/* =================================================
            MEMORIES USED
        ================================================== */}

        {safeParsed.key_memories?.length > 0 && (
          <section className="mt-8">
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.13em]
                text-muted-foreground
              "
            >
              Memories woven into the speech
            </p>

            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-2
              "
            >
              {safeParsed.key_memories.map((memory, index) => (
                <span
                  key={`${memory}-${index}`}
                  className="
                      rounded-full
                      border
                      border-border/60
                      bg-background/70
                      px-4
                      py-2
                      text-sm
                      leading-5
                      text-foreground/75
                    "
                >
                  {memory}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* =================================================
            MEDIA
        ================================================== */}

        <MediaActions
          onVoice={() => setShowVoiceGenerator((current) => !current)}
        />

        {showVoiceGenerator && (
          <>
            {language ? (
              <VoiceGenerator
                projectUid={generation.project_uid}
                generationUid={generation.uid}
                language={language}
                platform="speech"
              />
            ) : (
              <div
                className="
                  mt-4
                  rounded-2xl
                  border
                  border-border/60
                  bg-muted/20
                  px-5
                  py-4
                  text-sm
                  text-muted-foreground
                "
              >
                Speech language is unavailable, so voice generation cannot be
                opened for this result.
              </div>
            )}
          </>
        )}

        {/* =================================================
            BOTTOM ACTION
        ================================================== */}

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

function parseSpeechOutput(value: string): SpeechGenerateResponse | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.title !== "string" ||
      typeof parsed.speech !== "string"
    ) {
      return null;
    }

    return {
      title: parsed.title,
      speech: parsed.speech,

      key_memories: Array.isArray(parsed.key_memories)
        ? parsed.key_memories
        : [],

      estimated_duration:
        typeof parsed.estimated_duration === "string"
          ? parsed.estimated_duration
          : "",
    };
  } catch {
    return null;
  }
}

function formatEnumLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
