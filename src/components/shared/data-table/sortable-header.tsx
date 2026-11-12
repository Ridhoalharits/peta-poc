import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortDirectionState = false | "asc" | "desc";

export function ariaSortValue(sorted: SortDirectionState): "ascending" | "descending" | "none" {
  if (sorted === "asc") return "ascending";
  if (sorted === "desc") return "descending";
  return "none";
}

interface SortableHeaderProps {
  label: string;
  sorted: SortDirectionState;
  onToggle?: (event: unknown) => void;
}

/** Button inside a header cell. The <th> carries aria-sort (set by DataTable). */
export function SortableHeader({ label, sorted, onToggle }: SortableHeaderProps) {
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "-mx-1.5 inline-flex h-7 items-center gap-1.5 rounded-md px-1.5 text-[13px] font-medium outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring",
        sorted ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {label}
      <Icon className={cn("size-3.5", !sorted && "text-[#a1a1aa]")} aria-hidden />
    </button>
  );
}
