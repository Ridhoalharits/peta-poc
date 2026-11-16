import { PageMain } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { AuditLogList } from "@/components/audit-log/audit-log-list";
import { listAuditEntries } from "@/lib/data/audit-log";

export default function AuditLogPage() {
  return (
    <>
      <PageHeader items={[{ label: "Settings" }, { label: "Audit Log" }]} />
      <PageMain>
        <AuditLogList entries={listAuditEntries()} />
      </PageMain>
    </>
  );
}
