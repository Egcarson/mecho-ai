"use client";

import { useEffect, useState } from "react";

import { Loader2, Map } from "lucide-react";

import { toast } from "sonner";

import {
  getPreferences,
  getProfile,
  type SettingsUser,
  type UserPreferences,
} from "@/lib/settings";

import { ProfileSettings } from "./profile-settings";

import { PreferencesSettings } from "./preferences-settings";

import { SecuritySettings } from "./security-settings";

import { useDashboardTour } from "@/components/dashboard/tour/use-dashboard-tour";

export function SettingsPage() {
  const { restartTour } = useDashboardTour();

  const [user, setUser] = useState<SettingsUser | null>(null);

  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      setLoading(true);

      try {
        const [profileResponse, preferencesResponse] = await Promise.all([
          getProfile(),
          getPreferences(),
        ]);

        if (cancelled) {
          return;
        }

        setUser(profileResponse);

        setPreferences(preferencesResponse);
      } catch (error) {
        if (cancelled) {
          return;
        }

        toast.error(
          error instanceof Error ? error.message : "Couldn't load settings.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-[65vh]
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            text-sm
            text-muted-foreground
          "
        >
          <Loader2 className="size-4 animate-spin" />
          Loading settings...
        </div>
      </div>
    );
  }

  if (!user || !preferences) {
    return (
      <div
        className="
          mx-auto
          max-w-xl
          px-4
          py-24
          text-center
        "
      >
        <h1
          className="
            text-2xl
            font-semibold
            tracking-[-0.04em]
          "
        >
          Couldn't load settings
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-muted-foreground
          "
        >
          Refresh the page and try again.
        </p>
      </div>
    );
  }

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-5xl
        px-4
        pb-20
        pt-10

        sm:px-6
        sm:pt-12

        lg:px-8
        lg:pt-14
      "
    >
      <div
        className="
          flex
          flex-col
          gap-6

          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.14em]
              text-muted-foreground
            "
          >
            Your account
          </p>

          <h1
            className="
              mt-3
              text-4xl
              font-semibold
              tracking-[-0.05em]

              sm:text-5xl
            "
          >
            Settings
          </h1>

          <p
            className="
              mt-4
              max-w-2xl
              text-base
              leading-7
              text-muted-foreground
            "
          >
            Manage your profile, creative defaults and account security.
          </p>
        </div>

        {/**
         * Restart deliberately returns to /dashboard because the guided
         * tour is built around dashboard controls and navigation.
         */}
        <button
          type="button"
          onClick={restartTour}
          className="
            inline-flex
            h-10
            w-fit
            shrink-0
            items-center
            gap-2
            rounded-full
            border
            border-border/70
            bg-background
            px-4
            text-sm
            font-medium
            text-muted-foreground
            transition-all

            hover:border-mecho-purple/20
            hover:bg-mecho-purple-soft/40
            hover:text-mecho-purple
          "
        >
          <Map className="size-4" />
          Take dashboard tour
        </button>
      </div>

      <div
        className="
          mt-10
          space-y-6
        "
      >
        <ProfileSettings user={user} onUserChange={setUser} />

        <PreferencesSettings
          preferences={preferences}
          onChange={setPreferences}
        />

        <SecuritySettings />
      </div>
    </main>
  );
}
