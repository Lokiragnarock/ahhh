-- Archive AI-written GMAT questions (2026-10-27).
--
-- The bank keeps only original questions and ones sourced or adapted from
-- online material: original, open-exam-prep, adapted-from-manhattan-review,
-- adapted-from-wizako-q51. Two sources are AI-written and go:
--   ai-generated         24 rows (17 Quant, 7 DI)
--   ds-audit-2026-10-16  24 DS rows written by the 007 audit
--
-- Archived, not deleted: flip archived back to false to restore any of them.
-- GMAT only: ACCA also has ai-generated rows and they stay. Safe to re-run.

update questions q set archived = true
  from topics t
 where t.id = q.topic_id
   and t.exam_type = 'gmat'
   and q.source in ('ai-generated', 'ds-audit-2026-10-16')
   and q.archived = false;
