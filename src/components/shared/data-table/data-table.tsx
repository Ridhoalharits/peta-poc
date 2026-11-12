"use client";

import { flexRender, useTable, type Header, type RowData } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { SectionCard } from "../section-card";
import { dataTableFeatures, type DataTableColumn, type DataTableFeatures } from "./features";
import { SkeletonRows } from "./skeleton-rows";
import { SortableHeader, ariaSortValue } from "./sortable-header";

interface DataTableProps<TData extends RowData> {
  /** Keep stable (module scope or useMemo). Set `meta: { className, align, skeleton }` per column. */
  columns: DataTableColumn<TData>[];
  /** Already filtered by the page; the table only sorts. */
  data: TData[];
  toolbar?: React.ReactNode;
  loading?: boolean;
  /** Shown inside the body when there are 0 rows. */
  emptyState?: React.ReactNode;
  footer?: React.ReactNode;
  initialSort?: { id: string; desc: boolean };
  ariaLabel: string;
  /** Below this width the table scrolls inside the card. */
  tableClassName?: string;
}

function HeaderCell<TData extends RowData>({ header }: { header: Header<DataTableFeatures, TData, unknown> }) {
  const { column } = header;
  const meta = column.columnDef.meta;
  const label = column.columnDef.header;
  const canSort = column.getCanSort() && typeof label === "string";
  const sorted = column.getIsSorted();

  return (
    <TableHead
      aria-sort={canSort ? ariaSortValue(sorted) : undefined}
      className={cn("h-11 px-4 text-[13px] font-medium text-muted-foreground", meta?.align === "right" && "text-right", meta?.className)}
    >
      {header.isPlaceholder ? null : canSort ? (
        <SortableHeader label={label} sorted={sorted} onToggle={column.getToggleSortingHandler()} />
      ) : (
        flexRender(label, header.getContext())
      )}
    </TableHead>
  );
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  toolbar,
  loading = false,
  emptyState,
  footer,
  initialSort,
  ariaLabel,
  tableClassName = "min-w-[720px]",
}: DataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    initialState: { sorting: initialSort ? [initialSort] : [] },
    enableSortingRemoval: false,
  });
  const rows = table.getRowModel().rows;
  const columnMetas = table.getAllLeafColumns().map((column) => column.columnDef.meta);

  return (
    <SectionCard contentClassName="p-0 gap-0">
      {toolbar && <div className="flex flex-wrap items-center gap-3 border-b p-4">{toolbar}</div>}
      <Table aria-label={ariaLabel} aria-busy={loading || undefined} className={tableClassName}>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="border-b bg-table-header hover:bg-table-header">
              {group.headers.map((header) => (
                <HeaderCell key={header.id} header={header} />
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <SkeletonRows columns={columnMetas} />
          ) : rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columnMetas.length} className="p-0 whitespace-normal">
                {emptyState}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id} className="h-13 border-zinc-100 hover:bg-table-header">
                {row.getAllCells().map((cell) => {
                  const meta = cell.column.columnDef.meta;
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn("px-4 text-[13px] text-zinc-600", meta?.align === "right" && "text-right", meta?.className)}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {footer && (
        <div className="flex min-h-[52px] items-center border-t px-4 text-[13px] text-muted-foreground">{footer}</div>
      )}
    </SectionCard>
  );
}
