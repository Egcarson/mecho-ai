"use client";

import { ImagePlus, Loader2, SlidersHorizontal, Wand2 } from "lucide-react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { toast } from "sonner";

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

  /**
   * These identify the exact generated content being turned into an image.
   *
   * They are intentionally hidden from the Quick Design UI.
   */
  sourceLanguage: string;
  sourceVariant: string;
};

type DesignMode = "quick" | "custom";

/**
 * ImageGenerator
 *
 * Owns the entire image-generation lifecycle:
 *
 * 1. Load previous image jobs.
 * 2. Start Quick or Custom Design.
 * 3. Show immediate local feedback while POST is still running.
 * 4. Store the backend image record once POST returns.
 * 5. Poll only while a backend job is pending/processing.
 * 6. Replace progress cards with completed images.
 * 7. Report failed jobs once without leaving them in the gallery.
 */
export function ImageGenerator({
  generationUid,
  projectUid,
  sourceLanguage,
  sourceVariant,
}: ImageGeneratorProps) {
  const [mode, setMode] = useState<DesignMode>("quick");

  const [images, setImages] = useState<GeneratedImage[]>([]);

  const [loadingImages, setLoadingImages] = useState(true);

  /**
   * requestMode is non-null ONLY while the POST request itself
   * has not yet returned.
   *
   * This matters because the backend may take several seconds before
   * returning even its first `pending` image object.
   *
   * During this period the gallery renders one frontend-only
   * "Creating design" card.
   */
  const [requestMode, setRequestMode] = useState<DesignMode | null>(null);

  /**
   * Failed records are returned by GET even after the failure happened.
   *
   * Without this Set, every polling cycle could fire the same Sonner
   * error repeatedly.
   */
  const notifiedFailureIds = useRef<Set<string>>(new Set());

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

  /**
   * Keep hidden source context synchronized when the user changes
   * Social language/platform or Campaign language.
   *
   * We still inject the current values again at submit time as an
   * additional safeguard against stale state.
   */
  useEffect(() => {
    setCustomPayload((current) => ({
      ...current,
      source_language: sourceLanguage,
      source_variant: sourceVariant,
    }));
  }, [sourceLanguage, sourceVariant]);

  /**
   * Reset generation-specific state when navigating between saved
   * generations without remounting this component.
   */
  useEffect(() => {
    setImages([]);
    setLoadingImages(true);
    setRequestMode(null);

    notifiedFailureIds.current = new Set();
  }, [generationUid]);

  /**
   * ------------------------------------------------------------
   * FAILURE TRACKING
   * ------------------------------------------------------------
   *
   * Historical failed jobs should NOT display an error toast every
   * time the user revisits the page.
   *
   * Initial loading therefore records old failures as already seen.
   *
   * Polling, however, calls this with notify=true so a job that fails
   * while the user is waiting produces exactly one useful error.
   */
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
   * ------------------------------------------------------------
   * FETCH IMAGE JOBS
   * ------------------------------------------------------------
   *
   * silent:
   * Avoids replacing the whole gallery with a loader during polling.
   *
   * notifyFailures:
   * False during initial page load.
   * True during active generation polling.
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

  /**
   * Initial fetch.
   *
   * Historical failures are deliberately registered but not toasted.
   */
  useEffect(() => {
    void loadImages({
      silent: false,
      notifyFailures: false,
    });
  }, [loadImages]);

  /**
   * True whenever at least one REAL backend image job still needs work.
   *
   * The local POST request state is handled separately through
   * requestMode.
   */
  const hasActiveBackendJobs = useMemo(
    () =>
      images.some(
        (image) => image.status === "pending" || image.status === "processing",
      ),
    [images],
  );

  /**
   * ------------------------------------------------------------
   * POLLING
   * ------------------------------------------------------------
   *
   * Poll only while the backend tells us an image is still active.
   *
   * When every job becomes completed or failed, React reruns this
   * effect and the interval is removed automatically.
   */
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

  /**
   * Inserts or updates one backend image record without producing
   * duplicate cards.
   */
  function upsertImage(image: GeneratedImage) {
    setImages((current) => {
      const exists = current.some((item) => item.uid === image.uid);

      if (!exists) {
        return [image, ...current];
      }

      return current.map((item) => (item.uid === image.uid ? image : item));
    });
  }

  /**
   * Handles a POST response that already returns `failed`.
   *
   * Usually POST returns pending, but this protects the frontend if
   * validation/provider setup fails synchronously.
   */
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
   * ------------------------------------------------------------
   * QUICK DESIGN
   * ------------------------------------------------------------
   *
   * The user sees zero configuration fields.
   *
   * Payload is exactly:
   *
   * {
   *   source_language,
   *   source_variant
   * }
   */
  async function handleQuickDesign() {
    if (requestMode) {
      return;
    }

    /**
     * Immediate frontend feedback.
     *
     * This occurs BEFORE awaiting the backend, so a slow POST does not
     * make the interface look frozen.
     */
    setRequestMode("quick");

    toast.success("Image generation started.", {
      description: "Mecho is creating your design.",
    });

    try {
      const created = await createQuickDesign(generationUid, {
        source_language: sourceLanguage,

        source_variant: sourceVariant,
      });

      /**
       * Remove the frontend-only progress state.
       *
       * From this point forward we have a real backend image UID and
       * the backend status card takes over.
       */
      setRequestMode(null);

      if (handleImmediateFailure(created)) {
        return;
      }

      upsertImage(created);

      /**
       * Normally pending/processing causes polling automatically.
       *
       * If the backend completed before POST returned, one quiet fetch
       * keeps this list synchronized with the server.
       */
      if (created.status === "completed") {
        void loadImages({
          silent: true,
          notifyFailures: true,
        });
      }
    } catch (error) {
      setRequestMode(null);

      toast.error("Couldn't generate the image.", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  /**
   * ------------------------------------------------------------
   * CUSTOM DESIGN
   * ------------------------------------------------------------
   *
   * Same lifecycle as Quick Design, except optional brand/content/
   * creative/asset information is also supplied.
   */
  async function handleCustomDesign() {
    if (requestMode) {
      return;
    }

    setRequestMode("custom");

    toast.success("Image generation started.", {
      description: "Mecho is creating your custom design.",
    });

    try {
      const created = await createCustomDesign(generationUid, {
        ...customPayload,

        /**
         * Always overwrite these with the CURRENT content
         * selection at the exact moment Generate is clicked.
         */
        source_language: sourceLanguage,

        source_variant: sourceVariant,
      });

      setRequestMode(null);

      if (handleImmediateFailure(created)) {
        return;
      }

      upsertImage(created);

      if (created.status === "completed") {
        void loadImages({
          silent: true,
          notifyFailures: true,
        });
      }
    } catch (error) {
      setRequestMode(null);

      toast.error("Couldn't generate the image.", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  const isSubmitting = requestMode !== null;

  return (
    <div
      className="
        mt-6
        overflow-hidden
        rounded-[1.75rem]
        border
        border-border/60
        bg-background
      "
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          px-5
          py-5

          sm:px-6
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h3
              className="
                text-base
                font-semibold
                tracking-[-0.025em]
              "
            >
              Create a visual
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              Turn this content into a design.
            </p>
          </div>

          <div
            className="
              inline-flex
              w-fit
              rounded-full
              border
              border-border/70
              bg-muted/30
              p-1
            "
          >
            <ModeButton
              active={mode === "quick"}
              disabled={isSubmitting}
              onClick={() => setMode("quick")}
              icon={Wand2}
            >
              Quick Design
            </ModeButton>

            <ModeButton
              active={mode === "custom"}
              disabled={isSubmitting}
              onClick={() => setMode("custom")}
              icon={SlidersHorizontal}
            >
              Custom Design
            </ModeButton>
          </div>
        </div>
      </div>

      <div
        className="
          border-t
          border-border/60
          p-4

          sm:p-5
        "
      >
        {/* ====================================================
            QUICK DESIGN

            No language/platform/style fields are shown here.
            Mecho uses the currently selected generated content
            internally.
        ==================================================== */}

        {mode === "quick" ? (
          <div
            className="
              relative
              overflow-hidden
              rounded-[1.5rem]
              border
              border-border/60
              bg-muted/20
              p-5

              sm:p-6
            "
          >
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                size-48
                rounded-full
                bg-mecho-purple/10
                blur-[70px]
              "
            />

            <div
              className="
                relative
                max-w-xl
              "
            >
              <div
                className="
                  flex
                  size-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-mecho-purple-soft
                  text-mecho-purple
                "
              >
                <Wand2 className="size-5" />
              </div>

              <h4
                className="
                  mt-4
                  text-base
                  font-semibold
                  tracking-[-0.02em]
                "
              >
                Quick Design
              </h4>

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                Let Mecho create the visual directly from your generated
                content.
              </p>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  void handleQuickDesign();
                }}
                className="
                  mt-5
                  inline-flex
                  h-11
                  items-center
                  gap-2
                  rounded-full
                  bg-mecho-gradient
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_10px_26px_rgba(111,44,255,0.18)]
                  transition-all

                  hover:-translate-y-0.5

                  disabled:pointer-events-none
                  disabled:opacity-60
                "
              >
                {requestMode === "quick" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating...
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
          /* ==================================================
             CUSTOM DESIGN

             All visible inputs here remain optional.
          ================================================== */

          <ImageCustomDesignForm
            value={customPayload}
            onChange={setCustomPayload}
            onSubmit={() => {
              void handleCustomDesign();
            }}
            loading={requestMode === "custom"}
          />
        )}

        {/* ======================================================
            DESIGNS

            isStarting renders exactly ONE temporary card while POST
            has not yet returned a backend image object.
        ====================================================== */}

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
  disabled,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
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
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        px-3.5
        py-2
        text-xs
        font-medium
        transition-all

        disabled:pointer-events-none
        disabled:opacity-50

        ${
          active
            ? `
              bg-background
              text-foreground
              shadow-sm
            `
            : `
              text-muted-foreground
              hover:text-foreground
            `
        }
      `}
    >
      <Icon className="size-3.5" />

      {children}
    </button>
  );
}
