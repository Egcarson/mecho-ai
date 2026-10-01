import { cookies } from "next/headers";

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL;

type RouteContext = {
  params: Promise<{
    generationUid: string;
  }>;
};

async function getAccessToken() {
  const cookieStore = await cookies();

  return cookieStore.get("mecho_access_token")?.value;
}

async function backendResponseToNext(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  }

  const text = await response.text();

  return new NextResponse(text, {
    status: response.status,
  });
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  if (!API_URL) {
    return NextResponse.json(
      {
        detail: "API_URL is not configured.",
      },
      {
        status: 500,
      },
    );
  }

  const accessToken = await getAccessToken();

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

  const { generationUid } = await params;

  const response = await fetch(
    `${API_URL}/generations/${generationUid}/images`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  return backendResponseToNext(response);
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  if (!API_URL) {
    return NextResponse.json(
      {
        detail: "API_URL is not configured.",
      },
      {
        status: 500,
      },
    );
  }

  const accessToken = await getAccessToken();

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

  const { generationUid } = await params;

  const body = await request.json();

  const response = await fetch(
    `${API_URL}/generations/${generationUid}/images`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,

        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  return backendResponseToNext(response);
}
