---
title: "Unit 1 — Basic Concepts & Residential Status"
type: recall
status: active
created: 2026-07-25
source: claude-session, web research
tags: [taxation, recall, unit-1, residential-status, basic-concepts]
---

# Unit 1 — Basic Concepts & Residential Status

Covers: assessee, person, AY, PY, GTI, total income, average rate of tax, residential status determination, kinds of income and incidence of tax. Companion to [[Unit 1 - Tax Fundamentals and Statutory Framework]]. My source notes: [[Residential Status]], [[questions on residential status]], [[Income Tax]].

## Core definitions (Section 2)

- **Assessee [Sec 2(7)]**: any person liable to pay tax, or any sum (interest, penalty) under the Act, or in respect of whom any proceeding has been taken — broader than "taxpayer"; includes a person against whom proceedings are pending even before liability is finalised.
- **Person [Sec 2(31)]**: individual, HUF, company, firm, AOP/BOI, local authority, and every other artificial juridical person. (Note: not every collection of people — a "crop of wheat" is a classic wrong-answer distractor, not a person.)
- **Previous Year [Sec 3]**: the financial year (1 Apr – 31 Mar) *immediately preceding* the assessment year, in which income is actually earned.
- **Assessment Year [Sec 2(9)]**: the 12-month period (1 Apr – 31 Mar) *following* the previous year, in which that income is assessed and taxed. PY 2025-26 income → taxed in AY 2026-27.
- **Gross Total Income (GTI)**: sum of income computed under all five heads (Salary, House Property, Business/Profession, Capital Gains, Other Sources) after clubbing and set-off of losses, *before* Chapter VI-A deductions.
- **Total Income**: GTI *minus* Chapter VI-A deductions — this is the figure tax is actually computed on. Under the **new regime**, most Chapter VI-A deductions (80C, 80D, etc.) are **not available**; the main survivor is 80CCD(2) (employer's NPS contribution), so Total Income ≈ GTI for most problems.
- **Average rate of tax**: Total tax payable ÷ Total income × 100 — used to convert agricultural income's partial-integration effect into an actual rate (see [[Unit 1 - Capital vs Revenue and Exempted Incomes]]).
- **Agricultural income [Sec 2(1A)]**: rent/revenue from land in India used for agriculture, income from agricultural operations (including processing), income from a farmhouse (subject to conditions) — exempt but relevant for rate purposes.

**Recall prompt:** GTI ₹9,00,000. Under the new regime, can the assessee claim ₹1,50,000 of 80C deductions to reduce this to Total Income ₹7,50,000? → No — 80C does not apply under Sec 115BAC. Total Income stays at ₹9,00,000 (less only the narrow surviving deductions like 80CCD(2), if applicable).

## Clubbing of income and set-off/carry-forward of losses (the "after clubbing and set-off" clause in GTI, spelled out)

These two mechanisms sit *between* computing income under each head and arriving at GTI — both were only namechecked above, so here's the full picture.

**Clubbing of income (Sections 60–65)** — income legally belonging to one person gets added to *another* person's total income to prevent tax avoidance via income-shifting within a family/close relationship:
- Income transferred to a spouse **without adequate consideration** (e.g., gifting an income-generating asset to a spouse) is clubbed into the transferor's income.
- Income of a **minor child** is clubbed into the income of the parent whose income is higher (exception: income from the minor's own skill/talent, or a minor with a disability, is *not* clubbed).
- Income from assets transferred to a **son's wife** without adequate consideration is clubbed into the transferor's income.
- Income from a **revocable transfer** of assets is clubbed back to the transferor.

**Recall prompt:** A father gifts a fixed deposit to his 10-year-old son; interest earned is ₹8,000/year. Whose income is it for tax purposes? → Clubbed into the parent's income (whichever parent has the higher income) — a minor's income is clubbed except where earned through the minor's own skill/talent or where the minor has a specified disability. (A small per-child exemption of ₹1,500 applies against the clubbed amount.)

**Set-off and carry-forward of losses (Sections 70–80):**
- **Intra-head set-off**: loss from one source can be set off against income from *another source under the same head* (e.g., loss from Business A vs profit from Business B) — with some restrictions (e.g., speculative business loss can only be set off against speculative business income).
- **Inter-head set-off**: a loss remaining after intra-head set-off can be set off against income under a *different* head (e.g., business loss against salary income) — subject to restrictions (e.g., loss under "Capital Gains" cannot be set off against any other head; house-property loss set-off against other heads is capped at ₹2,00,000/year).
- **Carry-forward**: any loss that still can't be fully set off in the same year can be carried forward to future years (subject to head-specific time limits — e.g., business loss up to 8 years, house-property loss up to 8 years) and set off against income of the *same head* in those later years — but only if the loss-year return was filed on time.
- A loss from an **exempt source cannot be set off** against profit from a taxable source (logical consequence of the exemption itself).

**Recall prompt:** Where in the Salary → GTI computation chain do clubbing and set-off actually apply — before or after computing "Income from Salary"? → After each head's income is separately computed (including Salary, per [[Unit 2 - Deductions and Computation of Taxable Salary]]), clubbing provisions add in any deemed income, intra/inter-head set-off nets out losses across heads, and only *then* do the five heads sum to GTI.

## Residential status (Section 6) — determines what income is taxable in India

Citizenship is irrelevant; **only physical presence in India** during the relevant years matters.

### Step 1 — Resident vs Non-Resident (basic condition)
An individual is a **Resident** if they satisfy *either*:
(a) present in India for **182 days or more** in the relevant PY, OR
(b) present in India for **60 days or more** in the relevant PY **AND 365 days or more** in the 4 years immediately preceding that PY.

Fail both → **Non-Resident (NR)**.

*Exceptions to the 60-day limb* (extends to 182 days instead): Indian citizens leaving India for employment abroad, or as a crew member; Indian citizens/PIOs visiting India (with income-threshold-linked variants — check current Finance Act if a problem hinges on this).

### Step 2 — Resident: Ordinarily Resident (ROR) vs Not Ordinarily Resident (RNOR)
A **Resident** is **ROR** only if they meet **both** additional conditions:
(a) resident in India in **at least 2 of the 10** PYs immediately preceding the relevant PY, AND
(b) present in India for **730 days or more** during the **7 years** immediately preceding the relevant PY.

Fail either → **RNOR**.

### The three categories and their scope of total income

| Status | Income taxable in India |
|---|---|
| **ROR** | Worldwide income — income earned/received in India + income earned/received outside India (even if not remitted) |
| **RNOR** | Income received/deemed received/accrued in India + income from a business controlled or profession set up in India, even if received outside India |
| **NR** | Only income received or accrued in India (or deemed to be) |

**Recall prompt:** An NRI earns rental income from a house in London, credited to a London bank account, and never remits it to India. Is it taxable in India if she's ROR? RNOR? NR? → ROR: taxable (worldwide income). RNOR: not taxable (foreign income not linked to an Indian business/profession). NR: not taxable.

## Kinds of income and incidence of tax

"Incidence of tax" = which portion of an assessee's income actually gets taxed, driven directly by residential status (above). Practical problems in this topic typically give you a fact pattern (days in India, income sources — Indian salary, foreign rental, foreign dividend, Indian business) and ask you to (1) fix residential status, then (2) apply the scope-of-income table to compute taxable income.

**Recall prompt:** What's the two-step method for every residential-status problem? → Step 1: classify as Resident/NR using the 182-day or 60+365-day test. Step 2 (only if Resident): classify ROR/RNOR using the 2-of-10-years and 730-days-in-7-years tests. Then apply the scope table.

## Sources
- [Residential Status Under Section 6 of Income Tax Act](https://vakilsearch.com/article/residential-status-under-section-6/)
- [Residential Status Under Section 6](https://cleartax.in/s/residential-status)
- [Basic Concepts of Income Tax](https://www.taxmann.com/post/blog/basic-concepts-of-income-tax)
- [Assessment Year Section 2(9)](https://incometaxmanagement.com/Pages/Tax-Ready-Reckoner/Tax-Concepts/Assessment-Year.html)

## Links
- [[Taxation Law MOC]]
- [[Unit 1 - Tax Fundamentals and Statutory Framework]]
- [[Unit 1 - Capital vs Revenue and Exempted Incomes]]
- [[Taxation Units 1-2 MCQ Bank]]
