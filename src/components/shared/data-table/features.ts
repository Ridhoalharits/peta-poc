import type { CSSProperties } from "react";
import {
  createColumnHelper,
  rowSortingFeature,
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
  /** Fixed width in px (wide tables whose widths come from data). */
  width?: number;
  /** Keeps the column in place while the rest scrolls sideways (TM-01 fixed columns). */
  sticky?: { left: number };
}

// Module scope so the table's feature set stays stable between renders (TanStack Table v9).
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  columnMeta: {} as DataTableColumnMeta,
});

export type DataTableFeatures = typeof dataTableFeatures;

// `any` for the cell value: one table mixes columns of different value types (string, number, …).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>;

export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>();
}

/** Class and style a header or body cell gets from its column meta (width, alignment, sticky). */
export function columnCellProps(meta: DataTableColumnMeta | undefined): { className: string; style?: CSSProperties } {
  const className = [
    meta?.align === "right" ? "text-right" : "",
    meta?.sticky ? "sticky z-[1] bg-inherit" : "",
    meta?.className ?? "",
  ].join(" ");
  const style: CSSProperties | undefined =
    meta?.width !== undefined || meta?.sticky
      ? { width: meta.width, minWidth: meta.width, left: meta.sticky?.left }
      : undefined;
  return { className, style };
}
