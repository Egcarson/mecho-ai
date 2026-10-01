"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { useAuth } from "@/components/auth/auth-provider";

import { DashboardBackground } from "./dashboard-background";

import { DashboardGreeting } from "./dashboard-greeting";

import { SmartComposer } from "./smart-composer";

import { RecentWork } from "./recent-work";

import { DirectWorkflows } from "./direct-workflows";

import {
  detectWorkflow,
  promptExamples,
  type ComposerState,
  type WorkflowId,
} from "./dashboard-data";

export function DashboardHome() {
  const router = useRouter();

  const { user } = useAuth();

  const [prompt, setPrompt] = useState("");

  const [activeExample, setActiveExample] = useState(0);

  const [composerFocused, setComposerFocused] = useState(false);

  const [composerState, setComposerState] = useState<ComposerState>("idle");

  const [recommendedWorkflow, setRecommendedWorkflow] =
    useState<WorkflowId>("social");

  const [thinkingStep, setThinkingStep] = useState(0);

  const firstName = user?.first_name?.trim() || "";

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 17) {
      return "Good afternoon";
    }

    return "Good evening";
  }, []);

  useEffect(() => {
    if (composerFocused || prompt.trim() || composerState !== "idle") {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveExample((current) => (current + 1) % promptExamples.length);
    }, 3600);

    return () => {
      window.clearInterval(interval);
    };
  }, [composerFocused, prompt, composerState]);

  useEffect(() => {
    if (composerState !== "thinking") {
      return;
    }

    setThinkingStep(0);

    const timers = [
      window.setTimeout(() => {
        setThinkingStep(1);
      }, 1900),

      window.setTimeout(() => {
        setThinkingStep(2);
      }, 3800),

      window.setTimeout(() => {
        setComposerState("result");
      }, 6200),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [composerState]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = prompt.trim();

    if (!value) {
      toast.error("Tell Mecho what you want to achieve.");

      return;
    }

    const workflow = detectWorkflow(value);

    setRecommendedWorkflow(workflow);

    setComposerFocused(false);

    setComposerState("thinking");
  }

  function useExample(example: string) {
    setPrompt(example);
  }

  function resetComposer() {
    setPrompt("");
    setThinkingStep(0);

    setComposerState("idle");
  }

  function continueWithWorkflow(workflow: WorkflowId) {
    router.push(`/dashboard/create/${workflow}`);
  }

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-background
        text-foreground
      "
    >
      <DashboardBackground />

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          max-w-6xl
          flex-col
          px-4
          pb-16
          pt-10

          sm:px-6
          sm:pt-12

          lg:px-8
          lg:pb-20
          lg:pt-14
        "
      >
        <section
          className="
            mx-auto
            w-full
            max-w-3xl
          "
        >
          <DashboardGreeting greeting={greeting} firstName={firstName} />

          <SmartComposer
            prompt={prompt}
            composerState={composerState}
            composerFocused={composerFocused}
            thinkingStep={thinkingStep}
            activeExample={promptExamples[activeExample]}
            recommendedWorkflow={recommendedWorkflow}
            onPromptChange={setPrompt}
            onFocusedChange={setComposerFocused}
            onSubmit={handleSubmit}
            onUseExample={useExample}
            onReset={resetComposer}
            onContinue={continueWithWorkflow}
          />
        </section>

        <RecentWork />

        <DirectWorkflows onSelect={continueWithWorkflow} />
      </div>
    </main>
  );
}
