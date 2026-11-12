import type { CandidateSearch } from "@/lib/types";

export type SearchView = "processing" | "found" | "not-found" | "failed";

const SEARCH_VIEWS: readonly SearchView[] = ["processing", "found", "not-found", "failed"];

/** ?state= overrides everything (demos); otherwise the mock search status decides. Drafts are redirected earlier. */
export function resolveSearchView(search: CandidateSearch, stateParam?: string): SearchView {
  const override = SEARCH_VIEWS.find((view) => view === stateParam);
  if (override) return override;
  if (search.status === "failed") return "failed";
  if (search.status === "completed") return search.resultCount ? "found" : "not-found";
  return "processing";
}
