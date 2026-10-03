"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/auth/auth-provider";

type GoogleAuthButtonProps = {
  disabled?: boolean;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          prompt: (
            momentListener?: (notification: {
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
            }) => void,
          ) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: string;
              theme?: string;
              size?: string;
              text?: string;
              shape?: string;
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

export function GoogleAuthButton({ disabled = false }: GoogleAuthButtonProps) {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const hiddenGoogleButtonRef = useRef<HTMLDivElement | null>(null);

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  /**
   * Complete Mecho authentication after Google returns an ID credential JWT.
   */
  async function handleGoogleCredential(credential: string) {
    if (isAuthenticating) return;

    setIsAuthenticating(true);

    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          credential,
        }),
      });

      let data: {
        detail?: string;
      } = {};

      try {
        data = await response.json();
      } catch {
        // Generic error below handles malformed responses.
      }

      if (!response.ok) {
        throw new Error(
          data.detail || "Google authentication couldn't be completed.",
        );
      }

      const authenticatedUser = await refreshUser();

      if (!authenticatedUser) {
        throw new Error(
          "Your session was created, but Mecho couldn't load your profile.",
        );
      }

      toast.success("Welcome to Mecho", {
        description: "Your workspace is ready.",
      });

      router.replace("/dashboard");
    } catch (error) {
      toast.error("We couldn't sign you in with Google", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsAuthenticating(false);
    }
  }

  /**
   * Load Google Identity Services once and render Google's real button into
   * a hidden container.
   *
   * We keep Google's authentication behavior while presenting Mecho's own
   * visible button.
   */
  useEffect(() => {
    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.");
      return;
    }

    function initializeGoogle() {
      if (!window.google || !hiddenGoogleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId!,
        callback: (response) => {
          if (!response.credential) {
            toast.error("Google sign-in couldn't be completed.");
            return;
          }

          void handleGoogleCredential(response.credential);
        },
      });

      hiddenGoogleButtonRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(hiddenGoogleButtonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: 280,
      });

      setGoogleReady(true);
    }

    if (window.google) {
      initializeGoogle();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", initializeGoogle);

      return () => {
        existingScript.removeEventListener("load", initializeGoogle);
      };
    }

    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;

    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [clientId]);

  /**
   * Click Google's actual Identity Services button programmatically.
   *
   * This preserves Google's supported credential flow while keeping the
   * visible UI fully aligned with Mecho's design.
   */
  function handleGoogleClick() {
    if (!googleReady || disabled || isAuthenticating) {
      return;
    }

    const googleButton =
      hiddenGoogleButtonRef.current?.querySelector<HTMLElement>(
        'div[role="button"]',
      );

    if (!googleButton) {
      toast.error("Google sign-in isn't ready yet.", {
        description: "Please try again in a moment.",
      });

      return;
    }

    googleButton.click();
  }

  return (
    <>
      <button
        type="button"
        disabled={disabled || isAuthenticating || !googleReady}
        onClick={handleGoogleClick}
        className="group inline-flex h-11 w-full items-center justify-center gap-3 rounded-full border border-border/70 bg-background px-5 text-sm font-medium text-foreground transition-all hover:border-mecho-purple/20 hover:bg-mecho-purple-soft/25 disabled:pointer-events-none disabled:opacity-50"
      >
        {isAuthenticating ? (
          <>
            <Loader2 className="size-4 animate-spin text-mecho-purple" />
            Connecting...
          </>
        ) : (
          <>
            <GoogleMark />
            Continue with Google
          </>
        )}
      </button>

      <div
        ref={hiddenGoogleButtonRef}
        aria-hidden="true"
        className="pointer-events-none fixed -left-[9999px] -top-[9999px] opacity-0"
      />
    </>
  );
}

function GoogleMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-[18px] shrink-0"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.98-.9 6.64-2.41l-3.24-2.51c-.9.6-2.05.95-3.4.95-2.61 0-4.82-1.76-5.61-4.13H3.04v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.9A6.01 6.01 0 0 1 6.08 12c0-.66.11-1.3.31-1.9V7.51H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.49l3.35-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.97c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.97 2.99 14.7 2 12 2a10 10 0 0 0-8.96 5.51l3.35 2.59C7.18 7.73 9.39 5.97 12 5.97Z"
      />
    </svg>
  );
}
