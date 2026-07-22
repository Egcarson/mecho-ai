"use client";

import { GenerateSettings } from "@/types/generate";
import UploadArea from "./UploadArea";

interface Props {
  settings: GenerateSettings;
  onSettingsChange: React.Dispatch<React.SetStateAction<GenerateSettings>>;
}

export default function CampaignSourceInput({
  settings,
  onSettingsChange,
}: Props) {
  const update = <K extends keyof GenerateSettings>(
    key: K,
    value: GenerateSettings[K],
  ) =>
    onSettingsChange((prev) => ({
      ...prev,
      [key]: value,
    }));

  return (
    <div className="min-w-0 w-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Campaign Planner</h2>

        <p className="mt-2 text-gray-400">
          Provide your campaign details. Uploading a supporting document is
          optional but helps LocalVoice AI produce more accurate content.
        </p>
      </div>

      <div className="space-y-8">
        {/* Upload */}
        <div>
          {/* <h3 className="mb-3 text-sm font-medium text-gray-300">
            Upload Your Campaign Document (Optional)
          </h3> */}

          <UploadArea
            value={settings.upload}
            onChange={(file) => update("upload", file)}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-wider text-gray-500">
            OR
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid gap-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Campaign Title
            </label>

            <input
              value={settings.campaignTitle}
              onChange={(e) => update("campaignTitle", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#12091f] p-4 text-white outline-none focus:border-violet-500"
              placeholder="e.g. Clean Lagos Initiative"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Campaign Goal
            </label>

            <textarea
              rows={4}
              value={settings.campaignGoal}
              onChange={(e) => update("campaignGoal", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#12091f] p-4 text-white outline-none focus:border-violet-500"
              placeholder="What do you want to achieve?"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Target Audience
            </label>

            <input
              value={settings.targetAudience}
              onChange={(e) => update("targetAudience", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#12091f] p-4 text-white outline-none focus:border-violet-500"
              placeholder="Who is this campaign for?"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Key Message
            </label>

            <textarea
              rows={3}
              value={settings.keyMessage}
              onChange={(e) => update("keyMessage", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#12091f] p-4 text-white outline-none focus:border-violet-500"
              placeholder="The main message you want people to remember."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Call to Action (Optional)
            </label>

            <input
              value={settings.callToAction}
              onChange={(e) => update("callToAction", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#12091f] p-4 text-white outline-none focus:border-violet-500"
              placeholder="What action should people take?"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Additional Notes (Optional)
            </label>

            <textarea
              rows={4}
              value={settings.additionalNotes}
              onChange={(e) => update("additionalNotes", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#12091f] p-4 text-white outline-none focus:border-violet-500"
              placeholder="Any extra information you'd like the AI to consider."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
