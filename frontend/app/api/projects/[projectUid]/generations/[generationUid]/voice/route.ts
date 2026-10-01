import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL;

type RouteContext = {
  params: Promise<{
    projectUid: string;
    generationUid: string;
  }>;
};

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
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

    const { projectUid, generationUid } = await params;

    const cookieStore = await cookies();

    const accessToken = cookieStore.get("mecho_access_token")?.value;

    console.log("Voice access token exists:", Boolean(accessToken));

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

    const backendResponse = await fetch(
      `${API_URL}/projects/${projectUid}/generations/${generationUid}/voice`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
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

    if (!backendResponse.ok) {
      console.error("Voice backend error:", {
        status: backendResponse.status,
        data,
      });
    }

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error("Voice generation BFF error:", error);

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
