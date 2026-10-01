"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Download,
  Expand,
  Headphones,
  ImageIcon,
  MoreHorizontal,
  Play,
  Share2,
  Video,
} from "lucide-react";

import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  downloadFile,
  formatDate,
  formatLabel,
  formatSentenceCase,
  shareFile,
  type LibraryItem,
} from "@/lib/library";

import { ImagePreviewDialog } from "./image-preview-dialog";

import { useState } from "react";

type MediaLibraryCardProps = {
  item: LibraryItem;
};

export function MediaLibraryCard({ item }: MediaLibraryCardProps) {
  const [imageOpen, setImageOpen] = useState(false);

  const mediaLabel =
    item.media_type === "voice"
      ? "Voice"
      : item.media_type === "image"
        ? "Image"
        : "Video";

  async function handleDownload() {
    try {
      const extension =
        item.media_type === "voice"
          ? "mp3"
          : item.media_type === "video"
            ? "mp4"
            : "png";

      await downloadFile(
        item.url,
        `${item.project_name}-${item.media_type}.${extension}`,
      );

      toast.success(`${mediaLabel} downloaded.`);
    } catch (error) {
      toast.error(`Couldn't download this ${item.media_type}.`, {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  }

  async function handleShare() {
    try {
      await shareFile(item.url, item.project_name);

      toast.success(`${mediaLabel} ready to share.`);
    } catch {
      toast.error(`Couldn't share this ${item.media_type}.`);
    }
  }

  return (
    <>
      <article
        className="
          group
          flex
          h-full
          min-h-[470px]
          flex-col
          overflow-hidden
          rounded-[1.65rem]
          border
          border-border/60
          bg-background
          shadow-[0_14px_45px_rgba(16,18,29,0.045)]
          transition-all
          duration-300

          hover:-translate-y-0.5
          hover:border-mecho-purple/15
          hover:shadow-[0_22px_60px_rgba(47,1,117,0.08)]
        "
      >
        {/* Unified media canvas */}

        <div
          className="
            relative
            aspect-[4/3]
            w-full
            shrink-0
            overflow-hidden
            bg-muted/30
          "
        >
          <MediaPreview item={item} onImageOpen={() => setImageOpen(true)} />

          {/* Type pill */}

          <div
            className="
              absolute
              left-4
              top-4
              z-10
              inline-flex
              items-center
              gap-1.5
              rounded-full
              border
              border-white/20
              bg-background/85
              px-3
              py-1.5
              text-[11px]
              font-semibold
              backdrop-blur-xl
            "
          >
            <MediaTypeIcon type={item.media_type} />

            {mediaLabel}
          </div>

          {/* More menu */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Media actions"
                className="
                  absolute
                  right-4
                  top-4
                  z-20
                  flex
                  size-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/20
                  bg-background/85
                  text-foreground
                  backdrop-blur-xl
                  transition-colors

                  hover:bg-background
                "
              >
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="
                w-48
                rounded-xl
              "
            >
              {item.media_type === "image" && (
                <DropdownMenuItem onClick={() => setImageOpen(true)}>
                  <Expand className="mr-2 size-4" />
                  View full image
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => {
                  void handleDownload();
                }}
              >
                <Download className="mr-2 size-4" />
                Download
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  void handleShare();
                }}
              >
                <Share2 className="mr-2 size-4" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Details */}

        <div
          className="
            flex
            flex-1
            flex-col
            p-5
          "
        >
          <div>
            <div
              className="
                flex
                items-start
                justify-between
                gap-3
              "
            >
              <div className="min-w-0">
                <h3
                  className="
                    truncate
                    text-[17px]
                    font-semibold
                    tracking-[-0.025em]
                    text-foreground
                  "
                >
                  {item.project_name}
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-muted-foreground
                  "
                >
                  {buildDescription(item)}
                </p>
              </div>
            </div>

            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-2
              "
            >
              <MetadataPill>{formatLabel(item.workflow)}</MetadataPill>

              {item.language && (
                <MetadataPill>{formatSentenceCase(item.language)}</MetadataPill>
              )}

              {item.platform && (
                <MetadataPill>{formatLabel(item.platform)}</MetadataPill>
              )}

              {item.media_type === "voice" && item.voice_name && (
                <MetadataPill>{formatLabel(item.voice_name)}</MetadataPill>
              )}
            </div>
          </div>

          <div className="flex-1" />

          <div
            className="
              mt-6
              border-t
              border-border/50
              pt-4
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <p
                className="
                  text-xs
                  text-muted-foreground
                "
              >
                {formatDate(item.created_at)}
              </p>

              <Link
                href={`/dashboard/projects/${item.project_uid}/generations/${item.generation_uid}`}
                className="
                  text-xs
                  font-semibold
                  text-mecho-purple
                  transition-opacity

                  hover:opacity-70
                "
              >
                Open source
              </Link>
            </div>
          </div>
        </div>
      </article>

      {item.media_type === "image" && (
        <ImagePreviewDialog
          open={imageOpen}
          onOpenChange={setImageOpen}
          item={item}
        />
      )}
    </>
  );
}

function MediaPreview({
  item,
  onImageOpen,
}: {
  item: LibraryItem;
  onImageOpen: () => void;
}) {
  if (item.media_type === "image") {
    return (
      <button
        type="button"
        onClick={onImageOpen}
        aria-label={`Open ${item.project_name} image`}
        className="
          relative
          block
          size-full
          cursor-zoom-in
          overflow-hidden
        "
      >
        <Image
          src={item.url}
          alt={item.project_name}
          fill
          className="
            object-cover
            transition-transform
            duration-500

            group-hover:scale-[1.025]
          "
          sizes="
            (max-width: 768px) 100vw,
            (max-width: 1280px) 50vw,
            33vw
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-black/0
            transition-colors

            group-hover:bg-black/[0.04]
          "
        />

        <span
          className="
            absolute
            bottom-4
            right-4
            flex
            size-9
            translate-y-2
            items-center
            justify-center
            rounded-full
            bg-background/90
            text-foreground
            opacity-0
            backdrop-blur-xl
            transition-all

            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          <Expand className="size-4" />
        </span>
      </button>
    );
  }

  if (item.media_type === "voice") {
    return (
      <div
        className="
          relative
          flex
          size-full
          flex-col
          items-center
          justify-center
          overflow-hidden
          px-7
        "
      >
        <div
          aria-hidden="true"
          className="
            absolute
            left-[10%]
            top-[15%]
            size-36
            rounded-full
            bg-mecho-purple/10
            blur-[70px]
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute
            bottom-[8%]
            right-[8%]
            size-28
            rounded-full
            bg-mecho-orange/10
            blur-[60px]
          "
        />

        <div
          className="
            relative
            flex
            size-16
            items-center
            justify-center
            rounded-[1.4rem]
            bg-mecho-purple-soft
            text-mecho-purple
          "
        >
          <Headphones className="size-6" />
        </div>

        <div
          className="
            relative
            mt-5
            w-full
          "
        >
          <audio controls preload="metadata" className="w-full">
            <source src={item.url} type="audio/mpeg" />
          </audio>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        relative
        size-full
        overflow-hidden
      "
    >
      <video
        src={item.url}
        preload="metadata"
        className="
          size-full
          object-cover
        "
      />

      <div
        className="
          absolute
          inset-0
          flex
          items-center
          justify-center
          bg-black/15
        "
      >
        <div
          className="
            flex
            size-14
            items-center
            justify-center
            rounded-full
            bg-background/90
            text-foreground
            shadow-xl
            backdrop-blur
          "
        >
          <Play
            className="
              ml-0.5
              size-5
            "
          />
        </div>
      </div>
    </div>
  );
}

function MediaTypeIcon({ type }: { type: LibraryItem["media_type"] }) {
  if (type === "voice") {
    return <Headphones className="size-3.5" />;
  }

  if (type === "image") {
    return <ImageIcon className="size-3.5" />;
  }

  return <Video className="size-3.5" />;
}

function MetadataPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="
        rounded-full
        border
        border-border/60
        bg-muted/25
        px-2.5
        py-1
        text-[11px]
        font-medium
        text-muted-foreground
      "
    >
      {children}
    </span>
  );
}

function buildDescription(item: LibraryItem) {
  if (item.media_type === "voice") {
    const voice = item.voice_name
      ? formatLabel(item.voice_name)
      : "Mecho voice";

    return `${voice} narration`;
  }

  if (item.media_type === "image") {
    const platform = item.platform ? formatLabel(item.platform) : null;

    return platform
      ? `Visual created for ${platform}`
      : "Generated campaign visual";
  }

  const platform = item.platform ? formatLabel(item.platform) : null;

  return platform ? `Video created for ${platform}` : "Generated video";
}
