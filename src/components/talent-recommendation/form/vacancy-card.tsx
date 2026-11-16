"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, RequiredMark, fieldDescribedBy } from "@/components/shared/form/form-field";
import { SectionCard } from "@/components/shared/section-card";
import type { CriteriaFormInput } from "./criteria-form";

const TEXTAREA_ROWS = 4;
const RESPONSIBILITIES_HELPER = "Each line becomes one bullet point.";

export function VacancyCard() {
  const { register, formState } = useFormContext<CriteriaFormInput>();
  const titleError = formState.errors.jobTitle?.message;
  const descriptionError = formState.errors.jobDescription?.message;

  return (
    <SectionCard
      title="Vacancy Information"
      description={
        <>
          Fields marked <RequiredMark /> are required.
        </>
      }
    >
      <FormField label="Job Title" htmlFor="job-title" required error={titleError}>
        <Input
          id="job-title"
          placeholder="e.g. Accounting Officer"
          aria-invalid={titleError ? true : undefined}
          aria-describedby={fieldDescribedBy("job-title", { error: titleError })}
          {...register("jobTitle")}
        />
      </FormField>
      <FormField label="Job Description" htmlFor="job-description" required error={descriptionError}>
        <Textarea
          id="job-description"
          rows={TEXTAREA_ROWS}
          placeholder="Describe the purpose of this role…"
          aria-invalid={descriptionError ? true : undefined}
          aria-describedby={fieldDescribedBy("job-description", { error: descriptionError })}
          {...register("jobDescription")}
        />
      </FormField>
      <FormField label="Responsibilities" htmlFor="responsibilities" helper={RESPONSIBILITIES_HELPER}>
        <Textarea
          id="responsibilities"
          rows={TEXTAREA_ROWS}
          placeholder="One responsibility per line"
          aria-describedby={fieldDescribedBy("responsibilities", { helper: RESPONSIBILITIES_HELPER })}
          {...register("responsibilities")}
        />
      </FormField>
    </SectionCard>
  );
}
