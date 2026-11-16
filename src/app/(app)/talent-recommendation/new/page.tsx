import { Suspense } from "react";
import { PageMain } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageTitle } from "@/components/shared/page-title";
import { CandidateSearchForm } from "@/components/talent-recommendation/candidate-search-form";
import { DEFAULT_CRITERIA } from "@/lib/data/talent-recommendation";
import { param, type SearchParamsRecord } from "@/lib/demo";

const LIST_HREF = "/talent-recommendation";

async function FormFromParams({ searchParams }: { searchParams: Promise<SearchParamsRecord> }) {
  const state = param(await searchParams, "state");
  return <CandidateSearchForm initial={DEFAULT_CRITERIA} mode="new" cancelHref={LIST_HREF} showErrorsOnMount={state === "errors"} />;
}

export default function NewCandidateSearchPage({ searchParams }: PageProps<"/talent-recommendation/new">) {
  return (
    <>
      <PageHeader
        items={[
          { label: "Talent Recommendation", href: "/talent-recommendation" },
          { label: "New Candidate Search" },
        ]}
      />
      <PageMain>
        <PageTitle title="Candidate Search" description="Fill in the details below for the position you are looking to fill." />
        {/* searchParams are per request; the prerendered shell shows the empty form. */}
        <Suspense fallback={<CandidateSearchForm initial={DEFAULT_CRITERIA} mode="new" cancelHref={LIST_HREF} />}>
          <FormFromParams searchParams={searchParams} />
        </Suspense>
      </PageMain>
    </>
  );
}
