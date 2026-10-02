import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL;

/**
 * BFF proxy for the authenticated user's voice allowance.
 *
 * The browser never talks to FastAPI directly.
 * We read the HttpOnly access token server-side and forward
 * it to the backend voice-usage endpoint.
 */
export async function GET() {
  try {
    if (!API_URL) {
      return NextResponse.json(
        {
          detail: "Server API configuration is missing.",
        },
        {
          status: 500,
        },
      );
    }

    const cookieStore = await cookies();

    const accessToken = cookieStore.get("mecho_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          detail: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    /*
     * IMPORTANT:
     * Change `/projects/voices/usage` below only if the
     * actual FastAPI route is different.
     */
    const response = await fetch(`${API_URL}/voice/usage`, {
      method: "GET",

      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },

      cache: "no-store",
    });

    const contentType = response.headers.get("content-type");

    const data = contentType?.includes("application/json")
      ? await response.json()
      : {
          detail: await response.text(),
        };

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("VOICE USAGE BFF ERROR:", error);

    return NextResponse.json(
      {
        detail: "Mecho couldn't check voice usage.",
      },
      {
        status: 500,
      },
    );
  }
}
