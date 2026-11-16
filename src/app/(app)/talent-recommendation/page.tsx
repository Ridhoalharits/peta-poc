import { Suspense } from "react";
import { PageMain } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { ToastOnMount } from "@/components/shared/toast-on-mount";
import { SearchList, type SearchListState } from "@/components/talent-recommendation/search-list";
import { listSearches } from "@/lib/data/talent-recommendation";
import { param, type SearchParamsRecord } from "@/lib/demo";

/** Title used in the draft-saved toast when ?title= is missing. */
const DRAFT_TITLE_FALLBACK = "Accounting Officer";
const DEMO_STATES: readonly SearchListState[] = ["empty", "loading"];
const TOAST_PARAMS = ["toast", "title"];

async function SearchListFromParams({ searchParams }: { searchParams: Promise<SearchParamsRecord> }) {
  const sp = await searchParams;
  const state = DEMO_STATES.find((demoState) => demoState === param(sp, "state"));
  const draftTitle = param(sp, "title")?.trim() || DRAFT_TITLE_FALLBACK;

  return (
    <>
      <SearchList searches={listSearches()} state={state} />
      {param(sp, "toast") === "draft-saved" && (
        <ToastOnMount title="Draft saved" description={`${draftTitle} was saved as a draft.`} clear={TOAST_PARAMS} />
      )}
    </>
  );
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
