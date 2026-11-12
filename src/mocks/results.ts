import type { SearchResult } from "@/lib/types";

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
