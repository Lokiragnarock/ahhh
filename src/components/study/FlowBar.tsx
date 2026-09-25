import Link from "next/link";
import type { TopicFlow } from "@/lib/flow";
import { miniHref, topicHref } from "@/lib/flow";

export type FlowStage = "note" | "focus" | "redraw" | "reveal" | "drill" | "mini";

// The per-topic loop as a breadcrumb: note → focus → redraw → reveal → drill → mini test.
export function FlowBar({ flow, current }: { flow: TopicFlow; current: FlowStage }) {
  const s = encodeURIComponent(flow.topic.slug);
  const steps: { id: FlowStage; label: string; href: string }[] = [
    { id: "note", label: "Note", href: topicHref(flow.topic) },
    { id: "focus", label: "Focus", href: `/focus/${s}` },
    { id: "redraw", label: "Redraw", href: `/redraw/${s}` },
    { id: "reveal", label: "Reveal", href: `/reveal/${s}` },
    { id: "drill", label: "Drill", href: `/drill/${s}` },
  ];
  if (flow.questionCount > 0) steps.push({ id: "mini", label: "Mini test", href: miniHref(flow.topic.id) });

  return (
    <div className="border-b border-[#e5e5e5] bg-white">
      <div className="max-w-[1100px] mx-auto px-4 h-11 flex items-center gap-4 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#111] shrink-0">{flow.topic.id}</span>
        {steps.map((st, i) => (
          <span key={st.id} className="flex items-center gap-4 shrink-0">
            {i > 0 && <span className="text-[#ccc]">›</span>}
            <Link
              href={st.href}
              className={`text-[11px] font-semibold uppercase tracking-[0.09em] ${
                st.id === current ? "text-[#111] underline underline-offset-4" : "text-[#888] hover:text-[#111]"
              }`}
            >
              {st.label}
            </Link>
          </span>
        ))}
        <Link
          href={flow.afterMini.href}
          className="ml-auto shrink-0 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#888] hover:text-[#111]"
        >
          {flow.afterMini.label}
        </Link>
      </div>
    </div>
  );
}
