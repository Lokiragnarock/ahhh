-- StudyDuel schema, Neon Postgres.
--
-- This replaces the two Supabase migrations. Three things from those files do
-- not exist outside Supabase and are gone rather than ported:
--
--   1. profiles.id referenced auth.users(id). There is no auth schema here —
--      the app has signed its own session cookies since commit 0748f85, so
--      profiles is now a standalone table with its own generated ids.
--   2. The on_auth_user_created trigger fired on auth.users inserts. Players
--      are a fixed roster of two, so 002_players.sql inserts them directly.
--   3. Every RLS policy keyed off auth.uid() and the `authenticated` role,
--      neither of which exists here. No access is lost: all database traffic
--      already went through the service-role client, which bypassed RLS on
--      every query. Ownership is enforced in the route handlers, which compare
--      player_id against the signed cookie — see api/tests, api/attempts,
--      api/schedule/[id].
--
-- Safe to re-run.
--
-- gen_random_uuid() is core Postgres from 13 onwards, so no pgcrypto extension
-- is needed — which keeps this file runnable on any Postgres, not just Neon.

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text not null,
  exam_type text not null check (exam_type in ('gmat', 'acca')),
  created_at timestamptz default now()
);

create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  exam_type text not null check (exam_type in ('gmat', 'acca')),
  section text not null,
  name text not null,
  question_count int default 0,
  -- The seed script identifies a topic by exam_type + name. Making that a real
  -- constraint lets it upsert instead of read-then-compare.
  unique (exam_type, name)
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references topics(id) on delete cascade,
  section text not null,
  topic text not null,
  question text not null,
  type text not null check (type in ('mcq', 'data_sufficiency', 'scenario')),
  options jsonb,
  correct_answer text,
  explanation text,
  difficulty text default 'hard',
  source text,
  statement_1 text,
  statement_2 text,
  model_answer text,
  key_points jsonb
);

create index if not exists questions_topic_id_idx on questions (topic_id);

-- The seed script dedupes questions by exact text. A plain unique index on the
-- column would blow the 2704-byte btree limit on longer scenario stems, so the
-- constraint is on the digest instead.
create unique index if not exists questions_text_unique on questions (md5(question));

create table if not exists tests (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references profiles(id) on delete cascade,
  topic_id uuid references topics(id),
  created_at timestamptz default now(),
  score int not null,
  total int not null,
  time_seconds int,
  -- From 002_external_grading.sql: ACCA scenario sittings are marked outside
  -- the app, so an ungraded row must stay out of the duel averages until a
  -- real mark is pasted back. Folding it in here, since this is a fresh database.
  grading_mode text not null default 'auto' check (grading_mode in ('auto', 'external')),
  pending_review boolean not null default false,
  feedback text,
  graded_at timestamptz,
  context_note text
);

create index if not exists tests_pending_review_idx on tests (player_id, pending_review);

create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references tests(id) on delete cascade,
  question_id uuid references questions(id),
  selected_answer text,
  answer_text text,
  is_correct boolean not null
);

create index if not exists attempts_test_id_idx on attempts (test_id);

create table if not exists schedule_events (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references profiles(id) on delete cascade,
  title text not null,
  event_type text not null check (event_type in ('exam', 'mock', 'study', 'duel')),
  date date not null,
  notes text
);

create index if not exists schedule_events_date_idx on schedule_events (date);
