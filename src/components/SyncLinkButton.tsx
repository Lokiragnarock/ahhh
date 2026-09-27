"use client";

import { useState } from "react";
import { Check, Link2, X } from "lucide-react";

type LinkState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; href: string }
  | { status: "unconfigured" }
  | { status: "error" };

export function SyncLinkButton() {
  const [state, setState] = useState<LinkState>({ status: "idle" });
  const [copied, setCopied] = useState(false);

  async function open() {
    setState({ status: "loading" });
    setCopied(false);
    try {
      const res = await fetch("/api/sync/link");
      const body = (await res.json()) as { configured: boolean; path?: string };
      if (!body.configured || !body.path) {
        setState({ status: "unconfigured" });
        return;
      }
      setState({ status: "ready", href: `${window.location.origin}${body.path}` });
    } catch {
      setState({ status: "error" });
    }
  }

  function close() {
    setState({ status: "idle" });
  }

  async function copy(href: string) {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
    } catch {
      // clipboard unavailable; the link is still selectable in the field
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="shrink-0 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#888] hover:text-[#111] transition-colors"
        title="Get this device's sync link"
      >
        <Link2 size={13} />
        <span className="hidden sm:inline">Sync</span>
      </button>

      {state.status !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1.5px]" onClick={close} />
          <div className="relative z-10 w-full max-w-[420px] bg-white rounded-xl shadow-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-semibold uppercase tracking-[0.09em] text-[#111]">
                Sync this device
              </span>
              <button
                type="button"
                onClick={close}
                className="p-1 rounded text-[#888] hover:text-[#111] hover:bg-[#f2f2f2] transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {state.status === "loading" && (
              <p className="text-[13px] text-[#888]">Getting your link…</p>
            )}

            {state.status === "unconfigured" && (
              <p className="text-[13px] text-[#888]">
                Sync storage isn&apos;t configured on this deployment, so there&apos;s no link to
                share yet.
              </p>
            )}

            {state.status === "error" && (
              <p className="text-[13px] text-[#888]">
                Couldn&apos;t reach the server. Try again in a moment.
              </p>
            )}

            {state.status === "ready" && (
              <>
                <p className="text-[13px] text-[#666] mb-3">
                  Open this link on another device to bring your progress there. Anyone with the
                  link can read and write it, so keep it private.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={state.href}
                    onFocus={(e) => e.currentTarget.select()}
                    className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-[#f2f2f2] text-[12px] font-mono text-[#111] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => copy(state.href)}
                    className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#111] text-white text-[12px] font-semibold hover:bg-[#333] transition-colors"
                  >
                    {copied ? <Check size={13} /> : null}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
