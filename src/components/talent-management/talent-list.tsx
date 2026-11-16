"use client";

import { useMemo, useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table/data-table";
import type { RowSelection } from "@/components/shared/data-table/selection-cells";
import { PageTitle } from "@/components/shared/page-title";
import { PaginationBar } from "@/components/shared/pagination-bar";
import type { Talent, TalentColumnKey } from "@/lib/data/talent-management";
import { paginate, sortRows } from "@/lib/table";
import { toastSuccess } from "@/lib/toast";
import { TALENT_TABLE_COLUMNS, talentSortValue } from "./talent-columns";
import { deletedToastDescription } from "./talent-count";
import { TalentEmpty, TalentNoMatch } from "./talent-empty";
import { EMPTY_FILTERS, countActiveFilters, matchesFilters, type TalentFilters } from "./talent-filters";
import type { TalentDialog } from "./talent-dialogs";
import { TalentListDialogs } from "./talent-list-dialogs";
import { TalentToolbar } from "./talent-toolbar";
import { ALL_COLUMN_KEYS } from "./view-settings-dialog";

export type TalentListState = "empty" | "loading";

const DEFAULT_SORTING: SortingState = [{ id: "fullName", desc: false }];
const DEFAULT_PAGE_SIZE = 10;
const TITLE = "Talent Management";

/** Demo params: ?state, ?select=3 (ticks the first rows of page 1), ?open={dialog}. */
export interface TalentListDemo {
  state?: TalentListState;
  preselect?: number;
  open?: TalentDialog;
}

function firstRowsSelection(talents: Talent[], count: number): RowSelection {
  const firstPage = sortRows(talents, DEFAULT_SORTING, talentSortValue).slice(0, count);
  return Object.fromEntries(firstPage.map((talent) => [talent.id, true]));
}

export function TalentList({ initialTalents, demo = {} }: { initialTalents: Talent[]; demo?: TalentListDemo }) {
  const [talents, setTalents] = useState(initialTalents);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<TalentFilters>(EMPTY_FILTERS);
  const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selection, setSelection] = useState<RowSelection>(() => firstRowsSelection(initialTalents, demo.preselect ?? 0));
  const [visibleColumns, setVisibleColumns] = useState<TalentColumnKey[]>(ALL_COLUMN_KEYS);
  const [openDialog, setOpenDialog] = useState<TalentDialog | null>(demo.open ?? null);
  const tableColumns = useMemo(
    () => TALENT_TABLE_COLUMNS.filter((column) => visibleColumns.includes(column.id as TalentColumnKey)),
    [visibleColumns],
  );

  if (demo.state === "empty") return <TalentEmpty title={TITLE} onOpen={setOpenDialog} />;

  const selectedCount = Object.keys(selection).length;
  // Simple rule: the selection clears whenever the visible rows change (page, page size, search, filters).
  const changeView = (apply: () => void) => {
    apply();
    setSelection({});
  };
  const changeQuery = (value: string) => changeView(() => {
    setQuery(value);
    setPage(1);
  });
  const applyFilters = (next: TalentFilters) => changeView(() => {
    setFilters(next);
    setPage(1);
  });
  const clearFilters = () => changeView(() => {
    setQuery("");
    setFilters(EMPTY_FILTERS);
    setPage(1);
  });
  // A hidden column can't stay sorted: fall back to Full Name ascending.
  const applyColumns = (next: TalentColumnKey[]) => {
    setVisibleColumns(next);
    if (!sorting.every((sort) => next.includes(sort.id as TalentColumnKey))) setSorting(DEFAULT_SORTING);
  };
  const deleteSelected = () => {
    setTalents((current) => current.filter((talent) => !selection[talent.id]));
    setSelection({});
    toastSuccess("Talents deleted", deletedToastDescription(selectedCount));
  };

  const trimmedQuery = query.trim();
  const activeFilterCount = countActiveFilters(filters);
  const filtered = talents.filter(
    (talent) => talent.fullName.toLowerCase().includes(trimmedQuery.toLowerCase()) && matchesFilters(talent, filters),
  );
  const { pageRows, pageCount, from, to } = paginate(sortRows(filtered, sorting, talentSortValue), page, pageSize);
  const loading = demo.state === "loading";
  const summary = filtered.length ? `Showing ${from}–${to} of ${filtered.length} talents` : "No talents to show";

  return (
    <>
      <PageTitle title={TITLE} />
      <DataTable
        ariaLabel="Talents"
        columns={tableColumns}
        data={pageRows}
        loading={loading}
        skeletonRows={DEFAULT_PAGE_SIZE}
        sorting={sorting}
        onSortingChange={setSorting}
        rowSelection={selection}
        onRowSelectionChange={setSelection}
        getRowId={(talent) => talent.id}
        getRowLabel={(talent) => talent.fullName}
        tableClassName="w-max min-w-full"
        toolbar={
          <TalentToolbar
            query={query}
            onQueryChange={changeQuery}
            hasFilters={trimmedQuery !== "" || activeFilterCount > 0}
            onClearFilters={clearFilters}
            selectedCount={selectedCount}
            activeFilterCount={activeFilterCount}
            onOpen={setOpenDialog}
          />
        }
        emptyState={<TalentNoMatch query={trimmedQuery} onClearFilters={clearFilters} />}
        footer={
          loading ? (
            "Loading talents…"
          ) : (
            <PaginationBar
              page={page}
              pageCount={pageCount}
              onPageChange={(next) => changeView(() => setPage(next))}
              summary={summary}
              pageSize={pageSize}
              onPageSizeChange={(size) => changeView(() => {
                setPageSize(size);
                setPage(1);
              })}
            />
          )
        }
      />
      <TalentListDialogs
        open={openDialog}
        onOpenChange={setOpenDialog}
        filters={filters}
        onApplyFilters={applyFilters}
        visibleColumns={visibleColumns}
        onApplyColumns={applyColumns}
        selectedCount={selectedCount}
        onConfirmDelete={deleteSelected}
      />
    </>
  );
}
