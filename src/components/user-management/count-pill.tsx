import { cn } from "@/lib/utils";

/** The count on a tab (DESIGN-SYSTEM §11.1 / §11.5). */
export function CountPill({ count, tone }: { count: number; tone: "primary" | "neutral" }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
        tone === "primary" ? "bg-primary text-primary-foreground" : "bg-neutral-badge text-neutral-badge-foreground",
      )}
    >
      {count}
    </span>
  );
}
