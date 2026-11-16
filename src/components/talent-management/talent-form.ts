import { z } from "zod";
import type { Talent } from "@/lib/data/talent-management";

/** Text and selects are plain strings; "" means empty / nothing selected (the Select shows "Select…"). */
export const talentFormSchema = z.object({
  fullName: z.string().trim().min(1, "Enter the talent's full name."),
  dob: z.string().min(1, "Enter the date of birth."),
  cityOfBirth: z.string(),
  gender: z.string(),
  maritalStatus: z.string(),
  religion: z.string(),
  education: z.string(),
  fieldOfStudy: z.string(),
  degrees: z.string(),
  employeeType: z.string().min(1, "Select an employee type."),
  hireDate: z.string().min(1, "Enter the hire date."),
  position: z.string().trim().min(1, "Enter the position."),
  level: z.string().min(1, "Select a management level."),
  jobTitle: z.string(),
  businessTitle: z.string(),
  jobFamilyGroup: z.string(),
  jobFamily: z.string(),
  jobProfile: z.string(),
  location: z.string().min(1, "Select a location."),
  workSpace: z.string(),
});

export type TalentFormValues = z.infer<typeof talentFormSchema>;

export const EMPTY_TALENT_FORM: TalentFormValues = Object.fromEntries(
  Object.keys(talentFormSchema.shape).map((key) => [key, ""]),
) as TalentFormValues;

/** Edit: the talent's current values. Age and length of service are derived, so they aren't fields. */
export function talentToFormValues(talent: Talent): TalentFormValues {
  const values = { ...EMPTY_TALENT_FORM };
  for (const key of Object.keys(EMPTY_TALENT_FORM) as (keyof TalentFormValues)[]) {
    values[key] = String(talent[key] ?? "");
  }
  return values;
}

/** "7 required fields are empty." / "1 required field is empty." */
export function requiredFieldsMessage(count: number): string {
  return count === 1 ? "1 required field is empty." : `${count} required fields are empty.`;
}
