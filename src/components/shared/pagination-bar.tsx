"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const PAGE_SIZES = [10, 25, 50];

interface PaginationBarProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** e.g. "Showing 1–10 of 46 entries" */
  summary: string;
  /** "Rows per page" shows only when both are given (Talent Management). */
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}

/** DESIGN-SYSTEM §11.6. Goes in a DataTable `footer`. */
export function PaginationBar({ page, pageCount, onPageChange, summary, pageSize, onPageSizeChange }: PaginationBarProps) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-6">
        <span>{summary}</span>
        {pageSize !== undefined && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span id="rows-per-page">Rows per page</span>
            <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger aria-labelledby="rows-per-page" className="w-[72px] data-[size=default]:h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <Button variant="ghost" className="h-9 disabled:opacity-50" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft aria-hidden />
          Previous
        </Button>
        {pages.map((pageNumber) => {
          const current = pageNumber === page;
          return (
            <Button
              key={pageNumber}
              variant={current ? "outline" : "ghost"}
              aria-label={`Page ${pageNumber}`}
              aria-current={current ? "page" : undefined}
              className={cn("size-9 p-0 text-foreground", !current && "border-transparent")}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          );
        })}
        <Button variant="ghost" className="h-9 disabled:opacity-50" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
          Next
          <ChevronRight aria-hidden />
        </Button>
      </nav>
    </div>
  );
}
