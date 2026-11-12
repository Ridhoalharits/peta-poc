import type {
  EducationLevel,
  EmployeeType,
  ManagementLevel,
  RequirementKey,
  SearchCriteria,
  SearchStatus,
  WeightKey,
} from "@/lib/types";

/** Ordered from lowest to highest rank; the index is also the sort order. */
export const MANAGEMENT_LEVELS: readonly ManagementLevel[] = [
  "Officer",
  "Supervisor",
  "Manager",
  "Senior Manager",
  "General Manager",
];

export const EDUCATION_LEVELS: readonly EducationLevel[] = [
  "Diploma (D3)",
  "Bachelor (S1)",
  "Master (S2)",
  "Doctorate (S3)",
];

// "Internship" is still shown in the mockup; whether it stays is an open product question.
export const EMPLOYEE_TYPES: readonly EmployeeType[] = ["Permanent", "Fixed Term", "Internship"];

export const STATUS_LABEL: Record<SearchStatus, string> = {
  draft: "Draft",
  searching: "Searching",
  completed: "Completed",
  failed: "Failed",
};

export const STATUS_SORT_ORDER: Record<SearchStatus, number> = {
  draft: 1,
  searching: 2,
  completed: 3,
  failed: 4,
};

export interface WeightParam {
  key: WeightKey;
  label: string;
  defaultWeight: number;
  /** The requirement that, when unchecked, disables this weight. */
  linkedRequirement?: RequirementKey;
}

export const WEIGHT_PARAMS: readonly WeightParam[] = [
  { key: "jobFamily", label: "Job Family", defaultWeight: 30 },
  { key: "lengthOfService", label: "Length of Service", defaultWeight: 20, linkedRequirement: "lengthOfService" },
  { key: "educationLevel", label: "Education Level", defaultWeight: 20, linkedRequirement: "education" },
  { key: "managementLevel", label: "Management Level", defaultWeight: 15, linkedRequirement: "managementLevel" },
  { key: "age", label: "Age", defaultWeight: 7.5, linkedRequirement: "age" },
  { key: "localProximity", label: "Local Proximity", defaultWeight: 7.5 },
];

export const DEFAULT_WEIGHTS = Object.fromEntries(
  WEIGHT_PARAMS.map((param) => [param.key, param.defaultWeight]),
) as Record<WeightKey, number>;

export const DEFAULT_CRITERIA: SearchCriteria = {
  jobTitle: "",
  jobDescription: "",
  responsibilities: "",
  include: {
    education: true,
    major: true,
    gpa: true,
    lengthOfService: true,
    employeeType: true,
    managementLevel: true,
    gender: true,
    age: true,
  },
  educationLevel: "Bachelor (S1)",
  majors: ["Accounting"],
  acceptRelatedMajors: true,
  minGpa: 3.0,
  minLengthOfServiceYears: 1,
  employeeType: "Fixed Term",
  managementLevel: "Officer",
  gender: "none",
  ageMin: 25,
  ageMax: 30,
  advancedMode: false,
  weights: DEFAULT_WEIGHTS,
};

export const PREFILLED_CRITERIA: SearchCriteria = {
  ...DEFAULT_CRITERIA,
  jobTitle: "Accounting Officer",
  jobDescription:
    "Records and reconciles daily transactions for the Finance division and prepares the monthly closing reports.",
  responsibilities:
    "Post journal entries to the general ledger\nReconcile bank and vendor accounts\nPrepare monthly closing reports",
  minLengthOfServiceYears: 2,
  advancedMode: true,
};

export const CURRENT_USER = { name: "Rina Kusuma", role: "HR Manager", initials: "RK" } as const;
