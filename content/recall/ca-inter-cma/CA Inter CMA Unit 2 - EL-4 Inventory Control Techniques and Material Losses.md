---
title: "CA Inter CMA Unit 2 - EL-4 Inventory Control Techniques and Material Losses"
type: recall
status: active
created: 2026-11-01
source: "ICAI Intermediate Paper 4 Study Material (July 2026 edition), Chapter 2, paras 6.3-6.6 and 10, Illustrations 8-11"
tags: [ca-inter-cma, recall, unit-2, abc-analysis, fsn, ved, hml, jit, inventory-turnover, waste, scrap, spoilage, defectives]
node: EL-4
section: "2.4"
minutes: 45
deps: [EL-3]
weight: 50
exam_focus: true
state: unstudied
---

# EL-4: Inventory Control Techniques and Material Losses

Covers: JIT; selective control (ABC, FSN, VED, HML) with ICAI Illustrations 8-9; ratio-based control (input-output ratio, inventory turnover, days of holding) with Illustrations 10-11; physical control (two-bin system, budgets, perpetual inventory, continuous stock verification); and the treatment of normal and abnormal waste, scrap, spoilage, defectives and obsolescence. **(ICAI SM ch. 2, paras 6.3-6.6, 10)**

## Where this fits in the exam

ABC classification and inventory turnover are short computations; the loss treatments (normal vs abnormal for each kind of loss) and the distinctions (waste vs scrap, scrap vs defectives, spoilage vs defectives) are steady MCQ and 4-mark theory material.

## Just in Time (JIT)

Aims at **zero inventory**: buy material only when production actually needs it. Two principles: produce only when required; deliver to customers only when they want it. A **demand-pull** ("pull-through") system: customer order → production starts → requirement sent to purchase → order to supplier → supplier delivers.

## Selective control

| Technique | Basis | Classes |
|---|---|---|
| **ABC** | Value of consumption (investment) | A ≈ 10% of items, 70% of value (tight control: budgets, max/min/ROL); B ≈ 20% / 20% (periodic review); C ≈ 70% / 10% (order every six months or yearly; save ordering and handling cost) |
| **FSN** (or FNS) | Frequency of use / turnover | Fast (near issue point, frequent review); slow (reviewed for obsolescence); non-moving (for disposal; provide for loss) |
| **VED** | Criticality to production (usually spares) | Vital (stoppage if missing; strict ROL control); essential (efficiency loss; second priority); desirable (optional) |
| **HML** | Unit price of the item | High, medium, low cost per unit (unlike ABC, which uses total value) |

**Reasons for slow and non-moving stock:** production not telling stores about changed needs; technology change making material obsolete; no periodic review.

**Advantages of ABC:** continuity of production with minimum investment; lower ordering and holding cost (especially with EOQ); management attention on few items; routine work delegated to subordinates.

### ICAI Illustration 8: ABC plan

Twelve items, total value ₹3,55,770. Value = units × unit cost; rank by value; assumed bands: A ₹50,000 and above, B ₹15,000-50,000, C below ₹15,000.

| Class | Items (rank order) | % of units | Value (₹) | % of value |
|---|---|---|---|---|
| A | 11 (81,650), 2 (72,000), 5 (57,000) | 33.56 | 2,10,650 | 59.21 |
| B | 1 (35,000), 12 (25,420), 6 (20,000), 3 (15,000) | 24.02 | 95,420 | 26.82 |
| C | 4, 7, 10, 8, 9 | 42.42 | 49,700 | 13.97 |

Method: compute value, rank, then classify by value bands. Note item 7 (60,000 units, 27% of units) is a C item: units do not decide the class, value does.

### ICAI Illustration 9: classify with reasons

4,000 varieties. 15 varieties (0.375% of items) hold 50% of inventory value and 85% of usage: **A**. 110 varieties (2.75%), 30% of value, 10% of usage: **B**. 3,875 varieties (96.875%), 20% of value, 5% of usage: **C**. Give the three reasons (share of items, share of holding value, share of usage) for each class.

## Control by ratios

- **Input-output ratio** = quantity of material input ÷ standard material content of actual output. Shows whether usage was favourable or adverse.
- **Inventory turnover ratio** = cost of materials consumed ÷ average stock, where average stock = ½ (opening + closing).
- **Days of holding** = 365 (or 12 months) ÷ turnover ratio. High turnover = fast moving; low = over-investment.

### ICAI Illustration 10

Opening ₹90,000; purchases ₹2,70,000; closing ₹1,10,000. Consumed = 90,000 + 2,70,000 − 1,10,000 = ₹2,50,000. Average stock = ₹1,00,000. Turnover = **2.5 times**; days = 365 ÷ 2.5 = **146 days**.

### ICAI Illustration 11

| | A | B |
|---|---|---|
| Consumed | 10,000 + 52,000 − 6,000 = 56,000 | 9,000 + 27,000 − 11,000 = 25,000 |
| Average stock | 8,000 | 10,000 |
| Turnover | **7 times** | **2.5 times** |
| Days | **52** | **146** |

