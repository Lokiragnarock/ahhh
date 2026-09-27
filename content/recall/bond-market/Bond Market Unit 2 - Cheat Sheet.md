---
title: "Bond Market Unit 2 — Cheat Sheet"
type: recall
status: active
created: 2026-08-04
source: claude-session
tags: [bonds, recall, unit-2, cheatsheet, valuation, duration, malkiel]
---

# Bond Market Unit 2 — Cheat Sheet

One page. Formulas, theorems, and traps for the CIA 2 exam. Everything here is meant to be held
in short-term memory walking into the exam.

Reasoning behind any of these: [[Bond Market Unit 2 - How Bond Valuation Actually Works]].

---

## Bond valuation — the core idea

A bond's price is the present value of all its future cash flows: coupon payments (annuity) plus
face value repaid at maturity (lump sum).

```
COUPON BOND PRICE

  P = C × [1 - (1+r)^(-n)] / r  +  F / (1+r)^n

  P = bond price
  C = coupon payment per period (= Face Value × Coupon Rate / payment frequency)
  r = required yield per period (= annual yield / payment frequency)
  n = total number of periods (= years to maturity × payment frequency)
  F = face value (par value)

  First term = PV of coupon annuity
  Second term = PV of face value at maturity
```

```
ZERO-COUPON BOND PRICE

  P = F / (1+r)^n

  No coupons, so price = PV of face value only.
  Always trades at a discount to par.
  The discount IS the return.
```

## Price-yield relationship

```
  Price and yield move in OPPOSITE directions. Always.

  Yield rises  → Price falls
  Yield falls  → Price rises

  This is mechanical, not market sentiment: when required yield goes up,
  the PV of fixed future cash flows goes down.
```

## Pull-to-par effect

A bond's price converges toward face value as maturity approaches, regardless of whether it
currently trades at a premium or discount.

Premium bond (coupon > yield): price falls gradually toward par.
Discount bond (coupon < yield): price rises gradually toward par.
At maturity: price = face value, no matter what.

The pull is automatic because the "n" in the formula shrinks every day. As n approaches zero,
the PV of the face value approaches the face value itself.

## Yield measures

```
CURRENT YIELD

  CY = Annual Coupon / Current Market Price × 100

  Simple income return. Ignores capital gain/loss at maturity.
  Ignores time value. Quick-and-dirty measure only.


YIELD TO MATURITY (YTM)

  The discount rate that makes PV of all future cash flows = current market price.
  Solve for r in: P = C × [1 - (1+r)^(-n)] / r  +  F / (1+r)^n

  Cannot be solved algebraically — use trial and error or interpolation.
  Assumes: hold to maturity, reinvest all coupons at the same YTM rate.

  INTERPOLATION FORMULA:
  YTM ≈ r_low + [(PV_low - Market Price) / (PV_low - PV_high)] × (r_high - r_low)


YIELD TO CALL (YTC)

  Same formula as YTM, but:
    n = periods to CALL DATE (not maturity)
    F = CALL PRICE (not face value, often face + call premium)

  Use YTC when a bond is callable and trading above the call price,
  because the issuer is likely to call it.
```

## Duration

```
MACAULAY DURATION

  D = [Σ t × PV(CF_t)] / P

  = [1×PV(C₁) + 2×PV(C₂) + ... + n×PV(C_n + F)] / P

  Weighted average time to receive the bond's cash flows,
  where the weights are the PV of each cash flow as a fraction of the price.
  Measured in YEARS (or periods).

  For a zero-coupon bond: Duration = Maturity (exactly).
  For a coupon bond: Duration < Maturity (always).


MODIFIED DURATION

  D_mod = Macaulay Duration / (1 + YTM/k)

  k = number of coupon payments per year

  Measures price SENSITIVITY to yield changes.
  Higher modified duration = more price volatility for a given yield change.


PRICE CHANGE ESTIMATE USING MODIFIED DURATION

  ΔP/P ≈ -D_mod × Δy

  Percentage price change ≈ negative modified duration × change in yield
  The negative sign: yield up → price down.
```

## Convexity

```
CONVEXITY

  Convexity = [Σ t(t+1) × PV(CF_t)] / [P × (1+y)²]

  Duration gives a LINEAR approximation of price change.
  Convexity is the CORRECTION for the curve.

  For large yield changes, duration alone UNDERESTIMATES
  price increases and OVERESTIMATES price decreases.


PRICE CHANGE WITH CONVEXITY ADJUSTMENT

  ΔP/P ≈ -D_mod × Δy  +  ½ × Convexity × (Δy)²

  The convexity term is always POSITIVE (adds to price for both
  yield increases and decreases), which is why higher convexity
  is desirable — you gain more when yields fall and lose less
  when yields rise.
```

