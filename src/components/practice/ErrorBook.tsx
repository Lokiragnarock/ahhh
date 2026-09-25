"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ERROR_TYPES, ErrorEntry, ErrorStatus } from "@/lib/practice-types";
import {
  applyReview,
  cleanStreak,
  countByType,
  dayKey,
  errorsToMarkdown,
  exportAll,
  fmtDate,
  importAll,
  isDue,
  makeError,
  useErrors,
} from "@/lib/practice-store";
import { EMPTY_FIELDS, ErrorFieldValues, ErrorFields } from "./ErrorFields";
import { PageHead, Stat } from "./bits";

interface NodeOpt {
  id: string;
  unit: string;
  title: string;
}

const pick = (e: ErrorEntry): ErrorFieldValues => ({
  errorType: e.errorType,
  what: e.what,
  why: e.why,
  correct: e.correct,
  avoid: e.avoid,
});

const STATUSES: ErrorStatus[] = ["open", "re-solving", "mastered"];
const cmp = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });

export function ErrorBook({ nodes }: { nodes: NodeOpt[] }) {
  const [errors, setErrors, hydrated] = useErrors();
  const [filters, setFilters] = useState({ unit: "", node: "", type: "", status: "" });
  const [showManual, setShowManual] = useState(false);
  const [flash, setFlash] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const today = dayKey();
  const due = errors.filter((e) => isDue(e, today)).sort((a, b) => a.nextReview.localeCompare(b.nextReview));
  const byType = countByType(errors);
  const units = Array.from(new Set([...nodes.map((n) => n.unit), ...errors.map((e) => e.unit)])).sort(cmp);
  const nodeIds = Array.from(
    new Set(errors.filter((e) => !filters.unit || e.unit === filters.unit).map((e) => e.node))
  ).sort(cmp);

  const filtered = errors
    .filter(
      (e) =>
        (!filters.unit || e.unit === filters.unit) &&
        (!filters.node || e.node === filters.node) &&
        (!filters.type || e.errorType === filters.type) &&
        (!filters.status || e.status === filters.status)
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function say(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(""), 2500);
  }

  async function copyMarkdown() {
    const md = errorsToMarkdown(filtered.length ? filtered : errors);
    try {
      await navigator.clipboard.writeText(md);
      say(`Copied ${filtered.length || errors.length} entries as markdown`);
    } catch {
      download(`error-book-${today}.md`, md, "text/markdown");
      say("Clipboard blocked — downloaded instead");
    }
  }

  function download(name: string, text: string, type: string) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onImport(file: File) {
    try {
      const res = importAll(JSON.parse(await file.text()));
      say(`Imported. Now ${res.errors} errors, ${res.attempts} attempts, ${res.blocks} blocks.`);
    } catch {
      say("Could not read that file");
    }
  }

  function update(next: ErrorEntry) {
    setErrors((prev) => prev.map((e) => (e.id === next.id ? next : e)));
  }

  function remove(id: string) {
    if (!window.confirm("Delete this entry?")) return;
    setErrors((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="sp-wrap">
      <PageHead title="Error book" kicker="错题本 · every miss, re-solved until clean">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="sp-btn" onClick={() => setShowManual((v) => !v)}>
            {showManual ? "Close" : "Manual entry"}
          </button>
          <button type="button" className="sp-btn sp-btn-ghost" onClick={copyMarkdown} disabled={!errors.length}>
            Copy as markdown
          </button>
          <button
            type="button"
            className="sp-btn sp-btn-ghost"
            onClick={() => download(`practice-backup-${today}.json`, JSON.stringify(exportAll(), null, 2), "application/json")}
          >
            Export JSON
          </button>
          <button type="button" className="sp-btn sp-btn-ghost" onClick={() => fileRef.current?.click()}>
            Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImport(f);
              e.target.value = "";
            }}
          />
        </div>
      </PageHead>

      {flash && <div className="mb-4 text-[13px] bg-[#111] text-white px-4 py-2 inline-block">{flash}</div>}

      {showManual && (
        <ManualEntry
          nodes={nodes}
          units={units}
          onSave={(e) => {
            setErrors((prev) => [...prev, e]);
            setShowManual(false);
            say("Logged");
          }}
        />
      )}

      <div className="sp-stat-grid grid-cols-2 md:grid-cols-4 mb-3">
        <Stat label="Due today" value={due.length} />
        <Stat label="Open" value={errors.filter((e) => e.status === "open").length} />
        <Stat label="Re-solving" value={errors.filter((e) => e.status === "re-solving").length} />
        <Stat label="Mastered" value={errors.filter((e) => e.status === "mastered").length} />
      </div>
      <div className="flex flex-wrap gap-2 mb-10">
        {ERROR_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilters((f) => ({ ...f, type: f.type === t ? "" : t }))}
            className={`sp-chip cursor-pointer ${filters.type === t ? "sp-chip-dark" : ""}`}
          >
            {t} · {byType[t]}
          </button>
        ))}
      </div>

      <section className="mb-12">
        <h2 className="sp-h2 border-b border-[#111] pb-2">Due today</h2>
        {!hydrated ? null : due.length === 0 ? (
          <p className="text-[13.5px] text-[#888] py-3">Nothing due. {errors.length ? "Come back tomorrow." : "Log misses from any test."}</p>
        ) : (
          <ul>
            {due.map((e) => (
              <DueRow key={e.id} e={e} onUpdate={update} />
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex flex-wrap items-center gap-2 border-b border-[#111] pb-2 mb-2">
          <h2 className="sp-h2 !mb-0 mr-auto">All entries · {filtered.length}</h2>
          <select className="sp-select" value={filters.unit} onChange={(e) => setFilters({ ...filters, unit: e.target.value, node: "" })}>
            <option value="">All units</option>
            {units.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          <select className="sp-select" value={filters.node} onChange={(e) => setFilters({ ...filters, node: e.target.value })}>
            <option value="">All nodes</option>
            {nodeIds.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
          <select className="sp-select" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All types</option>
            {ERROR_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select className="sp-select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        {filtered.length === 0 && hydrated && <p className="text-[13.5px] text-[#888] py-3">No entries.</p>}
        <div className="flex flex-col gap-4">
          {filtered.map((e) => (
            <EntryCard key={e.id} e={e} onUpdate={update} onDelete={() => remove(e.id)} />
          ))}
        </div>
      </section>
    </div>
  );
}

function DueRow({ e, onUpdate }: { e: ErrorEntry; onUpdate: (e: ErrorEntry) => void }) {
  const [open, setOpen] = useState(false);
  const overdue = e.nextReview < dayKey();
  return (
    <li className="border-b border-[#eee] py-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-semibold text-[13.5px] w-20 shrink-0">{e.questionId ?? e.node}</span>
        <span className="flex-1 min-w-[180px] text-[13px] text-[#555] line-clamp-2">
          {e.questionText || e.what || e.correct || "Manual entry"}
        </span>
        <span className="sp-chip">{e.errorType}</span>
        <span className={`text-[12px] ${overdue ? "text-[#e03e3e]" : "text-[#888]"}`}>
          {overdue ? `overdue · ${fmtDate(e.nextReview)}` : "today"} · streak {cleanStreak(e)}/3
        </span>
        {e.questionId ? (
          <Link
            href={`/practice/question/${encodeURIComponent(e.questionId)}?entry=${e.id}`}
            className="sp-btn sp-btn-sm"
          >
            Re-solve
          </Link>
        ) : (
          <button type="button" className="sp-btn sp-btn-sm" onClick={() => setOpen((v) => !v)}>
            {open ? "Hide" : "Re-solve"}
          </button>
        )}
      </div>
      {open && (
        <div className="mt-3 sp-reveal-box">
          <p className="text-[13px] text-[#555] mb-3">Recall the correct method from memory, then check:</p>
          {e.correct && <p className="text-[13.5px] mb-3 whitespace-pre-wrap">{e.correct}</p>}
          <div className="sp-judge-row max-w-[380px]">
            <button type="button" className="sp-judge-btn sp-judge-missed" onClick={() => onUpdate(applyReview(e, false))}>
              Not clean
            </button>
            <button type="button" className="sp-judge-btn" onClick={() => onUpdate(applyReview(e, true))}>
              Clean
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

function EntryCard({ e, onUpdate, onDelete }: { e: ErrorEntry; onUpdate: (e: ErrorEntry) => void; onDelete: () => void }) {
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState<ErrorFieldValues>(() => pick(e));
  const rows: [string, string][] = [
    ["What I did", e.what],
    ["Why it happened", e.why],
    ["Correct method", e.correct],
    ["How to avoid", e.avoid],
  ];
  const empty = rows.every(([, v]) => !v);

  return (
    <article className="sp-panel !p-5">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="font-semibold text-[14px] mr-1">{e.questionId ?? "Manual"}</span>
        <span className="sp-chip">{e.unit}</span>
        <span className="sp-chip">{e.node}</span>
        <span className="sp-chip">{e.errorType}</span>
        <span className={`sp-chip ${e.status === "mastered" ? "sp-chip-dark" : e.status === "open" ? "sp-chip-red" : ""}`}>
          {e.status}
        </span>
        <span className="text-[12px] text-[#888] ml-auto">
          {e.source}
          {e.scoreText ? ` · ${e.scoreText}` : ""} · logged {fmtDate(e.createdAt)}
          {e.status !== "mastered" && e.nextReview ? ` · next ${fmtDate(e.nextReview)}` : ""}
        </span>
      </div>
      {e.questionText && <p className="text-[13.5px] text-[#333] mb-3">{e.questionText}</p>}

      {editing ? (
        <>
          <ErrorFields value={fields} onChange={setFields} />
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              className="sp-btn sp-btn-sm"
              onClick={() => {
                onUpdate({ ...e, ...fields });
                setEditing(false);
              }}
            >
              Save
            </button>
            <button type="button" className="sp-btn sp-btn-ghost sp-btn-sm" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          {empty ? (
            <p className="text-[13px] text-[#e03e3e]">Not filled in yet — edit to write the diagnosis.</p>
          ) : (
            <dl className="grid md:grid-cols-2 gap-x-6 gap-y-3">
              {rows.map(([k, v]) =>
                v ? (
                  <div key={k}>
                    <dt className="sp-label">{k}</dt>
                    <dd className="text-[13.5px] text-[#111] whitespace-pre-wrap">{v}</dd>
                  </div>
                ) : null
              )}
            </dl>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <button
              type="button"
              className="sp-btn sp-btn-ghost sp-btn-sm"
              onClick={() => {
                setFields(pick(e));
                setEditing(true);
              }}
            >
              Edit
            </button>
            {e.questionId && (
              <Link
                href={`/practice/question/${encodeURIComponent(e.questionId)}?entry=${e.id}`}
                className="sp-btn sp-btn-ghost sp-btn-sm"
              >
                Re-solve now
              </Link>
            )}
            {e.status === "mastered" && (
              <button
                type="button"
                className="sp-btn sp-btn-ghost sp-btn-sm"
                onClick={() => onUpdate({ ...e, status: "re-solving", nextReview: dayKey() })}
              >
                Reopen
              </button>
            )}
            <span className="text-[12px] text-[#888]">
              {e.reviews.length} re-solve{e.reviews.length === 1 ? "" : "s"} ·{" "}
              {e.reviews.map((r) => (r.clean ? "✓" : "✗")).join(" ")}
            </span>
            <button type="button" className="sp-btn sp-btn-danger sp-btn-sm ml-auto" onClick={onDelete}>
              Delete
            </button>
          </div>
        </>
      )}
    </article>
  );
}

function ManualEntry({
  nodes,
  units,
  onSave,
}: {
  nodes: NodeOpt[];
  units: string[];
  onSave: (e: ErrorEntry) => void;
}) {
  const [unit, setUnit] = useState(units[0] ?? "");
  const [node, setNode] = useState("");
  const [prompt, setPrompt] = useState("");
  const [fields, setFields] = useState<ErrorFieldValues>(EMPTY_FIELDS);
  const unitNodes = nodes.filter((n) => n.unit === unit);

  return (
    <div className="sp-panel mb-8">
      <div className="sp-h2">Manual entry</div>
      <div className="flex flex-wrap gap-3 mb-4">
        <label>
          <div className="sp-label">Unit</div>
          <select className="sp-select" value={unit} onChange={(e) => { setUnit(e.target.value); setNode(""); }}>
            {units.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </label>
        <label>
          <div className="sp-label">Node</div>
          <select className="sp-select" value={node} onChange={(e) => setNode(e.target.value)}>
            <option value="">General ({unit})</option>
            {unitNodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.id} — {n.title.slice(0, 40)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex-1 min-w-[220px]">
          <div className="sp-label">Question / prompt</div>
          <input className="sp-input w-full" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="What were you asked, or what tripped you up?" />
        </label>
      </div>
      <ErrorFields value={fields} onChange={setFields} />
      <button
        type="button"
        className="sp-btn mt-4"
        disabled={!unit}
        onClick={() =>
          onSave(
            makeError({
              node: node || unit,
              unit,
              source: "manual",
              questionText: prompt || undefined,
              ...fields,
            })
          )
        }
      >
        Save entry
      </button>
    </div>
  );
}
