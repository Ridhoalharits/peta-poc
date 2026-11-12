import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/** Destructive alert shown at the top of a form when submitting fails (DESIGN-SYSTEM §6.9). */
export function FormAlert({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Alert
      variant="destructive"
      className="rounded-xl border-destructive-border bg-destructive-soft p-4 text-destructive-text has-[>svg]:gap-x-3 has-[>svg]:grid-cols-[18px_1fr] [&>svg]:size-[18px] [&>svg]:translate-y-px"
    >
      <CircleAlert aria-hidden />
      <AlertTitle className="font-semibold">{title}</AlertTitle>
      <AlertDescription className="text-[13px] text-destructive-text">{children}</AlertDescription>
    </Alert>
  );
}
