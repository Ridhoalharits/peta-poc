import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type BadgeTone = "success" | "warning" | "destructive" | "neutral";

// Solid fill with a border of the same colour (DESIGN-SYSTEM §6.4).
const TONE_CLASSES: Record<BadgeTone, string> = {
  success: "border-success bg-success text-success-foreground",
  warning: "border-warning bg-warning text-warning-foreground",
  destructive: "border-destructive bg-destructive text-destructive-foreground",
  neutral: "border-neutral-badge bg-neutral-badge text-neutral-badge-foreground",
};

interface ToneBadgeProps {
  tone: BadgeTone;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function ToneBadge({ tone, icon: Icon, children, className }: ToneBadgeProps) {
  return (
    <Badge className={cn("h-[22px] gap-1.5 rounded-md px-2 text-xs font-medium", TONE_CLASSES[tone], className)}>
      {Icon && <Icon aria-hidden />}
      {children}
    </Badge>
  );
}
