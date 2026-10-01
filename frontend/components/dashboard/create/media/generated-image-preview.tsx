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

type Props = {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  imageUrl: string;

  title?: string;

  sourceHref?: string;
};

export function GeneratedImagePreview({
  open,
  onOpenChange,
  imageUrl,
  title = "Generated design",
  sourceHref,
}: Props) {
  async function download() {
    try {
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error();
      }

      const blob = await response.blob();

      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = objectUrl;

      link.download = "mecho-design.png";

      document.body.appendChild(link);

      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);
    } catch {
      toast.error("Couldn't download image.");
    }
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url: imageUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(imageUrl);

      toast.success("Image link copied.");
    } catch {
      toast.error("Couldn't share image.");
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
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>Full-screen design preview</DialogDescription>
        </DialogHeader>

        <div
          className="
            absolute
            inset-0
          "
        >
          <Image
            src={imageUrl}
            alt={title}
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

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            z-20
            flex
            items-center
            justify-between
            bg-gradient-to-b
            from-black/75
            via-black/25
            to-transparent
            px-4
            pb-16
            pt-4

            sm:px-6
          "
        >
          <p
            className="
              truncate
              text-sm
              font-semibold
              text-white
            "
          >
            {title}
          </p>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="
              pointer-events-auto
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
            "
          >
            <X className="size-5" />
          </button>
        </div>

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            z-20
            flex
            items-end
            justify-between
            gap-3
            bg-gradient-to-t
            from-black/80
            via-black/30
            to-transparent
            px-4
            pb-[calc(1rem+env(safe-area-inset-bottom))]
            pt-20

            sm:px-6
            sm:pb-6
          "
        >
          {sourceHref ? (
            <Link
              href={sourceHref}
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
              "
            >
              <ExternalLink className="size-4" />

              <span className="hidden sm:inline">Open source</span>
            </Link>
          ) : (
            <div />
          )}

          <div
            className="
              pointer-events-auto
              flex
              gap-2
            "
          >
            <button
              type="button"
              onClick={() => void share()}
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
              "
            >
              <Share2 className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => void download()}
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
