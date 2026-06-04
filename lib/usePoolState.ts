"use client";
import { useEffect, useState, useCallback } from "react";
import type { PoolState } from "@/lib/store";

// Polls /api/state so the leaderboard "updates every day" without a refresh.
// Default poll is 60s; the tournament moves slowly enough that this is ample.
export function usePoolState(pollMs = 60_000) {
  const [state, setState] = useState<PoolState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      // Public pages (polling) allow the CDN-cached response for speed; the
      // admin editor (pollMs <= 0) always reads fresh so it sees its own saves.
      const res = await fetch(
        "/api/state",
        pollMs <= 0 ? { cache: "no-store" } : { cache: "default" }
      );
      if (!res.ok) throw new Error("Failed to load");
      setState(await res.json());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, [pollMs]);

  useEffect(() => {
    refresh();
    // pollMs <= 0 means "fetch once, no polling" (used by the admin editor so
    // it doesn't overwrite in-progress edits).
    if (pollMs <= 0) return;
    const id = setInterval(refresh, pollMs);
    return () => clearInterval(id);
  }, [refresh, pollMs]);

  return { state, error, refresh };
}
