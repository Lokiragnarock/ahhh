---
title: "CA Inter CMA Unit 2 - EL-12 Integrated and Non-Integrated Accounting Systems"
type: recall
status: active
created: 2026-11-01
source: "ICAI Intermediate Paper 4 Study Material (July 2026 edition), Chapter 7 Cost Accounting Systems, paras 1-3, Illustrations 1 and 3"
tags: [ca-inter-cma, recall, unit-2, cost-ledger, non-integrated, integrated, control-accounts, journal-entries]
node: EL-12
section: "2.12"
minutes: 45
deps: [EL-10]
weight: 50
exam_focus: true
state: unstudied
---

# EL-12: Integrated and Non-Integrated Accounting Systems

Covers: the non-integrated (cost ledger) system, its ledgers and the eleven principal control accounts with the scheme of journal entries; ICAI Illustration 1 (cost ledger with a trial balance); the integrated system, its advantages, prerequisites and features, with ICAI Illustration 3. **(ICAI SM ch. 7, paras 1-3)**

## Where this fits in the exam

Journal entries in cost books and writing up control accounts are a regular 10-mark question; "which account replaces the cost ledger control account in integrated accounts?" and "what does the balance of X control account represent?" are MCQs.

## Non-integrated (cost ledger) system

Separate ledgers for cost and financial accounts, so profits must be **reconciled** (EL-13). Cost books record only product-related items, **excluding** interest, bad debts and non-operating income, and Balance Sheet items (fixed assets, debtors, creditors). Everything excluded is represented by one account: the **Cost Ledger Control Account** (General Ledger Adjustment Account).

**Ledgers:** cost ledger (principal, impersonal accounts, self-balancing through control accounts); stores ledger; work-in-process (job) ledger; finished goods ledger.

## The eleven principal accounts

| Account | Debit | Credit / balance |
|---|---|---|
| **Cost Ledger Control** | Sales; returns to suppliers; loss | All expenditure; profit. Balance = net total of all impersonal account balances |
| **Stores Ledger Control** | Purchases, returns from shop | Issues; abnormal loss to Costing P&L. Balance = stock of stores |
| **Wages Control** | Total wages paid | Direct to WIP; indirect to overhead controls; abnormal idle time to Costing P&L |
| **Production Overhead Control** | Indirect material, labour, expenses (carriage inward) | Overhead absorbed (to WIP); difference to Overhead Adjustment |
| **WIP Control** | Direct material, wages, direct expenses, overhead absorbed | Finished goods transferred. Balance = WIP |
| **Administrative Overhead Control** | Incurred | Recovered (to finished goods if production-related, else cost of sales); difference to Overhead Adjustment |
| **Finished Goods Control** | From WIP, production admin recovered | Cost of sales. Balance = unsold goods |
| **S&D Overhead Control** | Incurred | Recovered (to cost of sales); difference to Overhead Adjustment |
| **Cost of Sales** | Finished goods sold, admin and S&D recovered | To Costing P&L (or Sales) |
| **Costing P&L** | Cost of sales, under-absorbed overhead, abnormal losses | Sales, over-absorbed overhead, abnormal gains; profit or loss to Cost Ledger Control |
| **Overhead Adjustment** | Under-recovery | Over-recovery; net to Costing P&L (sometimes skipped) |

## Key journal entries (ICAI scheme)

| Transaction | Entry |
|---|---|
| Material purchased | Stores Ledger Control Dr; To Cost Ledger Control |
| Purchased for a special job | WIP Control Dr; To Cost Ledger Control |
| Returned to vendor | Cost Ledger Control Dr; To Stores Ledger Control |
| Direct material issued | WIP Control Dr; To Stores Ledger Control |
| Indirect material or repairs material issued | Production Overhead Control Dr; To Stores Ledger Control |
| Returned from shop to stores | Stores Ledger Control Dr; To WIP Control |
| Transfer Job 1 to Job 2 | Job 2 Dr; To Job 1 |
| Wages paid | Wages Control Dr; To Cost Ledger Control |
| Direct wages charged | WIP Control Dr; To Wages Control |
| Indirect wages (production / admin / S&D) | Production / Admin / S&D Overhead Control Dr; To Wages Control |
| Direct expenses for a job | WIP (Job) Dr; To Cost Ledger Control |
| Overheads incurred, carriage inward | Overhead Controls Dr; To Cost Ledger Control |
| Production overhead absorbed | WIP Control Dr; To Production Overhead Control |
| Admin and S&D recovered | Cost of Sales Dr; To Admin / S&D Overhead Control |
| Under-recovery | Costing P&L Dr; To Overhead Control |
| Over-recovery | Overhead Control Dr; To Costing P&L |
| Sales | Cost Ledger Control Dr; To Costing P&L |
| Profit | Costing P&L Dr; To Cost Ledger Control (loss: reverse) |

## ICAI Illustration 1: three months in the cost ledger

Opening: stores 3,01,435; WIP 1,22,365; finished stock 2,51,945; manufacturing overhead (credit, over-absorbed) 10,525; Cost Ledger Control (credit) 6,65,220.

Entries: finished goods 2,10,835 (FG Dr, WIP Cr); overhead incurred 91,510; materials bought 1,23,000; wages 72,195 split direct 50,530 to WIP and indirect 21,665 to overhead; cost of sales 1,85,890; materials issued 1,27,315; sales returns at cost 5,380 (FG Dr, Cost of Sales Cr); returns to suppliers 2,900 (Cost Ledger Control Dr, Stores Cr); overhead charged to production 77,200.

