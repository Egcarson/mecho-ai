"use client";

import Image from "next/image";

import { Expand, Loader2 } from "lucide-react";

import { useMemo, useState } from "react";

import type { GeneratedImage } from "@/lib/media/image";

import { GeneratedImagePreview } from "./generated-image-preview";

type Props = {
  images: GeneratedImage[];
  projectUid: string;
  loading?: boolean;

  /**
   * True only while POST is still waiting to return its first
   * backend image record.
   */
  isStarting?: boolean;
};

/**
 * GeneratedImageGallery
 *
 * User-facing image states:
 *
 * Local starting
 *   -> backend pending
 *   -> backend processing
 *   -> completed
 *
 * Backend `failed` records are intentionally excluded from the gallery.
 * ImageGenerator reports new failures through Sonner instead.
 */
export function GeneratedImageGallery({
  images,
  projectUid,
  loading = false,
  isStarting = false,
}: Props) {
  const [preview, setPreview] = useState<GeneratedImage | null>(null);

  /**
   * Only records with something meaningful to display belong here.
   *
   * `failed` remains in backend history but is not a usable design.
   */
  const visibleImages = useMemo(
    () =>
      [...images]
        .filter(
          (image) =>
            image.status === "completed" ||
            image.status === "pending" ||
            image.status === "processing",
        )
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
    [images],
  );

  const completedCount = useMemo(
    () => visibleImages.filter((image) => image.status === "completed").length,
    [visibleImages],
  );

  /**
   * Initial GET only.
   *
   * Polling itself stays visually quiet and does not replace the
   * gallery with this loader.
   */
  if (loading) {
    return (
      <div
        className="
          flex
          min-h-[180px]
          items-center
          justify-center
          rounded-2xl
          border
          border-border/60
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            text-muted-foreground
          "
        >
          <Loader2 className="size-4 animate-spin" />
          Loading designs...
        </div>
      </div>
    );
  }

  /**
   * Keep the section hidden until either:
   *
   * - the user has started creating something, or
   * - an existing backend design exists.
   */
  if (!isStarting && visibleImages.length === 0) {
    return null;
  }

  return (
    <>
      <section>
        {/* ====================================================
            GALLERY HEADER
        ==================================================== */}

        <div
          className="
            mb-4
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            <h4
              className="
                text-sm
                font-semibold
                tracking-[-0.015em]
              "
            >
              Designs
            </h4>

            <p
              className="
                mt-1
                text-xs
                text-muted-foreground
              "
            >
              Generated visuals for this content.
            </p>
          </div>

          {completedCount > 0 && (
            <span
              className="
                shrink-0
                text-xs
                text-muted-foreground
              "
            >
              {completedCount} {completedCount === 1 ? "design" : "designs"}
            </span>
          )}
        </div>

        {/* ====================================================
            DESIGN GRID
        ==================================================== */}

        <div
          className="
            grid
            gap-4

            sm:grid-cols-2

            xl:grid-cols-3
          "
        >
          {/**
           * This card exists only until POST returns.
           *
           * As soon as ImageGenerator receives the real backend record,
           * isStarting becomes false and the backend pending/processing
           * card takes its place.
           *
           * This prevents two simultaneous "Creating..." placeholders.
           */}
          {isStarting && <LocalStartingCard />}

          {visibleImages.map((image) => (
            <BackendDesignCard
              key={image.uid}
              image={image}
              onOpen={() => setPreview(image)}
            />
          ))}
        </div>
      </section>

      {/* ======================================================
          FULL-SCREEN PREVIEW
      ====================================================== */}

      {preview?.image_url && (
        <GeneratedImagePreview
          open
          onOpenChange={(open) => {
            if (!open) {
              setPreview(null);
            }
          }}
          imageUrl={preview.image_url}
          title="Generated design"
          sourceHref={`/dashboard/projects/${projectUid}/generations/${preview.generation_uid}`}
        />
      )}
    </>
  );
}

/**
 * Frontend-only placeholder.
 *
 * At this point the browser has started POST but the backend has not
 * returned an image UID yet.
 */
function LocalStartingCard() {
  return (
    <div
      className="
        relative
        flex
        aspect-[4/3]
        flex-col
        items-center
        justify-center
        overflow-hidden
        rounded-2xl
        border
        border-mecho-purple/15
        bg-mecho-purple-soft/20
        px-6
        text-center
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          size-36
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-mecho-purple/10
          blur-[60px]
        "
      />

      <div
        className="
          relative
          flex
          size-11
          items-center
          justify-center
          rounded-2xl
          bg-mecho-purple-soft
          text-mecho-purple
        "
      >
        <Loader2 className="size-5 animate-spin" />
      </div>

      <p
        className="
          relative
          mt-3
          text-sm
          font-medium
        "
      >
        Starting design
      </p>

      <p
        className="
          relative
          mt-1
          max-w-[220px]
          text-xs
          leading-5
          text-muted-foreground
        "
      >
        Mecho is preparing your image request.
      </p>
    </div>
  );
}

/**
 * Represents a REAL backend image-generation record.
 */
function BackendDesignCard({
  image,
  onOpen,
}: {
  image: GeneratedImage;
  onOpen: () => void;
}) {
  /**
   * Pending/processing has a real backend UID.
   *
   * This card remains stable while polling updates the record.
   */
  if (image.status === "pending" || image.status === "processing") {
    return (
      <div
        className="
          relative
          flex
          aspect-[4/3]
          flex-col
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          border
          border-border/60
          bg-muted/20
          px-6
          text-center
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            size-32
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-mecho-purple/8
            blur-[60px]
          "
        />

        <div
          className="
            relative
            flex
            size-11
            items-center
            justify-center
            rounded-2xl
            bg-mecho-purple-soft
            text-mecho-purple
          "
        >
          <Loader2 className="size-5 animate-spin" />
        </div>

        <p
          className="
            relative
            mt-3
            text-sm
            font-medium
          "
        >
          Creating design
        </p>

        <p
          className="
            relative
            mt-1
            max-w-[220px]
            text-xs
            leading-5
            text-muted-foreground
          "
        >
          Mecho is building your visual.
        </p>
      </div>
    );
  }

  /**
   * Only completed records with a usable URL become actual image cards.
   *
   * Failed records have already been filtered by the parent.
   */
  if (image.status !== "completed" || !image.image_url) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="
        group
        relative
        aspect-[4/3]
        overflow-hidden
        rounded-2xl
        border
        border-border/60
        bg-muted/20
        text-left
      "
    >
      <Image
        src={image.image_url}
        alt="Generated design"
        fill
        className="
          object-cover
          transition-transform
          duration-500

          group-hover:scale-[1.025]
        "
        sizes="
          (max-width: 640px) 100vw,
          (max-width: 1280px) 50vw,
          33vw
        "
      />

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/35
          via-transparent
          to-transparent
        "
      />

      <span
        className="
          absolute
          bottom-3
          right-3
          flex
          size-9
          items-center
          justify-center
          rounded-full
          bg-black/35
          text-white
          backdrop-blur-xl
          transition-transform

          group-hover:scale-105
        "
      >
        <Expand className="size-4" />
      </span>
    </button>
  );
}
