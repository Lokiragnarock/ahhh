# Study Planner

A Next.js app that turns Markdown study notes and JSON question banks into a
three-round study loop: read → redraw the concept map → flashcards → mini
tests → error book → full mocks, with cross-device sync and a friends
leaderboard.

- **Forking it for your own subjects?** Start with [docs/HANDOFF.md](docs/HANDOFF.md).
- **Generating notes and question banks with Claude:** [docs/PROMPTS.md](docs/PROMPTS.md).
- **Backing up synced progress:** [BACKUP.md](BACKUP.md).

```bash
npm install
npm run dev   # http://localhost:3000
```

Content lives in `content/recall/<subject>/` (notes) and
`content/tests/<subject>/` (questions). Each subject folder is a tab.
