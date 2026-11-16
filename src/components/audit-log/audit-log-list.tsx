"use client";

import { useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table/data-table";
import { ClearFiltersButton, ToolbarSearch } from "@/components/shared/data-table/table-toolbar";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterButton } from "@/components/shared/filter-button";
import { PageTitle } from "@/components/shared/page-title";
import { PaginationBar } from "@/components/shared/pagination-bar";
import type { AuditEntry } from "@/lib/data/audit-log";
import { paginate, sortRows } from "@/lib/table";
import { AUDIT_COLUMNS, auditSortValue } from "./audit-columns";
import { AuditFilterDialog } from "./audit-filter-dialog";
import { EMPTY_AUDIT_FILTERS, countAuditFilters, matchesAuditFilters, type AuditFilters } from "./audit-filters";

const DEFAULT_SORTING: SortingState = [{ id: "time", desc: true }];
const PAGE_SIZE = 10;

interface AuditLogListProps {
  entries: AuditEntry[];
  /** Demo: ?open=filter */
  openFilter?: boolean;
}

export function AuditLogList({ entries, openFilter = false }: AuditLogListProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<AuditFilters>(EMPTY_AUDIT_FILTERS);
  const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(openFilter);

  const trimmedQuery = query.trim();
  const activeFilterCount = countAuditFilters(filters);
  // Searching, filtering and sorting all go back to page 1.
  const changeQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const applyFilters = (next: AuditFilters) => {
    setFilters(next);
    setPage(1);
  };
  const changeSorting = (next: SortingState) => {
    setSorting(next);
    setPage(1);
  };
  const clearFilters = () => {
    changeQuery("");
    setFilters(EMPTY_AUDIT_FILTERS);
  };

  const needle = trimmedQuery.toLowerCase();
  const filtered = entries.filter(
    (entry) =>
      (entry.user.toLowerCase().includes(needle) || entry.action.toLowerCase().includes(needle)) &&
      matchesAuditFilters(entry, filters),
  );
  const { pageRows, pageCount, from, to } = paginate(sortRows(filtered, sorting, auditSortValue), page, PAGE_SIZE);
  const summary = filtered.length ? `Showing ${from}–${to} of ${filtered.length} entries` : "No entries to show";

  return (
    <>
      <PageTitle title="Audit Log" />
      <DataTable
        ariaLabel="Audit log entries"
        columns={AUDIT_COLUMNS}
        data={pageRows}
        sorting={sorting}
        onSortingChange={changeSorting}
        tableClassName="min-w-[900px]"
        toolbar={
          <>
            <ToolbarSearch value={query} onChange={changeQuery} placeholder="Search user or action…" ariaLabel="Search user or action" />
            <FilterButton count={activeFilterCount} onClick={() => setFilterOpen(true)} />
            {(trimmedQuery !== "" || activeFilterCount > 0) && <ClearFiltersButton onClick={clearFilters} />}
          </>
        }
        emptyState={
          <EmptyState
            variant="inline"
            tone="neutral"
            icon={SearchX}
            title="No entries found"
            description={
              trimmedQuery
                ? `No entries match “${trimmedQuery}”. Try another user or action, or clear the filters.`
                : "No entries match these filters. Try different filters or clear them."
            }
            action={
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        }
        footer={<PaginationBar page={page} pageCount={pageCount} onPageChange={setPage} summary={summary} />}
      />
      <AuditFilterDialog
        key={String(filterOpen)}
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onApply={applyFilters}
      />
    </>
  );
}
