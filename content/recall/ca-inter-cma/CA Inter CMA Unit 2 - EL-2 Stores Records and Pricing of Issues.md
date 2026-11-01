---
title: "CA Inter CMA Unit 2 - EL-2 Stores Records and Pricing of Issues"
type: recall
status: active
created: 2026-11-01
source: "ICAI Intermediate Paper 4 Study Material (July 2026 edition), Chapter 2, paras 5, 7-9 and 11, Illustrations 12-14"
tags: [ca-inter-cma, recall, unit-2, stores-ledger, bin-card, fifo, lifo, weighted-average]
node: EL-2
section: "2.2"
minutes: 50
deps: [EL-1]
weight: 60
exam_focus: true
state: unstudied
---

# EL-2: Stores Records and Pricing of Material Issues

Covers: the store-keeper's duties; bin cards, stock control cards and the stores ledger; the issue procedure (requisition, transfer note, shop credit note); every method of pricing issues (specific, FIFO, LIFO, base stock, simple and weighted average, replacement, realisable, standard, inflated, re-use); valuation of returns and shortages; and the three ICAI illustrations. **(ICAI SM ch. 2, paras 5, 7-9, 11)**

## Where this fits in the exam

A stores ledger (FIFO or weighted average, with returns, shortages and normal or abnormal loss) is a frequent 5-10 mark question. The ICAI Illustration 14 type, with a missing-stock twist, is the one to master. Method comparisons are short theory parts.

## Store-keeper's duties

General control over stores; safe custody; maintaining records; initiating purchase requisitions at re-order level; maintaining adequate stock (and stopping purchases near the maximum level); issuing only against approved requisitions (checked against the bill of materials); stock verification and reconciliation.

## Three stores records

| Record | Kept by | Contents |
|---|---|---|
| Bin card | Stores, at the bin | Quantity only: receipt, issue, return |
| Stock control card | Stores, in one place | Quantity only: receipt, issue, return, in hand, on order |
| Stores ledger | Cost accounts department | Quantity **and** value; subsidiary to the cost ledger; posted from GRNs and requisitions |

**Bin card vs stores ledger:** stores vs cost department; quantity vs quantity and value; posted at the time vs after the transaction; each transaction vs summarised; inter-job transfers do not appear vs are recorded.

## Issue procedure

- **Material requisition note:** authority to issue. Issue on **FIFO in physical terms** so the earliest lot does not deteriorate.
- **Material transfer note** (job to job, duplicate: cost department and transferring department; no copy to stores as stores records do not change). ICAI calls direct transfers irregular, acceptable only for bulky or brittle surplus.
- **Shop credit note / stores debit note** (surplus returned to stores, triplicate: stores, cost department, returning department). Without it, the job is overcharged.

## Factors in choosing a pricing method

Frequency of purchases and price fluctuation; frequency and size of issues; the cost accounting system; nature of business and process; management policy on closing stock.

## Methods of pricing issues

| Group | Method | Key point |
|---|---|---|
| Cost price | **Specific price** | Lot bought for a job is issued to it at its price; exact but hard with many lots |
| | **FIFO** | Earliest lot priced first; closing stock near current price; suits **falling** prices; in rising prices charges production too little and books profit looks high |
| | **LIFO** | Latest lot priced first; issues near current price, matches current revenue; suits **rising** prices. **Not permitted under AS 2 or Ind AS 2**, nor accepted by income tax; taught for academic purposes |
| | Base stock | Fixed minimum stock held at the first lot's price; the rest by FIFO or LIFO; not an independent method |
| Average | **Simple average** | Average of lot **prices**, ignoring quantities (exhausted lots dropped); suits uniform lots and stable prices |
| | **Weighted average** | Σ(price × quantity) ÷ Σ quantity; recomputed at each receipt; smooths fluctuations |
| Market | Replacement price | Price to buy an identical item now; true current cost in rising prices |
| | Realisable price | Price the material could be sold for |
| Notional | Standard price | Pre-determined rate; simplifies work, judges purchase efficiency |
| | Inflated price | Raised to cover natural loss (evaporation) |
| | Re-use price | For rejected or re-used material; no fixed rule |

**ICAI Examples 1-2 (same five April lots):** 200 at ₹10, 150 at ₹12, 210 at ₹12, 50 at ₹15, 140 at ₹11.
- Simple average = (10 + 12 + 12 + 15 + 11) ÷ 5 = **₹12**.
- Weighted average = 8,610 ÷ 750 = **₹11.48**.

## ICAI Illustration 13: FIFO vs LIFO

Opening 100 at ₹5. Purchases: 5 Apr 300 at ₹6; 8 Apr 500 at ₹7; 12 Apr 600 at ₹8. Issues: 6 Apr 250; 10 Apr 400; 14 Apr 500.

| Issue | FIFO | LIFO |
|---|---|---|
| 6 Apr, 250 | 100 × 5 + 150 × 6 = 1,400 | 250 × 6 = 1,500 |
| 10 Apr, 400 | 150 × 6 + 250 × 7 = 2,650 | 400 × 7 = 2,800 |
| 14 Apr, 500 | 250 × 7 + 250 × 8 = 3,750 | 500 × 8 = 4,000 |
| **Consumed** | **7,800** | **8,300** |
| **Closing 350 units** | 350 × 8 = **2,800** | 100 × 5 + 50 × 6 + 100 × 7 + 100 × 8 = **2,300** |

Why ₹500 apart: prices were **rising**, so LIFO charged production the later, dearer lots (₹100 + ₹150 + ₹250 more) and left the older, cheaper lots in closing stock.

