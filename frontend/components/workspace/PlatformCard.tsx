"use client";
import { jsPDF } from "jspdf";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  Pencil,
  Download,
  MessageCircle,
  Loader2,
  Share2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Volume2 } from "lucide-react";
import { getSpeech } from "@/lib/tts";
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
  language: string;
}

export default function PlatformCard({
  platform,
  hook,
  content,
  callToAction,
  hashtags,
  language,
}: PlatformCardProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [editedHook, setEditedHook] = useState(hook);
  const [editedContent, setEditedContent] = useState(content);
  const [editedCTA, setEditedCTA] = useState(callToAction);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

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
    const doc = new jsPDF();

    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("LocalVoice AI", 20, y);

    y += 10;

    doc.setFontSize(14);
    doc.text(`Platform: ${platform}`, 20, y);

    y += 10;

    doc.text(`Language: ${language}`, 20, y);

    y += 15;

    doc.setFont("helvetica", "bold");
    doc.text("Hook", 20, y);

    y += 8;

    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(editedHook, 170), 20, y);

    y += 20;

    doc.setFont("helvetica", "bold");
    doc.text("Content", 20, y);

    y += 8;

    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(editedContent, 170), 20, y);

    y += 70;

    doc.setFont("helvetica", "bold");
    doc.text("Call To Action", 20, y);

    y += 8;

    doc.setFont("helvetica", "normal");
    doc.text(editedCTA, 20, y);

    y += 15;

    doc.text(hashtags.map((h) => `#${h}`).join(" "), 20, y);

    doc.save(`${platform}-${language}.pdf`);

    toast.success("PDF exported");
  };

  const getFinalContent = () => {
    return `${editedHook}

${editedContent}

${editedCTA}

${hashtags.map((tag) => `#${tag}`).join(" ")}`;
  };

  const shareContent = async () => {
    try {
      const text = getFinalContent();

      if (navigator.share) {
        await navigator.share({
          title: `LocalVoice AI • ${platform}`,
          text,
        });

        return;
      }

      await navigator.clipboard.writeText(text);

      toast.success("Content copied. Ready to paste anywhere.");
    } catch {
      toast.error("Unable to share content.");
    }
  };

  const shareAudio = async () => {
    try {
      let url = audioUrl;

      if (!url) {
        url = await getSpeech(narration, language);

        setAudioUrl(url);
      }

      if (navigator.share) {
        await navigator.share({
          title: `LocalVoice AI • ${platform}`,
          text: "Listen to this AI-generated content.",
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      toast.success("Audio link copied.");
    } catch {
      toast.error("Unable to share audio.");
    }
  };

  const narration = `
    ${editedHook}

    ${editedContent}

    ${editedCTA}
    `.trim();

  const handleListen = async () => {
    try {
      setPlaying(true);

      // Stop any audio already playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      let url = audioUrl;

      if (!url) {
        url = await getSpeech(narration, language);

        setAudioUrl(url);
      }

      const audio = new Audio(url);

      audioRef.current = audio;

      audio.onended = () => {
        setPlaying(false);
      };

      audio.onerror = () => {
        toast.error("Unable to play audio.");
        setPlaying(false);
      };

      await audio.play();
    } catch (error) {
      console.error(error);

      toast.error("Unable to generate speech.");

      setPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

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

        <DropdownMenu>
          <DropdownMenuTrigger
            className="
      inline-flex items-center gap-2
      rounded-lg
      px-2 py-2
      text-sm font-medium
      text-white/85
      transition-all
      hover:text-white
      focus:outline-none
    "
          >
            <Share2 className="h-4 w-4" />
            Share
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="
      w-60
      rounded-2xl
      border border-white/10
      bg-[#141228]
      p-2
      shadow-2xl
      backdrop-blur-xl
    "
          >
            <DropdownMenuItem
              onClick={shareContent}
              className="
  flex items-center gap-3
  rounded-xl
  px-3 py-3
  text-white
  bg-transparent
  hover:bg-transparent
  focus:bg-transparent
  data-[highlighted]:bg-transparent
  data-[highlighted]:text-white
"
            >
              <Share2 className="h-5 w-5 text-purple-400" />

              <div className="flex flex-col">
                <span className="font-medium">Share Content</span>
                <span className="text-xs text-white/50">
                  Copy or share the generated post
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={shareAudio}
              className="
  flex items-center gap-3
  rounded-xl
  px-3 py-3
  text-white
  bg-transparent
  hover:bg-transparent
  focus:bg-transparent
  data-[highlighted]:bg-transparent
  data-[highlighted]:text-white
"
            >
              <Volume2 className="h-5 w-5 text-orange-400" />

              <div className="flex flex-col">
                <span className="font-medium">Share Audio</span>
                <span className="text-xs text-white/50">
                  Share generated narration
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={exportContent}
              className="
  flex items-center gap-3
  rounded-xl
  px-3 py-3
  text-white
  bg-transparent
  hover:bg-transparent
  focus:bg-transparent
  data-[highlighted]:bg-transparent
  data-[highlighted]:text-white
"
            >
              <Download className="h-5 w-5 text-purple-400" />

              <div className="flex flex-col">
                <span className="font-medium">Download PDF</span>
                <span className="text-xs text-white/50">Export document</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={handleListen}
          disabled={playing}
          className="
    h-10
    rounded-xl
    bg-linear-to-r
    from-violet-600
    to-purple-700
    px-5
    font-medium
    text-white
    shadow-lg
    shadow-violet-900/20
    transition-all
    duration-300
    hover:scale-[1.02]
    hover:from-violet-500
    hover:to-purple-600
    hover:shadow-violet-500/30
    active:scale-[0.98]
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
        >
          {playing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing Audio...
            </>
          ) : (
            <>
              <Volume2 className="mr-2 h-4 w-4" />
              Listen to Content
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
