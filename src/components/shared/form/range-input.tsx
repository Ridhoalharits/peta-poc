import { NumberInput } from "./number-input";

interface RangeInputProps {
  id: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  minLabel: string;
  maxLabel: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

/** Two number inputs with "to" between them (Age preference). Values are the typed text. */
export function RangeInput({ id, minValue, maxValue, onMinChange, onMaxChange, minLabel, maxLabel, disabled, ...aria }: RangeInputProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <NumberInput
        id={`${id}-min`}
        aria-label={minLabel}
        value={minValue}
        disabled={disabled}
        onChange={(event) => onMinChange(event.target.value)}
        {...aria}
      />
      <span className="text-sm text-muted-foreground">to</span>
      <NumberInput
        id={`${id}-max`}
        aria-label={maxLabel}
        value={maxValue}
        disabled={disabled}
        onChange={(event) => onMaxChange(event.target.value)}
        {...aria}
      />
    </div>
  );
}
