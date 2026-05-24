"use client";

import { useEffect, useRef } from "react";
import { useWardrobeStore } from "@/features/wardrobe/store/wardrobeStore";

export default function DataBootstrap() {
  const hasInitialized = useRef(false);
  const error = useWardrobeStore((state) => state.error);
  const setError = useWardrobeStore((state) => state.setError);
  const dataMode = useWardrobeStore((state) => state.dataMode);
  const hasBootstrapped = useWardrobeStore((state) => state.hasBootstrapped);
  const isHydrated = useWardrobeStore((state) => state.isHydrated);

  useEffect(() => {
    // Only initialize once, after hydration, and if not already bootstrapped
    if (
      !hasInitialized.current &&
      isHydrated &&
      !hasBootstrapped &&
      dataMode === "supabase"
    ) {
      hasInitialized.current = true;
      // Access initialize directly from store to avoid dependency issues
      const initialize = useWardrobeStore.getState().initialize;
      void initialize();
    }
  }, [isHydrated, hasBootstrapped, dataMode]);

  if (!error || dataMode !== "supabase") {
    return null;
  }

  return (
    <div className="mb-6 rounded-[var(--radius-card)] border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-ink">
      <div className="flex items-start justify-between gap-4">
        <span>{error}</span>
        <button
          className="text-xs font-semibold uppercase tracking-wide text-muted hover:text-ink"
          onClick={() => setError(undefined)}
          type="button"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
