import { TopNav } from "@/components/TopNav";
import { Timeline } from "@/components/timeline/Timeline";
import { listSubjects } from "@/lib/vault";

export const dynamic = "force-dynamic";

// Common to both tracks: no track arg, so every subject is listed.
export default async function TimelinePage() {
  const subjects = await listSubjects();
  return (
    <main className="sp-page">
      <TopNav />
      <Timeline subjects={subjects} />
    </main>
  );
}
