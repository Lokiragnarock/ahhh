"use client";

import { useRouter } from "next/navigation";
import { squarify } from "@/lib/treemap";
import { STATE_FILL, TopicNode, UnitGroup } from "@/lib/study-types";

// Virtual coordinate space the layout is computed in. Rects are converted to
// percentages so the whole thing scales responsively without recomputation.
const VW = 1000;
const VH = 560;
const UNIT_LABEL_H = 22; // room for the 10.5px uppercase unit label strip
const GUTTER = 3;

export function Treemap({ units }: { units: UnitGroup[] }) {
  const router = useRouter();

  const unitRects = squarify(
    units.map((u) => ({ id: u.id, value: u.minutes })),
    0,
    0,
    VW,
    VH
  );

  return (
    <div
      className="relative w-full border border-[#e9e9e9] bg-white"
      style={{ aspectRatio: `${VW} / ${VH}` }}
    >
      {unitRects.map((ur) => {
        const unit = units.find((u) => u.id === ur.item.id)!;
        const innerX = ur.x + GUTTER;
        const innerY = ur.y + UNIT_LABEL_H;
        const innerW = Math.max(ur.w - GUTTER * 2, 0);
        const innerH = Math.max(ur.h - UNIT_LABEL_H - GUTTER, 0);

        const topicRects = squarify(
          unit.topics.map((t) => ({ id: t.slug, value: t.minutes })),
          innerX,
          innerY,
          innerW,
          innerH
        );

        return (
          <div key={unit.id}>
            {/* Unit container outline + label */}
            <div
              className="absolute border border-[#d8d8d8]"
              style={{
                left: `${(ur.x / VW) * 100}%`,
                top: `${(ur.y / VH) * 100}%`,
                width: `${(ur.w / VW) * 100}%`,
                height: `${(ur.h / VH) * 100}%`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 flex items-center px-2 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#888] border-b border-[#e9e9e9]"
                style={{ height: UNIT_LABEL_H }}
              >
                {unit.label}
              </div>
            </div>

            {topicRects.map((tr) => {
              const topic = unit.topics.find((t) => t.slug === tr.item.id)!;
              return <TopicRect key={topic.slug} topic={topic} rect={tr} onOpen={() => router.push(`/topic/${encodeURIComponent(topic.slug)}`)} />;
            })}
          </div>
        );
      })}
    </div>
  );
}

function TopicRect({
  topic,
  rect,
  onOpen,
}: {
  topic: TopicNode;
  rect: { x: number; y: number; w: number; h: number };
  onOpen: () => void;
}) {
  const fill = STATE_FILL[topic.state];
  const fullyInked = topic.state === "drilled";
  const tiny = rect.w < (VW / 1000) * 55 || rect.h < 26;

  return (
    <button
      type="button"
      onClick={onOpen}
      title={`${topic.id} · ${topic.title} · ${topic.minutes} min · ${topic.state}`}
      className="absolute overflow-hidden border border-white bg-[#f2f2f0] text-left cursor-pointer"
      style={{
        left: `${(rect.x / VW) * 100}%`,
        top: `${(rect.y / VH) * 100}%`,
        width: `${(rect.w / VW) * 100}%`,
        height: `${(rect.h / VH) * 100}%`,
      }}
    >
      {/* Bottom-up fill, one ink, four heights */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-[#111]"
        style={{ height: `${fill * 100}%` }}
      />
      {!tiny && (
        <div
          className={`relative h-full w-full p-2 flex flex-col justify-end gap-0.5 ${
            fullyInked ? "text-white" : "text-[#111]"
          }`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.04em] opacity-80">
            {topic.id}
            {topic.examFocus ? " ★" : ""}
          </span>
          <span className="text-[11.5px] font-medium leading-tight line-clamp-2">
            {topic.title}
          </span>
        </div>
      )}
    </button>
  );
}
