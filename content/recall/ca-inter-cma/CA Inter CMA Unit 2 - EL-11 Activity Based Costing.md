---
title: "CA Inter CMA Unit 2 - EL-11 Activity Based Costing"
type: recall
status: active
created: 2026-11-01
source: "ICAI Intermediate Paper 4 Study Material (July 2026 edition), Chapter 5 Activity Based Costing, paras 1-11, widget example and Illustrations 1-2"
tags: [ca-inter-cma, recall, unit-2, abc, cost-driver, cost-pool, cost-hierarchy, abm, abb]
node: EL-11
section: "2.11"
minutes: 45
deps: [EL-10]
weight: 60
exam_focus: true
state: unstudied
---

# EL-11: Activity Based Costing

Covers: why ABC arose and where it suits; definition (CIMA); the terms (activity, cost object, resource and activity cost drivers, cost pool); ABC vs traditional absorption costing; Cooper's cost hierarchy (unit, batch, product, facility level); the five stages; advantages, limitations, implementation; ABC as a decision tool, Activity Based Management (value-added vs non-value-added) and Activity Based Budgeting; with ICAI's widget example and Illustrations 1-2. **(ICAI SM ch. 5)**

## Where this fits in the exam

A traditional-vs-ABC product cost comparison (Ill. 1 type) is a regular 10-mark question; unused capacity cost (Ill. 2) and the cost hierarchy are frequent MCQs; ABM and ABB give short theory parts.

## Why ABC

Traditional rates (labour or machine hours) assume products that take longer cause more overhead, which is wrong for set-ups, ordering, inspection and handling.

**Factors behind ABC:** rising overheads from automation; tougher competition needing accurate costs; greater product diversity; cheaper information processing.

**Most useful when:** overheads are high; the product range is wide; non-volume activities (material handling, inspection, set-ups) are significant; competition is stiff and prices depend on accurate costs.

## Definition and terms

ABC assigns costs to **activities** based on their use of resources, then to **cost objects** based on their use of activities. CIMA: "resources are assigned to activities, and activities to cost objects based on consumption estimates. The latter utilise cost drivers to attach activity costs to outputs."

- **Activity:** an event that incurs cost.
- **Cost object:** item to be costed (product, customer).
- **Cost driver:** a factor causing a change in an activity's cost. **Resource cost driver:** quantity of resources an activity consumes (resources → activity pools). **Activity cost driver:** frequency and intensity of demand cost objects place on activities (activity pools → cost objects).
- **Cost pool:** costs with the same cause-and-effect relationship (machine set-up).

**Drivers by function (ICAI):** R&D: research projects, personnel hours; design: products in design, parts per product, engineering hours; customer service: service calls, products serviced, hours; marketing: advertisements, sales staff, sales revenue; distribution: units distributed, customers.

**Production pools (ICAI):** ordering and receiving → purchase orders; set-ups → number of set-ups; machining → machine hours; assembling → number of parts; inspecting and testing → number of tests; painting → number of parts; supervising → direct labour hours.

## ABC vs traditional absorption costing

| ABC | Traditional |
|---|---|
| Overheads grouped into activity cost pools | Grouped by cost centres or departments |
| Realistic cost behaviour | Not realistic |
| Activity-wise cost drivers | Time (hours) assumed the only driver |
| Activity-wise rates; no single rate | Departmental or a single blanket rate |
| Costs to products, customers, services, channels | Costs to cost units only |
| Unnecessary activities can be eliminated: aids cost control | Departments cannot be eliminated |

The second stage (to products) is similar; the difference is the first stage: **activities instead of departments**. Departments contain many different activities, and activities cut across departments (procurement starts with a requisition raised in production).

## Cost hierarchy (Cooper, 1990)

| Level | Cost varies with | Examples |
|---|---|---|
| **Unit** | Units produced | Indirect materials and consumables; inspecting every (or every 100th) item |
| **Batch** | Number of batches (fixed per batch) | Material ordering per batch; machine set-ups; inspecting the first item of each batch |
| **Product** | Number of products supported | Product design, parts specifications, updating technical drawings |
| **Facility** | Cannot be traced to products; sustains the plant | Building maintenance, plant security |

