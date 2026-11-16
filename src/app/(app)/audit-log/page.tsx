import { Suspense } from "react";
import { PageMain } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { AuditLogList } from "@/components/audit-log/audit-log-list";
import { listAuditEntries } from "@/lib/data/audit-log";
import { param, type SearchParamsRecord } from "@/lib/demo";

async function AuditLogFromParams({ searchParams }: { searchParams: Promise<SearchParamsRecord> }) {
  const sp = await searchParams;
  return <AuditLogList entries={listAuditEntries()} openFilter={param(sp, "open") === "filter"} />;
}

export default function AuditLogPage({ searchParams }: PageProps<"/audit-log">) {
  return (
    <>
      <PageHeader items={[{ label: "Settings" }, { label: "Audit Log" }]} />
      <PageMain>
        {/* searchParams are only known per request; the prerendered shell shows the default list. */}
        <Suspense fallback={<AuditLogList entries={listAuditEntries()} />}>
          <AuditLogFromParams searchParams={searchParams} />
        </Suspense>
      </PageMain>
    </>
  );
}
