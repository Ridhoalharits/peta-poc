"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup } from "@/components/shared/form/field-group";
import { FormField } from "@/components/shared/form/form-field";
import { IncludeField } from "@/components/shared/form/include-field";
import { NumberInput } from "@/components/shared/form/number-input";
import { RadioPills } from "@/components/shared/form/radio-pills";
import { RangeInput } from "@/components/shared/form/range-input";
import { SwitchCard } from "@/components/shared/form/switch-card";
import { TagInput } from "@/components/shared/form/tag-input";
import { SectionCard } from "@/components/shared/section-card";
import { EDUCATION_LEVELS } from "@/lib/constants";

const GENDER_OPTIONS = [
  { value: "none", label: "No preference" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export function FormDemo() {
  const [include, setInclude] = useState({ education: true, major: true, gpa: true, service: true, gender: true, age: true });
  const toggle = (key: keyof typeof include) => (value: boolean) => setInclude((prev) => ({ ...prev, [key]: value }));
  const [majors, setMajors] = useState(["Accounting"]);
  const [acceptRelated, setAcceptRelated] = useState(true);
  const [gender, setGender] = useState("none");
  const [ageMin, setAgeMin] = useState("25");
  const [ageMax, setAgeMax] = useState("30");
  const [advanced, setAdvanced] = useState(false);

  return (
    <div className="flex max-w-[960px] flex-col gap-6">
      <SectionCard title="Vacancy Information" description="Default and error states.">
        <FormField label="Job Title" htmlFor="fd-title" required>
          <Input id="fd-title" placeholder="e.g. Accounting Officer" />
        </FormField>
        <FormField label="Job Title" htmlFor="fd-title-error" required error="Enter a job title.">
          <Input id="fd-title-error" placeholder="e.g. Accounting Officer" />
        </FormField>
        <FormField label="Job Description" htmlFor="fd-desc" required error="Enter a job description.">
          <Textarea id="fd-desc" placeholder="Describe the purpose of this role..." />
        </FormField>
        <FormField label="Responsibilities" htmlFor="fd-resp" helper="Each line becomes one bullet point.">
          <Textarea id="fd-resp" placeholder="One responsibility per line" />
        </FormField>
      </SectionCard>

      <SectionCard title="Requirements" description="Uncheck a requirement to leave it out of the search.">
        <FieldGroup title="Education">
          <IncludeField id="fd-edu" label="Education Level" included={include.education} onIncludedChange={toggle("education")}>
            {({ disabled, labelId }) => (
              <Select defaultValue="Bachelor (S1)" disabled={disabled}>
                <SelectTrigger className="w-full" aria-labelledby={labelId}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </IncludeField>
          <IncludeField id="fd-major" label="Major" included={include.major} onIncludedChange={toggle("major")}>
            {({ disabled, labelId }) => (
              <>
                <TagInput id="fd-major-input" tags={majors} onChange={setMajors} disabled={disabled} aria-labelledby={labelId} />
                <div className="flex items-center gap-2">
                  <Checkbox id="fd-related" checked={acceptRelated} disabled={disabled} onCheckedChange={(checked) => setAcceptRelated(checked === true)} />
                  <Label htmlFor="fd-related" className="text-[13px] font-normal">Accept related majors</Label>
                </div>
              </>
            )}
          </IncludeField>
          <IncludeField id="fd-gpa" label="Min. GPA" included={include.gpa} onIncludedChange={toggle("gpa")} helper="On a 4.00 scale.">
            {({ disabled, labelId, helperId }) => (
              <NumberInput defaultValue="3.00" step="0.01" disabled={disabled} aria-labelledby={labelId} aria-describedby={helperId} />
            )}
          </IncludeField>
        </FieldGroup>
        <Separator />
        <FieldGroup title="Employment">
          <IncludeField id="fd-service" label="Min. length of service" included={include.service} onIncludedChange={toggle("service")} helper="Time at Kalbe, from each talent's hire date.">
            {({ disabled, labelId, helperId }) => (
              <NumberInput defaultValue={1} suffix="years" disabled={disabled} aria-labelledby={labelId} aria-describedby={helperId} />
            )}
          </IncludeField>
          <IncludeField id="fd-weight" label="Weight demo (always on)" included onIncludedChange={() => undefined}>
            {({ labelId }) => <NumberInput defaultValue={30} suffix="%" aria-labelledby={labelId} />}
          </IncludeField>
        </FieldGroup>
        <Separator />
        <FieldGroup title="Preferences">
          <IncludeField id="fd-gender" label="Gender preference" included={include.gender} onIncludedChange={toggle("gender")} className="col-span-2">
            {({ disabled, labelId }) => (
              <RadioPills id="fd-gender-pills" options={GENDER_OPTIONS} value={gender} onChange={setGender} disabled={disabled} aria-labelledby={labelId} />
            )}
          </IncludeField>
          <IncludeField id="fd-age" label="Age preference (years)" included={include.age} onIncludedChange={toggle("age")}>
            {({ disabled }) => (
              <RangeInput
                id="fd-age-range"
                minValue={ageMin}
                maxValue={ageMax}
                onMinChange={setAgeMin}
                onMaxChange={setAgeMax}
                minLabel="Minimum age"
                maxLabel="Maximum age"
                disabled={disabled}
              />
            )}
          </IncludeField>
        </FieldGroup>
      </SectionCard>

      <SwitchCard
        id="fd-advanced"
        title="Advanced mode"
        description="Set how much each parameter counts toward the match score."
        checked={advanced}
        onCheckedChange={setAdvanced}
      >
        <p className="text-sm text-muted-foreground">Scoring weights render here (B12).</p>
      </SwitchCard>
    </div>
  );
}
