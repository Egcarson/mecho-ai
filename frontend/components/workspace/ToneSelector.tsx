"use client";

import { Check } from "lucide-react";

interface ToneSelectorProps {
  value: string;
  onChange: (tone: string) => void;
}

const TONES = [
  "Professional",
  "Friendly",
  "Persuasive",
  "Educational",
  "Inspirational",
  "Conversational",
];

export default function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-semibold text-white">Tone</h3>

        <p className="mt-1 text-sm text-gray-400">
          Choose the overall tone for the generated content.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {TONES.map((tone) => {
          const selected = value === tone;

          return (
            <button
              key={tone}
              type="button"
              onClick={() => onChange(tone)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200
                ${
                  selected
                    ? "border-violet-500 bg-violet-600 text-white"
                    : "border-white/10 bg-white/5 text-gray-300 hover:border-violet-400 hover:bg-white/10"
                }`}
            >
              {selected && <Check size={16} />}
              <span>{tone}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
