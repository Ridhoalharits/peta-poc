import { createDataTableColumnHelper } from "@/components/shared/data-table/features";
import { SolidBadge } from "@/components/shared/solid-badge";
import type { AuditEntry } from "@/lib/data/audit-log";
import { formatDateTime } from "@/lib/format";

const helper = createDataTableColumnHelper<AuditEntry>();

/** AL-01 columns. Text columns sort ascending first; Timestamp starts newest first. */
export const AUDIT_COLUMNS = helper.columns([
  helper.accessor("user", {
    header: "User",
    cell: (info) => <span className="text-sm font-medium text-foreground">{info.getValue()}</span>,
    sortDescFirst: false,
    meta: { className: "w-[18%] min-w-[200px]" },
  }),
  helper.accessor("module", {
    header: "Module",
    cell: (info) => <SolidBadge tone="neutral">{info.getValue()}</SolidBadge>,
    sortDescFirst: false,
    meta: { className: "w-[17%] min-w-[190px]", skeleton: "badge" },
  }),
  helper.accessor("action", {
    header: "Action",
    cell: (info) => <span className="text-zinc-800">{info.getValue()}</span>,
    sortDescFirst: false,
    meta: { className: "min-w-[340px]" },
  }),
  helper.accessor("time", {
    header: "Timestamp",
    cell: (info) => <span className="tabular-nums">{formatDateTime(info.getValue())}</span>,
    sortDescFirst: true,
    meta: { width: 200 },
  }),
]);

/** Every column sorts by its own text; ISO times sort correctly as strings. */
export function auditSortValue(entry: AuditEntry, columnId: string): string {
  return String(entry[columnId as keyof AuditEntry]);
}
