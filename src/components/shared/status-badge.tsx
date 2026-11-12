import { Check, Pencil, X, type LucideIcon } from "lucide-react";
import { STATUS_LABEL } from "@/lib/constants";
import type { SearchStatus } from "@/lib/types";
import { ToneBadge, type BadgeTone } from "./tone-badge";

const STATUS_TONE: Record<SearchStatus, BadgeTone> = {
  draft: "neutral",
  searching: "warning",
  completed: "success",
  failed: "destructive",
};

const STATUS_ICON: Partial<Record<SearchStatus, LucideIcon>> = {
  draft: Pencil,
  completed: Check,
  failed: X,
};

export function StatusBadge({ status }: { status: SearchStatus }) {
  return (
    <ToneBadge tone={STATUS_TONE[status]} icon={STATUS_ICON[status]}>
      {status === "searching" && <span className="size-1.5 animate-pulse rounded-full bg-current" aria-hidden />}
      {STATUS_LABEL[status]}
    </ToneBadge>
  );
}
