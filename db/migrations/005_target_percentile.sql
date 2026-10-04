-- Target expressed as a percentile floor, not a score.
--
-- "I need to be at least the 96th percentile" is the actual requirement;
-- 685 is merely the score that satisfies it against the current table. GMAC
-- reissues percentiles against a rolling three-year cohort, so storing 685
-- would mean the floor silently stops being the 96th the next time they
-- publish — the app would keep reporting the target as met while it no longer
-- was. Storing the percentile and resolving it at read time
-- (minTotalForPercentile in src/lib/gmat-scoring.ts) keeps the target honest
-- as the cohort moves.
--
-- target_total stays. It is the fallback for anyone whose target really is a
-- specific score rather than a standing, and target_percentile wins when both
-- are set.
--
-- Safe to re-run.

alter table profiles
  add column if not exists target_percentile int
    check (target_percentile is null or (target_percentile between 1 and 100));

comment on column profiles.target_percentile is
  'Minimum acceptable composite percentile. Resolved to a score at read time; takes precedence over target_total.';

-- Lokesh: 96th percentile floor. Against the current table that resolves to
-- 685 — the ISB PGP YL cohort average was Focus 677, so 675 (95th) sits just
-- under it and 685 is the first score that clears.
--
-- This supersedes the 655 set in 004_goals.sql, which was the floor from the
-- older admissions brief and resolves to only the 89th percentile.
update profiles set target_percentile = 96
 where email = 'lokesh.ptrajan@gmail.com'
   and target_percentile is distinct from 96;
