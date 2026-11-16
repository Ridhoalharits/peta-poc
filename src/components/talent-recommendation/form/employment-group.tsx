"use client";

import { useFormContext } from "react-hook-form";
import { FieldGroup } from "./field-group";
import { IncludeField } from "./include-field";
import { NumberInput } from "@/components/shared/form/number-input";
import { MANAGEMENT_LEVELS } from "@/lib/constants";
import { SEARCH_EMPLOYEE_TYPES } from "@/lib/data/talent-recommendation";
import type { CriteriaFormInput } from "./criteria-form";
import { CriteriaSelect } from "./criteria-select";
import { useIncludeToggle } from "./use-include-toggle";

export function EmploymentGroup() {
  const { register } = useFormContext<CriteriaFormInput>();
  const service = useIncludeToggle("lengthOfService");
  const employeeType = useIncludeToggle("employeeType");
  const level = useIncludeToggle("managementLevel");

  return (
    <FieldGroup title="Employment">
      <IncludeField
        id="length-of-service"
        label="Min. length of service"
        helper="Time at Kalbe, from each talent's hire date."
        {...service}
      >
        {({ disabled, labelId, helperId }) => (
          <NumberInput
            suffix="years"
            disabled={disabled}
            aria-labelledby={labelId}
            aria-describedby={helperId}
            {...register("minLengthOfServiceYears")}
          />
        )}
      </IncludeField>
      <IncludeField id="employee-type" label="Employee Type" {...employeeType}>
        {({ disabled, labelId }) => (
          <CriteriaSelect name="employeeType" options={SEARCH_EMPLOYEE_TYPES} labelId={labelId} disabled={disabled} />
        )}
      </IncludeField>
      <IncludeField id="management-level" label="Management Level" {...level}>
        {({ disabled, labelId }) => (
          <CriteriaSelect name="managementLevel" options={MANAGEMENT_LEVELS} labelId={labelId} disabled={disabled} />
        )}
      </IncludeField>
    </FieldGroup>
  );
}
