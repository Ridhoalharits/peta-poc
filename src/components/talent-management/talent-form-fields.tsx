"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, fieldDescribedBy } from "@/components/shared/form/form-field";
import { cn } from "@/lib/utils";
import type { TalentFormValues } from "./talent-form";

type FieldName = keyof TalentFormValues;

interface FieldProps {
  name: FieldName;
  label: string;
  required?: boolean;
  helper?: string;
  className?: string;
}

function useFieldError(name: FieldName) {
  const { formState } = useFormContext<TalentFormValues>();
  return formState.errors[name]?.message;
}

export function TextField({ name, label, required, helper, className, type = "text", placeholder }: FieldProps & { type?: "text" | "date"; placeholder?: string }) {
  const { register } = useFormContext<TalentFormValues>();
  const error = useFieldError(name);
  const id = `talent-${name}`;
  return (
    <FormField label={label} htmlFor={id} required={required} helper={helper} error={error} className={className}>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={fieldDescribedBy(id, { error, helper })}
        {...register(name)}
      />
    </FormField>
  );
}

interface SelectFieldProps extends FieldProps {
  options: readonly string[];
  disabled?: boolean;
  placeholder?: string;
  /** Called after the value changes (Job Family Group clears Job Family). */
  onValueChange?: (value: string) => void;
}

export function SelectField({ name, label, required, options, disabled, placeholder = "Select…", onValueChange, className }: SelectFieldProps) {
  const { control } = useFormContext<TalentFormValues>();
  const error = useFieldError(name);
  const id = `talent-${name}`;
  return (
    <FormField label={label} htmlFor={id} required={required} error={error} className={className}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            value={field.value}
            disabled={disabled}
            onValueChange={(value) => {
              field.onChange(value);
              onValueChange?.(value);
            }}
          >
            <SelectTrigger
              id={id}
              className="w-full"
              aria-invalid={error ? true : undefined}
              aria-describedby={fieldDescribedBy(id, { error })}
              onBlur={field.onBlur}
            >
              <SelectValue placeholder={placeholder} />
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
    </FormField>
  );
}

export function FormSection({ title, columns = 2, children }: { title: string; columns?: 2 | 3; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-4 text-[13px] font-semibold text-muted-foreground">{title}</legend>
      <div className={cn("grid items-start gap-4", columns === 3 ? "grid-cols-3" : "grid-cols-2")}>{children}</div>
    </fieldset>
  );
}

/** The selected Job Family Group, so Job Family can offer its families. */
export function useJobFamilyGroup(): string {
  const { control } = useFormContext<TalentFormValues>();
  return useWatch({ control, name: "jobFamilyGroup" });
}
