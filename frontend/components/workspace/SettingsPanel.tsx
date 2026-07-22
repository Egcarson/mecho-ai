"use client";

import { GenerateSettings } from "@/types/generate";

import AudienceSelector from "./AudienceSelector";
import GenerateButton from "./GenerateButton";
import LanguageSelector from "./LanguageSelector";
import PlatformSelector from "./PlatformSelector";
import ToneSelector from "./ToneSelector";

interface SettingsPanelProps {
  settings: GenerateSettings;
  loading: boolean;
  onGenerate: () => void;
  onSettingsChange: (settings: React.SetStateAction<GenerateSettings>) => void;
}

export default function SettingsPanel({
  settings,
  loading,
  onGenerate,
  onSettingsChange,
}: SettingsPanelProps) {
  const canGenerate =
    settings.upload || settings.content.trim() || settings.brief.trim();

  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">AI Settings</h2>

        <p className="mt-2 text-gray-400">
          Configure how LocalVoice AI should generate your content.
        </p>
      </div>

      <div className="space-y-8">
        <ToneSelector
          value={settings.tone}
          onChange={(tone) =>
            onSettingsChange((prev) => ({
              ...prev,
              tone,
            }))
          }
        />

        <AudienceSelector
          value={settings.audiences}
          onChange={(audiences) =>
            onSettingsChange((prev) => ({
              ...prev,
              audiences,
            }))
          }
        />

        <PlatformSelector
          value={settings.platforms}
          onChange={(platforms) =>
            onSettingsChange((prev) => ({
              ...prev,
              platforms,
            }))
          }
        />

        <LanguageSelector
          value={settings.languages}
          onChange={(languages) =>
            onSettingsChange((prev) => ({
              ...prev,
              languages,
            }))
          }
        />

        <GenerateButton
          loading={loading}
          disabled={!canGenerate}
          onClick={onGenerate}
        />
      </div>
    </aside>
  );
}
