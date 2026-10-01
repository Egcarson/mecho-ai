import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function GET() {
  if (!API_URL) {
    return NextResponse.json(
      {
        detail: "Backend API URL is not configured.",
      },
      {
        status: 500,
      },
    );
  }

  try {
    const backendResponse = await fetch(`${API_URL}/voices`, {
      method: "GET",
      cache: "no-store",
    });

    const responseText = await backendResponse.text();

    let data;

    try {
      data = responseText ? JSON.parse(responseText) : [];
    } catch {
      data = {
        detail: responseText || "Unexpected backend response.",
      };
    }

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error("Voice list BFF error:", error);

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
