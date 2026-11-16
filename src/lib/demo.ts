export type SearchParamsRecord = Record<string, string | string[] | undefined>;

/** Reads one demo query param as a string. Pages pass `await searchParams` in. */
export function param(sp: SearchParamsRecord, key: string): string | undefined {
  const value = sp[key];
  return Array.isArray(value) ? value[0] : value;
}
