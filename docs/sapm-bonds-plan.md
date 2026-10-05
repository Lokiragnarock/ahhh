# SAPM and Bond Market notes: plan

Build SAPM (BBA301F-5) and Bond Market (BBA303F-5) to the same standard as SFM: node notes, a node map per unit, and a question bank per unit that feeds the mini tests, sectionals and the full mock.

## Where things stand

| Subject | Folder | What's in it | Missing |
|---|---|---|---|
| SAPM | `content/recall/sapm/` | MOC, the Units 2-3 conceptual spine, Units 2-3 cheat sheet | Node notes, node maps, any question bank (`content/tests/sapm/` doesn't exist) |
| Bond Market | `content/recall/bond-market/` | MOC, the Unit 2 conceptual spine, Unit 2 cheat sheet | The same, plus `content/tests/bond-market/` |

The course plans (`BBA301F-5 - SAPM Course Plan`, `BBA303F-5 - Bond Market Operations Course Plan`) live in the Obsidian vault, not in this repo, and Drive search didn't find them. **Step 0 is pasting both syllabi into the session.** The unit lists below are the usual BBA syllabus and are provisional until checked against those plans.

## Provisional unit scope (CIA3 = the units after CIA2)

**SAPM** (CIA2 covered Unit 2, fundamental analysis)
- Unit 3, Technical analysis (prefix `TA-`): Dow theory, charts and patterns, moving averages, RSI/MACD/oscillators, breadth indicators, the efficient market hypothesis (weak, semi-strong, strong).
- Unit 4, Portfolio theory (`PT-`): two-asset and n-asset return and risk, covariance and correlation, Markowitz efficient frontier, Sharpe single-index model, CAPM and the SML, APT.
- Unit 5, Portfolio evaluation and revision (`PE-`): Sharpe, Treynor and Jensen's alpha, M², formula plans, rebalancing.

**Bond Market** (CIA2 covered Unit 2, valuation, yield, duration, convexity)
- Unit 3, Term structure (`TS-`): yield curve shapes, spot and forward rates, bootstrapping, expectations, liquidity-preference and segmentation theories.
- Unit 4, Credit and bond portfolio management (`BP-`): credit ratings and spreads, default risk, active vs passive strategies, immunization, laddering/barbell/bullet.
- Unit 5, Indian debt market operations (`DM-`): G-secs, T-bills, SDLs, corporate bonds, primary auctions, NDS-OM, repo, clearing through CCIL, RBI and SEBI roles.

Whatever the course plans say overrides this list. If a unit is CIA2 material already covered by a spine note, split that spine into nodes rather than rewriting it.

## Per-unit deliverables (copy the SFM Unit 3 commit, `4bafed4`)

1. **Node notes**, 5 to 8 per unit, named `<Subject> Unit N - XX-k Title.md`, with SFM frontmatter: `title, type: recall, status, created, source, tags, node, section, minutes, deps, weight, exam_focus, state: unstudied`.
   Each note has: a "Covers" line, "Where this fits in CIA3", definitions, every formula, at least one worked numerical example laid out as an exam answer (for quantitative nodes), traps, and recall prompts. Tag sources **(class)** or **(textbook)**.
2. **The last node is "Unit N Exam Answers"**: what the test will ask, 5-mark skeletons, a 20-mark case layout with a model answer.
3. **Node map** `<Subject> Unit N - <Topic> MOC (Node Map).md`: a node table (deps, minutes, exam focus), a mermaid dependency graph, and the headline numbers.
4. **Question bank** `content/tests/<subject>/unit-N-<topic>.json`, same schema as `content/tests/sfm/unit-3-working-capital.json`, about 40 questions per unit (~22 MCQ, ~13 short, ~5 long, ~2 cases). Every MCQ explanation says why each distractor is wrong. Recompute every number, don't copy it.
5. **Update the subject MOC** to link the new node maps and close the "No MCQ bank built yet" open thread.
6. **Labels**: `subjectLabel("bond-market")` already gives "Bond Market", and `sapm` is in `ACRONYM_WORDS`, so no code changes are expected. If the practice hub shows a subject with no tests oddly, fix that in `src/lib/questions.ts`.

## Order of work

1. Get the syllabi, then fix the unit and node list for both subjects (one table per unit; the user approves it).
2. SAPM Unit 4 first (portfolio theory has the heaviest numerical case), then Bond Market Unit 3, and then alternate between the two subjects so both finish evenly.
3. One commit per unit: notes, node map and bank together.
4. After each unit: `npm run lint` and `npm run build`, and open `/practice` with the subject selected to confirm the unit's mini test loads and every node page renders, mermaid included.

## Quality checks before each commit

- Every formula in the cheat sheets matches the node notes (e.g. modified duration = D / (1 + y/m)).
- All worked numbers recomputed with a script in the scratchpad.
- No question repeats a worked example's numbers verbatim.
- JSON parses, and every question's `node` matches an existing note's `node`.
- No personal names in the questions (the same name ban as Taxation, `ce112e7`).

## /goal statement

```
/goal Build CIA3 study notes for SAPM (content/recall/sapm) and Bond Market (content/recall/bond-market) to the SFM standard. For every CIA3 unit in each course plan, add: 5-8 node notes in SFM frontmatter format, ending with a "Unit N Exam Answers" node; a node map MOC with a node table, a mermaid dependency graph and the headline numbers; and a ~40-question bank at content/tests/<subject>/unit-N-<topic>.json matching the SFM schema (MCQ, short, long, case, with distractor explanations and recomputed numbers). Link everything from the subject MOC. Done when every unit's mini test loads in /practice for both subjects, npm run lint and npm run build pass, and each unit is committed and pushed separately to claude/happy-planck-km7lzp. Follow the plan in docs/sapm-bonds-plan.md.
```
