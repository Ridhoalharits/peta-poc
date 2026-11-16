// Talent Recommendation's only data entry point. Pages and components import from here, never from src/mocks/.
// In the data phase these functions become API calls.
import {
  PREFILLED_CRITERIA,
  RESULTS,
  SEARCHES,
  type CandidateSearch,
  type SearchCriteria,
  type SearchResult,
} from "@/mocks/talent-recommendation";

export {
  DEFAULT_CRITERIA,
  DEFAULT_WEIGHTS,
  SEARCH_EMPLOYEE_TYPES,
  STATUS_LABEL,
  STATUS_SORT_ORDER,
  WEIGHT_PARAMS,
} from "@/mocks/talent-recommendation";
export type {
  CandidateSearch,
  GenderPreference,
  RequirementKey,
  SearchCriteria,
  SearchResult,
  SearchStatus,
  WeightKey,
  WeightParam,
} from "@/mocks/talent-recommendation";

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

/** PREFILLED_CRITERIA with the search's position as the job title. */
export function getSearchCriteria(id: string): SearchCriteria {
  return { ...PREFILLED_CRITERIA, jobTitle: getSearch(id)?.position ?? "" };
}

/** Drafts open in the editor; every other status opens the search detail. */
export function searchHref(search: CandidateSearch): string {
  return search.status === "draft" ? `${TR_BASE_PATH}/${search.id}/edit` : `${TR_BASE_PATH}/${search.id}`;
}

const START_SEARCH_ENDPOINT = "/v1/candidate-searches";
// PoC stand-in for "the new search is now running": every new search opens s-001 (status: searching).
const STARTED_SEARCH_ID = "s-001";

/** Starts a new candidate search. PoC: the request is logged to the console and s-001 is returned. */
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
