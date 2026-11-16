import { SearchX, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { PageTitle } from "@/components/shared/page-title";
import type { TalentDialog } from "./talent-dialogs";
import { TalentActions } from "./talent-toolbar";

/** TM-01a: no talents at all (?state=empty). */
export function TalentEmpty({ title, onOpen }: { title: string; onOpen: (dialog: TalentDialog) => void }) {
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
            <TalentActions onOpen={onOpen} />
          </div>
        }
      />
    </>
  );
}

/** TM-01b: the search or filters leave no rows. */
export function TalentNoMatch({ query, onClearFilters }: { query: string; onClearFilters: () => void }) {
  return (
    <EmptyState
      variant="inline"
      tone="neutral"
      icon={SearchX}
      title="No talents found"
      description={
        query
          ? `No talents match “${query}”. Check the spelling or clear the filters.`
          : "No talents match these filters. Try different filters or clear them."
      }
      action={
        <Button variant="outline" onClick={onClearFilters}>
          Clear filters
        </Button>
      }
      // Pinned to the visible part of the wide table: 100vw minus sidebar (256), page padding (80) and card border (2).
      className="sticky left-0 w-[calc(100vw-338px)]"
    />
  );
}
