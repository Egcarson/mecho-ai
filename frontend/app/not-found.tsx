"use client";

import Link from "next/link";

import { ArrowLeft, LayoutDashboard } from "lucide-react";

import { motion } from "motion/react";

import { MechoLogo } from "@/components/brand/mecho-logo";

export default function NotFound() {
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
      {/* Ambient background */}

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
          bottom-[10%]
          right-[8%]
          absolute
          size-[340px]
          rounded-full
          bg-mecho-orange/10
          blur-[150px]
        "
      />

      {/* Background typography */}

      <motion.span
        aria-hidden="true"
        animate={{
          x: [0, 18, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          left-[3%]
          top-[15%]
          hidden
          select-none
          text-[11rem]
          font-bold
          leading-none
          tracking-[-0.08em]
          text-foreground/[0.018]

          lg:block
        "
      >
        LOST
      </motion.span>

      <motion.span
        aria-hidden="true"
        animate={{
          x: [0, -15, 0],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          bottom-[10%]
          right-[2%]
          hidden
          select-none
          text-[10rem]
          font-bold
          leading-none
          tracking-[-0.08em]
          text-foreground/[0.018]

          lg:block
        "
      >
        ECHO
      </motion.span>

      {/* Main content */}

      <motion.div
        initial={{
          opacity: 0,
          y: 22,
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
        <Link
          href="/"
          aria-label="Mecho home"
          className="
            mb-10
            inline-flex
            items-center
          "
        >
          <MechoLogo className="h-10 w-auto" />
        </Link>

        {/* 404 */}

        <div className="relative">
          <motion.div
            aria-hidden="true"
            animate={{
              opacity: [0.16, 0.28, 0.16],
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

          <h1
            className="
              relative
              text-[6rem]
              font-semibold
              leading-none
              tracking-[-0.08em]

              sm:text-[8rem]

              lg:text-[10rem]
            "
          >
            <span className="text-mecho-gradient">404</span>
          </h1>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
        >
          <p
            className="
              mt-5
              text-xs
              font-semibold
              uppercase
              tracking-[0.18em]
              text-mecho-purple
            "
          >
            Signal lost
          </p>

          <h2
            className="
              mt-4
              text-3xl
              font-semibold
              tracking-[-0.045em]

              sm:text-4xl

              lg:text-5xl
            "
          >
            This page didn&apos;t echo back.
          </h2>

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
            The link may be broken, the page may have moved, or this route
            simply doesn&apos;t exist.
          </p>
        </motion.div>

        {/* Actions */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
            delay: 0.28,
          }}
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
            <ArrowLeft className="size-4" />
            Back home
          </Link>

          <Link
            href="/dashboard"
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
            <LayoutDashboard className="size-4" />
            Go to dashboard
          </Link>
        </motion.div>

        <p
          className="
            mt-10
            text-xs
            text-muted-foreground/65
          "
        >
          One wrong turn. Nothing lost.
        </p>
      </motion.div>
    </main>
  );
}
