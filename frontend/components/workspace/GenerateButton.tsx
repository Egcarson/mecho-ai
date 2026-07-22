"use client";

import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenerateButtonProps {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function GenerateButton({
  loading,
  disabled,
  onClick,
}: GenerateButtonProps) {
  return (
    <Button
      type="button"
      disabled={loading || disabled}
      onClick={onClick}
      className="
        mt-2
        h-14
        w-full
        rounded-2xl
        bg-linear-to-r
        from-violet-600
        to-orange-500
        text-base
        font-semibold
        text-white
        shadow-lg
        shadow-violet-600/20
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-xl
        hover:shadow-violet-500/30
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Content
        </>
      )}
    </Button>
  );
}
