"use client";

import { useCallback, useEffect, useState } from "react";

export type AIDailyUsageView = {
  date: string;
  limit: number;
  used: number;
  remaining: number;
};

function parseUsage(value: unknown): AIDailyUsageView | null {
  if (typeof value !== "object" || value === null || !("usage" in value)) return null;
  const usage = value.usage;
  if (
    typeof usage !== "object" ||
    usage === null ||
    !("date" in usage) ||
    !("limit" in usage) ||
    !("used" in usage) ||
    !("remaining" in usage) ||
    typeof usage.date !== "string" ||
    typeof usage.limit !== "number" ||
    typeof usage.used !== "number" ||
    typeof usage.remaining !== "number"
  ) return null;
  return {
    date: usage.date,
    limit: usage.limit,
    used: usage.used,
    remaining: usage.remaining,
  };
}

export function useAIDailyUsage() {
  const [usage, setUsage] = useState<AIDailyUsageView | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [signInRequired, setSignInRequired] = useState(false);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai-usage", { signal, cache: "no-store" });
      if (response.status === 401) {
        if (!signal?.aborted) {
          setSignInRequired(true);
          setUnavailable(false);
        }
        return;
      }
      const payload: unknown = await response.json();
      const nextUsage = response.ok ? parseUsage(payload) : null;
      if (!nextUsage) throw new Error("AI_USAGE_UNAVAILABLE");
      setUsage(nextUsage);
      setUnavailable(false);
      setSignInRequired(false);
    } catch {
      if (!signal?.aborted) {
        setUnavailable(true);
        setSignInRequired(false);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  const updateFromResponse = useCallback((payload: unknown) => {
    const nextUsage = parseUsage(payload);
    if (nextUsage) {
      setUsage(nextUsage);
      setUnavailable(false);
      setSignInRequired(false);
      setLoading(false);
    }
  }, []);

  return { usage, loading, unavailable, signInRequired, refresh, updateFromResponse };
}
