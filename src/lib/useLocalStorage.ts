"use client";

import { useEffect, useRef, useState } from "react";
import { setLocal } from "./sync/client";
import { STORE_EVENT } from "./sync/shared";

/**
 * localStorage-backed state. Reads the stored value after mount (falling back
 * to `initialValue` during SSR / first paint), writes back on every change,
 * and re-reads when sync or another tab changes the key.
 *
 * `initialValue` is only a default: it isn't persisted until it's edited, so
 * a fresh device never saves seed data over the synced copy.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const initialRef = useRef(initialValue);
  const lastRaw = useRef<string | null>(null);

  useEffect(() => {
    const load = () => {
      try {
        const raw = window.localStorage.getItem(key);
        if (raw !== null) {
          lastRaw.current = raw;
          setValue(JSON.parse(raw) as T);
        } else {
          lastRaw.current = JSON.stringify(initialRef.current);
          setValue(initialRef.current);
        }
      } catch {
        // ignore malformed storage, keep current value
      }
    };
    load();
    setHydrated(true);
    const onLocal = (e: Event) => {
      if ((e as CustomEvent).detail === key) load();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) load();
    };
    window.addEventListener(STORE_EVENT, onLocal);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(STORE_EVENT, onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    const raw = JSON.stringify(value);
    if (raw === lastRaw.current) return;
    lastRaw.current = raw;
    setLocal(key, raw);
  }, [key, value, hydrated]);

  return [value, setValue] as const;
}
