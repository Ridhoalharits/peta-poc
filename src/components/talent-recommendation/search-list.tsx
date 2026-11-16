"use client";

import { useState } from "react";
import Link from "next/link";
import type { SortingState } from "@tanstack/react-table";
import { Plus, SearchX, UserSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table/data-table";
import { ClearFiltersButton, ToolbarSearch, ToolbarSelect } from "@/components/shared/data-table/table-toolbar";
import { EmptyState } from "@/components/shared/empty-state";
import { PageTitle } from "@/components/shared/page-title";
import { MANAGEMENT_LEVELS } from "@/lib/constants";
import {
  STATUS_LABEL,
  STATUS_SORT_ORDER,
  type CandidateSearch,
  type SearchStatus,
} from "@/lib/data/talent-recommendation";
import { sortRows } from "@/lib/table";
import { SEARCH_COLUMNS } from "./search-columns";

export type SearchListState = "empty" | "loading";

const NEW_SEARCH_HREF = "/talent-recommendation/new";
const ALL = "all";
const DEFAULT_SORTING: SortingState = [{ id: "createdAt", desc: true }];
const LEVEL_OPTIONS = [
  { value: ALL, label: "All levels" },
  ...MANAGEMENT_LEVELS.map((level) => ({ value: level, label: level })),
];
const STATUS_OPTIONS = [
  { value: ALL, label: "All statuses" },
  ...(Object.keys(STATUS_LABEL) as SearchStatus[]).map((status) => ({ value: status, label: STATUS_LABEL[status] })),
];

/** What each sortable column sorts by. ISO dates sort correctly as strings. */
function sortValue(search: CandidateSearch, columnId: string): string | number {
  if (columnId === "level") return MANAGEMENT_LEVELS.indexOf(search.level);
  if (columnId === "status") return STATUS_SORT_ORDER[search.status];
  if (columnId === "createdAt") return search.createdAt;
  return search.position;
}

function NewSearchButton() {
  return (
    <Button asChild>
      <Link href={NEW_SEARCH_HREF}>
        <Plus aria-hidden />
        New Candidate Search
      </Link>
    </Button>
  );
}

function EmptyList() {
  return (
    <>
      <PageTitle title="Talent Recommendation" />
      <EmptyState
        variant="page"
        tone="brand"
        icon={UserSearch}
        title="No candidate searches yet"
        description="Create a candidate search for a vacant position, and PETA will recommend matching talents."
        action={<NewSearchButton />}
      />
    </>
  );
}

interface SearchListProps {
  searches: CandidateSearch[];
  /** Demo states from ?state= */
  state?: SearchListState;
}

export function SearchList({ searches, state }: SearchListProps) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);

  if (state === "empty") return <EmptyList />;

  const trimmedQuery = query.trim();
  const hasFilters = trimmedQuery !== "" || level !== ALL || status !== ALL;
  const clearFilters = () => {
    setQuery("");
    setLevel(ALL);
    setStatus(ALL);
  };
  const filtered = searches.filter(
    (search) =>
      search.position.toLowerCase().includes(trimmedQuery.toLowerCase()) &&
      (level === ALL || search.level === level) &&
      (status === ALL || search.status === status),
  );
  const rows = sortRows(filtered, sorting, sortValue);
  const loading = state === "loading";

  return (
    <>
      <PageTitle title="Talent Recommendation" actions={<NewSearchButton />} />
      <DataTable
        ariaLabel="Candidate searches"
        columns={SEARCH_COLUMNS}
        data={rows}
        loading={loading}
        sorting={sorting}
        onSortingChange={setSorting}
        toolbar={
          <>
            <ToolbarSearch value={query} onChange={setQuery} placeholder="Search vacant position…" ariaLabel="Search vacant position" />
            <ToolbarSelect value={level} onChange={setLevel} options={LEVEL_OPTIONS} ariaLabel="Management Level" width={200} />
            <ToolbarSelect value={status} onChange={setStatus} options={STATUS_OPTIONS} ariaLabel="Status" width={180} />
            {hasFilters && <ClearFiltersButton onClick={clearFilters} />}
          </>
        }
        emptyState={
          <EmptyState
            variant="inline"
            tone="neutral"
            icon={SearchX}
            title="No candidate searches found"
            description={
              trimmedQuery
                ? `No searches match “${trimmedQuery}”. Try another position name or clear the filters.`
                : "No searches match these filters. Try different filters or clear them."
            }
            action={
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        }
        footer={loading ? "Loading candidate searches…" : `Showing ${rows.length} of ${searches.length} candidate searches`}
      />
    </>
  );
}
