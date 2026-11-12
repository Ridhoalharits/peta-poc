"use client";

import { useFormContext, useWatch } from "react-hook-form";
import type { CriteriaFormInput } from "@/lib/criteria-form";
import type { RequirementKey } from "@/lib/types";

/** Props for an IncludeField bound to `include.{key}`. */
export function useIncludeToggle(key: RequirementKey) {
  const { control, setValue } = useFormContext<CriteriaFormInput>();
  const included = useWatch({ control, name: `include.${key}` });

  return {
    included,
    onIncludedChange: (value: boolean) => setValue(`include.${key}`, value, { shouldDirty: true }),
  };
}
