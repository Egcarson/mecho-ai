import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

import { MechoLogo } from "@/components/brand/mecho-logo";

const footerLinks = [
  {
    label: "Product",
    href: "#product",
  },
  {
    label: "How it works",
    href: "#how-it-works",
  },
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
    <footer className="border-t border-border/70 bg-background">
      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          py-10
          sm:px-6
          sm:py-12
          lg:px-8
        "
      >
        {/* Top */}
        <div
          className="
            flex
            flex-col
            gap-10
            border-b border-border/70
            pb-10
            lg:flex-row
            lg:items-start
            lg:justify-between
          "
        >
          {/* Brand */}
          <div className="max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label="Mecho AI home"
            >
              <MechoLogo className="h-8 w-auto" />

              <span
                className="
                  text-xl
                  font-semibold
                  tracking-[-0.04em]
                  text-foreground
                "
              >
                Mecho AI
              </span>
            </Link>

            <p
              className="
                mt-4
                max-w-sm
                text-sm
                leading-7
                text-muted-foreground
              "
            >
              One message, shaped for more places, people, languages and ways to
              be heard.
            </p>
          </div>

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
                lg:hidden
              "
            >
              Explore
            </p>

            <div
              className="
                grid
                grid-cols-2
                gap-x-8
                gap-y-4
                sm:flex
                sm:flex-wrap
                sm:gap-x-8
                sm:gap-y-4
              "
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="
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

          {/* Socials */}
          <div>
            <p
              className="
                mb-4
                text-xs
                font-semibold
                uppercase
                tracking-[0.16em]
                text-muted-foreground
                lg:hidden
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
                      flex size-10
                      items-center justify-center
                      rounded-full
                      border border-border
                      text-muted-foreground
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:border-mecho-purple/30
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

        {/* Bottom */}
        <div
          className="
            flex
            flex-col
            gap-4
            pt-6
            text-sm
            text-muted-foreground
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p className="leading-6">
            © {new Date().getFullYear()} Mecho AI. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacy"
              className="
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
