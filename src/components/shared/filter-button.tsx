"use client";

import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** DESIGN-SYSTEM §11.8: 40 px outline icon button; green border and a count pill when filters are active. */
export function FilterButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={count ? `Filter, ${count} active` : "Filter"}
          className={cn("relative", count > 0 && "border-primary")}
          onClick={onClick}
        >
          <ListFilter aria-hidden />
          {count > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground ring-2 ring-white"
              aria-hidden
            >
              {count}
            </span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Filter</TooltipContent>
    </Tooltip>
  );
}