## ICAI Illustration 12: when the method does not matter

April-September purchases total 2,500 units, issues 2,300. Purchases equal issues up to August (1,900), so stock is nil at 31 August; September has one purchase (600 at ₹20) and one issue (400). Closing 200 units = ₹20 each under **any** method. The Chief Accountant is right for the period-end figure (one purchase, one issue, no opening stock), but not for month-end values.

## ICAI Illustration 14: weighted average stores ledger with returns and losses

Imbrios India Ltd., micro-controllers, September 2025.

| Date | Event | Qty | Rate (₹) | Amount (₹) | Balance qty | Balance rate | Balance (₹) |
|---|---|---|---|---|---|---|---|
| 1 | Opening | | | | 6,000 | 285.00 | 17,10,000 |
| 8 | Issue | 4,875 | 285.00 | 13,89,375 | 1,125 | 285.00 | 3,20,625 |
| 9 | Receipt | 17,500 | 276.00 | 48,30,000 | 18,625 | 276.54 | 51,50,625 |
| 10 | Issue | 12,000 | 276.54 | 33,18,480 | 6,625 | 276.54 | 18,32,145 |
| 12 | Return to stores | 2,375 | 276.54 | 6,56,783 | 9,000 | 276.54 | 24,88,928 |
| 15 | Receipt | 9,000 | 288.00 | 25,92,000 | 18,000 | 282.27 | 50,80,928 |
| 17 | Return to supplier | 700 | 288.00 | 2,01,600 | 17,300 | 282.04 | 48,79,328 |
| 20 | Issue | 9,500 | 282.04 | 26,79,380 | 7,800 | 282.04 | 21,99,948 |
| 30 | Shortage (misappropriated) | 900 | 282.04 | 2,53,836 | 6,900 | 282.04 | 19,46,112 |
| 30 | Rusting loss | 300 | | | 6,600 | 294.87 | 19,46,112 |

- **Return to stores** comes back at the **rate it was issued** (₹276.54) and is entered as a receipt.
- **Return to supplier** goes out at the **purchase price of that lot** (₹288), shown in the issue column; the average is then recomputed.
- **900 units misappropriated = abnormal loss:** valued at the current rate and transferred to Costing P&L Account.
- **300 units rusting = normal loss:** no value removed; the good units absorb it, so the rate rises to 19,46,112 ÷ 6,600 = ₹294.87.

## Returns and shortages (para 9)

- **Returned to vendor:** in theory at stores ledger price; in practice at invoice price, with the difference charged to overhead or an inventory adjustment account.
- **Returned to stores:** at the original issue price, either held in suspense for the next requisition or merged into stock as if a fresh purchase.
- **Shortage on verification:** in the issue column at the rate under the method in use; normal shortage raises the rate of remaining stock, abnormal goes to Costing P&L.

## Consumption entries

Consumption = opening stock + purchases − closing stock (stock at the lower of cost and net realisable value). The **material abstract** (issue analysis sheet) summarises requisitions, returns and transfers by product; its total must equal the value of stores issued.

## Traps

- Returning materials to stores at the latest average rate. Use the **rate of the original issue**.
- Removing the value of a normal loss. Only the quantity goes; the rate rises.
- Saying LIFO is allowed under AS 2. It is not.
- Simple average weighted by quantity. Simple average ignores quantities.

## What to remember

- FIFO suits falling prices; LIFO suits rising prices (but is not permitted under AS 2 or Ind AS 2).
- Ill. 13: consumed FIFO ₹7,800 vs LIFO ₹8,300; closing ₹2,800 vs ₹2,300.
- Ill. 14: abnormal 900 units ₹2,53,836 to Costing P&L; normal 300 units lifts the rate to ₹294.87.
- Simple average ₹12, weighted ₹11.48 on the same lots.

## Flashcards
Q: Which records keep quantity only, and which keep quantity and value?
A: Bin cards and stock control cards: quantity only. Stores ledger: quantity and value.

Q: Who maintains the stores ledger?
A: The cost accounts department.

Q: In which price trend does FIFO give better results?
A: Falling prices.

Q: Is LIFO permitted under AS 2 or Ind AS 2?
A: No.

Q: At what rate are materials returned to stores entered?
A: At the rate at which they were originally issued.

Q: Treatment of 900 units found misappropriated at stock-taking?
A: Abnormal loss, valued at the current rate and transferred to Costing P&L Account.

Q: Treatment of normal loss (rusting) in a weighted average ledger?
A: The quantity is reduced but no value is removed, so the rate of remaining units rises.

Q: Document for returning surplus material from a job to stores?
A: Shop credit note (or stores debit note), in triplicate.

Q: ICAI Ill. 13: total issues under FIFO and LIFO?
A: FIFO ₹7,800; LIFO ₹8,300.

Q: Simple average price of lots at ₹10, 12, 12, 15, 11?
A: ₹12.

## Sources
- ICAI Intermediate Paper 4 Study Material, July 2026 edition, Chapter 2, paras 5, 7-9, 11, Illustrations 12-14 and Examples 1-2: https://resource.cdn.icai.org/93305bos-aps5870-ch2.pdf
- Previous: [[CA Inter CMA Unit 2 - EL-1 Material Procurement and Receipts]] · Next: [[CA Inter CMA Unit 2 - EL-3 Stock Levels and EOQ]]
- [[CA Inter CMA Unit 2 - Ascertainment of Cost MOC (Node Map)]]
