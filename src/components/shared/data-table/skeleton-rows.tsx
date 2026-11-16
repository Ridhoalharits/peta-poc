import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { columnCellProps, type DataTableColumnMeta } from "./features";

const FIRST_COLUMN_WIDTHS = ["w-[70%]", "w-[55%]", "w-[62%]", "w-[48%]", "w-[66%]", "w-[58%]", "w-[72%]", "w-[50%]"];

export function SkeletonRows({ columns, count }: { columns: (DataTableColumnMeta | undefined)[]; count: number }) {
  return Array.from({ length: count }, (_, rowIndex) => (
    <TableRow key={rowIndex} className="h-13 border-zinc-100 bg-white hover:bg-white">
      {columns.map((meta, columnIndex) => {
        const { className, style } = columnCellProps(meta);
        return (
          <TableCell key={columnIndex} className={cn("px-4", className)} style={style}>
            {meta?.skeleton === "none" ? null : meta?.skeleton === "badge" ? (
              <Skeleton className="h-[22px] w-[84px] rounded-md" />
            ) : (
              <Skeleton className={cn("h-3.5", columnIndex === 0 ? FIRST_COLUMN_WIDTHS[rowIndex % FIRST_COLUMN_WIDTHS.length] : "w-[60%]")} />
            )}
          </TableCell>
        );
      })}
    </TableRow>
  ));
}
