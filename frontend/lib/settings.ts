import { authFetch } from "@/lib/auth-fetch";

export type UserPreferences = {
  default_language: string | null;
  default_tone: string | null;
  default_voice: string | null;
  default_workflow: string | null;

  preferences: Record<string, unknown> | null;
};

export type SettingsUser = {
  uid: string;

  first_name: string;
  middle_name: string | null;
  last_name: string;

  email: string;
  phone: string;

  profile_picture_url: string | null;

  is_verified: boolean;

  preferences: UserPreferences | null;
};

export type UpdateProfilePayload = {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
};

export type UpdatePreferencesPayload = {
  default_language: string;
  default_tone: string;
  default_voice: string;
  default_workflow: string;

  preferences: Record<string, unknown>;
};

export type VoiceDefinition = {
  name: string;
  display_name: string;
  description: string;

  languages: string[];

  default: boolean;
};

export async function getProfile(): Promise<SettingsUser> {
  const response = await authFetch("/api/users/me");

  if (!response.ok) {
    throw new Error(await getApiError(response, "Couldn't load your profile."));
  }

  return response.json();
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<SettingsUser> {
  const response = await authFetch("/api/users/me", {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      await getApiError(response, "Couldn't update your profile."),
    );
  }

  return response.json();
}

export async function uploadAvatar(file: File): Promise<SettingsUser> {
  const body = new FormData();

  body.append("file", file);

  const response = await authFetch("/api/users/me/avatar", {
    method: "POST",
    body,
  });

  if (!response.ok) {
    throw new Error(
      await getApiError(response, "Couldn't upload your profile photo."),
    );
  }

  return response.json();
}

export async function removeAvatar(): Promise<SettingsUser | null> {
  const response = await authFetch("/api/users/me/avatar", {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      await getApiError(response, "Couldn't remove your profile photo."),
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getPreferences(): Promise<UserPreferences> {
  const response = await authFetch("/api/users/me/preferences");

  if (!response.ok) {
    throw new Error(
      await getApiError(response, "Couldn't load your preferences."),
    );
  }

  return response.json();
}

export async function updatePreferences(
  payload: UpdatePreferencesPayload,
): Promise<UserPreferences> {
  const response = await authFetch("/api/users/me/preferences", {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      await getApiError(response, "Couldn't update your preferences."),
    );
  }

  return response.json();
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const response = await authFetch("/api/users/me/change-password", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      current_password: currentPassword,

      new_password: newPassword,
    }),
  });

  if (!response.ok) {
    throw new Error(
      await getApiError(response, "Couldn't change your password."),
    );
  }
}

export async function logoutAll() {
  const response = await authFetch("/api/auth/logout-all", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(
      await getApiError(response, "Couldn't log out all devices."),
    );
  }
}

export async function deleteAccount(password: string) {
  const response = await authFetch("/api/users/me", {
    method: "DELETE",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(
      await getApiError(response, "Couldn't delete your account."),
    );
  }
}

export async function getVoices(): Promise<VoiceDefinition[]> {
  const response = await fetch("/api/voices", {
    credentials: "include",
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  return Array.isArray(data) ? data : [];
}

async function getApiError(response: Response, fallback: string) {
  try {
    const body = await response.json();

    if (typeof body?.detail === "string") {
      return body.detail;
    }

    if (typeof body?.message === "string") {
      return body.message;
    }

    if (Array.isArray(body?.detail)) {
      return body.detail
        .map((item: { msg?: string }) => item.msg)
        .filter(Boolean)
        .join(", ");
    }
  } catch {
    // Ignore invalid JSON.
  }

  return fallback;
}
