import { cookies } from "next/headers";

import { NextResponse } from "next/server";

import type { AuthResponse } from "@/types/auth";

const API_URL = process.env.API_URL;

export async function POST() {
  if (!API_URL) {
    return NextResponse.json(
      {
        detail: "API URL is not configured.",
      },
      {
        status: 500,
      },
    );
  }

  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("mecho_refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      {
        detail: "Session expired.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        refresh_token: refreshToken,
      }),

      cache: "no-store",
    });

    /**
     * Some backend errors may not contain valid JSON.
     *
     * Avoid turning a legitimate backend response into an unrelated
     * Next.js 500 simply because JSON parsing failed.
     */
    let data: unknown;

    try {
      data = await response.json();
    } catch {
      data = {
        detail: "Unable to refresh session.",
      };
    }

    if (!response.ok) {
      const failedResponse = NextResponse.json(data, {
        status: response.status,
      });

      /**
       * Only destroy the local session when the backend explicitly tells
       * us the refresh credentials are no longer valid.
       *
       * A temporary backend/server failure should not log the user out.
       */
      if (response.status === 401 || response.status === 403) {
        failedResponse.cookies.delete("mecho_access_token");

        failedResponse.cookies.delete("mecho_refresh_token");
      }

      return failedResponse;
    }

    const auth = data as AuthResponse;

    const nextResponse = NextResponse.json({
      user: auth.user,
    });

    /**
     * Store the new access token.
     *
     * HttpOnly prevents JavaScript from reading authentication tokens.
     */
    nextResponse.cookies.set("mecho_access_token", auth.access_token, {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: "lax",

      path: "/",

      maxAge: 60 * 30,
    });

    /**
     * The backend may rotate refresh tokens.
     *
     * Always replace the old refresh cookie with the value returned by
     * the backend.
     */
    nextResponse.cookies.set("mecho_refresh_token", auth.refresh_token, {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: "lax",

      path: "/",

      maxAge: 60 * 60 * 24 * 30,
    });

    return nextResponse;
  } catch {
    /**
     * Do NOT delete the cookies here.
     *
     * A network/backend outage does not necessarily mean the refresh
     * token itself is invalid.
     */
    return NextResponse.json(
      {
        detail: "We couldn't refresh your session.",
      },
      {
        status: 503,
      },
    );
  }
}
