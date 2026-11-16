"use client";

import { useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DataTable } from "@/components/shared/data-table/data-table";
import { createDataTableColumnHelper } from "@/components/shared/data-table/features";
import { ClearFiltersButton, ToolbarSearch, ToolbarSelect } from "@/components/shared/data-table/table-toolbar";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { LOCATIONS, MANAGEMENT_LEVELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { paginate, sortRows } from "@/lib/table";
import type { ManagementLevel } from "@/lib/types";

interface DemoRow {
  id: string;
  name: string;
  level: ManagementLevel;
  location: string;
  joinedAt: string;
}

const DEMO_ROW_COUNT = 23;
// Deterministic fake rows (no Math.random): cycle through the shared constants.
const DEMO_ROWS: DemoRow[] = Array.from({ length: DEMO_ROW_COUNT }, (_, index) => ({
  id: `d-${index + 1}`,
  name: `Demo Employee ${String(index + 1).padStart(2, "0")}`,
  level: MANAGEMENT_LEVELS[index % MANAGEMENT_LEVELS.length],
  location: LOCATIONS[(index * 3) % LOCATIONS.length],
  joinedAt: `20${String(15 + (index % 11)).padStart(2, "0")}-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 27) + 1).padStart(2, "0")}`,
}));

const ALL = "all";
const LEVEL_OPTIONS = [{ value: ALL, label: "All levels" }, ...MANAGEMENT_LEVELS.map((level) => ({ value: level, label: level }))];
const LOCATION_OPTIONS = [{ value: ALL, label: "All locations" }, ...LOCATIONS.map((location) => ({ value: location, label: location }))];

const helper = createDataTableColumnHelper<DemoRow>();
const COLUMNS = helper.columns([
  helper.accessor("name", {
    header: "Name",
    cell: (info) => <span className="text-sm font-medium text-foreground">{info.getValue()}</span>,
    meta: { className: "w-[34%]" },
  }),
  helper.accessor("level", { header: "Management Level" }),
  helper.accessor("location", { header: "Location" }),
  helper.accessor("joinedAt", { header: "Joined", cell: (info) => formatDate(info.getValue()) }),
]);

function sortValue(row: DemoRow, columnId: string): string | number {
  if (columnId === "level") return MANAGEMENT_LEVELS.indexOf(row.level);
  return row[columnId as keyof DemoRow];
}

export function TableDemo() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState(ALL);
  const [location, setLocation] = useState(ALL);
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const hasFilters = query !== "" || level !== ALL || location !== ALL;
  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };
  const clearFilters = () => {
    setQuery("");
    setLevel(ALL);
    setLocation(ALL);
    setPage(1);
  };
  const filtered = DEMO_ROWS.filter(
    (row) =>
      row.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (level === ALL || row.level === level) &&
      (location === ALL || row.location === location),
  );
  const { pageRows, pageCount, from, to } = paginate(sortRows(filtered, sorting, sortValue), page, pageSize);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="dc-table-loading" checked={loading} onCheckedChange={setLoading} />
        <Label htmlFor="dc-table-loading">Loading state</Label>
      </div>
      <DataTable
        ariaLabel="Demo employees"
        columns={COLUMNS}
        data={pageRows}
        loading={loading}
        sorting={sorting}
        onSortingChange={setSorting}
        toolbar={
          <>
            <ToolbarSearch value={query} onChange={resetPage(setQuery)} placeholder="Search name…" ariaLabel="Search name" />
            <ToolbarSelect value={level} onChange={resetPage(setLevel)} options={LEVEL_OPTIONS} ariaLabel="Management Level" width={200} />
            <ToolbarSelect value={location} onChange={resetPage(setLocation)} options={LOCATION_OPTIONS} ariaLabel="Location" width={180} />
            {hasFilters && <ClearFiltersButton onClick={clearFilters} />}
          </>
        }
        emptyState={
          <EmptyState
            variant="inline"
            tone="neutral"
            icon={SearchX}
            title="No employees found"
            description="No rows match these filters."
            action={<Button variant="outline" onClick={clearFilters}>Clear filters</Button>}
          />
        }
        footer={
          <PaginationBar
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
            summary={`Showing ${from}–${to} of ${filtered.length} entries`}
            pageSize={pageSize}
            onPageSizeChange={resetPage(setPageSize)}
          />
        }
      />
    </div>
  );
}
