"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  CircleHelp,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  PackageOpen,
  Settings,
  UserPlus,
  Workflow,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";

import { UserAvatar } from "@/components/auth/user-avatar";

import { MechoLogo } from "@/components/brand/mecho-logo";

import { ThemeToggle } from "@/components/theme-toggle";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  {
    label: "Home",
    href: "#home",
    id: "home",
  },
  {
    label: "How it works",
    href: "#how-it-works",
    id: "how-it-works",
  },
  {
    label: "Product",
    href: "#product",
    id: "product",
  },
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

const mobileNavItems = [
  {
    label: "Home",
    href: "#home",
    id: "home",
    icon: Home,
  },
  {
    label: "Product",
    href: "#product",
    id: "product",
    icon: PackageOpen,
  },
  {
    label: "How it works",
    href: "#how-it-works",
    id: "how-it-works",
    icon: Workflow,
  },
  {
    label: "Contact",
    href: "#contact",
    id: "contact",
    icon: CircleHelp,
  },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("home");

  const [menuOpen, setMenuOpen] = useState(false);

  const { user, loading, logout } = useAuth();

  const fullName = useMemo(() => {
    if (!user) {
      return "";
    }

    return [user.first_name, user.middle_name, user.last_name]
      .filter(Boolean)
      .join(" ");
  }, [user]);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  async function handleLogout() {
    await logout();

    setMenuOpen(false);
  }

  return (
    <>
      {/* Top navigation */}

      <header
        className="
          fixed
          inset-x-0
          top-0
          z-50
          px-3
          pt-3

          sm:px-6
          sm:pt-4
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
            rounded-2xl
            border
            border-border/70
            bg-background/80
            px-4
            shadow-[0_8px_40px_rgba(38,17,58,0.06)]
            backdrop-blur-xl

            sm:px-6
          "
        >
          <Link
            href="#home"
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
                hidden
                text-[22px]
                font-semibold
                tracking-[-0.04em]

                sm:inline
              "
            >
              Mecho AI
            </span>
          </Link>

          {/* Desktop links */}

          <div
            className="
              hidden
              items-center
              gap-1

              lg:flex
            "
          >
            {navLinks.map((link) => {
              const active = activeSection === link.id;

              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`
                      group
                      relative
                      rounded-full
                      px-4
                      py-2
                      text-[15px]
                      font-medium
                      transition-colors
                      duration-200

                      xl:text-base

                      ${
                        active
                          ? "text-mecho-purple"
                          : "text-muted-foreground hover:text-mecho-purple"
                      }
                    `}
                >
                  {link.label}

                  <span
                    className={`
                        absolute
                        inset-x-4
                        bottom-1
                        h-px
                        origin-left
                        bg-mecho-gradient
                        transition-transform
                        duration-300

                        ${
                          active
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        }
                      `}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop actions */}

          <div
            className="
              hidden
              items-center
              gap-2

              lg:flex
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
                      px-5
                    "
                >
                  <Link href="/login">Log in</Link>
                </Button>

                <Button
                  asChild
                  className="
                      rounded-full
                      border-0
                      bg-mecho-gradient
                      px-5
                      text-white
                    "
                >
                  <Link href="/signup">Get started</Link>
                </Button>
              </>
            )}

            {!loading && user && (
              <AccountDropdown
                user={user}
                fullName={fullName}
                onLogout={handleLogout}
              />
            )}
          </div>

          {/* Mobile account */}

          <div
            className="
              flex
              items-center
              gap-2

              lg:hidden
            "
          >
            {!loading && user && (
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open account menu"
              >
                <UserAvatar
                  firstName={user.first_name}
                  lastName={user.last_name}
                  profilePictureUrl={user.profile_picture_url}
                  legacyAvatar={user.avatar}
                  className="size-9"
                />
              </button>
            )}

            {!loading && !user && (
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="
                    flex
                    size-10
                    items-center
                    justify-center
                    rounded-full
                    text-muted-foreground

                    hover:bg-muted
                  "
              >
                <Menu className="size-5" />
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile bottom nav */}

      <nav
        aria-label="Mobile landing navigation"
        className="
          fixed
          inset-x-0
          bottom-0
          z-50
          border-t
          border-border/60
          bg-background/92
          px-1.5
          pt-1.5
          backdrop-blur-2xl

          lg:hidden
        "
        style={{
          paddingBottom: "max(0.4rem, env(safe-area-inset-bottom))",
        }}
      >
        <div
          className="
            mx-auto
            grid
            max-w-xl
            grid-cols-5
          "
        >
          {mobileNavItems.map((item) => {
            const Icon = item.icon;

            const active = activeSection === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                    flex
                    min-h-[58px]
                    flex-col
                    items-center
                    justify-center
                    gap-1
                    rounded-xl

                    ${active ? "text-mecho-purple" : "text-muted-foreground"}
                  `}
              >
                <Icon className="size-5" />

                <span
                  className="
                      text-[10px]
                      font-medium
                    "
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="
              flex
              min-h-[58px]
              flex-col
              items-center
              justify-center
              gap-1
              rounded-xl
              text-muted-foreground
            "
          >
            <Menu className="size-5" />

            <span
              className="
                text-[10px]
                font-medium
              "
            >
              Menu
            </span>
          </button>
        </div>
      </nav>

      <LandingMobileMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        user={user}
        loading={loading}
        fullName={fullName}
        onLogout={handleLogout}
      />
    </>
  );
}

type AccountDropdownProps = {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;

  fullName: string;

  onLogout: () => Promise<void>;
};

function AccountDropdown({ user, fullName, onLogout }: AccountDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className="
            group
            flex
            items-center
            gap-2.5
            rounded-full
            border
            border-border/70
            bg-background/70
            p-1.5
            pr-3
            shadow-[0_6px_20px_rgba(47,1,117,0.06)]
            transition-all
            duration-300

            hover:border-mecho-purple/30
          "
        >
          <UserAvatar
            firstName={user.first_name}
            lastName={user.last_name}
            profilePictureUrl={user.profile_picture_url}
            legacyAvatar={user.avatar}
            className="size-8"
          />

          <span
            className="
              max-w-[110px]
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
          w-72
          rounded-2xl
          border-border/70
          bg-background/95
          p-2
          shadow-[0_20px_60px_rgba(38,17,58,0.14)]
          backdrop-blur-xl
        "
      >
        <DropdownMenuLabel
          className="
            p-3
            font-normal
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <UserAvatar
              firstName={user.first_name}
              lastName={user.last_name}
              profilePictureUrl={user.profile_picture_url}
              legacyAvatar={user.avatar}
              className="size-11"
            />

            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-sm
                  font-semibold
                "
              >
                {fullName}
              </p>

              <p
                className="
                  mt-0.5
                  truncate
                  text-xs
                  text-muted-foreground
                "
              >
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          asChild
          className="
            rounded-xl
            p-0
          "
        >
          <Link
            href="/dashboard"
            className="
              cursor-pointer
              rounded-xl
              px-3
              py-2.5
            "
          >
            <LayoutDashboard className="mr-2 size-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="
            rounded-xl
            p-0
          "
        >
          <Link
            href="/dashboard/settings"
            className="
              cursor-pointer
              rounded-xl
              px-3
              py-2.5
            "
          >
            <Settings className="mr-2 size-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            void onLogout();
          }}
          className="
            cursor-pointer
            rounded-xl
            px-3
            py-2.5
            text-muted-foreground
          "
        >
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type LandingMobileMenuProps = {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  user: ReturnType<typeof useAuth>["user"] | null;

  loading: boolean;

  fullName: string;

  onLogout: () => Promise<void>;
};

function LandingMobileMenu({
  open,
  onOpenChange,
  user,
  loading,
  fullName,
  onLogout,
}: LandingMobileMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="
          rounded-t-[2rem]
          border-t
          border-border/60
          px-4
          pb-[calc(1.5rem+env(safe-area-inset-bottom))]
          pt-3
        "
      >
        <div
          className="
            mx-auto
            mb-5
            h-1
            w-10
            rounded-full
            bg-border
          "
        />

        <SheetHeader className="sr-only">
          <SheetTitle>Mecho menu</SheetTitle>

          <SheetDescription>Navigation and account options.</SheetDescription>
        </SheetHeader>

        <div
          className="
            mx-auto
            w-full
            max-w-lg
          "
        >
          {!loading && user && (
            <div
              className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  bg-muted/35
                  p-3
                "
            >
              <UserAvatar
                firstName={user.first_name}
                lastName={user.last_name}
                profilePictureUrl={user.profile_picture_url}
                legacyAvatar={user.avatar}
                className="size-12"
              />

              <div className="min-w-0">
                <p
                  className="
                      truncate
                      text-sm
                      font-semibold
                    "
                >
                  {fullName}
                </p>

                <p
                  className="
                      mt-0.5
                      truncate
                      text-xs
                      text-muted-foreground
                    "
                >
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <div
            className="
              mt-5
              grid
              gap-1
            "
          >
            <Link
              href="#about"
              onClick={() => onOpenChange(false)}
              className="
                rounded-xl
                px-3
                py-3
                text-sm
                font-medium
              "
            >
              About
            </Link>

            <Link
              href="#team"
              onClick={() => onOpenChange(false)}
              className="
                rounded-xl
                px-3
                py-3
                text-sm
                font-medium
              "
            >
              Team
            </Link>

            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    font-medium
                  "
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/settings"
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    font-medium
                  "
                >
                  <Settings className="size-4" />
                  Settings
                </Link>
              </>
            )}
          </div>

          <div
            className="
              my-4
              h-px
              bg-border/60
            "
          />

          <div
            className="
              flex
              items-center
              justify-between
              rounded-xl
              px-3
              py-2.5
            "
          >
            <span
              className="
                text-sm
                font-medium
              "
            >
              Appearance
            </span>

            <ThemeToggle />
          </div>

          {!loading && !user && (
            <div
              className="
                  mt-4
                  grid
                  gap-3
                "
            >
              <Button
                asChild
                variant="outline"
                className="
                    h-12
                    rounded-full
                  "
              >
                <Link href="/login">
                  <LogIn className="mr-2 size-4" />
                  Log in
                </Link>
              </Button>

              <Button
                asChild
                className="
                    h-12
                    rounded-full
                    border-0
                    bg-mecho-gradient
                    text-white
                  "
              >
                <Link href="/signup">
                  <UserPlus className="mr-2 size-4" />
                  Get started
                </Link>
              </Button>
            </div>
          )}

          {user && (
            <button
              type="button"
              onClick={() => {
                void onLogout();
              }}
              className="
                mt-3
                flex
                h-12
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                text-sm
                font-medium
                text-muted-foreground

                hover:bg-muted/50
              "
            >
              <LogOut className="size-4" />
              Log out
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
