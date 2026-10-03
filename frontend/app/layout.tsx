import type { Metadata } from "next";

import { Geist, Instrument_Serif } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";

import { Toaster } from "sonner";

import { AuthProvider } from "@/components/auth/auth-provider";

import { CookieConsentProvider } from "@/components/cookies/cookie-consent-provider";
import { GoogleAuthProvider } from "@/components/auth/google-auth-provider";

import "./globals.css";

const geist = Geist({
  variable: "--font-geist",

  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",

  subsets: ["latin"],

  weight: "400",

  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Mecho AI - Build and share",

  description:
    "Create content that adapts across platforms, audiences, languages, and formats.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/**
           * Cookie consent wraps AuthProvider rather than sitting inside
           * it because visitors should be able to manage optional cookies
           * before creating or signing into a Mecho account.
           *
           * Essential authentication cookies are NOT blocked by this
           * provider.
           */}
          <CookieConsentProvider>
            <GoogleAuthProvider>
              <AuthProvider>
                {children}

                <Toaster
                  position="top-right"
                  richColors={false}
                  closeButton
                  toastOptions={{
                    duration: 4200,

                    classNames: {
                      toast:
                        "rounded-2xl border border-border/70 bg-background/90 text-foreground shadow-2xl backdrop-blur-xl",

                      title: "text-sm font-semibold tracking-[-0.01em]",

                      description: "text-sm leading-6 text-muted-foreground",

                      closeButton:
                        "border-border bg-background text-muted-foreground hover:text-foreground",
                    },
                  }}
                />
              </AuthProvider>
            </GoogleAuthProvider>
          </CookieConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
