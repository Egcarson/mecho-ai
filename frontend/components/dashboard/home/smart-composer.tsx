"use client";

import { type FormEvent } from "react";

import { AnimatePresence, motion } from "motion/react";

import { ComposerIdle } from "./composer-idle";

import { ComposerThinking } from "./composer-thinking";

import { ComposerResult } from "./composer-result";

import { RotatingExample } from "./rotating-example";

import { type ComposerState, type WorkflowId } from "./dashboard-data";

type SmartComposerProps = {
  prompt: string;

  composerState: ComposerState;

  composerFocused: boolean;

  thinkingStep: number;

  activeExample: string;

  recommendedWorkflow: WorkflowId;

  onPromptChange: (value: string) => void;

  onFocusedChange: (focused: boolean) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;

  onUseExample: (example: string) => void;

  onReset: () => void;

  onContinue: (workflow: WorkflowId) => void;
};

export function SmartComposer({
  prompt,
  composerState,
  composerFocused,
  thinkingStep,
  activeExample,
  recommendedWorkflow,
  onPromptChange,
  onFocusedChange,
  onSubmit,
  onUseExample,
  onReset,
  onContinue,
}: SmartComposerProps) {
  return (
    <>
      {/**
       * data-tour is deliberately attached to the whole composer shell.
       *
       * Tour selectors should use stable semantic attributes instead of
       * CSS classes because visual styling will change over time.
       */}
      <motion.div
        data-tour="smart-composer"
        initial={{
          opacity: 0,
          y: 24,
          scale: 0.985,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.75,
          delay: 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          mt-10

          sm:mt-12
        "
      >
        <motion.div
          aria-hidden="true"
          animate={{
            opacity:
              composerState === "thinking"
                ? [0.22, 0.44, 0.22]
                : composerFocused
                  ? [0.3, 0.5, 0.3]
                  : [0.12, 0.2, 0.12],

            scale:
              composerState === "thinking"
                ? [0.97, 1.035, 0.97]
                : composerFocused
                  ? [0.98, 1.03, 0.98]
                  : [0.98, 1.01, 0.98],
          }}
          transition={{
            duration: composerState === "thinking" ? 2.2 : 4,

            repeat: Infinity,

            ease: "easeInOut",
          }}
          className="
            pointer-events-none
            absolute
            -inset-4
            rounded-[2.5rem]
            bg-mecho-gradient
            blur-[50px]
          "
        />

        <AnimatePresence mode="wait">
          {composerState === "idle" && (
            <ComposerIdle
              prompt={prompt}
              onPromptChange={onPromptChange}
              onFocus={() => onFocusedChange(true)}
              onBlur={() => onFocusedChange(false)}
              onSubmit={onSubmit}
            />
          )}

          {composerState === "thinking" && (
            <ComposerThinking prompt={prompt} thinkingStep={thinkingStep} />
          )}

          {composerState === "result" && (
            <ComposerResult
              prompt={prompt}
              workflow={recommendedWorkflow}
              onReset={onReset}
              onContinue={onContinue}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <RotatingExample
        example={activeExample}
        visible={composerState === "idle" && !prompt.trim()}
        onSelect={onUseExample}
      />
    </>
  );
}
