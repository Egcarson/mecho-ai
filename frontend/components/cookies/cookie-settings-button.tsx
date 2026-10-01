"use client";

import { useContext } from "react";

import { CookieConsentContext } from "./cookie-consent-provider";

/**
 * Shared hook for reading/updating cookie consent.
 */
export function useCookieConsent() {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error(
      "useCookieConsent must be used inside CookieConsentProvider.",
    );
  }

  return context;
}

type CookieSettingsButtonProps = {
  className?: string;
};

/**
 * Reusable action for footers, Settings or Support.
 *
 * This allows users to revisit consent after the initial banner disappears.
 */
export function CookieSettingsButton({ className }: CookieSettingsButtonProps) {
  const { openPreferences } = useCookieConsent();

  return (
    <button
      type="button"
      onClick={openPreferences}
      className={
        className ??
        `
          text-sm
          text-muted-foreground
          transition-colors

          hover:text-foreground
        `
      }
    >
      Cookie preferences
    </button>
  );
}
