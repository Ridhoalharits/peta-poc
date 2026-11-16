import { LOCATIONS } from "@/lib/constants";
import { ageOn, monthsBetween } from "@/lib/format";
import type { EducationLevel, Gender, ManagementLevel } from "@/lib/types";

// ── Types ────────────────────────────────────────────────────────────────────

export type TalentEmployeeType = "Permanent" | "Fixed Term";
export type WorkSpace = "On-site" | "Hybrid" | "Remote";

export interface Talent {
  id: string; // "t-01" … "t-32"
  fullName: string;
  dob: string; // ISO "1994-03-14"
  cityOfBirth: string;
  age: number;
  gender: Gender;
  maritalStatus: string;
  religion: string;
  education: EducationLevel;
  fieldOfStudy: string;
  degrees: string;
  employeeType: TalentEmployeeType;
  hireDate: string; // ISO
  lengthOfServiceMonths: number;
  position: string;
  jobTitle: string;
  businessTitle: string;
  level: ManagementLevel;
  jobFamilyGroup: string;
  jobFamily: string;
  jobProfile: string;
  location: string;
  workSpace: WorkSpace;
}

export type TalentColumnKey = Exclude<keyof Talent, "id">;

export interface TalentColumn {
  key: TalentColumnKey;
  label: string;
  width: number; // px
  numeric?: boolean;
  /** Always shown; can't be hidden in View settings. */
  locked?: boolean;
}

// ── Generator lists (TM01 §2, copied exactly) ────────────────────────────────

const F: [string, Gender][] = [["Andi","Male"],["Budi","Male"],["Citra","Female"],["Dewi","Female"],["Eko","Male"],["Fajar","Male"],["Gita","Female"],["Hendra","Male"],
  ["Indah","Female"],["Joko","Male"],["Kartika","Female"],["Lukman","Male"],["Maya","Female"],["Nadia","Female"],["Oki","Male"],["Putri","Female"]];
const L = ["Pratama","Santoso","Wijaya","Lestari","Saputra","Hidayat","Kurniawan","Rahmawati","Siregar","Nugroho"];
const CITY = ["Jakarta","Bandung","Surabaya","Medan","Semarang","Yogyakarta","Makassar","Palembang","Bogor","Malang"];
const MAR = ["Single","Married","Married","Divorced","Married"];
const REL = ["Islam","Islam","Christian","Islam","Catholic","Islam","Hindu","Islam","Buddhist","Islam"];
const STUDY = [["Accounting","S.Ak."],["Pharmacy","S.Farm."],["Industrial Engineering","S.T."],["Management","S.E."],["Chemistry","S.Si."],["Information Systems","S.Kom."],["Psychology","S.Psi."]];
const EDU: EducationLevel[] = ["Bachelor (S1)","Bachelor (S1)","Master (S2)","Diploma (D3)","Bachelor (S1)"];
const ET: TalentEmployeeType[] = ["Permanent","Permanent","Fixed Term","Permanent","Fixed Term"];
// [position, jobTitle, businessTitle, level, jobFamilyGroup, jobFamily, jobProfile]
const JOB: [string, string, string, ManagementLevel, string, string, string][] = [
  ["Accounting Officer","Accounting Officer","General Ledger Officer","Officer","Finance","Accounting","Accountant"],
  ["QA Supervisor","Quality Assurance Supervisor","QA Release Supervisor","Supervisor","Quality","Quality Assurance","QA Specialist"],
  ["Production Manager","Production Manager","Plant Production Manager","Manager","Operations","Manufacturing","Production Lead"],
  ["Formulation Scientist","Formulation Scientist","Senior Formulation Scientist","Officer","Research & Development","Formulation","Scientist"],
  ["HR Business Partner","HR Business Partner","HRBP – Commercial","Manager","Human Resources","HR Business Partnering","HR Generalist"],
  ["IT Product Manager","Product Manager","Digital Product Manager","Manager","Information Technology","Product Management","Product Manager"],
  ["Supply Chain Planner","Demand Planner","Demand & Supply Planner","Officer","Supply Chain","Planning","Planner"],
  ["Regulatory Affairs Supervisor","Regulatory Affairs Supervisor","RA Registration Supervisor","Supervisor","Regulatory","Regulatory Affairs","RA Specialist"],
  ["Head of Finance","Finance Senior Manager","Head of Corporate Finance","Senior Manager","Finance","Corporate Finance","Finance Leader"],
];
const LOC = LOCATIONS; // "Jakarta HQ","Cikarang Plant","Bekasi Plant","Surabaya Office","Bandung Office"
const WS: WorkSpace[] = ["On-site","On-site","Hybrid","Remote"];

