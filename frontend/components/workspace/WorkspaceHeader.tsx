"use client";

import { useEffect, useState } from "react";
import { getGreeting } from "@/lib/greeting";
import { storage } from "@/lib/Storage";
import { Sparkles } from "lucide-react";

export default function WorkspaceHeader() {
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
    <header className="flex items-center justify-between">
      <div>
        {/* <p className="text-sm font-medium text-violet-300">
          {getGreeting()}, {name} 👋
        </p> */}

        <h1 className="mt-2 text-4xl font-extrabold text-white">
          Hey 👋 {capitalized}, what would you like to create today?
        </h1>

        <p className="mt-3 max-w-2xl text-gray-400">
          Upload existing content or start a brand-new campaign. LocalVoice AI
          will generate multilingual, platform-ready content in seconds.
        </p>
      </div>

      <div className="hidden h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-white/5 backdrop-blur-xl md:flex">
        <Sparkles className="text-orange-400" size={24} />
      </div>
    </header>
  );
}
