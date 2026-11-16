"use client";

import { useRef } from "react";
import { Check, CircleCheck, Download, FileSpreadsheet, TriangleAlert, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMPORT_FILE, IMPORT_SKIPPED } from "@/lib/data/talent-management";
import { toastInfo } from "@/lib/toast";
import { cn } from "@/lib/utils";

const STEPS = ["Upload file", "Review"] as const;

/** DESIGN-SYSTEM §11.10: numbered circles joined by a 40 px line. */
export function ImportStepper({ current }: { current: 0 | 1 }) {
  return (
    <ol className="flex items-center gap-3" aria-label="Import steps">
      {STEPS.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={label} className="flex items-center gap-3" aria-current={active ? "step" : undefined}>
            {index > 0 && <span className="h-px w-10 bg-border" aria-hidden />}
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                active && "bg-primary text-primary-foreground",
                done && "bg-primary-soft text-primary",
                !active && !done && "bg-muted text-muted-foreground",
              )}
            >
              {done ? <Check className="size-3.5" aria-label="Done" /> : index + 1}
            </span>
            <span className={cn("text-sm", active ? "font-medium text-foreground" : "text-muted-foreground")}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function FileTile() {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
      <FileSpreadsheet className="size-5" aria-hidden />
    </span>
  );
}

/** Step 1. Browsing or dropping any file moves on; the file itself is ignored. */
export function UploadStep({ onFileChosen }: { onFileChosen: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="flex items-center gap-3 rounded-[10px] border bg-[#fafafa] p-4">
        <FileTile />
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="text-sm font-semibold">Start with the template</p>
          <p className="text-[13px] text-muted-foreground">Its columns match PETA&apos;s talent fields.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toastInfo("Template download isn't available in this preview")}>
          <Download aria-hidden />
          Download template (.xlsx)
        </Button>
      </div>
      <div
        className="flex flex-col items-center gap-2 rounded-xl border-[1.5px] border-dashed border-zinc-300 py-8 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          onFileChosen();
        }}
      >
        <span className="mb-1 flex size-11 items-center justify-center rounded-full bg-muted">
          <Upload className="size-5" aria-hidden />
        </span>
        <p className="text-sm font-semibold">Drag and drop your file here</p>
        <p className="text-[13px] text-muted-foreground">or</p>
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          Browse files
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.csv"
          className="hidden"
          aria-label="Choose a spreadsheet"
          onChange={onFileChosen}
        />
        <p className="mt-2 text-xs text-muted-foreground">Accepted formats: .xlsx, .csv · Max 5 MB</p>
      </div>
    </>
  );
}

/** Step 2: the chosen file (always the sample file in the PoC). */
export function ReviewStep({ onReplace }: { onReplace: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-[10px] border p-4">
      <FileTile />
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-sm font-semibold">{IMPORT_FILE.name}</p>
        <p className="text-[13px] text-muted-foreground">
          {IMPORT_FILE.rows} rows · {IMPORT_FILE.size}
        </p>
      </div>
      <Button variant="link" className="h-auto px-0" onClick={onReplace}>
        Replace file
      </Button>
    </div>
  );
}

export function ResultStep() {
  return (
    <>
      <div className="flex items-center gap-2.5 rounded-[10px] border border-[#c3e0cd] bg-row-selected px-4 py-3 text-sm font-semibold text-primary">
        <CircleCheck className="size-[18px]" aria-hidden />
        {IMPORT_FILE.imported} talents imported
      </div>
      <div className="overflow-hidden rounded-[10px] border border-warning-border">
        <div className="flex gap-2.5 bg-warning-soft px-4 py-3 text-warning-text">
          <TriangleAlert className="mt-0.5 size-[18px] shrink-0" aria-hidden />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold">{IMPORT_SKIPPED.length} rows weren&apos;t imported</p>
            <p className="text-[13px]">Fix these rows in your file, then import just those rows again.</p>
          </div>
        </div>
        <ul className="divide-y divide-warning-border border-t border-warning-border">
          {IMPORT_SKIPPED.map((skipped) => (
            <li key={skipped.row} className="grid grid-cols-[72px_1fr] gap-3 px-4 py-3 text-[13px]">
              <span className="font-semibold">Row {skipped.row}</span>
              <span>
                <span className="font-semibold">{skipped.column}:</span> {skipped.problem}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
