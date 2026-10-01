const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined.");
}

type ApiErrorResponse = {
  detail?: string;
  message?: string;
};

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = "Something went wrong. Please try again.";

    try {
      const errorData: ApiErrorResponse = await response.json();

      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // response was not JSON
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
