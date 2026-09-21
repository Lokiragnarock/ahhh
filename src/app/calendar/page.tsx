"use client";

// The original month/week/day calendar + todo panel. Preserved here at
// /calendar since the app's root route ("/") is now the Territory screen —
// the study substrate replaced the planner, per the 02 - UI Spec and Build
// Brief. Nothing was deleted, just moved.

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { ViewToggle } from "@/components/ViewToggle";
import { MonthView } from "@/components/MonthView";
import { WeekView } from "@/components/WeekView";
import { DayView } from "@/components/DayView";
import { TodoPanel } from "@/components/TodoPanel";
import { EventPopover, PopoverState } from "@/components/EventPopover";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { SEED_EVENTS, SEED_TODOS, TODAY_ISO } from "@/lib/seed-data";
import { CalendarEvent, TodoItem, ViewMode } from "@/lib/types";
import { addDays, addMonths, monthLabel, startOfWeek } from "@/lib/date-utils";

export default function CalendarPage() {
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>(
    "study-planner:events",
    SEED_EVENTS
  );
  const [todos, setTodos] = useLocalStorage<TodoItem[]>("study-planner:todos", SEED_TODOS);

  const [view, setView] = useState<ViewMode>("month");
  const [viewDate, setViewDate] = useState<string>(TODAY_ISO);
  const [popover, setPopover] = useState<PopoverState | null>(null);

  const examCountdown = useMemo(() => {
    const exam = events.find((e) => e.tag === "Exam");
    if (!exam) return null;
    const msPerDay = 24 * 60 * 60 * 1000;
    const [ey, em, ed] = exam.date.split("-").map(Number);
    const [ty, tm, td] = TODAY_ISO.split("-").map(Number);
    const diff = Math.round(
      (Date.UTC(ey, em - 1, ed) - Date.UTC(ty, tm - 1, td)) / msPerDay
    );
    return diff;
  }, [events]);

  function navigate(delta: number) {
    if (view === "month") setViewDate((d) => addMonths(d, delta));
    else if (view === "week") setViewDate((d) => addDays(d, delta * 7));
    else setViewDate((d) => addDays(d, delta));
  }

  function goToday() {
    setViewDate(TODAY_ISO);
  }

  function openCreate(dateIso: string) {
    setPopover({ mode: "create", date: dateIso });
  }

  function openEdit(event: CalendarEvent) {
    setPopover({ mode: "edit", date: event.date, event });
  }

  function saveEvent(event: CalendarEvent) {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === event.id);
      return exists ? prev.map((e) => (e.id === event.id ? event : e)) : [...prev, event];
    });
    setPopover(null);
  }

  function deleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setPopover(null);
  }

  function toggleTodo(id: string) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function addTodo(text: string) {
    setTodos((prev) => [
      ...prev,
      { id: `todo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, text, done: false },
    ]);
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <main className="w-full pt-14 bg-background min-h-screen">
      <TopNav />

      <section className="w-full bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-gutter py-space-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-md mb-space-md">
            <div className="space-y-space-xs">
              <p className="font-label-md text-label-md text-on-surface-variant">
                {monthLabel(viewDate)} • Taxation Law exam prep
              </p>
              <p className="font-body-sm text-body-sm text-outline">
                Academic sprint & exam preparation canvas
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-space-sm">
              <span className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm">
                📋 {todos.filter((t) => !t.done).length} open tasks
              </span>
              <span className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm">
                📅 {events.length} scheduled blocks
              </span>
              {examCountdown !== null && (
                <span className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm">
                  ⏳ Exam in {examCountdown} day{examCountdown === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto px-gutter py-space-lg">
        <div className="flex flex-col w-full gap-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-sm">
            <div className="flex items-center gap-space-md">
              <button
                type="button"
                onClick={goToday}
                className="px-space-sm py-1 rounded font-label-sm text-label-sm text-on-surface bg-surface-container-low hover:bg-surface-container-high transition-all"
              >
                Today
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-space-sm">
              <ViewToggle value={view} onChange={setView} />
              {view !== "day" && (
                <button
                  type="button"
                  onClick={() => openCreate(viewDate)}
                  className="flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-primary-container hover:bg-tertiary-container text-on-primary font-label-sm text-label-sm shadow-sm transition-transform active:scale-95"
                >
                  <Plus size={16} />
                  <span>New Study Block</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            <div className="lg:col-span-8">
              {view === "month" && (
                <MonthView
                  viewDate={viewDate}
                  todayIso={TODAY_ISO}
                  events={events}
                  onNavigate={navigate}
                  onDayClick={openCreate}
                  onEventClick={openEdit}
                />
              )}
              {view === "week" && (
                <WeekView
                  weekStartIso={startOfWeek(viewDate)}
                  todayIso={TODAY_ISO}
                  events={events}
                  onNavigate={navigate}
                  onDayClick={openCreate}
                  onEventClick={openEdit}
                />
              )}
              {view === "day" && (
                <DayView
                  dateIso={viewDate}
                  todayIso={TODAY_ISO}
                  events={events}
                  onNavigate={navigate}
                  onEventClick={openEdit}
                  onAddClick={() => openCreate(viewDate)}
                />
              )}
            </div>

            <div className="lg:col-span-4 flex flex-col gap-space-md">
              <TodoPanel
                title="Study Tasks & Deadlines"
                todos={todos}
                onToggle={toggleTodo}
                onAdd={addTodo}
                onDelete={deleteTodo}
              />
            </div>
          </div>
        </div>
      </div>

      {popover && (
        <EventPopover
          state={popover}
          onClose={() => setPopover(null)}
          onSave={saveEvent}
          onDelete={deleteEvent}
        />
      )}
    </main>
  );
}
