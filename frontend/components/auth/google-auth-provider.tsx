"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export function GoogleAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = process.env.NEXT_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error("NEXT_GOOGLE_CLIENT_ID is not configured.");

    return children;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
}
