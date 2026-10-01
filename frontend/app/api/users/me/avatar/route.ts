import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL;

async function getAccessToken() {
  const cookieStore = await cookies();

  return cookieStore.get("mecho_access_token")?.value;
}

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();

    const response = await fetch(`${API_URL}/users/me/avatar`, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${accessToken}`,
      },

      body: formData,
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      {
        detail: "Couldn't upload profile photo.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE() {
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

    const response = await fetch(`${API_URL}/users/me/avatar`, {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, {
        status: 204,
      });
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      {
        detail: "Couldn't remove profile photo.",
      },
      {
        status: 500,
      },
    );
  }
}
