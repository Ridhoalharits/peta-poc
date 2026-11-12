"use client";

import { useState } from "react";
import { ChevronRight, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DataTable } from "@/components/shared/data-table/data-table";
import { createDataTableColumnHelper } from "@/components/shared/data-table/features";
import { ClearFiltersButton, ToolbarSearch, ToolbarSelect } from "@/components/shared/data-table/table-toolbar";
import { EmptyState } from "@/components/shared/empty-state";
import { IconButton } from "@/components/shared/icon-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { MANAGEMENT_LEVELS, STATUS_LABEL, STATUS_SORT_ORDER } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { ManagementLevel, SearchStatus } from "@/lib/types";

interface DemoRow {
  id: string;
  position: string;
  level: ManagementLevel;
  createdAt: string;
  status: SearchStatus;
}

const DEMO_ROWS: DemoRow[] = [
  { id: "d-1", position: "Finance Analyst", level: "Officer", createdAt: "2026-10-20", status: "completed" },
  { id: "d-2", position: "Plant Manager", level: "Manager", createdAt: "2026-09-02", status: "searching" },
  { id: "d-3", position: "Brand Supervisor", level: "Supervisor", createdAt: "2026-10-05", status: "draft" },
  { id: "d-4", position: "HR Business Partner", level: "Senior Manager", createdAt: "2026-08-14", status: "failed" },
  { id: "d-5", position: "Lab Technician", level: "Officer", createdAt: "2026-09-25", status: "completed" },
];

const ALL = "all";
const LEVEL_OPTIONS = [{ value: ALL, label: "All levels" }, ...MANAGEMENT_LEVELS.map((level) => ({ value: level, label: level }))];
const STATUS_OPTIONS = [
  { value: ALL, label: "All statuses" },
  ...(Object.keys(STATUS_LABEL) as SearchStatus[]).map((status) => ({ value: status, label: STATUS_LABEL[status] })),
];

const helper = createDataTableColumnHelper<DemoRow>();
const COLUMNS = helper.columns([
  helper.accessor("position", {
    header: "Vacant Position",
    cell: (info) => <span className="text-sm font-medium text-foreground">{info.getValue()}</span>,
    meta: { className: "w-[38%]" },
  }),
  helper.accessor("level", {
    header: "Management Level",
    sortFn: (rowA, rowB) => MANAGEMENT_LEVELS.indexOf(rowA.original.level) - MANAGEMENT_LEVELS.indexOf(rowB.original.level),
  }),
  helper.accessor("createdAt", {
    header: "Created",
    cell: (info) => formatDate(info.getValue()),
  }),
  helper.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />,
    sortFn: (rowA, rowB) => STATUS_SORT_ORDER[rowA.original.status] - STATUS_SORT_ORDER[rowB.original.status],
    meta: { skeleton: "badge" },
  }),
  helper.display({
    id: "open",
    header: () => <span className="sr-only">Open</span>,
    cell: (info) => (
      <IconButton label={`Open ${info.row.original.position}`} icon={ChevronRight} size="icon-sm" />
    ),
    enableSorting: false,
    meta: { className: "w-14", align: "right", skeleton: "none" },
  }),
]);

export function TableDemo() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [loading, setLoading] = useState(false);
  const [narrow, setNarrow] = useState(false);

  const hasFilters = query !== "" || level !== ALL || status !== ALL;
  const clearFilters = () => {
    setQuery("");
    setLevel(ALL);
    setStatus(ALL);
  };
  const rows = DEMO_ROWS.filter(
    (row) =>
      row.position.toLowerCase().includes(query.trim().toLowerCase()) &&
      (level === ALL || row.level === level) &&
      (status === ALL || row.status === status),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <Switch id="demo-loading" checked={loading} onCheckedChange={setLoading} />
          <Label htmlFor="demo-loading">Loading state</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="demo-narrow" checked={narrow} onCheckedChange={setNarrow} />
          <Label htmlFor="demo-narrow">Narrow container (horizontal scroll)</Label>
        </div>
      </div>
      <div className={narrow ? "max-w-[520px]" : undefined}>
        <DataTable
          ariaLabel="Demo candidate searches"
          columns={COLUMNS}
          data={rows}
          loading={loading}
          initialSort={{ id: "createdAt", desc: true }}
          toolbar={
            <>
              <ToolbarSearch value={query} onChange={setQuery} placeholder="Search vacant position..." ariaLabel="Search vacant position" />
              <ToolbarSelect value={level} onChange={setLevel} options={LEVEL_OPTIONS} ariaLabel="Filter by management level" width={200} />
              <ToolbarSelect value={status} onChange={setStatus} options={STATUS_OPTIONS} ariaLabel="Filter by status" width={180} />
              {hasFilters && <ClearFiltersButton onClick={clearFilters} />}
            </>
          }
          emptyState={
            <EmptyState
              variant="inline"
              tone="neutral"
              icon={SearchX}
              title="No candidate searches found"
              description="No searches match these filters. Try another position name or clear the filters."
              action={<Button variant="outline" onClick={clearFilters}>Clear filters</Button>}
            />
          }
          footer={loading ? "Loading candidate searches..." : `Showing ${rows.length} of ${DEMO_ROWS.length} candidate searches`}
        />
      </div>
    </div>
  );
}
