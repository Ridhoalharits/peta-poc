import Link from "next/link";
import { Clock } from "lucide-react";
import { PageMain } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./empty-state";
import { PageTitle } from "./page-title";

/** Shared screen for every module that isn't part of this PoC. */
export function UnavailablePage({ moduleName }: { moduleName: string }) {
  return (
    <>
      <PageHeader items={[{ label: moduleName }]} />
      <PageMain>
        <PageTitle title={moduleName} />
        <EmptyState
          variant="page"
          tone="neutral"
          icon={Clock}
          title="This page is currently unavailable"
          description={`${moduleName} isn't part of this preview yet. You can explore Talent Recommendation in the meantime.`}
          action={
            <Button asChild>
              <Link href="/talent-recommendation">Go to Talent Recommendation</Link>
            </Button>
          }
        />
      </PageMain>
    </>
  );
}