const TALENT_COUNT = 32;
const LATEST_HIRE_YEAR = 2025;

// ── Generator (TM01 §3) ──────────────────────────────────────────────────────

function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function jobFields(n: number) {
  const [position, jobTitle, businessTitle, level, jobFamilyGroup, jobFamily, jobProfile] = JOB[n];
  return { position, jobTitle, businessTitle, level, jobFamilyGroup, jobFamily, jobProfile };
}

function degreesFor(education: EducationLevel, degree: string): string {
  if (education === "Master (S2)") return `${degree}, M.M.`;
  if (education === "Diploma (D3)") return "A.Md.";
  return degree;
}

function generateTalent(i: number): Talent {
  const [firstName, gender] = F[i % 16];
  const birthYear = 1972 + ((i * 7) % 26);
  const dob = isoDate(birthYear, ((i * 5) % 12) + 1, ((i * 11) % 28) + 1);
  const hireYear = Math.min(LATEST_HIRE_YEAR, Math.max(birthYear + 23, 2006 + ((i * 3) % 20)));
  const hireDate = isoDate(hireYear, ((i * 7) % 12) + 1, ((i * 13) % 28) + 1);
  const education = EDU[i % 5];
  const [fieldOfStudy, degree] = STUDY[(i * 5) % 7];

  return {
    id: `t-${String(i + 1).padStart(2, "0")}`,
    fullName: `${firstName} ${L[(i * 3) % 10]}`,
    dob,
    cityOfBirth: CITY[(i * 3) % 10],
    age: ageOn(dob),
    gender,
    maritalStatus: MAR[i % 5],
    religion: REL[(i * 7) % 10],
    education,
    fieldOfStudy,
    degrees: degreesFor(education, degree),
    employeeType: ET[i % 5],
    hireDate,
    lengthOfServiceMonths: monthsBetween(hireDate),
    ...jobFields((i * 4) % 9),
    location: LOC[(i * 2) % 5],
    workSpace: WS[i % 4],
  };
}

// The Talent Recommendation candidates (TR01 results), so a result name opens the same person.
const CANDIDATE_OVERRIDES: [string, Gender, number][] = [
  ["Citra Wijaya", "Female", 0],
  ["Andi Pratama", "Male", 0],
  ["Maya Hidayat", "Female", 6],
  ["Fajar Santoso", "Male", 0],
  ["Dewi Lestari", "Female", 3],
  ["Hendra Kurniawan", "Male", 1],
  ["Nadia Saputra", "Female", 6],
  ["Oki Rahmawati", "Male", 0],
];

// t-01 is the TM-09 profile sample: every field is fixed.
const PROFILE_SAMPLE_DOB = "1994-03-14";
const PROFILE_SAMPLE_HIRE_DATE = "2022-07-04";
const PROFILE_SAMPLE: Omit<Talent, "id"> = {
  fullName: "Citra Wijaya",
  dob: PROFILE_SAMPLE_DOB,
  cityOfBirth: "Surabaya",
  age: ageOn(PROFILE_SAMPLE_DOB),
  gender: "Female",
  maritalStatus: "Married",
  religion: "Islam",
  education: "Bachelor (S1)",
  fieldOfStudy: "Accounting",
  degrees: "S.Ak.",
  employeeType: "Permanent",
  hireDate: PROFILE_SAMPLE_HIRE_DATE,
  lengthOfServiceMonths: monthsBetween(PROFILE_SAMPLE_HIRE_DATE),
  ...jobFields(0),
  location: "Jakarta HQ",
  workSpace: "Hybrid",
};

