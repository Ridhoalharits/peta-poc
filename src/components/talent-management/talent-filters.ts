import type { Talent } from "@/lib/data/talent-management";

/** Select value meaning "no filter". */
export const ALL = "all";

export interface TalentFilters {
  gender: string;
  employeeType: string;
  level: string;
  jobFamilyGroup: string;
  location: string;
  ageMin: string;
  ageMax: string;
  serviceMin: string;
  serviceMax: string;
}

export const EMPTY_FILTERS: TalentFilters = {
  gender: ALL,
  employeeType: ALL,
  level: ALL,
  jobFamilyGroup: ALL,
  location: ALL,
  ageMin: "",
  ageMax: "",
  serviceMin: "",
  serviceMax: "",
};

const SELECT_KEYS = ["gender", "employeeType", "level", "jobFamilyGroup", "location"] as const;

function isSet(text: string): boolean {
  return text.trim() !== "" && !Number.isNaN(Number(text));
}

/** Each set select counts as 1; each range counts as 1 when either end is set. */
export function countActiveFilters(filters: TalentFilters): number {
  const selects = SELECT_KEYS.filter((key) => filters[key] !== ALL).length;
  const age = isSet(filters.ageMin) || isSet(filters.ageMax) ? 1 : 0;
  const service = isSet(filters.serviceMin) || isSet(filters.serviceMax) ? 1 : 0;
  return selects + age + service;
}

/** Inclusive; an empty end is ignored. */
function inRange(value: number, min: string, max: string): boolean {
  return (!isSet(min) || value >= Number(min)) && (!isSet(max) || value <= Number(max));
}

/** A talent must match every set filter. */
export function matchesFilters(talent: Talent, filters: TalentFilters): boolean {
  return (
    SELECT_KEYS.every((key) => filters[key] === ALL || talent[key] === filters[key]) &&
    inRange(talent.age, filters.ageMin, filters.ageMax) &&
    inRange(talent.lengthOfServiceMonths, filters.serviceMin, filters.serviceMax)
  );
}