Comment: A moves faster than B.

## Physical control

1. **Two-bin system:** the smaller part of the bin holds the minimum (or re-order) quantity; issues come from the larger part; when the smaller part has to be touched, reorder.
2. **Budgets** for inventory requirements, from production plans.
3. **Perpetual inventory:** bin cards plus stores ledger, reconciled, with daily rotational physical checks, prompt explanation and correction of discrepancies. Advantages: stock counted any time without a full stock-take; quick interim P&L; discrepancies located fast; reveals surplus, dormant, obsolete and slow-moving items; helps keep stock within levels.
4. **Continuous stock verification:** surprise checks by staff independent of stores and production (often internal audit). Advantages over annual stock-taking: no shutdown; discrepancies found earlier; sobering effect on staff (surprise); closer watch on movement; quick final and interim accounts.

## Material losses: treatment

| Loss | Meaning | Normal | Abnormal |
|---|---|---|---|
| **Waste** | Material lost in storage or production and discarded; may have no value | Absorbed by good units | Costing P&L |
| **Scrap** | Discarded production residue, little or no value; may be reused | Cost borne by good units; realisable value deducted from cost | Scrap account charged at full cost, job or process credited; profit or loss on realisation to Costing P&L |
| **Spoilage** | Badly damaged, cannot be rectified economically | Charged to the production order or to production overhead; realisable value credited there | Costing P&L. If caused by rigid specification: cost absorbed by good production, disposal cost to production overhead |
| **Defectives** | Below quality standard but can be reworked (reworks) or not (rejects) | Cost less realisable value charged to material cost of good production | Treated as a loss after crediting realisable value; to Costing P&L |
| **Obsolescence** | Loss in value from supersession (technology) | Not applicable | Always abnormal; not part of manufacturing cost; dispose of at the best price |

**Distinctions:**
- Waste vs scrap: waste relates to input, may be invisible, usually no value; scrap relates to output, is physical, has small value.
- Scrap vs defectives: scrap relates to output, cannot be eliminated, usually not rectified, insignificant value; defectives relate to input and output, can be eliminated by control, can be rectified, sold as seconds.
- Spoilage vs defectives: spoilage **cannot** be repaired; defectives **can** be rectified.

**Reclaiming loss from defectives:** collect at one place, dismantle, return good parts to stock, rework repairable parts, melt or sell the rest, using printed forms.

## Traps

- Classifying ABC by number of units. Classify by **value**.
- Confusing HML (unit price) with ABC (total consumption value).
- Charging normal scrap to Costing P&L. Normal scrap is borne by good units; only its realisable value is deducted.
- Treating obsolescence as normal. ICAI: always abnormal, never part of cost of manufacture.

## What to remember

- A ≈ 10% of items, 70% of value; C ≈ 70% of items, 10% of value.
- Turnover = consumption ÷ average stock; days = 365 ÷ turnover. Ill. 10: 2.5 times, 146 days. Ill. 11: A 7 times (52 days), B 2.5 times (146 days).
- Normal loss → good units; abnormal loss → Costing P&L.
- Spoilage cannot be repaired; defectives can.

## Flashcards
Q: On what basis does ABC analysis classify items?
A: Value of consumption (investment), not number of units.

Q: Typical share of items and value in class A?
A: About 10% of items and 70% of value.

Q: Basis of VED analysis?
A: Criticality of the item to production (usually spare parts).

Q: Difference between HML and ABC?
A: HML uses the unit price of an item; ABC uses its total consumption value.

Q: Formula for inventory turnover ratio?
A: Cost of materials consumed ÷ average stock (½ of opening + closing).

Q: ICAI Ill. 10: consumption ₹2,50,000, average stock ₹1,00,000. Turnover and days?
A: 2.5 times; 146 days.

Q: What is the two-bin system?
A: Each bin is split; the smaller part holds the minimum or re-order quantity; when it starts to be used, a fresh order is placed.

Q: Treatment of normal scrap?
A: Its cost is borne by good units and its realisable value is deducted from cost.

Q: Difference between spoilage and defectives?
A: Spoilage cannot be economically repaired; defectives can be rectified.

Q: Is obsolescence part of cost of manufacture?
A: No. It is an abnormal loss.

Q: What is JIT also called?
A: A demand-pull (pull-through) system.

## Sources
- ICAI Intermediate Paper 4 Study Material, July 2026 edition, Chapter 2, paras 6.3-6.6, 10, Illustrations 8-11: https://resource.cdn.icai.org/93305bos-aps5870-ch2.pdf
- Previous: [[CA Inter CMA Unit 2 - EL-3 Stock Levels and EOQ]] · Next: [[CA Inter CMA Unit 2 - EL-5 Employee Cost Payroll and Idle Time]]
- [[CA Inter CMA Unit 2 - Ascertainment of Cost MOC (Node Map)]]
