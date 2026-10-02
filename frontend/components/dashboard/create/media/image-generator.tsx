"use client";

import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Loader2,
  LockKeyhole,
  SlidersHorizontal,
  Wand2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { useImageUsage } from "@/hooks/use-image-usage";
import { getImageAccess, type ImageWorkflow } from "@/lib/media/image-usage";
import {
  createCustomDesign,
  createQuickDesign,
  getGeneratedImages,
  type CustomDesignPayload,
  type GeneratedImage,
} from "@/lib/media/image";

import { GeneratedImageGallery } from "./generated-image-gallery";
import { ImageCustomDesignForm } from "./image-custom-design-form";

type ImageGeneratorProps = {
  generationUid: string;
  projectUid: string;
  sourceLanguage: string;
  sourceVariant: string;
  workflow: ImageWorkflow;
};

type DesignMode = "quick" | "custom";
type GuideStep = "quick" | "custom";

/**
 * ImageGenerator
 *
 * Responsibilities:
 *
 * - loads existing image jobs independently of access;
 * - teaches Quick vs Custom Design with a small contextual guide;
 * - highlights the real mode controls during the guide;
 * - keeps image usage backend-authoritative;
 * - allows generation only when access is verified;
 * - keeps existing generated images visible after allowance ends;
 * - polls active image jobs until completion/failure.
 */
