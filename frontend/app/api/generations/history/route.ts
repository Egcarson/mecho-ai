import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;

    const query = searchParams.toString();

    const response = await fetch(
      `${API_URL}/generations/history${query ? `?${query}` : ""}`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

        cache: "no-store",
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      {
        detail: "Couldn't load generation history.",
      },
      {
        status: 500,
      },
    );
  }
}
