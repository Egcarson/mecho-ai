import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function POST() {
  try {
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

    const response = await fetch(`${API_URL}/auth/logout-all`, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      let data: unknown;

      try {
        data = await response.json();
      } catch {
        data = {
          detail: "Couldn't log out all devices.",
        };
      }

      return NextResponse.json(data, {
        status: response.status,
      });
    }

    const nextResponse = new NextResponse(null, {
      status: 204,
    });

    nextResponse.cookies.delete("mecho_access_token");

    nextResponse.cookies.delete("mecho_refresh_token");

    return nextResponse;
  } catch {
    return NextResponse.json(
      {
        detail: "Couldn't log out all devices.",
      },
      {
        status: 500,
      },
    );
  }
}
