"use client";

import { createContext, useEffect, useMemo, useState } from "react";

import { CookieBanner } from "./cookie-banner";
import { CookiePreferencesDialog } from "./cookie-preferences-dialog";

import {
  COOKIE_CONSENT_STORAGE_KEY,
  type CookieConsent,
  type CookieConsentContextValue,
} from "./cookie-types";

export const CookieConsentContext =
  createContext<CookieConsentContextValue | null>(null);

type CookieConsentProviderProps = {
  children: React.ReactNode;
};

/**
 * CookieConsentProvider
 *
 * Controls optional-cookie consent across Mecho.
 *
 * The first-visit banner is deliberately delayed so it doesn't compete
 * with the landing experience immediately after the visitor arrives.
 *
 * Essential authentication cookies are not affected by this preference.
 */
export function CookieConsentProvider({
  children,
}: CookieConsentProviderProps) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  const [hydrationReady, setHydrationReady] = useState(false);

  /**
   * Separate from hydrationReady.
   *
   * This allows us to check localStorage immediately, while delaying the
   * actual banner for users who have never made a choice.
   */
  const [showBanner, setShowBanner] = useState(false);

  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    let bannerTimer: number | undefined;

    try {
      const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored) as CookieConsent;

        setConsent({
          essential: true,
          analytics: Boolean(parsed.analytics),
          preferences: Boolean(parsed.preferences),
          marketing: Boolean(parsed.marketing),

          updatedAt: parsed.updatedAt || new Date().toISOString(),
        });
      } else {
        /**
         * Give the visitor time to experience the page before introducing
         * the privacy notice.
         */
        bannerTimer = window.setTimeout(() => {
          setShowBanner(true);
        }, 30_000);
      }
    } catch {
      /**
       * Invalid consent data should not break the app.
       * Remove it and treat the visitor as having made no decision.
       */
      window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);

      bannerTimer = window.setTimeout(() => {
        setShowBanner(true);
      }, 30_000);
    } finally {
      setHydrationReady(true);
    }

    return () => {
      if (bannerTimer) {
        window.clearTimeout(bannerTimer);
      }
    };
  }, []);

  function persistConsent(next: CookieConsent) {
    setConsent(next);

    window.localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify(next),
    );

    /**
     * Hide the first-visit banner as soon as a decision has been made.
     */
    setShowBanner(false);
  }

  function acceptAll() {
    persistConsent({
      essential: true,
      analytics: true,
      preferences: true,
      marketing: true,
      updatedAt: new Date().toISOString(),
    });

    setPreferencesOpen(false);
  }

  function rejectOptional() {
    persistConsent({
      essential: true,
      analytics: false,
      preferences: false,
      marketing: false,
      updatedAt: new Date().toISOString(),
    });

    setPreferencesOpen(false);
  }

  function savePreferences(
    preferences: Pick<CookieConsent, "analytics" | "preferences" | "marketing">,
  ) {
    persistConsent({
      essential: true,
      ...preferences,
      updatedAt: new Date().toISOString(),
    });

    setPreferencesOpen(false);
  }

  function openPreferences() {
    /**
     * Hide the banner while the larger preferences dialog is open.
     * This prevents two consent surfaces from competing visually.
     */
    setShowBanner(false);
    setPreferencesOpen(true);
  }

  function closePreferences() {
    setPreferencesOpen(false);

    /**
     * If the visitor opened Manage from the initial banner and closes the
     * dialog without saving, show the banner again because no decision was
     * actually made.
     */
    if (!consent) {
      setShowBanner(true);
    }
  }

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      consent,

      hasMadeChoice: consent !== null,

      preferencesOpen,

      acceptAll,
      rejectOptional,
      savePreferences,

      openPreferences,
      closePreferences,
    }),
    [consent, preferencesOpen],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}

      {hydrationReady && !consent && showBanner && !preferencesOpen && (
        <CookieBanner />
      )}

      {hydrationReady && <CookiePreferencesDialog />}
    </CookieConsentContext.Provider>
  );
}
