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
    const body = await request.json();

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    }

    const auth = data as AuthResponse;

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
  } catch {
    return NextResponse.json(
      {
        detail: "We couldn't complete the login request.",
      },
      {
        status: 500,
      },
    );
  }
}
