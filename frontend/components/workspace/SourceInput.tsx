"use client";

import { GenerateSettings } from "@/types/generate";
import CampaignSourceInput from "./CampaignSourceInput";
import SocialSourceInput from "./SocialSourceInput";

interface SourceInputProps {
  settings: GenerateSettings;
  onSettingsChange: React.Dispatch<React.SetStateAction<GenerateSettings>>;
}

export default function SourceInput({
  settings,
  onSettingsChange,
}: SourceInputProps) {
  return settings.workflow === "social" ? (
    <SocialSourceInput
      settings={settings}
      onSettingsChange={onSettingsChange}
    />
  ) : (
    <CampaignSourceInput
      settings={settings}
      onSettingsChange={onSettingsChange}
    />
  );
}