## Five stages

1. **Identify activities** (traditional systems use up to about 15 cost centres; ABC might use 200, in practice about 40).
2. **Relate overheads to activities** (support and primary) using **resource cost drivers** → cost pools.
3. **Spread support activities** over primary activities on a base reflecting their use.
4. **Choose activity cost drivers** ("what causes the activity to incur costs?", e.g. batches for scheduling).
5. **Activity cost driver rate = total cost of activity ÷ activity driver**; charge each product (or customer, channel) for the activities it uses.

## ICAI widget example

Overheads ₹11,250: labour-driven (perquisite taxes 1,000, fringe benefits 2,000, group insurance 1,500) = ₹4,500 ÷ 1,000 labour hours = **₹4.50 per hour**; machine-driven (maintenance 500, depreciation 750, electricity 1,250) = ₹2,500 ÷ 250 = **₹10 per machine hour**; purchase-order driven (purchasing labour 4,000, supplies 250) = ₹4,250 ÷ 100 = **₹42.50 per order**.

- Widget A (400 LH, 100 MH, 50 POs): 1,800 + 1,000 + 2,125 = **₹4,925**.
- Widget B (600 LH, 150 MH, 50 POs): 2,700 + 1,500 + 2,125 = **₹6,325**.
- Traditional (₹11.25 per labour hour): A ₹4,500, B ₹6,750. So A was **under-costed and B over-costed by ₹425**.

## ICAI Illustration 1: traditional vs ABC

Products A, B, C: 4,000 / 3,000 / 1,600 units; material 4 / 6 / 3 kg at ₹2; labour 30 / 45 / 60 minutes at ₹10 per hour. Overheads ₹99,450.

**Traditional:** labour hours 2,000 + 2,250 + 1,600 = 5,850; rate = 99,450 ÷ 5,850 = **₹17 per hour**.

| Per unit | A | B | C |
|---|---|---|---|
| Labour | 5.00 | 7.50 | 10.00 |
| Material | 8.00 | 12.00 | 6.00 |
| Overhead (₹17 × hours) | 8.50 | 12.75 | 17.00 |
| **Unit cost** | **21.50** | **32.25** | **33.00** |

**ABC:** material handling ₹29,100 ÷ 38,800 kg = **₹0.75 per kg**; storage ₹31,200 ÷ 30 batches = **₹1,040 per batch** (A 10, B 5, C 15 batches); electricity ₹39,150 ÷ 36,200 machine operations = **₹1.081 per operation** (A 6, B 3, C 2 per unit).

| Per unit | A | B | C |
|---|---|---|---|
| Labour + material | 13.00 | 19.50 | 16.00 |
| Material handling (0.75 × kg) | 3.00 | 4.50 | 2.25 |
| Electricity (1.081 × operations) | 6.49 | 3.24 | 2.16 |
| Storage (1,040 × batches ÷ units) | 2.60 | 1.73 | 9.75 |
| **Unit cost** | **25.09** | **28.97** | **30.16** |
| Total | 1,00,360 | 86,910 | 48,256 |

**Why different:** traditional costing spread all overhead by labour time, but A uses many machine operations and C (small volume, 15 batches) drives storage cost per unit up. ABC traces each overhead to what actually causes it, so its costs are more precise.

## ICAI Illustration 2: unused capacity

Rates set on **capacity**: power ₹2,00,000 ÷ 50,000 kWh = ₹4; inspection ₹3,00,000 ÷ 10,000 = ₹30.

| | M | S | T | Total |
|---|---|---|---|---|
| Power (kWh × 4) | 40,000 | 80,000 | 60,000 | 1,80,000 |
| Inspection (× 30) | 1,05,000 | 75,000 | 90,000 | 2,70,000 |

**Unused capacity cost:** power 2,00,000 − 1,80,000 = **₹20,000** (5,000 kWh × 4); inspection 3,00,000 − 2,70,000 = **₹30,000** (1,000 × 30); total **₹50,000**.

