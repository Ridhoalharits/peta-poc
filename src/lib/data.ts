// The only data access layer. Pages call these functions; in the next phase they become API calls.
import { PREFILLED_CRITERIA } from "@/lib/constants";
import type { CandidateSearch, SearchCriteria, SearchResult } from "@/lib/types";
import { RESULTS } from "@/mocks/results";
import { SEARCHES } from "@/mocks/searches";

const TR_BASE_PATH = "/talent-recommendation";

export function listSearches(): CandidateSearch[] {
  return [...SEARCHES];
}

export function getSearch(id: string): CandidateSearch | undefined {
  return SEARCHES.find((search) => search.id === id);
}

/** Returns [] when the search isn't completed or found nothing. */
export function getSearchResults(id: string): SearchResult[] {
  const search = getSearch(id);
  if (search?.status !== "completed" || !search.resultCount) return [];
  return [...RESULTS];
}

/** Sample ranked results for the ?state=found demo override on a search that has none. */
export function getSampleResults(): SearchResult[] {
  return [...RESULTS];
}

export function getSearchCriteria(id: string): SearchCriteria {
  const search = getSearch(id);
  return { ...PREFILLED_CRITERIA, jobTitle: search?.position ?? PREFILLED_CRITERIA.jobTitle };
}

const START_SEARCH_ENDPOINT = "/v1/candidate-searches";
// PoC stand-in for "the new search is now running": every new search opens s-001 (status: searching).
const STARTED_SEARCH_ID = "s-001";

/**
 * Starts a new candidate search. PoC: the request is logged to the browser console and the id of an
 * existing "searching" mock is returned.
 */
export function startSearch(criteria: SearchCriteria): { id: string } {
  logApiRequest("POST", START_SEARCH_ENDPOINT, criteria);
  return { id: STARTED_SEARCH_ID };
}

/** Re-runs an existing search with edited criteria (Edit Criteria → Start Search). PoC: logged only. */
export function rerunSearch(id: string, criteria: SearchCriteria): { id: string } {
  logApiRequest("PUT", `${START_SEARCH_ENDPOINT}/${id}`, criteria);
  return { id };
}

/** Logs the request the API would receive. Nothing is sent in this PoC. */
function logApiRequest(method: "POST" | "PUT", url: string, body: SearchCriteria) {
  const request = { method, url, headers: { "Content-Type": "application/json" }, body };
  console.log(`[PETA PoC] ${method} ${url}\n${JSON.stringify(request, null, 2)}`);
}

/** Drafts open in the editor; every other status opens the search detail. */
export function searchHref(search: CandidateSearch): string {
  return search.status === "draft"
    ? `${TR_BASE_PATH}/${search.id}/edit`
    : `${TR_BASE_PATH}/${search.id}`;
}
