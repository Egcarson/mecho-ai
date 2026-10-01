"use client";

import Link from "next/link";
import { Download, Headphones, Share2 } from "lucide-react";
import { toast } from "sonner";

import {
  downloadFile,
  formatDate,
  formatLabel,
  formatSentenceCase,
  shareFile,
  type LibraryItem,
} from "@/lib/library";

type VoiceLibraryCardProps = {
  item: LibraryItem;
};

export function VoiceLibraryCard({ item }: VoiceLibraryCardProps) {
  async function handleDownload() {
    try {
      await downloadFile(
        item.url,
        `${item.project_name}-${item.voice_name || "voice"}.mp3`,
      );

      toast.success("Voice downloaded");
    } catch (error) {
      toast.error("We couldn't download this voice", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  async function handleShare() {
    try {
      await shareFile(item.url, item.project_name);

      toast.success("Voice link ready", {
        description: "Shared successfully, or copied to your clipboard.",
      });
    } catch {
      toast.error("We couldn't share this voice right now.");
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
        p-5
        shadow-[0_10px_40px_rgba(16,18,29,0.04)]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          <div
            className="
              flex
              size-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-mecho-purple-soft
              text-mecho-purple
            "
          >
            <Headphones className="size-5" />
          </div>

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

        <span
          className="
            shrink-0
            rounded-full
            bg-mecho-purple-soft
            px-3
            py-1
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.12em]
            text-mecho-purple
          "
        >
          Voice
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-border/60 bg-muted/30 p-4">
        <audio controls className="w-full">
          <source src={item.url} type="audio/mpeg" />
        </audio>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
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

        {item.voice_name && (
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            {formatSentenceCase(item.voice_name)}
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
  );
}
