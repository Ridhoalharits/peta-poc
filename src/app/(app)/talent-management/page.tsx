import { Suspense } from "react";
import { PageMain } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { TalentList, type TalentListState } from "@/components/talent-management/talent-list";
import { listTalents } from "@/lib/data/talent-management";
import { param, type SearchParamsRecord } from "@/lib/demo";

const DEMO_STATES: readonly TalentListState[] = ["empty", "loading"];

async function TalentListFromParams({ searchParams }: { searchParams: Promise<SearchParamsRecord> }) {
  const sp = await searchParams;
  const state = DEMO_STATES.find((demoState) => demoState === param(sp, "state"));
  return <TalentList initialTalents={listTalents()} state={state} />;
}

export default function TalentManagementPage({ searchParams }: PageProps<"/talent-management">) {
  return (
    <>
      <PageHeader items={[{ label: "Talent Management" }]} />
      <PageMain>
        {/* searchParams are only known per request; the prerendered shell shows the default list. */}
        <Suspense fallback={<TalentList initialTalents={listTalents()} />}>
          <TalentListFromParams searchParams={searchParams} />
        </Suspense>
      </PageMain>
    </>
  );
}
