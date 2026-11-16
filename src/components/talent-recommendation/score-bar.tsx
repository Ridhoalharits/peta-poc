import { cn } from "@/lib/utils";

const MAX_SCORE = 100;
const STRONG_SCORE_THRESHOLD = 75;

export function ScoreBar({ score, className }: { score: number; className?: string }) {
  const isStrong = score >= STRONG_SCORE_THRESHOLD;

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      <p className="text-sm">
        <span className="font-semibold">{score}</span>
        <span className="text-muted-foreground">/{MAX_SCORE}</span>
      </p>
      <div
        role="meter"
        aria-label="Match score"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={MAX_SCORE}
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn("h-full rounded-full", isStrong ? "bg-primary" : "bg-brand-light")}
          style={{ width: `${Math.min(Math.max(score, 0), MAX_SCORE)}%` }}
        />
      </div>
    </div>
  );
}
