import { cn } from "@/lib/utils";

/** A titled 3-column group inside a form card. The form puts a Separator between groups. */
export function FieldGroup({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <fieldset className={cn("flex flex-col", className)}>
      <legend className="mb-4 text-[13px] font-semibold text-muted-foreground">{title}</legend>
      <div className="grid grid-cols-3 items-start gap-5">{children}</div>
    </fieldset>
  );
}
