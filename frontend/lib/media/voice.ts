import { authFetch } from "@/lib/auth-fetch";

export type VoiceOption = {
  name: string;
  display_name: string;
  description: string | null;
  languages: string[];
  default: boolean;
};

export type VoiceGenerationStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type VoiceGeneration = {
  uid: string;
  generation_uid: string;

  language: string;
  platform: string;
  voice: string;

  provider: string;
  response_format: string;

  status: VoiceGenerationStatus;

  audio_url: string | null;
  error_message: string | null;

  duration_seconds: number | null;

  created_at: string;
  updated_at: string;
};

async function getErrorMessage(response: Response, fallback: string) {
  try {
    const data = await response.json();

    if (typeof data?.detail === "string") {
      return data.detail;
    }

    if (Array.isArray(data?.detail)) {
      return data.detail
        .map((item: { msg?: string }) => item.msg ?? "Validation error")
        .join(", ");
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export async function fetchVoices() {
  const response = await fetch("/api/voices", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Couldn't load available voices."),
    );
  }

  return response.json() as Promise<VoiceOption[]>;
}

export async function createVoiceGeneration({
  projectUid,
  generationUid,
  language,
  platform,
  voice,
}: {
  projectUid: string;
  generationUid: string;
  language: string;
  platform: string;
  voice: string;
}) {
  const response = await authFetch(
    `/api/projects/${projectUid}/generations/${generationUid}/voice`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        platform,
        voice,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Mecho couldn't generate the voice."),
    );
  }

  return response.json() as Promise<VoiceGeneration>;
}

export async function fetchGenerationVoices({
  projectUid,
  generationUid,
}: {
  projectUid: string;
  generationUid: string;
}) {
  const response = await authFetch(
    `/api/projects/${projectUid}/generations/${generationUid}/voices`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Couldn't load generated voices."),
    );
  }

  return response.json() as Promise<VoiceGeneration[]>;
}
