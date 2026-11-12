"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CriteriaFormInput } from "@/lib/criteria-form";

type SelectFieldName = "educationLevel" | "employeeType" | "managementLevel";

interface CriteriaSelectProps {
  name: SelectFieldName;
  options: readonly string[];
  labelId: string;
  disabled: boolean;
}

export function CriteriaSelect({ name, options, labelId, disabled }: CriteriaSelectProps) {
  const { control } = useFormContext<CriteriaFormInput>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
          <SelectTrigger className="w-full" aria-labelledby={labelId} onBlur={field.onBlur}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
