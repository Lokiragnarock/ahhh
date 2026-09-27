"use client";

import { useState } from "react";
import { TopNav } from "@/components/TopNav";

export default function BackupPage() {
  const [secret, setSecret] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function download() {
    setBusy(true);
    setError("");
    setOk("");
    try {
      const res = await fetch(`/api/backup?secret=${encodeURIComponent(secret)}`);
      if (!res.ok) {
        if (res.status === 401) setError("Wrong secret.");
        else if (res.status === 501) setError("BACKUP_SECRET is not configured on the server.");
        else setError(`Backup failed (status ${res.status}).`);
        return;
      }

      const disposition = res.headers.get("content-disposition");
      const match = disposition?.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? `study-planner-backup-${new Date().toISOString().slice(0, 10)}.json`;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setOk("Snapshot downloaded.");
    } catch {
      setError("Backup failed (network error).");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="sp-page pt-12">
      <TopNav />
      <div className="max-w-[560px] mx-auto px-4 md:px-6 py-10">
        <h1 className="sp-h1 mb-2">Backup</h1>
        <p className="text-[14px] text-[#666] mb-10">
          Download a full snapshot of everyone&apos;s synced progress as JSON. You need the backup
          secret to do this, the same one set as <code>BACKUP_SECRET</code> on the server.
        </p>

        <div className="sp-panel flex flex-col gap-4">
          <label className="block">
            <div className="sp-label">Backup secret</div>
            <input
              type="password"
              className="sp-input w-full"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter the backup secret"
              autoComplete="off"
            />
          </label>
          <div>
            <button type="button" className="sp-btn" onClick={download} disabled={busy || !secret}>
              {busy ? "Downloading…" : "Download snapshot"}
            </button>
          </div>
          {error && <p className="text-[13.5px] text-[#e03e3e]">{error}</p>}
          {ok && <p className="text-[13.5px] text-[#111]">{ok}</p>}
        </div>
      </div>
    </main>
  );
}
