import { GenerateSettings } from "@/types/generate";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function generate(settings: GenerateSettings) {
  const formData = new FormData();

  const payload = {
    ...settings,
    upload: undefined,
  };

  formData.append("settings", JSON.stringify(payload));

  if (settings.upload) {
    formData.append("upload", settings.upload);
  }

  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    throw new Error(error);
  }

  return response.json();
}
