// GMAT Focus Edition scoring: scaled scores, percentile lookups, and target
// derivation. Server- and client-safe — pure functions, no database access.
//
// This lives here rather than inside the /diagnostic page because three
// separate surfaces need it and they must agree: the in-app simulator scores a
// sitting with it, the results screen reads percentiles with it, and the target
// derivation inverts it. While it was inline in the simulator, the rest of the
// app could not see the numbers it was being judged against.
//
// PERCENTILE SOURCE: GMAC's published Focus Edition tables (2017-2022 cohort,
// current as of January 2024). The previous inline table in the simulator was
// wrong — systematically pessimistic by 5-8 points across the upper range. It
// had 485 at the 15th percentile where GMAC says 21st, and 685 at the 89th
// where GMAC says 96th. Anyone reading their own gap off that table was being
// told they were further behind than they are.
//
// These percentiles are a rolling cohort and GMAC reissues them. Before
// trusting a number here for anything consequential, check it against the
// current table on mba.com.

export const PERCENTILE_COHORT = "GMAC, 2017-2022 cohort (published Jan 2024)";

export const SECTION_KEYS = ["QR", "VR", "DI"] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

// The section label as stored in diagnostic_sections.section, and as the
// official mba.com score report writes it. The database is the integration
// point between simulator results and hand-entered official sittings, so these
// strings have to match exactly on both sides.
export const SECTION_LABELS: Record<SectionKey, string> = {
  QR: "Quantitative Reasoning",
  VR: "Verbal Reasoning",
  DI: "Data Insights",
};

export function sectionKeyFromLabel(label: string): SectionKey | null {
  return SECTION_KEYS.find((k) => SECTION_LABELS[k] === label) ?? null;
}

// ---------------------------------------------------------------------------
// Scale constants
// ---------------------------------------------------------------------------

export const SECTION_MIN = 60;
export const SECTION_MAX = 90;
export const TOTAL_MIN = 205;
export const TOTAL_MAX = 805;

// ---------------------------------------------------------------------------
// Percentile tables
// ---------------------------------------------------------------------------
//
// Each section has its own distribution — the single most misunderstood thing
// about Focus scoring. A 78 is the 50th percentile in Quant, the 38th in Verbal
// and the 69th in Data Insights. The same scaled number means three different
// things, so a UI rendering all three sections against one shared axis is
// lying about where the candidate stands.

const QR_PERCENTILES: Record<number, number> = {
  90: 100, 89: 97, 88: 96, 87: 94, 86: 91, 85: 88, 84: 85, 83: 80, 82: 75,
  81: 70, 80: 64, 79: 57, 78: 50, 77: 43, 76: 37, 75: 32, 74: 26, 73: 22,
  72: 19, 71: 15, 70: 13, 69: 10, 68: 8, 67: 6, 66: 5, 65: 4, 64: 3, 63: 2,
  62: 2, 61: 1, 60: 1,
};

const VR_PERCENTILES: Record<number, number> = {
  90: 100, 89: 99, 88: 99, 87: 98, 86: 96, 85: 94, 84: 89, 83: 83, 82: 74,
  81: 66, 80: 56, 79: 47, 78: 38, 77: 30, 76: 23, 75: 18, 74: 14, 73: 10,
  72: 8, 71: 6, 70: 4, 69: 3, 68: 3, 67: 2, 66: 2, 65: 1, 64: 1, 63: 1,
  62: 1, 61: 1, 60: 1,
};

const DI_PERCENTILES: Record<number, number> = {
  90: 100, 89: 100, 88: 99, 87: 99, 86: 99, 85: 98, 84: 97, 83: 95, 82: 93,
  81: 89, 80: 83, 79: 76, 78: 69, 77: 62, 76: 53, 75: 47, 74: 41, 73: 35,
  72: 29, 71: 25, 70: 21, 69: 17, 68: 14, 67: 12, 66: 10, 65: 8, 64: 7,
  63: 6, 62: 5, 61: 4, 60: 4,
};

const SECTION_PERCENTILES: Record<SectionKey, Record<number, number>> = {
  QR: QR_PERCENTILES,
  VR: VR_PERCENTILES,
  DI: DI_PERCENTILES,
};