**Factors in choosing the capacity level for the fixed overhead rate:** effect on product costing and capacity management; pricing; performance evaluation; financial statements; regulatory requirements; forecasting difficulties.

## Advantages and limitations

**Advantages:** more accurate costs; logical overhead allocation; better pricing; uses unit cost, not just totals; identifies non-value-added activities (cost reduction); helps multi-product firms; highlights problem areas.

**Limitations:** more expensive; not helpful for small organisations; may not suit firms with few products; choosing drivers can be hard.

**Implementation:** staff training; process specification (interviews); activity definition; activity driver selection; assigning cost.

## Practical applications

- **Decision tool:** performance and profitability; distributors deciding on new products or vendors; facility and resource expansion (new distribution centres); human resource decisions (branch or sales performance); **cost-plus pricing**.
- **Activity Based Management (ABM):** ABC used to manage costs at activity level. Analyses: **cost driver analysis**; **activity analysis**: value-added (indispensable, customers pay for it, e.g. polishing furniture) vs non-value-added (not valued by customers, e.g. moving materials, machine set-ups); **performance analysis**. Uses: cost reduction, business process re-engineering, benchmarking (needs uniform activity definitions), performance measurement (zero defects for purchased components, % yield for output, orders and complaints for customer awareness).
- **Activity Based Budgeting (ABB):** ABC reversed to produce budgets: resources needed for the budgeted activity level. Key elements: type, quantity and cost of work. Benefits: more accurate forecasts and understanding; rapid automated plans at different volumes; less rework than traditional budgeting.

## Traps

- Applying one blanket rate when the question gives activity drivers.
- Batch-level costs per unit: divide by units **in that product's batches** (storage ₹1,040 × 10 ÷ 4,000 = ₹2.60 for A).
- Rates on capacity vs on actual use: if the question sets rates on capacity, compute unused capacity cost separately.
- Calling set-ups value-added. ICAI: machine set-ups and material movement are **non-value-added**.

## What to remember

- Resource drivers: resources → activities; activity drivers: activities → cost objects.
- Hierarchy: unit, batch, product, facility.
- Widget: A ₹4,925 vs ₹4,500; B ₹6,325 vs ₹6,750 (₹425 cross-subsidy).
- Ill. 1: traditional A 21.50, B 32.25, C 33.00; ABC A 25.09, B 28.97, C 30.16.
- Ill. 2: unused capacity ₹20,000 + ₹30,000 = ₹50,000.

## Flashcards
Q: Difference between a resource cost driver and an activity cost driver?
A: A resource cost driver assigns resource costs to activities; an activity cost driver assigns activity costs to cost objects.

Q: Name Cooper's four levels of activity.
A: Unit level, batch level, product level, facility level.

Q: Machine set-up cost belongs to which level?
A: Batch level.

Q: Plant security belongs to which level?
A: Facility level.

Q: Formula for an activity cost driver rate?
A: Total cost of the activity ÷ activity driver volume.

Q: ICAI Ill. 1: storage cost ₹1,040 per batch, product C has 15 batches and 1,600 units. Storage cost per unit?
A: ₹9.75.

Q: ICAI Ill. 2: total cost of unused capacity?
A: ₹50,000 (power ₹20,000, inspection ₹30,000).

Q: Give an example of a value-added and a non-value-added activity.
A: Value-added: polishing furniture. Non-value-added: moving materials or machine set-up.

Q: What is activity based budgeting?
A: The reverse of ABC: estimating the resources and costs needed for the budgeted level of activities.

Q: Four situations where ABC is most useful?
A: High overheads, a wide product range, significant non-volume activities, stiff competition.

## Sources
- ICAI Intermediate Paper 4 Study Material, July 2026 edition, Chapter 5, widget example and Illustrations 1-2: https://resource.cdn.icai.org/93308bos-aps5870-ch5.pdf
- Previous: [[CA Inter CMA Unit 2 - EL-10 Absorption Rates and Under or Over Absorption]] · Next: [[CA Inter CMA Unit 2 - EL-12 Integrated and Non-Integrated Accounting Systems]]
- [[CA Inter CMA Unit 2 - Ascertainment of Cost MOC (Node Map)]]
