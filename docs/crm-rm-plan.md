# CRM and Retail Management notes: plan

Add two new subjects to the SAPM / Bond Market standard (see `docs/sapm-bonds-plan.md`): node notes, a node map per unit, a subject MOC and a question bank per unit.

Source: `CRM and RM.zip` (2026-10-05), the student's Obsidian notes for both subjects plus the faculty unit slides (CRM Units 1-5; RM Units 1-4 plus a "RM Notes" PDF, no Unit 5 slides). There is no course plan PDF for either subject, so the unit titles come from the student's note folders and the ESE pattern is assumed to match Bond Market: 50 marks, Section A 3 × 5, Section B 2 × 10, Section C one compulsory 15-mark case.

## Subjects

| Subject | Folder slug | Filename prefix | App label |
|---|---|---|---|
| Customer Relationship Management | `crm` | `CRM Unit N - ...` | CRM (added to `ACRONYM_WORDS`) |
| Retail Management | `retail-management` | `Retail Management Unit N - ...` | Retail Management |

## Units and node prefixes

### CRM

| Unit | Prefix | Test file |
|---|---|---|
| 1 Foundations of CRM | CF | `unit-1-foundations.json` |
| 2 Customer Data, Analytics and CRM Platforms | CD | `unit-2-customer-data.json` |
| 3 Relationship Marketing and Customer Value Management | CV | `unit-3-customer-value.json` |
| 4 Strategic and Operational CRM | SO | `unit-4-strategic-operational.json` |
| 5 CRM Implementation and Performance Measurement | CI | `unit-5-implementation.json` |

### Retail Management

| Unit | Prefix | Test file |
|---|---|---|
| 1 Introduction to Modern Retailing | MR | `unit-1-modern-retailing.json` |
| 2 Retail Consumer Behaviour and Market Analysis | MA | `unit-2-market-analysis.json` |
| 3 Retail Locations and Retail CRM | RL | `unit-3-locations-crm.json` |
| 4 Merchandise and Product Management | MP | `unit-4-merchandise.json` |
| 5 Digital, Sustainable and Future Retail | DR | `unit-5-digital-future.json` |

## Per-unit deliverables

Same as `docs/sapm-bonds-plan.md`: node notes with SFM frontmatter ending in a "Unit N Exam Answers" node, a node map MOC, and a question bank (~16 MCQ, ~8 short, ~4 long, ~2 case) whose `unit` equals the filename prefix (`CRM Unit 3`, `Retail Management Unit 3`). The subject MOC links every node map.

## Status (2026-10-05): done

Both subjects are built: 59 topic notes (CRM 28, Retail Management 31), 10 unit maps, 2 subject MOCs and 300 practice questions (30 per unit: 16 MCQ, 8 short, 4 long, 2 case). Both subjects passed an audit that recomputed every number. Lint and build pass, and every unit, practice page and full mock loads in the app.

Open items:
- Slide/notes conflicts are flagged inside the notes; claims the agents could not source are tagged [VERIFY].
- In CRM Units 1-3 the MCQ answer keys lean toward B and C. The answers are correct, but the options were not reshuffled because the explanations cite them by letter.
