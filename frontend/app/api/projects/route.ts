import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function GET() {
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

  const accessToken = cookieStore.get("mecho_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        detail: "Unauthorized.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const backendResponse = await fetch(`${API_URL}/projects`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const responseText = await backendResponse.text();

    let data;

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = {
        detail: responseText || "Unexpected backend response.",
      };
    }

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error("Get projects BFF error:", error);

    return NextResponse.json(
      {
        detail: "Could not connect to the Mecho backend.",
      },
      {
        status: 502,
      },
    );
  }
}

export async function POST(request: NextRequest) {
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

  const accessToken = cookieStore.get("mecho_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        detail: "Unauthorized.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const body = await request.json();

    const backendResponse = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const responseText = await backendResponse.text();

    let data;

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = {
        detail: responseText || "Unexpected backend response.",
      };
    }

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error("Create project BFF error:", error);

    return NextResponse.json(
      {
        detail: "Could not connect to the Mecho backend.",
      },
      {
        status: 502,
      },
    );
  }
}
