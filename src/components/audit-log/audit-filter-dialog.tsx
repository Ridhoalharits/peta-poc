"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormDialog } from "@/components/shared/form-dialog";
import { AUDIT_MODULES } from "@/lib/data/audit-log";
import { ALL_MODULES, EMPTY_AUDIT_FILTERS, type AuditFilters } from "./audit-filters";

interface AuditFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: AuditFilters;
  onApply: (filters: AuditFilters) => void;
}

/** AL-02. Edits a draft copy (as in TM04); the list remounts it (key) on every opening. */
export function AuditFilterDialog({ open, onOpenChange, filters, onApply }: AuditFilterDialogProps) {
  const [draft, setDraft] = useState(filters);
  const update = (patch: Partial<AuditFilters>) => setDraft((current) => ({ ...current, ...patch }));
  const apply = () => {
    onApply(draft);
    onOpenChange(false);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Filter audit log"
      description="Show only entries that match every filter."
      width={520}
      footerStart={
        <Button variant="link" className="h-auto px-2 underline" onClick={() => setDraft(EMPTY_AUDIT_FILTERS)}>
          Reset all
        </Button>
      }
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={apply}>Apply filters</Button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="audit-filter-user">User</Label>
        <Input
          id="audit-filter-user"
          placeholder="e.g. andi.pratama"
          value={draft.user}
          onChange={(event) => update({ user: event.target.value })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="audit-filter-module">Module</Label>
        <Select value={draft.module} onValueChange={(module) => update({ module })}>
          <SelectTrigger id="audit-filter-module" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_MODULES}>All modules</SelectItem>
            {AUDIT_MODULES.map((module) => (
              <SelectItem key={module} value={module}>
                {module}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="audit-filter-from">Date</Label>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <Input
            id="audit-filter-from"
            type="date"
            aria-label="From date"
            value={draft.from}
            onChange={(event) => update({ from: event.target.value })}
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input type="date" aria-label="To date" value={draft.to} onChange={(event) => update({ to: event.target.value })} />
        </div>
      </div>
    </FormDialog>
  );
}
