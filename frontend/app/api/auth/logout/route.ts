import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

  if (refreshToken) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
        cache: "no-store",
      });
    } catch {
      // Still clear local cookies even if
      // the backend request fails.
    }
  }

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.delete("mecho_access_token");

  response.cookies.delete("mecho_refresh_token");

  return response;
}
