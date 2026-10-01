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

    const response = await fetch(`${API_URL}/users/me`, {
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
        detail: "Couldn't load profile.",
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

    const response = await fetch(`${API_URL}/users/me`, {
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
        detail: "Couldn't update profile.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const response = await fetch(`${API_URL}/users/me`, {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${accessToken}`,

        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorData: unknown;

      try {
        errorData = await response.json();
      } catch {
        errorData = {
          detail: "Couldn't delete account.",
        };
      }

      return NextResponse.json(errorData, {
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
        detail: "Couldn't delete account.",
      },
      {
        status: 500,
      },
    );
  }
}
