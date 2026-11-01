---
title: "CA Inter CMA Unit 2 - EL-9 Secondary Distribution of Service Department Costs"
type: recall
status: active
created: 2026-11-01
source: "ICAI Intermediate Paper 4 Study Material (July 2026 edition), Chapter 4, para 4.4 and Illustrations 1-5"
tags: [ca-inter-cma, recall, unit-2, secondary-distribution, step-method, reciprocal, simultaneous-equation, repeated-distribution]
node: EL-9
section: "2.9"
minutes: 50
deps: [EL-8]
weight: 70
exam_focus: true
state: unstudied
---

# EL-9: Secondary Distribution of Service Department Costs

Covers: bases for re-apportioning service departments; the direct re-distribution method; the step (non-reciprocal) method; the three reciprocal methods (simultaneous equations, trial and error, repeated distribution); and the full ICAI Illustrations 1-5, ending with machine hour rates. **(ICAI SM ch. 4, para 4.4)**

## Where this fits in the exam

A primary-plus-secondary distribution leading to a machine hour rate is one of the most common 10-14 mark CMA questions. The method is named in the question; know each layout exactly.

## Re-apportionment bases (ICAI)

| Service department | Basis |
|---|---|
| Maintenance and repair shop | Direct labour hours, machine hours |
| Planning and progress, tool room | Direct labour wages, asset value × hours worked |
| Canteen and welfare | Number of direct workers |
| Hospital, dispensary, personnel | Number of employees |
| Time-keeping | Cards punched, number of employees |
| Computer section | Computer hours, specific allocation |
| Power house (lighting) | Floor area, cubic content, electric points, wattage |
| Power house (power) | Horse power, kWh, HP × machine hours, kWh × machine hours |
| Stores | Number of requisitions, weight or value of materials issued |
| Transport | Crane hours, truck hours, mileage, tonnage, ton-hours, packages |
| Fire protection | Capital values |
| Inspection | Inspection hours |

Repairs included in repair-shop cost and building maintenance in maintenance-shop cost go by **capital values**. Choose a base for economy, practicability, equity and reliability.

## Method 1: Direct re-distribution (ICAI Illustration 1)

Service costs go to **production departments only**; services between service departments are ignored.

XL Ltd.: production A ₹30,00,000, B ₹26,00,000, C ₹24,00,000. Service: stores ₹4,00,000, time-keeping and accounts ₹3,00,000, power ₹1,60,000, canteen ₹1,00,000. Data (A, B, C): HP 300/300/200; workers 20/15/15; stores requisitions ₹2,50,000/1,50,000/1,00,000.

| | Basis (ratio) | A | B | C |
|---|---|---|---|---|
| Primary | | 30,00,000 | 26,00,000 | 24,00,000 |
| Stores 4,00,000 | Requisition value (5:3:2) | 2,00,000 | 1,20,000 | 80,000 |
| Time-keeping 3,00,000 | Workers (4:3:3) | 1,20,000 | 90,000 | 90,000 |
| Power 1,60,000 | HP (3:3:2) | 60,000 | 60,000 | 40,000 |
| Canteen 1,00,000 | Workers (4:3:3) | 40,000 | 30,000 | 30,000 |
| **Total (₹89,60,000)** | | **34,20,000** | **29,00,000** | **26,40,000** |

## Method 2: Step (non-reciprocal) method (ICAI Illustration 2)

Recognises service-to-service work, but only **one way**. Start with the service department serving the **largest number of other departments** (some authors: the one with the largest cost); once a department is closed, nothing comes back to it. The last service department goes to production departments only.

X ₹2,00,000 (to Y 25%, A 40%, B 35%); Y ₹1,50,000 (A 40%, B 60%); A ₹3,00,000; B ₹3,20,000.

| | X | Y | A | B |
|---|---|---|---|---|
| Given | 2,00,000 | 1,50,000 | 3,00,000 | 3,20,000 |
| X apportioned (5:8:7) | (2,00,000) | 50,000 | 80,000 | 70,000 |
| | | 2,00,000 | 3,80,000 | 3,90,000 |
| Y apportioned (2:3) | | (2,00,000) | 80,000 | 1,20,000 |
| **Total** | nil | nil | **4,60,000** | **5,10,000** |

## Method 3a: Simultaneous equations (ICAI Illustration 3)

Boiler house ₹3,00,000 (A 60%, B 35%, pump room 5%); pump room ₹60,000 (A 10%, B 40%, boiler 50%).

1. B = 3,00,000 + 0.50P; P = 60,000 + 0.05B.
2. P = 60,000 + 0.05(3,00,000 + 0.5P) = 75,000 + 0.025P → 0.975P = 75,000 → **P = ₹76,923**.
3. B = 3,00,000 + 0.5 × 76,923 = **₹3,38,462**.

| | A | B |
|---|---|---|
| Boiler (60%, 35% of 3,38,462) | 2,03,077 | 1,18,462 |
| Pump (10%, 40% of 76,923) | 7,692 | 30,769 |
| **Total** | **2,10,769** | **1,49,231** |

Check: 2,10,769 + 1,49,231 = ₹3,60,000 = total service cost ✓.

## The primary distribution behind Illustrations 4-5 (Sanz Ltd.)

