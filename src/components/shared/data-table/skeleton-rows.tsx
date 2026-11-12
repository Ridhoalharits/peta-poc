import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { DataTableColumnMeta } from "./features";

const SKELETON_ROW_COUNT = 8;
const FIRST_COLUMN_WIDTHS = ["w-[70%]", "w-[55%]", "w-[62%]", "w-[48%]", "w-[66%]", "w-[58%]", "w-[72%]", "w-[50%]"];

export function SkeletonRows({ columns }: { columns: (DataTableColumnMeta | undefined)[] }) {
  return Array.from({ length: SKELETON_ROW_COUNT }, (_, rowIndex) => (
    <TableRow key={rowIndex} className="h-13 border-zinc-100 hover:bg-transparent">
      {columns.map((meta, columnIndex) => (
        <TableCell key={columnIndex} className={cn("px-4", meta?.className)}>
          {meta?.skeleton === "none" ? null : meta?.skeleton === "badge" ? (
            <Skeleton className="h-[22px] w-[84px] rounded-md" />
          ) : (
            <Skeleton className={cn("h-3.5", columnIndex === 0 ? FIRST_COLUMN_WIDTHS[rowIndex] : "w-[60%]")} />
          )}
        </TableCell>
      ))}
    </TableRow>
  ));
}
