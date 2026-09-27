"use client";

import { useEffect } from "react";
import { flush, pull } from "@/lib/sync/client";

// Invisible: pulls on load and whenever the tab comes back, pushes pending
// changes when the tab is hidden (switching apps, locking the phone).
export function SyncAgent() {
  useEffect(() => {
    void pull();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void pull();
      else void flush(true);
    };
    const onOnline = () => void pull();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("online", onOnline);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("online", onOnline);
    };
  }, []);
  return null;
}
