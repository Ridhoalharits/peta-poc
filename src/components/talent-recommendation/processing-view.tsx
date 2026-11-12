import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/shared/section-card";
import { Spinner } from "@/components/shared/spinner";

/** TR-04: the search is still running. No polling; the PoC never finishes it. */
export function ProcessingView() {
  return (
    <SectionCard contentClassName="min-h-[440px] items-center justify-center gap-4 p-12 text-center">
      <div role="status" className="flex flex-col items-center gap-4">
        <Spinner decorative />
        <div className="flex flex-col items-center gap-1.5">
          <h2 className="font-heading text-lg font-semibold">Searching for candidates…</h2>
          <p className="max-w-[460px] text-sm text-muted-foreground">
            This can take a few minutes. You can leave this page; the search keeps running and its status changes to
            Completed when the results are ready.
          </p>
        </div>
      </div>
      <Button asChild variant="outline">
        <Link href="/talent-recommendation">
          <ArrowLeft aria-hidden />
          Back to list
        </Link>
      </Button>
    </SectionCard>
  );
}