export function ImageGenerator({
  generationUid,
  projectUid,
  sourceLanguage,
  sourceVariant,
  workflow,
}: ImageGeneratorProps) {
  const generatorTopRef = useRef<HTMLDivElement | null>(null);
  const notifiedFailureIds = useRef<Set<string>>(new Set());

  const [mode, setMode] = useState<DesignMode>("quick");
  const [guideStep, setGuideStep] = useState<GuideStep | null>("quick");

  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [requestMode, setRequestMode] = useState<DesignMode | null>(null);

  const {
    usage,
    loading: loadingUsage,
    error: usageError,
    refresh: refreshImageUsage,
  } = useImageUsage();

  const [customPayload, setCustomPayload] = useState<CustomDesignPayload>({
    source_language: sourceLanguage,
    source_variant: sourceVariant,
    design_style: "auto",
    format: "auto",
    include_hashtags: false,
    brand_colors: [],
    primary_asset_uids: [],
    reference_asset_uids: [],
  });

  const imageAccess = usage ? getImageAccess(usage, workflow) : null;

  const canGenerateNewImage = Boolean(imageAccess?.allowed);
  const isSubmitting = requestMode !== null;

  /**
   * Keep the hidden source selector synchronized with the language/platform
   * currently visible to the user.
   */
  useEffect(() => {
    setCustomPayload((current) => ({
      ...current,
      source_language: sourceLanguage,
      source_variant: sourceVariant,
    }));
  }, [sourceLanguage, sourceVariant]);

  /**
   * A new content generation gets its own image state and lightweight guide.
   */
  useEffect(() => {
    setImages([]);
    setLoadingImages(true);
    setRequestMode(null);
    setMode("quick");
    setGuideStep("quick");

    notifiedFailureIds.current = new Set();
  }, [generationUid]);

  const processFailures = useCallback(
    (records: GeneratedImage[], notify: boolean) => {
      for (const record of records) {
        if (record.status !== "failed") {
          continue;
        }

        if (notifiedFailureIds.current.has(record.uid)) {
          continue;
        }

        notifiedFailureIds.current.add(record.uid);

        if (!notify) {
          continue;
        }

        toast.error("Image generation failed.", {
          description:
            record.error_message || "Mecho couldn't complete this design.",
        });
      }
    },
    [],
  );

  /**
   * Existing images are intentionally loaded without considering quota.
   *
   * Usage controls NEW creation only.
   */
  const loadImages = useCallback(
    async ({
      silent = false,
      notifyFailures = false,
    }: {
      silent?: boolean;
      notifyFailures?: boolean;
    } = {}) => {
      try {
        if (!silent) {
          setLoadingImages(true);
        }

        const response = await getGeneratedImages(generationUid);

        processFailures(response, notifyFailures);
        setImages(response);

        return response;
      } catch (error) {
        if (!silent) {
          toast.error("Couldn't load designs.", {
            description:
              error instanceof Error ? error.message : "Please try again.",
          });
        }

        return [];
      } finally {
        if (!silent) {
          setLoadingImages(false);
        }
      }
    },
    [generationUid, processFailures],
  );

  useEffect(() => {
    void loadImages({
      silent: false,
      notifyFailures: false,
    });
  }, [loadImages]);

  const hasActiveBackendJobs = useMemo(
    () =>
      images.some(
        (image) => image.status === "pending" || image.status === "processing",
      ),
    [images],
  );

  useEffect(() => {
    if (!hasActiveBackendJobs) {
      return;
    }

    const timer = window.setInterval(() => {
      void loadImages({
        silent: true,
        notifyFailures: true,
      });
    }, 3000);

    return () => {
      window.clearInterval(timer);
    };
  }, [hasActiveBackendJobs, loadImages]);

  function upsertImage(image: GeneratedImage) {
    setImages((current) => {
      const exists = current.some((item) => item.uid === image.uid);

      if (!exists) {
        return [image, ...current];
      }

      return current.map((item) => (item.uid === image.uid ? image : item));
    });
  }

  function handleImmediateFailure(image: GeneratedImage) {
    if (image.status !== "failed") {
      return false;
    }

    notifiedFailureIds.current.add(image.uid);

    toast.error("Image generation failed.", {
      description:
        image.error_message || "Mecho couldn't complete this design.",
    });

    return true;
  }

  /**
   * Scroll back to the beginning of the image experience before showing
   * Custom Design. This prevents the longer custom form from appearing
   * halfway down the viewport.
   */
  function scrollToGeneratorTop() {
    window.requestAnimationFrame(() => {
      generatorTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function selectMode(nextMode: DesignMode) {
    setMode(nextMode);

    if (nextMode === "custom") {
      scrollToGeneratorTop();
    }
  }

  /**
   * The guide changes the highlighted real control rather than rendering
   * duplicate fake Quick/Custom buttons.
   */
  function goToCustomGuide() {
    setGuideStep("custom");
    setMode("custom");
    scrollToGeneratorTop();
  }

  function closeGuide() {
    setGuideStep(null);
  }

  /**
   * Access is checked immediately before provider work.
   *
   * Existing images remain usable even if usage cannot be checked.
   */
  function canStartGeneration() {
    if (loadingUsage) {
      toast.info("Checking your image access...");
      return false;
    }

    if (!usage) {
      toast.error(
        usageError ??
          "Mecho couldn't verify your image allowance. Please try again.",
      );

      return false;
    }

    const access = getImageAccess(usage, workflow);

    if (!access.allowed) {
      toast.info(access.title, {
        description: access.message,
      });

      return false;
    }

    return true;
  }

  async function handleQuickDesign() {
    if (requestMode || !canStartGeneration()) {
      return;
    }

    setRequestMode("quick");

    toast.success("Image generation started.", {
      description: "Mecho is creating your design.",
    });

    try {
      const created = await createQuickDesign(generationUid, {
        source_language: sourceLanguage,
        source_variant: sourceVariant,
      });

      setRequestMode(null);

      if (handleImmediateFailure(created)) {
        await refreshImageUsage();
        return;
      }

      upsertImage(created);

      /**
       * Backend owns the allowance. Synchronize after the accepted request
       * rather than incrementing anything locally.
       */
      await refreshImageUsage();

      if (created.status === "completed") {
        void loadImages({
          silent: true,
          notifyFailures: true,
        });
      }
    } catch (error) {
      setRequestMode(null);

      await refreshImageUsage();

      toast.error("Couldn't generate the image.", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  async function handleCustomDesign() {
    if (requestMode || !canStartGeneration()) {
      return;
    }

    setRequestMode("custom");

    toast.success("Image generation started.", {
      description: "Mecho is creating your custom design.",
    });

    try {
      const created = await createCustomDesign(generationUid, {
        ...customPayload,
        source_language: sourceLanguage,
        source_variant: sourceVariant,
      });

      setRequestMode(null);

      if (handleImmediateFailure(created)) {
        await refreshImageUsage();
        return;
      }

      upsertImage(created);

      await refreshImageUsage();

      if (created.status === "completed") {
        void loadImages({
          silent: true,
          notifyFailures: true,
        });
      }
    } catch (error) {
      setRequestMode(null);

      await refreshImageUsage();

      toast.error("Couldn't generate the image.", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  return (
    <div
      ref={generatorTopRef}
      className="mt-6 scroll-mt-24 overflow-hidden rounded-[1.75rem] border border-border/60 bg-background"
    >
      {/* =====================================================
          HEADER + REAL MODE CONTROLS
      ====================================================== */}

      <div className="px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-[-0.025em]">
              Create a visual
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Turn this content into a design.
            </p>
          </div>

          <div className="relative w-fit">
            <div className="inline-flex w-fit rounded-full border border-border/70 bg-muted/30 p-1">
              <ModeButton
                active={mode === "quick"}
                highlighted={guideStep === "quick"}
                disabled={isSubmitting}
                onClick={() => selectMode("quick")}
                icon={Wand2}
              >
                Quick Design
              </ModeButton>

              <ModeButton
                active={mode === "custom"}
                highlighted={guideStep === "custom"}
                disabled={isSubmitting}
                onClick={() => selectMode("custom")}
                icon={SlidersHorizontal}
              >
                Custom Design
              </ModeButton>
            </div>
          </div>
        </div>

        {/* ===================================================
            SUBTLE TWO-STEP GUIDE

            This points to the actual controls instead of duplicating them.
        ==================================================== */}

        {guideStep && (
          <div className="mt-4 flex max-w-xl items-start gap-3 rounded-2xl border border-mecho-purple/15 bg-mecho-purple-soft/30 px-4 py-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-background text-mecho-purple shadow-sm">
              {guideStep === "quick" ? (
                <Wand2 className="size-4" />
              ) : (
                <SlidersHorizontal className="size-4" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {guideStep === "quick" ? "Quick Design" : "Custom Design"}
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {guideStep === "quick"
                  ? "Let Mecho handle the creative direction using the content you're viewing."
                  : "Use Custom Design when you want control over your brand, text, colors, images and creative direction."}
              </p>

              <div className="mt-3 flex items-center gap-2">
                {guideStep === "custom" && (
                  <button
                    type="button"
                    onClick={() => {
                      setGuideStep("quick");
                      setMode("quick");
                    }}
                    className="inline-flex h-8 items-center gap-1 rounded-full px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground"
                  >
                    <ChevronLeft className="size-3.5" />
                    Back
                  </button>
                )}

                {guideStep === "quick" ? (
                  <button
                    type="button"
                    onClick={goToCustomGuide}
                    className="inline-flex h-8 items-center gap-1 rounded-full bg-foreground px-3 text-xs font-medium text-background transition-opacity hover:opacity-90"
                  >
                    Next
                    <ChevronRight className="size-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={closeGuide}
                    className="inline-flex h-8 items-center rounded-full bg-foreground px-3 text-xs font-medium text-background transition-opacity hover:opacity-90"
                  >
                    Got it
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={closeGuide}
              aria-label="Close design guide"
              className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-border/60 p-4 sm:p-5">
        {/* ===================================================
            ACCESS STATUS

            Existing gallery access is never blocked. This only explains
            whether another generation can be started.
        ==================================================== */}

        {!loadingUsage && usageError && (
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">
                Image access couldn't be checked
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Your existing designs are still available. Retry before creating
                another one.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                void refreshImageUsage();
              }}
              className="inline-flex h-9 w-fit items-center rounded-full border border-border/70 px-4 text-xs font-medium transition-colors hover:bg-muted/50"
            >
              Retry
            </button>
          </div>
        )}

        {!loadingUsage && imageAccess && !imageAccess.allowed && (
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <LockKeyhole className="size-4" />
            </div>

            <div>
              <p className="text-sm font-semibold">{imageAccess.title}</p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {imageAccess.message}
              </p>

              {workflow === "social" &&
                typeof imageAccess.limit === "number" && (
                  <p className="mt-2 text-xs font-medium text-muted-foreground">
                    {imageAccess.used} of {imageAccess.limit} free image
                    generations used
                  </p>
                )}
            </div>
          </div>
        )}

        {/* ===================================================
            QUICK DESIGN
        ==================================================== */}

        {mode === "quick" ? (
          <div className="relative overflow-hidden rounded-[1.5rem] border border-border/60 bg-muted/20 p-5 sm:p-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-mecho-purple/10 blur-[70px]"
            />

            <div className="relative max-w-xl">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-mecho-purple-soft text-mecho-purple">
                <Wand2 className="size-5" />
              </div>

              <h4 className="mt-4 text-base font-semibold tracking-[-0.02em]">
                Quick Design
              </h4>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Let Mecho create the visual directly from your generated
                content.
              </p>

              <button
                type="button"
                disabled={isSubmitting || loadingUsage || !canGenerateNewImage}
                onClick={() => {
                  void handleQuickDesign();
                }}
                className={`mt-5 inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                  canGenerateNewImage
                    ? "bg-mecho-gradient text-white shadow-[0_10px_26px_rgba(111,44,255,0.18)] hover:-translate-y-0.5"
                    : "border border-border/70 bg-muted/50 text-muted-foreground"
                }`}
              >
                {requestMode === "quick" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating...
                  </>
                ) : loadingUsage ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Checking access...
                  </>
                ) : !canGenerateNewImage ? (
                  <>
                    <LockKeyhole className="size-4" />
                    {workflow === "social"
                      ? "Free limit used"
                      : "Not available on Free"}
                  </>
                ) : (
                  <>
                    <ImagePlus className="size-4" />
                    Generate design
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* =================================================
             CUSTOM DESIGN
          ================================================== */

          <div className="scroll-mt-24">
            <ImageCustomDesignForm
              value={customPayload}
              onChange={setCustomPayload}
              onSubmit={() => {
                void handleCustomDesign();
              }}
              loading={requestMode === "custom"}
              disabled={loadingUsage || !canGenerateNewImage || isSubmitting}
            />
          </div>
        )}

        {/* ===================================================
            EXISTING / GENERATED IMAGES

            This remains independent from access control.
        ==================================================== */}

        <div className="mt-6">
          <GeneratedImageGallery
            images={images}
            projectUid={projectUid}
            loading={loadingImages}
            isStarting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  highlighted,
  disabled,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  highlighted?: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium transition-all disabled:pointer-events-none disabled:opacity-50 ${
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      } ${
        highlighted
          ? "z-10 ring-2 ring-mecho-purple/35 shadow-[0_0_0_6px_rgba(111,44,255,0.08)]"
          : ""
      }`}
    >
      <Icon className="size-3.5" />
      {children}
    </button>
  );
}
