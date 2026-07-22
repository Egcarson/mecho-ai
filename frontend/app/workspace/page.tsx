"use client";

import { useState } from "react";
import Background from "@/components/welcome/background";
import PageWrapper from "@/components/shared/PageWrapper";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import WorkflowSelector from "@/components/workspace/WorkflowSelector";
import SourceInput from "@/components/workspace/SourceInput";
import SettingsPanel from "@/components/workspace/SettingsPanel";
import ResultView from "@/components/workspace/ResultView";
import { toast } from "sonner";
import { generate } from "@/lib/api";
import { GenerateSettings, Workflow } from "@/types/generate";
import { GenerateResponse } from "@/types/result";
import GeneratingOverlay from "@/components/workspace/generating-overlay";

export default function WorkspacePage() {
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const [settings, setSettings] = useState<GenerateSettings>({
    workflow: "social",

    // Social
    upload: null,
    content: "",
    brief: "",

    // Professional
    campaignTitle: "",
    campaignGoal: "",
    targetAudience: "",
    keyMessage: "",
    callToAction: "",
    additionalNotes: "",

    // AI
    languages: ["English"],
    tone: "Friendly",
    audiences: [],
    platforms: [],

    includeEmojis: true,
    includeHashtags: true,
    optimizeForTrends: true,
    country: "Nigeria",
  });

  function handleWorkflowChange(workflow: Workflow) {
    setSettings((prev) => ({
      ...prev,
      workflow,
      tone: workflow === "social" ? "Friendly" : "Professional",
      includeEmojis: workflow === "social",
      includeHashtags: workflow === "social",
    }));
  }

  async function handleGenerate() {
    try {
      setLoading(true);

      const response = await generate(settings);

      setResult(response);

      toast.success("Content generated successfully!");

      setShowResult(true);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (showResult && result) {
    return (
      <PageWrapper>
        <Background />

        <ResultView
          result={result}
          onBack={() => {
            setShowResult(false);
            setResult(null);
          }}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Background />

      <main className="relative z-10 mx-auto max-w-7xl space-y-10 px-6 py-10">
        <WorkspaceHeader />

        <WorkflowSelector
          workflow={settings.workflow}
          onChange={handleWorkflowChange}
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_380px]">
          <div className="min-w-0">
            <SourceInput settings={settings} onSettingsChange={setSettings} />
          </div>

          <div className="w-full max-w-[380px] justify-self-end">
            <SettingsPanel
              settings={settings}
              loading={loading}
              onGenerate={handleGenerate}
              onSettingsChange={setSettings}
            />
          </div>
        </div>

        <GeneratingOverlay open={loading} />
      </main>
    </PageWrapper>
  );
}
