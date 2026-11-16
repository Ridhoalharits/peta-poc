import Link from "next/link";
import { createDataTableColumnHelper } from "@/components/shared/data-table/features";
import { MANAGEMENT_LEVELS } from "@/lib/constants";
import { TALENT_COLUMNS, type Talent, type TalentColumn, type TalentColumnKey } from "@/lib/data/talent-management";
import { formatDate } from "@/lib/format";

const DATE_KEYS: readonly TalentColumnKey[] = ["dob", "hireDate"];
const NAME_COLUMN_LEFT = 0; // TM03 moves it to 48 px when the checkbox column arrives.

const helper = createDataTableColumnHelper<Talent>();

function renderCell(column: TalentColumn, talent: Talent) {
  if (column.key === "fullName") {
    return (
      <Link
        href={`/talent-management/${talent.id}`}
        className="rounded-sm text-sm font-medium text-foreground outline-none hover:text-primary hover:underline focus-visible:ring-[3px] focus-visible:ring-ring"
      >
        {talent.fullName}
      </Link>
    );
  }
  const value = talent[column.key];
  return DATE_KEYS.includes(column.key) ? formatDate(String(value)) : value;
}

/** One sortable column per TALENT_COLUMNS entry. Module scope keeps them stable for TanStack Table. */
export const TALENT_TABLE_COLUMNS = helper.columns(
  TALENT_COLUMNS.map((column) =>
    helper.accessor((talent) => talent[column.key], {
      id: column.key,
      header: column.label,
      cell: ({ row }) => renderCell(column, row.original),
      meta: {
        width: column.width,
        align: column.numeric ? "right" : "left",
        sticky: column.key === "fullName" ? { left: NAME_COLUMN_LEFT } : undefined,
        // An inset shadow instead of border-r: borders on sticky cells scroll away in a collapsed table.
        className: column.key === "fullName" ? "shadow-[inset_-1px_0_0_var(--color-border)]" : "whitespace-nowrap",
      },
    }),
  ),
);

/** What each column sorts by: level by rank, numbers numerically, ISO dates and text as strings. */
export function talentSortValue(talent: Talent, columnId: string): string | number {
  const key = columnId as TalentColumnKey;
  if (key === "level") return MANAGEMENT_LEVELS.indexOf(talent.level);
  return talent[key];
}
