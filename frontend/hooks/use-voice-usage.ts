"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchVoiceUsage,
  type VoiceUsageResponse,
} from "@/lib/media/voice-usage";

export function useVoiceUsage() {
  const [usage, setUsage] = useState<VoiceUsageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      setError(null);

      const result = await fetchVoiceUsage();

      setUsage(result);

      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Mecho couldn't verify your voice access.";

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
