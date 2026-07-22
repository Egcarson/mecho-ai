"use client";

import { useState } from "react";
import { Check, Copy, Pencil, Download, MessageCircle } from "lucide-react";

import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface PlatformCardProps {
  platform: string;
  hook: string;
  content: string;
  callToAction: string;
  hashtags: string[];
}

export default function PlatformCard({
  platform,
  hook,
  content,
  callToAction,
  hashtags,
}: PlatformCardProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  const [editedHook, setEditedHook] = useState(hook);
  const [editedContent, setEditedContent] = useState(content);
  const [editedCTA, setEditedCTA] = useState(callToAction);

  const copyContent = async () => {
    const finalText = `${editedHook}

${editedContent}

${editedCTA}

${hashtags.map((tag) => `#${tag}`).join(" ")}`;

    await navigator.clipboard.writeText(finalText);

    toast.success("Copied to clipboard");

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  const exportContent = () => {
    const finalText = `${editedHook}

${editedContent}

${editedCTA}

${hashtags.map((tag) => `#${tag}`).join(" ")}`;

    const blob = new Blob([finalText], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${platform.toLowerCase()}-content.txt`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    toast.success("Content exported");
  };

  const handleEditToggle = () => {
    if (editing) {
      toast.success("Changes saved");
    }

    setEditing((prev) => !prev);
  };

  const icon = (() => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <FaFacebook className="h-5 w-5 text-blue-400" />;

      case "instagram":
        return <FaInstagram className="h-5 w-5 text-pink-400" />;

      case "linkedin":
        return <FaLinkedin className="h-5 w-5 text-sky-400" />;

      default:
        return <MessageCircle className="h-5 w-5 text-orange-400" />;
    }
  })();

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-violet-500/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-semibold text-white">{platform}</h3>
        </div>

        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
          Ready
        </span>
      </div>

      {/* Content */}
      <div className="space-y-6 p-6">
        {editing ? (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
                Hook
              </p>

              <Textarea
                value={editedHook}
                onChange={(e) => setEditedHook(e.target.value)}
                rows={2}
                className="resize-none border-white/10 bg-[#12091f]"
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
                Content
              </p>

              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={10}
                className="resize-none border-white/10 bg-[#12091f]"
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
                Call To Action
              </p>

              <Textarea
                value={editedCTA}
                onChange={(e) => setEditedCTA(e.target.value)}
                rows={2}
                className="resize-none border-white/10 bg-[#12091f]"
              />
            </div>
          </div>
        ) : (
          <>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
                Hook
              </p>

              <p className="leading-7 font-medium text-white">{editedHook}</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
                Content
              </p>

              <p className="whitespace-pre-wrap leading-8 text-gray-300">
                {editedContent}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
                Call To Action
              </p>

              <p className="leading-7 text-orange-300">{editedCTA}</p>
            </div>

            {hashtags.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-violet-300">
                  Hashtags
                </p>

                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap gap-3 border-t border-white/10 p-5">
        <Button variant="secondary" onClick={copyContent}>
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </>
          )}
        </Button>

        <Button variant="secondary" onClick={handleEditToggle}>
          <Pencil className="mr-2 h-4 w-4" />
          {editing ? "Save" : "Edit"}
        </Button>

        <Button variant="secondary" onClick={exportContent}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
