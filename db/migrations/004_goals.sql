-- Target score, per player.
--
-- One number, not four. The per-section requirements (what Data Insights has
-- to reach, what Quant has to reach) are DERIVED from this in
-- src/lib/gmat-scoring.ts via derivePlan(), not stored. Storing all four would
-- be four things to keep in sync, and three of them would silently go stale
-- the first time the target moved.
--
-- Nullable because it is exam-specific: the ACCA player has no scaled-score
-- target, and a player who has not picked a school yet has none either. The
-- results screen renders its gap columns empty rather than inventing one.
--
-- Safe to re-run.

alter table profiles
  add column if not exists target_total int
    check (target_total is null or (target_total between 205 and 805));

comment on column profiles.target_total is
  'GMAT Focus composite target (205-805). Per-section targets are derived from this, never stored.';

-- Lokesh: ISB target. 655 is the floor from the existing admissions brief;
-- 675 is the competitive figure. Set to the floor so the gap shown is the
-- minimum true one rather than the comfortable one.
--
-- NOTE for whoever revisits this: the brief predates ISB discontinuing the
-- deferred-admission YLP in 2024 in favour of PGP YL. Confirm which programme
-- is actually being targeted before treating 655 as settled.
update profiles set target_total = 655
 where email = 'lokesh.ptrajan@gmail.com'
   and target_total is distinct from 655;
