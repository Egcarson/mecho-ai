import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

type RouteContext = {
  params: Promise<{
    projectUid: string;
  }>;
};

export async function POST(_request: Request, { params }: RouteContext) {
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

  const { projectUid } = await params;

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
    const backendResponse = await fetch(
      `${API_URL}/projects/${projectUid}/archive`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

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
    console.error("Archive project BFF error:", error);

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
