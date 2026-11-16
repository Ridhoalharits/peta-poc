import { Suspense } from "react";
import { PageMain } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { ToastOnMount } from "@/components/shared/toast-on-mount";
import { deletedToastDescription } from "@/components/talent-management/talent-count";
import { TalentList, type TalentListDemo, type TalentListState } from "@/components/talent-management/talent-list";
import { listTalents } from "@/lib/data/talent-management";
import { param, type SearchParamsRecord } from "@/lib/demo";

const DEMO_STATES: readonly TalentListState[] = ["empty", "loading"];
const DEMO_DELETED_COUNT = 3;

async function TalentListFromParams({ searchParams }: { searchParams: Promise<SearchParamsRecord> }) {
  const sp = await searchParams;
  const hidden = param(sp, "hide");
  const demo: TalentListDemo = {
    state: DEMO_STATES.find((demoState) => demoState === param(sp, "state")),
    preselect: Number(param(sp, "select")) || undefined,
    openDelete: param(sp, "open") === "delete",
    openFilter: param(sp, "open") === "filter",
    openColumns: param(sp, "open") === "columns",
  };
  const talents = listTalents().filter((talent) => talent.id !== hidden);

  return (
    <>
      <TalentList initialTalents={talents} demo={demo} />
      {param(sp, "toast") === "deleted" && (
        <ToastOnMount title="Talents deleted" description={deletedToastDescription(DEMO_DELETED_COUNT)} />
      )}
    </>
  );
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
