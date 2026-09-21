// All dates are handled as local-time YYYY-MM-DD strings to avoid timezone
// drift; we never rely on Date's UTC parsing of date-only ISO strings.

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, delta: number): string {
  const d = fromISODate(iso);
  d.setDate(d.getDate() + delta);
  return toISODate(d);
}

export function addMonths(iso: string, delta: number): string {
  const d = fromISODate(iso);
  d.setDate(1);
  d.setMonth(d.getMonth() + delta);
  return toISODate(d);
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const WEEKDAY_LABELS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function monthLabel(iso: string): string {
  const d = fromISODate(iso);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

export { WEEKDAY_LABELS, WEEKDAY_LABELS_SHORT };

/** Monday-first day-of-week index (0 = Monday ... 6 = Sunday). */
export function mondayIndex(d: Date): number {
  return (d.getDay() + 6) % 7;
}

/** Returns the ISO date of the Monday of the week containing `iso`. */
export function startOfWeek(iso: string): string {
  const d = fromISODate(iso);
  const diff = mondayIndex(d);
  d.setDate(d.getDate() - diff);
  return toISODate(d);
}

/** 6x7 grid of ISO date strings covering the month view for `iso` (any date in that month). */
export function monthGrid(iso: string): string[] {
  const d = fromISODate(iso);
  const firstOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(gridStart.getDate() - mondayIndex(firstOfMonth));

  const days: string[] = [];
  const cursor = new Date(gridStart);
  for (let i = 0; i < 42; i++) {
    days.push(toISODate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export function isSameMonth(iso: string, referenceIso: string): boolean {
  const a = fromISODate(iso);
  const b = fromISODate(referenceIso);
  return a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

export function dayOfMonth(iso: string): number {
  return fromISODate(iso).getDate();
}

export function weekdayShort(iso: string): string {
  return WEEKDAY_LABELS_SHORT[mondayIndex(fromISODate(iso))];
}

export function weekRangeLabel(startIso: string): string {
  const start = fromISODate(startIso);
  const end = fromISODate(addDays(startIso, 6));
  const sameMonth = start.getMonth() === end.getMonth();
  const startStr = `${MONTH_NAMES[start.getMonth()].slice(0, 3)} ${start.getDate()}`;
  const endStr = sameMonth
    ? `${end.getDate()}`
    : `${MONTH_NAMES[end.getMonth()].slice(0, 3)} ${end.getDate()}`;
  return `${startStr} – ${endStr}, ${end.getFullYear()}`;
}

export function dayLabel(iso: string): string {
  const d = fromISODate(iso);
  return `${WEEKDAY_LABELS_SHORT[mondayIndex(d)]}, ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
}

/** "19:00" -> "7:00 PM" */
export function to12Hour(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${mStr} ${period}`;
}

export function minutesSinceMidnight(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function durationLabel(start: string, end: string): string {
  const mins = minutesSinceMidnight(end) - minutesSinceMidnight(start);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}.${Math.round((m / 60) * 10)}h`;
}
