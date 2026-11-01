# CA Intermediate track: plan and sources

Stage: **plan and sources only.** Nothing gets built until Lokesh agrees the paper list, the node maps and the source list below. Researched 1 November 2026 from ICAI's own pages (icai.org, boslive.icai.org, resource.cdn.icai.org). Anything I could only find on a coaching or news site is marked **[NOT CONFIRMED]**.

Track slugs (proposed): `ca-inter-cma`, `ca-inter-audit`, `ca-inter-fmsm`, `ca-inter-aa`, `ca-inter-law`, `ca-inter-tax`. They share the `ca-` prefix. The track entry in `src/lib/tracks.ts` waits for the GRE session's generic-track work, and is not part of this stage.

---

## 0. Decisions for Lokesh

1. **Registration date. This one is urgent.** You must be registered for 8 months by the first day of the exam month. To sit **September 2027**, the earliest attempt that fits your graduation, you must register by **1 January 2027**, which is two months away. See section 1.4.
2. **First attempt: Group II alone, or both groups?** This plan builds Group II first, as you asked. The pass rule lets you take one group per sitting.
3. **Copyright.** ICAI's site says its material "may be reproduced only after taking prior written permission from ICAI" (section 5.6). AHH is private, but loading ICAI questions into it is still copying. Choose one: (a) store private study copies with the source on every question and never publish; (b) store only links plus your own answer logs; (c) write to ICAI first. I recommend (a) as long as AHH stays private. The decision is yours.
4. **Node maps.** Approve, cut or merge the Group II nodes in section 4.
5. **App gap to raise with the GRE session.** ICAI MCQs come in sets of five that share one case scenario. The test JSON has no shared-stem field (each question has only its own `question` text). Either the generic-track work adds a `case` or `stem_id` field, or every MCQ repeats the stem.

---

## 1. Scheme and entry

### 1.1 Papers and groups (confirmed)

Source: ICAI Prospectus, February 2026 edition, June 2026 reprint, pp. 16-17, https://resource.cdn.icai.org/75086bos60514-icai-prospectus-new.pdf

| Group | Paper | Marks |
|---|---|---|
| I | 1 Advanced Accounting | 100 |
| I | 2 Corporate and Other Laws (Part I Company Law and LLP 70, Part II Other Laws 30) | 100 |
| I | 3 Taxation: Section A Income-tax Law 50, Section B GST 50 | 100 |
| II | 4 Cost and Management Accounting | 100 |
| II | 5 Auditing and Ethics | 100 |
| II | 6 Financial Management and Strategic Management: 6A FM 50, 6B SM 50 | 100 |

The paper list you had was right. Two details: Corporate and Other Laws is 70/30 between company law and other laws, and Paper 6 is one paper of two 50-mark sections.

