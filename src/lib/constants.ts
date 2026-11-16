import type { EducationLevel, ManagementLevel } from "@/lib/types";

/** The PoC's fixed "now". Every age, length of service and date is calculated from this. */
export const TODAY = "2026-11-10";

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

export const LOCATIONS: readonly string[] = [
  "Jakarta HQ",
  "Cikarang Plant",
  "Bekasi Plant",
  "Surabaya Office",
  "Bandung Office",
];

export const JOB_FAMILY_GROUPS: readonly string[] = [
  "Finance",
  "Quality",
  "Operations",
  "Research & Development",
  "Human Resources",
  "Information Technology",
  "Supply Chain",
  "Regulatory",
];

export const CURRENT_USER = { name: "Rina Kusuma", role: "HR Manager", initials: "RK" } as const;
