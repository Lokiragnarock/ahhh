"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

// A target a click can reach: switch to `track`, pick `slug`, land on Territory.
export interface HomeItem {
  track: string;
  slug: string;
  label: string;
}

// One box inside an expanded row. With `boxLink` the whole box is the click
// target (GMAT subjects); otherwise it holds small buttons (Uni semesters).
export interface HomeSection {
  key: string;
  label: string;
  meta?: string;
  items: HomeItem[];
  boxLink?: HomeItem;
}

// A row with no `sections` is muted and not interactive. A future GRE or CA
// row going live is just data here.
export interface TrackRowData {
  key: string;
  title: string;
  sub?: string;
  tag?: string;
  count?: number;
  sections?: HomeSection[];
  footerLink?: { label: string; track: string; href: string };
}

interface Props {
  currentTrack: string;
  rows: TrackRowData[];
}

const FINE_HOVER = "(hover: hover) and (pointer: fine)";
const GLOW = 180;

function countText(n: number) {
  return `${n} ${n === 1 ? "subject" : "subjects"}`;
}

// Trailing cursor glow for a live row.
function useGlow() {
  const boxRef = useRef<HTMLButtonElement | null>(null);
  const blobRef = useRef<HTMLDivElement | null>(null);
  const st = useRef({ tx: 0, ty: 0, x: 0, y: 0, raf: 0, hovered: false, seeded: false });

  const tick = useCallback(() => {
    const s = st.current;
    const el = blobRef.current;
    s.raf = 0;
    if (!el) return;
    s.x += (s.tx - s.x) * 0.14;
    s.y += (s.ty - s.y) * 0.14;
    el.style.transform = `translate3d(${s.x - GLOW / 2}px, ${s.y - GLOW / 2}px, 0)`;
    const settled = Math.abs(s.tx - s.x) < 0.3 && Math.abs(s.ty - s.y) < 0.3;
    if (!settled || s.hovered) s.raf = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const fine = window.matchMedia(FINE_HOVER);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const s = st.current;
    const el = blobRef.current;

    // Resting position: centred. Also the static glow under reduced motion.
    if (el) el.style.transform = `translate3d(${box.clientWidth / 2 - GLOW / 2}px, ${box.clientHeight / 2 - GLOW / 2}px, 0)`;

    const move = (e: PointerEvent) => {
      if (!fine.matches || reduced.matches || e.pointerType === "touch") return;
      const r = box.getBoundingClientRect();
      s.tx = e.clientX - r.left;
      s.ty = e.clientY - r.top;
      if (!s.seeded) {
        s.x = s.tx;
        s.y = s.ty;
        s.seeded = true;
      }
      s.hovered = true;
      if (!s.raf) s.raf = requestAnimationFrame(tick);
    };
    const leave = () => {
      // The loop stops itself once the blob has settled.
      s.hovered = false;
      s.seeded = false;
    };
    box.addEventListener("pointerenter", move);
    box.addEventListener("pointermove", move);
    box.addEventListener("pointerleave", leave);
    return () => {
      box.removeEventListener("pointerenter", move);
      box.removeEventListener("pointermove", move);
      box.removeEventListener("pointerleave", leave);
      if (s.raf) cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, [tick]);

  return { boxRef, blobRef };
}

// React 18 has no boolean `inert`: it writes inert="false", which still makes
// the element inert. Emit the attribute only when it should apply.
function inertProps(on: boolean) {
  return (on ? { inert: "" } : {}) as Record<string, string>;
}

function post(url: string, body: unknown) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function TrackBoxes({ currentTrack, rows }: Props) {
  const [open, setOpen] = useState<string | null>(rows.find((r) => r.sections)?.key ?? null);
  const [instant, setInstant] = useState(false);
  const [busy, setBusy] = useState(false);
  const viaKeyboard = useRef(false);
  const liveRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const liveKeys = rows.filter((r) => r.sections).map((r) => r.key);

  function toggle(key: string) {
    setInstant(viaKeyboard.current);
    viaKeyboard.current = false;
    setOpen((o) => (o === key ? null : key));
  }

  function onRowKey(e: React.KeyboardEvent, key: string) {
    if (e.key === "Enter" || e.key === " ") viaKeyboard.current = true;
    const i = liveKeys.indexOf(key);
    const next = e.key === "ArrowDown" ? liveKeys[i + 1] : e.key === "ArrowUp" ? liveKeys[i - 1] : undefined;
    if (next) {
      e.preventDefault();
      liveRefs.current.get(next)?.focus();
    }
  }

  // Switch track if needed, optionally pick a subject, then navigate.
  async function go(item: { track: string; slug?: string; href?: string }) {
    if (busy) return;
    setBusy(true);
    try {
      let home: string | undefined;
      if (currentTrack !== item.track) {
        const r = await post("/api/track", { track: item.track });
        if (!r.ok) return;
        home = ((await r.json()) as { home?: string }).home;
      }
      if (item.slug) {
        const r = await post("/api/subject", { subject: item.slug });
        if (!r.ok) return;
        window.location.assign("/territory");
      } else {
        window.location.assign(item.href ?? home ?? "/");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <ol className="hm-list">
      {rows.map((row, idx) =>
        row.sections ? (
          <LiveRow
            key={row.key}
            row={row}
            n={idx + 1}
            isOpen={open === row.key}
            instant={instant}
            busy={busy}
            onToggle={() => toggle(row.key)}
            onKeyDown={(e) => onRowKey(e, row.key)}
            register={(el) => liveRefs.current.set(row.key, el)}
            go={go}
          />
        ) : (
          <li key={row.key} className="hm-item" style={{ ["--n" as string]: idx }}>
            <div className="hm-row hm-muted">
              <RowHead n={idx + 1} row={row} />
            </div>
          </li>
        ),
      )}
    </ol>
  );
}

function LiveRow({
  row,
  n,
  isOpen,
  instant,
  busy,
  onToggle,
  onKeyDown,
  register,
  go,
}: {
  row: TrackRowData;
  n: number;
  isOpen: boolean;
  instant: boolean;
  busy: boolean;
  onToggle: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  register: (el: HTMLButtonElement | null) => void;
  go: (item: { track: string; slug?: string; href?: string }) => void;
}) {
  const panelId = useId();
  const glow = useGlow();
  const sections = row.sections ?? [];
  return (
    <li className="hm-item" style={{ ["--n" as string]: n - 1 }}>
      <button
        ref={(el) => {
          glow.boxRef.current = el;
          register(el);
        }}
        type="button"
        className="hm-row hm-live"
        data-active={isOpen}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onKeyDown={onKeyDown}
        onClick={onToggle}
      >
        <div ref={glow.blobRef} className="hm-glow" aria-hidden="true" />
        <RowHead n={n} row={row} />
      </button>
      <div id={panelId} className="hm-collapse" data-open={isOpen} data-instant={instant || undefined} {...inertProps(!isOpen)}>
        <div className="hm-inner">
          <div className="hm-content">
            {sections.map((s, i) => {
              const head = (
                <span className="hm-sem-head">
                  <span className="hm-sem-label">{s.label}</span>
                  {s.meta && <span className="hm-sem-count">{s.meta}</span>}
                </span>
              );
              return s.boxLink ? (
                <button
                  key={s.key}
                  type="button"
                  className="hm-sem hm-sem-link"
                  style={{ ["--i" as string]: i }}
                  disabled={busy}
                  onClick={() => go({ track: s.boxLink!.track, slug: s.boxLink!.slug })}
                >
                  {head}
                </button>
              ) : (
                <div key={s.key} className="hm-sem" style={{ ["--i" as string]: i }}>
                  {head}
                  <div className="flex flex-wrap gap-1.5">
                    {s.items.map((it) => (
                      <button
                        key={it.slug}
                        type="button"
                        className="hm-chip"
                        disabled={busy}
                        onClick={() => go({ track: it.track, slug: it.slug })}
                      >
                        {it.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            {sections.length === 0 && <div className="hm-sem-count">No subjects yet.</div>}
            {row.footerLink && (
              <button
                type="button"
                className="hm-footer"
                disabled={busy}
                onClick={() => go({ track: row.footerLink!.track, href: row.footerLink!.href })}
              >
                {row.footerLink.label} →
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

function RowHead({ n, row }: { n: number; row: TrackRowData }) {
  return (
    <span className="hm-head">
      <span className="hm-badge">{n}</span>
      <span className="hm-title">{row.title}</span>
      {row.sub && <span className="hm-sub">{row.sub}</span>}
      {row.tag && <span className="hm-tag">{row.tag}</span>}
      {row.count !== undefined && <span className="hm-right">{countText(row.count)}</span>}
    </span>
  );
}
