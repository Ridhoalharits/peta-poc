"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableHead } from "@/components/ui/table";
import type { DataTableColumnMeta } from "./features";

export type RowSelection = Record<string, boolean>;

const SELECT_COLUMN_WIDTH = 48;
/** Meta for the checkbox column: fixed at the left edge, no skeleton. */
export const SELECT_COLUMN_META: DataTableColumnMeta = {
  width: SELECT_COLUMN_WIDTH,
  sticky: { left: 0 },
  skeleton: "none",
};
const CELL_CLASSES = "sticky left-0 z-[1] w-12 min-w-12 bg-inherit px-4";

interface SelectAllHeadProps {
  rowIds: string[];
  selection: RowSelection;
  onChange: (selection: RowSelection) => void;
}

/** Header checkbox: toggles every row on the current page. */
export function SelectAllHead({ rowIds, selection, onChange }: SelectAllHeadProps) {
  const selectedCount = rowIds.filter((id) => selection[id]).length;
  const allSelected = rowIds.length > 0 && selectedCount === rowIds.length;

  return (
    <TableHead className={`h-11 ${CELL_CLASSES}`}>
      <Checkbox
        aria-label="Select all on this page"
        checked={allSelected}
        disabled={rowIds.length === 0}
        onCheckedChange={() => onChange(allSelected ? {} : Object.fromEntries(rowIds.map((id) => [id, true])))}
      />
    </TableHead>
  );
}

interface SelectRowCellProps {
  rowId: string;
  label: string;
  selection: RowSelection;
  onChange: (selection: RowSelection) => void;
}

export function SelectRowCell({ rowId, label, selection, onChange }: SelectRowCellProps) {
  const toggle = (checked: boolean) => {
    const next = { ...selection };
    if (checked) next[rowId] = true;
    else delete next[rowId];
    onChange(next);
  };

  return (
    <TableCell className={CELL_CLASSES}>
      <Checkbox aria-label={`Select ${label}`} checked={Boolean(selection[rowId])} onCheckedChange={(checked) => toggle(checked === true)} />
    </TableCell>
  );
}
