"use client";

import { ListFilter, Plus, Settings2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ClearFiltersButton, ToolbarSearch } from "@/components/shared/data-table/table-toolbar";
import { IconButton } from "@/components/shared/icon-button";
import { toastInfo } from "@/lib/toast";
import { cn } from "@/lib/utils";

/** Placeholder until TM06 and TM07 wire up Add Talent and Bulk Import. */
export const comingLater = () => toastInfo("Coming in a later step");

export function TalentActions() {
  return (
    <>
      <Button variant="outline" onClick={comingLater}>
        <Upload aria-hidden />
        Bulk Import
      </Button>
      <Button onClick={comingLater}>
        <Plus aria-hidden />
        Add Talent
      </Button>
    </>
  );
}

interface TalentToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  hasFilters: boolean;
  onClearFilters: () => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  activeFilterCount: number;
  onOpenFilter: () => void;
  onOpenViewSettings: () => void;
}

/** DESIGN-SYSTEM §11.8: green border and a count pill when filters are active. */
function FilterButton({ count, onClick }: { count: number; onClick: () => void }) {
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
            <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground ring-2 ring-white" aria-hidden>
              {count}
            </span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Filter</TooltipContent>
    </Tooltip>
  );
}

export function TalentToolbar({
  query,
  onQueryChange,
  hasFilters,
  onClearFilters,
  selectedCount,
  onDeleteSelected,
  activeFilterCount,
  onOpenFilter,
  onOpenViewSettings,
}: TalentToolbarProps) {
  return (
    <>
      <ToolbarSearch value={query} onChange={onQueryChange} placeholder="Search by name…" ariaLabel="Search by name" />
      <FilterButton count={activeFilterCount} onClick={onOpenFilter} />
      <IconButton label="View settings" icon={Settings2} variant="outline" onClick={onOpenViewSettings} />
      {hasFilters && <ClearFiltersButton onClick={onClearFilters} />}
      <div className="ml-auto flex items-center gap-3">
        {selectedCount > 0 ? (
          <Button variant="destructive" onClick={onDeleteSelected}>
            <Trash2 aria-hidden />
            Delete Selected
          </Button>
        ) : (
          <TalentActions />
        )}
      </div>
    </>
  );
}
