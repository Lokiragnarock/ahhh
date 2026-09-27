import { TopNav } from "@/components/TopNav";
import { Duel } from "@/components/duel/Duel";

export default function DuelPage() {
  return (
    <main className="sp-page pt-12">
      <TopNav />
      <div className="max-w-[900px] mx-auto px-4 md:px-6 py-10">
        <h1 className="sp-h1 mb-2">Duel</h1>
        <p className="text-[14px] text-[#666] mb-8">Who&apos;s actually studying.</p>
        <Duel />
      </div>
    </main>
  );
}
