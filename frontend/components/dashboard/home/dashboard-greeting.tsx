"use client";

import { motion } from "motion/react";

type DashboardGreetingProps = {
  greeting: string;
  firstName?: string;
};

export function DashboardGreeting({
  greeting,
  firstName,
}: DashboardGreetingProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="text-center"
    >
      <p
        className="
          text-sm
          font-medium
          text-muted-foreground

          sm:text-base
        "
      >
        {greeting}
        {firstName ? `, ${firstName}` : ""}.
      </p>

      <h1
        className="
          mx-auto
          mt-3
          max-w-4xl
          text-4xl
          font-semibold
          leading-[1.03]
          tracking-[-0.055em]

          sm:text-5xl

          lg:text-[4.15rem]
        "
      >
        What are you trying
        <br className="hidden sm:block" /> to achieve today?
      </h1>

      <p
        className="
          mx-auto
          mt-5
          max-w-xl
          text-base
          leading-7
          text-muted-foreground

          sm:text-lg
        "
      >
        Don&apos;t worry about the perfect prompt. Tell Mecho in your own words.
      </p>
    </motion.div>
  );
}
