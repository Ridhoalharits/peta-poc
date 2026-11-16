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
import { toastInfo } from "@/lib/toast";
import { AUDIT_COLUMNS, auditSortValue } from "./audit-columns";

const DEFAULT_SORTING: SortingState = [{ id: "time", desc: true }];
const PAGE_SIZE = 10;

export function AuditLogList({ entries }: { entries: AuditEntry[] }) {
  const [query, setQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);
  const [page, setPage] = useState(1);

  const trimmedQuery = query.trim().toLowerCase();
  const changeQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const changeSorting = (next: SortingState) => {
    setSorting(next);
    setPage(1);
  };
  const clearFilters = () => changeQuery("");

  const filtered = entries.filter(
    (entry) => entry.user.toLowerCase().includes(trimmedQuery) || entry.action.toLowerCase().includes(trimmedQuery),
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
            <FilterButton count={0} onClick={() => toastInfo("Coming in a later step")} />
            {query.trim() !== "" && <ClearFiltersButton onClick={clearFilters} />}
          </>
        }
        emptyState={
          <EmptyState
            variant="inline"
            tone="neutral"
            icon={SearchX}
            title="No entries found"
            description={
              query.trim()
                ? `No entries match “${query.trim()}”. Try another user or action, or clear the filters.`
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
    </>
  );
}
