"use client";

import { useEffect, useState } from "react";

/**
 * localStorage-backed state. Reads the initial value synchronously on first
 * client render (falling back to `initialValue` during SSR / first paint),
 * and writes back on every change.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      // ignore malformed storage, keep initialValue
    } finally {
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable — ignore
    }
  }, [key, value, hydrated]);

  return [value, setValue] as const;
}
