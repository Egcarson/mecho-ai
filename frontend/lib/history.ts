import { authFetch } from "@/lib/auth-fetch";

export type HistoryWorkflow = "social" | "campaign" | "speech";

export type HistoryStatus = "pending" | "processing" | "completed" | "failed";

export type HistoryItem = {
  uid: string;

  project_uid: string;
  project_name: string;

  workflow: HistoryWorkflow;
  status: HistoryStatus;

  input_content: string | null;
  output_content: string | null;

  created_at: string;
};

export type HistoryResponse = {
  items: HistoryItem[];

  page: number;
  limit: number;

  total: number;
  total_pages: number;
};

type GetGenerationHistoryParams = {
  page?: number;
  limit?: number;
};

export async function getGenerationHistory({
  page = 1,
  limit = 8,
}: GetGenerationHistoryParams = {}): Promise<HistoryResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await authFetch(
    `/api/generations/history?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(await getApiError(response, "Couldn't load your history."));
  }

  return response.json();
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
  } catch {
    // Ignore invalid JSON.
  }

  return fallback;
}
