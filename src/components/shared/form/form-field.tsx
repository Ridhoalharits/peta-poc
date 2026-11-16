import { CircleAlert } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  helper?: string;
  error?: string;
  /** The control. Pass it `aria-invalid` and `aria-describedby={fieldDescribedBy(htmlFor, { error, helper })}`. */
  children: React.ReactNode;
  className?: string;
}

export function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden>
      *
    </span>
  );
}

export function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="flex items-center gap-1.5 text-xs font-medium text-destructive-text">
      <CircleAlert className="size-3.5 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

export function FieldHelper({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <p id={id} className="text-xs text-muted-foreground">
      {children}
    </p>
  );
}

/** The aria-describedby value for a FormField control: its error and helper ids. */
export function fieldDescribedBy(htmlFor: string, { error, helper }: { error?: string; helper?: string }): string | undefined {
  return [error && `${htmlFor}-error`, helper && `${htmlFor}-helper`].filter(Boolean).join(" ") || undefined;
}

export function FormField({ label, htmlFor, required, helper, error, children, className }: FormFieldProps) {
  const helperId = helper ? `${htmlFor}-helper` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={htmlFor} className={cn("gap-1 text-sm font-medium", error && "text-destructive-text")}>
        {label}
        {required && <RequiredMark />}
        {required && <span className="sr-only">(required)</span>}
      </Label>
      {children}
      {error && <FieldError id={errorId!}>{error}</FieldError>}
      {helper && <FieldHelper id={helperId}>{helper}</FieldHelper>}
    </div>
  );
}
