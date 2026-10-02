import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

import Image from "next/image";

const footerLinks = [
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Team",
    href: "#team",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

const socials = [
  {
    label: "Instagram",
    href: "#",
    icon: FaInstagram,
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: FaLinkedinIn,
  },
  {
    label: "X",
    href: "#",
    icon: FaXTwitter,
  },
];

export function Footer() {
  return (
    <footer
      className="
        relative
        overflow-hidden
        border-t
        border-border/70
        bg-background
      "
    >
      {/* Subtle brand atmosphere */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-24
          bottom-[-7rem]
          h-64
          w-64
          rounded-full
          bg-mecho-purple/8
          blur-[120px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          top-[-5rem]
          h-56
          w-56
          rounded-full
          bg-mecho-orange/8
          blur-[120px]
        "
      />

      <div
        className="
          relative
          mx-auto
          max-w-7xl
          px-4
          py-12

          sm:px-6
          sm:py-14

          lg:px-8
        "
      >
        {/* Top */}

        <div
          className="
            grid
            gap-10
            border-b
            border-border/70
            pb-10

            lg:grid-cols-[1.2fr_0.8fr]
            lg:items-start
            lg:gap-16
          "
        >
          {/* Brand */}

          <div className="max-w-xl">
            <Link
              href="/"
              aria-label="Mecho AI home"
              className="inline-flex items-center gap-2.5"
            >
              <div className="relative size-8 shrink-0">
                <Image
                  src="/logo.svg"
                  alt="Mecho AI"
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>

              <span className="text-xl font-semibold tracking-[-0.04em] text-foreground">
                Mecho AI
              </span>
            </Link>

            <p
              className="
                mt-5
                max-w-md
                text-lg
                font-medium
                leading-8
                tracking-[-0.025em]
                text-foreground
              "
            >
              One message.
              <span className="text-mecho-gradient">
                {" "}
                More ways to make it matter.
              </span>
            </p>

            <p
              className="
                mt-3
                max-w-md
                text-sm
                leading-7
                text-muted-foreground
              "
            >
              Creative intelligence for turning ideas into content, visuals,
              video and voice.
            </p>
          </div>

          {/* Navigation + Social */}

          <div
            className="
              grid
              gap-8

              sm:grid-cols-2

              lg:justify-self-end
              lg:gap-14
            "
          >
            {/* Navigation */}

            <div>
              <p
                className="
                  mb-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-muted-foreground
                "
              >
                Explore
              </p>

              <div
                className="
                  flex
                  flex-col
                  gap-3
                "
              >
                {footerLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="
                      w-fit
                      text-sm
                      font-medium
                      text-muted-foreground
                      transition-colors
                      duration-200

                      hover:text-mecho-purple
                    "
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social */}

            <div>
              <p
                className="
                  mb-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-muted-foreground
                "
              >
                Follow
              </p>

              <div className="flex items-center gap-2">
                {socials.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        flex
                        size-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-border/70
                        bg-background/70
                        text-muted-foreground
                        transition-all
                        duration-300

                        hover:-translate-y-0.5
                        hover:border-mecho-purple/25
                        hover:bg-mecho-purple-soft
                        hover:text-mecho-purple
                      "
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}

        <div
          className="
            flex
            flex-col
            gap-5
            pt-6

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              © {new Date().getFullYear()} Mecho AI. All rights reserved.
            </p>

            <p
              className="
                mt-1
                text-xs
                text-muted-foreground/70
              "
            >
              Built to help ideas travel further.
            </p>
          </div>

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-5
              gap-y-2
            "
          >
            <Link
              href="/privacy"
              className="
                text-sm
                text-muted-foreground
                transition-colors
                duration-200

                hover:text-foreground
              "
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="
                text-sm
                text-muted-foreground
                transition-colors
                duration-200

                hover:text-foreground
              "
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
