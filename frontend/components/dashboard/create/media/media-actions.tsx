"use client";

import { ImageIcon, Video, Volume2 } from "lucide-react";

export type ActiveMedia = "voice" | "image" | "video" | null;

type MediaActionsProps = {
  activeMedia?: ActiveMedia;
  onVoice?: () => void;
  onImage?: () => void;
  onVideo?: () => void;
};

export function MediaActions({
  activeMedia = null,
  onVoice,
  onImage,
  onVideo,
}: MediaActionsProps) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {onVoice && (
        <MediaButton
          active={activeMedia === "voice"}
          onClick={onVoice}
          icon={Volume2}
        >
          Voice
        </MediaButton>
      )}

      {onImage && (
        <MediaButton
          active={activeMedia === "image"}
          onClick={onImage}
          icon={ImageIcon}
        >
          Image
        </MediaButton>
      )}

      {onVideo && (
        <MediaButton
          active={activeMedia === "video"}
          onClick={onVideo}
          icon={Video}
        >
          Video
        </MediaButton>
      )}
    </div>
  );
}

function MediaButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-all ${
        active
          ? "border-mecho-purple/25 bg-mecho-purple-soft text-mecho-purple shadow-[0_0_0_4px_rgba(111,44,255,0.07)]"
          : "border-border/70 bg-background text-foreground/80 hover:border-mecho-purple/20 hover:bg-mecho-purple-soft/40 hover:text-mecho-purple"
      }`}
    >
      <Icon className="size-4" />
      {children}
    </button>
  );
}