// Total score to percentile, descending. 655 and 665 are absent from the
// published table (which lists 645 at 87 and 675 at 95) and are interpolated
// here. Flagged because 655 is the ISB target and therefore the row most
// likely to be quoted at someone — replace both once a table carrying them is
// to hand.
const INTERPOLATED_TOTALS = new Set([655, 665]);

const TOTAL_PERCENTILES: [number, number][] = [
  [805, 100], [795, 100], [785, 100], [775, 100], [765, 100], [755, 100],
  [745, 100], [735, 100], [725, 99], [715, 99], [705, 98], [695, 97],
  [685, 96], [675, 95], [665, 91], [655, 89], [645, 87], [635, 82],
  [625, 79], [615, 76], [605, 70], [595, 67], [585, 61], [575, 57],
  [565, 51], [555, 48], [545, 42], [535, 39], [525, 34], [515, 32],
  [505, 27], [495, 25], [485, 21], [475, 20], [465, 17], [455, 15],
  [445, 13], [435, 12], [425, 10], [415, 9], [405, 7], [395, 6],
  [385, 5], [375, 5], [365, 4], [355, 3], [345, 3], [335, 2], [325, 2],
  [315, 2], [305, 1], [295, 1], [285, 1], [275, 1], [265, 1], [255, 0],
  [245, 0], [235, 0], [225, 0], [215, 0], [205, 0],
];

export function isInterpolatedTotal(total: number): boolean {
  return INTERPOLATED_TOTALS.has(total);
}

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

function clampSection(scaled: number): number {
  return Math.max(SECTION_MIN, Math.min(SECTION_MAX, Math.round(scaled)));
}

export function lookupPercentile(total: number): number {
  for (const [score, pct] of TOTAL_PERCENTILES) {
    if (total >= score) return pct;
  }
  return 0;
}

export function lookupSectionPercentile(section: SectionKey, scaled: number): number {
  return SECTION_PERCENTILES[section][clampSection(scaled)] ?? 0;
}

// The lowest composite total reaching the given percentile.
//
// This is what makes a percentile floor ("at least the 96th") storable as
// intent rather than as the score that happens to satisfy it today. GMAC
// reissues these tables against a rolling cohort, so a hardcoded 685 would
// quietly stop being the 96th percentile the next time they move — the floor
// would still read as met while no longer being true. Storing the percentile
// and resolving it here means the target follows the cohort.
//
// Returns TOTAL_MAX if the percentile is unreachable.
export function minTotalForPercentile(percentile: number): number {
  // Ascending, so the first hit is the cheapest score that clears the bar.
  for (let i = TOTAL_PERCENTILES.length - 1; i >= 0; i--) {
    const [total, pct] = TOTAL_PERCENTILES[i];
    if (pct >= percentile) return total;
  }
  return TOTAL_MAX;
}

// The lowest scaled score in this section reaching the given percentile. Used
// to invert a target total into per-section requirements. Returns SECTION_MAX
// when the percentile is unreachable, which only happens above the 100th.
export function minScaledForPercentile(section: SectionKey, percentile: number): number {
  const table = SECTION_PERCENTILES[section];
  for (let scaled = SECTION_MIN; scaled <= SECTION_MAX; scaled++) {
    if ((table[scaled] ?? 0) >= percentile) return scaled;
  }
  return SECTION_MAX;
}

// ---------------------------------------------------------------------------
// Scaled scoring
// ---------------------------------------------------------------------------

// Maps an IRT ability estimate onto the 60-90 section scale. Theta is clamped
// to +/-2, the range the adaptive simulator's step size can actually traverse
// in 20-23 questions.
export function sectionScore(theta: number): number {
  const normalized = Math.max(-2, Math.min(2, theta));
  return clampSection(SECTION_MIN + ((normalized + 2) / 4) * (SECTION_MAX - SECTION_MIN));
}

// Composite from the three section scores.
//
// Linear in the SUM of the sections, which has a consequence worth stating
// outright: a scaled point is worth the same 6.67 composite points regardless
// of which section it comes from. So "which section should I push?" is never a
// scoring question — only ever a question of where points are cheapest.
//
// Validated against a real sitting: 77 QR + 77 VR + 68 DI returns exactly 485,
// matching the official mba.com report of 2026-08-17. It has NOT been checked
// against a sitting near the top of the scale, where the real mapping is
// unlikely to stay linear.
export function totalScore(qr: number, vr: number, di: number): number {
  const sum = clampSection(qr) + clampSection(vr) + clampSection(di);
  const normalized = (sum - SECTION_MIN * 3) / ((SECTION_MAX - SECTION_MIN) * 3);
  const total = Math.round(TOTAL_MIN + normalized * (TOTAL_MAX - TOTAL_MIN));
  return Math.max(TOTAL_MIN, Math.min(TOTAL_MAX, total));
}

