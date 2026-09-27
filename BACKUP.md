# Backup

The sync store (everyone's R1/R2/R3 progress, per subject) lives in Redis with
no version history and no automatic snapshots. `/api/backup` is a manual
safety net, not a substitute for a real backup policy, use it deliberately.

## Pulling a snapshot

```bash
curl "https://ahhh-one.vercel.app/api/backup?secret=$BACKUP_SECRET" \
  -o study-planner-backup.json
```

Or with the header form instead of the query param:

```bash
curl https://ahhh-one.vercel.app/api/backup \
  -H "Authorization: Bearer $BACKUP_SECRET" \
  -o study-planner-backup.json
```

`BACKUP_SECRET` must be set in Vercel's env vars (see `.env.example`). Without
it the route fails closed and returns 501, it will never serve data with no
secret configured.

## Restoring a snapshot

`POST` the same JSON shape back to `/api/backup` with the same secret. This
overwrites the current sync store for every user key present in the file, so
only do this to undo a bad migration, not casually.

```bash
curl -X POST https://ahhh-one.vercel.app/api/backup \
  -H "Authorization: Bearer $BACKUP_SECRET" \
  -H "Content-Type: application/json" \
  --data @study-planner-backup.json
```

## The rule

Before ever changing the Redis/KV storage provider or connection string in
Vercel's env vars or Storage tab, always pull a `/api/backup` snapshot first,
and save it somewhere durable, not just local disk. Attach it to a note in the
Obsidian vault, or commit it to a private gist or repo, anywhere that
survives you deleting the old database.

This rule exists because the Sep 2026 migration off Upstash deleted the old
database during the provider swap with no export taken first, so all three
users' progress was lost permanently with nothing to restore from.
