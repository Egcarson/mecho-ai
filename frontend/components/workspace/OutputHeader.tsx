import { RotateCcw, Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { storage } from "@/lib/Storage";

interface Props {
  onGenerateAgain: () => void;
}

export default function OutputHeader({ onGenerateAgain }: Props) {
  const [name, setName] = useState("Creator");

  useEffect(() => {
    const storedName = storage.getName();

    if (storedName) {
      setName(storedName);
    }
  }, []);

  const capitalized =
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  return (
    <div className="rounded-3xl border border-violet-500/20 bg-white/5 p-8 backdrop-blur-xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-green-400">
            <Sparkles className="h-4 w-4" />
            Generated Successfully
          </div>

          <h1 className="text-4xl font-bold text-white">
            Your content is ready, {capitalized}!
          </h1>

          <p className="mt-3 max-w-2xl text-gray-400">
            LocalVoice AI has successfully generated localized content tailored
            to your selected languages and platforms.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="
      h-12
      rounded-2xl
      border-white/15
      bg-white/5
      px-6
      text-white
      transition-all
      hover:border-violet-500/40
      hover:bg-violet-500/10
      hover:text-violet-300
    "
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Everything
            </Button>

            <Button
              onClick={onGenerateAgain}
              className="
      h-12
      rounded-2xl
      bg-linear-to-r
      from-violet-600
      via-purple-600
      to-orange-500
      px-7
      font-semibold
      text-white
      shadow-lg
      shadow-violet-600/30
      transition-all
      hover:scale-[1.02]
      hover:shadow-xl
      hover:shadow-violet-600/40
      active:scale-[0.98]
    "
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Generate Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
