/**
 * Increment this version if Mecho materially changes how optional
 * cookies are used and users should be asked for consent again.
 */
export const COOKIE_CONSENT_VERSION = "v1";

export const COOKIE_CONSENT_STORAGE_KEY = `mecho_cookie_consent_${COOKIE_CONSENT_VERSION}`;

export type CookieConsent = {
  /**
   * Essential cookies cannot be disabled because they are required for
   * core application functionality such as authentication/session state.
   */
  essential: true;

  analytics: boolean;

  preferences: boolean;

  marketing: boolean;

  /**
   * ISO timestamp for debugging and future consent migrations.
   */
  updatedAt: string;
};

export type CookieConsentContextValue = {
  consent: CookieConsent | null;

  hasMadeChoice: boolean;

  preferencesOpen: boolean;

  acceptAll: () => void;

  rejectOptional: () => void;

  savePreferences: (
    preferences: Pick<CookieConsent, "analytics" | "preferences" | "marketing">,
  ) => void;

  openPreferences: () => void;

  closePreferences: () => void;
};
