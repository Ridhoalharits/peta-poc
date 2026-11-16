import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createDataTableColumnHelper } from "@/components/shared/data-table/features";
import { IconButton } from "@/components/shared/icon-button";
import { SearchStatusBadge } from "./search-status-badge";

import { searchHref, type CandidateSearch } from "@/lib/data/talent-recommendation";
import { formatDate } from "@/lib/format";

const helper = createDataTableColumnHelper<CandidateSearch>();

/** TR-01 columns. Module scope keeps them stable for TanStack Table. Sorting happens in SearchList (sortRows). */
export const SEARCH_COLUMNS = helper.columns([
  helper.accessor("position", {
    header: "Vacant Position",
    cell: ({ row }) => (
      <Link
        href={searchHref(row.original)}
        className="rounded-sm text-sm font-medium text-foreground outline-none hover:text-primary hover:underline focus-visible:ring-[3px] focus-visible:ring-ring"
      >
        {row.original.position}
      </Link>
    ),
    meta: { className: "w-[38%] min-w-[260px]" },
  }),
  helper.accessor("level", {
    header: "Management Level",
    meta: { className: "w-[19%] min-w-[170px]" },
  }),
  helper.accessor("createdAt", {
    header: "Created",
    cell: (info) => formatDate(info.getValue()),
    meta: { className: "w-[19%] min-w-[140px]" },
  }),
  helper.accessor("status", {
    header: "Status",
    cell: (info) => <SearchStatusBadge status={info.getValue()} />,
    meta: { className: "w-[19%] min-w-[150px]", skeleton: "badge" },
  }),
  helper.display({
    id: "open",
    header: () => <span className="sr-only">Open</span>,
    cell: ({ row }) => (
      <IconButton
        label={`Open ${row.original.position}`}
        icon={ChevronRight}
        size="icon-sm"
        href={searchHref(row.original)}
        className="text-muted-foreground"
      />
    ),
    enableSorting: false,
    meta: { className: "w-14", align: "right", skeleton: "none" },
  }),
]);
