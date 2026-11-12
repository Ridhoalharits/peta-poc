import { WEIGHT_PARAMS, type WeightParam } from "@/lib/constants";
import type { RequirementKey, WeightKey } from "@/lib/types";

export const WEIGHTS_TARGET_TOTAL = 100;
const ROUNDING_FACTOR = 10; // 1 decimal place

export type WeightsStatus = "ready" | "under" | "over";

export function roundWeight(value: number): number {
  return Math.round(value * ROUNDING_FACTOR) / ROUNDING_FACTOR;
}

/** A weight is excluded when its linked requirement is unticked. */
export function isWeightExcluded(param: WeightParam, include: Record<RequirementKey, boolean>): boolean {
  return param.linkedRequirement !== undefined && !include[param.linkedRequirement];
}

/** The weight that counts toward the total: 0 when excluded, empty or not a number. */
export function effectiveWeight(text: string, excluded: boolean): number {
  const value = Number(text);
  return excluded || text.trim() === "" || Number.isNaN(value) ? 0 : value;
}

export function weightsTotal(weights: Record<WeightKey, string>, include: Record<RequirementKey, boolean>): number {
  const total = WEIGHT_PARAMS.reduce(
    (sum, param) => sum + effectiveWeight(weights[param.key] ?? "", isWeightExcluded(param, include)),
    0,
  );
  return roundWeight(total);
}

export function weightsStatus(total: number): WeightsStatus {
  if (total === WEIGHTS_TARGET_TOTAL) return "ready";
  return total < WEIGHTS_TARGET_TOTAL ? "under" : "over";
}
