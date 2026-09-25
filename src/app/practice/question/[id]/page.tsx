import { TopNav } from "@/components/TopNav";
import { TestRunner } from "@/components/practice/TestRunner";
import { getQuestions } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function ResolvePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { entry?: string };
}) {
  const id = decodeURIComponent(params.id);
  const pool = (await getQuestions()).filter((q) => q.id === id);
  return (
    <main className="sp-page pt-12">
      <TopNav />
      <TestRunner pool={pool} kind="resolve" scope={id} resolveEntryId={searchParams.entry} />
    </main>
  );
}
