import { Suspense } from "react";
import { PageMain } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { ToastOnMount } from "@/components/shared/toast-on-mount";
import { deletedToastDescription, importedToastDescription } from "@/components/talent-management/talent-count";
import { TALENT_DIALOGS } from "@/components/talent-management/talent-dialogs";
import { TalentList, type TalentListDemo, type TalentListState } from "@/components/talent-management/talent-list";
import { listTalents } from "@/lib/data/talent-management";
import { param, type SearchParamsRecord } from "@/lib/demo";

const DEMO_STATES: readonly TalentListState[] = ["empty", "loading"];
const DEMO_DELETED_COUNT = 3;
const DEMO_ADDED_NAME = "Citra Wijaya";

async function TalentListFromParams({ searchParams }: { searchParams: Promise<SearchParamsRecord> }) {
  const sp = await searchParams;
  const hidden = param(sp, "hide");
  const demo: TalentListDemo = {
    state: DEMO_STATES.find((demoState) => demoState === param(sp, "state")),
    preselect: Number(param(sp, "select")) || undefined,
    open: TALENT_DIALOGS.find((dialog) => dialog === param(sp, "open")),
  };
  const talents = listTalents().filter((talent) => talent.id !== hidden);
  const toast = param(sp, "toast");

  return (
    <>
      <TalentList initialTalents={talents} demo={demo} />
      {toast === "deleted" && (
        // ?hide= comes from deleting one talent on its profile (TM09).
        <ToastOnMount title="Talents deleted" description={deletedToastDescription(hidden ? 1 : DEMO_DELETED_COUNT)} />
      )}
      {toast === "added" && <ToastOnMount title="Talent added" description={`${DEMO_ADDED_NAME} was added to PETA.`} />}
      {toast === "imported" && <ToastOnMount title="Import finished" description={importedToastDescription()} />}
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