Overheads: rent ₹4,00,000 (area 2:1:2:1:2), power ₹2,50,000 (**HP × machine hours** = 50,000 : 80,000 : 80,000 : 15,000 : 25,000, i.e. 10:16:16:3:5), depreciation ₹1,00,000 (capital value 2:4:2:1:1), other ₹9,00,000 (machine hours 1:2:4:1:1); plus the service departments' own direct material and wages (X ₹2,00,000 + ₹1,00,000; Y ₹1,00,000 + ₹2,00,000).

| | A | B | C | X | Y |
|---|---|---|---|---|---|
| Primary total | 2,70,000 | 3,70,000 | 6,00,000 | 4,75,000 | 5,35,000 |

Technical assessment: X → A 45%, B 15%, C 30%, Y 10%. Y → A 60%, B 35%, X 5%.

Note: a service department's own materials and wages are overheads (it makes nothing for sale), so they enter its primary total.

## Method 3b: Trial and error (ICAI Illustration 4)

Pass costs back and forth **between service departments only** until negligible; add up each service department's total; then distribute those totals to production departments.

| | X | Y |
|---|---|---|
| Primary | 4,75,000 | 5,35,000 |
| X to Y (10% of 4,75,000) | | 47,500 |
| Y to X (5% of 5,82,500) | 29,125 | |
| X to Y (10% of 29,125) | | 2,913 |
| Y to X (5% of 2,913) | 146 | |
| **Total** | **5,04,271** | **5,85,413** |

Production departments then take X's 90% (45:15:30) and Y's 95% (60:35): ICAI's rounded result A ₹8,48,200, B ₹6,50,500, C ₹7,51,300. Trial and error gives the **same** answer as simultaneous equations.

## Method 3c: Repeated distribution (ICAI Illustration 5)

Distribute each service department to **all** departments (service and production) on the agreed percentages, and keep repeating until the service balances vanish.

| | A | B | C | X | Y |
|---|---|---|---|---|---|
| Primary | 2,70,000 | 3,70,000 | 6,00,000 | 4,75,000 | 5,35,000 |
| X (45:15:30:–:10) | 2,13,750 | 71,250 | 1,42,500 | (4,75,000) | 47,500 |
| Y (60:35:–:5:–) | 3,49,500 | 2,03,875 | | 29,125 | (5,82,500) |
| X | 13,106 | 4,369 | 8,738 | (29,125) | 2,912 |
| Y | 1,747 | 1,019 | | 146 | (2,912) |
| X | 65 | 22 | 44 | (146) | 15 |
| Y | 9 | 6 | | | (15) |
| **Total** | **8,48,177** | **6,50,541** | **7,51,282** | | |

**Machine hour rates:** A 8,48,177 ÷ 1,000 = **₹848.18**; B 6,50,541 ÷ 2,000 = **₹325.27**; C 7,51,282 ÷ 4,000 = **₹187.82**.

(Solving exactly by simultaneous equations gives X ₹5,04,271 and Y ₹5,85,427, and the same production totals, confirming all three reciprocal methods agree.)

## Choosing the method

| Method | Recognises service-to-service work? |
|---|---|
| Direct | No |
| Step | One way only |
| Simultaneous equations, trial and error, repeated distribution | Fully, both ways (reciprocal) |

## Traps

- Forgetting the service department's own direct materials and wages in its primary total.
- In the step method, sending cost back to a department already closed.
- In trial and error, sending cost to production departments during the back-and-forth. Only between service departments, then distribute the totals.
- Power apportioned by HP alone when machine hours differ. ICAI used **HP × machine hours**.

## What to remember

- Direct: ignore inter-service. Step: start with the department serving most others. Reciprocal: simultaneous, trial and error, repeated: all give the same answer.
- Ill. 1: A 34.2L, B 29L, C 26.4L. Ill. 2: A 4.6L, B 5.1L. Ill. 3: P ₹76,923, B ₹3,38,462; A ₹2,10,769, B ₹1,49,231.
- Ill. 5 machine hour rates: A ₹848.18, B ₹325.27, C ₹187.82.

## Flashcards
Q: Which secondary distribution method ignores services between service departments?
A: The direct re-distribution method.

Q: In the step method, which service department is apportioned first?
A: The one serving the largest number of other departments (some authors: the one with the largest cost).

Q: Name the three reciprocal service methods.
A: Simultaneous equation, trial and error, repeated distribution.

Q: ICAI Ill. 3: B = 3,00,000 + 0.5P; P = 60,000 + 0.05B. Solve.
A: P = ₹76,923; B = ₹3,38,462.

Q: Do trial and error and simultaneous equations give the same result?
A: Yes.

Q: Basis for re-apportioning stores department cost?
A: Number of requisitions, or weight or value of materials issued.

Q: Basis for canteen cost?
A: Number of direct workers (or employees).

Q: ICAI Ill. 5: machine hour rate of department A?
A: ₹848.18 (₹8,48,177 ÷ 1,000 hours).

## Sources
- ICAI Intermediate Paper 4 Study Material, July 2026 edition, Chapter 4, para 4.4, Illustrations 1-5: https://resource.cdn.icai.org/93307bos-aps5870-ch4.pdf
- Previous: [[CA Inter CMA Unit 2 - EL-8 Overheads Classification and Primary Distribution]] · Next: [[CA Inter CMA Unit 2 - EL-10 Absorption Rates and Under or Over Absorption]]
- [[CA Inter CMA Unit 2 - Ascertainment of Cost MOC (Node Map)]]
