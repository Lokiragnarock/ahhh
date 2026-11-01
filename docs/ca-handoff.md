# CA Intermediate track: handoff

Last updated 1 November 2026. Branch: `claude/nice-clarke-v394xb` (not merged; do not push to `main`).

## Where things stand

- Plan and sources: `docs/ca-plan.md` (scheme, entry rules, overlap map, node maps, ICAI source list).
- Decisions made by Lokesh:
  - Copyright: AHH is private; ICAI material kept as private study copies with the source on every item.
  - Notes are written **from ICAI study material** (July 2026 edition, May 2027 onwards), not linked from BBA notes. BBA notes are mentioned only as background links.
  - Build order: all of CMA first (`ca-inter-cma`).
- **Urgent for Lokesh:** register with ICAI by 1 January 2027 to sit September 2027 (see plan section 1.4).

## CMA notes: `content/recall/ca-inter-cma/`

Done (29 of 38 nodes, plus subject MOC and three unit node maps):

| Unit | Nodes | Node map |
|---|---|---|
| 1 Overview (ICAI ch. 1, 6) | OV-1 to OV-6 | done |
| 2 Ascertainment (ch. 2-5, 7) | EL-1 to EL-14 | done |
| 3 Methods (ch. 8-12) | MC-1 to MC-7 | done |
| 4 Cost control (ch. 13-15) | CC-1, CC-2 done | **not yet** |

Still to write, in this order:

1. CC-3 Variable and fixed overhead variances (ch. 13 para 7.3-7.4, Ill. 9-13; all numbers already checked: Ill. 9 VOH cost 4,000 A, exp 6,000 A, eff 2,000 F; Ill. 10 FOH cost 0, exp 60,000 A, vol 60,000 F, eff 40,000 A, cap 1,00,000 F; Ill. 11 eff 6,360 F, cap 17,280 A, calendar 5,760 A, exp 2,000 F, vol 16,680 A, total 14,680 A; Ill. 12 vol 3,00,000 A, expense 4,00,000 A; Ill. 13 VOH 6,000 A = exp 3,000 A + eff 3,000 A; FOH 10,000 A = exp 10,000 F + vol 20,000 A, with eff 10,000 A, revised capacity 30,000 A, calendar 20,000 F).
2. CC-4 Standard costing round-up: integrated material and labour problem (ch. 13 TYK Practical Problem 5: MPV 19,100 A, MUV 500 A, LRV 10,000 A, LEV 4,000 F), advantages and criticisms of standard costing (ch. 13 para 8), ICAI TYK theory questions.
3. CC-5 Marginal costing and CVP (ch. 14).
4. CC-6 Marginal vs absorption costing, profit reconciliation (ch. 14).
5. CC-7 Short-term decisions: make or buy, discontinuation, multi-product BEP, key factor (ch. 14).
6. CC-8 Budget concepts, functional and flexible budgets (ch. 15).
7. CC-9 Cash budget and master budget (ch. 15).
8. CC-10 ZBB, performance budgets, control ratios, budget variances, motivation, feedback and feed-forward (ch. 15).
9. CC-11 Unit 4 Exam Answers (ICAI TYK MCQs and keys for ch. 13-15).
10. `CA Inter CMA Unit 4 - Cost Control and Analysis MOC (Node Map).md` (template: the other three unit maps).

## How each note is built (keep the same)

- File name: `CA Inter CMA Unit N - XX-k Title.md` (the part before " - " is the unit label the app shows).
- Front matter: `title, type: recall, status: active, created, source, tags, node, section, minutes, deps, weight, exam_focus: true, state: unstudied`.
- Sections: Covers line, Where this fits in the exam, content, ICAI illustrations as worked examples (cite the number), Traps, What to remember, optional mermaid concept map, Flashcards (`Q:` / `A:`), Sources (ICAI chapter PDF URL, previous/next links, unit node map link).
- Recompute every ICAI number in a script before writing it. Note any ICAI error rather than copying it.
- British spelling, plain language, no em dashes.

## Source files

ICAI chapter PDFs (July 2026 edition): `https://resource.cdn.icai.org/933NNbos-aps5870-chK.pdf`, where chapter K maps to 93304 (ch. 1) up to 93318 (ch. 15): ch. 13 = 93316, ch. 14 = 93317, ch. 15 = 93318. Download to the scratchpad, `pdftotext -layout`, read the relevant sections.

## Not done / open

- No question banks (`content/tests/ca-inter-cma/`) yet. Plan: ICAI-only questions (past papers, MCQ keys, RTPs, study material TYK) as listed in `docs/ca-plan.md` section 5. The test JSON has no shared-stem field for ICAI's five-MCQ case scenarios; raise with the GRE generic-track session.
- No track entry: `src/lib/tracks.ts` untouched (GRE session owns the generic-track work); the `ca-inter-cma` folder shows under AHH until then.
- Lint, build and app check not run on the new notes.
- Known ICAI slips recorded in notes: ch. 7 Ill. 7 labels an under-absorption "over absorbed"; ch. 3 MCQ 12 key contradicts the chapter text on urgent-order overtime premium.
- After CMA: `ca-inter-fmsm` and `ca-inter-audit` (node maps in `docs/ca-plan.md` section 4), then Group I.
