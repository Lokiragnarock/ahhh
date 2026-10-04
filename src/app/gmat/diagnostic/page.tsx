import { PageHead } from "@/components/PageHead";
import { TopNav } from "@/components/TopNav";
import { DiagnosticSim } from "@/components/gmat/DiagnosticSim";
import { Notice } from "@/components/gmat/bits";
import { currentPlayer } from "@/lib/gmat/current";

export const dynamic = "force-dynamic";

export default async function DiagnosticPage() {
  const me = await currentPlayer();
  return (
    <main className="sp-page pt-12">
      <TopNav />
      <div className="max-w-[720px] mx-auto px-4 md:px-6 py-10">
        <PageHead title="Diagnostic" sub="Full-length adaptive sitting, 64 questions." />
        {me.state === "ok" ? (
          <DiagnosticSim />
        ) : me.state === "no-db" ? (
          <Notice>The database is not reachable from here, so a sitting could not be saved. Try again later.</Notice>
        ) : (
          <Notice>No player on this device yet. Switch to AHH, then tap GMAT to set your name.</Notice>
        )}
      </div>
    </main>
  );
}
