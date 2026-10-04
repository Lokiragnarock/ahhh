-- Official practice diagnostics (mba.com GMAT Focus and equivalents).
--
-- These do not belong in `tests`. A tests row is one topic with a raw
-- score/total, and the whole dashboard reads it as score/total*100. A
-- diagnostic spans every topic at once and produces a scaled 205-805 total
-- with percentiles — put that in `score` and every percentage on the page
-- becomes nonsense; put raw-correct there instead and the scaled score, which
-- is the entire point of sitting one, is thrown away.
--
-- So they get their own table and their own axis. Separate from the duel:
-- a diagnostic is a baseline to measure against, not a move in the game.
--
-- Safe to re-run.

create table if not exists diagnostics (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references profiles(id) on delete cascade,
  -- Where it was sat. 'official' is mba.com and counts as a real baseline;
  -- 'in-app' is the /diagnostic simulator, which is an estimate.
  source text not null default 'official' check (source in ('official', 'in-app')),
  taken_on date not null,
  total_score int not null,
  percentile int,
  time_seconds int,
  notes text,
  created_at timestamptz default now(),
  -- One sitting per player per day per source; makes re-recording idempotent.
  unique (player_id, taken_on, source)
);

create index if not exists diagnostics_player_idx on diagnostics (player_id, taken_on desc);

-- Per-section detail. GMAT Focus sections are scaled 60-90, so these are not
-- percentages either and are stored as given.
create table if not exists diagnostic_sections (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid not null references diagnostics(id) on delete cascade,
  section text not null,
  scaled_score int not null,
  percentile int,
  unique (diagnostic_id, section)
);
