import Link from "next/link";

import { ArrowRight, Check } from "lucide-react";

export function FinalCta() {
  return (
    <section
      className="
        px-4
        py-20

        sm:px-6
        sm:py-24

        lg:px-8
      "
    >
      <div
        className="
          relative
          mx-auto
          max-w-7xl
          overflow-hidden
          rounded-[2.5rem]
          border
          border-border/60
          bg-[#110818]
          px-6
          py-16
          text-white
          shadow-[0_40px_120px_rgba(53,16,79,0.16)]

          sm:px-10
          sm:py-20

          lg:px-16
        "
      >
        <div
          aria-hidden="true"
          className="
            absolute
            -right-32
            -top-32
            size-[360px]
            rounded-full
            bg-mecho-gradient
            opacity-25
            blur-[110px]
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute
            -bottom-40
            left-10
            size-[320px]
            rounded-full
            bg-[#ff7a1a]
            opacity-10
            blur-[120px]
          "
        />

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-3xl
            text-center
          "
        >
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.16em]
              text-white/50
            "
          >
            Start with an idea
          </p>

          <h2
            className="
              mt-4
              text-3xl
              font-semibold
              leading-[1.04]
              tracking-[-0.05em]

              sm:text-5xl
            "
          >
            Make your next message go further.
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-xl
              text-sm
              leading-7
              text-white/60

              sm:text-base
            "
          >
            Create audience-aware content and creative media with Mecho from one
            connected workspace.
          </p>

          <div
            className="
              mt-8
              flex
              flex-col
              items-center
            "
          >
            <Link
              href="/signup"
              className="
                group
                inline-flex
                h-12
                items-center
                gap-2
                rounded-full
                bg-white
                px-6
                text-sm
                font-semibold
                text-[#35104f]
                transition-all
                duration-300

                hover:-translate-y-0.5
              "
            >
              Get started for free
              <ArrowRight
                className="
                  size-4
                  transition-transform

                  group-hover:translate-x-1
                "
              />
            </Link>

            <span
              className="
                mt-3
                inline-flex
                items-center
                gap-1.5
                text-xs
                text-white/45
              "
            >
              <Check className="size-3.5" />
              No credit card required
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
