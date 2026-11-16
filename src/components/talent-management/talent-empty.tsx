import { Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageTitle } from "@/components/shared/page-title";
import { TalentActions } from "./talent-toolbar";

/** TM-01a: no talents at all (?state=empty). */
export function TalentEmpty({ title }: { title: string }) {
  return (
    <>
      <PageTitle title={title} />
      <EmptyState
        variant="page"
        tone="brand"
        icon={Users}
        title="No talents yet"
        description="Add talents one at a time, or import many at once from a spreadsheet. Candidate searches match against this list."
        action={
          <div className="flex items-center gap-3">
            <TalentActions />
          </div>
        }
      />
    </>
  );
}
