"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { storage } from "@/lib/Storage";

export default function NameForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = name.trim();

    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }

    storage.setName(trimmed);
    router.push("/landing");
  };

  return (
    <Card
      className="
        rounded-3xl
        border
        border-violet-500/30
        bg-white/5
        backdrop-blur-xl
        shadow-[0_0_80px_rgba(124,58,237,0.25)]
      "
    >
      <CardContent className="flex flex-col space-y-6 p-8">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-orange-400">
            What should I call you?
          </h2>

          <p className="text-sm text-muted-foreground">
            We'll personalize your LocalVoice AI experience.
          </p>
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            className="h-12 rounded text-center capitalize"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <Button
          onClick={handleSubmit}
          className="
            h-14
            rounded-2xl
            bg-linear-to-r
            from-violet-600
            to-purple-500
            hover:from-violet-500
            hover:to-purple-400
            text-lg
            font-semibold
            transition-all
            cursor-pointer
          "
        >
          🚀 Get Started →
        </Button>
      </CardContent>
    </Card>
  );
}
