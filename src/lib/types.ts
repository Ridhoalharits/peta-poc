export type SearchStatus = "draft" | "searching" | "completed" | "failed";
export type ManagementLevel = "Officer" | "Supervisor" | "Manager" | "Senior Manager" | "General Manager";
export type EducationLevel = "Diploma (D3)" | "Bachelor (S1)" | "Master (S2)" | "Doctorate (S3)";
export type EmployeeType = "Permanent" | "Fixed Term" | "Internship";
export type GenderPreference = "none" | "male" | "female";
export type WeightKey =
  | "jobFamily"
  | "lengthOfService"
  | "educationLevel"
  | "managementLevel"
  | "age"
  | "localProximity";

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
  id: string; // "s-001"
  position: string; // vacant position / job title
  level: ManagementLevel;
  createdAt: string; // ISO date "2026-10-22"
  status: SearchStatus;
  resultCount?: number; // only for completed; 0 = TR-06 not found
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
