"use client";

import { useEffect, useState } from "react";

interface DuelEntry {
  name: string;
  isYou: boolean;
  r1: number;
  r2: number;
  r3: number;
  studied: number;
  mapped: number;
  drilled: number;
}

interface DuelResponse {
  configured: boolean;
  entries: DuelEntry[];
  totalTopics: number;
}

const MEDAL = ["🥇", "🥈", "🥉"];

export function Duel() {
  const [data, setData] = useState<DuelResponse | null>(null);
  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);
  const [syncHref, setSyncHref] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/duel", { cache: "no-store" });
      setData((await res.json()) as DuelResponse);
    } catch {
      setError("Couldn't reach the duel.");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setJoining(true);
    setError(null);
    try {
      const res = await fetch("/api/duel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) throw new Error();
      const body = (await res.json()) as { syncHref: string };
      setSyncHref(body.syncHref);
      await load();
    } catch {
      setError("Couldn't join. Try again.");
    } finally {
      setJoining(false);
    }
  }

  if (!data) return <p className="sp-body-text">Loading…</p>;

  if (!data.configured) {
    return (
      <div className="sp-panel max-w-[560px]">
        <p className="sp-body-text">
          The duel needs a shared database to compare people. Connect Upstash Redis (Vercel Storage → Upstash for
          Redis) to this project so <code>KV_REST_API_URL</code> / <code>KV_REST_API_TOKEN</code> are set, then
          redeploy.
        </p>
      </div>
    );
  }

  const youEntry = data.entries.find((e) => e.isYou);
  const total = data.totalTopics;

  return (
    <div>
      {!youEntry && (
        <form onSubmit={handleJoin} className="sp-panel max-w-[420px] mb-8 flex flex-col gap-3">
          <div className="sp-label">Join the duel</div>
          <p className="text-[13px] text-[#666]">
            Pick a name. Your R1/R2/R3 progress on this device starts counting the moment you join — no separate
            tracking to keep up.
          </p>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={40}
              className="flex-1 border border-[#ccc] px-3 py-2 text-[14px]"
            />
            <button type="submit" disabled={joining || !name.trim()} className="sp-btn sp-btn-sm">
              {joining ? "…" : "Join"}
            </button>
          </div>
          {error && <p className="text-[12px] text-red-600">{error}</p>}
        </form>
      )}

      {syncHref && (
        <div className="sp-panel max-w-[560px] mb-8 !border-[#111]">
          <div className="sp-label mb-1">You&apos;re in</div>
          <p className="text-[13px] text-[#555]">
            To have another device count toward the same name, open{" "}
            <code className="text-[#111]">{typeof window !== "undefined" ? window.location.origin : ""}{syncHref}</code>{" "}
            on it once.
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-[13.5px] border-collapse">
          <thead>
            <tr className="border-b border-[#111] text-left">
              <th className="py-2 pr-3 sp-label">#</th>
              <th className="py-2 pr-3 sp-label">Name</th>
              <th className="py-2 pr-3 sp-label text-right">R1</th>
              <th className="py-2 pr-3 sp-label text-right">R2</th>
              <th className="py-2 pr-3 sp-label text-right">R3</th>
              <th className="py-2 pr-3 sp-label text-right">Drilled</th>
            </tr>
          </thead>
          <tbody>
            {data.entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-[#888]">
                  Nobody&apos;s joined yet. Be the first.
                </td>
              </tr>
            ) : (
              data.entries.map((e, i) => (
                <tr key={`${e.name}-${i}`} className={`border-b border-[#e5e5e5] ${e.isYou ? "bg-[#f7f7f5]" : ""}`}>
                  <td className="py-2 pr-3 tabular-nums">{MEDAL[i] ?? i + 1}</td>
                  <td className="py-2 pr-3 font-semibold">
                    {e.name}
                    {e.isYou && <span className="text-[11px] font-normal text-[#888]"> · you</span>}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {e.r1}/{total}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {e.r2}/{total}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {e.r3}/{total}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums font-semibold">{e.drilled}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
