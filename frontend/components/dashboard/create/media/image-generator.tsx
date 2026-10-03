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
 * - loads existing image jobs independently of allowance;
 * - introduces Quick and Custom Design through the actual mode controls;
 * - keeps the rest of the image workspace visually subdued during the guide;
 * - keeps image allowance backend-authoritative;
 * - gates only NEW generation;
 * - keeps previous images accessible after allowance ends;
 * - polls active backend jobs until completion/failure.
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
  const guideActive = guideStep !== null;

  /**
   * Keep the hidden source context synchronized with the content currently
   * visible in Social or Campaign.
   */
  useEffect(() => {
    setCustomPayload((current) => ({
      ...current,
      source_language: sourceLanguage,
      source_variant: sourceVariant,
    }));
  }, [sourceLanguage, sourceVariant]);

  /**
   * A different content generation starts with fresh image state and the
   * lightweight two-step mode guide.
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
        if (record.status !== "failed") continue;
        if (notifiedFailureIds.current.has(record.uid)) continue;

        notifiedFailureIds.current.add(record.uid);

        if (!notify) continue;

        toast.error("Image generation failed.", {
          description:
            record.error_message || "Mecho couldn't complete this design.",
        });
      }
    },
    [],
  );

  /**
   * Existing designs load regardless of whether another generation is allowed.
   * Quota/access only controls new provider work.
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
        if (!silent) setLoadingImages(true);

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
        if (!silent) setLoadingImages(false);
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

  /**
   * Poll only while the backend still has image work in progress.
   */
  useEffect(() => {
    if (!hasActiveBackendJobs) return;

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
    if (image.status !== "failed") return false;

    notifiedFailureIds.current.add(image.uid);

    toast.error("Image generation failed.", {
      description:
        image.error_message || "Mecho couldn't complete this design.",
    });

    return true;
  }

  /**
   * Every mode transition returns the user to the beginning of the image
   * workspace. Quick and Custom therefore behave consistently.
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
    setGuideStep(null);
    scrollToGeneratorTop();
  }

  /**
   * Guide navigation changes the real selected mode so the highlighted
   * control always corresponds to what the guide is explaining.
   */
  function goToQuickGuide() {
    setGuideStep("quick");
    setMode("quick");
    scrollToGeneratorTop();
  }

  function goToCustomGuide() {
    setGuideStep("custom");
    setMode("custom");
    scrollToGeneratorTop();
  }

  /**
   * Finishing the guide keeps the mode from the final guide step selected.
   */
  function closeGuide() {
    setGuideStep(null);
    scrollToGeneratorTop();
  }

  /**
   * Access is checked immediately before provider work.
   * Existing designs remain usable even if this check fails.
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
    if (requestMode || !canStartGeneration()) return;

    setRequestMode("quick");

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
       * Backend owns usage. Refresh allowance after every accepted generation
       * rather than maintaining a frontend counter.
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
    if (requestMode || !canStartGeneration()) return;

    setRequestMode("custom");

    try {
      const created = await createCustomDesign(generationUid, {
        ...customPayload,

        /**
         * Always overwrite these using the content selected at the exact
         * moment generation begins.
         */
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
      className="relative mt-6 scroll-mt-24 overflow-hidden rounded-[1.75rem] border border-border/60 bg-background"
    >
      {/* ======================================================
          NORMAL WORKSPACE

          During the guide this entire layer sits behind a subdued
          backdrop. The actual mode selector is raised above it below.
      ====================================================== */}

      <div
        className={`transition-[filter,opacity] duration-300 ${
          guideActive
            ? "pointer-events-none select-none blur-[3px] opacity-35"
            : ""
        }`}
      >
        {/* ====================================================
            HEADER COPY
        ==================================================== */}

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

            {/* Placeholder preserves the selector's layout while the real
                selector is rendered above the guide backdrop. */}
            <div className="invisible inline-flex w-fit rounded-full border p-1">
              <span className="px-3.5 py-2 text-xs">Quick Design</span>
              <span className="px-3.5 py-2 text-xs">Custom Design</span>
            </div>
          </div>
        </div>

        {/* ====================================================
            WORKSPACE BODY
        ==================================================== */}

        <div className="border-t border-border/60 p-4 sm:p-5">
          {/* Access information may remain visible behind the guide but
              is deliberately softened until onboarding is completed. */}

          {!loadingUsage && usageError && (
            <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">
                  Image access couldn&apos;t be checked
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Your existing designs are still available. Retry before
                  creating another one.
                </p>
              </div>

              <button
                type="button"
                onClick={() => void refreshImageUsage()}
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

          {/* ==================================================
              CREATION CONTROLS

              Do not mount these while the guide is visible.
              This guarantees that "Generate design" does not appear before
              the user has completed or dismissed the Quick/Custom guide.
          ================================================== */}

          {!guideActive &&
            (mode === "quick" ? (
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
                    disabled={
                      isSubmitting || loadingUsage || !canGenerateNewImage
                    }
                    onClick={() => void handleQuickDesign()}
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
              <div className="scroll-mt-24">
                <ImageCustomDesignForm
                  value={customPayload}
                  onChange={setCustomPayload}
                  onSubmit={() => void handleCustomDesign()}
                  loading={requestMode === "custom"}
                  disabled={
                    loadingUsage || !canGenerateNewImage || isSubmitting
                  }
                />
              </div>
            ))}

          {/* ==================================================
              EXISTING / GENERATED IMAGES

              Gallery access remains independent from allowance.
          ================================================== */}

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

      {/* ======================================================
          GUIDE BACKDROP

          This visually suppresses the whole image workspace while leaving
          only the real Quick / Custom controls and guide card in focus.
      ====================================================== */}

      {guideActive && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-background/35 backdrop-blur-[2px]"
        />
      )}

      {/* ======================================================
          REAL MODE CONTROLS

          These remain above the guide backdrop so the user is always looking
          at the actual controls they will continue using afterwards.
      ====================================================== */}

      <div className="pointer-events-none absolute right-5 top-5 z-40 sm:right-6">
        <div className="pointer-events-auto inline-flex w-fit rounded-full border border-mecho-purple/25 bg-background p-1 shadow-[0_12px_40px_rgba(111,44,255,0.12)]">
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

      {/* ======================================================
          GUIDE COACHMARK
      ====================================================== */}

      {guideStep && (
        <div className="absolute right-4 top-[5.2rem] z-40 w-[calc(100%-2rem)] max-w-sm sm:right-6 sm:top-[4.8rem]">
          <div className="relative rounded-[1.25rem] border border-mecho-purple/20 bg-background p-4 shadow-[0_18px_55px_rgba(36,12,52,0.16)]">
            <button
              type="button"
              onClick={closeGuide}
              aria-label="Close design guide"
              className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>

            <div className="flex items-start gap-3 pr-8">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-mecho-purple-soft text-mecho-purple">
                {guideStep === "quick" ? (
                  <Wand2 className="size-4" />
                ) : (
                  <SlidersHorizontal className="size-4" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-mecho-purple">
                  {guideStep === "quick" ? "Step 1 of 2" : "Step 2 of 2"}
                </p>

                <h4 className="mt-1 text-sm font-semibold text-foreground">
                  {guideStep === "quick" ? "Quick Design" : "Custom Design"}
                </h4>

                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                  {guideStep === "quick"
                    ? "Want Mecho to handle the creative direction? Use Quick Design for the fastest path."
                    : "Need more control? Add your brand, colors, product images, text and creative preferences."}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              {guideStep === "custom" && (
                <button
                  type="button"
                  onClick={goToQuickGuide}
                  className="inline-flex h-8 items-center gap-1 rounded-full px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
        </div>
      )}
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
      aria-pressed={active}
      className={`relative inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium transition-all disabled:pointer-events-none disabled:opacity-50 ${
        active
          ? "bg-mecho-purple-soft text-mecho-purple shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      } ${
        highlighted
          ? "z-10 ring-2 ring-mecho-purple/40 shadow-[0_0_0_6px_rgba(111,44,255,0.10),0_10px_30px_rgba(111,44,255,0.12)]"
          : ""
      }`}
    >
      <Icon className="size-3.5" />
      {children}
    </button>
  );
}
