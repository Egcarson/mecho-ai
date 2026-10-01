"use client";

import Link from "next/link";

import { RefreshCw, Home } from "lucide-react";

import { motion } from "motion/react";

import { MechoLogo } from "@/components/brand/mecho-logo";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-background
        px-4
        py-16
        text-foreground
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[10%]
          top-[15%]
          size-[380px]
          rounded-full
          bg-mecho-purple/10
          blur-[150px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[10%]
          right-[8%]
          size-[340px]
          rounded-full
          bg-mecho-orange/10
          blur-[150px]
        "
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-2xl
          flex-col
          items-center
          text-center
        "
      >
        <Link href="/" aria-label="Mecho home" className="mb-10">
          <MechoLogo className="h-10 w-auto" />
        </Link>

        <div className="relative">
          <motion.div
            aria-hidden="true"
            animate={{
              opacity: [0.14, 0.26, 0.14],
              scale: [0.98, 1.04, 0.98],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              inset-0
              rounded-full
              bg-mecho-gradient
              blur-[60px]
            "
          />

          <div
            className="
              relative
              flex
              size-24
              items-center
              justify-center
              rounded-[2rem]
              border
              border-border/70
              bg-background/80
              shadow-[0_20px_70px_rgba(47,1,117,0.10)]
              backdrop-blur-xl
            "
          >
            <span
              className="
                text-4xl
                font-semibold
                tracking-[-0.05em]
                text-mecho-gradient
              "
            >
              !
            </span>
          </div>
        </div>

        <p
          className="
            mt-7
            text-xs
            font-semibold
            uppercase
            tracking-[0.18em]
            text-mecho-purple
          "
        >
          Something went wrong
        </p>

        <h1
          className="
            mt-4
            text-3xl
            font-semibold
            tracking-[-0.045em]

            sm:text-4xl

            lg:text-5xl
          "
        >
          Mecho lost the thread.
        </h1>

        <p
          className="
            mx-auto
            mt-5
            max-w-lg
            text-base
            leading-7
            text-muted-foreground

            sm:text-lg
          "
        >
          Something unexpected happened while loading this page. You can try
          again without leaving your current workflow.
        </p>

        <div
          className="
            mt-8
            flex
            w-full
            max-w-md
            flex-col
            gap-3

            sm:flex-row
            sm:justify-center
          "
        >
          <button
            type="button"
            onClick={reset}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-full
              bg-mecho-gradient
              px-6
              text-sm
              font-semibold
              text-white
              shadow-[0_10px_30px_rgba(111,44,255,0.20)]
              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:shadow-[0_14px_36px_rgba(111,44,255,0.28)]
            "
          >
            <RefreshCw className="size-4" />
            Try again
          </button>

          <Link
            href="/"
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-border/70
              bg-background/70
              px-6
              text-sm
              font-medium
              transition-all
              duration-300

              hover:border-mecho-purple/25
              hover:bg-mecho-purple-soft/40
              hover:text-mecho-purple
            "
          >
            <Home className="size-4" />
            Go home
          </Link>
        </div>

        <p
          className="
            mt-10
            text-xs
            text-muted-foreground/65
          "
        >
          Your work may still be intact. Try the page again first.
        </p>
      </motion.div>
    </main>
  );
}
