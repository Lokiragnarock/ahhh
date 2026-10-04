"use client";

import { useEffect, useState } from "react";
import { flush, isRevoked, pull, REVOKED_EVENT } from "@/lib/sync/client";

// Invisible: pulls on load and whenever the tab comes back, pushes pending
// changes when the tab is hidden (switching apps, locking the phone). Shows a
// one-line banner when this device's link was replaced by "Reissue link".
export function SyncAgent() {
  const [replaced, setReplaced] = useState(false);
  useEffect(() => {
    const onRevoked = () => setReplaced(true);
    window.addEventListener(REVOKED_EVENT, onRevoked);
    if (isRevoked()) onRevoked();
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
      window.removeEventListener(REVOKED_EVENT, onRevoked);
    };
  }, []);
  if (!replaced) return null;
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-lg bg-[#111] text-white text-[12px] font-semibold shadow-xl">
      This link was replaced. Open your new link.
    </div>
  );
}
