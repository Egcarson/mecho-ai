import { cookies } from "next/headers";

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL;

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

  return new NextResponse(await response.text(), {
    status: response.status,
  });
}

export async function GET() {
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

  const response = await fetch(`${API_URL}/assets/images`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  return backendResponseToNext(response);
}

export async function POST(request: NextRequest) {
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

  const incoming = await request.formData();

  const role = incoming.get("role");

  const file = incoming.get("file");

  if (typeof role !== "string" || !role) {
    return NextResponse.json(
      {
        detail: "Asset role is required.",
      },
      {
        status: 400,
      },
    );
  }

  if (!(file instanceof File)) {
    return NextResponse.json(
      {
        detail: "Image file is required.",
      },
      {
        status: 400,
      },
    );
  }

  const formData = new FormData();

  formData.append("role", role);

  formData.append("file", file);

  const response = await fetch(`${API_URL}/assets/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
    cache: "no-store",
  });

  return backendResponseToNext(response);
}
