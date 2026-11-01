---
title: "CA Inter CMA Unit 2 - Ascertainment of Cost MOC (Node Map)"
type: moc
status: active
created: 2026-11-01
source: "ICAI Intermediate Paper 4 syllabus section II (weight 35-40%); Study Material July 2026 edition, Chapters 2, 3, 4, 5 and 7"
tags: [ca-inter-cma, recall, unit-2, moc]
---

# CA Inter CMA Unit 2: Ascertainment of Cost and Cost Accounting System, node map

ICAI section II, weight **35-40%** of Paper 4, the heaviest unit. Paper pattern: 3 hours, 100 marks; Part I 30 marks of MCQs, Part II 70 marks descriptive. Every worked example is an ICAI illustration, recomputed.

## Nodes

| Node | Topic | Deps | Minutes | Exam focus |
|---|---|---|---|---|
| EL-1 | Material Procurement and Receipts | OV-5 | 40 | yes |
| EL-2 | Stores Records and Pricing of Issues | EL-1 | 50 | yes |
| EL-3 | Stock Levels and EOQ | EL-1 | 50 | yes |
| EL-4 | Inventory Control Techniques and Material Losses | EL-3 | 45 | yes |
| EL-5 | Employee Cost, Payroll, Idle Time and Overtime | OV-5 | 50 | yes |
| EL-6 | Incentive Schemes, Efficiency and Employee Turnover | EL-5 | 50 | yes |
| EL-7 | Direct Expenses | OV-5 | 20 | yes |
| EL-8 | Overheads: Classification and Primary Distribution | OV-3 | 40 | yes |
| EL-9 | Secondary Distribution of Service Department Costs | EL-8 | 50 | yes |
| EL-10 | Absorption Rates, Under or Over Absorption | EL-9 | 60 | yes |
| EL-11 | Activity Based Costing | EL-10 | 45 | yes |
| EL-12 | Integrated and Non-Integrated Accounting Systems | EL-10 | 45 | yes |
| EL-13 | Reconciling Cost and Financial Profit | EL-12 | 45 | yes |
| EL-14 | Unit 2 Exam Answers | EL-1 to EL-13 | 45 | yes |

Total reading time: about 635 minutes.

## Dependency graph

```mermaid
graph TD
    OV5["OV-5 Cost sheet"] --> EL1["EL-1 Procurement and receipts"]
    EL1 --> EL2["EL-2 Stores ledger, FIFO/LIFO/WA"]
    EL1 --> EL3["EL-3 Stock levels, EOQ"]
    EL3 --> EL4["EL-4 ABC/FSN/VED, losses"]
    OV5 --> EL5["EL-5 Employee cost, idle time, overtime"]
    EL5 --> EL6["EL-6 Halsey, Rowan, turnover"]
    OV5 --> EL7["EL-7 Direct expenses"]
    OV3["OV-3 Cost behaviour"] --> EL8["EL-8 Overheads, primary distribution"]
    EL8 --> EL9["EL-9 Secondary distribution"]
    EL9 --> EL10["EL-10 Absorption, under/over"]
    EL10 --> EL11["EL-11 ABC"]
    EL10 --> EL12["EL-12 Cost ledgers"]
    EL12 --> EL13["EL-13 Reconciliation"]
    EL2 --> EL14["EL-14 Exam answers"]
    EL4 --> EL14
    EL6 --> EL14
    EL11 --> EL14
    EL13 --> EL14
```

## Headline numbers (ICAI illustrations)

- Material rate after shortage: A ₹12.04, B ₹15.43 per kg. FIFO vs LIFO issues ₹7,800 vs ₹8,300.
- EOQ 2,500 kg (4 orders); ROL 300, max 450, min 150, danger 60; safety stock 20 units at ₹2,140.
- Halsey ₹420 vs Rowan ₹450; equal at 50% time saved. Profit foregone from turnover ₹5,57,930.
- Machine hour rate ₹382.86; supplementary rate ₹5 per unit; reconciliation ₹3,00,000 cost vs ₹1,10,000 financial.

## Links
- [[CA Inter CMA MOC]]