function buildTalents(): Talent[] {
  const talents = Array.from({ length: TALENT_COUNT }, (_, i) => generateTalent(i));
  CANDIDATE_OVERRIDES.forEach(([fullName, gender, jobIndex], i) => {
    talents[i] = { ...talents[i], fullName, gender, ...jobFields(jobIndex) };
  });
  talents[0] = { id: talents[0].id, ...PROFILE_SAMPLE };
  return talents;
}

/** Built once at module load. Deterministic: same output on server and client. */
export const TALENTS: readonly Talent[] = buildTalents();

// ── Columns (TM01 §4) ────────────────────────────────────────────────────────

export const TALENT_COLUMNS: readonly TalentColumn[] = [
  { key: "fullName", label: "Full Name", width: 240, locked: true },
  { key: "dob", label: "Date of Birth", width: 140 },
  { key: "cityOfBirth", label: "City of Birth", width: 140 },
  { key: "age", label: "Age", width: 80, numeric: true },
  { key: "gender", label: "Gender", width: 110 },
  { key: "maritalStatus", label: "Marital Status", width: 150 },
  { key: "religion", label: "Religion", width: 120 },
  { key: "education", label: "Education", width: 150 },
  { key: "fieldOfStudy", label: "Field of Study", width: 200 },
  { key: "degrees", label: "Degrees", width: 140 },
  { key: "employeeType", label: "Employee Type", width: 150 },
  { key: "lengthOfServiceMonths", label: "Length of Service in Months", width: 230, numeric: true },
  { key: "hireDate", label: "Hire Date", width: 130 },
  { key: "position", label: "Position", width: 230 },
  { key: "jobTitle", label: "Job Title", width: 240 },
  { key: "businessTitle", label: "Business Title", width: 240 },
  { key: "level", label: "Management Level", width: 180 },
  { key: "jobFamilyGroup", label: "Job Family Group", width: 210 },
  { key: "jobFamily", label: "Job Family", width: 200 },
  { key: "jobProfile", label: "Job Profile", width: 160 },
  { key: "location", label: "Location", width: 160 },
  { key: "workSpace", label: "Work Space", width: 130 },
];

// ── Options used by the dialogs ──────────────────────────────────────────────

export const JOB_FAMILIES: Record<string, string[]> = {
  Finance: ["Accounting", "Corporate Finance", "Tax"],
  Quality: ["Quality Assurance"],
  Operations: ["Manufacturing"],
  "Research & Development": ["Formulation"],
  "Human Resources": ["HR Business Partnering"],
  "Information Technology": ["Product Management"],
  "Supply Chain": ["Planning"],
  Regulatory: ["Regulatory Affairs"],
};
export const MARITAL_STATUSES: readonly string[] = ["Single", "Married", "Divorced", "Widowed"];
export const RELIGIONS: readonly string[] = ["Islam", "Christian", "Catholic", "Hindu", "Buddhist", "Confucian"];
export const WORK_SPACES: readonly WorkSpace[] = ["On-site", "Hybrid", "Remote"];
export const TALENT_EMPLOYEE_TYPES: readonly TalentEmployeeType[] = ["Permanent", "Fixed Term"];

// ── Bulk import sample (TM07) ────────────────────────────────────────────────

export const IMPORT_FILE = { name: "talent_batch_oct2026.xlsx", rows: 31, size: "84 KB", imported: 28 } as const;

export interface ImportSkippedRow {
  row: number;
  column: string;
  problem: string;
}

export const IMPORT_SKIPPED: readonly ImportSkippedRow[] = [
  { row: 5, column: "Hire Date", problem: "“2026-13-02” is not a valid date. Use YYYY-MM-DD." },
  { row: 12, column: "Management Level", problem: "“Staf” is not a management level in PETA." },
  { row: 19, column: "Full Name", problem: "This required field is empty." },
];
