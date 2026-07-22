"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, Sparkles } from "lucide-react";

const steps = [
  "Analyzing your campaign...",
  "Understanding your audience...",
  "Crafting engaging content...",
  "Optimizing for selected platforms...",
  "Finalizing everything...",
];

interface Props {
  open: boolean;
}

export default function GeneratingOverlay({ open }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) {
      setStep(0);
      return;
    }

    const interval = setInterval(() => {
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, 1500);

    return () => clearInterval(interval);
  }, [open]);

  if (!open) return null;

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-xl">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#12091f]/95 p-8 shadow-2xl shadow-violet-900/40 backdrop-blur-2xl">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-orange-500 shadow-lg shadow-violet-700/30">
            <Sparkles className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white">LocalVoice AI</h2>

          <p className="mt-2 text-center text-sm text-gray-400">
            Crafting high-quality localized content...
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl px-2 py-1 transition-all"
            >
              {index < step ? (
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              ) : index === step ? (
                <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
              ) : (
                <div className="h-5 w-5 rounded-full border border-gray-600" />
              )}

              <span
                className={`text-sm ${
                  index <= step ? "text-white" : "text-gray-500"
                }`}
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-linear-to-r from-violet-600 via-fuchsia-500 to-orange-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-gray-400">
            <span>Please don't close this window</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