| Account | Closing balance (₹) | What it represents |
|---|---|---|
| Stores Ledger Control | 2,94,220 Dr | Stores in hand |
| WIP Control | 1,66,575 Dr | Work in process |
| Finished Stock Control | 2,82,270 Dr | Finished goods unsold |
| Manufacturing Overhead Control | 25,450 Dr | Under-absorbed overhead (1,13,175 debited − 10,525 opening credit − 77,200 absorbed) |
| Cost of Sales | 1,80,510 Dr | Cost of goods sold (net of returns) |
| Cost Ledger Control | 9,49,025 Cr | Balancing figure for all items outside the cost books |

Trial balance totals ₹9,49,025 on both sides.

## Integrated (integral) system

Cost and financial accounts in **one set of books**: full costing analysis plus statutory P&L and Balance Sheet.

**Advantages:** no reconciliation (one profit figure); less effort; less time (information from books of original entry); economical (centralised accounting).

**Prerequisites:** management's decision on the **extent of integration** (to prime cost, factory cost or full); a suitable **coding system**; an agreed routine for accruals, prepayments and interim adjustments; co-ordination between cost and financial staff.

**Features:** complete analysis of cost and sales; full cash details; full details of assets and liabilities; **no notional account**. The Cost Ledger Control Account is **replaced** by real accounts: bank, receivables, payables, provision for depreciation, fixed assets, share capital. Subsidiary ledgers: stores, stock, job (plus customers' and purchase ledgers).

### ICAI Illustration 3 (integrated entries)

| Transaction | Dr | Cr | ₹ |
|---|---|---|---|
| Materials purchased | Stores Ledger Control | Payables / Bank | 2,00,000 |
| Direct materials issued | WIP Control | Stores Ledger Control | 1,50,000 |
| Wages paid | Wages Control | Bank | 1,20,000 |
| Indirect wages (30%) | Factory Overhead Control | Wages Control | 36,000 |
| Direct wages charged | WIP Control | Wages Control | 84,000 |
| Manufacturing expenses | Factory Overhead Control | Bank | 84,000 |
| Overhead charged to production | WIP Control | Factory Overhead Control | 92,000 |
| S&D costs | S&D Overhead Control | Bank | 20,000 |
| Finished products | Finished Goods Control | WIP Control | 2,00,000 |
| Cost of sales | Cost of Sales | FG Control 2,00,000; S&D Control 20,000 | 2,20,000 |
| Sales | Receivables / Bank | Sales | 2,90,000 |
| Receipts from debtors | Bank | Receivables | 69,000 |
| Payments to creditors | Payables | Bank | 1,10,000 |

Compare with the non-integrated version: every "Cost Ledger Control" becomes Bank, Payables or Receivables.

## Traps

- Debiting WIP with indirect material. Indirect material goes to **Production Overhead Control**.
- Using Cost Ledger Control in integrated accounts. It does not exist there.
- Reading an overhead control's debit balance as over-absorbed. A **debit** balance on an overhead control = **under**-absorbed.
- Sales returns at cost: Finished Goods Dr, Cost of Sales Cr (not Sales).

## What to remember

- Non-integrated: Cost Ledger Control represents everything outside the cost books; reconciliation needed.
- Integrated: one set of books; Cost Ledger Control replaced by bank, debtors, creditors, depreciation provision, fixed assets, share capital; no reconciliation.
- Ill. 1 balances: stores 2,94,220; WIP 1,66,575; FG 2,82,270; overhead 25,450 under-absorbed; cost of sales 1,80,510; CLC 9,49,025.

## Flashcards
Q: Another name for the Cost Ledger Control Account?
A: General Ledger Adjustment Account.

Q: Entry for indirect material issued to production?
A: Production Overhead Control A/c Dr; To Stores Ledger Control A/c.

Q: Entry for production overhead absorbed?
A: WIP Control A/c Dr; To Production Overhead Control A/c.

Q: Entry for material returned to vendor in cost books?
A: Cost Ledger Control A/c Dr; To Stores Ledger Control A/c.

Q: What does a debit balance on the manufacturing overhead control account mean?
A: Under-absorbed overhead.

Q: Four advantages of integrated accounts?
A: No reconciliation, less effort, less time, economical.

Q: In integrated accounts, which accounts replace the Cost Ledger Control Account?
A: Bank, receivables, payables, provision for depreciation, fixed assets, share capital.

Q: Name two prerequisites for integrated accounts.
A: Any two of: decision on the extent of integration; a suitable coding system; agreed routine for accruals and prepayments; co-ordination between cost and financial staff.

## Sources
- ICAI Intermediate Paper 4 Study Material, July 2026 edition, Chapter 7, paras 1-3, Illustrations 1 and 3: https://resource.cdn.icai.org/93310bos-aps5870-ch7.pdf
- Previous: [[CA Inter CMA Unit 2 - EL-11 Activity Based Costing]] · Next: [[CA Inter CMA Unit 2 - EL-13 Reconciling Cost and Financial Profit]]
- [[CA Inter CMA Unit 2 - Ascertainment of Cost MOC (Node Map)]]
