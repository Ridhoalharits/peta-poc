"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, RequiredMark } from "@/components/shared/form/form-field";
import { SectionCard } from "@/components/shared/section-card";
import type { CriteriaFormInput } from "@/lib/criteria-form";

const TEXTAREA_ROWS = 4;

export function VacancyCard() {
  const { register, formState } = useFormContext<CriteriaFormInput>();
  const { errors } = formState;

  return (
    <SectionCard
      title="Vacancy Information"
      description={
        <>
          Fields marked <RequiredMark /> are required.
        </>
      }
    >
      <FormField label="Job Title" htmlFor="job-title" required error={errors.jobTitle?.message}>
        <Input id="job-title" placeholder="e.g. Accounting Officer" {...register("jobTitle")} />
      </FormField>
      <FormField label="Job Description" htmlFor="job-description" required error={errors.jobDescription?.message}>
        <Textarea
          id="job-description"
          rows={TEXTAREA_ROWS}
          placeholder="Describe the purpose of this role…"
          {...register("jobDescription")}
        />
      </FormField>
      <FormField label="Responsibilities" htmlFor="responsibilities" helper="Each line becomes one bullet point.">
        <Textarea
          id="responsibilities"
          rows={TEXTAREA_ROWS}
          placeholder="One responsibility per line"
          {...register("responsibilities")}
        />
      </FormField>
    </SectionCard>
  );
}
