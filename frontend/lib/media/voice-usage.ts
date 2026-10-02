import { authFetch } from "@/lib/auth-fetch";

export type VoiceWorkflow = "social" | "campaign" | "speech";

export type VoiceUsageResponse = {
  social_used: number;
  social_limit: number;
  social_available: number;
  social_enabled: boolean;
  campaign_enabled: boolean;
  speech_enabled: boolean;
};

export type VoiceAccessState = {
  allowed: boolean;
  title: string;
  message: string;
};

const VOICE_USAGE_ENDPOINT = "/api/voice/usage";

export async function fetchVoiceUsage(): Promise<VoiceUsageResponse> {
  const response = await authFetch(VOICE_USAGE_ENDPOINT, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await getApiError(response, "Mecho couldn't verify your voice access."),
    );
  }

  return (await response.json()) as VoiceUsageResponse;
}

export function getVoiceAccess(
  usage: VoiceUsageResponse,
  workflow: VoiceWorkflow,
): VoiceAccessState {
  if (workflow === "campaign") {
    return {
      allowed: usage.campaign_enabled,
      title: "Voice isn't available here on Free yet",
      message:
        "Mecho Voice is working normally. New Campaign voice generation is currently limited on the free plan.",
    };
  }

  if (workflow === "speech") {
    return {
      allowed: usage.speech_enabled,
      title: "Voice isn't available here on Free yet",
      message:
        "Mecho Voice is working normally. New Speech voice generation is currently limited on the free plan.",
    };
  }

  if (!usage.social_enabled || usage.social_available <= 0) {
    return {
      allowed: false,
      title: "Free voice limit reached",
      message: `You've used your ${usage.social_limit} free voice generations. Your existing voices are still available anytime.`,
    };
  }

  return {
    allowed: true,
    title: "Voice available",
    message:
      usage.social_available === 1
        ? "You have 1 free voice generation remaining."
        : `You have ${usage.social_available} free voice generations remaining.`,
  };
}

async function getApiError(response: Response, fallback: string) {
  try {
    const body = await response.json();

    if (typeof body?.detail === "string") {
      return body.detail;
    }

    if (typeof body?.detail?.message === "string") {
      return body.detail.message;
    }

    if (typeof body?.message === "string") {
      return body.message;
    }
  } catch {
    // Use fallback below.
  }

  return fallback;
}
