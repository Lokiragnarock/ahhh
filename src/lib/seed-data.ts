import { CalendarEvent, TodoItem } from "./types";

export const SEED_EVENTS: CalendarEvent[] = [
  {
    id: "seed-evt-1",
    date: "2026-09-21",
    start: "19:00",
    end: "21:00",
    title: "Self-test: Units 1-2 MCQ bank (34Q) cold",
    tag: "Units 1-2",
  },
  {
    id: "seed-evt-2",
    date: "2026-09-21",
    start: "18:00",
    end: "18:15",
    title: "Send faculty Q: old vs new regime basis for salary/HP numericals",
    tag: "Action Item",
  },
  {
    id: "seed-evt-3",
    date: "2026-09-22",
    start: "19:00",
    end: "21:00",
    title: "Reconcile Day 1 error log + start Unit III-A notes (House Property §3.1-3.4)",
    tag: "Unit III-A",
  },
  {
    id: "seed-evt-4",
    date: "2026-09-23",
    start: "19:00",
    end: "21:00",
    title: "Finish Unit III-A (§3.5-3.9) + self-test, rework illustrations by hand",
    tag: "Unit III-A",
  },
  {
    id: "seed-evt-5",
    date: "2026-09-24",
    start: "19:00",
    end: "21:00",
    title: "Error log + discuss Unit III-A; build House Property recall note; start Unit III-B (PGBP §4.1-4.7)",
    tag: "Unit III-B",
  },
  {
    id: "seed-evt-6",
    date: "2026-09-25",
    start: "19:00",
    end: "21:00",
    title: "Finish Unit III-B (§4.8-4.13); self-test on Illustrations 13, 14, 22",
    tag: "Unit III-B",
  },
  {
    id: "seed-evt-7",
    date: "2026-09-26",
    start: "19:00",
    end: "21:00",
    title: "Error log + discuss Unit III-B; build PGBP recall note; start Capital Gains (§5.1-5.6)",
    tag: "Unit IV",
  },
  {
    id: "seed-evt-8",
    date: "2026-09-27",
    start: "19:00",
    end: "21:00",
    title: "Finish Capital Gains + full Income from Other Sources (§6.1-6.6) — entirely new material",
    tag: "Unit IV",
  },
  {
    id: "seed-evt-9",
    date: "2026-09-28",
    start: "19:00",
    end: "21:00",
    title: "Error log + discuss Capital Gains + Other Sources; build recall notes",
    tag: "Unit IV",
  },
  {
    id: "seed-evt-10",
    date: "2026-09-29",
    start: "19:00",
    end: "21:00",
    title: "Unit V Tax Computation (§7.1-7.5); finish the comprehensive illustration yourself",
    tag: "Unit V",
  },
  {
    id: "seed-evt-11",
    date: "2026-09-30",
    start: "19:00",
    end: "21:00",
    title: "Error log + discuss Unit V; build recall note; full mixed mock test across all units",
    tag: "Unit V",
  },
  {
    id: "seed-evt-12",
    date: "2026-10-01",
    start: "19:00",
    end: "21:00",
    title: "Final revision only: Part VI exam technique + Part VII master revision sheet; redrill weak spots, no new material",
    tag: "Revision",
  },
  {
    id: "seed-evt-13",
    date: "2026-10-02",
    start: "00:00",
    end: "23:59",
    title: "TAXATION LAW EXAM",
    tag: "Exam",
  },
];

export const SEED_TODOS: TodoItem[] = [
  {
    id: "seed-todo-1",
    text: "Send faculty: old vs new regime basis for salary/house-property numericals",
    done: false,
  },
  {
    id: "seed-todo-2",
    text: "Fix gratuity illustration §2.7 — POGA covered/not-covered formula mismatch",
    done: false,
  },
  {
    id: "seed-todo-3",
    text: "Fix Mr. Jay hotel RFA conveyance working §2.5.1 — 12,000-7,200 shown as 9,800",
    done: false,
  },
  {
    id: "seed-todo-4",
    text: "Fix Motor Car Illustration A §2.5.2 — ₹500/month employee recovery not deducted",
    done: false,
  },
  {
    id: "seed-todo-5",
    text: "Fix PF Illustration 2 §2.10 — turnover stated ₹20L but solution uses 1% of ₹80,00,000",
    done: false,
  },
  {
    id: "seed-todo-6",
    text: "Fix Pension (Varindar Singh) §2.8 — finish the final taxable figures, stops at 1/3 exemption",
    done: false,
  },
  {
    id: "seed-todo-7",
    text: "Fix Illustration 45 §2.12 — stated total and column sum differ by ₹6,000",
    done: false,
  },
  {
    id: "seed-todo-8",
    text: "Fix PGBP Illustration 22 §4.12 — stops after listing add-backs, no final answer",
    done: false,
  },
];

export const TODAY_ISO = "2026-09-21";
