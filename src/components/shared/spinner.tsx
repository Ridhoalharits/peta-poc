import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  default: "size-12 border-4", // 48 px, DESIGN-SYSTEM §6.11
  sm: "size-6 border-[3px]",
} as const;

interface SpinnerProps {
  size?: keyof typeof SIZE_CLASSES;
  /** Set when a parent already announces the loading state (e.g. a role="status" card). */
  decorative?: boolean;
  className?: string;
}

export function Spinner({ size = "default", decorative = false, className }: SpinnerProps) {
  return (
    <span
      role={decorative ? undefined : "status"}
      aria-label={decorative ? undefined : "Loading"}
      aria-hidden={decorative || undefined}
      className={cn(
        "inline-block animate-spin rounded-full border-primary-soft border-t-primary",
        SIZE_CLASSES[size],
        className,
      )}
    />
  );
}
