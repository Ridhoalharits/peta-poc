"use client";

import { ListFilter, Plus, Settings2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClearFiltersButton, ToolbarSearch } from "@/components/shared/data-table/table-toolbar";
import { IconButton } from "@/components/shared/icon-button";
import { toastInfo } from "@/lib/toast";

/** Placeholder until TM04–TM07 wire up the dialogs. */
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
}

export function TalentToolbar({ query, onQueryChange, hasFilters, onClearFilters }: TalentToolbarProps) {
  return (
    <>
      <ToolbarSearch value={query} onChange={onQueryChange} placeholder="Search by name…" ariaLabel="Search by name" />
      <IconButton label="Filter" icon={ListFilter} variant="outline" onClick={comingLater} />
      <IconButton label="View settings" icon={Settings2} variant="outline" onClick={comingLater} />
      {hasFilters && <ClearFiltersButton onClick={onClearFilters} />}
      <div className="ml-auto flex items-center gap-3">
        <TalentActions />
      </div>
    </>
  );
}
