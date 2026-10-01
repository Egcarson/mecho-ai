"use client";

import { type FormEvent, type KeyboardEvent } from "react";

import { ArrowUp, Plus } from "lucide-react";

import { motion } from "motion/react";

type ComposerIdleProps = {
  prompt: string;
  onPromptChange: (value: string) => void;

  onFocus: () => void;
  onBlur: () => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ComposerIdle({
  prompt,
  onPromptChange,
  onFocus,
  onBlur,
  onSubmit,
}: ComposerIdleProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <motion.div
      key="composer-idle"
      initial={{
        opacity: 0,
        y: 8,
        scale: 0.99,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: -10,
        scale: 0.985,
        filter: "blur(5px)",
      }}
      transition={{
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <form
        onSubmit={onSubmit}
        className="
          relative
          overflow-hidden
          rounded-[2rem]
          border
          border-border/80
          bg-background/90
          p-3
          shadow-[0_30px_100px_rgba(47,1,117,0.10)]
          backdrop-blur-2xl
          transition-all
          duration-500

          focus-within:border-mecho-purple/30
          focus-within:shadow-[0_32px_110px_rgba(47,1,117,0.15)]

          sm:p-4
        "
      >
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            rows={4}
            placeholder="Tell Mecho what you want to achieve..."
            className="
              min-h-[145px]
              w-full
              resize-none
              bg-transparent
              px-3
              pb-14
              pt-3
              text-[17px]
              font-medium
              leading-7
              tracking-[-0.015em]
              text-foreground
              outline-none

              placeholder:font-normal
              placeholder:text-muted-foreground/55

              sm:min-h-[165px]
              sm:px-4
              sm:pb-16
              sm:pt-4
              sm:text-[18px]
            "
          />

          <div
            className="
              absolute
              bottom-1
              left-1
              right-1
              flex
              items-center
              justify-between
              gap-3
              px-2
              pb-2

              sm:px-3
            "
          >
            <button
              type="button"
              aria-label="Add something"
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-full
                text-muted-foreground
                transition-all
                duration-300

                hover:bg-muted
                hover:text-foreground
              "
            >
              <Plus className="size-[18px]" />
            </button>

            <button
              type="submit"
              aria-label="Send to Mecho"
              className={`
                flex
                size-11
                items-center
                justify-center
                rounded-full
                transition-all
                duration-300

                ${
                  prompt.trim()
                    ? `
                      bg-mecho-gradient
                      text-white
                      shadow-[0_10px_25px_rgba(111,44,255,0.24)]

                      hover:-translate-y-0.5
                      hover:shadow-[0_14px_32px_rgba(111,44,255,0.30)]
                    `
                    : `
                      bg-muted
                      text-muted-foreground
                    `
                }
              `}
            >
              <ArrowUp className="size-[18px]" />
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
