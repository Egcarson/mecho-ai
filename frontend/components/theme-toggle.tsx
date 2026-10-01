"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="size-10 rounded-full"
        aria-label="Toggle theme"
      >
        <span className="size-5" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="
        relative size-10 overflow-hidden rounded-full
        border border-border/70
        bg-background/70
        text-foreground
        transition-colors
        hover:bg-mecho-purple-soft
        hover:text-mecho-purple
      "
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        key={isDark ? "moon" : "sun"}
        initial={{
          opacity: 0,
          rotate: -30,
          scale: 0.7,
        }}
        animate={{
          opacity: 1,
          rotate: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.25,
        }}
      >
        {isDark ? (
          <Moon className="size-[18px]" />
        ) : (
          <Sun className="size-[18px]" />
        )}
      </motion.div>
    </Button>
  );
}
