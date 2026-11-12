import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionCard } from "@/components/shared/section-card";

/** TR-07: the search failed. A solid card (not dashed) with Edit Criteria and Try Again. */
export function FailedView({ searchId }: { searchId: string }) {
  const searchPath = `/talent-recommendation/${searchId}`;

  return (
    <SectionCard contentClassName="p-0 gap-0">
      <EmptyState
        variant="page"
        tone="danger"
        icon={TriangleAlert}
        title="This search couldn't be completed"
        description="Something went wrong while matching candidates. Your criteria are saved, so you can run the search again."
        className="min-h-[440px] rounded-none border-0"
        action={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href={`${searchPath}/edit`}>Edit Criteria</Link>
            </Button>
            <Button asChild>
              <Link href={`${searchPath}?state=processing`}>
                <RefreshCw aria-hidden />
                Try Again
              </Link>
            </Button>
          </div>
        }
      />
    </SectionCard>
  );
}
