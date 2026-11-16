export type AuditModule = "Authentication" | "Talent Recommendation" | "Talent Management" | "User Management";

export interface AuditEntry {
  id: string; // "a-01" …
  user: string; // username
  module: AuditModule;
  action: string;
  date: string; // "2026-11-10", used by the date filter
  time: string; // ISO "2026-11-10T14:05:12", used for sorting
}

/** In the filter's order. */
export const AUDIT_MODULES: readonly AuditModule[] = [
  "Authentication",
  "Talent Management",
  "Talent Recommendation",
  "User Management",
];

// ── Generator (AL01, copied exactly) ─────────────────────────────────────────

const USERS = ["andi.pratama", "citra.wijaya", "hendra.kurniawan", "maya.hidayat"];
const JOBS = ["Accounting Officer", "QA Supervisor", "Production Planner", "R&D Formulation Lead", "Regulatory Affairs Specialist", "Digital Product Manager"];
const PEOPLE = ["Budi Santoso", "Dewi Lestari", "Fajar Saputra", "Gita Nugroho", "Indah Siregar", "Lukman Hidayat", "Nadia Wijaya"];
const ACCTS = ["budi.santoso", "fajar.saputra", "nadia.wijaya", "gita.nugroho", "indah.siregar"];
const pick = <T,>(arr: T[], i: number) => arr[i % arr.length];

const EVENTS: [AuditModule, (i: number) => string][] = [
  ["Authentication", () => "Signed in"],
  ["Talent Recommendation", (i) => `Created new candidate search “${pick(JOBS, i)}”`],
  ["Talent Recommendation", (i) => `Started candidate search “${pick(JOBS, i + 2)}”`],
  ["Talent Management", (i) => `Updated talent “${pick(PEOPLE, i)}”`],
  ["Talent Management", (i) => `Added new talent “${pick(PEOPLE, i + 3)}”`],
  ["Authentication", () => "Signed out"],
  ["Talent Management", (i) => `Bulk imported ${12 + ((i * 7) % 40)} talents`],
  ["User Management", (i) => `Approved activation request for “${pick(ACCTS, i)}”`],
  ["Talent Management", (i) => `Deleted talent “${pick(PEOPLE, i + 5)}”`],
  ["Authentication", () => "Signed in"],
  ["User Management", (i) => `Deactivated user “${pick(ACCTS, i + 2)}”`],
  ["Talent Recommendation", (i) => `Edited candidate search “${pick(JOBS, i + 4)}”`],
];

const ENTRY_COUNT = 46;
const NEWEST_ENTRY_TIME = Date.UTC(2026, 10, 10, 14, 5, 12); // a fixed start, so output is deterministic
const MINUTE_MS = 60_000;
const SECOND_MS = 1000;

const pad2 = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DDTHH:mm:ss" from the UTC parts only, so server and client agree. */
function isoUtc(ms: number): string {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}T${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())}`;
}

function buildEntries(): AuditEntry[] {
  const entries: AuditEntry[] = [];
  let t = NEWEST_ENTRY_TIME;
  for (let i = 0; i < ENTRY_COUNT; i++) {
    const [module, action] = EVENTS[(i * 5) % EVENTS.length];
    const user = module === "User Management" ? "peta.admin" : USERS[(i * 3) % 4];
    const time = isoUtc(t);
    entries.push({ id: `a-${pad2(i + 1)}`, user, module, action: action(i), date: time.slice(0, 10), time });
    t -= (17 + ((i * 37) % 190)) * MINUTE_MS + ((i * 13) % 59) * SECOND_MS;
  }
  return entries;
}

/** Built once at module load. */
export const AUDIT_ENTRIES: readonly AuditEntry[] = buildEntries();
