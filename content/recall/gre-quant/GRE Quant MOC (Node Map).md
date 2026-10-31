---
title: "GRE Quant MOC (Node Map)"
type: moc
status: active
created: 2026-10-31
source: "question bank: pekalkan/gre-quant-lab @ 9bdc26e, see content/sources/gre/gre-quant-lab/SOURCE.txt"
tags: [gre, quant, moc]
---

# GRE Quantitative Reasoning: node map

The GRE Quant section has two timed sections (12 questions in 21 minutes, then 15 in 26), with an on-screen calculator. Questions come in four formats: Quantitative Comparison (QC), multiple choice with one answer, multiple choice with every right answer ("select all"), and numeric entry (a number, or a fraction in two boxes). Content is arithmetic, algebra, geometry and data analysis.

The practice bank holds 740 questions from GRE Quant Lab (12 two-stage practice tests and 3 topic drills). Each question sits in one content node, chosen from its subtopic. Q-10 is a method node: it holds every QC question again, so its 245 questions also count in Q-1 to Q-9. Topic notes for each node are still to come.

## Nodes

| Node | Topic | Questions | QC | Single | Select all | Numeric | Fraction |
|---|---|---|---|---|---|---|---|
| Q-1 | Arithmetic and number properties | 144 | 93 | 26 | 23 | 2 | 0 |
| Q-2 | Percents and ratios | 49 | 12 | 35 | 0 | 2 | 0 |
| Q-3 | Algebra | 160 | 66 | 55 | 18 | 21 | 0 |
| Q-4 | Word problems and rates (speed, work, flow, mixtures) | 14 | 1 | 11 | 0 | 2 | 0 |
| Q-5 | Lines, angles, triangles | 40 | 21 | 10 | 7 | 2 | 0 |
| Q-6 | Circles, polygons, coordinates, solids | 106 | 33 | 52 | 7 | 13 | 1 |
| Q-7 | Statistics and distributions | 40 | 13 | 17 | 5 | 5 | 0 |
| Q-8 | Counting and probability | 47 | 6 | 32 | 0 | 5 | 4 |
| Q-9 | Data interpretation (tables, graphs) | 140 | 0 | 65 | 22 | 50 | 3 |
| Q-10 | Quantitative Comparison method | 245 | 245 | 0 | 0 | 0 | 0 |

Q-1 to Q-9 add up to 740. Every question in a data set (a shared table or graph) is in Q-9, whatever it asks about.

## How the nodes were assigned

By the source's own `topic` field first, then by keywords in its Turkish subtopic:

- geometry: triangles, angles and lines go to Q-5; anything with a circle, polygon, solid or axes goes to Q-6.
- data: questions in a data set, or about a table, graph, histogram or scatter plot, go to Q-9; probability and counting to Q-8; the rest to Q-7.
- arithmetic and algebra: speed, work, flow and mixtures go to Q-4; probability and counting to Q-8; mean, median, SD and quartiles to Q-7; lines and points on axes to Q-6; percents, ratios, discounts, interest and growth to Q-2; everything else to Q-3 (algebra) or Q-1 (arithmetic).

The rules live in `scripts/gre-import.mjs`. Re-run it after changing them.

## Source note

The bank's README says the questions were written for that project; they are not official ETS questions. Question text, figures, options and answers are copied unchanged. The step-by-step solutions and shortcuts were translated from Turkish into English.
