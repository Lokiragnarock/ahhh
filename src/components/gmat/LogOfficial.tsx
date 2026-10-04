"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// "Log official mock": the only number you ever type. Three section scores
// and a date; the total and every percentile are derived server-side.
const FIELDS = [
  { key: "QR", label: "Quant" },
  { key: "VR", label: "Verbal" },
  { key: "DI", label: "Data Insights" },
] as const;

const today = () => new Date().toISOString().slice(0, 10);

export function LogOfficial() {
  const router = useRouter();
  const [vals, setVals] = useState({ QR: "", VR: "", DI: "" });
  const [date, setDate] = useState(today);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const ready = FIELDS.every((f) => vals[f.key] !== "") && date !== "";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || busy) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/gmat/diagnostics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "official",
          takenOn: date,
          sections: { QR: Number(vals.QR), VR: Number(vals.VR), DI: Number(vals.DI) },
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { totalScore?: number; error?: string; onboard?: boolean };
      if (!res.ok) {
        setMsg({ ok: false, text: body.onboard ? "No player on this device yet." : body.error ?? "Could not save." });
        return;
      }
      setMsg({ ok: true, text: `Logged: ${body.totalScore}` });
      setVals({ QR: "", VR: "", DI: "" });
      router.refresh();
    } catch {
      setMsg({ ok: false, text: "Could not reach the server." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="sp-panel mt-4 flex flex-wrap items-end gap-4">
      <div className="sp-label w-full !mb-0">Log official mock</div>
      {FIELDS.map((f) => (
        <label key={f.key} className="flex flex-col gap-1 text-[12px] text-[color:var(--sp-muted)]">
          {f.label} (60-90)
          <input
            type="number"
            inputMode="numeric"
            min={60}
            max={90}
            step={1}
            value={vals[f.key]}
            onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))}
            className="sp-input sp-num w-24"
          />
        </label>
      ))}
      <label className="flex flex-col gap-1 text-[12px] text-[color:var(--sp-muted)]">
        Date
        <input type="date" max={today()} value={date} onChange={(e) => setDate(e.target.value)} className="sp-input sp-num" />
      </label>
      <button type="submit" disabled={!ready || busy} className="sp-btn sp-btn-sm">
        {busy ? "Saving…" : "Log"}
      </button>
      {msg && <p className={`w-full text-[12px] ${msg.ok ? "sp-delta-pos" : "sp-error"}`}>{msg.text}</p>}
    </form>
  );
}
