# Sustainable Finance notes: plan

Build Sustainable Finance (BBA304F-5) to the SAPM/Bond Market standard: node notes, a node map per unit, a question bank per unit, and a subject MOC. Folder slug `sustainable-finance` (label "Sustainable Finance" from default title-casing).

Syllabus: `docs/course-plans/BBA304F-5-Sustainable-Finance.txt` (from the 2026 course plan).

## What the exam is

- **ESE: 50 marks, 2 hours.** Section A: 3 of 5 × 5 marks. Section B: 2 of 3 × 10 marks. Section C: one compulsory 15-mark case. Same shape as `buildMock` in `src/lib/paper.ts`.
- CIA1 (ESG Intelligence Profile, HUL) and CIA3 (War Room, Bangladesh) are done. CIA2 was a case on Units 1-3. The target is the ESE, which covers all five units.
- The subject is mostly theory, so the 15-mark case matters most: every unit's exam-answers node has a case layout.

## Sources

- Course plan (topics, andragogy activities, references: Schoenmaker & Schramade 2019 ch. 1-2, Jeucken 2001, NITI Aayog 2026, UNEP FI, ICMA, GIIN, RBI).
- Student class notes: `D:\Lokesh\Christ\Y3\Y3\F1 - Sustainability\` (16 short notes).
- Student's CIA1 HUL ESG profile: `D:\Lokesh\Christ\Y3\Sustainable Finance.pdf` (handwritten scan), a worked case for Unit 5.
- **Faculty slide deck (single source of truth):** `D:\Lokesh\Downloads\Sustainable FinanceMy.pdf` (384 pp; U1 p2-80, U2 p81-155, U3 p156-277, U4 p278-369, U5 p370-384). Class notes and general knowledge only fill gaps, tagged **(general)**.
- **Cambridge Taxonomy of Business Risks (2019):** `D:\Lokesh\Downloads\crs-cambridge-taxonomy-of-business-risks.pdf`. Layered on top as a labelled "Cambridge lens" section, never overriding the slides.
- **cambridge taxonomy of business risks (2019)** `d:okeshdownloadss-cambridge-taxonomy-of-business-risks.pdf`: layered on top as a labelled "cambridge lens", never overriding the slides.

## Node lists

| Unit | Prefix | Nodes |
|---|---|---|
| 1 Foundations of Sustainable Finance | FS | FS-1 History and evolution (global and India); FS-2 Definition, scope, ESG factors, TBL and the 3Ps; FS-3 UN SDGs, the financing gap and the Seville Commitment; FS-4 International agreements and the role of the financial system; FS-5 ESG risk management fundamentals and the risk matrix; FS-6 Reporting, regulatory frameworks and responsible investment (GRI, SASB, TCFD, ISSB S1/S2, BRSR, PRI); FS-7 Unit 1 exam answers |
| 2 Climate Change and ESG in Decisions | CC | CC-1 Climate change, drivers and impact on corporate financial performance; CC-2 Paris Agreement and COP 26/27/28; CC-3 Government of India climate regulations; CC-4 Scenario analysis, stress testing and credit ratings; CC-5 ESG in managerial decisions and greenwashing; CC-6 Unit 2 exam answers |
| 3 Sustainable Finance Products | SP | SP-1 Strategies and pillars of sustainable finance; SP-2 Green, social and sustainability-linked bonds; SP-3 Impact investing, microfinance and EIA; SP-4 Carbon trading, green loans and green microfinance; SP-5 AI and ML in sustainable finance; SP-6 Unit 3 exam answers |
| 4 Risk in Sustainable Finance | RK | RK-1 Risk identification (market, credit, operational); RK-2 ESG risk quantification (PD, LGD, EAD, expected loss, carbon metrics); RK-3 Risk metrics, reporting frameworks and corporate disclosure; RK-4 Future trends: AI, blockchain, emerging ESG analysis; RK-5 Unit 4 exam answers (Bhopal case) |
| 5 Corporate Sustainable Investment Cases | CS | CS-1 HDFC Bank; CS-2 Infosys; CS-3 ITC; CS-4 JSW Steel; CS-5 Vedanta; CS-6 Unit 5 exam answers and the case-answer method (with HUL from CIA1) |

## Per-unit deliverables

Same as `docs/sapm-bonds-plan.md`: node notes `Sustainable Finance Unit N - XX-k Title.md` with the standard frontmatter; the last node is exam answers; a node map `Sustainable Finance Unit N - <Topic> MOC (Node Map).md`; a question bank `content/tests/sustainable-finance/unit-N-<topic>.json` (~30 questions; `unit` = `Sustainable Finance Unit N`); `Sustainable Finance MOC.md` links every node map.

Company figures in Unit 5 are dated and marked "check the latest report" where they are not from the student's own work.

## Order

Notes for all five units in parallel, then question banks, then an audit. One commit per unit, pushed as it lands.
