export function ordinal(n: number): string {
  const r100 = n % 100;
  if (r100 >= 11 && r100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Takes the plain 'YYYY-MM-DD' the queries return. Split by hand because
// new Date('2026-08-17') is UTC midnight and renders a day early west of
// Greenwich.
export function fmtDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export const SECTION_SHORT: Record<string, string> = {
  "Quantitative Reasoning": "QR",
  "Verbal Reasoning": "VR",
  "Data Insights": "DI",
};
