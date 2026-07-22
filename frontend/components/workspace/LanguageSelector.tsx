"use client";
import { Check } from "lucide-react";

interface LanguageSelectorProps {
  value: string[];
  onChange: (languages: string[]) => void;
}

const LANGUAGES = ["English", "Yoruba", "Igbo", "Hausa", "Pidgin"];

export default function LanguageSelector({
  value,
  onChange,
}: LanguageSelectorProps) {
  function toggleLanguage(language: string) {
    if (value.includes(language)) {
      onChange(value.filter((item) => item !== language));
    } else {
      onChange([...value, language]);
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-semibold text-white">Languages</h3>

        <p className="mt-1 text-sm text-gray-400">
          Choose one or more languages for the generated content.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {LANGUAGES.map((language) => {
          const selected = value.includes(language);

          return (
            <button
              key={language}
              type="button"
              onClick={() => toggleLanguage(language)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selected
                  ? "border-violet-500 bg-violet-600 text-white"
                  : "border-white/10 bg-white/5 text-gray-300 hover:border-violet-400 hover:bg-white/10"
              }`}
            >
              {selected && <Check size={16} />}
              <span>{language}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
