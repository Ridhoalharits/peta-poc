import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** Overrides the body padding, e.g. "p-0 gap-0" for a table card. */
  contentClassName?: string;
}

export function SectionCard({ title, description, children, footer, className, contentClassName }: SectionCardProps) {
  return (
    <Card className={cn("gap-0 overflow-hidden rounded-xl py-0 shadow-[0_1px_3px_rgba(0,0,0,0.06)]", className)}>
      {title && (
        <div className="flex flex-col gap-1 border-b px-6 py-5">
          <h2 className="font-heading text-base font-semibold">{title}</h2>
          {description && <p className="text-[13px] text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className={cn("flex flex-col gap-5 p-6", contentClassName)}>{children}</div>
      {footer && <div className="flex items-center justify-end gap-3 border-t px-6 py-4">{footer}</div>}
    </Card>
  );
}
