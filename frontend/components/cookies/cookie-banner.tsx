"use client";

import { Cookie, Settings2 } from "lucide-react";

import { motion } from "motion/react";

import { useCookieConsent } from "./cookie-settings-button";

export function CookieBanner() {
  const { acceptAll, rejectOptional, openPreferences } = useCookieConsent();

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        fixed
        inset-x-0
        bottom-0
        z-[200]
        px-3
        pb-[max(0.75rem,env(safe-area-inset-bottom))]

        sm:px-5
        sm:pb-5
      "
    >
      <div
        className="
          mx-auto
          max-w-5xl
          overflow-hidden
          rounded-[1.5rem]
          border
          border-border/70
          bg-background/95
          shadow-[0_24px_80px_rgba(0,0,0,0.18)]
          backdrop-blur-2xl
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            p-5

            sm:p-6

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div
            className="
              flex
              max-w-2xl
              items-start
              gap-4
            "
          >
            <div
              className="
                flex
                size-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-mecho-purple-soft
                text-mecho-purple
              "
            >
              <Cookie className="size-4.5" />
            </div>

            <div>
              <h2
                className="
                  text-sm
                  font-semibold
                  tracking-[-0.015em]
                "
              >
                We use cookies
              </h2>

              <p
                className="
                  mt-1.5
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                Mecho uses essential cookies to keep your account secure and the
                app working. Optional cookies help us understand usage and
                improve your experience when you allow them.
              </p>
            </div>
          </div>

          <div
            className="
              flex
              flex-col
              gap-2

              sm:flex-row

              lg:shrink-0
            "
          >
            <button
              type="button"
              onClick={rejectOptional}
              className="
                h-10
                rounded-full
                px-4
                text-sm
                font-medium
                text-muted-foreground
                transition-colors

                hover:bg-muted
                hover:text-foreground
              "
            >
              Reject optional
            </button>

            <button
              type="button"
              onClick={openPreferences}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-border/70
                bg-background
                px-4
                text-sm
                font-medium
                transition-colors

                hover:bg-muted/50
              "
            >
              <Settings2 className="size-4" />
              Manage
            </button>

            <button
              type="button"
              onClick={acceptAll}
              className="
                h-10
                rounded-full
                bg-mecho-gradient
                px-5
                text-sm
                font-semibold
                text-white
                shadow-[0_10px_28px_rgba(111,44,255,0.2)]
              "
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
