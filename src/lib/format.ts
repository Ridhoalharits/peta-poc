// Fixed list instead of Intl: some locales print "Sept", and the mockups always use three letters.
const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

/** formatDate("2026-10-22") → "22 Oct 2026" (day without a leading zero). */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${SHORT_MONTHS[month - 1]} ${year}`;
}
