"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FieldGroup } from "@/components/shared/form/field-group";
import { IncludeField } from "@/components/shared/form/include-field";
import { NumberInput } from "@/components/shared/form/number-input";
import { TagInput } from "@/components/shared/form/tag-input";
import { EDUCATION_LEVELS } from "@/lib/constants";
import type { CriteriaFormInput } from "@/lib/criteria-form";
import { CriteriaSelect } from "./criteria-select";
import { useIncludeToggle } from "./use-include-toggle";

export function EducationGroup() {
  const { control, register } = useFormContext<CriteriaFormInput>();
  const education = useIncludeToggle("education");
  const major = useIncludeToggle("major");
  const gpa = useIncludeToggle("gpa");

  return (
    <FieldGroup title="Education">
      <IncludeField id="education-level" label="Education Level" {...education}>
        {({ disabled, labelId }) => (
          <CriteriaSelect name="educationLevel" options={EDUCATION_LEVELS} labelId={labelId} disabled={disabled} />
        )}
      </IncludeField>
      <IncludeField id="major" label="Major" {...major}>
        {({ disabled, labelId }) => (
          <>
            <Controller
              control={control}
              name="majors"
              render={({ field }) => (
                <TagInput id="major-input" tags={field.value} onChange={field.onChange} disabled={disabled} aria-labelledby={labelId} />
              )}
            />
            <Controller
              control={control}
              name="acceptRelatedMajors"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="accept-related-majors"
                    checked={field.value}
                    disabled={disabled}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                  <Label htmlFor="accept-related-majors" className="text-[13px] font-normal">
                    Accept related majors
                  </Label>
                </div>
              )}
            />
          </>
        )}
      </IncludeField>
      <IncludeField id="min-gpa" label="Min. GPA" helper="On a 4.00 scale." {...gpa}>
        {({ disabled, labelId, helperId }) => (
          <NumberInput disabled={disabled} aria-labelledby={labelId} aria-describedby={helperId} {...register("minGpa")} />
        )}
      </IncludeField>
    </FieldGroup>
  );
}
