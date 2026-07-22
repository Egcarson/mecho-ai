"use client";

import { MessageCircle, Check } from "lucide-react";
import {
  FaXTwitter,
  FaTiktok,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa6";

interface PlatformSelectorProps {
  value: string[];
  onChange: (platforms: string[]) => void;
}

const PLATFORMS = [
  {
    id: "facebook",
    name: "Facebook",
    description: "Community & business posts",
    icon: FaFacebook,
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Captions & carousel content",
    icon: FaInstagram,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Professional audience",
    icon: FaLinkedin,
  },
  {
    id: "x",
    name: "X (Twitter)",
    description: "Short-form updates",
    icon: FaXTwitter,
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Titles & descriptions",
    icon: FaYoutube,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Broadcast & status",
    icon: MessageCircle,
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "Video captions",
    icon: FaTiktok,
  },
] as const;

export default function PlatformSelector({
  value,
  onChange,
}: PlatformSelectorProps) {
  function togglePlatform(platform: string) {
    if (value.includes(platform)) {
      onChange(value.filter((item) => item !== platform));
    } else {
      onChange([...value, platform]);
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-semibold text-white">Platforms</h3>

        <p className="mt-1 text-sm text-gray-400">
          Select where your content will be published.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-2">
        {PLATFORMS.map((platform) => {
          const selected = value.includes(platform.id);
          const Icon = platform.icon;

          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => togglePlatform(platform.id)}
              className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1
              ${
                selected
                  ? "border-violet-500 bg-violet-600/15 shadow-lg shadow-violet-600/20"
                  : "border-white/10 bg-white/5 hover:border-violet-400"
              }`}
            >
              {selected && (
                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500">
                  <Check size={14} />
                </div>
              )}

              <div
                className={`mb-4 inline-flex rounded-xl p-3 transition-colors ${
                  selected
                    ? "bg-violet-500 text-white"
                    : "bg-white/10 text-violet-300 group-hover:bg-violet-500/20"
                }`}
              >
                <Icon size={22} />
              </div>

              <h4 className="font-semibold text-white">{platform.name}</h4>

              <p className="mt-1 text-xs leading-relaxed text-gray-400">
                {platform.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
