import Link from "next/link";
import { Pencil, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

/** TR-06: the search finished with no matching talent. */
export function NotFoundView({ searchId }: { searchId: string }) {
  return (
    <EmptyState
      variant="page"
      tone="neutral"
      icon={ZoomOut}
      title="No candidates match these criteria"
      description="No talent meets every requirement. Try adjusting the search criteria."
      className="min-h-[440px]"
      action={
        <Button asChild>
          <Link href={`/talent-recommendation/${searchId}/edit`}>
            <Pencil aria-hidden />
            Edit Criteria
          </Link>
        </Button>
      }
    />
  );
}
