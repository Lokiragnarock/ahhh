import { PageHead } from "@/components/PageHead";
import { TopNav } from "@/components/TopNav";
import { Duel } from "@/components/duel/Duel";

export default function DuelPage() {
  return (
    <main className="sp-page pt-12">
      <TopNav />
      <div className="max-w-[900px] mx-auto px-4 md:px-6 py-10">
        <PageHead title="Duel" sub="Who's actually studying." />
        <Duel />
      </div>
    </main>
  );
}
