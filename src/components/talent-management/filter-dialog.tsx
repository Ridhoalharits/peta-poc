"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FormDialog } from "@/components/shared/form-dialog";
import { RangeInput } from "@/components/shared/form/range-input";
import { JOB_FAMILY_GROUPS, LOCATIONS, MANAGEMENT_LEVELS } from "@/lib/constants";
import { TALENT_EMPLOYEE_TYPES } from "@/lib/data/talent-management";
import { ALL, EMPTY_FILTERS, type TalentFilters } from "./talent-filters";

type SelectKey = "gender" | "employeeType" | "level" | "jobFamilyGroup" | "location";

const SELECT_FIELDS: { key: SelectKey; label: string; allLabel: string; options: readonly string[] }[] = [
  { key: "gender", label: "Gender", allLabel: "All genders", options: ["Male", "Female"] },
  { key: "employeeType", label: "Employee Type", allLabel: "All types", options: TALENT_EMPLOYEE_TYPES },
  { key: "level", label: "Management Level", allLabel: "All levels", options: MANAGEMENT_LEVELS },
  { key: "jobFamilyGroup", label: "Job Family Group", allLabel: "All groups", options: JOB_FAMILY_GROUPS },
  { key: "location", label: "Location", allLabel: "All locations", options: LOCATIONS },
];

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: TalentFilters;
  onApply: (filters: TalentFilters) => void;
}

/** TM-04. Edits a draft copy: Apply copies it back, Cancel throws it away. The list remounts it (key) on every opening. */
export function FilterDialog({ open, onOpenChange, filters, onApply }: FilterDialogProps) {
  const [draft, setDraft] = useState(filters);
  const update = (patch: Partial<TalentFilters>) => setDraft((current) => ({ ...current, ...patch }));
  const apply = () => {
    onApply(draft);
    onOpenChange(false);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Filter talents"
      description="Show only talents that match every filter."
      width={560}
      footerStart={
        <Button variant="link" className="h-auto px-2 underline" onClick={() => setDraft(EMPTY_FILTERS)}>
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
      <div className="grid grid-cols-2 gap-4">
        {SELECT_FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col gap-2">
            <Label htmlFor={`filter-${field.key}`}>{field.label}</Label>
            <Select value={draft[field.key]} onValueChange={(value) => update({ [field.key]: value })}>
              <SelectTrigger id={`filter-${field.key}`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>{field.allLabel}</SelectItem>
                {field.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      <Separator className="my-1" />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-age-min">Age</Label>
          <RangeInput
            id="filter-age"
            minValue={draft.ageMin}
            maxValue={draft.ageMax}
            onMinChange={(ageMin) => update({ ageMin })}
            onMaxChange={(ageMax) => update({ ageMax })}
            minLabel="Minimum age"
            maxLabel="Maximum age"
            minPlaceholder="Min"
            maxPlaceholder="Max"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-service-min">Length of service (months)</Label>
          <RangeInput
            id="filter-service"
            minValue={draft.serviceMin}
            maxValue={draft.serviceMax}
            onMinChange={(serviceMin) => update({ serviceMin })}
            onMaxChange={(serviceMax) => update({ serviceMax })}
            minLabel="Minimum length of service in months"
            maxLabel="Maximum length of service in months"
            minPlaceholder="Min"
            maxPlaceholder="Max"
          />
        </div>
      </div>
    </FormDialog>
  );
}
