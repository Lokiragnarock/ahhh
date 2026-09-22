---
title: Bond Market MOC
type: moc
status: active
created: 2026-08-06
source: claude-session
tags: [bonds, moc, recall]
---

# Bond Market — Map of Content

## What this is
Entry point for Bond Market Operations and Analytics (BBA303F-5). CIA 2 covers Unit 2:
valuation, yield measures, duration/convexity, Malkiel's theorems, and the three risks.

## My notes
- [[INdex Bonds]]

## App sync and course plan
- [[BBA303F-5 - Bond Market Operations and Analytics]] — topic checklist from the app
- [[BBA303F-5 - Bond Market Operations Course Plan]] — official syllabus, rubric, assessment structure

## Start here — the conceptual spine (built 2026-08-04)
- [[Bond Market Unit 2 - How Bond Valuation Actually Works]] — why every formula exists, four
  layers (pricing, yield, sensitivity, risk), design principles that repeat. Read before the
  cheat sheet; it turns formulas from a list into a system.
- [[Bond Market Unit 2 - Cheat Sheet]] — one page. Every formula in code blocks (bond pricing,
  zero-coupon, CY, YTM interpolation, YTC, Macaulay/modified duration, convexity with
  adjustment), Malkiel's 5 theorems, 3 risks, 7-step checklist, 8 traps.

## CIA 1 assignment (completed)
- [[CIA1 - Bond Market Analysis]] — assignment hub (G-Sec vs corporate bond comparison)
- [[11 - Report Draft]] — full typed draft
- [[12 - Excel Remake Packet]] — Excel rebuild brief

## Recall prompts
- Q: A bond has a 9% coupon and trades at 105. Is its YTM above or below 9%? Why?
  (Premium bond: coupon > yield, so YTM < 9%. You paid more than par, so the capital loss
  at maturity drags return below the coupon rate.)
- Q: Two bonds, same maturity, one has a 4% coupon and the other 10%. Yields rise 1%.
  Which loses more value? Why?
  (The 4% coupon bond. Lower coupon means more value concentrated in the face-value payment
  at maturity, so higher duration, so more price sensitivity. Malkiel Theorem 5.)
- Q: Duration is 7.2 years. Modified duration is 6.8. Yields rise by 50 bps. Approximate
  the price change.
  (ΔP/P ≈ -6.8 x 0.005 = -3.4%. Use modified duration, not Macaulay. Trap 3.)
- Q: A portfolio manager says "I want high duration AND low interest rate risk." Is that
  possible?
  (No. Duration IS the measure of interest rate risk. Higher duration means more exposure
  to rate changes. The two are the same thing.)
- Q: Rates just fell. Is that good news or bad news for a bondholder?
  (Both. Price rises — good if you sell. But coupons now reinvest at lower rates — bad for
  total return. Interest rate risk and reinvestment risk offset each other.)
- Q: Why does convexity always help, regardless of whether yields rise or fall?
  (The convexity term ½ x C x Δy² is always positive. When yields fall, you gain MORE than
  duration predicts. When yields rise, you lose LESS than duration predicts. Higher convexity
  is free upside in both directions.)
- Q: What is the duration of a zero-coupon bond maturing in 12 years?
  (Exactly 12 years. No coupons to pull the weighted average forward. This is the ceiling
  for duration at that maturity.)

## CIA 2 exam structure
Section A: short answer, 3 of 5, 5 marks each (15). Section B: long answer, 2 with internal
choice, 10 marks each (20). Section C: compulsory case study, 15 marks. Total 50, scaled to 20.
Date not specified in the course plan — confirm with faculty.

## Open threads
- CIA 2 date still blank in the plan. SAPM says 9-16 Aug window. Confirm whether Bonds
  shares that window or has a separate slot.
- No MCQ bank built yet. Use the cheat sheet's formula blocks for active recall: cover the
  right side, produce the formula from the label.

## Links
- [[Home]]
