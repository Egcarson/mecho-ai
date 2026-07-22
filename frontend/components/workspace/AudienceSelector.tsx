"use client";

import { Check } from "lucide-react";

interface AudienceSelectorProps {
  value: string[];
  onChange: (audiences: string[]) => void;
}

const AUDIENCES = [
  "General Public",
  "Businesses",
  "Professionals",
  "Students",
  "Youth",
  "Parents",
  "Communities",
  "NGOs",
  "Government Agencies",
  "Content Creators",
] as const;

export default function AudienceSelector({
  value,
  onChange,
}: AudienceSelectorProps) {
  function toggleAudience(audience: string) {
    if (value.includes(audience)) {
      onChange(value.filter((item) => item !== audience));
    } else {
      onChange([...value, audience]);
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-semibold text-white">Target Audience</h3>

        <p className="mt-1 text-sm text-gray-400">
          Select who this content is intended for.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {AUDIENCES.map((audience) => {
          const selected = value.includes(audience);

          return (
            <button
              key={audience}
              type="button"
              onClick={() => toggleAudience(audience)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selected
                  ? "border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                  : "border-white/10 bg-white/5 text-gray-300 hover:border-violet-400 hover:bg-white/10"
              }`}
            >
              {selected && <Check size={16} />}
              <span>{audience}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
