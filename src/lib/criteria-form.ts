import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldErrors, Resolver } from "react-hook-form";
import { z } from "zod";
import type {
  EducationLevel,
  EmployeeType,
  GenderPreference,
  ManagementLevel,
  RequirementKey,
  SearchCriteria,
  WeightKey,
} from "@/lib/types";
import { WEIGHTS_TARGET_TOTAL, weightsTotal } from "@/lib/weights";

const GPA_DECIMALS = 2;

/**
 * Candidate Search form values. Number fields are kept as the text the user typed
 * (so "3." or "3.00" don't get reformatted mid-typing). Only the two required fields are validated (B11).
 */
export const criteriaFormSchema = z.object({
  jobTitle: z.string().trim().min(1, "Enter a job title."),
  jobDescription: z.string().trim().min(1, "Enter a job description."),
  responsibilities: z.string(),
  include: z.custom<Record<RequirementKey, boolean>>(),
  educationLevel: z.custom<EducationLevel>(),
  majors: z.array(z.string()),
  acceptRelatedMajors: z.boolean(),
  minGpa: z.string(),
  minLengthOfServiceYears: z.string(),
  employeeType: z.custom<EmployeeType>(),
  managementLevel: z.custom<ManagementLevel>(),
  gender: z.custom<GenderPreference>(),
  ageMin: z.string(),
  ageMax: z.string(),
  advancedMode: z.boolean(),
  weights: z.custom<Record<WeightKey, string>>(),
});

export type CriteriaFormInput = z.input<typeof criteriaFormSchema>;
export type CriteriaFormOutput = z.output<typeof criteriaFormSchema>;

export function toFormValues(criteria: SearchCriteria): CriteriaFormInput {
  return {
    ...criteria,
    majors: [...criteria.majors],
    include: { ...criteria.include },
    minGpa: criteria.minGpa.toFixed(GPA_DECIMALS),
    minLengthOfServiceYears: String(criteria.minLengthOfServiceYears),
    ageMin: String(criteria.ageMin),
    ageMax: String(criteria.ageMax),
    weights: Object.fromEntries(
      Object.entries(criteria.weights).map(([key, weight]) => [key, String(weight)]),
    ) as Record<WeightKey, string>,
  };
}

/** Typed text → number. Empty or invalid text becomes NaN, which JSON serialises as null. */
function parseNumber(text: string): number {
  const trimmed = text.trim();
  return trimmed === "" ? Number.NaN : Number(trimmed);
}

/** Validated form values → the SearchCriteria shape the API takes. */
export function toCriteria(values: CriteriaFormOutput): SearchCriteria {
  return {
    ...values,
    minGpa: parseNumber(values.minGpa),
    minLengthOfServiceYears: parseNumber(values.minLengthOfServiceYears),
    ageMin: parseNumber(values.ageMin),
    ageMax: parseNumber(values.ageMax),
    weights: Object.fromEntries(
      Object.entries(values.weights).map(([key, weight]) => [key, parseNumber(weight)]),
    ) as Record<WeightKey, number>,
  };
}

export const WEIGHTS_ERROR_MESSAGE = "Make the scoring weights add up to 100%.";

const zodCriteriaResolver = zodResolver(criteriaFormSchema);

/** Zod validation plus the Advanced mode rule: weights must total 100% (B12). */
export const criteriaFormResolver: Resolver<CriteriaFormInput, unknown, CriteriaFormOutput> = async (
  values,
  context,
  options,
) => {
  const result = await zodCriteriaResolver(values, context, options);
  const weightsInvalid = values.advancedMode && weightsTotal(values.weights, values.include) !== WEIGHTS_TARGET_TOTAL;
  if (!weightsInvalid) return result;
  return {
    values: {},
    errors: { ...result.errors, weights: { type: "total", message: WEIGHTS_ERROR_MESSAGE } as FieldErrors<CriteriaFormInput>["weights"] },
  };
};

interface FormAlertProblems {
  missingTitle: boolean;
  missingDescription: boolean;
  weightsInvalid: boolean;
}

function missingFieldsSentence(missingTitle: boolean, missingDescription: boolean): string | undefined {
  if (missingTitle && missingDescription) return "Add the job title and job description.";
  if (missingTitle) return "Add the job title.";
  if (missingDescription) return "Add the job description.";
  return undefined;
}

/** Alert text: the missing-field sentence first, then the weights sentence. */
export function formAlertMessage({ missingTitle, missingDescription, weightsInvalid }: FormAlertProblems): string {
  return [missingFieldsSentence(missingTitle, missingDescription), weightsInvalid ? WEIGHTS_ERROR_MESSAGE : undefined]
    .filter(Boolean)
    .join(" ");
}
