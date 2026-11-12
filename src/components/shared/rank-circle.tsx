import { cn } from "@/lib/utils";

const TOP_RANK_LIMIT = 3;

export function RankCircle({ rank }: { rank: number }) {
  const isTopRank = rank <= TOP_RANK_LIMIT;

  return (
    <span
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold",
        isTopRank ? "bg-primary text-primary-foreground" : "bg-neutral-badge text-neutral-badge-foreground",
      )}
    >
      {rank}
    </span>
  );
}
