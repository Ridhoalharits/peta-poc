"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormDialog } from "@/components/shared/form-dialog";
import { TALENT_COLUMNS, type TalentColumnKey } from "@/lib/data/talent-management";

export const ALL_COLUMN_KEYS: TalentColumnKey[] = TALENT_COLUMNS.map((column) => column.key);

interface ViewSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visibleColumns: TalentColumnKey[];
  onApply: (visibleColumns: TalentColumnKey[]) => void;
}

/** TM-05. Edits a draft list of visible keys; the list remounts it (key) on every opening. */
export function ViewSettingsDialog({ open, onOpenChange, visibleColumns, onApply }: ViewSettingsDialogProps) {
  const [draft, setDraft] = useState<TalentColumnKey[]>(visibleColumns);
  const [search, setSearch] = useState("");
  const shown = TALENT_COLUMNS.filter((column) => column.label.toLowerCase().includes(search.trim().toLowerCase()));
  // Keep TALENT_COLUMNS order whatever order boxes are ticked in.
  const toggle = (key: TalentColumnKey, checked: boolean) =>
    setDraft((current) => ALL_COLUMN_KEYS.filter((k) => (k === key ? checked : current.includes(k))));
  const apply = () => {
    onApply(draft);
    onOpenChange(false);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Table view settings"
      description={`${draft.length} of ${TALENT_COLUMNS.length} columns shown`}
      width={600}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={apply}>Apply</Button>
        </>
      }
    >
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search columns…"
            aria-label="Search columns"
            className="pl-9"
          />
        </div>
        <Button variant="ghost" onClick={() => setDraft(ALL_COLUMN_KEYS)}>
          Select all
        </Button>
        <Button variant="ghost" onClick={() => setDraft(ALL_COLUMN_KEYS)}>
          Reset to default
        </Button>
      </div>
      {shown.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">No columns match your search.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 px-2 pt-1">
          {shown.map((column) => (
            <div key={column.key} className="flex items-center gap-2.5">
              <Checkbox
                id={`column-${column.key}`}
                checked={column.locked || draft.includes(column.key)}
                disabled={column.locked}
                onCheckedChange={(checked) => toggle(column.key, checked === true)}
              />
              <Label htmlFor={`column-${column.key}`} className="text-sm font-normal peer-disabled:opacity-60">
                {column.label}
              </Label>
              {column.locked && <span className="text-xs text-muted-foreground">Always shown</span>}
            </div>
          ))}
        </div>
      )}
    </FormDialog>
  );
}
