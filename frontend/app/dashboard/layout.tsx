"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import {
  FolderKanban,
  Headphones,
  History,
  Home,
  Library,
  Loader2,
  LogOut,
  MoreHorizontal,
  PenLine,
  Settings,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";

import { UserAvatar } from "@/components/auth/user-avatar";

import { MechoLogo } from "@/components/brand/mecho-logo";

import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { DashboardTour } from "@/components/dashboard/tour/dashboard-tour";

import { DashboardTourProvider } from "@/components/dashboard/tour/tour-provider";

import { useDashboardTour } from "@/components/dashboard/tour/use-dashboard-tour";
import { DashboardEntryLoader } from "@/components/dashboard/dashboard-entry-loader";

type NavigationItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
};

const mainNavigation: NavigationItem[] = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
    exact: true,
  },
  {
    label: "Create",
    href: "/dashboard/create",
    icon: PenLine,
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    label: "Library",
    href: "/dashboard/library",
    icon: Library,
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: History,
  },
];

const secondaryNavigation: NavigationItem[] = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    label: "Support",
    href: "/dashboard/support",
    icon: Headphones,
  },
];

const mobilePrimaryNavigation = mainNavigation.filter(
  (item) => item.label !== "History",
);

type AuthUserLike = {
  uid: string;

  first_name: string;
  last_name: string;
  email: string;

  profile_picture_url: string | null;

  avatar: string | null;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { user, loading, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /**
   * The branded dashboard loader should remain visible for a minimum
   * duration on a full dashboard mount.
   *
   * DashboardLayout persists across normal child-route navigation, so this
   * timer does NOT restart when moving between Library, Projects, History,
   * Settings, etc.
   */
  const [minimumLoadTimeElapsed, setMinimumLoadTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMinimumLoadTimeElapsed(true);
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /**
   * Authentication belongs outside the tour provider.
   *
   * Redirect unauthenticated visitors as soon as AuthProvider finishes
   * determining session state. We do not make them wait for the visual
   * splash timer before beginning the redirect.
   */
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      await logout();

      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  }

  /**
   * The splash disappears only when BOTH conditions are satisfied:
   *
   * 1. AuthProvider has finished resolving the authenticated session.
   * 2. The deliberate five-second brand experience has completed.
   *
   * If authentication happens to take longer than five seconds, the
   * splash simply remains until auth is ready instead of revealing an
   * incomplete dashboard underneath it.
   */
  const showEntryLoader = loading || !minimumLoadTimeElapsed;

  /**
   * While auth is still unknown we don't mount the authenticated shell.
   * The branded overlay handles the visual state.
   */
  if (loading) {
    return <DashboardEntryLoader visible />;
  }

  /**
   * AuthProvider has confirmed that no authenticated user exists.
   * router.replace() above is already moving the visitor to login.
   */
  if (!user) {
    return <DashboardEntryLoader visible />;
  }

  return (
    <>
      <DashboardTourProvider userUid={user.uid}>
        <AuthenticatedDashboardShell
          user={user}
          isLoggingOut={isLoggingOut}
          onLogout={handleLogout}
        >
          {children}
        </AuthenticatedDashboardShell>
      </DashboardTourProvider>

      {/*
       * The authenticated dashboard mounts behind the loader once auth
       * resolves. This means that while the final seconds of the splash are
       * playing, the dashboard can finish rendering underneath it.
       *
       * When visible becomes false, AnimatePresence performs the soft
       * fade rather than abruptly replacing one screen with another.
       */}
      <DashboardEntryLoader visible={showEntryLoader} />
    </>
  );
}

function AuthenticatedDashboardShell({
  user,
  isLoggingOut,
  onLogout,
  children,
}: {
  user: AuthUserLike;

  isLoggingOut: boolean;

  onLogout: () => Promise<void>;

  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { mobileMoreOpen, setMobileMoreOpen } = useDashboardTour();

  const fullName = useMemo(
    () => [user.first_name, user.last_name].filter(Boolean).join(" "),
    [user.first_name, user.last_name],
  );

  /**
   * Normal navigation should close the More sheet.
   *
   * Tour-driven Settings/Support steps reopen it automatically when
   * necessary.
   */
  useEffect(() => {
    setMobileMoreOpen(false);
  }, [pathname, setMobileMoreOpen]);

  function isActive(item: NavigationItem) {
    if (item.exact) {
      return pathname === item.href;
    }

    return pathname.startsWith(item.href);
  }

  return (
    <div
      className="
        min-h-screen
        bg-background
      "
    >
      {/* ======================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-40
          hidden
          w-[252px]
          border-r
          border-border/60
          bg-background/95
          backdrop-blur-xl

          lg:flex
          lg:flex-col
        "
      >
        <DesktopSidebar
          isActive={isActive}
          user={user}
          fullName={fullName}
          isLoggingOut={isLoggingOut}
          onLogout={onLogout}
        />
      </aside>

      {/* ======================================================
          MOBILE TOP BAR
      ====================================================== */}

      <header
        className="
          fixed
          inset-x-0
          top-0
          z-40
          flex
          h-16
          items-center
          justify-between
          border-b
          border-border/50
          bg-background/85
          px-4
          backdrop-blur-xl

          sm:px-6

          lg:hidden
        "
      >
        <Link
          href="/dashboard"
          aria-label="Mecho dashboard"
          className="flex items-center"
        >
          <div className="relative size-8 shrink-0">
            <Image
              src="/logo.svg"
              alt="Mecho AI"
              fill
              priority
              className="object-contain"
              sizes="20px"
            />
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMoreOpen(true)}
          aria-label="Open account menu"
          className="
            rounded-full
            transition-transform

            active:scale-95
          "
        >
          <UserAvatar
            firstName={user.first_name}
            lastName={user.last_name}
            profilePictureUrl={user.profile_picture_url}
            legacyAvatar={user.avatar}
            className="size-9"
          />
        </button>
      </header>

      {/* ======================================================
          PAGE CONTENT
      ====================================================== */}

      <div
        className="
          min-h-screen
          pb-[calc(5.75rem+env(safe-area-inset-bottom))]
          pt-16

          lg:ml-[252px]
          lg:pb-0
          lg:pt-0
        "
      >
        {children}
      </div>

      {/* ======================================================
          MOBILE BOTTOM NAVIGATION
      ====================================================== */}

      <MobileBottomNavigation
        pathname={pathname}
        isActive={isActive}
        onMore={() => setMobileMoreOpen(true)}
      />

      {/* ======================================================
          MOBILE MORE SHEET
      ====================================================== */}

      <MobileMoreSheet
        open={mobileMoreOpen}
        onOpenChange={setMobileMoreOpen}
        user={user}
        fullName={fullName}
        pathname={pathname}
        isLoggingOut={isLoggingOut}
        onLogout={onLogout}
      />

      {/**
       * Keep DashboardTour after the navigation/sheet components so its
       * overlay always renders above the interface it is describing.
       */}
      <DashboardTour />
    </div>
  );
}

function DesktopSidebar({
  isActive,
  user,
  fullName,
  isLoggingOut,
  onLogout,
}: {
  isActive: (item: NavigationItem) => boolean;

  user: AuthUserLike;

  fullName: string;

  isLoggingOut: boolean;

  onLogout: () => Promise<void>;
}) {
  return (
    <div
      className="
        flex
        h-full
        flex-col
      "
    >
      <div
        className="
          flex
          h-[82px]
          items-center
          px-6
        "
      >
        <Link
          href="/dashboard"
          aria-label="Mecho dashboard"
          className="
            inline-flex
            items-center
          "
        >
          <MechoLogo className="h-9 w-auto" />
        </Link>
      </div>

      <div
        className="
          flex-1
          px-3
        "
      >
        <nav aria-label="Dashboard navigation" className="space-y-1">
          {mainNavigation.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              active={isActive(item)}
              tourId={getDesktopTourId(item.label)}
            />
          ))}
        </nav>

        <div
          className="
            my-6
            px-3
          "
        >
          <div className="h-px bg-border/60" />
        </div>

        <nav aria-label="Workspace settings" className="space-y-1">
          {secondaryNavigation.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              active={isActive(item)}
              tourId={getDesktopTourId(item.label)}
            />
          ))}
        </nav>
      </div>

      <div className="p-3">
        <div
          className="
            mb-2
            flex
            items-center
            justify-between
            rounded-xl
            px-3
            py-2
          "
        >
          <span
            className="
              text-xs
              font-medium
              text-muted-foreground
            "
          >
            Appearance
          </span>

          <ThemeToggle />
        </div>

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-border/60
            bg-muted/20
          "
        >
          <Link
            href="/dashboard/settings"
            className="
              flex
              items-center
              gap-3
              p-3
              transition-colors

              hover:bg-muted/40
            "
          >
            <UserAvatar
              firstName={user.first_name}
              lastName={user.last_name}
              profilePictureUrl={user.profile_picture_url}
              legacyAvatar={user.avatar}
              className="size-9"
            />

            <div
              className="
                min-w-0
                flex-1
              "
            >
              <p
                className="
                  truncate
                  text-sm
                  font-semibold
                  tracking-[-0.015em]
                "
              >
                {fullName}
              </p>

              <p
                className="
                  mt-0.5
                  truncate
                  text-[11px]
                  text-muted-foreground
                "
              >
                {user.email}
              </p>
            </div>
          </Link>

          <div
            className="
              border-t
              border-border/60
              p-1.5
            "
          >
            <button
              type="button"
              disabled={isLoggingOut}
              onClick={() => {
                void onLogout();
              }}
              className="
                flex
                w-full
                items-center
                gap-2.5
                rounded-xl
                px-2.5
                py-2
                text-xs
                font-medium
                text-muted-foreground
                transition-colors

                hover:bg-muted/60
                hover:text-foreground

                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              {isLoggingOut ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <LogOut className="size-3.5" />
              )}

              {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({
  item,
  active,
  tourId,
}: {
  item: NavigationItem;
  active: boolean;
  tourId?: string;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      data-tour={tourId}
      className={`
        group
        relative
        flex
        h-11
        items-center
        gap-3
        rounded-xl
        px-3
        text-sm
        font-medium
        transition-all
        duration-200

        ${
          active
            ? `
              bg-mecho-purple-soft
              text-mecho-purple
            `
            : `
              text-muted-foreground

              hover:bg-muted/50
              hover:text-foreground
            `
        }
      `}
    >
      <Icon
        className="
          size-[17px]
          shrink-0
        "
      />

      <span>{item.label}</span>

      {active && (
        <span
          aria-hidden="true"
          className="
            absolute
            right-2.5
            size-1
            rounded-full
            bg-mecho-purple
          "
        />
      )}
    </Link>
  );
}

function MobileBottomNavigation({
  pathname,
  isActive,
  onMore,
}: {
  pathname: string;

  isActive: (item: NavigationItem) => boolean;

  onMore: () => void;
}) {
  const moreActive =
    pathname.startsWith("/dashboard/history") ||
    pathname.startsWith("/dashboard/settings") ||
    pathname.startsWith("/dashboard/support");

  return (
    <nav
      aria-label="Mobile dashboard navigation"
      className="
        fixed
        inset-x-0
        bottom-0
        z-50
        border-t
        border-border/60
        bg-background/92
        px-2
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
          items-end
        "
      >
        {mobilePrimaryNavigation.map((item) => {
          const active = isActive(item);

          const Icon = item.icon;

          const tourId = getMobileTourId(item.label);

          if (item.label === "Create") {
            return (
              <Link
                key={item.href}
                href={item.href}
                data-tour={tourId}
                className="
                    group
                    flex
                    flex-col
                    items-center
                    justify-end
                    gap-1
                    pb-1
                  "
              >
                <span
                  className={`
                      flex
                      size-12
                      -translate-y-2
                      items-center
                      justify-center
                      rounded-2xl
                      bg-mecho-gradient
                      text-white
                      shadow-[0_10px_30px_rgba(111,44,255,0.28)]
                      transition-transform

                      active:scale-95

                      ${active ? "ring-4 ring-mecho-purple/10" : ""}
                    `}
                >
                  <Icon className="size-5" />
                </span>

                <span
                  className="
                      -mt-2
                      text-[10px]
                      font-medium
                      text-mecho-purple
                    "
                >
                  Create
                </span>
              </Link>
            );
          }

          return (
            <MobileNavItem
              key={item.href}
              item={item}
              active={active}
              tourId={tourId}
            />
          );
        })}

        <button
          type="button"
          data-tour="mobile-more"
          onClick={onMore}
          className={`
            flex
            min-h-[58px]
            flex-col
            items-center
            justify-center
            gap-1
            rounded-xl
            transition-colors

            ${moreActive ? "text-mecho-purple" : "text-muted-foreground"}
          `}
        >
          <MoreHorizontal className="size-5" />

          <span
            className="
              text-[10px]
              font-medium
            "
          >
            More
          </span>
        </button>
      </div>
    </nav>
  );
}

function MobileNavItem({
  item,
  active,
  tourId,
}: {
  item: NavigationItem;
  active: boolean;
  tourId?: string;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      data-tour={tourId}
      className={`
        flex
        min-h-[58px]
        flex-col
        items-center
        justify-center
        gap-1
        rounded-xl
        transition-colors

        ${active ? "text-mecho-purple" : "text-muted-foreground"}
      `}
    >
      <div className="relative">
        <Icon className="size-5" />

        {active && (
          <span
            className="
              absolute
              -bottom-2
              left-1/2
              size-1
              -translate-x-1/2
              rounded-full
              bg-mecho-purple
            "
          />
        )}
      </div>

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
}

function MobileMoreSheet({
  open,
  onOpenChange,
  user,
  fullName,
  pathname,
  isLoggingOut,
  onLogout,
}: {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  user: AuthUserLike;

  fullName: string;

  pathname: string;

  isLoggingOut: boolean;

  onLogout: () => Promise<void>;
}) {
  const extraItems: NavigationItem[] = [
    {
      label: "History",
      href: "/dashboard/history",
      icon: History,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      label: "Support",
      href: "/dashboard/support",
      icon: Headphones,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="
          z-[60]
          rounded-t-[2rem]
          border-t
          border-border/60
          px-4
          pb-[calc(1.25rem+env(safe-area-inset-bottom))]
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
          <SheetTitle>More</SheetTitle>

          <SheetDescription>
            Account and additional navigation.
          </SheetDescription>
        </SheetHeader>

        <div
          className="
            mx-auto
            w-full
            max-w-lg
          "
        >
          <Link
            href="/dashboard/settings"
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

            <div
              className="
                min-w-0
                flex-1
              "
            >
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
          </Link>

          <div
            className="
              mt-5
              space-y-1
            "
          >
            {extraItems.map((item) => {
              const Icon = item.icon;

              const active = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-tour={
                    item.label === "Settings"
                      ? "mobile-settings"
                      : item.label === "Support"
                        ? "mobile-support"
                        : undefined
                  }
                  className={`
                      flex
                      h-12
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      text-sm
                      font-medium

                      ${
                        active
                          ? `
                            bg-mecho-purple-soft
                            text-mecho-purple
                          `
                          : `
                            text-muted-foreground

                            hover:bg-muted/50
                            hover:text-foreground
                          `
                      }
                    `}
                >
                  <Icon className="size-[18px]" />

                  {item.label}
                </Link>
              );
            })}
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

          <button
            type="button"
            disabled={isLoggingOut}
            onClick={() => {
              void onLogout();
            }}
            className="
              mt-2
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
              hover:text-foreground

              disabled:opacity-50
            "
          >
            {isLoggingOut ? (
              <Loader2 className="size-[18px] animate-spin" />
            ) : (
              <LogOut className="size-[18px]" />
            )}

            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Keep navigation labels separate from onboarding selectors.
 *
 * If visible copy changes later ("Library" → "Assets"), the tour ID can
 * remain stable and the onboarding engine won't break.
 */
function getDesktopTourId(label: string) {
  switch (label) {
    case "Create":
      return "desktop-create";

    case "Projects":
      return "desktop-projects";

    case "Library":
      return "desktop-library";

    case "Settings":
      return "desktop-settings";

    case "Support":
      return "desktop-support";

    default:
      return undefined;
  }
}

function getMobileTourId(label: string) {
  switch (label) {
    case "Create":
      return "mobile-create";

    case "Projects":
      return "mobile-projects";

    case "Library":
      return "mobile-library";

    default:
      return undefined;
  }
}
