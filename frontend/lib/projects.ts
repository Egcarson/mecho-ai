import { authFetch } from "@/lib/auth-fetch";

export type ProjectWorkflow = "social" | "campaign" | "speech";

export type ProjectStatus = "draft" | "completed" | "published" | "archived";

export type ProjectListItem = {
  uid: string;

  created_at: string;
  updated_at: string;

  name: string;
  workflow: ProjectWorkflow;
  status: ProjectStatus;

  objective: string | null;
  tone: string | null;

  audiences: string[];
  platforms: string[] | null;
  languages: string[] | null;

  source_document_url: string | null;

  source_document_text: string | null;

  thumbnail_url: string | null;

  description: string | null;

  generation_count: number;

  length: string | null;

  target_duration_minutes: number | null;

  last_generated_at: string | null;

  last_opened_at: string | null;

  is_favorite: boolean;
  is_archived: boolean;
};

export type ProjectDetail = ProjectListItem & {
  source_content: string | null;

  source_file: string | null;
};

export type ProjectListResponse = {
  items: ProjectListItem[];
  total: number;
};

export type GenerationStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type ProjectGeneration = {
  uid: string;
  project_uid: string;

  status: GenerationStatus;

  prompt: string | null;

  system_prompt: string | null;

  input_content: string | null;

  output_content: string;

  memories: string | null;

  model: string | null;

  provider: string | null;

  error_message: string | null;

  completed_at: string | null;

  created_at: string;
  updated_at: string;
};

export type GenerationListResponse = {
  items: ProjectGeneration[];
  total: number;
};

export type UpdateProjectPayload = {
  name?: string;
  workflow?: string;
  objective?: string | null;
  tone?: string | null;
  audiences?: string[];
  languages?: string[];
  platforms?: string[];
  description?: string | null;
  length?: string | null;
  target_duration_minutes?: number | null;
  is_favorite?: boolean;
  is_archived?: boolean;
};

export async function updateProject(
  projectUid: string,
  payload: UpdateProjectPayload,
): Promise<ProjectDetail> {
  const response = await authFetch(`/api/projects/${projectUid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      await getApiError(response, "Couldn't update this project."),
    );
  }

  return response.json();
}

async function getApiError(response: Response, fallback: string) {
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

export async function getProjects() {
  const response = await authFetch("/api/projects", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await getApiError(response, "Couldn't load projects."));
  }

  return response.json() as Promise<ProjectListResponse>;
}

export async function getProject(projectUid: string) {
  const response = await authFetch(`/api/projects/${projectUid}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await getApiError(response, "Couldn't load this project."));
  }

  return response.json() as Promise<ProjectDetail>;
}

export async function getProjectGenerations(
  projectUid: string,
  options?: {
    limit?: number;
    offset?: number;
  },
) {
  const limit = options?.limit ?? 20;

  const offset = options?.offset ?? 0;

  const params = new URLSearchParams({
    limit: String(limit),

    offset: String(offset),
  });

  const response = await authFetch(
    `/api/projects/${projectUid}/generations?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getApiError(response, "Couldn't load project generations."),
    );
  }

  return response.json() as Promise<GenerationListResponse>;
}

export async function getProjectGeneration(
  projectUid: string,
  generationUid: string,
) {
  const response = await authFetch(
    `/api/projects/${projectUid}/generations/${generationUid}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getApiError(response, "Couldn't load this generation."),
    );
  }

  return response.json() as Promise<ProjectGeneration>;
}

export async function getLatestProjectGeneration(projectUid: string) {
  const response = await authFetch(
    `/api/projects/${projectUid}/generations/latest`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getApiError(response, "Couldn't load the latest generation."),
    );
  }

  return response.json() as Promise<ProjectGeneration>;
}

export async function toggleProjectFavorite(projectUid: string) {
  const response = await authFetch(`/api/projects/${projectUid}/favorite`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await getApiError(response, "Couldn't update favorite."));
  }

  return response.json();
}

export async function archiveProject(projectUid: string) {
  const response = await authFetch(`/api/projects/${projectUid}/archive`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await getApiError(response, "Couldn't archive project."));
  }

  return response.json();
}

export async function deleteProject(projectUid: string) {
  const response = await authFetch(`/api/projects/${projectUid}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await getApiError(response, "Couldn't delete project."));
  }
}

export async function deleteGeneration(
  projectUid: string,
  generationUid: string,
) {
  const response = await authFetch(
    `/api/projects/${projectUid}/generations/${generationUid}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(await getApiError(response, "Couldn't delete generation."));
  }
}
