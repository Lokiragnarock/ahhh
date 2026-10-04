---
title: Taste pass brief (runs after the last code chunk)
type: agent-brief
created: 2026-10-04
tags: [study-planner, gmat, design, taste, emil-design-eng]
---

# Taste pass: brief for the final Sonnet agent

**When:** after chunks 1, 1b, 2, 3 and 4 are merged and committed, before the work is pushed.
**Agent:** Sonnet. **Cornerstone:** load the `emil-design-eng` skill first and treat it as the governing rulebook. Every finding goes in its required `| Before | After | Why |` table.

## Read first (in this order)
1. `emil-design-eng` skill: animation decision framework, button press feedback, easing curves, durations under 300 ms, reduced-motion, hover gating.
2. `D:\Lokesh\Core\Second Brain\Study Planner\02 - UI Spec and Build Brief.md`: AHH locked decisions (three bands not percentages, no timers while reading, map hidden until reveal, dossier style tokens).
3. `D:\Lokesh\Core\Second Brain\Study Planner\01 - Product Plan (PM Pass).md`: the proto-persona (n=1, the actual user).
4. `D:\Assam Internship\App\studyduel\DESIGN.md` (moving to `D:\VibeCoding\studyduel`) plus `D:\Lokesh\Core\Second Brain\StudyDuel - Sexy Redesign Plan.md`: the GMAT look (Notion white, #2EAADC accent, warm black #37352F, Hanken Grotesk + JetBrains Mono, and which motion was relaxed and why).
5. `D:\Lokesh\Core\Design & Taste Skills.md` and `D:\Lokesh\LRLC\Second Brain\prompt-library\design-system-prompt.md`: house taste rules.
6. `docs/gmat-section/PRD.md` sections 3 (user flow) and 4 (personas), plus the decisions log.

## Personas to judge against
- **Lokesh, GMAT owner:** studies between CIAs, wants one button to the next block, sees Versus.
- **GMAT player (onboarded friend):** individual view only. The first tap asks just for a name, so nothing should feel like setup.
- **AHH notes user (e.g. Prathyu):** must see no change except the shared Timeline.

## Scope
- Track toggle, the onboarding name field, TopNav, page heads, Territory, Practice question flow, Error book, shared Timeline + All/GMAT/Notes filter, Block timer, GMAT Status, Versus.
- Check both tracks. **AHH must not pick up GMAT styling**, and GMAT must read as visibly different.
- Desktop and phone width (375 px).

## Rules for the agent
- Review first and return the table. Apply only fixes that are under 20 lines each and touch styling or motion. Anything structural goes back to the orchestrator as a proposal.
- No new dependencies. CSS transitions over JS animation. Only transform and opacity animate.
- No animation on anything used dozens of times a day (nav, toggle, answer selection), only press feedback.
- `npx tsc --noEmit` and `npm run build` must stay green. Don't commit.
- Return in 25 lines or fewer: the Before/After/Why table (top 10 by impact), what was applied, and what was proposed.