// Inverse: the smallest section sum reaching the given total.
export function requiredSectionSum(total: number): number {
  const span = TOTAL_MAX - TOTAL_MIN;
  const raw =
    SECTION_MIN * 3 + ((total - TOTAL_MIN) / span) * (SECTION_MAX - SECTION_MIN) * 3;
  return Math.ceil(raw - 1e-9);
}

// ---------------------------------------------------------------------------
// Target derivation
// ---------------------------------------------------------------------------

export interface SectionRequirement {
  key: SectionKey;
  label: string;
  currentScaled: number;
  currentPercentile: number;
  targetScaled: number;
  targetPercentile: number;
  // Scaled points on the 60-90 section scale. Deliberately never rendered as
  // bare "points" beside a composite delta — those are different units and
  // adding them is meaningless.
  gap: number;
}

export interface TargetPlan {
  targetTotal: number;
  targetPercentile: number;
  // What this allocation actually reaches. Section scores are integers, so an
  // equal-percentile split usually cannot land exactly on the required sum and
  // overshoots by a point or two. Overshooting is the safe direction — a plan
  // landing short would quietly understate the work.
  achievedTotal: number;
  requiredSum: number;
  sections: SectionRequirement[];
  totalGap: number;
}

// Derives per-section targets from a single stored target total.
//
// POLICY: equal percentile across all three sections. Find the lowest
// percentile band that, when each section is raised to the score achieving it,
// sums to at least the required total. Chosen because it needs no input beyond
// the target itself, so there is exactly one number to keep current.
//
// It is not the only defensible policy. Weighting toward whichever section has
// the cheapest points — a method gap closes faster than a content gap — would
// produce a more realistic study plan, but needs a per-section difficulty
// judgement that does not exist in the data. If that judgement is ever
// recorded, this is the only function that changes.
export function derivePlan(
  current: Record<SectionKey, number>,
  targetTotal: number
): TargetPlan {
  const requiredSum = requiredSectionSum(targetTotal);

  let chosen: Record<SectionKey, number> | null = null;
  for (let percentile = 1; percentile <= 100; percentile++) {
    const candidate = {
      QR: minScaledForPercentile("QR", percentile),
      VR: minScaledForPercentile("VR", percentile),
      DI: minScaledForPercentile("DI", percentile),
    };
    if (candidate.QR + candidate.VR + candidate.DI >= requiredSum) {
      chosen = candidate;
      break;
    }
  }

  // Unreachable only if the target exceeds a perfect 90/90/90.
  const targets = chosen ?? { QR: SECTION_MAX, VR: SECTION_MAX, DI: SECTION_MAX };

  const sections: SectionRequirement[] = SECTION_KEYS.map((key) => {
    const currentScaled = clampSection(current[key]);
    // A section already at or above its derived target keeps its current score
    // rather than being told to fall back to it.
    const targetScaled = Math.max(currentScaled, targets[key]);
    return {
      key,
      label: SECTION_LABELS[key],
      currentScaled,
      currentPercentile: lookupSectionPercentile(key, currentScaled),
      targetScaled,
      targetPercentile: lookupSectionPercentile(key, targetScaled),
      gap: targetScaled - currentScaled,
    };
  });

  const byKey = (k: SectionKey) => sections.find((s) => s.key === k)!.targetScaled;
  const achievedTotal = totalScore(byKey("QR"), byKey("VR"), byKey("DI"));

  // Largest gap first — the screen leads with the biggest debt.
  sections.sort((a, b) => b.gap - a.gap || a.label.localeCompare(b.label));

  return {
    targetTotal,
    targetPercentile: lookupPercentile(targetTotal),
    achievedTotal,
    requiredSum,
    sections,
    totalGap: sections.reduce((sum, s) => sum + s.gap, 0),
  };
}
