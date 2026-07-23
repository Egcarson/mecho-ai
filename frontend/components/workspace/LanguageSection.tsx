"use client";

import { Globe } from "lucide-react";
import PlatformCard from "./PlatformCard";

interface PlatformContent {
  platform: string;
  hook: string;
  content: string;
  call_to_action: string;
  hashtags: string[];
}

interface LanguageSectionProps {
  language: string;
  contents: PlatformContent[];
}

export default function LanguageSection({
  language,
  contents,
}: LanguageSectionProps) {
  return (
    <section className="space-y-6">
      {/* Language Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
          <Globe className="h-5 w-5 text-violet-400" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">{language}</h2>

          <p className="text-sm text-gray-400">
            Generated content for all selected platforms
          </p>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="space-y-5">
        {contents.map((item) => (
          <PlatformCard
            key={item.platform}
            platform={item.platform}
            hook={item.hook}
            content={item.content}
            callToAction={item.call_to_action}
            hashtags={item.hashtags}
            language={language}
          />
        ))}
      </div>
    </section>
  );
}
