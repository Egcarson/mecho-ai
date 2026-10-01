"use client";

import Image from "next/image";
import Link from "next/link";

import { Download, ExternalLink, Share2, X } from "lucide-react";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  downloadFile,
  formatLabel,
  shareFile,
  type LibraryItem,
} from "@/lib/library";

type ImagePreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: LibraryItem;
};

export function ImagePreviewDialog({
  open,
  onOpenChange,
  item,
}: ImagePreviewDialogProps) {
  async function handleDownload() {
    try {
      await downloadFile(item.url, `${item.project_name}-image.png`);

      toast.success("Image downloaded.");
    } catch {
      toast.error("Couldn't download this image.");
    }
  }

  async function handleShare() {
    try {
      await shareFile(item.url, item.project_name);

      toast.success("Image ready to share.");
    } catch {
      toast.error("Couldn't share this image.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="
          fixed
          left-1/2
          top-1/2
          z-[100]

          h-[100dvh]
          w-[100dvw]
          max-w-none

          -translate-x-1/2
          -translate-y-1/2

          gap-0
          overflow-hidden
          rounded-none
          border-0
          bg-black
          p-0
          shadow-none

          sm:max-w-none
        "
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{item.project_name}</DialogTitle>

          <DialogDescription>Full-screen image preview</DialogDescription>
        </DialogHeader>

        {/* ======================================================
            IMAGE
        ====================================================== */}

        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            overflow-hidden
            bg-black
          "
        >
          <div
            className="
              relative
              h-full
              w-full
            "
          >
            <Image
              src={item.url}
              alt={item.project_name}
              fill
              priority
              draggable={false}
              className="
                select-none
                object-contain
              "
              sizes="100vw"
            />
          </div>
        </div>

        {/* ======================================================
            TOP OVERLAY
        ====================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            z-30

            flex
            items-start
            justify-between
            gap-6

            bg-gradient-to-b
            from-black/75
            via-black/35
            to-transparent

            px-4
            pb-16
            pt-4

            sm:px-6
            sm:pt-6

            lg:px-8
          "
        >
          <div
            className="
              min-w-0
              max-w-xl
            "
          >
            <h2
              className="
                truncate
                text-sm
                font-semibold
                tracking-[-0.02em]
                text-white

                sm:text-base
              "
            >
              {item.project_name}
            </h2>

            <p
              className="
                mt-1.5
                truncate
                text-xs
                text-white/60
              "
            >
              {formatLabel(item.workflow)}

              {item.platform ? ` · ${formatLabel(item.platform)}` : ""}

              {item.language ? ` · ${formatLabel(item.language)}` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close image preview"
            className="
              pointer-events-auto

              flex
              size-11
              shrink-0
              items-center
              justify-center

              rounded-full
              border
              border-white/15

              bg-black/35
              text-white
              backdrop-blur-xl

              transition-all

              hover:bg-white/10
              active:scale-95
            "
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ======================================================
            BOTTOM OVERLAY
        ====================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            z-30

            flex
            items-end
            justify-between
            gap-3

            bg-gradient-to-t
            from-black/80
            via-black/35
            to-transparent

            px-4
            pb-[calc(1rem+env(safe-area-inset-bottom))]
            pt-20

            sm:px-6
            sm:pb-6

            lg:px-8
            lg:pb-8
          "
        >
          <Link
            href={`/dashboard/projects/${item.project_uid}/generations/${item.generation_uid}`}
            className="
              pointer-events-auto

              inline-flex
              h-11
              items-center
              gap-2

              rounded-full
              border
              border-white/15

              bg-black/30
              px-4

              text-sm
              font-medium
              text-white

              backdrop-blur-xl
              transition-colors

              hover:bg-white/10
            "
          >
            <ExternalLink className="size-4" />

            <span className="hidden sm:inline">Open source</span>
          </Link>

          <div
            className="
              pointer-events-auto
              flex
              items-center
              gap-2
            "
          >
            <button
              type="button"
              onClick={() => {
                void handleShare();
              }}
              aria-label="Share image"
              className="
                flex
                size-11
                items-center
                justify-center

                rounded-full
                border
                border-white/15

                bg-black/30
                text-white
                backdrop-blur-xl

                transition-all

                hover:bg-white/10
                active:scale-95
              "
            >
              <Share2 className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                void handleDownload();
              }}
              className="
                inline-flex
                h-11
                items-center
                gap-2

                rounded-full
                bg-white
                px-4

                text-sm
                font-semibold
                text-black

                transition-all

                hover:bg-white/90
                active:scale-[0.98]
              "
            >
              <Download className="size-4" />
              Download
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
