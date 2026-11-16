import type { SortingState } from "@tanstack/react-table";

/** Returns a sorted copy. `getValue` maps a row and column id to something comparable. */
export function sortRows<T>(rows: T[], sorting: SortingState, getValue: (row: T, columnId: string) => string | number): T[] {
  const [sort] = sorting;
  if (!sort) return [...rows];
  const direction = sort.desc ? -1 : 1;
  return [...rows].sort((rowA, rowB) => {
    const valueA = getValue(rowA, sort.id);
    const valueB = getValue(rowB, sort.id);
    if (typeof valueA === "number" && typeof valueB === "number") return (valueA - valueB) * direction;
    return String(valueA).localeCompare(String(valueB)) * direction;
  });
}

/** Slices one page (1-based). `from` and `to` are 1-based row numbers for "Showing {from}–{to} of {total}". */
export function paginate<T>(rows: T[], page: number, size: number) {
  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(Math.max(page, 1), pageCount);
  const start = (current - 1) * size;
  const pageRows = rows.slice(start, start + size);
  return { pageRows, pageCount, from: pageRows.length ? start + 1 : 0, to: start + pageRows.length };
}
