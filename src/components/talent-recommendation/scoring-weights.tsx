"use client";

import { Check, RotateCcw } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NumberInput } from "@/components/shared/form/number-input";
import { ToneBadge } from "@/components/shared/tone-badge";
import { DEFAULT_WEIGHTS, WEIGHT_PARAMS, type WeightParam } from "@/lib/constants";
import type { CriteriaFormInput } from "@/lib/criteria-form";
import { cn } from "@/lib/utils";
import {
  WEIGHTS_TARGET_TOTAL,
  effectiveWeight,
  isWeightExcluded,
  roundWeight,
  weightsStatus,
  weightsTotal,
} from "@/lib/weights";

const WEIGHT_STEP = "0.5";

function TotalBadge({ total }: { total: number }) {
  const status = weightsStatus(total);
  if (status === "ready") {
    return (
      <ToneBadge tone="success" icon={Check}>
        Ready
      </ToneBadge>
    );
  }
  return status === "under" ? (
    <ToneBadge tone="warning">{roundWeight(WEIGHTS_TARGET_TOTAL - total)}% left to assign</ToneBadge>
  ) : (
    <ToneBadge tone="destructive">{roundWeight(total - WEIGHTS_TARGET_TOTAL)}% over the limit</ToneBadge>
  );
}

function WeightRow({ param, excluded, text }: { param: WeightParam; excluded: boolean; text: string }) {
  const { register } = useFormContext<CriteriaFormInput>();
  const share = Math.min(effectiveWeight(text, excluded), WEIGHTS_TARGET_TOTAL);

  return (
    <TableRow className={cn("h-[53px] border-zinc-100 hover:bg-transparent", excluded && "opacity-50")}>
      <TableCell className="px-4">
        <p className="text-sm font-medium">{param.label}</p>
        {excluded && <p className="text-xs text-muted-foreground">Excluded — requirement is unchecked</p>}
      </TableCell>
      <TableCell className="px-4">
        <NumberInput
          suffix="%"
          step={WEIGHT_STEP}
          disabled={excluded}
          aria-label={`${param.label} weight in percent`}
          className="h-9 w-[120px] pr-8"
          {...register(`weights.${param.key}`)}
        />
      </TableCell>
      <TableCell className="px-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
          <div className="h-full rounded-full bg-brand-light" style={{ width: `${share}%` }} />
        </div>
      </TableCell>
      <TableCell className="px-4 text-[13px] text-muted-foreground">{param.defaultWeight}%</TableCell>
    </TableRow>
  );
}

export function ScoringWeights() {
  const { control, setValue } = useFormContext<CriteriaFormInput>();
  const weights = useWatch({ control, name: "weights" });
  const include = useWatch({ control, name: "include" });
  const total = weightsTotal(weights, include);

  const resetToDefault = () => {
    for (const param of WEIGHT_PARAMS) {
      setValue(`weights.${param.key}`, String(DEFAULT_WEIGHTS[param.key]), { shouldDirty: true, shouldValidate: true });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold">Scoring weights</p>
          <p className="text-[13px] text-muted-foreground">Weights must add up to 100%.</p>
        </div>
        <Button type="button" variant="ghost" onClick={resetToDefault}>
          <RotateCcw aria-hidden />
          Reset to default
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border">
        <Table aria-label="Scoring weights" className="table-fixed">
          <colgroup>
            <col className="w-[36%]" />
            <col className="w-[160px]" />
            <col />
            <col className="w-[100px]" />
          </colgroup>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              <TableHead className="h-11 px-4 text-[13px] font-medium text-muted-foreground">Parameter</TableHead>
              <TableHead className="h-11 px-4 text-[13px] font-medium text-muted-foreground">Weight</TableHead>
              <TableHead className="h-11 px-4">
                <span className="sr-only">Share</span>
              </TableHead>
              <TableHead className="h-11 px-4 text-[13px] font-medium text-muted-foreground">Default</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b-0">
            {WEIGHT_PARAMS.map((param) => (
              <WeightRow
                key={param.key}
                param={param}
                excluded={isWeightExcluded(param, include)}
                text={weights[param.key] ?? ""}
              />
            ))}
            <TableRow className="h-[50px] border-t bg-table-header font-semibold hover:bg-table-header">
              <TableCell className="px-4 text-sm">Total</TableCell>
              <TableCell className="px-4 text-sm" aria-live="polite">
                {total}%
              </TableCell>
              <TableCell className="px-4" aria-live="polite">
                <TotalBadge total={total} />
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
