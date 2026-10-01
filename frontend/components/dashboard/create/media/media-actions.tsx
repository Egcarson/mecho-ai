"use client";

import { ImageIcon, Video, Volume2 } from "lucide-react";

type MediaActionsProps = {
  onVoice?: () => void;
  onImage?: () => void;
  onVideo?: () => void;
};

export function MediaActions({ onVoice, onImage, onVideo }: MediaActionsProps) {
  return (
    <div
      className="
        mt-8
        flex
        flex-wrap
        gap-3
      "
    >
      {onVoice && (
        <button
          type="button"
          onClick={onVoice}
          className="
            inline-flex
            h-11
            items-center
            gap-2
            rounded-full
            border
            border-border/70
            bg-background
            px-5
            text-sm
            font-medium
            text-foreground/80
            transition-all

            hover:border-mecho-purple/20
            hover:bg-mecho-purple-soft/40
            hover:text-mecho-purple
          "
        >
          <Volume2 className="size-4" />
          Voice
        </button>
      )}

      {onImage && (
        <button
          type="button"
          onClick={onImage}
          className="
            inline-flex
            h-11
            items-center
            gap-2
            rounded-full
            border
            border-border/70
            bg-background
            px-5
            text-sm
            font-medium
            text-foreground/80
            transition-all

            hover:border-mecho-purple/20
            hover:bg-mecho-purple-soft/40
            hover:text-mecho-purple
          "
        >
          <ImageIcon className="size-4" />
          Image
        </button>
      )}

      {onVideo && (
        <button
          type="button"
          onClick={onVideo}
          className="
            inline-flex
            h-11
            items-center
            gap-2
            rounded-full
            border
            border-border/70
            bg-background
            px-5
            text-sm
            font-medium
            text-foreground/80
            transition-all

            hover:border-mecho-purple/20
            hover:bg-mecho-purple-soft/40
            hover:text-mecho-purple
          "
        >
          <Video className="size-4" />
          Video
        </button>
      )}
    </div>
  );
}
