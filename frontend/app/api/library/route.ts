import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function GET(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get("media_type");

  const query = mediaType ? `?media_type=${mediaType}` : "";

  const backendResponse = await fetch(`${API_URL}/library${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = await backendResponse.json();

  return NextResponse.json(data, {
    status: backendResponse.status,
  });
}
