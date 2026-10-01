import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL;

type RouteContext = {
  params: Promise<{
    projectUid: string;
    generationUid: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
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

  const { projectUid, generationUid } = await params;

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
      `${API_URL}/projects/${projectUid}/generations/${generationUid}`,
      {
        method: "GET",
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
    console.error("Get generation BFF error:", error);

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

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
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

  const { projectUid, generationUid } = await params;

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
      `${API_URL}/projects/${projectUid}/generations/${generationUid}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

    if (backendResponse.status === 204) {
      return new NextResponse(null, {
        status: 204,
      });
    }

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
    console.error("Delete generation BFF error:", error);

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
