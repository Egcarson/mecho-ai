"use client";

import { Mail } from "lucide-react";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="
        relative
        scroll-mt-24
        border-y border-border/70
        bg-muted/20
        py-20
        sm:py-24
        lg:scroll-mt-28
      "
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="
            grid
            gap-10
            lg:grid-cols-[0.9fr_1.1fr]
            lg:items-center
            lg:gap-20
          "
        >
          <div>
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-mecho-purple
              "
            >
              Contact
            </p>

            <h2
              className="
                mt-5
                text-4xl
                font-semibold
                tracking-[-0.045em]
                text-foreground
                sm:text-5xl
              "
            >
              Want to talk?
            </h2>

            <p
              className="
                mt-5
                max-w-xl
                text-base
                leading-8
                text-muted-foreground
                sm:text-lg
              "
            >
              For partnerships, product questions, collaboration or anything
              Mecho-related, reach out directly.
            </p>
          </div>

          <div
            className="
              rounded-[1.8rem]
              border border-border/70
              bg-background
              p-6
              shadow-[0_18px_50px_rgba(47,1,117,0.05)]
              sm:p-8
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex size-11
                  shrink-0
                  items-center justify-center
                  rounded-2xl
                  bg-mecho-purple-soft
                  text-mecho-purple
                "
              >
                <Mail className="size-5" />
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email Mecho
                </p>

                <a
                  href="mailto:hello@mecho.ai"
                  className="
                    mt-1
                    block
                    text-lg
                    font-semibold
                    tracking-[-0.025em]
                    text-foreground
                    transition-colors
                    hover:text-mecho-purple
                    sm:text-xl
                  "
                >
                  esehgodprevail@gmail.com
                </a>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  We&apos;ll get back to you as soon as we can.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
