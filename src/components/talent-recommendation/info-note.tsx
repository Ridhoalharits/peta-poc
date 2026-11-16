import { Info } from "lucide-react";

export function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[10px] border border-zinc-100 bg-[#fafafa] px-4 py-3 text-[13px] text-zinc-600">
      <Info className="mt-px size-4 shrink-0 text-muted-foreground" aria-hidden />
      <div>{children}</div>
    </div>
  );
}
