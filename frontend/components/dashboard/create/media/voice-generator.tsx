"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Download,
  Loader2,
  LockKeyhole,
  Mic2,
  RefreshCw,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

import { useVoiceUsage } from "@/hooks/use-voice-usage";
import { getVoiceAccess, type VoiceWorkflow } from "@/lib/media/voice-usage";

import {
  createVoiceGeneration,
  fetchGenerationVoices,
  fetchVoices,
  type VoiceGeneration,
  type VoiceOption,
} from "@/lib/media/voice";

type VoiceGeneratorProps = {
  projectUid: string;
  generationUid: string;
  language: string;
  platform: string;
  workflow: VoiceWorkflow;
};

export function VoiceGenerator({
  projectUid,
  generationUid,
  language,
  platform,
  workflow,
}: VoiceGeneratorProps) {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [generatedVoices, setGeneratedVoices] = useState<VoiceGeneration[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [activeAudio, setActiveAudio] = useState<VoiceGeneration | null>(null);

  const [loadingVoices, setLoadingVoices] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [choosingVoice, setChoosingVoice] = useState(false);

  const {
    usage,
    loading: loadingUsage,
    error: usageError,
    refresh: refreshVoiceUsage,
  } = useVoiceUsage();

  /*
   * Existing voices and available provider voices are loaded
   * independently from plan access.
   *
   * A user must always be able to access audio they already own,
   * even when they have no new-generation allowance remaining.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoadingVoices(true);

      try {
        const [availableVoices, existingVoices] = await Promise.all([
          fetchVoices(),
          fetchGenerationVoices({
            projectUid,
            generationUid,
          }),
        ]);

        if (cancelled) return;

        setVoices(availableVoices);
        setGeneratedVoices(existingVoices);

        const defaultVoice =
          availableVoices.find((voice) => voice.default) ?? availableVoices[0];

        if (defaultVoice) {
          setSelectedVoice(defaultVoice.name);
        }
      } catch (error) {
        if (cancelled) return;

        toast.error(
          getErrorMessage(error, "Mecho couldn't load your generated voices."),
        );
      } finally {
        if (!cancelled) {
          setLoadingVoices(false);
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [projectUid, generationUid]);

  const availableForLanguage = useMemo(() => {
    const normalizedLanguage = language.toLowerCase();

    return voices.filter((voice) =>
      voice.languages
        .map((item) => item.toLowerCase())
        .includes(normalizedLanguage),
    );
  }, [voices, language]);

  const matchingGeneratedVoices = useMemo(() => {
    return generatedVoices.filter(
      (item) =>
        item.language.toLowerCase() === language.toLowerCase() &&
        item.platform.toLowerCase() === platform.toLowerCase(),
    );
  }, [generatedVoices, language, platform]);

  const completedVoices = useMemo(() => {
    return matchingGeneratedVoices.filter(
      (item) => item.status === "completed" && Boolean(item.audio_url),
    );
  }, [matchingGeneratedVoices]);

  const existingForSelectedVoice = useMemo(() => {
    return matchingGeneratedVoices.find((item) => item.voice === selectedVoice);
  }, [matchingGeneratedVoices, selectedVoice]);

  const hasCompletedVoice = completedVoices.length > 0;

  const voiceAccess = usage ? getVoiceAccess(usage, workflow) : null;

  const canGenerateNewVoice = Boolean(voiceAccess?.allowed);

  /*
   * Keep the active player in sync with the current language/platform.
   */
  useEffect(() => {
    const existingAudio = completedVoices[0] ?? null;

    setActiveAudio(existingAudio);

    if (existingAudio) {
      setSelectedVoice(existingAudio.voice);
      setChoosingVoice(false);
      return;
    }

    const defaultVoice =
      availableForLanguage.find((voice) => voice.default) ??
      availableForLanguage[0];

    setSelectedVoice(defaultVoice?.name ?? "");

    /*
     * Only automatically open the picker if backend access
     * explicitly allows another generation.
     */
    setChoosingVoice(Boolean(voiceAccess?.allowed));
  }, [
    language,
    platform,
    completedVoices,
    availableForLanguage,
    voiceAccess?.allowed,
  ]);

  async function handleGenerate() {
    if (!selectedVoice) {
      toast.error("Choose a voice first.");
      return;
    }

    /*
     * Reusing already-generated audio never consumes credit.
     */
    if (
      existingForSelectedVoice?.status === "completed" &&
      existingForSelectedVoice.audio_url
    ) {
      setActiveAudio(existingForSelectedVoice);
      setChoosingVoice(false);

      toast.success("This voice is already ready.");
      return;
    }

    /*
     * Never call the generation endpoint until backend access
     * has successfully been verified.
     */
    if (loadingUsage) {
      toast.info("Checking your voice access...");
      return;
    }

    if (!usage || usageError) {
      toast.error(
        usageError ??
          "Mecho couldn't verify your voice allowance. Please try again.",
      );
      return;
    }

    const access = getVoiceAccess(usage, workflow);

    if (!access.allowed) {
      toast.info(access.title, {
        description: access.message,
      });
      return;
    }

    setGenerating(true);

    try {
      const result = await createVoiceGeneration({
        projectUid,
        generationUid,
        language,
        platform,
        voice: selectedVoice,
      });

      if (result.status === "failed") {
        throw new Error(result.error_message ?? "Voice generation failed.");
      }

      setGeneratedVoices((current) => {
        const withoutExisting = current.filter(
          (item) => item.uid !== result.uid,
        );

        return [...withoutExisting, result];
      });

      /*
       * The backend owns usage. Always refetch after it accepts
       * a generation request instead of changing counters locally.
       */
      const updatedUsage = await refreshVoiceUsage();

      if (result.status === "completed" && result.audio_url) {
        setActiveAudio(result);
        setChoosingVoice(false);

        if (workflow === "social" && updatedUsage) {
          if (updatedUsage.social_available > 0) {
            toast.success("Voice generated successfully.", {
              description:
                updatedUsage.social_available === 1
                  ? "You have 1 free voice generation remaining."
                  : `You have ${updatedUsage.social_available} free voice generations remaining.`,
            });
          } else {
            toast.success("Voice generated successfully.", {
              description: "You've now used your free voice allowance.",
            });
          }
        } else {
          toast.success("Voice generated successfully.");
        }

        return;
      }

      toast.info("Voice generation is processing.");
    } catch (error) {
      await refreshVoiceUsage();

      toast.error(getErrorMessage(error, "Mecho couldn't generate the voice."));
    } finally {
      setGenerating(false);
    }
  }

  async function handleDownload() {
    if (!activeAudio?.audio_url) {
      toast.error("No audio is available to download.");
      return;
    }

    try {
      const response = await fetch(activeAudio.audio_url);

      if (!response.ok) {
        throw new Error("Audio download failed.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = objectUrl;
      anchor.download = createAudioFileName(activeAudio);

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(objectUrl);

      toast.success("Audio downloaded.");
    } catch {
      toast.error("Couldn't download the audio.");
    }
  }

  async function handleShare() {
    if (!activeAudio?.audio_url) {
      toast.error("No audio is available to share.");
      return;
    }

    setSharing(true);

    try {
      const displayName = getVoiceDisplayName(voices, activeAudio.voice);

      const title = `${displayName} voice`;

      const text = `Mecho AI voice for ${formatLabel(
        activeAudio.language,
      )} · ${formatLabel(activeAudio.platform)}`;

      if (navigator.share) {
        try {
          const response = await fetch(activeAudio.audio_url);

          if (!response.ok) {
            throw new Error();
          }

          const blob = await response.blob();

          const file = new File([blob], createAudioFileName(activeAudio), {
            type: blob.type || "audio/mpeg",
          });

          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({
              title,
              text,
              files: [file],
            });

            return;
          }
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
        }

        try {
          await navigator.share({
            title,
            text,
            url: activeAudio.audio_url,
          });

          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
        }
      }

      await navigator.clipboard.writeText(activeAudio.audio_url);

      toast.success("Audio link copied.");
    } catch {
      toast.error("Couldn't share the audio.");
    } finally {
      setSharing(false);
    }
  }

  if (loadingVoices) {
    return (
      <section className="mt-6 rounded-[1.5rem] border border-border/70 bg-background/80 p-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading voices...
        </div>
      </section>
    );
  }

  return (
    <section className="mt-6 overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/85 shadow-[0_20px_60px_rgba(47,1,117,0.05)] backdrop-blur-xl">
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-mecho-purple-soft text-mecho-purple">
            <Mic2 className="size-4" />
          </div>

          <div>
            <h3 className="text-base font-semibold tracking-[-0.02em]">
              Voice
            </h3>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {hasCompletedVoice
                ? `Your generated ${formatLabel(language)} ${formatLabel(
                    platform,
                  )} voice is ready.`
                : "Turn this content into natural voice."}
            </p>
          </div>
        </div>

        {/* Existing generated voices always come first. */}
        {completedVoices.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Generated voices
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {completedVoices.map((voice) => {
                const active = activeAudio?.uid === voice.uid;

                return (
                  <button
                    key={voice.uid}
                    type="button"
                    onClick={() => {
                      setActiveAudio(voice);
                      setSelectedVoice(voice.voice);
                      setChoosingVoice(false);
                    }}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      active
                        ? "border-mecho-purple/35 bg-mecho-purple-soft text-mecho-purple"
                        : "border-border/70 bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    }`}
                  >
                    {active && <Check className="size-3.5" />}
                    {getVoiceDisplayName(voices, voice.voice)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Usage/access state is shown AFTER existing voices. */}
        {!loadingUsage && usage && !canGenerateNewVoice && (
          <div className="mt-6 rounded-2xl border border-border/70 bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <LockKeyhole className="size-4" />
              </div>

              <div>
                <p className="text-sm font-semibold">{voiceAccess?.title}</p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {voiceAccess?.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {!loadingUsage && usageError && (
          <div className="mt-6 rounded-2xl border border-border/70 bg-muted/30 p-4">
            <p className="text-sm font-medium">
              We couldn't verify new voice access.
            </p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Your existing voices are still available. Try checking access
              again before creating another.
            </p>

            <button
              type="button"
              onClick={() => void refreshVoiceUsage()}
              className="mt-3 inline-flex h-9 items-center gap-2 rounded-full border border-border/70 px-4 text-xs font-medium transition-colors hover:bg-muted/50"
            >
              <RefreshCw className="size-3.5" />
              Check again
            </button>
          </div>
        )}

        {/* Only show voice selection when generation is actually allowed. */}
        {canGenerateNewVoice && (!hasCompletedVoice || choosingVoice) && (
          <div className="mt-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Choose a voice
              </p>

              {hasCompletedVoice && (
                <button
                  type="button"
                  onClick={() => setChoosingVoice(false)}
                  className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Close
                </button>
              )}
            </div>

            {availableForLanguage.length > 0 ? (
              <>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {availableForLanguage.map((voice) => {
                    const selected = selectedVoice === voice.name;

                    const generated = completedVoices.some(
                      (item) => item.voice === voice.name,
                    );

                    return (
                      <button
                        key={voice.name}
                        type="button"
                        onClick={() => setSelectedVoice(voice.name)}
                        className={`rounded-[1rem] border p-4 text-left transition-all duration-200 ${
                          selected
                            ? "border-mecho-purple/35 bg-mecho-purple-soft"
                            : "border-border/70 bg-background hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold">
                                {voice.display_name}
                              </p>

                              {voice.default && (
                                <span className="rounded-full bg-mecho-purple-soft px-2 py-0.5 text-[10px] font-medium text-mecho-purple">
                                  Default
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              {voice.description ?? "Natural voice"}
                            </p>
                          </div>

                          {generated && (
                            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                              <Check className="size-3.5" />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    Selected:{" "}
                    <span className="font-medium text-foreground">
                      {getVoiceDisplayName(voices, selectedVoice)}
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={generating || !selectedVoice}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Creating voice...
                      </>
                    ) : existingForSelectedVoice?.status === "completed" &&
                      existingForSelectedVoice.audio_url ? (
                      <>
                        <Check className="size-4" />
                        Use this voice
                      </>
                    ) : (
                      <>
                        <Mic2 className="size-4" />
                        Generate voice
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 rounded-2xl border border-dashed border-border/70 px-4 py-5 text-sm text-muted-foreground">
                No available voice currently supports {formatLabel(language)}.
              </div>
            )}
          </div>
        )}

        {/* Generate another only exists while backend says the user may. */}
        {hasCompletedVoice && !choosingVoice && canGenerateNewVoice && (
          <button
            type="button"
            onClick={() => setChoosingVoice(true)}
            className="mt-5 inline-flex h-9 items-center gap-2 rounded-full border border-border/70 px-4 text-xs font-medium transition-colors hover:bg-muted/50"
          >
            <Mic2 className="size-3.5" />
            Generate another voice
          </button>
        )}
      </div>

      {/* Existing audio remains completely usable after allowance ends. */}
      {activeAudio?.status === "completed" && activeAudio.audio_url && (
        <div className="border-t border-border/60 bg-muted/[0.18] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">
                {getVoiceDisplayName(voices, activeAudio.voice)}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {formatLabel(activeAudio.language)}
                {" · "}
                {formatLabel(activeAudio.platform)}
                {" · "}
                {activeAudio.response_format.toUpperCase()}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-border/70 bg-background px-4 text-xs font-medium transition-colors hover:bg-muted/50"
              >
                <Download className="size-3.5" />
                Download
              </button>

              <button
                type="button"
                onClick={handleShare}
                disabled={sharing}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-border/70 bg-background px-4 text-xs font-medium transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sharing ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Share2 className="size-3.5" />
                )}
                Share
              </button>
            </div>
          </div>

          <audio
            key={activeAudio.audio_url}
            controls
            preload="metadata"
            className="mt-5 w-full"
          >
            <source src={activeAudio.audio_url} type="audio/mpeg" />
            Your browser does not support audio playback.
          </audio>
        </div>
      )}
    </section>
  );
}

function getVoiceDisplayName(voices: VoiceOption[], name: string) {
  if (!name) return "None";

  return (
    voices.find((voice) => voice.name === name)?.display_name ??
    formatLabel(name)
  );
}

function createAudioFileName(voice: VoiceGeneration) {
  const language = sanitizeFileName(voice.language);
  const platform = sanitizeFileName(voice.platform);
  const voiceName = sanitizeFileName(voice.voice);
  const extension = sanitizeFileName(voice.response_format || "mp3");

  return `mecho-${language}-${platform}-${voiceName}.${extension}`;
}

function sanitizeFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatLabel(value: string) {
  if (!value) return "";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
