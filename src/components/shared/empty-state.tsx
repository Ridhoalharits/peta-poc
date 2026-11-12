import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type EmptyStateTone = "brand" | "neutral" | "danger";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: React.ReactNode;
  action?: React.ReactNode;
  /** page = dashed 480 px box (no data, unavailable); inline = inside a table (no match). */
  variant: "page" | "inline";
  tone?: EmptyStateTone;
  className?: string;
}

const TILE_TONE_CLASSES: Record<EmptyStateTone, string> = {
  brand: "bg-primary-soft text-primary",
  neutral: "bg-muted text-zinc-600",
  danger: "rounded-full bg-destructive-soft text-destructive",
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant,
  tone = "brand",
  className,
}: EmptyStateProps) {
  const isPage = variant === "page";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 text-center",
        isPage ? "min-h-[480px] rounded-xl border border-dashed border-zinc-300 p-12" : "py-14",
        className,
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center",
          isPage ? "size-14 rounded-[14px]" : "size-11 rounded-xl",
          TILE_TONE_CLASSES[tone],
        )}
      >
        <Icon className={isPage ? "size-6" : "size-5"} aria-hidden />
      </span>
      <div className="flex flex-col items-center gap-1">
        <h2 className={cn("font-heading font-semibold", isPage ? "text-lg" : "text-base")}>{title}</h2>
        <p className="max-w-[440px] text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
