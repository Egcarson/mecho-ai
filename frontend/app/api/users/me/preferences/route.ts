import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL;

async function getAccessToken() {
  const cookieStore = await cookies();

  return cookieStore.get("mecho_access_token")?.value;
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

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

    const response = await fetch(`${API_URL}/users/me/preferences`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },

      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      {
        detail: "Couldn't load preferences.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();

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

    const response = await fetch(`${API_URL}/users/me/preferences`, {
      method: "PATCH",

      headers: {
        Authorization: `Bearer ${accessToken}`,

        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      {
        detail: "Couldn't update preferences.",
      },
      {
        status: 500,
      },
    );
  }
}
