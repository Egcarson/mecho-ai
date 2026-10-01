"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, ImageIcon, Share2 } from "lucide-react";
import { toast } from "sonner";

import {
  downloadFile,
  formatDate,
  formatLabel,
  formatSentenceCase,
  shareFile,
  type LibraryItem,
} from "@/lib/library";

type ImageLibraryCardProps = {
  item: LibraryItem;
};

export function ImageLibraryCard({ item }: ImageLibraryCardProps) {
  async function handleDownload() {
    try {
      await downloadFile(item.url, `${item.project_name}-image.png`);

      toast.success("Image downloaded");
    } catch (error) {
      toast.error("We couldn't download this image", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  async function handleShare() {
    try {
      await shareFile(item.url, item.project_name);

      toast.success("Image link ready", {
        description: "Shared successfully, or copied to your clipboard.",
      });
    } catch {
      toast.error("We couldn't share this image right now.");
    }
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-[1.5rem]
        border
        border-border/70
        bg-background
        shadow-[0_10px_40px_rgba(16,18,29,0.04)]
      "
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30">
        <Image
          src={item.url}
          alt={item.project_name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />

        <div
          className="
            absolute
            left-4
            top-4
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-background/90
            px-3
            py-1.5
            text-xs
            font-semibold
            text-foreground
            backdrop-blur
          "
        >
          <ImageIcon className="size-3.5" />
          Image
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p
              className="
                truncate
                text-base
                font-semibold
                tracking-[-0.02em]
              "
            >
              {item.project_name}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {formatLabel(item.workflow)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.language && (
            <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              {formatSentenceCase(item.language)}
            </span>
          )}

          {item.platform && (
            <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              {formatLabel(item.platform)}
            </span>
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Created {formatDate(item.created_at)}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            href={`/dashboard/projects/${item.project_uid}/generations/${item.generation_uid}`}
            className="
              inline-flex
              h-10
              items-center
              rounded-full
              border
              border-border/70
              px-4
              text-sm
              font-medium
              transition-colors
              hover:bg-muted/50
            "
          >
            Open generation
          </Link>

          <button
            type="button"
            onClick={handleDownload}
            className="
              inline-flex
              h-10
              items-center
              gap-2
              rounded-full
              border
              border-border/70
              px-4
              text-sm
              font-medium
              transition-colors
              hover:bg-muted/50
            "
          >
            <Download className="size-4" />
            Download
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="
              inline-flex
              h-10
              items-center
              gap-2
              rounded-full
              border
              border-border/70
              px-4
              text-sm
              font-medium
              transition-colors
              hover:bg-muted/50
            "
          >
            <Share2 className="size-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
