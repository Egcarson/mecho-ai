"use client";

import { useCallback, useEffect, useState } from "react";

import { getImageUsage, type ImageUsage } from "@/lib/media/image-usage";

export function useImageUsage() {
  const [usage, setUsage] = useState<ImageUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Refresh directly from the backend-owned usage endpoint.
   *
   * No toast is fired here because merely opening Image should never
   * produce an error notification.
   */
  const refresh = useCallback(async (): Promise<ImageUsage | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await getImageUsage();

      setUsage(result);

      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Mecho couldn't check your image allowance.";

      setUsage(null);
      setError(message);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    usage,
    loading,
    error,
    refresh,
  };
}
