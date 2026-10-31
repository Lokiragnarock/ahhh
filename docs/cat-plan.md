# CAT track: plan and sources

Status: **draft for Lokesh to agree**. Nothing is built yet. No notes, no tests and no app code. Once you say go (or send edits), the next stage writes the notes in `content/recall/cat-*` and the tests in `content/tests/cat-*`, and adds one `cat-` entry to `src/lib/tracks.ts` (after the GRE branch has made tracks generic).

Rules this plan follows: debate before build; real questions only, never AI-written; free and open-source tools only; British spelling, plain language.

---

## 1. The CAT format (checked against official IIM documents)

The CAT website (`iimcat.ac.in`, run by TCS iON) blocks this cloud container, so I read the official PDFs the IIMs publish on the same CAT CDN (`cdn.digialm.com/per/.../pub/32842/...`, which the CAT site links to). The links are listed below each fact.

| Item | What the IIMs say | Source |
|---|---|---|
| CAT 2026 | Sunday 29 November 2026, three sessions. Convened by **IIM Indore** (Convener Prof. Aditya Billore). Registration ran 3 August to 15 September 2026. | [CAT 2026 press release, 26 July 2026](https://cdn.digialm.com/per/g06/pub/32842/EForms/image/CAT2026/CAT_2026_Press_Release_26-07-2026.pdf), [CAT 2026 Information Bulletin](https://cdn.digialm.com/per/g06/pub/32842/EForms/image/CAT2026/CAT_2026_Information_Bulletin_26-07-26.pdf) |
| Sections and order | Section I VARC (Verbal Ability and Reading Comprehension), Section II DILR (Data Interpretation and Logical Reasoning), Section III QA (Quantitative Ability). Fixed order. | CAT 2026 press release |
| Timing | 120 minutes in total, **exactly 40 minutes per section**. You cannot switch sections. PwD candidates get 160 minutes (53 min 20 s per section). | CAT 2026 press release; [CAT 2025 media release, 1 Dec 2025](https://cdn.digialm.com/per/g06/pub/32842/EForms/image/CAT2025/CAT_2025_Media_Release_01_Dec_2025.pdf) |
| Question count (CAT 2025) | **VARC 24, DILR 22, QA 22, total 68.** | CAT 2025 media release |
| Question count (CAT 2023) | VARC 24, DILR 20, QA 22, total 66. So DILR moved from 20 to 22 between 2023 and 2025. | [CAT 2023 results release, 21 Dec 2023](https://cdn.digialm.com/per/g01/pub/756/ASM/WebPortal/12/PDF/Media_Release_CAT_2023_21st_Dec_2023.pdf) |
| Question types | MCQ (four options) and non-MCQ, which the IIMs call "SA" with a typed numeric response. Coaching sites call these **TITA** (Type In The Answer). | CAT 2023 results release (objection decisions) |
| Marking | **MCQ: +3 correct, −1 wrong, 0 unattempted. TITA: +3 correct, 0 wrong, 0 unattempted** ("This being SA Type question, there was no negative marking"). Maximum is 68 × 3 = 204. | CAT 2023 results release |
| Mock | One official mock test on the CAT website shows the interface. | CAT 2026 press release; [CAT 2024 Mock Test Navigation Guide](https://cdn.digialm.com/per/g06/pub/32842/EForms/CAT24/CAT_2024_Mock_Test_Navigation_Guide_v1.4.pdf) |
| Scores and percentiles | The scorecard reports a scaled score and a percentile for each section and overall. The IIMs announce how many candidates reached 100, 99.99 and 99.98 percentile (CAT 2024: 14, 29 and 30; CAT 2023: 14, 29, 29). About 2.93 lakh sat CAT 2024 and 2.58 lakh sat CAT 2025. Scores are valid until 31 December of the following year. | [CAT 2024 results release, 19 Dec 2024](https://cdn.digialm.com/per/g06/pub/32842/ASM/WebPortal/1/PDF/2024_CATMedia_Release_19Th_Dec2024.pdf); CAT 2025 media release; CAT 2026 Information Bulletin |
| Calculator | An on-screen basic calculator is provided. | Coaching sites only; I could not reach the official FAQ to confirm it. **To check.** |

**Not official, but agreed by the coaching analyses of CAT 2024 and 2025** (for example [IMS CAT 2025 slot analysis](https://www.imsindia.com/cat-2025-slot-3-analysis/) and [Wikipedia: Common Admission Test](https://en.wikipedia.org/wiki/Common_Admission_Test)):

- VARC = 4 RC passages × 4 questions (16) + 8 verbal-ability questions (para jumbles, para summary, odd sentence out, sentence placement). Para jumbles and odd sentence out are TITA.
- DILR = 5 sets (two of 5 questions, three of 4 questions in 2025).
- About a third of all questions are TITA. The split changes from slot to slot.
- Scaled score: each section's raw score is normalised across the three slots (equipercentile method, per coaching sites), then converted to a percentile. The official CAT FAQ explains this; I could not reach it from here, so the AHH note will quote it once Lokesh can open the page.

**What this means for AHH tests.** A CAT test in AHH should copy the real paper: three timed 40-minute blocks in a fixed order, MCQ and TITA mixed, +3/−1/0 marking for MCQ and +3/0 for TITA, and a raw score out of 204 with sectional scores. AHH cannot compute a real percentile, so it should show the raw score only, perhaps alongside a published score-to-percentile table from a prep site, clearly labelled as an estimate.

---

## 2. Node map (draft)

Three tracks, each with its own folder and node map (MOC), in the same style as `content/recall/gmat-quant/GMAT Quant - Quantitative Reasoning MOC (Node Map).md`:

- `content/recall/cat-varc/` with nodes VA-1 to VA-7
- `content/recall/cat-dilr/` with nodes DI-1 to DI-10
- `content/recall/cat-qa/` with nodes QA-1 to QA-16

Filenames would follow the GMAT pattern: `CAT QA - QA-1 Number System.md`, and so on. The `QA-`, `DI-` and `VA-` prefixes do not clash with GMAT (`Q-`, `D-`, `V-`) or GRE Quant (`Q-1` to `Q-10` from the parallel session; GRE files sit in their own folder).

**Link, don't rewrite.** Where a GMAT node already teaches the method, the CAT node is short. It links to the GMAT node, then adds only what CAT tests beyond GMAT, plus the real CAT questions. "New" means no GMAT node covers it (GMAT Focus has no geometry, for example).

### 2a. `cat-qa`: Quantitative Ability (22 questions)

Rough weights from coaching analyses: arithmetic 8 to 9 questions, algebra 6 to 7, geometry and mensuration 3 to 5, number system 2 to 3, modern maths 2 to 3. I will recount these from the real papers once they are loaded.

| Node | Topic | Link to GMAT | CAT extra |
|---|---|---|---|
| QA-1 | Number System | Q-1 Number Properties | remainders (cyclicity, Fermat and Euler), last digits, trailing zeros in factorials, number of factors, bases |
| QA-2 | Percentages, Profit and Loss, Interest | Q-3 Percents, Q-5 Profit/Loss and Interest | successive discounts, marked price, CI instalments |
| QA-3 | Ratio, Proportion, Mixtures and Alligation | Q-4 Ratio, Proportion and Mixtures | alligation rule, replacement (repeated dilution), partnership |
| QA-4 | Averages | Q-6 Averages and Weighted Averages | little extra; mostly links |
| QA-5 | Time, Speed and Distance | Q-10 Rates, Work and Distance | relative speed, trains, boats and streams, races, circular tracks |
| QA-6 | Time and Work, Pipes and Cisterns | Q-10 Rates, Work and Distance | negative work (leaks), work equivalence (man-days) |
| QA-7 | Linear Equations and Word Problems | Q-7 Linear Equations, Q-11 Word Problems | integer-solution word problems, which CAT likes |
| QA-8 | Quadratics, Polynomials and Functions | Q-8 Quadratics, Functions, Sequences | roots and coefficients, graphs of functions, f(x) puzzles |
| QA-9 | Inequalities, Modulus, Maxima and Minima | Q-9 Inequalities and Absolute Value | AM-GM, max/min of expressions |
| QA-10 | Indices, Surds and Logarithms | Q-2 Arithmetic Core (exponents, roots) | logarithms are new |
| QA-11 | Progressions and Series | Q-8 (sequences part) | AP, GP, HP, sums of series |
| QA-12 | Geometry: Triangles, Circles, Polygons | **new** (GMAT Focus has no geometry; link the GRE geometry node if the GRE session builds one) | similarity, Pythagoras triples, circle theorems |
| QA-13 | Mensuration (2D and 3D) | **new** | areas, volumes, surface area |
| QA-14 | Coordinate Geometry | **new** | lines, distance, areas on the plane |
| QA-15 | Permutations, Combinations and Probability | Q-13 Counting and Probability | distributions of objects, CAT-style counting |
| QA-16 | Set Theory and Venn Diagrams | Q-11 Word Problems (overlapping sets) | 3-set max/min, which also feeds DI-7 |

GMAT Q-12 Statistics is rarely tested in CAT QA, so I'd leave it out unless the papers show otherwise.

### 2b. `cat-dilr`: Data Interpretation and Logical Reasoning (22 questions, 5 sets)

In CAT DILR, each set is one puzzle with 4 or 5 questions, and it is usually more logic than arithmetic. So most nodes are new; only the DI calculation nodes link to GMAT DI.

| Node | Topic | Link to GMAT | Notes |
|---|---|---|---|
| DI-1 | Set Selection and Triage (scan 5 sets, pick the 2 to 3 to solve) | D-7 DI Triage and Guessing | the most important CAT DILR skill; ★ |
| DI-2 | Tables and Charts: fast calculation and approximation | D-3 Table Analysis, D-4 Graphics Interpretation | percentage-change shortcuts link to QA-2 |
| DI-3 | Caselets and Multi-Source Data | D-6 Multi-Source Reasoning | data given in prose |
| DI-4 | Arrangements: linear and circular | new | seating, ordering |
| DI-5 | Distribution, Grouping and Matching Grids | new | who has what, the grid method |
| DI-6 | Scheduling, Sequencing and Calendars | new | time slots, order of events |
| DI-7 | Venn and Set-Based Puzzles | link QA-16 | survey and club puzzles |
| DI-8 | Games and Tournaments | new | round robin, knockout, points tables |
| DI-9 | Scores, Ranks and Max-Min Reasoning | new | ranges of possible values, "at least" and "at most" |
| DI-10 | Routes, Networks and Flows | new | maps, paths, flows through nodes |

### 2c. `cat-varc`: Verbal Ability and Reading Comprehension (24 questions)

| Node | Topic | Link to GMAT | Notes |
|---|---|---|---|
| VA-1 | RC Passage Mapping and Reading Speed | V-5 RC Passage Mapping and Reading Speed | CAT passages run 500 to 700 words, often humanities and philosophy |
| VA-2 | RC Question Types (main idea, inference, tone, application, "all except") | V-6 RC Question Types, V-4 Inference | CAT "all except" questions are new |
| VA-3 | RC Triage and Option Elimination | none | which passage to do first; extreme options |
| VA-4 | Para Summary (MCQ) | V-1 Argument Anatomy (finding the main point) | |
| VA-5 | Para Jumbles (TITA, 4 or 5 sentences) | new | mandatory pairs, opening and closing lines |
| VA-6 | Odd Sentence Out (TITA) | new | |
| VA-7 | Sentence Placement (MCQ) | new | |

The GMAT Critical Reasoning nodes V-2 and V-3 are not tested in CAT.

### 2d. Question for you: a strategy node?

GMAT has `gmat-strategy` (S-1 to S-5). CAT has its own logic: no switching sections, −1 only on MCQs (so you should always attempt TITA), and per-section percentiles that matter for IIM shortlists. I suggest one small extra note inside `cat-qa` or a fourth folder `cat-strategy` with two or three nodes (ST-1 Marking and Attempt Strategy, ST-2 Sectional Timing, ST-3 Scores, Percentiles and IIM Cut-offs). Your call.

---

## 3. Question sources (real questions only)

Summary: **the IIMs publish no open question bank.** Since CAT 2019, each candidate gets the question paper, answer key and their own responses inside their CAT login (see [Careers360 on CAT 2025 answer key](https://bschool.careers360.com/articles/cat-2025-answer-key-release-date-announced-download-cat-response-sheet-pdf-december-4-latest-update)). Prep sites then re-publish those papers for free. So the realistic route is: real past papers from free prep sites, cross-checked against each other. I found no open-licence CAT dataset on GitHub, Hugging Face or Kaggle.

### 3a. Official (IIMs)

| Source | URL | Covers | Count | Format | Licence |
|---|---|---|---|---|---|
| Official CAT mock test | https://iimcat.ac.in (link appears in the run-up to the exam) | the current year's mock | about one full paper (68) | online test only | © IIMs; for practice |
| Candidate question paper, key and response sheet | inside the CAT candidate login | each slot, each year from 2019 | 66 to 68 per slot | PDF/HTML behind login | © IIMs; only useful if you sit CAT |
| Objection decisions in results releases | e.g. [CAT 2023 results release](https://cdn.digialm.com/per/g01/pub/756/ASM/WebPortal/12/PDF/Media_Release_CAT_2023_21st_Dec_2023.pdf) | corrections to official keys | a handful per year | PDF | official; use to fix keys |

### 3b. Free prep-site archives of real past papers (recommended main source)

| Source | URL | Years and slots | Count (est.) | Format | Licence or terms |
|---|---|---|---|---|---|
| **2IIM CAT Question Paper database** | https://online.2iim.com/CAT-question-paper/ (topic-wise: https://online.2iim.com/previous-year-cat-question-by-topic-wise/) | 2017 to 2025; 3 slots a year from 2020, 2 slots 2017 to 2019 | about 24 papers, roughly 1,600 questions | HTML test interface, video solutions, PDF page | free, "No login. No email collection". © 2IIM, all rights reserved |
| **Cracku CAT previous papers** | https://cracku.in/cat-previous-papers | 2017 to 2025 slot-wise, plus single papers for 1990 to 2008 (no 1992 to 1995) | the most years of any source | PDF download and online tests, with solutions | free, says no signup needed; © Cracku |
| Cracku topic-wise PYQ pages | for example https://cracku.in/cat-omets-series-progressions-questions | every topic | site claims 3,000+ QA, 1,000+ VARC, 1,000+ DILR | HTML | free; © Cracku |
| OnlineResult CAT papers | https://onlineresult.in/article/cat-previous-year-question-papers | 2017 to 2024 with answer keys | not stated | PDF | free; check quality before use |

The older 1990 to 2008 papers were written for a different format (no TITA, different marking), but the questions are real and still good practice for QA and DILR.

### 3c. GitHub repositories (checked, mostly not recommended)

| Repo | What's in it | Count | Format | Licence | Verdict |
|---|---|---|---|---|---|
| [Yasirkhan018/Cat-prep](https://github.com/Yasirkhan018/Cat-prep) | claims "authentic" PYQs, CAT 2021 slot 1 to 2024 slot 2 (10 papers), plus 560 originals made by generator scripts | 664 PYQs (220 QA, 204 DILR, 240 VARC) + 82 passages | JSON (`src/lib/data/pyq/questions.json`, `passages.json`) | **none stated** | useful as a cross-check only; skip the originals (script-generated) |
| [mayankmarch25/cat-mastery](https://github.com/mayankmarch25/cat-mastery) | 343 PYQs it kept after its own clean-up (235 have the key but no solution), plus 2,238 originals | 3,079 total | JS data files (`data/*.js`) | **none stated**; the README itself says CAT papers are IIM property | skip originals; PYQs only as a cross-check |
| [raghavendra-exp/mba-entrance-master](https://github.com/raghavendra-exp/mba-entrance-master) | mixed bank tagged `VERIFIED PYQ`, `ORIGINAL`, `PYQ-STYLE` | 1,228 | JSON (`src/data/questions/questions.json`) | MIT (code), but the source of the questions is not stated | only `VERIFIED PYQ` rows, and only after checking against 2IIM or Cracku |
| [sujithsuresh-803/cat-varc-practice](https://github.com/sujithsuresh-803/cat-varc-practice) | VARC practice app; the real papers (13 papers, 2018 to 2022, 1,024 questions) are **not in the repo** because the PDFs are "all-rights-reserved" | 1,075 practice + 160 "original" QA/DILR | JSON/JS | none stated | skip; no real questions in the repo |
| [Vallabhkejgir/CAT-Prep](https://github.com/Vallabhkejgir/CAT-Prep) | PDF-to-JSON extraction pipeline for PYQs you supply; no data visible | 0 confirmed | Markdown/JSON | none stated | skip; possibly useful as a tool idea |
| [manjunath5496/CAT-Study-Material](https://github.com/manjunath5496/CAT-Study-Material) and related repos | scanned CAT papers and coaching books (`CAT1.pdf` to `CAT93.pdf`, some .rar) | ~90 files | PDF/RAR | none; contains copyrighted books | **skip: piracy** |
| [SherlyGuides/cat-quant-practice](https://github.com/SherlyGuides/cat-quant-practice) | "original" CAT-style questions | 30 | HTML | not checked | **skip: not real questions** |

Hugging Face and Kaggle: no CAT dataset found.

### 3d. How I'd turn this into AHH tests (for the build stage)

1. Use 2IIM (HTML, slot-wise, free, no login) as the main text source and Cracku PDFs as the second copy. A question goes in only if the two copies agree on wording and answer, or if it matches the official key where we have one.
2. Store one test per slot and section, for example `content/tests/cat-qa/cat-2025-slot-1-qa.json`, plus topic sets that reuse the same questions, tagged with QA/DI/VA node ids. Each row records `source` (year, slot, question number, URL) and `type` (`mcq` or `tita`), so the marking can be +3/−1 or +3/0.
3. RC passages and DILR sets are stored once and shared by their 4 or 5 questions.
4. No generated, paraphrased or "CAT-style" questions, ever. If a source's key looks wrong, mark the row and check the IIM objection decisions; don't "fix" it by solving it ourselves without saying so.
5. Start small: CAT 2025 and 2024 (all 6 slots, about 400 questions), then go back year by year.

---

## 4. Open questions for Lokesh

1. Are the QA (16), DILR (10) and VARC (7) node lists right? Anything to merge or split?
2. A strategy folder (`cat-strategy`, ST-1 to ST-3): yes or no?
3. Which CAT are you aiming for: CAT 2026 (29 November, four weeks away) or CAT 2027? That decides whether we start with ★ nodes and timed tests or build the full map first.
4. Is the source rule in 3d (two copies must agree) strict enough, or do you want official-key-only, which would mean far fewer questions?
