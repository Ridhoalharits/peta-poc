import type { EducationLevel, EmployeeType, ManagementLevel } from "@/lib/types";

// ── Types ────────────────────────────────────────────────────────────────────

export type SearchStatus = "draft" | "searching" | "completed" | "failed";
export type GenderPreference = "none" | "male" | "female";
export type WeightKey = "jobFamily" | "lengthOfService" | "educationLevel" | "managementLevel" | "age" | "localProximity";
export type RequirementKey =
  | "education"
  | "major"
  | "gpa"
  | "lengthOfService"
  | "employeeType"
  | "managementLevel"
  | "gender"
  | "age";

export interface CandidateSearch {
  id: string;
  position: string;
  level: ManagementLevel;
  createdAt: string; // ISO date
  status: SearchStatus;
  resultCount?: number; // completed only; 0 = TR-06 not found
}

export interface SearchCriteria {
  jobTitle: string;
  jobDescription: string;
  responsibilities: string;
  include: Record<RequirementKey, boolean>;
  educationLevel: EducationLevel;
  majors: string[];
  acceptRelatedMajors: boolean;
  minGpa: number;
  minLengthOfServiceYears: number;
  employeeType: EmployeeType;
  managementLevel: ManagementLevel;
  gender: GenderPreference;
  ageMin: number;
  ageMax: number;
  advancedMode: boolean;
  weights: Record<WeightKey, number>;
}

export interface SearchResult {
  rank: number;
  talentId: string;
  name: string;
  position: string;
  level: ManagementLevel;
  score: number;
  justification: string;
}

export interface WeightParam {
  key: WeightKey;
  label: string;
  defaultWeight: number;
  /** The requirement that, when unchecked, disables this weight. */
  linkedRequirement?: RequirementKey;
}

// ── Constants ────────────────────────────────────────────────────────────────

// "Internship" is still shown in the mockup; whether it stays is an open product question.
export const SEARCH_EMPLOYEE_TYPES: readonly EmployeeType[] = ["Permanent", "Fixed Term", "Internship"];

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

export const WEIGHT_PARAMS: readonly WeightParam[] = [
  { key: "jobFamily", label: "Job Family", defaultWeight: 30 },
  { key: "lengthOfService", label: "Length of Service", defaultWeight: 20, linkedRequirement: "lengthOfService" },
  { key: "educationLevel", label: "Education Level", defaultWeight: 20, linkedRequirement: "education" },
  { key: "managementLevel", label: "Management Level", defaultWeight: 15, linkedRequirement: "managementLevel" },
  { key: "age", label: "Age", defaultWeight: 7.5, linkedRequirement: "age" },
  { key: "localProximity", label: "Local Proximity", defaultWeight: 7.5 },
];

export const DEFAULT_WEIGHTS = Object.fromEntries(
  WEIGHT_PARAMS.map((weightParam) => [weightParam.key, weightParam.defaultWeight]),
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
  jobDescription:
    "Records and reconciles daily transactions for the Finance division and prepares the monthly closing reports.",
  responsibilities:
    "Post journal entries to the general ledger\nReconcile bank and vendor accounts\nPrepare monthly closing reports",
  minLengthOfServiceYears: 2,
  advancedMode: true,
};

// ── Data ─────────────────────────────────────────────────────────────────────

export const SEARCHES: CandidateSearch[] = [
  { id: "s-001", position: "Accounting Officer", level: "Officer", createdAt: "2026-10-22", status: "searching" },
  { id: "s-002", position: "QA Supervisor", level: "Supervisor", createdAt: "2026-10-15", status: "completed", resultCount: 8 },
  { id: "s-003", position: "Production Planner", level: "Officer", createdAt: "2026-10-09", status: "draft" },
  { id: "s-004", position: "Maintenance Engineer", level: "Supervisor", createdAt: "2026-10-02", status: "failed" },
  { id: "s-005", position: "R&D Formulation Lead", level: "Manager", createdAt: "2026-09-28", status: "completed", resultCount: 8 },
  { id: "s-006", position: "Regulatory Affairs Specialist", level: "Officer", createdAt: "2026-09-22", status: "completed", resultCount: 8 },
  { id: "s-007", position: "Warehouse Supervisor", level: "Supervisor", createdAt: "2026-09-10", status: "completed", resultCount: 8 },
  { id: "s-008", position: "Digital Product Manager", level: "Manager", createdAt: "2026-09-03", status: "draft" },
  { id: "s-009", position: "Head of Supply Chain", level: "General Manager", createdAt: "2026-08-27", status: "completed", resultCount: 0 },
];

/** Every completed search with results returns these. */
export const RESULTS: SearchResult[] = [
  {
    rank: 1, talentId: "t-01", name: "Citra Wijaya", position: "Accounting Officer", level: "Officer", score: 92,
    justification:
      "Bachelor (S1) in Accounting, GPA 3.62. Four years of service, already doing General Ledger accounting in the Finance job family, the same work this vacancy covers. Same management level, so this would be a lateral move with no promotion gap.",
  },
  {
    rank: 2, talentId: "t-02", name: "Andi Pratama", position: "Accounting Officer", level: "Officer", score: 88,
    justification:
      "Bachelor (S1) in Accounting, GPA 3.31. Two years of service in accounts payable within Finance, with relevant reconciliation work. Already at Officer level.",
  },
  {
    rank: 3, talentId: "t-03", name: "Maya Hidayat", position: "Supply Chain Planner", level: "Officer", score: 81,
    justification:
      "Bachelor (S1) in Management, a related major, GPA 3.48. Handles budget and cost tracking as a planner, which transfers to accounting work. Officer level.",
  },
  {
    rank: 4, talentId: "t-04", name: "Fajar Santoso", position: "Accounting Officer", level: "Officer", score: 79,
    justification:
      "Diploma (D3) in Accounting with strong General Ledger work and six years of service. Scored lower because the vacancy asks for Bachelor (S1).",
  },
  {
    rank: 5, talentId: "t-05", name: "Dewi Lestari", position: "Formulation Scientist", level: "Officer", score: 68,
    justification:
      "Bachelor (S1) with GPA 3.70, but the major (Chemistry) is outside accounting and related fields. Officer level.",
  },
  {
    rank: 6, talentId: "t-06", name: "Hendra Kurniawan", position: "QA Supervisor", level: "Supervisor", score: 63,
    justification:
      "Bachelor (S1) in Management, a related major. One level above the vacancy, so this would be a step down.",
  },
  {
    rank: 7, talentId: "t-07", name: "Nadia Saputra", position: "Supply Chain Planner", level: "Officer", score: 58,
    justification:
      "Bachelor (S1) in Industrial Engineering. Some cost reporting work, but the major is not related to accounting.",
  },
  {
    rank: 8, talentId: "t-08", name: "Oki Rahmawati", position: "Accounting Officer", level: "Officer", score: 55,
    justification:
      "Bachelor (S1) in Accounting, but GPA 2.90 is below the 3.00 minimum. Shown because the rest of the profile matches well.",
  },
];
