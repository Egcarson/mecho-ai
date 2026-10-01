"use client";

import { toast } from "sonner";

export function VideoGenerator() {
  function handleClick() {
    toast.info("Video generation is coming soon.");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="hidden"
      aria-hidden="true"
      tabIndex={-1}
    >
      Video
    </button>
  );
}
