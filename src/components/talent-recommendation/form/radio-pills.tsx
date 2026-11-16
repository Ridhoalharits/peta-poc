import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { RadioGroup } from "@/components/ui/radio-group";

export interface RadioPillOption {
  value: string;
  label: string;
}

interface RadioPillsProps {
  id: string;
  options: RadioPillOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  "aria-labelledby"?: string;
}

/**
 * Pill-shaped radios (DESIGN-SYSTEM §6.3) on the shadcn RadioGroup root. Each pill is the Radix radio item
 * itself, so arrow keys move both focus and selection.
 */
export function RadioPills({ id, options, value, onChange, disabled, ...aria }: RadioPillsProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      orientation="horizontal"
      className="flex flex-wrap gap-2"
      {...aria}
    >
      {options.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.value}
          id={`${id}-${option.value}`}
          value={option.value}
          className="group inline-flex h-10 items-center gap-2 rounded-lg border border-input bg-white px-3.5 text-sm font-medium shadow-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-muted data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        >
          <span
            className="flex size-4 shrink-0 items-center justify-center rounded-full border border-zinc-400 bg-white group-data-[state=checked]:border-white group-data-[state=checked]:bg-transparent"
            aria-hidden
          >
            <RadioGroupPrimitive.Indicator className="size-2 rounded-full bg-white" />
          </span>
          {option.label}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroup>
  );
}
