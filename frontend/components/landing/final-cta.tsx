"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-background
        py-24
        sm:py-28
        lg:py-32
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-1/2 top-1/2
          h-[420px] w-[420px]
          -translate-x-1/2 -translate-y-1/2
          rounded-full
          bg-mecho-purple/10
          blur-[140px]
        "
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.18em]
            text-mecho-purple
          "
        >
          Ready when you are
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="
            mx-auto
            mt-5
            max-w-4xl
            text-4xl
            font-semibold
            leading-[1.02]
            tracking-[-0.05em]
            text-foreground
            sm:text-5xl
            lg:text-[4.6rem]
          "
        >
          Your message already has somewhere to go.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="
            mx-auto
            mt-6
            max-w-2xl
            text-base
            leading-8
            text-muted-foreground
            sm:text-lg
          "
        >
          Bring the idea. Mecho helps you shape it, adapt it, and carry it
          across the places, people and formats that matter.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mt-9 flex justify-center"
        >
          <Button
            asChild
            className="
              h-12
              rounded-full
              border-0
              bg-mecho-gradient
              px-7
              text-base
              font-medium
              text-white
              shadow-[0_12px_36px_rgba(111,44,255,0.20)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_16px_44px_rgba(111,44,255,0.28)]
            "
          >
            <Link href="/signup">
              Start creating
              <ArrowUpRight className="ml-2 size-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
