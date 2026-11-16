"use client";

import { flexRender, useTable, type Header, type RowData, type SortingState, type Updater } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { SectionCard } from "../section-card";
import { dataTableFeatures, columnCellProps, type DataTableColumn, type DataTableFeatures } from "./features";
import { SkeletonRows } from "./skeleton-rows";
import { SELECT_COLUMN_META, SelectAllHead, SelectRowCell, type RowSelection } from "./selection-cells";
import { SortableHeader, ariaSortValue } from "./sortable-header";

const DEFAULT_SKELETON_ROWS = 8;

interface DataTableProps<TData extends RowData> {
  /** Keep stable (module scope or useMemo). Set `meta: { className, align, skeleton, width, sticky }` per column. */
  columns: DataTableColumn<TData>[];
  /** Already filtered, sorted and paged by the page (see lib/table.ts). */
  data: TData[];
  toolbar?: React.ReactNode;
  loading?: boolean;
  /** Skeleton rows while loading. Default 8. */
  skeletonRows?: number;
  /** Shown inside the body when there are 0 rows. */
  emptyState?: React.ReactNode;
  footer?: React.ReactNode;
  /** Controlled, so pages that paginate can sort the full list before slicing. */
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  ariaLabel: string;
  /** Below this width the table scrolls inside the card. */
  tableClassName?: string;
  /** Row selection (TM-02). When given, a fixed 48 px checkbox column is added first. */
  rowSelection?: RowSelection;
  onRowSelectionChange?: (selection: RowSelection) => void;
  /** Stable row id (also the selection key). Defaults to the row index. */
  getRowId?: (row: TData) => string;
  /** Name used in the row checkbox label: "Select {label}". */
  getRowLabel?: (row: TData) => string;
}

function HeaderCell<TData extends RowData>({ header }: { header: Header<DataTableFeatures, TData, unknown> }) {
  const { column } = header;
  const meta = column.columnDef.meta;
  const label = column.columnDef.header;
  const canSort = column.getCanSort() && typeof label === "string";
  const { className, style } = columnCellProps(meta);
  const sorted = column.getIsSorted();

  return (
    <TableHead
      aria-sort={canSort ? ariaSortValue(sorted) : undefined}
      className={cn("h-11 px-4 text-[13px] font-medium text-muted-foreground", className)}
      style={style}
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
  skeletonRows = DEFAULT_SKELETON_ROWS,
  emptyState,
  footer,
  sorting,
  onSortingChange,
  ariaLabel,
  tableClassName = "min-w-[720px]",
  rowSelection,
  onRowSelectionChange,
  getRowId,
  getRowLabel,
}: DataTableProps<TData>) {
  const selection = rowSelection && onRowSelectionChange ? { value: rowSelection, onChange: onRowSelectionChange } : undefined;
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    state: { sorting },
    onSortingChange: (updater: Updater<SortingState>) =>
      onSortingChange(typeof updater === "function" ? updater(sorting) : updater),
    manualSorting: true,
    enableSortingRemoval: false,
    getRowId: getRowId ? (row: TData) => getRowId(row) : undefined,
  });
  const rows = table.getRowModel().rows;
  const dataColumnMetas = table.getAllLeafColumns().map((column) => column.columnDef.meta);
  const columnMetas = selection ? [SELECT_COLUMN_META, ...dataColumnMetas] : dataColumnMetas;

  return (
    <SectionCard contentClassName="p-0 gap-0">
      {toolbar && <div className="flex flex-wrap items-center gap-3 border-b p-4">{toolbar}</div>}
      <Table aria-label={ariaLabel} aria-busy={loading || undefined} className={tableClassName}>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="border-b bg-table-header hover:bg-table-header">
              {selection && <SelectAllHead rowIds={rows.map((row) => row.id)} selection={selection.value} onChange={selection.onChange} />}
              {group.headers.map((header) => (
                <HeaderCell key={header.id} header={header} />
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <SkeletonRows columns={columnMetas} count={skeletonRows} />
          ) : rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columnMetas.length} className="p-0 whitespace-normal">
                {emptyState}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={selection?.value[row.id] ? "selected" : undefined}
                className="h-13 border-zinc-100 bg-white hover:bg-table-header data-[state=selected]:bg-row-selected"
              >
                {selection && (
                  <SelectRowCell
                    rowId={row.id}
                    label={getRowLabel?.(row.original) ?? row.id}
                    selection={selection.value}
                    onChange={selection.onChange}
                  />
                )}
                {row.getAllCells().map((cell) => {
                  const { className, style } = columnCellProps(cell.column.columnDef.meta);
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn("px-4 text-[13px] text-zinc-600", className)}
                      style={style}
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
