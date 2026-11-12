import { notFound } from "next/navigation";
import { PageMain } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageTitle } from "@/components/shared/page-title";
import { CandidateSearchForm } from "@/components/talent-recommendation/candidate-search-form";
import { getSearch, getSearchCriteria, listSearches } from "@/lib/data";

const LIST_HREF = "/talent-recommendation";

// Blocking route (Cache Components): params are read before rendering so unknown ids get a real 404.
export const instant = false;

export function generateStaticParams() {
  return listSearches().map((search) => ({ id: search.id }));
}

export default async function EditCriteriaPage({ params }: PageProps<"/talent-recommendation/[id]/edit">) {
  const { id } = await params;
  const search = getSearch(id);
  if (!search) notFound();

  // Drafts have no detail page to return to.
  const cancelHref = search.status === "draft" ? LIST_HREF : `${LIST_HREF}/${search.id}`;

  return (
    <>
      <PageHeader items={[{ label: "Talent Recommendation", href: LIST_HREF }, { label: search.position }]} />
      <PageMain>
        <PageTitle title="Candidate Search" description="Fill in the details below for the position you are looking to fill." />
        <CandidateSearchForm initial={getSearchCriteria(id)} mode="edit" searchId={search.id} cancelHref={cancelHref} />
      </PageMain>
    </>
  );
}
