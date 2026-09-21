"use client";

import { useState } from "react";
import { Check, ListPlus, X } from "lucide-react";
import { TodoItem } from "@/lib/types";

export function TodoPanel({
  title = "To-Dos",
  todos,
  onToggle,
  onAdd,
  onDelete,
}: {
  title?: string;
  todos: TodoItem[];
  onToggle: (id: string) => void;
  onAdd: (text: string) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const doneCount = todos.filter((t) => t.done).length;

  function submit() {
    const text = draft.trim();
    if (!text) return;
    onAdd(text);
    setDraft("");
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">{title}</h2>
        <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
          {doneCount} / {todos.length} done
        </span>
      </div>

      <div className="flex items-center gap-space-xs px-2.5 py-1.5 rounded-lg bg-surface-container-low focus-within:bg-surface-container-lowest focus-within:ring-1 focus-within:ring-primary-container transition-all">
        <ListPlus size={18} className="text-outline" />
        <input
          className="w-full bg-transparent outline-none font-body-sm text-body-sm text-on-surface placeholder:text-outline"
          placeholder="Add a task... (press Enter)"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
      </div>

      <div className="flex flex-col gap-1 max-h-[420px] overflow-y-auto">
        {todos.length === 0 && (
          <p className="font-body-sm text-body-sm text-outline px-1.5 py-2">
            No tasks yet.
          </p>
        )}
        {todos.map((todo) => (
          <label
            key={todo.id}
            className="group flex items-start gap-space-sm p-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer select-none"
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={todo.done}
              onChange={() => onToggle(todo.id)}
            />
            <div
              className={
                "w-4 h-4 rounded-[3px] flex items-center justify-center shrink-0 mt-0.5 transition-colors " +
                (todo.done
                  ? "bg-primary-container border-2 border-primary-container"
                  : "bg-transparent border-2 border-outline group-hover:border-primary")
              }
            >
              {todo.done && <Check size={12} strokeWidth={3} className="text-on-primary-container" />}
            </div>
            <span
              className={
                "font-body-md text-body-md flex-1 transition-colors " +
                (todo.done ? "text-outline line-through" : "text-on-surface")
              }
            >
              {todo.text}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onDelete(todo.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-on-surface-variant hover:text-error transition-opacity shrink-0"
              aria-label="Delete task"
            >
              <X size={15} />
            </button>
          </label>
        ))}
      </div>
    </div>
  );
}
