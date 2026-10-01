export type AssetRole = "logo" | "primary" | "reference";

export type ImageAsset = {
  uid: string;
  project_uid: string | null;
  file_name: string;
  url: string;
  mime_type: string;
  size_bytes: number;
  role: AssetRole;
  created_at: string;
};

async function readError(response: Response, fallback: string) {
  try {
    const data = await response.json();

    return data?.detail || data?.message || fallback;
  } catch {
    return fallback;
  }
}

export async function getImageAssets(): Promise<ImageAsset[]> {
  const response = await fetch("/api/assets/images", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Couldn't load your images."));
  }

  const data = await response.json();

  return Array.isArray(data) ? data : [];
}

export async function uploadImageAsset({
  file,
  role,
}: {
  file: File;
  role: AssetRole;
}): Promise<ImageAsset> {
  const formData = new FormData();

  formData.append("role", role);
  formData.append("file", file);

  const response = await fetch("/api/assets/images", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Couldn't upload this image."));
  }

  return response.json();
}
