-- The two-player roster.
--
-- Under Supabase these rows appeared as a side effect of the auth.users signup
-- trigger. With auth gone they have to be inserted explicitly, and they must
-- exist before any test can be saved — tests.player_id is a foreign key, and
-- resolvePlayerId() in src/lib/players.ts looks a player up by email.
--
-- Emails are the join key and must match ROSTER in src/lib/players.ts exactly.
-- Ids are generated here rather than hardcoded; nothing references them by
-- literal value.
--
-- Safe to re-run.

insert into profiles (email, display_name, exam_type) values
  ('lokesh.ptrajan@gmail.com', 'Lokesh',  'gmat'),
  ('zainvsloki@gmail.com',     'Nadeema', 'acca')
on conflict (email) do update
  set display_name = excluded.display_name,
      exam_type    = excluded.exam_type;
