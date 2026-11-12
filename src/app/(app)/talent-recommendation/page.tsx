import { Suspense } from "react";
import { PageMain } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SearchList, type SearchListState } from "@/components/talent-recommendation/search-list";
import { PREFILLED_CRITERIA } from "@/lib/constants";
import { listSearches } from "@/lib/data";

/** Title used in the draft-saved toast when ?title= is missing. */
const DRAFT_TITLE_FALLBACK = PREFILLED_CRITERIA.jobTitle;

const DEMO_STATES: readonly SearchListState[] = ["empty", "loading"];

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

async function SearchListFromParams({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const stateParam = firstValue(params.state);
  const state = DEMO_STATES.find((demoState) => demoState === stateParam);
  const draftSavedTitle =
    firstValue(params.toast) === "draft-saved" ? firstValue(params.title)?.trim() || DRAFT_TITLE_FALLBACK : undefined;

  return <SearchList searches={listSearches()} state={state} draftSavedTitle={draftSavedTitle} />;
}

export default function TalentRecommendationPage({ searchParams }: PageProps<"/talent-recommendation">) {
  return (
    <>
      <PageHeader items={[{ label: "Talent Recommendation" }]} />
      <PageMain>
        {/* searchParams are only known per request; the prerendered shell shows the default list. */}
        <Suspense fallback={<SearchList searches={listSearches()} />}>
          <SearchListFromParams searchParams={searchParams} />
        </Suspense>
      </PageMain>
    </>
  );
}
