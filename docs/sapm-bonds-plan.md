# SAPM and Bond Market notes: plan

Build SAPM (BBA301F-5) and Bond Market (BBA303F-5) to the SFM standard: node notes, a node map per unit, and a question bank per unit that feeds the mini tests, sectionals and the full ESE mock.

Syllabi: `docs/course-plans/BBA301F-5-SAPM.txt` and `docs/course-plans/BBA303F-5-Bond-Market.txt` (text pulled from the 2026-27 course plan PDFs).

## What the exams are

- **CIA3 is a group assignment in both subjects**, so the notes don't target it. SAPM CIA3 (Gen Z equity portfolio and mock stock, due 24 Sep 2026) is past due. Bond Market CIA3 is a group presentation on a Unit 5 theme.
- **The target is the ESE, which covers all five units.** Bond Market ESE: Section A 3 × 5 (internal choice), Section B 2 × 10 (internal choice), Section C one compulsory 15-mark case, 50 marks. SAPM's ESE pattern isn't in its plan (50 marks, scaled to 30); assume the same shape. The app's full mock (`buildMock` in `src/lib/paper.ts`) already uses that shape.
- Bond Market bans phone calculators, so worked answers show every step in a form a basic calculator can follow.

## Status (2026-10-05): done

All ten units are built: 55 topic notes, 10 unit maps and 211 practice questions (SAPM 116, Bond Market 95). Lint and build pass, and every unit's tests, the full mock and every topic page load in the app.

## Where things stood at the start

| Subject | Has | Missing |
|---|---|---|
| SAPM | MOC, the Unit 2 spine ("Units 2-3 - How Security Analysis Actually Works"), the Unit 2 cheat sheet | Units 1, 3, 4, 5 entirely; Unit 2 as nodes; every question bank |
| Bond Market | MOC, the Unit 2 spine, the Unit 2 cheat sheet | Units 1, 3, 4, 5 entirely; Unit 2 as nodes; every question bank |

## Node lists (from the syllabus)

### SAPM

| Unit | Prefix | Nodes |
|---|---|---|
| 1 Introduction to Equity Investments | EI | EI-1 Investment, speculation, gambling, arbitrage; EI-2 Types of risk; EI-3 Single-security return and risk (HPR, total return, SD, variance, covariance, correlation); EI-4 Regulatory framework and Indian investor profile; EI-5 Unit 1 exam answers |
| 2 Fundamental Analysis | FA | FA-1 Concept and economy analysis; FA-2 Industry analysis; FA-3 Company analysis and financial statements; FA-4 Equity and valuation ratios; FA-5 Margin of safety; FA-6 Unit 2 exam answers (built from the existing spine and cheat sheet) |
| 3 Technical Analysis | TA | TA-1 Assumptions and chart types; TA-2 Single candlestick patterns; TA-3 Multiple candlestick patterns and gaps; TA-4 Dow theory, trend, support and resistance; TA-5 RSI and ROC problems; TA-6 Moving averages (SMA, EMA) and MACD; TA-7 Unit 3 exam answers |
| 4 Equity Valuation and Pricing | EV | EV-1 Intrinsic value and price factors; EV-2 Earnings model and P/E; EV-3 Relative valuation P/B and P/S; EV-4 Dividend discount models; EV-5 Forecasting equity prices; EV-6 Unit 4 exam answers |
| 5 Portfolio Management and Evaluation | PM | PM-1 Portfolio return and risk; PM-2 Diversification and Markowitz; PM-3 CAPM and beta; PM-4 Sharpe single index model; PM-5 Sharpe, Treynor, Jensen; PM-6 Active and passive strategies, emerging trends; PM-7 Unit 5 exam answers |

### Bond Market

| Unit | Prefix | Nodes |
|---|---|---|
| 1 Foundations of Bond Markets | BF | BF-1 Structure, participants and instruments; BF-2 Primary and secondary markets; BF-3 Auctions and repo; BF-4 Unit 1 exam answers |
| 2 Mathematics of Bond Valuation | BV | BV-1 TVM and bond pricing; BV-2 Yield measures and the price-yield relationship; BV-3 Duration and modified duration; BV-4 Convexity; BV-5 Credit, interest rate and reinvestment risk; BV-6 Unit 2 exam answers (built from the existing spine and cheat sheet) |
| 3 Riding the Yield Curve | YC | YC-1 Yield curve shapes and theories; YC-2 Spot, forward and bootstrapping; YC-3 Yield curve analytics in Excel; YC-4 Bloomberg analytics; YC-5 Unit 3 exam answers |
| 4 Strategic Bond Portfolio Management | BP | BP-1 Active vs passive and immunization; BP-2 Ladder, barbell, bullet, buy-and-hold; BP-3 Stress testing; BP-4 Sharpe, alpha, beta; BP-5 Unit 4 exam answers |
| 5 Future of Bond Markets | FB | FB-1 Green and sustainability-linked bonds; FB-2 Digital and tokenized bonds; FB-3 Blockchain and future innovations; FB-4 Unit 5 exam answers |

## Per-unit deliverables (same as SFM Unit 3, commit `4bafed4`)

1. **Node notes** named `<SAPM|Bond Market> Unit N - XX-k Title.md` (the part before " - " becomes the unit label), with SFM frontmatter: `title, type: recall, status, created, source, tags, node, section, minutes, deps, weight, exam_focus, state: unstudied`. Each note has: a Covers line, where it fits in the ESE, definitions, every formula, worked examples laid out as exam answers, traps, and recall prompts. Tag **(syllabus)** or **(textbook)**.
2. **The last node is Unit N Exam Answers**: 5-mark skeletons, 10-mark skeletons, a 15-mark case layout with a model answer.
3. **Node map** `<Subject> Unit N - <Topic> MOC (Node Map).md`: node table, mermaid dependency graph, headline numbers.
4. **Question bank** `content/tests/<subject>/unit-N-<topic>.json`, ~30 questions per unit (~16 MCQ at 1 mark, ~8 short at 5, ~4 long at 10, ~2 case at 15). `unit` must equal the filename prefix (e.g. `SAPM Unit 5`). MCQ explanations say why each distractor is wrong. Every number recomputed in a script.
5. **Subject MOC** links every node map.

## Order

Heaviest numerical units first: SAPM 5, Bond 3, SAPM 4, Bond 4, SAPM 3, Bond 1, SAPM 1, Bond 5, then the Unit 2 splits (SAPM 2, Bond 2). One commit per unit, pushed as it lands.

## Checks before each commit

- JSON parses; every question's `node` matches a note's `node`; `unit` matches the filename prefix.
- Numbers recomputed in the scratchpad.
- No personal names in questions; fictional companies marked "(fictional)".
- `npm run lint` and `npm run build` pass.

## /goal statement

```
/goal Build ESE study notes for SAPM (content/recall/sapm) and Bond Market (content/recall/bond-market) to the SFM standard, following docs/sapm-bonds-plan.md and the syllabi in docs/course-plans/. For every unit 1-5 of each subject: node notes in SFM frontmatter format named "<SAPM|Bond Market> Unit N - XX-k Title.md" ending with a "Unit N Exam Answers" node; a node map MOC with a node table, mermaid dependency graph and headline numbers; and a ~30-question bank at content/tests/<subject>/unit-N-<topic>.json (MCQ 1, short 5, long 10, case 15 marks, distractor explanations, recomputed numbers). Link every node map from the subject MOC. Done when all ten units exist, every question's node and unit match a note, npm run lint and npm run build pass, and each unit is committed and pushed separately to claude/happy-planck-km7lzp.
```
