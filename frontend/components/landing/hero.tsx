"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "motion/react";
import { HeroShowcase } from "@/components/landing/hero-showcase";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      id="home"
      className="
        relative
        scroll-mt-24 lg:scroll-mt-28 overflow-hidden pt-32 sm:pt-36 lg:pt-40"
    >
      {/* Decorative brand shapes */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -left-24 top-40 size-72
          rounded-full bg-mecho-purple/10
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -right-20 top-16 size-80
          rounded-full bg-mecho-orange/10
          blur-3xl
        "
      />

      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-14 px-6 pb-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        {/* Left */}
        <div className="relative z-10">
          <div className="max-w-3xl">
            <p
              className="
        mb-5
        text-sm font-semibold
        uppercase tracking-[0.2em]
        text-mecho-purple
      "
            >
              Marketing, made simpler
            </p>

            <h1
              className="
        text-[4rem]
        font-bold
        leading-[0.94]
        tracking-[-0.06em]
        text-foreground

        sm:text-6xl
        lg:text-[5.4rem]
      "
            >
              Say it your way.
              <br />
              <span className="text-mecho-gradient">Make it land.</span>
            </h1>

            <p
              className="
        mt-6
        max-w-xl
        text-lg
        leading-8
        text-muted-foreground

        sm:text-xl
      "
            >
              Turn a simple idea into content and creative people actually
              respond to.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.18,
            }}
            className="
      mt-8
      flex flex-col gap-3
      sm:flex-row
    "
          >
            <Button
              asChild
              className="
        h-13
        rounded-full
        border-0
        bg-mecho-gradient
        px-7
        text-base
        font-semibold
        text-white
        shadow-[0_14px_38px_rgba(111,44,255,0.20)]
        transition-all duration-300

        hover:-translate-y-0.5
        hover:shadow-[0_18px_44px_rgba(111,44,255,0.28)]
      "
            >
              <Link href="/signup">
                Start creating
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="
        h-13
        rounded-full
        px-7
        text-base
        font-semibold
        transition-all duration-300

        hover:border-mecho-purple/30
        hover:bg-mecho-purple-soft
        hover:text-mecho-purple
      "
            >
              <Link href="#how-it-works">
                <Play className="mr-1 size-4 fill-current" />
                See how it works
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Right */}
        <div className="relative">
          <HeroShowcase />
        </div>
      </div>
    </section>
  );
}
