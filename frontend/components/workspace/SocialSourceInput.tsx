"use client";

import { GenerateSettings } from "@/types/generate";
import UploadArea from "./UploadArea";

interface Props {
  settings: GenerateSettings;
  onSettingsChange: React.Dispatch<React.SetStateAction<GenerateSettings>>;
}

export default function SocialSourceInput({
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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Source Material</h2>

        <p className="mt-2 text-gray-400">
          Upload a document, paste existing content, or simply describe what
          you'd like to create.
        </p>
      </div>

      <div className="space-y-8">
        {/* Upload */}
        <div>
          {/* <h3 className="mb-3 text-sm font-medium text-gray-300">
            Upload Document (Optional)
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
        {/* Existing Content */}
        {/* <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Paste Existing Content
          </label>

          <textarea
            rows={7}
            value={settings.content}
            onChange={(e) => update("content", e.target.value)}
            placeholder="Paste an existing social media post, article, announcement, or any content you'd like LocalVoice AI to transform."
            className="w-full rounded-2xl border border-white/10 bg-[#12091f] p-4 text-white outline-none transition focus:border-violet-500"
          />
        </div> */}
        {/* <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-wider text-gray-500">
            OR
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div> */}
        {/* Brief */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Describe What You Want
          </label>

          <textarea
            rows={20}
            value={settings.brief}
            onChange={(e) => update("brief", e.target.value)}
            placeholder="Example: Create engaging posts promoting our upcoming community clean-up exercise for Facebook, Instagram, and WhatsApp."
            className="w-full rounded-2xl border border-white/10 bg-[#12091f] p-4 text-white outline-none transition focus:border-violet-500"
          />
        </div>
      </div>
    </div>
  );
}
