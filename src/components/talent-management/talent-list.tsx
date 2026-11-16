"use client";

import { useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table/data-table";
import type { RowSelection } from "@/components/shared/data-table/selection-cells";
import { EmptyState } from "@/components/shared/empty-state";
import { PageTitle } from "@/components/shared/page-title";
import { PaginationBar } from "@/components/shared/pagination-bar";
import type { Talent } from "@/lib/data/talent-management";
import { paginate, sortRows } from "@/lib/table";
import { toastSuccess } from "@/lib/toast";
import { DeleteTalentsDialog } from "./delete-talents-dialog";
import { deletedToastDescription } from "./talent-count";
import { TALENT_TABLE_COLUMNS, talentSortValue } from "./talent-columns";
import { TalentEmpty } from "./talent-empty";
import { TalentToolbar } from "./talent-toolbar";

export type TalentListState = "empty" | "loading";

const DEFAULT_SORTING: SortingState = [{ id: "fullName", desc: false }];
const DEFAULT_PAGE_SIZE = 10;
const TITLE = "Talent Management";

/** Demo params: ?select=3 ticks the first rows of page 1, ?open=delete opens the confirm. */
export interface TalentListDemo {
  state?: TalentListState;
  preselect?: number;
  openDelete?: boolean;
}

function firstRowsSelection(talents: Talent[], count: number): RowSelection {
  const firstPage = sortRows(talents, DEFAULT_SORTING, talentSortValue).slice(0, count);
  return Object.fromEntries(firstPage.map((talent) => [talent.id, true]));
}

export function TalentList({ initialTalents, demo = {} }: { initialTalents: Talent[]; demo?: TalentListDemo }) {
  const [talents, setTalents] = useState(initialTalents);
  const [query, setQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selection, setSelection] = useState<RowSelection>(() => firstRowsSelection(initialTalents, demo.preselect ?? 0));
  const [deleteOpen, setDeleteOpen] = useState(Boolean(demo.openDelete && demo.preselect));

  if (demo.state === "empty") return <TalentEmpty title={TITLE} />;

  const selectedIds = Object.keys(selection);
  // Simple rule: the selection clears whenever the visible rows change (page, page size, search).
  const changeView = (apply: () => void) => {
    apply();
    setSelection({});
  };
  const changeQuery = (value: string) => changeView(() => {
    setQuery(value);
    setPage(1);
  });
  const clearFilters = () => changeQuery("");
  const deleteSelected = () => {
    setTalents((current) => current.filter((talent) => !selection[talent.id]));
    setSelection({});
    toastSuccess("Talents deleted", deletedToastDescription(selectedIds.length));
  };

  const trimmedQuery = query.trim();
  const filtered = talents.filter((talent) => talent.fullName.toLowerCase().includes(trimmedQuery.toLowerCase()));
  const { pageRows, pageCount, from, to } = paginate(sortRows(filtered, sorting, talentSortValue), page, pageSize);
  const loading = demo.state === "loading";
  const summary = filtered.length ? `Showing ${from}–${to} of ${filtered.length} talents` : "No talents to show";

  return (
    <>
      <PageTitle title={TITLE} />
      <DataTable
        ariaLabel="Talents"
        columns={TALENT_TABLE_COLUMNS}
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
            hasFilters={trimmedQuery !== ""}
            onClearFilters={clearFilters}
            selectedCount={selectedIds.length}
            onDeleteSelected={() => setDeleteOpen(true)}
          />
        }
        emptyState={
          <EmptyState
            variant="inline"
            tone="neutral"
            icon={SearchX}
            title="No talents found"
            description={
              trimmedQuery
                ? `No talents match “${trimmedQuery}”. Check the spelling or clear the filters.`
                : "No talents match these filters. Try different filters or clear them."
            }
            action={
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            }
            // Pinned to the visible part of the wide table: 100vw minus sidebar (256), page padding (80) and card border (2).
            className="sticky left-0 w-[calc(100vw-338px)]"
          />
        }
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
      <DeleteTalentsDialog open={deleteOpen} onOpenChange={setDeleteOpen} count={selectedIds.length} onConfirm={deleteSelected} />
    </>
  );
}
