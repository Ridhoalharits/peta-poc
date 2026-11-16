import type { AuditEntry } from "@/lib/data/audit-log";

/** Select value meaning "all modules". */
export const ALL_MODULES = "all";

export interface AuditFilters {
  user: string;
  module: string;
  from: string; // ISO date, "" = open
  to: string;
}

export const EMPTY_AUDIT_FILTERS: AuditFilters = { user: "", module: ALL_MODULES, from: "", to: "" };

/** User set = 1, module set = 1, either date set = 1. */
export function countAuditFilters(filters: AuditFilters): number {
  return (
    (filters.user.trim() ? 1 : 0) + (filters.module !== ALL_MODULES ? 1 : 0) + (filters.from || filters.to ? 1 : 0)
  );
}

/** Every set filter must match. Dates are inclusive and compared as ISO strings. */
export function matchesAuditFilters(entry: AuditEntry, filters: AuditFilters): boolean {
  const user = filters.user.trim().toLowerCase();
  return (
    (!user || entry.user.toLowerCase().includes(user)) &&
    (filters.module === ALL_MODULES || entry.module === filters.module) &&
    (!filters.from || entry.date >= filters.from) &&
    (!filters.to || entry.date <= filters.to)
  );
}
