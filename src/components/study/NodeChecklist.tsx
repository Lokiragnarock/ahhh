"use client";

import { useState } from "react";

export interface ChecklistNode {
  id: string;
  label: string;
}

// Self-graded checklist of the map's nodes. No correctness checking, purely
// local state so the learner can mark off what they got right on their own
// drawing.
export function NodeChecklist({ nodes }: { nodes: ChecklistNode[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if (nodes.length === 0) {
    return <p className="sp-body-text">No nodes found in this map.</p>;
  }

  return (
    <ul className="sp-checklist">
      {nodes.map((node) => (
        <li key={node.id} className="sp-checklist-item">
          <label>
            <input
              type="checkbox"
              checked={Boolean(checked[node.id])}
              onChange={() => toggle(node.id)}
            />
            <span>{node.label}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