## Malkiel's five bond price theorems

1. Bond prices move inversely to yields. (The fundamental price-yield relationship.)

2. For a given change in yield, LONGER maturity bonds show LARGER percentage price changes. (Longer bonds are more sensitive to rate changes.)

3. The price sensitivity described in Theorem 2 increases at a DECREASING rate as maturity increases. (Going from 5 to 10 years adds more sensitivity than going from 20 to 25 years.)

4. For a given maturity, a yield DECREASE produces a LARGER price gain than an equal yield INCREASE produces a price loss. (Price-yield curve is convex, not linear — this is the convexity effect.)

5. For a given maturity, LOWER coupon bonds show LARGER percentage price changes for a given yield change. (Lower coupons mean more of the bond's value sits in the distant face-value payment, which is more sensitive to discounting.)

Duration theorem: For a given change in yield, bonds with HIGHER DURATION show larger price changes. Duration is the single number that captures all of theorems 1, 2, and 5.

## Three bond risks

INTEREST RATE RISK — Bond prices fall when market interest rates rise. Longer duration = more exposure. This is the risk of holding bonds when rates move against you.

REINVESTMENT RISK — YTM assumes you reinvest every coupon at the same rate. If rates fall after you buy, coupons get reinvested at lower rates, and your actual return falls below the YTM you calculated at purchase. Higher coupon = more reinvestment risk (more cash flow to reinvest). Zero-coupon bonds have ZERO reinvestment risk (no coupons to reinvest).

CREDIT RISK (DEFAULT RISK) — The issuer may fail to pay coupons or repay principal. Government bonds carry near-zero credit risk. Corporate bonds carry credit risk proportional to the issuer's financial health. Credit ratings (AAA to D) measure this. Lower rating = higher yield demanded as compensation.

The interest rate risk and reinvestment risk move in OPPOSITE directions:
  When rates rise: bond price falls (bad) but coupons reinvest at higher rates (good).
  When rates fall: bond price rises (good) but coupons reinvest at lower rates (bad).

---

## Case-study answer checklist

1. Read the problem. Is it asking for price, yield, duration, or a risk assessment?
2. If pricing: identify coupon rate, face value, required yield, maturity, payment frequency. Plug into the bond price formula.
3. If YTM: you are solving for the rate. Use interpolation: pick two rates, compute PV at each, interpolate.
4. If duration: compute PV of each cash flow, multiply by its time period, sum, divide by price.
5. If price sensitivity: compute modified duration, then use ΔP/P ≈ -D_mod × Δy. Add convexity correction for large yield changes.
6. If comparing bonds: use Malkiel's theorems to explain which bond is more sensitive and why.
7. State your conclusion. If the question asks for a recommendation, commit to one.

## Eight traps

0. **Price and yield move in opposite directions.** This is mechanical, not debatable. If you get a calculation where both rise together, you made an arithmetic error.

1. **YTM is not your actual return unless you reinvest all coupons at the YTM rate.** The reinvestment assumption is baked in. If rates change after purchase, your realised return will differ from YTM.

2. **Duration of a zero-coupon bond equals its maturity.** No coupons means all cash flow arrives at maturity, so the weighted average time is maturity itself. For coupon bonds, duration is always less than maturity.

3. **Modified duration, not Macaulay duration, measures price sensitivity.** The exam may give you Macaulay duration and ask for the price change — you must divide by (1 + YTM/k) first to get modified duration before applying the ΔP/P formula.

4. **Duration is a linear approximation.** For small yield changes it works well. For large changes, duration alone underestimates price gains and overestimates price losses. Add the convexity correction.

5. **Higher convexity is always desirable.** It means you gain more when yields fall and lose less when yields rise. Between two bonds with the same duration, prefer higher convexity.

6. **Interest rate risk and reinvestment risk offset each other.** Don't treat them as additive. When rates rise, price falls but reinvestment improves. When rates fall, price rises but reinvestment suffers.

7. **Lower coupon means higher interest rate risk but lower reinvestment risk.** More of the bond's value is in the face-value payment (duration is longer, so more price sensitivity), but less cash flow needs reinvesting. Zero-coupon is the extreme: maximum interest rate risk, zero reinvestment risk.

## Links
- [[Bond Market Unit 2 - How Bond Valuation Actually Works]]
- [[Home]]
