import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

/** Destructive alert per DESIGN-SYSTEM §6.9. Without a title it's a single line (Add Talent dialog). */
export function FormAlert({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <Alert
      variant="destructive"
      role="alert"
      className={cn(
        "rounded-xl border-destructive-border bg-destructive-soft p-4 text-destructive-text has-[>svg]:grid-cols-[18px_1fr] has-[>svg]:gap-x-3 [&>svg]:size-[18px] [&>svg]:translate-y-px",
        !title && "items-center py-3",
      )}
    >
      <CircleAlert aria-hidden />
      {title && <AlertTitle className="font-semibold">{title}</AlertTitle>}
      <AlertDescription className={cn("text-[13px] text-destructive-text", !title && "font-medium")}>{children}</AlertDescription>
    </Alert>
  );
}
