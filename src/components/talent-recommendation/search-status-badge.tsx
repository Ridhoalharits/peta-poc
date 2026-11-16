import { Check, Pencil, X, type LucideIcon } from "lucide-react";
import { SolidBadge, type SolidBadgeTone } from "@/components/shared/solid-badge";
import { STATUS_LABEL, type SearchStatus } from "@/lib/data/talent-recommendation";

const STATUS_TONE: Record<SearchStatus, SolidBadgeTone> = {
  draft: "neutral",
  searching: "warning",
  completed: "primary",
  failed: "destructive",
};

const STATUS_ICON: Partial<Record<SearchStatus, LucideIcon>> = {
  draft: Pencil,
  completed: Check,
  failed: X,
};

export function SearchStatusBadge({ status }: { status: SearchStatus }) {
  const searching = status === "searching";
  return (
    <SolidBadge tone={STATUS_TONE[status]} icon={STATUS_ICON[status]} dot={searching} dotClassName={searching ? "animate-pulse" : undefined}>
      {STATUS_LABEL[status]}
    </SolidBadge>
  );
}