The new scheme began on 1 July 2023 (FAQ Q1.1, https://resource.cdn.icai.org/82287bos66363.pdf). The first new-scheme Intermediate exam was May 2024; ICAI's question paper list starts there (https://www.icai.org/post/question-papers-intermediate-course).

Self-paced online modules (Set A Corporate and Economic Laws, Set B Strategic Cost and Performance Management, Set C and Set D electives) are required before CA Final, not for passing Intermediate (Prospectus pp. 14-16). They are out of scope here.

### 1.2 Exam pattern per paper (confirmed from a real paper)

From the cover and instructions of the September 2026 Paper 4 question paper (https://resource.cdn.icai.org/94186bos-aps4903-int-sep2026-p4.pdf):

- Duration **3 hours**, maximum marks **100**.
- **Part I: MCQs, 30 marks.** Answered on an OMR sheet. In this paper: 15 MCQs of 2 marks each, set out as case scenarios of five MCQs plus standalone MCQs. **No negative marking.**
- **Part II: descriptive, 70 marks.** Six questions; Question 1 is compulsory, then any 4 of the other 5 (so 14 marks each). Working notes form part of the answer.

All six papers follow the same 30/70 split on ICAI's MCQ answer key pages (each paper has an MCQ part with a key: https://www.icai.org/post/exam-mcq-ques-and-key-sep2026). I checked only Paper 4's instructions line by line. **[NOT CONFIRMED for each paper's internal question count]**. The Paper 6 question PDF is a scan with no text layer, so it will need OCR.

Skill weightage per paper (Prospectus p. 18): CMA 20-30% knowledge / 70-80% application; Audit 40-60% / 40-60%; FM 20-30% / 70-80%; SM 30-55% / 45-70%.

Section-wise weightages (issued 26 October 2023, ±5% deviation allowed): https://resource.cdn.icai.org/76830bos61899-inter.pdf. These are used in section 4.

### 1.3 Pass rule and exemption (confirmed)

Prospectus p. 47:
- Pass a group: **at least 40% in each paper and 50% aggregate across that group's papers, at one sitting.**
- Both groups at once: 40% in each paper, plus 50% aggregate either in each group or across both groups together.
- **Exemption:** if you fail the group but score **60% or more** in a paper, that paper is exempt for the next three exams. The rest of the group must still reach 40% each and 50% aggregate, with the exempt paper's marks counted.

Your belief (40% per paper, 50% per group) is correct.

### 1.4 Attempts and registration timing (confirmed)

- **Exam months: January, May and September.** ICAI's question paper list shows Intermediate papers for Jan, May and Sept 2025 and 2026 (https://www.icai.org/post/question-papers-intermediate-course). The Prospectus chart says the same (p. 20).
- **Study period: 8 months as on the first day of the exam month.** ICAI's Jan 2027 Intermediate guidance: "required to undergo a study period of 8 months as on first day of the month in which the examination is held i.e. Candidates must have registered for the Intermediate Course on or before 1st May 2026" (https://resource.cdn.icai.org/94939exam-aps6448-inter-guide-jan2027.pdf; also https://resource.cdn.icai.org/94618exam-aps6448-fnd-int-jan2027.pdf).
- **Final-year students can register provisionally.** The 8 months can run during the final year, but you must have passed the degree with the required marks **when you fill in the exam form** (Prospectus p. 15, notes * and **).
- **Registration is valid for 5 years**, with one 5-year revalidation (Jan 2027 guidance).
- The exam form window opens about two months before the exam. For January 2027 it is 3 to 16 November 2026, with a ₹600 late fee to 19 November (Jan 2027 guidance).

**What this means for you (graduating in 2027):**

| Target attempt | Register by | Exam form (approx.) | Works? |
|---|---|---|---|
| May 2027 | 1 Sep 2026 | about Mar 2027 | No. The date has passed, and your BBA result will not be out by the exam form. |
| **Sept 2027** | **1 Jan 2027** | about Jun-Jul 2027 | **Yes, if your final BBA marks are out before the exam form closes.** Check Christ's result date. |
| Jan 2028 | 1 May 2027 | about Nov 2027 | Yes, safely. |
| May 2028 | 1 Sep 2027 | about Mar 2028 | Yes. |

The Sept 2027 exam form dates are **[NOT CONFIRMED]**. I estimated them from the Jan 2027 pattern and a third-party report that the Sept 2026 late-fee window was 20 to 22 July 2026 (https://www.pw.live/ca/exams/icai-exam-fee-chart).

### 1.5 Direct entry eligibility (confirmed, with one point to check)

Prospectus pp. 14-15 (Route II Direct Entry):
- **Commerce** graduates need **55%**; **other** graduates need **60%**.
- ICAI does not list degrees by name. It defines "commerce" by content: at least **three papers** from Accounting, Auditing, Mercantile Laws, Corporate Laws, Economics, Management (including Financial Management), Taxation, Costing, **Business Administration** or Management Accounting (or similar titles), with each paper carrying at least 50 marks in a semester or year and at least 100 marks in total across the course.
- A Christ BBA has Taxation, Management Accounting and SFM, and the degree itself is Business Administration. On this test it should count as commerce, which means **55%**. ICAI does not say "BBA" anywhere, though, so **[NOT CONFIRMED by name]**. If your aggregate falls between 55% and 60%, confirm with ICAI (Call Sahayata +91 99975 99975) before you register. How a CGPA converts to a percentage is also **[NOT CONFIRMED]**; ICAI says "or its equivalent grade".
- Foundation is waived for direct entrants.

### 1.6 Fees (confirmed)

- **Intermediate registration: ₹18,000** (Prospectus p. 33). That page does not split out what the fee covers.
- **Exam fee, Indian centres: ₹1,500 for one group, ₹2,700 for both.** Late fee ₹600 (Jan 2027 guidance, section 5).
- ICITSS (IT and soft skills, before articleship) is a later fee: ₹6,500 to ₹7,500 depending on the module (Prospectus, ICITSS section). Not needed for the exam.

---

## 2. Papers, corrected from the official syllabus

The syllabus text is in the Prospectus, pp. 34-46. The current study material is at https://boslive.icai.org/study_material_new_paper_details.php?c=intermediate&language=English. It has two editions: "Applicable for May 2027 Exam Onwards" (CMA, Audit, SM, AA, Law, Tax) and "Applicable for May 2026 Examination Onwards" (FM is still the August 2025 edition).

**Group II (build first)**

| Paper | ICAI study material chapters (May 2027 edition) |
|---|---|
| 4 CMA | 1 Introduction, 2 Material Cost, 3 Employee Cost and Direct Expenses, 4 Overheads (Absorption Costing), 5 Activity Based Costing, 6 Cost Sheet, 7 Cost Accounting Systems, 8 Unit and Batch Costing, 9 Job Costing, 10 Process and Operation Costing, 11 Joint Products and By-Products, 12 Service Costing, 13 Standard Costing, 14 Marginal Costing, 15 Budgets and Budgetary Control |
| 5 Audit | 1 Nature, Objective and Scope, 2 Strategy, Planning and Programme, 3 Risk Assessment and Internal Control, 4 Audit Evidence, 5 Audit of Items of Financial Statements, 6 Documentation, 7 Completion and Review, 8 Audit Report, 9 Special Features of Different Entities, 10 Audit of Banks, 11 Ethics and Terms of Engagement |
| 6A FM | 1 Scope and Objectives, 2 Types of Financing, 3 Ratio Analysis, 4 Cost of Capital, 5 Capital Structure, 6 Leverages, 7 Investment Decisions, 8 Dividend Decision, 9 Working Capital (several units) |
| 6B SM | 1 Introduction, 2 External Environment, 3 Internal Environment, 4 Strategic Choices, 5 Implementation and Evaluation |

**Group I (outline later)**

| Paper | Syllabus headings |
|---|---|
| 1 AA | AS formulation and framework; applicability; 28 Accounting Standards (AS 1 to AS 29, no AS 6 or AS 8); Schedule III company accounts, buy-back, reconstruction; branches including foreign branches |
| 2 Law | Companies Act 2013 (11 chapters: preliminary to companies incorporated outside India); LLP Act 2008; General Clauses Act 1897; Interpretation of Statutes; FEMA 1999 |
| 3 Tax | Income tax: basic concepts, residence, five heads, clubbing, set-off, deductions, TDS/TCS/advance tax, returns, computation under both regimes. GST: constitution, supply, charge, RCM, exemptions, composition, classification, place/time/value of supply, ITC, liability, registration, invoices and e-way bill, records, returns, payment |

**Important for Taxation:** ICAI has confirmed that **the Income-tax Act, 2025 applies from the May 2027 exam onwards.** The new study material is titled "Applicable for May 2027/ September 2027/ January 2028 Exams" (https://www.icai.org/post/bos-int-course-p3-taxation-msj27-28). January 2027 is the last attempt on the 1961 Act (the Jan 2027 RTP states "A.Y. 2026-27", https://resource.cdn.icai.org/94898bos-aps6603-jan2027-p3.pdf). Your attempts fall in the 2025 Act era.

---

## 3. Overlap map

Key: **Link** = the existing node covers the CA topic well enough to link it, with only a short CA add-on (ICAI format, ICAI terms). **Partial** = link it as background, but write a new CA node. **New** = nothing in AHH.

Every link still needs a check against ICAI study material for terms and conventions. ICAI's methods are the ones that earn marks.

### 3.1 Paper 4 CMA vs `content/recall/management-accounting/`

| CA topic | AHH node | Verdict |
|---|---|---|
| Objectives and scope; cost vs financial vs management accounting | MA FM-1, FM-2 | Partial (the CA version adds installation of a costing system and the relation to FM) |
| Material variances (price, usage, mix, yield) | MA SC-1 | **Link** |
| Labour variances (rate, efficiency, idle, mix, yield) | MA SC-2 | **Link** |
| Overhead variances | MA SC-3 | **Link** (check ICAI's fixed overhead split into expenditure, volume, efficiency, capacity, calendar) |
| Reconciliation and integrated variance problem | MA SC-4 | **Link** |
| Budget concepts, budgetary control | MA BU-1 | **Link** |
| Fixed and flexible budgets | MA BU-2 | **Link** |
| Functional and master budgets | MA BU-3 | **Link** |
| Cash budget | MA BU-4 | **Link** |
| ZBB, performance budgets, behaviour | MA BU-5 | Partial (control ratios, budget variances, feedback vs feed-forward are new) |
| EOQ and stock levels | SFM WC-5 | Partial (CMA adds re-order, minimum, maximum and danger levels, plus stores records) |
| Cost sheet, elements, cost behaviour | none | New |
| Material issue pricing, losses, ABC/FSN/HML/VED | none | New |
| Employee cost, turnover, Halsey and Rowan | none | New |
| Overheads: primary and secondary distribution, absorption, under/over absorption | none | New |
| Activity based costing | none (one mention only) | New |
| Integrated and non-integrated accounts; cost vs financial profit reconciliation | none | New |
| Unit, batch, job, process (equivalent units), joint and by-products, service costing | none | New |
| Marginal costing, CVP, marginal vs absorption, short-term decisions | none (BEP appears only in passing in FM-1/FM-2) | New |

Not in CA CMA, so not linked: MA Unit 2 (cash flow statement, ratios; these go to FM and AA instead), MA Unit 5 (sustainability), MA SC-5 and SC-6 (responsibility accounting and BSC; the BSC links to SM below).

**Result: 6 of 38 CMA nodes link, 3 partial. About three quarters of CMA is new writing,** mostly the cost-ascertainment and methods chapters (sections II and III, 55-65% of the paper).

### 3.2 Paper 5 Audit

No auditing subject exists in AHH. **Everything is new.** (The "materiality" in `sustainable-finance` is ESG materiality, a different idea. Do not link it.) Audit is the largest block of new writing, and it is theory-heavy (40-60% knowledge-level).

### 3.3 Paper 6 FM + SM vs `content/recall/sfm/`, `corporate-valuation/` and others

| CA topic | AHH node | Verdict |
|---|---|---|
| Objective of FM, wealth maximisation, value creation | SFM CB-1, VB-1 | Partial |
| Ratio analysis, calculation and interpretation | MA FS-4, FS-5 | **Link** |
| Sources of finance (lease, sale and leaseback) | SFM LH-1, WC-2 | Partial (P2P, crowdfunding, VC, international sources are new) |
| Cost of equity via CAPM | SAPM PM-3 | Partial |
| WACC | CV FF-1 | Partial (CA needs book vs market weights and marginal cost of capital) |
| Cost of debt and preference capital; capital structure theories (NI, NOI, traditional, MM); EBIT-EPS; leverages | none | New |
| Payback, ARR, NPV, IRR, MIRR, PI, capital rationing, EAC | none (SFM Unit 1 covers risk-adjusted appraisal only) | New |
| Dividend forms, determinants | SFM DV-1, DV-2 | **Link** |
| Walter, Gordon, MM, traditional | SFM DV-3, DV-4, DV-5, DV-6 | **Link** |
| WC concepts, operating cycle | SFM WC-1 | **Link** |
| WC estimation | SFM WC-1, WC-6 | **Link** |
| Receivables, credit policy, factoring | SFM WC-4, WC-2 | **Link** (forfaiting is new) |
| Cash management, Baumol, Miller-Orr | SFM WC-3 | **Link** |
| Inventory | SFM WC-5 | **Link** |
| Payables, banking norms (Tandon, Chore) | SFM WC-2 | Partial |
| PESTLE | Intl Marketing ME-7 | Partial |
| Porter's five forces | Intl Marketing SL-1, Retail MA-4 | **Link** |
| Generic strategies | Intl Marketing SL-2 | **Link** |
| SWOT, Ansoff | Retail MA-2 | Partial (it is set in retail; CA wants the general form plus the ADL matrix) |
| Strategic performance measures (BSC) | MA SC-6 | **Link** |
| Strategic intent, levels, Mendelow, strategic drivers, resources and capabilities, BCG, GE, corporate strategies, implementation, digital change, structure and culture, leadership, control | none | New |

Corporate Valuation is mostly beyond Inter (DCF, APV, M&A are CA Final AFM topics). Only FF-1 (WACC) is useful here.

**Result: FM is about half linked** (dividends and working capital almost wholly; financing and capital budgeting basics are new). **SM is about a fifth linked**, through the marketing and retail notes.

### 3.4 Group I (summary)

| Paper | Links | Gap |
|---|---|---|
| Tax | `content/recall/taxation/` covers the five heads (HP-1 to HP-9, PG-1 to PG-6, CG-1 to CG-6, OS-1 to OS-4), salary (Unit 2), residence (Unit 1) and computation (TL-1 to TL-3) | **The notes are on the 1961 Act, AY 2026-27 (59 mentions); ICAI tests the 2025 Act from May 2027.** Concepts carry over, but every section number, term (tax year in place of PY/AY) and figure needs re-checking against ICAI's May 2027 module. Partial at best. New: clubbing, set-off and carry forward, Chapter VI-A deductions in full, TDS/TCS/advance tax, returns, and **all of GST** (50 marks). |
| AA | MA FS-1, FS-2 (cash flow statement; AS 3 is Partial); SFM LH-2 (lease accounting; AS 19 is Partial) | Every other AS, Schedule III, buy-back, reconstruction, branches |
| Law | none | Everything |

---

## 4. Node maps

Format follows `content/recall/derivatives/Derivatives MOC.md`: one line per node, the prefix per unit, and the last node of each unit is "Exam Answers". Units follow ICAI's section-wise weightage groups, so the weights tell you priority. Link tags: **[L: …]** link, **[P: …]** partial, no tag = new.

Grouping by level: these subjects would sit under a new `ca-inter` group, beside `ca-found` and `ca-final` if they ever exist, in the same way `SUBJECT_GROUP_MAP` in `src/lib/subject/shared.ts` maps subjects to `sem5`/`sem6`. Only Intermediate is in scope.

### 4.1 `ca-inter-cma`: Paper 4 Cost and Management Accounting (38 nodes)

**Unit 1: Overview (OV), weight 10-15%, ICAI ch. 1 and 6**
- OV-1 Objectives, scope, users; cost vs financial vs management accounting vs FM; installing a costing system [P: MA FM-1, FM-2]
- OV-2 Cost terms and concepts, elements of cost, cost control vs cost reduction
- OV-3 Cost behaviour: fixed, variable, semi-variable, step; separating the components
- OV-4 Methods and techniques of costing; digital costing
- OV-5 Cost sheet for manufacturing and service sectors
- OV-6 Unit 1 Exam Answers

**Unit 2: Ascertainment of cost (EL), weight 35-40%, ICAI ch. 2-5 and 7**
- EL-1 Procurement, GeM, ERP, tenders; valuation of receipts
- EL-2 Issue pricing (FIFO, weighted average etc.), stores records, stock verification
- EL-3 Stock levels and EOQ [P: SFM WC-5]
- EL-4 Inventory control (ABC, FSN, HML, VED, JIT, ratios); waste, scrap, spoilage, defectives
- EL-5 Employee cost: attendance, payroll, wage elements, overtime, idle time, cost control
- EL-6 Employee turnover; incentive schemes (Halsey, Rowan, piece rates)
- EL-7 Direct expenses
- EL-8 Overheads: classification, allocation, primary distribution
- EL-9 Secondary distribution: repeated distribution, simultaneous equations
- EL-10 Absorption rates, under/over absorption; administration, selling, distribution and R&D overheads
- EL-11 Activity based costing
- EL-12 Integrated and non-integrated accounting systems, cost ledger entries
- EL-13 Reconciling cost and financial profit
- EL-14 Unit 2 Exam Answers

**Unit 3: Methods of costing (MC), weight 20-25%, ICAI ch. 8-12**
- MC-1 Unit costing; batch costing and economic batch quantity
- MC-2 Job costing
- MC-3 Process costing: normal and abnormal loss, abnormal gain
- MC-4 Equivalent units, WIP valuation (FIFO, weighted average), inter-process profit
- MC-5 Joint products and by-products
- MC-6 Service costing (transport, hotel, hospital, power, IT)
- MC-7 Unit 3 Exam Answers

**Unit 4: Cost control and analysis (CC), weight 25-30%, ICAI ch. 13-15**
- CC-1 Standard costing and material variances [L: MA SC-1]
- CC-2 Labour variances [L: MA SC-2]
- CC-3 Variable and fixed overhead variances [L: MA SC-3]
- CC-4 Reconciliation statements and integrated problems [L: MA SC-4]
- CC-5 Marginal costing, CVP, BEP, margin of safety, angle of incidence, PV chart
- CC-6 Marginal vs absorption costing, profit reconciliation
- CC-7 Short-term decisions: make or buy, discontinuation, multi-product BEP, key factor
- CC-8 Budget concepts, functional and flexible budgets [L: MA BU-1, BU-2, BU-3]
- CC-9 Cash budget and master budget [L: MA BU-4]
- CC-10 ZBB, performance budgets, control ratios, budget variances, motivation, feedback and feed-forward [P: MA BU-5]
- CC-11 Unit 4 Exam Answers

### 4.2 `ca-inter-audit`: Paper 5 Auditing and Ethics (42 nodes)

**Unit 1: Nature and planning (AP), weight 12-18% (sections I-II), ICAI ch. 1-2**
- AP-1 Meaning, need, objective and scope of audit; external engagements; qualities of an auditor
- AP-2 SA 200, inherent limitations, relationship with other disciplines
- AP-3 SA 300: planning, overall strategy, audit plan, preliminary engagement activities
- AP-4 Audit programme and documenting the plan
- AP-5 Unit 1 Exam Answers

**Unit 2: Risk assessment and internal control (RI), weight 8-12%, ICAI ch. 3**
- RI-1 Audit risk: inherent, control and detection risk; sampling and non-sampling risk
- RI-2 SA 320: materiality, performance materiality, benchmarks, revision
- RI-3 SA 315: understanding the entity, components of internal control
- RI-4 Evaluating and testing internal control; IFC vs ICFR
- RI-5 Digital audit: IT risks, automated controls, data analytics
- RI-6 SA 330: responses to assessed risks
- RI-7 Unit 2 Exam Answers

**Unit 3: Audit evidence (EV), weight 12-18%, ICAI ch. 4**
- EV-1 SA 500: sufficient appropriate evidence, assertions, sources, audit trail
- EV-2 Tests of control vs substantive procedures; SA 520 analytical procedures
- EV-3 SA 530 audit sampling: design, size, selection
- EV-4 SA 501 (inventory, litigation, segments), SA 505 confirmations, SA 510 opening balances
- EV-5 SA 550 related parties; SA 610 using internal auditors
- EV-6 Unit 3 Exam Answers

**Unit 4: Audit of items of financial statements (AI), weight 12-20%, ICAI ch. 5**
- AI-1 Revenue and other income (sales, interest, rent, dividends, investment gains)
- AI-2 Expenses (purchases, employee benefits, depreciation, interest, power, rent, repairs, insurance, travel)
- AI-3 Equity and liabilities (share capital, reserves, borrowings, payables, provisions)
- AI-4 PPE and intangibles (land, buildings, plant, goodwill, brands, software)
- AI-5 Current assets and contingent liabilities (loans, receivables, inventories, cash)
- AI-6 Unit 4 Exam Answers

**Unit 5: Documentation, completion and reporting (DR), weight 16-24% (sections VI-VII), ICAI ch. 6-8**
- DR-1 SA 230 audit documentation: form, content, ownership, custody
- DR-2 SA 560 subsequent events; SA 570 going concern; SA 450 misstatements
- DR-3 SA 580 written representations; SA 260 and SA 265 communication
- DR-4 SA 700 forming an opinion; SA 701 key audit matters
- DR-5 SA 705 modified opinions; SA 706 EOM and OM paragraphs; SA 710 comparatives
- DR-6 Branch audit, joint audit, Companies Act reporting, CARO
- DR-7 Unit 5 Exam Answers

**Unit 6: Special entities and banks (SE), weight 12-18%, ICAI ch. 9-10**
- SE-1 Government and local bodies
- SE-2 NPOs, trusts, societies, educational institutions, hotels, clubs, hospitals
- SE-3 Partnership firms, LLPs, co-operative societies
- SE-4 Bank audit: accounting system, approach, revenue items
- SE-5 Bank advances and NPAs
- SE-6 Unit 6 Exam Answers

**Unit 7: Ethics and engagement terms (ET), weight 8-10%, ICAI ch. 11**
- ET-1 Ethics, principles vs rules, the five fundamental principles
- ET-2 Independence: threats, safeguards, professional scepticism
- ET-3 SA 210: preconditions, engagement letter, recurring audits
- ET-4 SQC 1 and SA 220 quality control (check against the May 2027 study guidelines; ICAI's quality management standards may replace these)
- ET-5 Unit 7 Exam Answers

### 4.3 `ca-inter-fmsm`: Paper 6 FM (section A) and SM (section B) (49 nodes)

**Unit 1: FM function and financial analysis (FA), weight 10-15% of FM, ICAI FM ch. 1 and 3**
- FA-1 Objective and scope; profit vs wealth maximisation; finance manager vs controller; distress and insolvency [P: SFM CB-1, VB-1]
- FA-2 Ratio calculation and interpretation [L: MA FS-4, FS-5]
- FA-3 Building financial statements from ratios (a common ICAI question)
- FA-4 Unit 1 Exam Answers

**Unit 2: Financing decisions (FD), weight 45-50% of FM, ICAI FM ch. 2 and 4-6**
- FD-1 Sources of finance: long-term, short-term, contemporary (P2P, crowdfunding, start-up), international, lease, VC [P: SFM LH-1, WC-2]
- FD-2 Cost of debt, preference capital, equity (dividend growth, CAPM), retained earnings [P: SAPM PM-3]
- FD-3 WACC with book and market weights; marginal cost of capital [P: CV FF-1]
- FD-4 Capital structure theories: NI, NOI, traditional, MM with and without tax
- FD-5 EBIT-EPS, indifference point, financial BEP, optimum structure, over/under capitalisation
- FD-6 Operating, financial and combined leverage
- FD-7 Unit 2 Exam Answers

**Unit 3: Investment and dividend decisions (ID), weight 20-25% of FM, ICAI FM ch. 7-8**
- ID-1 Cash flow estimation; payback, discounted payback, ARR
- ID-2 NPV, PI, IRR, MIRR, multiple IRRs, NPV vs IRR conflicts
- ID-3 Capital rationing, equivalent annual cost, working capital in NPV, replacement decisions
- ID-4 Dividend basics: cash and stock dividends, bonus, splits, buy-backs, determinants [L: SFM DV-1, DV-2]
- ID-5 Walter, Gordon, MM, traditional approach [L: SFM DV-3 to DV-6]
- ID-6 Unit 3 Exam Answers

**Unit 4: Working capital (WM), weight 15-20% of FM, ICAI FM ch. 9**
- WM-1 Concepts, liquidity vs profitability, operating and cash conversion cycles [L: SFM WC-1]
- WM-2 Estimating working capital requirement [L: SFM WC-1, WC-6]
- WM-3 Receivables, credit policy, factoring, forfaiting [L: SFM WC-4, WC-2]
- WM-4 Cash management, Baumol, Miller-Orr, treasury [L: SFM WC-3]
- WM-5 Inventory, payables, banking norms [L: SFM WC-5; P: WC-2]
- WM-6 Unit 4 Exam Answers

**Unit 5: Introduction to SM (SI), weight 15-25% of SM, ICAI SM ch. 1**
- SI-1 Meaning, nature, importance and limitations of strategic management
- SI-2 Strategic intent: vision, mission, goals, values
- SI-3 Strategic levels: network, corporate, business, functional
- SI-4 Unit 5 Exam Answers

**Unit 6: External environment (SX), weight 15-25% of SM, ICAI SM ch. 2**
- SX-1 International and macro environment, PESTLE [P: Intl Marketing ME-7]
- SX-2 Defining the industry: value chain, product life cycle
- SX-3 Porter's five forces [L: Intl Marketing SL-1, Retail MA-4]
- SX-4 Customers, markets and competition
- SX-5 Unit 6 Exam Answers

**Unit 7: Internal environment (SN), weight 15-25% of SM, ICAI SM ch. 3**
- SN-1 Stakeholders and Mendelow's matrix
- SN-2 Strategic drivers
- SN-3 Resources, capabilities and core competence
- SN-4 SWOT, combining external and internal analysis [P: Retail MA-2]
- SN-5 Porter's generic strategies [L: Intl Marketing SL-2]
- SN-6 Unit 7 Exam Answers

**Unit 8: Strategic choices (SC), weight 15-25% of SM, ICAI SM ch. 4**
- SC-1 Corporate strategies: concentric, conglomerate, horizontal and vertical integration, market and product development, innovation
- SC-2 Turnaround, divestment, liquidation
- SC-3 Ansoff and ADL matrices [P: Retail MA-2]
- SC-4 BCG and GE matrices
- SC-5 Unit 8 Exam Answers

**Unit 9: Implementation and evaluation (SV), weight 15-25% of SM, ICAI SM ch. 5**
- SV-1 Formulation vs implementation, linkages and issues
- SV-2 Strategic change through digital transformation
- SV-3 Organisation structure and culture
- SV-4 Strategic leadership
- SV-5 Strategic control and performance measures [L: MA SC-6]
- SV-6 Unit 9 Exam Answers

### 4.4 Group I: outlines only

**`ca-inter-aa`: Advanced Accounting** (sections: AS 55-65%, company accounts 30-35%, branches 5-10%)
- Unit 1 Framework and AS process: formulation, Ind AS convergence, carve-outs, framework, applicability
- Unit 2 AS for income and inventories: AS 2, 7, 9
- Unit 3 AS for assets: AS 10, 16, 19, 26, 28 [P: SFM LH-2 for AS 19]
- Unit 4 AS for liabilities and taxes: AS 4, 15, 22, 29
- Unit 5 AS for FX, grants and investments: AS 11, 12, 13
- Unit 6 Disclosure AS: AS 1, 3, 5, 17, 18, 20, 24, 25 [P: MA FS-1, FS-2 for AS 3]
- Unit 7 Group AS: AS 14, 21, 23, 27
- Unit 8 Company accounts: Schedule III, buy-back, reconstruction
- Unit 9 Branch accounts, including foreign branches

**`ca-inter-law`: Corporate and Other Laws** (Part I 70 marks, Part II 30 marks)
- Units 1-4 Companies Act 2013 in ICAI's four weightage sections (incorporation and prospectus; share capital, deposits and charges; management, dividends, accounts and audit; companies incorporated outside India)
- Unit 5 LLP Act 2008
- Unit 6 General Clauses Act 1897
- Unit 7 Interpretation of Statutes
- Unit 8 FEMA 1999

**`ca-inter-tax`: Taxation** (Income-tax Act 2025 from May 2027; GST)
- Units 1-5 Income tax: basic concepts and residence; salaries and house property; PGBP and capital gains; other sources, clubbing and set-off; deductions, TDS/TCS/advance tax, returns, computation under both regimes [P: every `taxation/` node, re-based to the 2025 Act]
- Units 6-9 GST: introduction and constitution; supply, charge, exemptions, composition; classification, place, time and value of supply, ITC, liability; registration, invoices, e-way bill, records, returns, payment

Group II totals: CMA 38, Audit 42, FM+SM 49 (129 nodes). Linked: 17; partly linked: 10.

---

## 5. Sources (real questions only)

All of these are ICAI's own, free on resource.cdn.icai.org. "Current scheme" means the post-July 2023 syllabus. Nothing has been bulk-downloaded; I opened only the files cited above to check the facts.

### 5.1 Past question papers, current scheme (8 attempts so far)

Index: https://www.icai.org/post/question-papers-intermediate-course. Format: PDF, 30 MCQ marks plus 70 descriptive marks. Some papers are scans (Sept 2026 Paper 6 has no text layer, so it needs OCR).

| Attempt | P4 CMA | P5 Audit | P6 FM+SM |
|---|---|---|---|
| Sept 2026 | https://resource.cdn.icai.org/94186bos-aps4903-int-sep2026-p4.pdf | https://resource.cdn.icai.org/94207bos-aps4903-int-sep2026-p5.pdf | https://resource.cdn.icai.org/94309bos-aps4903-int-sep2026-p6.pdf |
| May 2026 | https://resource.cdn.icai.org/92190bos-aps4903-int-may2026-p4.pdf | https://resource.cdn.icai.org/92223bos-aps4903-int-may2026-p5.pdf | https://resource.cdn.icai.org/92261bos-aps4903-int-may2026-p6.pdf |
| Jan 2026 | https://resource.cdn.icai.org/90301bos-aps3856-int-jan2026-p4.pdf | https://resource.cdn.icai.org/90667bos-aps3856-int-jan2026-p5.pdf | https://resource.cdn.icai.org/90369bos-aps3856-int-jan2026-p6.pdf |
| Sept 2025 | https://resource.cdn.icai.org/88318bos-aps2271-int-p4-sep2025.pdf | https://resource.cdn.icai.org/88273bos-aps2271-int-p5-sep2025.pdf | https://resource.cdn.icai.org/88294bos160925.pdf |
| May 2025 | https://resource.cdn.icai.org/86049bos-aps471-int-p4.pdf | https://resource.cdn.icai.org/86050bos-aps471-int-p5.pdf | https://resource.cdn.icai.org/86051bos-aps471-int-p6.pdf |
| Jan 2025 | https://resource.cdn.icai.org/84222bos67894-p4.pdf | https://resource.cdn.icai.org/84223bos67894-p5.pdf | https://resource.cdn.icai.org/84224bos67894-p6.pdf |
| Sept 2024 | https://resource.cdn.icai.org/82219bos66270.pdf | https://resource.cdn.icai.org/82232bos66294.pdf | https://resource.cdn.icai.org/82246bos66313.pdf |
| May 2024 | https://resource.cdn.icai.org/80257bos64413.pdf | https://resource.cdn.icai.org/80289bos64445.pdf | https://resource.cdn.icai.org/80550bos64734.pdf |

Group I papers for the same attempts are on the same index page (Sept 2026: P1 94131, P2 94157, P3 94185; May 2026: P1 92099, P2 92143, P3 92144; and so on).

The year labels for Jan 2025 to May 2024 come from the order of the headings on the index page; I matched them by position. **[Check each PDF's cover before importing.]**

### 5.2 Suggested answers (ICAI's model answers)

Index: https://www.icai.org/post/suggested-answer-intermediate. One page per attempt: Sept 2026 https://www.icai.org/post/sugg-ans-inter-sep2026 (P4 https://resource.cdn.icai.org/94856bos-aps6590-sep2026-sa4.pdf, P5 https://resource.cdn.icai.org/94857bos-aps6590-sep2026-sa5.pdf, P6 https://resource.cdn.icai.org/94858bos-aps6590-sep2026-sa6.pdf), May 2026 https://www.icai.org/post/sugg-ans-inter-may2026, Jan 2026 https://www.icai.org/post/sugg-ans-inter-jan2026, Sept 2025 https://www.icai.org/post/sugg-ans-inter-sep2025, May 2025 https://www.icai.org/post/sugg-ans-inter-may2025, Jan 2025 https://www.icai.org/post/sugg-ans-inter-jan2025, Sept 2024 https://www.icai.org/post/sugg-ans-inter-sep2024. Format: PDF, full workings. These provide the `model_answer` and `marking_scheme` for descriptive questions.

### 5.3 Official MCQ answer keys

Each exam's MCQ part, with ICAI's key: Sept 2026 https://www.icai.org/post/exam-mcq-ques-and-key-sep2026 (P4 https://resource.cdn.icai.org/94843exam-aps6587-mcq-kp4.pdf, P5 https://resource.cdn.icai.org/94844exam-aps6587-mcq-kp5.pdf, P6 https://resource.cdn.icai.org/94845exam-aps6587-mcq-kp6.pdf), May 2026 https://www.icai.org/post/exam-mcq-ques-and-key-may2026 (P4 https://resource.cdn.icai.org/92869exam-may2026-mcq-keys-int-p4.pdf, P5 https://resource.cdn.icai.org/92870exam-may2026-mcq-keys-int-p5.pdf, P6 https://resource.cdn.icai.org/92871exam-may2026-mcq-keys-int-p6.pdf), Sept 2025 https://www.icai.org/post/exam-mcq-ques-and-key-sep2025 (P4 https://resource.cdn.icai.org/89262exam-aps3009-int-p4.pdf, P5 https://resource.cdn.icai.org/89263exam-aps3009-int-p5.pdf, P6 https://resource.cdn.icai.org/89264exam-aps3009-int-p6.pdf). The Jan 2026 key page (https://www.icai.org/post/exam-mcq-ques-and-key-jan2026) lists Final papers first; the Intermediate links there are **[NOT CHECKED]**. This is the cleanest source for app MCQs: real question, official key, no guessing.

### 5.4 Revision Test Papers (RTPs)

Questions with answers, released before each attempt. Format: PDF, MCQ case scenarios plus descriptive questions.

| RTP | P4 | P5 | P6 |
|---|---|---|---|
| Jan 2027 (https://www.icai.org/post/rtp-intermediate-course-jan2027) | https://resource.cdn.icai.org/94899bos-aps6603-jan2027-p4.pdf | https://resource.cdn.icai.org/94900bos-aps6603-jan2027-p5.pdf | https://resource.cdn.icai.org/94901bos-aps6603-jan2027-p6.pdf |
| Sept 2026 (https://www.icai.org/post/rtp-intermediate-course-sep2026) | https://resource.cdn.icai.org/92945rtp-int-sep2026-4.pdf | https://resource.cdn.icai.org/92946rtp-int-sep2026-5.pdf | https://resource.cdn.icai.org/93044rtp-int-sep2026-6.pdf |
| May 2026 (https://www.icai.org/post/rtp-intermediate-course-may2026) | https://resource.cdn.icai.org/91025bos-aps4256-int-may2026-p4.pdf | https://resource.cdn.icai.org/91021bos-aps4256-int-may2026-p5.pdf | https://resource.cdn.icai.org/91022bos-aps4256-int-may2026-p6.pdf |
| Jan 2026 (https://www.icai.org/post/rtp-intermediate-course-jan2026) | https://resource.cdn.icai.org/88956bos-aps2810-p4.pdf | https://resource.cdn.icai.org/88957bos-aps2810-p5.pdf | https://resource.cdn.icai.org/88958bos-aps2810-p6.pdf |

Older RTPs follow the same URL pattern (`rtp-intermediate-course-<mon><year>`); BoS lists them at https://boslive.icai.org/education_content_rtp.php?c=Intermediate.

**Taxation warning:** every Tax RTP and past paper up to Jan 2027 is on the 1961 Act. For `ca-inter-tax`, use only items whose law still holds under the 2025 Act, or wait for the May 2027 RTP.

### 5.5 Mock Test Papers (MTPs)

Two series before each attempt. ICAI puts them up on the BoS Knowledge Portal and BoS app on the day, with the answer key within 48 hours (Sept 2025 announcement: https://resource.cdn.icai.org/86421bos-aps1013-mtp-series-I-II-sep2025-exam.pdf). Direct public PDF links are **[NOT FOUND]**; they may need a student login. For Jan 2027, Series I starts 19 November 2026 and Series II on 3 December 2026 **[NOT CONFIRMED; third-party report, https://www.vsijaipur.com/?p=108743]**.

### 5.6 Study material (in-chapter questions and the test-your-knowledge sets)

Each ICAI chapter ends with MCQs and descriptive questions with answers. These are real ICAI questions and map one-to-one onto the node maps above.
- CMA (May 2027 edition): chapter PDFs from https://resource.cdn.icai.org/93304bos-aps5870-ch1.pdf to https://resource.cdn.icai.org/93318bos-aps5870-ch15.pdf (index: https://boslive.icai.org/sm_chapter_details.php?p_id=189&m_id=236 and `m_id=237`)
- Audit (May 2027 edition): https://resource.cdn.icai.org/93332bos-aps5884-ch1.pdf to https://resource.cdn.icai.org/93342bos-aps5884-ch11.pdf (index `p_id=190`, `m_id=238/239`)
- FM (Aug 2025 edition, still current): https://resource.cdn.icai.org/87737bos280825-ch1.pdf to `87746bos280825-ch8.pdf`; ch. 9 is split into units at https://boslive.icai.org/sm_unit_details.php?c_id=1221
- SM (May 2027 edition): https://resource.cdn.icai.org/93344bos-aps5885-ch1.pdf to https://resource.cdn.icai.org/93348bos-aps5885-ch5.pdf
- Tax Section A (2025 Act, May 2027 onwards): https://www.icai.org/post/bos-int-course-p3-taxation-msj27-28
- Applicability list (which edition is valid for which attempt), May 2026 example: https://boslive.icai.org/assets/BOS_Study_Material_applicable_for_May_2026_Examination.pdf

### 5.7 Old-scheme material (use with care)

- MCQ and Case Scenario booklets, 2021-22, old scheme: P2 Law https://resource.cdn.icai.org/62697bos050121interp2c.pdf, P4 Tax https://resource.cdn.icai.org/62699bos050121interp4.pdf, old P6 Auditing and Assurance https://resource.cdn.icai.org/62698bos050121interp6a.pdf. The paper numbers differ from the new scheme, and the tax law is out of date. Audit concepts carry over after checking the syllabus; law and tax need care.
- Old-scheme suggested answers (Nov 2018 to Nov 2023) are linked from https://www.icai.org/post/new-scheme-of-education-and-training under "Old Suggested Answers". Not opened.

### 5.8 GitHub and other free banks

I found **no open-licence CA Intermediate question bank** on GitHub. A GitHub repository search for "ICAI intermediate questions" returned nothing, and a web search found only A-Level banks. Coaching sites (catestseries, studycaller and others) either sell their banks or rehost ICAI PDFs without a stated licence, so they are skipped. ICAI is the only source needed.

### 5.9 Copyright

ICAI's policy (https://www.icai.org/post/16585): "Material displayed on this website may be reproduced only after taking prior written permission from ICAI ... Wherever the material is being published or issued to others, the source must be prominently acknowledged." See decision 3 in section 0. Whatever you choose, every imported question should carry a source line (attempt, paper, question number, or RTP/MTP series), and AHH must stay private.

### 5.10 How the sources map onto AHH test types

| ICAI item | AHH `type` | Notes |
|---|---|---|
| Exam MCQs, RTP MCQs | `mcq`, `marks: 2` | The answer comes from ICAI's key. The `explanation` comes from the suggested answer where one exists; otherwise it says "Key only, no ICAI explanation". It is never written by AI. |
| 4-6 mark descriptive parts | `short` | `model_answer` is ICAI's suggested answer, taken word for word |
| 7-10 mark parts | `long` | Same |
| 14-mark full question | `case` | Same |

Each question's `node` field holds the node it tests.

---

## 6. Proposed build order (after your go)

1. `ca-inter-cma` Unit 4 (CC), mostly links to your fresh MA notes, as a quick first win and to test the import format.
2. `ca-inter-fmsm` Units 3-4 (ID, WM), mostly SFM links; then Unit 2 (FD, 45-50% of FM, new).
3. `ca-inter-cma` Units 2-3 (EL, MC), the largest new numerical block.
4. `ca-inter-fmsm` SM Units 5-9.
5. `ca-inter-audit`, all new and theory, so it pairs with the RTP and suggested-answer text.
6. Group I outlines, turned into full maps once Group II is under way.

Each unit gets: notes in the `exam-notes-author` format, a node map, and an ICAI-only question bank in `content/tests/<slug>/`.

## 7. Still to check

- Christ's final-semester result date for 2027 (decides whether Sept 2027 is possible).
- Whether ICAI accepts a Christ BBA as commerce (expected yes; see 1.5) and how CGPA converts.
- The Sept 2027 exam form window.
- May 2027 study guidelines (inclusions and exclusions; whether SQC 1 is replaced in Audit).
- Year labels on the older past papers, and the Jan 2026 MCQ key page.
- MTP access (public link or login).
