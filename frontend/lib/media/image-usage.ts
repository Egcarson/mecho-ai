import { authFetch } from "@/lib/auth-fetch";

export type ImageWorkflow = "social" | "campaign" | "speech";

export type ImageUsage = {
  social_used: number;
  social_limit: number;
  social_available: number;
  social_enabled: boolean;
  campaign_enabled: boolean;
  speech_enabled: boolean;
};

export type ImageAccess = {
  allowed: boolean;
  title: string;
  message: string;
  used?: number;
  limit?: number;
  available?: number;
};

/**
 * Read the backend-owned image allowance.
 *
 * authFetch handles an expired access token transparently before this
 * function receives the final response.
 */
export async function getImageUsage(): Promise<ImageUsage> {
  const response = await authFetch("/api/image/usage", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await readError(response, "Mecho couldn't check your image allowance."),
    );
  }

  return response.json();
}

/**
 * Convert the backend usage response into UI-friendly workflow access.
 *
 * The backend remains authoritative. The frontend never increments or
 * stores its own usage counter.
 */
export function getImageAccess(
  usage: ImageUsage,
  workflow: ImageWorkflow,
): ImageAccess {
  if (workflow === "social") {
    if (usage.social_enabled) {
      return {
        allowed: true,
        title: "Image generation available",
        message:
          usage.social_available === 1
            ? "You have 1 free image generation remaining."
            : `You have ${usage.social_available} free image generations remaining.`,
        used: usage.social_used,
        limit: usage.social_limit,
        available: usage.social_available,
      };
    }

    return {
      allowed: false,
      title: "Free image limit used",
      message:
        "You've used your current free image allowance. Your existing designs are still available.",
      used: usage.social_used,
      limit: usage.social_limit,
      available: usage.social_available,
    };
  }

  if (workflow === "campaign") {
    return {
      allowed: usage.campaign_enabled,
      title: usage.campaign_enabled
        ? "Image generation available"
        : "Campaign images aren't available on Free yet",
      message: usage.campaign_enabled
        ? "You can create an image for this campaign."
        : "You can still view any designs you've already created.",
    };
  }

  return {
    allowed: usage.speech_enabled,
    title: usage.speech_enabled
      ? "Image generation available"
      : "Speech images aren't available on Free yet",
    message: usage.speech_enabled
      ? "You can create an image for this speech."
      : "You can still view any designs you've already created.",
  };
}

async function readError(response: Response, fallback: string) {
  try {
    const data = await response.json();

    return data?.detail || data?.message || fallback;
  } catch {
    return fallback;
  }
}
