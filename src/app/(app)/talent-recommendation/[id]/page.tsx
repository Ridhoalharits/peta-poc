import { notFound, redirect } from "next/navigation";
import { PageMain } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SearchDetail } from "@/components/talent-recommendation/search-detail";
import { getSampleResults, getSearch, getSearchResults, searchHref } from "@/lib/data";
import { resolveSearchView } from "@/lib/search-view";

// Blocking route (Cache Components): params and ?state= are read before rendering, so drafts get a real
// redirect and unknown ids a real 404 instead of a streamed fallback.
export const instant = false;

export default async function SearchDetailPage({ params, searchParams }: PageProps<"/talent-recommendation/[id]">) {
  const { id } = await params;
  const search = getSearch(id);
  if (!search) notFound();
  if (search.status === "draft") redirect(searchHref(search));

  const { state } = await searchParams;
  const view = resolveSearchView(search, typeof state === "string" ? state : undefined);
  const searchResults = getSearchResults(search.id);
  // ?state=found on a search without results (demo) falls back to the sample ranking.
  const results = view === "found" && searchResults.length === 0 ? getSampleResults() : searchResults;

  return (
    <>
      <PageHeader
        items={[
          { label: "Talent Recommendation", href: "/talent-recommendation" },
          { label: search.position },
        ]}
      />
      <PageMain>
        <SearchDetail view={view} search={search} results={results} />
      </PageMain>
    </>
  );
}
