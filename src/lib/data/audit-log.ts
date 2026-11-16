// Audit Log's only data entry point. Pages and components import from here, never from src/mocks/.
// In the data phase this becomes an API call.
import { AUDIT_ENTRIES, type AuditEntry } from "@/mocks/audit-log";

export { AUDIT_MODULES } from "@/mocks/audit-log";
export type { AuditEntry, AuditModule } from "@/mocks/audit-log";

export function listAuditEntries(): AuditEntry[] {
  return [...AUDIT_ENTRIES];
}
