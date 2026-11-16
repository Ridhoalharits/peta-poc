import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type SolidBadgeTone = "primary" | "warning" | "destructive" | "neutral";

// Solid fill with a border of the same colour (DESIGN-SYSTEM §6.4, §11.1). Tinted badges were rejected.
const TONE_CLASSES: Record<SolidBadgeTone, string> = {
  primary: "border-primary bg-primary text-primary-foreground",
  warning: "border-warning bg-warning text-warning-foreground",
  destructive: "border-destructive bg-destructive text-destructive-foreground",
  neutral: "border-neutral-badge bg-neutral-badge text-neutral-badge-foreground",
};

interface SolidBadgeProps {
  tone: SolidBadgeTone;
  icon?: LucideIcon;
  /** A 6 px dot in the text colour, before the label. */
  dot?: boolean;
  /** Extra classes for the dot, e.g. "animate-pulse". */
  dotClassName?: string;
  children: React.ReactNode;
  className?: string;
}

/** Every module's status badge is a thin wrapper around this. */
export function SolidBadge({ tone, icon: Icon, dot, dotClassName, children, className }: SolidBadgeProps) {
  return (
    <Badge className={cn("h-[22px] gap-1 rounded-md px-2 text-xs font-medium [&>svg]:size-3", TONE_CLASSES[tone], className)}>
      {dot && <span className={cn("size-1.5 rounded-full bg-current", dotClassName)} aria-hidden />}
      {Icon && <Icon aria-hidden />}
      {children}
    </Badge>
  );
}
