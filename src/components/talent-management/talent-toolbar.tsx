"use client";

import { Plus, Settings2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClearFiltersButton, ToolbarSearch } from "@/components/shared/data-table/table-toolbar";
import { FilterButton } from "@/components/shared/filter-button";
import { IconButton } from "@/components/shared/icon-button";
import type { TalentDialog } from "./talent-dialogs";

type OpenDialog = (dialog: TalentDialog) => void;

export function TalentActions({ onOpen }: { onOpen: OpenDialog }) {
  return (
    <>
      <Button variant="outline" onClick={() => onOpen("import")}>
        <Upload aria-hidden />
        Bulk Import
      </Button>
      <Button onClick={() => onOpen("add")}>
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
  activeFilterCount: number;
  onOpen: OpenDialog;
}

export function TalentToolbar({ query, onQueryChange, hasFilters, onClearFilters, selectedCount, activeFilterCount, onOpen }: TalentToolbarProps) {
  return (
    <>
      <ToolbarSearch value={query} onChange={onQueryChange} placeholder="Search by name…" ariaLabel="Search by name" />
      <FilterButton count={activeFilterCount} onClick={() => onOpen("filter")} />
      <IconButton label="View settings" icon={Settings2} variant="outline" onClick={() => onOpen("columns")} />
      {hasFilters && <ClearFiltersButton onClick={onClearFilters} />}
      <div className="ml-auto flex items-center gap-3">
        {selectedCount > 0 ? (
          <Button variant="destructive" onClick={() => onOpen("delete")}>
            <Trash2 aria-hidden />
            Delete Selected
          </Button>
        ) : (
          <TalentActions onOpen={onOpen} />
        )}
      </div>
    </>
  );
}
