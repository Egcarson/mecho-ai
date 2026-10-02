"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Home,
  Info,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";

import { MechoLogo } from "@/components/brand/mecho-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/auth/auth-provider";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const desktopLinks = [
  {
    label: "About",
    href: "#about",
    id: "about",
  },
  {
    label: "Team",
    href: "#team",
    id: "team",
  },
  {
    label: "Contact",
    href: "#contact",
    id: "contact",
  },
];

const mobileLinks = [
  {
    label: "Home",
    href: "#home",
    id: "home",
    icon: Home,
  },
  {
    label: "About",
    href: "#about",
    id: "about",
    icon: Info,
  },
  {
    label: "Team",
    href: "#team",
    id: "team",
    icon: UsersRound,
  },
  {
    label: "Contact",
    href: "#contact",
    id: "contact",
    icon: Mail,
  },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("home");

  const { user, loading, logout } = useAuth();

  const initials = useMemo(() => {
    if (!user) return "";

    const first = user.first_name?.charAt(0) ?? "";

    const last = user.last_name?.charAt(0) ?? "";

    return `${first}${last}`.toUpperCase();
  }, [user]);

  const fullName = useMemo(() => {
    if (!user) return "";

    return [user.first_name, user.middle_name, user.last_name]
      .filter(Boolean)
      .join(" ");
  }, [user]);

  /**
   * Track the landing section currently visible.
   *
   * Both the desktop navigation and mobile app-style dock
   * use this state so navigation feedback stays consistent.
   */
  useEffect(() => {
    const ids = ["home", "about", "team", "contact"];

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -58% 0px",

        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));

      observer.disconnect();
    };
  }, []);

  async function handleLogout() {
    await logout();
  }

  return (
    <>
      {/* =====================================================
          DESKTOP NAVIGATION
      ====================================================== */}

      <header
        className="
          fixed
          inset-x-0
          top-0
          z-50
          hidden
          px-5
          pt-4

          lg:block
        "
      >
        <nav
          className="
            mx-auto
            flex
            h-16
            max-w-7xl
            items-center
            justify-between
            rounded-[1.35rem]
            border
            border-border/60
            bg-background/80
            px-5
            shadow-[0_8px_40px_rgba(38,17,58,0.05)]
            backdrop-blur-2xl
          "
        >
          {/* Brand */}

          <Link
            href="/"
            aria-label="Mecho AI home"
            className="
              flex
              items-center
              gap-2.5
            "
          >
            <MechoLogo className="h-8 w-auto" />

            <span
              className="
                text-[20px]
                font-semibold
                tracking-[-0.045em]
              "
            >
              Mecho AI
            </span>
          </Link>

          {/* Desktop links */}

          <div
            className="
              flex
              items-center
              gap-1
            "
          >
            {desktopLinks.map((link) => {
              const active = activeSection === link.id;

              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`
                      relative
                      rounded-full
                      px-4
                      py-2
                      text-sm
                      font-medium
                      transition-colors
                      duration-200

                      ${
                        active
                          ? "text-mecho-purple"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    `}
                >
                  {link.label}

                  <span
                    className={`
                        absolute
                        inset-x-4
                        bottom-0
                        h-px
                        origin-center
                        bg-mecho-gradient
                        transition-transform
                        duration-300

                        ${active ? "scale-x-100" : "scale-x-0"}
                      `}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop actions */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <ThemeToggle />

            {!loading && !user && (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="
                    rounded-full
                    px-4
                    text-sm
                    font-medium
                  "
                >
                  <Link href="/login">Sign in</Link>
                </Button>

                <Button
                  asChild
                  className="
                    rounded-full
                    border-0
                    bg-mecho-gradient
                    px-5
                    text-sm
                    font-semibold
                    text-white
                    shadow-[0_10px_28px_rgba(111,44,255,0.20)]
                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:shadow-[0_14px_34px_rgba(111,44,255,0.28)]
                  "
                >
                  <Link href="/signup">Get started for free</Link>
                </Button>
              </>
            )}

            {!loading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Open account menu"
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-border/60
                      bg-background/70
                      p-1.5
                      pr-3
                      transition-colors

                      hover:bg-muted/40
                    "
                  >
                    <Avatar className="size-8">
                      <AvatarImage
                        src={
                          user.profile_picture_url ?? user.avatar ?? undefined
                        }
                        alt={fullName}
                      />

                      <AvatarFallback
                        className="
                          bg-mecho-gradient
                          text-xs
                          font-semibold
                          text-white
                        "
                      >
                        {initials || <UserRound className="size-4" />}
                      </AvatarFallback>
                    </Avatar>

                    <span
                      className="
                        max-w-[100px]
                        truncate
                        text-sm
                        font-medium
                      "
                    >
                      {user.first_name}
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="
                    w-64
                    rounded-2xl
                    p-2
                  "
                >
                  <DropdownMenuLabel>
                    <p className="font-semibold">{fullName}</p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-xs
                        font-normal
                        text-muted-foreground
                      "
                    >
                      {user.email}
                    </p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 size-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 size-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => {
                      void handleLogout();
                    }}
                  >
                    <LogOut className="mr-2 size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>
      </header>

      {/* =====================================================
          MOBILE TOP BRAND BAR

          Navigation does NOT live here.
          This only gives the landing page a light app header.
      ====================================================== */}

      <header
        className="
          fixed
          inset-x-0
          top-0
          z-50
          px-3
          pt-3

          lg:hidden
        "
      >
        <div
          className="
            mx-auto
            flex
            h-14
            items-center
            justify-between
            overflow-visible
            rounded-[1.2rem]
            border
            border-border/60
            bg-background/78
            px-3.5
            shadow-[0_6px_28px_rgba(38,17,58,0.045)]
            backdrop-blur-2xl
          "
        >
          <Link
            href="#home"
            className="
    flex
    min-w-0
    items-center
    gap-2.5
  "
            aria-label="Mecho AI home"
          >
            <div
              className="
      relative
      size-9
      shrink-0
    "
            >
              <Image
                src="/logo.svg"
                alt="Mecho AI"
                fill
                priority
                className="object-contain"
                sizes="36px"
              />
            </div>

            <span
              className="
      whitespace-nowrap
      text-[17px]
      font-semibold
      tracking-[-0.04em]
    "
            >
              Mecho AI
            </span>
          </Link>

          <div
            className="
              flex
              items-center
              gap-1
            "
          >
            <ThemeToggle />

            {!loading && user && (
              <Link href="/dashboard" aria-label="Open dashboard">
                <Avatar className="size-8">
                  <AvatarImage
                    src={user.profile_picture_url ?? user.avatar ?? undefined}
                    alt={fullName}
                  />

                  <AvatarFallback
                    className="
                      bg-mecho-gradient
                      text-[10px]
                      font-semibold
                      text-white
                    "
                  >
                    {initials || "M"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================
          MOBILE APP-STYLE BOTTOM NAVIGATION
      ====================================================== */}

      <nav
        aria-label="Mobile navigation"
        className="
          fixed
          inset-x-3
          bottom-3
          z-[60]

          lg:hidden
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-md
            grid-cols-5
            items-center
            rounded-[1.55rem]
            border
            border-border/70
            bg-background/88
            px-1.5
            py-1.5
            shadow-[0_18px_60px_rgba(38,17,58,0.14)]
            backdrop-blur-2xl

            supports-[padding:max(0px)]:pb-[max(0.375rem,env(safe-area-inset-bottom))]
          "
        >
          {mobileLinks.map((item) => {
            const Icon = item.icon;

            const active = activeSection === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                    relative
                    flex
                    min-h-[54px]
                    flex-col
                    items-center
                    justify-center
                    gap-1
                    rounded-[1.05rem]
                    px-1
                    text-[10px]
                    font-medium
                    transition-all
                    duration-300

                    ${active ? "text-mecho-purple" : "text-muted-foreground"}
                  `}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="
                        absolute
                        inset-1
                        -z-10
                        rounded-[0.9rem]
                        bg-mecho-purple-soft

                        dark:bg-mecho-purple/10
                      "
                  />
                )}

                <Icon
                  className={`
                      size-[19px]
                      transition-transform
                      duration-300

                      ${active ? "scale-105" : ""}
                    `}
                />

                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Dynamic final action */}

          {!loading && user ? (
            <Link
              href="/dashboard"
              className="
                relative
                flex
                min-h-[54px]
                flex-col
                items-center
                justify-center
                gap-1
                rounded-[1.05rem]
                px-1
                text-[10px]
                font-medium
                text-muted-foreground
                transition-colors

                hover:text-mecho-purple
              "
            >
              <LayoutDashboard className="size-[19px]" />

              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/signup"
              className="
                relative
                flex
                min-h-[54px]
                flex-col
                items-center
                justify-center
                gap-1
                overflow-hidden
                rounded-[1.05rem]
                bg-mecho-gradient
                px-1
                text-[10px]
                font-semibold
                text-white
                shadow-[0_7px_20px_rgba(111,44,255,0.22)]
              "
            >
              <Sparkles className="size-[18px]" />

              <span>Start free</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
