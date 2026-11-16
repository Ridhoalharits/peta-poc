"use client";

import { useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import { SearchX, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageTitle } from "@/components/shared/page-title";
import { PaginationBar } from "@/components/shared/pagination-bar";
import type { Talent } from "@/lib/data/talent-management";
import { paginate, sortRows } from "@/lib/table";
import { TALENT_TABLE_COLUMNS, talentSortValue } from "./talent-columns";
import { TalentActions, TalentToolbar } from "./talent-toolbar";

export type TalentListState = "empty" | "loading";

const DEFAULT_SORTING: SortingState = [{ id: "fullName", desc: false }];
const DEFAULT_PAGE_SIZE = 10;
const TITLE = "Talent Management";

interface TalentListProps {
  initialTalents: Talent[];
  /** Demo states from ?state= */
  state?: TalentListState;
}

export function TalentList({ initialTalents, state }: TalentListProps) {
  const [talents] = useState(initialTalents); // TM03 removes deleted rows from this.
  const [query, setQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  if (state === "empty") {
    return (
      <>
        <PageTitle title={TITLE} />
        <EmptyState
          variant="page"
          tone="brand"
          icon={Users}
          title="No talents yet"
          description="Add talents one at a time, or import many at once from a spreadsheet. Candidate searches match against this list."
          action={
            <div className="flex items-center gap-3">
              <TalentActions />
            </div>
          }
        />
      </>
    );
  }

  const trimmedQuery = query.trim();
  const hasFilters = trimmedQuery !== "";
  const changeQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const clearFilters = () => changeQuery("");
  const filtered = talents.filter((talent) => talent.fullName.toLowerCase().includes(trimmedQuery.toLowerCase()));
  const { pageRows, pageCount, from, to } = paginate(sortRows(filtered, sorting, talentSortValue), page, pageSize);
  const loading = state === "loading";
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
        tableClassName="w-max min-w-full"
        toolbar={<TalentToolbar query={query} onQueryChange={changeQuery} hasFilters={hasFilters} onClearFilters={clearFilters} />}
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
              onPageChange={setPage}
              summary={summary}
              pageSize={pageSize}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          )
        }
      />
    </>
  );
}
