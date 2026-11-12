import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";

export interface DataTableColumnMeta {
  /** Applied to both the header and body cells, e.g. a width. */
  className?: string;
  align?: "left" | "right";
  /** What the loading row shows for this column. Defaults to "text". */
  skeleton?: "text" | "badge" | "none";
}

// Module scope so the table's feature set stays stable between renders (TanStack Table v9).
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
  columnMeta: {} as DataTableColumnMeta,
});

export type DataTableFeatures = typeof dataTableFeatures;

// `any` for the cell value: one table mixes columns of different value types (string, number, …).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>;

export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>();
}
