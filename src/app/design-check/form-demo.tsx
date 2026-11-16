"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FormField, fieldDescribedBy } from "@/components/shared/form/form-field";
import { NumberInput } from "@/components/shared/form/number-input";
import { RangeInput } from "@/components/shared/form/range-input";
import { SectionCard } from "@/components/shared/section-card";

const TITLE_ERROR = "Enter a job title.";
const GPA_HELPER = "On a 4.00 scale.";
const AGE_ERROR = "Enter a valid age range.";

/** F09 shared fields in their normal, error and disabled states. */
export function FormDemo() {
  const [ageMin, setAgeMin] = useState("25");
  const [ageMax, setAgeMax] = useState("30");

  return (
    <SectionCard title="Form fields" description="FormField, NumberInput and RangeInput.">
      <div className="grid grid-cols-3 gap-5">
        <FormField label="Job Title" htmlFor="fd-title" required>
          <Input id="fd-title" placeholder="e.g. Accounting Officer" />
        </FormField>
        <FormField label="Job Title" htmlFor="fd-title-error" required error={TITLE_ERROR}>
          <Input id="fd-title-error" aria-invalid aria-describedby={fieldDescribedBy("fd-title-error", { error: TITLE_ERROR })} />
        </FormField>
        <FormField label="Job Title" htmlFor="fd-title-disabled">
          <Input id="fd-title-disabled" defaultValue="Accounting Officer" disabled />
        </FormField>
        <FormField label="Min. GPA" htmlFor="fd-gpa" helper={GPA_HELPER}>
          <NumberInput id="fd-gpa" defaultValue="3.00" aria-describedby={fieldDescribedBy("fd-gpa", { helper: GPA_HELPER })} />
        </FormField>
        <FormField label="Min. length of service" htmlFor="fd-service" error="Enter a number.">
          <NumberInput id="fd-service" suffix="years" defaultValue="abc" aria-invalid aria-describedby="fd-service-error" />
        </FormField>
        <FormField label="Weight" htmlFor="fd-weight">
          <NumberInput id="fd-weight" suffix="%" defaultValue="30" disabled />
        </FormField>
        <FormField label="Age (years)" htmlFor="fd-age-min">
          <RangeInput id="fd-age" minValue={ageMin} maxValue={ageMax} onMinChange={setAgeMin} onMaxChange={setAgeMax} minLabel="Minimum age" maxLabel="Maximum age" />
        </FormField>
        <FormField label="Age (years)" htmlFor="fd-age-error-min" error={AGE_ERROR}>
          <RangeInput id="fd-age-error" minValue="40" maxValue="30" onMinChange={() => undefined} onMaxChange={() => undefined} minLabel="Minimum age" maxLabel="Maximum age" aria-invalid aria-describedby="fd-age-error-min-error" />
        </FormField>
        <FormField label="Age (years)" htmlFor="fd-age-disabled-min">
          <RangeInput id="fd-age-disabled" minValue="25" maxValue="30" onMinChange={() => undefined} onMaxChange={() => undefined} minLabel="Minimum age" maxLabel="Maximum age" disabled />
        </FormField>
      </div>
    </SectionCard>
  );
}
