/** "1 talent" / "3 talents". */
export function talentCount(count: number): string {
  return `${count} ${count === 1 ? "talent" : "talents"}`;
}

/** The toast after a delete. Shared by the list and the ?toast=deleted demo so they say the same thing. */
export function deletedToastDescription(count: number): string {
  return `${talentCount(count)} ${count === 1 ? "was" : "were"} removed from PETA.`;
}
