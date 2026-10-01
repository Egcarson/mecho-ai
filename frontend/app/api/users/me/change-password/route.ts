import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    const response = await fetch(`${API_URL}/users/me/change-password`, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${accessToken}`,

        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    });

    if (response.status === 204) {
      return new NextResponse(null, {
        status: 204,
      });
    }

    const text = await response.text();

    if (!text) {
      return new NextResponse(null, {
        status: response.status,
      });
    }

    return new NextResponse(text, {
      status: response.status,

      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        detail: "Couldn't change password.",
      },
      {
        status: 500,
      },
    );
  }
}
