import { NextResponse } from "next/server";

import type { AuthResponse } from "@/types/auth";

const API_URL = process.env.API_URL;

export async function POST(request: Request) {
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

  try {
    const body = (await request.json()) as {
      credential?: string;
    };

    /**
     * Never send an empty Google credential to the backend.
     *
     * Google normally supplies this value, but keeping the BFF defensive
     * makes failures easier to understand and avoids unnecessary backend work.
     */
    if (!body.credential) {
      return NextResponse.json(
        {
          detail: "Google authentication credential is missing.",
        },
        {
          status: 400,
        },
      );
    }

    const response = await fetch(`${API_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        credential: body.credential,
      }),
      cache: "no-store",
    });

    let data: unknown;

    try {
      data = await response.json();
    } catch {
      data = {
        detail: "Google authentication failed.",
      };
    }

    /**
     * Preserve the backend status and error detail.
     *
     * This includes useful responses such as disabled accounts,
     * invalid Google credentials and verification failures.
     */
    if (!response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    }

    const auth = data as AuthResponse;

    /**
     * Google and password authentication converge here.
     *
     * After this point the browser does not care which provider created
     * the session. Both use the same HttpOnly access/refresh cookies.
     */
    const nextResponse = NextResponse.json({
      user: auth.user,
    });

    nextResponse.cookies.set("mecho_access_token", auth.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 30,
    });

    nextResponse.cookies.set("mecho_refresh_token", auth.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return nextResponse;
  } catch (error) {
    console.error("GOOGLE AUTH BFF ERROR:", error);

    return NextResponse.json(
      {
        detail: "We couldn't complete Google authentication.",
      },
      {
        status: 500,
      },
    );
  }
}
