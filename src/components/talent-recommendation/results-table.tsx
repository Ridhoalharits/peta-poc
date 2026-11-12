import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RankCircle } from "@/components/shared/rank-circle";
import { ScoreBar } from "@/components/shared/score-bar";
import { SectionCard } from "@/components/shared/section-card";
import type { SearchResult } from "@/lib/types";
import { JustificationCell } from "./justification-cell";

// Widths measured from TR-05 (1.1fr / 1fr / 0.9fr / 2.4fr of the flexible space, Rank 64 px, Score 130 px).
const COLUMNS = [
  { label: "Rank", className: "w-16" },
  { label: "Name", className: "w-[17%]" },
  { label: "Current Position", className: "w-[15%]" },
  { label: "Current Management Level", className: "w-[14%]" },
  { label: "Score", className: "w-[130px]" },
  { label: "Justification", className: "w-[36%]" },
] as const;

const CELL_CLASSES = "px-4 py-5 align-top whitespace-normal";

function ResultRow({ result }: { result: SearchResult }) {
  return (
    <TableRow className="border-zinc-100 hover:bg-transparent">
      <TableCell className={CELL_CLASSES}>
        <RankCircle rank={result.rank} />
      </TableCell>
      <TableCell className={`${CELL_CLASSES} pt-6`}>
        <Link
          href={`/talent-management/${result.talentId}`}
          title="Open profile"
          className="group inline-flex items-center gap-1.5 rounded-sm text-sm font-medium outline-none hover:text-primary hover:underline focus-visible:ring-[3px] focus-visible:ring-ring"
        >
          {result.name}
          <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-primary" aria-hidden />
        </Link>
      </TableCell>
      <TableCell className={`${CELL_CLASSES} pt-6 text-[13px] text-zinc-600`}>{result.position}</TableCell>
      <TableCell className={`${CELL_CLASSES} pt-6 text-[13px] text-zinc-600`}>{result.level}</TableCell>
      <TableCell className={`${CELL_CLASSES} pt-6`}>
        <ScoreBar score={result.score} />
      </TableCell>
      <TableCell className={CELL_CLASSES}>
        <JustificationCell id={result.talentId} text={result.justification} />
      </TableCell>
    </TableRow>
  );
}

/** TR-05 ranked results. Not sortable; scrolls sideways inside the card below 1000 px. */
export function ResultsTable({ results }: { results: SearchResult[] }) {
  return (
    <SectionCard contentClassName="p-0 gap-0">
      <Table aria-label="Recommended candidates" className="min-w-[1000px] table-fixed">
        <colgroup>
          {COLUMNS.map((column) => (
            <col key={column.label} className={column.className} />
          ))}
        </colgroup>
        <TableHeader>
          <TableRow className="bg-table-header hover:bg-table-header">
            {COLUMNS.map((column) => (
              <TableHead
                key={column.label}
                scope="col"
                className="h-11 px-4 py-1 text-[13px] leading-[18px] font-medium whitespace-normal text-muted-foreground"
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <ResultRow key={result.talentId} result={result} />
          ))}
        </TableBody>
      </Table>
    </SectionCard>
  );
}
