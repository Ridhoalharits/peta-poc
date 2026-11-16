import { IMPORT_FILE, IMPORT_SKIPPED } from "@/lib/data/talent-management";

/** "1 talent" / "3 talents". */
export function talentCount(count: number): string {
  return `${count} ${count === 1 ? "talent" : "talents"}`;
}

/** The toast after a delete. Shared by the list and the ?toast=deleted demo so they say the same thing. */
export function deletedToastDescription(count: number): string {
  return `${talentCount(count)} ${count === 1 ? "was" : "were"} removed from PETA.`;
}

/** The toast after a bulk import ("28 talents imported. 3 rows weren't imported."), shared with ?toast=imported. */
export function importedToastDescription(): string {
  return `${IMPORT_FILE.imported} talents imported. ${IMPORT_SKIPPED.length} rows weren't imported.`;
}
