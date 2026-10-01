import { authFetch } from "@/lib/auth-fetch";

export type LibraryMediaType = "voice" | "image" | "video";

export type LibraryItem = {
  uid: string;
  media_type: LibraryMediaType;
  url: string;
  project_uid: string;
  generation_uid: string;
  project_name: string;
  workflow: string;
  language: string | null;
  platform: string | null;
  voice_name: string | null;
  created_at: string;
};

export async function getLibrary(
  mediaType?: LibraryMediaType,
): Promise<LibraryItem[]> {
  const query = mediaType ? `?media_type=${mediaType}` : "";

  const response = await authFetch(`/api/library${query}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || "Couldn't load library.");
  }

  if (!Array.isArray(data)) {
    return [];
  }

  return data as LibraryItem[];
}

export function formatLabel(value: string | null | undefined) {
  if (!value) return "—";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatSentenceCase(value: string | null | undefined) {
  if (!value) return "—";

  const lower = value.toLowerCase();

  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export async function downloadFile(url: string, filename?: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Couldn't download this file.");
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename || "mecho-file";
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(objectUrl);
}

export async function shareFile(url: string, title: string) {
  if (navigator.share) {
    await navigator.share({
      title,
      url,
    });

    return;
  }

  await navigator.clipboard.writeText(url);
}
