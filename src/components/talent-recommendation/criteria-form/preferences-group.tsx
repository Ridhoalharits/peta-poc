"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FieldGroup } from "@/components/shared/form/field-group";
import { IncludeField } from "@/components/shared/form/include-field";
import { RadioPills } from "@/components/shared/form/radio-pills";
import { RangeInput } from "@/components/shared/form/range-input";
import type { CriteriaFormInput } from "@/lib/criteria-form";
import { useIncludeToggle } from "./use-include-toggle";

const GENDER_OPTIONS = [
  { value: "none", label: "No preference" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export function PreferencesGroup() {
  const { control } = useFormContext<CriteriaFormInput>();
  const gender = useIncludeToggle("gender");
  const age = useIncludeToggle("age");

  return (
    <FieldGroup title="Preferences">
      <IncludeField id="gender" label="Gender preference" className="col-span-2" {...gender}>
        {({ disabled, labelId }) => (
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <RadioPills
                id="gender-pills"
                options={GENDER_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
                aria-labelledby={labelId}
              />
            )}
          />
        )}
      </IncludeField>
      <IncludeField id="age" label="Age preference (years)" {...age}>
        {({ disabled }) => (
          <Controller
            control={control}
            name="ageMin"
            render={({ field: minField }) => (
              <Controller
                control={control}
                name="ageMax"
                render={({ field: maxField }) => (
                  <RangeInput
                    id="age-range"
                    minValue={minField.value}
                    maxValue={maxField.value}
                    onMinChange={minField.onChange}
                    onMaxChange={maxField.onChange}
                    minLabel="Minimum age"
                    maxLabel="Maximum age"
                    disabled={disabled}
                  />
                )}
              />
            )}
          />
        )}
      </IncludeField>
    </FieldGroup>
  );
}
