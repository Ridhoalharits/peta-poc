import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FieldHelper } from "./form-field";

export interface IncludeFieldControlProps {
  /** True when the requirement is unticked. */
  disabled: boolean;
  /** Pass as aria-labelledby so the control is named by the field label. */
  labelId: string;
  /** Pass as aria-describedby when there is helper text. */
  helperId?: string;
}

interface IncludeFieldProps {
  /** Unique id prefix for the checkbox, label and helper. */
  id: string;
  label: string;
  included: boolean;
  onIncludedChange: (included: boolean) => void;
  helper?: string;
  children: (control: IncludeFieldControlProps) => React.ReactNode;
  className?: string;
}

/** A requirement with its include checkbox inside the label ("☑ Education Level"). Unticked = faded + disabled. */
export function IncludeField({ id, label, included, onIncludedChange, helper, children, className }: IncludeFieldProps) {
  const checkboxId = `${id}-include`;
  const labelId = `${id}-label`;
  const helperId = helper ? `${id}-helper` : undefined;
  const disabled = !included;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2">
        <Checkbox
          id={checkboxId}
          checked={included}
          onCheckedChange={(checked) => onIncludedChange(checked === true)}
        />
        <Label id={labelId} htmlFor={checkboxId} className="text-sm font-medium">
          {label}
        </Label>
      </div>
      <div className={cn("flex flex-col gap-2 transition-opacity", disabled && "opacity-50")}>
        {children({ disabled, labelId, helperId })}
        {helper && <FieldHelper id={helperId}>{helper}</FieldHelper>}
      </div>
    </div>
  );
}
