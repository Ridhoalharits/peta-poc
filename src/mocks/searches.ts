import type { CandidateSearch } from "@/lib/types";

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
