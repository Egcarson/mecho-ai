"use client";

import { Check, LockKeyhole, X } from "lucide-react";

import { useEffect, useState } from "react";

import { useCookieConsent } from "./cookie-settings-button";

/**
 * CookiePreferencesDialog
 *
 * Allows users to control optional cookie categories.
 *
 * Essential cookies remain permanently enabled because they are required
 * for authentication, session handling and core Mecho functionality.
 */
export function CookiePreferencesDialog() {
  const { consent, preferencesOpen, closePreferences, savePreferences } =
    useCookieConsent();

  const [analytics, setAnalytics] = useState(false);

  const [preferences, setPreferences] = useState(false);

  const [marketing, setMarketing] = useState(false);

  /**
   * Reset the switches to the user's last saved preferences whenever
   * the dialog opens.
   *
   * For a first-time visitor, all optional categories begin disabled.
   */
  useEffect(() => {
    if (!preferencesOpen) {
      return;
    }

    setAnalytics(consent?.analytics ?? false);

    setPreferences(consent?.preferences ?? false);

    setMarketing(consent?.marketing ?? false);
  }, [preferencesOpen, consent]);

  if (!preferencesOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[220]
        flex
        items-end
        justify-center
        bg-black/55
        p-3
        backdrop-blur-sm

        sm:items-center
        sm:p-6
      "
      onMouseDown={(event) => {
        /**
         * Only close when the user clicks the backdrop itself.
         * Clicking anywhere inside the dialog must not close it.
         */
        if (event.target === event.currentTarget) {
          closePreferences();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
        className="
          w-full
          max-w-xl
          overflow-hidden
          rounded-[1.75rem]
          border
          border-border/70
          bg-background
          shadow-[0_30px_120px_rgba(0,0,0,0.35)]
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-5
            border-b
            border-border/60
            p-5

            sm:p-6
          "
        >
          <div>
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.14em]
                text-mecho-purple
              "
            >
              Privacy
            </p>

            <h2
              id="cookie-preferences-title"
              className="
                mt-2
                text-2xl
                font-semibold
                tracking-[-0.04em]
              "
            >
              Cookie preferences
            </h2>

            <p
              className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              Choose which optional cookies Mecho may use. You can change these
              preferences at any time.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close cookie preferences"
            onClick={closePreferences}
            className="
              flex
              size-9
              shrink-0
              items-center
              justify-center
              rounded-full
              text-muted-foreground
              transition-colors

              hover:bg-muted
              hover:text-foreground
            "
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ==================================================
            COOKIE CATEGORIES
        ================================================== */}

        <div
          className="
            max-h-[60vh]
            divide-y
            divide-border/60
            overflow-y-auto
          "
        >
          <RequiredPreference />

          <OptionalPreference
            title="Analytics"
            description="Helps us understand how Mecho is used so we can improve performance and product experience."
            checked={analytics}
            onChange={setAnalytics}
          />

          <OptionalPreference
            title="Preferences"
            description="Allows Mecho to remember optional experience choices beyond core application requirements."
            checked={preferences}
            onChange={setPreferences}
          />

          <OptionalPreference
            title="Marketing"
            description="May be used for advertising, campaign measurement or understanding marketing performance."
            checked={marketing}
            onChange={setMarketing}
          />
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div
          className="
            flex
            justify-end
            border-t
            border-border/60
            p-5

            sm:p-6
          "
        >
          <button
            type="button"
            onClick={() =>
              savePreferences({
                analytics,
                preferences,
                marketing,
              })
            }
            className="
              inline-flex
              h-11
              items-center
              gap-2
              rounded-full
              bg-mecho-gradient
              px-5
              text-sm
              font-semibold
              text-white
              shadow-[0_10px_28px_rgba(111,44,255,0.2)]
            "
          >
            <Check className="size-4" />
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Essential cookies cannot be disabled.
 */
function RequiredPreference() {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-6
        p-5

        sm:p-6
      "
    >
      <div>
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <h3
            className="
              text-sm
              font-semibold
            "
          >
            Essential
          </h3>

          <LockKeyhole
            className="
              size-3.5
              text-muted-foreground
            "
          />
        </div>

        <p
          className="
            mt-1.5
            max-w-md
            text-sm
            leading-6
            text-muted-foreground
          "
        >
          Required for secure login, session handling and core Mecho
          functionality.
        </p>
      </div>

      <span
        className="
          shrink-0
          rounded-full
          bg-mecho-purple-soft
          px-3
          py-1.5
          text-[11px]
          font-semibold
          text-mecho-purple
        "
      >
        Always on
      </span>
    </div>
  );
}

/**
 * Optional cookie preference.
 *
 * IMPORTANT:
 *
 * The switch deliberately uses flexbox alignment rather than absolute
 * positioning + translate transforms.
 *
 * OFF  -> justify-start
 * ON   -> justify-end
 *
 * This guarantees the thumb remains inside the track at both positions,
 * regardless of browser rendering differences.
 */
function OptionalPreference({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;

  onChange: (checked: boolean) => void;
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-6
        p-5

        sm:p-6
      "
    >
      <div className="min-w-0">
        <h3
          className="
            text-sm
            font-semibold
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-1.5
            max-w-md
            text-sm
            leading-6
            text-muted-foreground
          "
        >
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${title} cookies`}
        onClick={() => onChange(!checked)}
        className={`
          mt-0.5
          flex
          h-6
          w-11
          shrink-0
          items-center
          rounded-full
          p-1
          transition-colors
          duration-200

          ${
            checked
              ? `
                justify-end
                bg-mecho-purple
              `
              : `
                justify-start
                bg-muted
              `
          }
        `}
      >
        <span
          aria-hidden="true"
          className="
            block
            size-4
            shrink-0
            rounded-full
            bg-white
            shadow-sm
            transition-all
            duration-200
          "
        />
      </button>
    </div>
  );
}
