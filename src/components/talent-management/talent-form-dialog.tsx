"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/shared/form-alert";
import { FormDialog } from "@/components/shared/form-dialog";
import { RequiredMark } from "@/components/shared/form/form-field";
import { EDUCATION_LEVELS, JOB_FAMILY_GROUPS, LOCATIONS, MANAGEMENT_LEVELS } from "@/lib/constants";
import { JOB_FAMILIES, MARITAL_STATUSES, RELIGIONS, TALENT_EMPLOYEE_TYPES, WORK_SPACES } from "@/lib/data/talent-management";
import { EMPTY_TALENT_FORM, requiredFieldsMessage, talentFormSchema, type TalentFormValues } from "./talent-form";
import { FormSection, SelectField, TextField, useJobFamilyGroup } from "./talent-form-fields";

const FORM_ID = "talent-form";

/** Scrolls the dialog body (not the whole panel, as scrollIntoView would) back up to the alert. */
function scrollToTop() {
  requestAnimationFrame(() => document.getElementById(FORM_ID)?.closest(".overflow-y-auto")?.scrollTo({ top: 0 }));
}
const GENDERS = ["Male", "Female"];

const COPY = {
  add: { title: "Add Talent", save: "Save Talent" },
  edit: { title: "Edit Talent", save: "Save Changes" },
} as const;

interface TalentFormDialogProps {
  mode: "add" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Edit: the talent's values. */
  initial?: Partial<TalentFormValues>;
  /** Demo: open with the errors already shown. */
  showErrors?: boolean;
  onSaved: (values: TalentFormValues) => void;
}

function EmploymentFields() {
  const { setValue } = useFormContext<TalentFormValues>();
  const group = useJobFamilyGroup();
  return (
    <FormSection title="Employment">
      <SelectField name="employeeType" label="Employee Type" required options={TALENT_EMPLOYEE_TYPES} />
      <TextField name="hireDate" label="Hire Date" type="date" required helper="Length of service is calculated automatically." />
      <TextField name="position" label="Position" required />
      <SelectField name="level" label="Management Level" required options={MANAGEMENT_LEVELS} />
      <TextField name="jobTitle" label="Job Title" />
      <TextField name="businessTitle" label="Business Title" />
      <SelectField
        name="jobFamilyGroup"
        label="Job Family Group"
        options={JOB_FAMILY_GROUPS}
        onValueChange={() => setValue("jobFamily", "")}
      />
      <SelectField
        name="jobFamily"
        label="Job Family"
        options={JOB_FAMILIES[group] ?? []}
        disabled={!group}
        placeholder={group ? "Select…" : "Select Job Family Group first"}
      />
      <TextField name="jobProfile" label="Job Profile" />
      <SelectField name="location" label="Location" required options={LOCATIONS} />
      <SelectField name="workSpace" label="Work Space" options={WORK_SPACES} />
    </FormSection>
  );
}

/** TM-06 Add Talent / TM-10 Edit Talent. Remount it (key) on every opening for a fresh form. */
export function TalentFormDialog({ mode, open, onOpenChange, initial, showErrors = false, onSaved }: TalentFormDialogProps) {
  const form = useForm<TalentFormValues>({
    defaultValues: { ...EMPTY_TALENT_FORM, ...initial },
    resolver: zodResolver(talentFormSchema),
    shouldFocusError: false,
  });
  const errorCount = Object.keys(form.formState.errors).length;

  useEffect(() => {
    if (showErrors) void form.handleSubmit(() => undefined, scrollToTop)();
  }, [form, showErrors]);

  const submit = form.handleSubmit((values) => {
    onSaved(values);
    onOpenChange(false);
  }, scrollToTop);
  const name = initial?.fullName ?? "";

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={COPY[mode].title}
      description={mode === "add" ? "Add one talent to PETA. To add many at once, use Bulk Import." : `Update ${name}'s details.`}
      width={760}
      divided
      footerStart={
        <span className="text-[13px] text-muted-foreground">
          Fields marked <RequiredMark /> are required.
        </span>
      }
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID}>
            {COPY[mode].save}
          </Button>
        </>
      }
    >
      <FormProvider {...form}>
        <form id={FORM_ID} noValidate onSubmit={(event) => void submit(event)} className="flex flex-col gap-6">
          {errorCount > 0 && <FormAlert>{requiredFieldsMessage(errorCount)}</FormAlert>}
          <FormSection title="Personal">
            <TextField name="fullName" label="Full Name" required className="col-span-2" />
            <TextField name="dob" label="Date of Birth" type="date" required helper="Age is calculated automatically." />
            <TextField name="cityOfBirth" label="City of Birth" />
            <SelectField name="gender" label="Gender" options={GENDERS} />
            <SelectField name="maritalStatus" label="Marital Status" options={MARITAL_STATUSES} />
            <SelectField name="religion" label="Religion" options={RELIGIONS} />
          </FormSection>
          <FormSection title="Education" columns={3}>
            <SelectField name="education" label="Education" options={EDUCATION_LEVELS} />
            <TextField name="fieldOfStudy" label="Field of Study" placeholder="e.g. Accounting" />
            <TextField name="degrees" label="Degrees" placeholder="e.g. S.Ak." />
          </FormSection>
          <EmploymentFields />
        </form>
      </FormProvider>
    </FormDialog>
  );
}
