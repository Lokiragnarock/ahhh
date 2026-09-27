import { TopNav } from "@/components/TopNav";
import { Timeline } from "@/components/timeline/Timeline";

export const dynamic = "force-dynamic";

export default function TimelinePage() {
  return (
    <main className="sp-page">
      <TopNav />
      <Timeline />
    </main>
  );
}
