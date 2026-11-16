import { TODAY } from "@/lib/constants";

// Fixed list instead of Intl: some locales print "Sept", and the mockups always use three letters.
const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
const MONTHS_PER_YEAR = 12;

/** "2026-10-22" (or a longer ISO string) → [2026, 10, 22]. String parts only, so no time-zone surprises. */
function dateParts(iso: string): [number, number, number] {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return [year, month, day];
}

/** formatDate("2026-10-22") → "22 Oct 2026" (day without a leading zero). */
export function formatDate(iso: string): string {
  const [year, month, day] = dateParts(iso);
  return `${day} ${SHORT_MONTHS[month - 1]} ${year}`;
}

/** formatDateTime("2026-11-10T14:05:12") → "10 Nov 2026, 14:05:12". */
export function formatDateTime(iso: string): string {
  return `${formatDate(iso)}, ${iso.slice(11, 19)}`;
}

/** Whole months between two dates, minus 1 if the day of month isn't reached yet. */
export function monthsBetween(fromIso: string, toIso: string = TODAY): number {
  const [fromYear, fromMonth, fromDay] = dateParts(fromIso);
  const [toYear, toMonth, toDay] = dateParts(toIso);
  const months = (toYear - fromYear) * MONTHS_PER_YEAR + (toMonth - fromMonth);
  return toDay < fromDay ? months - 1 : months;
}

/** Age in whole years on a given day. */
export function ageOn(dobIso: string, todayIso: string = TODAY): number {
  return Math.floor(monthsBetween(dobIso, todayIso) / MONTHS_PER_YEAR);
}

/** 52 → "4 yrs 4 mos"; 12 → "1 yr 0 mos"; 7 → "0 yrs 7 mos". */
export function formatServiceShort(months: number): string {
  const years = Math.floor(months / MONTHS_PER_YEAR);
  const rest = months % MONTHS_PER_YEAR;
  return `${years} ${years === 1 ? "yr" : "yrs"} ${rest} mos`;
}
