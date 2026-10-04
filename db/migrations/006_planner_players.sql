-- Planner integration: the study planner reads GMAT questions from this
-- database and writes its own players' attempts into it.
--
--   1. profiles grows a handle (lowercase slug), a role and the tracks the
--      player uses. The live StudyDuel app still reads profiles, so it is
--      extended, not replaced. email is no longer required — planner players
--      have none; the unique constraint stays and allows multiple nulls.
--   2. device_keys binds a planner device key (the same key as the planner's
--      sync key) to a player. A player can have several devices; a key can be
--      revoked without touching the player or their attempts.
--   3. questions.archived hides a question from the planner without deleting
--      it (and without orphaning attempts that point at it).
--   4. Geometry is off the GMAT Focus syllabus, so its questions are archived.
--
-- Nothing is dropped or rewritten beyond those flags. Safe to re-run.

alter table profiles add column if not exists handle text unique;
alter table profiles add column if not exists role text not null default 'player'
  check (role in ('owner', 'player'));
alter table profiles add column if not exists tracks text[] not null default '{gmat}';
alter table profiles alter column email drop not null;

update profiles set handle = 'lokesh', role = 'owner'
  where email = 'lokesh.ptrajan@gmail.com';
update profiles set handle = 'nadeema', tracks = '{acca}'
  where email = 'zainvsloki@gmail.com';

create table if not exists device_keys (
  key text primary key,
  player_id uuid not null references profiles(id) on delete cascade,
  label text,
  created_at timestamptz default now(),
  last_seen timestamptz,
  revoked_at timestamptz
);

create index if not exists device_keys_player_id_idx on device_keys (player_id);

alter table questions add column if not exists archived boolean not null default false;

update questions set archived = true where topic = 'Geometry';
