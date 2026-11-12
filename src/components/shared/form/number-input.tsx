import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NumberInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  /** Muted unit inside the field on the right, e.g. "years" or "%". */
  suffix?: string;
}

// type="text" + inputMode="decimal": a type="number" field reformats "3.00" as "3,00" on comma-decimal locales.
export function NumberInput({ suffix, className, ...props }: NumberInputProps) {
  return (
    <div className="relative w-full">
      <Input type="text" inputMode="decimal" className={cn(suffix && "pr-14", className)} {...props} />
      {suffix && (
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground" aria-hidden>
          {suffix}
        </span>
      )}
    </div>
  );
}
