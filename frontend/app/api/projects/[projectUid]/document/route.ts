import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL;

type RouteContext = {
  params: Promise<{
    projectUid: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
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

  const { projectUid } = await context.params;

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

  const incomingFormData = await request.formData();

  const file = incomingFormData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      {
        detail: "No document was provided.",
      },
      {
        status: 400,
      },
    );
  }

  const backendFormData = new FormData();

  backendFormData.append("file", file, file.name);

  const backendResponse = await fetch(
    `${API_URL}/projects/${projectUid}/document`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: backendFormData,
      cache: "no-store",
    },
  );

  const data = await backendResponse.json();

  return NextResponse.json(data, {
    status: backendResponse.status,
  });
}
