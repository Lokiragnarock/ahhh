---
title: "SAPM Unit 3 - TA-5 RSI and ROC"
type: recall
status: active
created: 2026-10-05
source: "BBA301F-5 course plan Unit 3 (RSI and ROC practical problems); textbook method (Wilder 1978; Madhumati; Murphy)"
tags: [sapm, recall, unit-3, rsi, roc, momentum, oscillators]
node: TA-5
section: "3.5"
minutes: 45
deps: [TA-1]
weight: 45
exam_focus: true
state: unstudied
---

# TA-5: RSI and ROC (Practical Problems)

Covers: what oscillators and momentum indicators are, the Relative Strength Index (formula, step-by-step computation, overbought/oversold, divergence), and the Rate of Change (formula, computation, interpretation). The syllabus names **practical problems** for both, so the computation is examinable. **(syllabus)**

## Where this fits in the ESE

A 5-mark or 10-mark sum: "compute the 14-day RSI from the following closing prices and interpret", or "compute the 5-day and 10-day ROC". CIA2 rewarded "applies technical tools and indicators with clear analytical reasoning", so always end with an interpretation line.

## Oscillators and momentum

An **oscillator** moves within a range (RSI between 0 and 100) or around a centre line (ROC around 0). It measures **momentum**: the speed of price change. Momentum often turns before price does, so oscillators help spot overbought or oversold markets and weakening trends.

## Relative Strength Index (Wilder, 1978)

**RSI = 100 − 100 ÷ (1 + RS)**
**RS = Average gain over n days ÷ Average loss over n days** (n is usually 14)

Steps:
1. Compute each day's change (close − previous close).
2. Separate gains (positive changes) and losses (negative changes, written as positive numbers).
3. Average gain = sum of gains ÷ n; average loss = sum of losses ÷ n.
4. RS = average gain ÷ average loss.
5. RSI = 100 − 100 ÷ (1 + RS).

(Wilder's later RSI values smooth the averages: new avg gain = [previous avg gain × 13 + today's gain] ÷ 14. In exams, the simple average above is the usual method unless told otherwise.)

**Interpretation:**
- **RSI > 70: overbought**: the rise may be overextended; watch for a correction (sell signal when it turns back down below 70).
- **RSI < 30: oversold**: the fall may be overextended; watch for a bounce (buy signal when it rises back above 30).
- **50 line:** above 50 bullish momentum, below 50 bearish.
- **Divergence:** price makes a new high but RSI makes a lower high (**bearish divergence**): momentum weakening, reversal possible. Price makes a new low but RSI a higher low (**bullish divergence**).
- In strong trends RSI can stay overbought or oversold for a long time; don't sell a strong uptrend just because RSI is 72.

<svg width="100%" style="max-width:680px;display:block;margin:12px auto" viewBox="0 0 680 386" role="img" xmlns="http://www.w3.org/2000/svg">
<title>Price over RSI: overbought, oversold and divergence</title>
<desc>Top panel shows a price line making a higher high. The panel below shows RSI with an amber overbought band above 70 and oversold band below 30. RSI peaks above 70 first, then makes a lower high while price rises, which is a bearish divergence. A red dot marks RSI turning down through 70 and a green dot marks RSI rising back above 30.</desc>
<rect x="40" y="44" width="600" height="131" fill="none" stroke="#888780" stroke-width="1"/>
<rect x="40" y="210" width="600" height="120" fill="none" stroke="#888780" stroke-width="1"/>
<rect x="40" y="210" width="600" height="36" fill="#EF9F27" fill-opacity="0.5" stroke="none" stroke-width="1"/>
<rect x="40" y="294" width="600" height="36" fill="#EF9F27" fill-opacity="0.5" stroke="none" stroke-width="1"/>
<line x1="40" y1="246" x2="640" y2="246" stroke="#888780" stroke-width="1" stroke-dasharray="6 4"/>
<line x1="40" y1="294" x2="640" y2="294" stroke="#888780" stroke-width="1" stroke-dasharray="6 4"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="646" y="250" text-anchor="start">70</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="646" y="298" text-anchor="start">30</text>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="46" y="36" text-anchor="start">Price</text>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="46" y="204" text-anchor="start">RSI</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="48" y="228" text-anchor="start">Overbought</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="48" y="318" text-anchor="start">Oversold</text>
<polyline points="50,150 100,120 150,85 200,115 260,70 310,100 360,140 410,165 460,150 520,120 580,100" fill="none" stroke="#5F5E5A" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
<polyline points="50,264 100,248.4 150,234 200,267.6 260,243.6 310,260.4 360,282 410,301.2 460,288 520,267.6 580,255.6" fill="none" stroke="#7F77DD" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
<line x1="150" y1="85" x2="260" y2="70" stroke="#5F5E5A" stroke-width="1.5" stroke-dasharray="5 4"/>
<line x1="150" y1="234" x2="260" y2="243.6" stroke="#7F77DD" stroke-width="1.5" stroke-dasharray="5 4"/>
<circle cx="150" cy="85" r="4" fill="#888780" stroke="#5F5E5A" stroke-width="1"/>
<circle cx="260" cy="70" r="4" fill="#888780" stroke="#5F5E5A" stroke-width="1"/>
<circle cx="150" cy="234" r="4" fill="#7F77DD" stroke="#7F77DD" stroke-width="1"/>
<circle cx="260" cy="243.6" r="4" fill="#7F77DD" stroke="#7F77DD" stroke-width="1"/>
<text font-size="12" fill="currentColor" font-family="inherit" x="205" y="58" text-anchor="middle">higher high on price</text>
<text font-size="12" fill="currentColor" font-family="inherit" x="400" y="194" text-anchor="middle">Bearish divergence: price makes a higher high, RSI a lower high</text>
<circle cx="267.1" cy="246" r="5" fill="#E24B4A" stroke="#A32D2D" stroke-width="1"/>
<circle cx="437.3" cy="294" r="5" fill="#639922" stroke="#3B6D11" stroke-width="1"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="340" y="352" text-anchor="middle">Red dot: RSI turns back down through 70, sell signal.</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="340" y="370" text-anchor="middle">Green dot: RSI rises back up through 30, buy signal.</text>
</svg>

### Worked example: 14-day RSI, laid out as the exam answer

**Question (illustrative):** closing prices over 15 days: 100, 102, 101, 104, 106, 105, 107, 110, 108, 111, 113, 112, 115, 114, 117. Compute the 14-day RSI and interpret.

| Day | Close | Change | Gain | Loss |
|---|---|---|---|---|
| 1 | 100 | | | |
| 2 | 102 | +2 | 2 | |
| 3 | 101 | −1 | | 1 |
| 4 | 104 | +3 | 3 | |
| 5 | 106 | +2 | 2 | |
| 6 | 105 | −1 | | 1 |
| 7 | 107 | +2 | 2 | |
| 8 | 110 | +3 | 3 | |
| 9 | 108 | −2 | | 2 |
| 10 | 111 | +3 | 3 | |
| 11 | 113 | +2 | 2 | |
| 12 | 112 | −1 | | 1 |
| 13 | 115 | +3 | 3 | |
| 14 | 114 | −1 | | 1 |
| 15 | 117 | +3 | 3 | |
| **Total** | | | **23** | **6** |

1. Average gain = 23 ÷ 14 = 1.643; average loss = 6 ÷ 14 = 0.429.
2. RS = 1.643 ÷ 0.429 = 23 ÷ 6 = **3.833**.
3. RSI = 100 − 100 ÷ (1 + 3.833) = 100 − 100 ÷ 4.833 = 100 − 20.69 = **79.31**.

**Interpretation:** RSI 79.3 is above 70: the stock is **overbought**. The uptrend is strong, but the risk of a short-term pullback is high. A trader should avoid fresh buying, consider booking partial profits, and sell if RSI turns back below 70 or a bearish candle (e.g. shooting star) appears.

## Rate of Change (ROC)

**ROC = (Cₜ − Cₜ₋ₙ) ÷ Cₜ₋ₙ × 100**
where Cₜ is today's close and Cₜ₋ₙ is the close n periods ago. (A variant, the momentum indicator, uses Cₜ − Cₜ₋ₙ in rupees.)

**Interpretation:**
- ROC > 0: price higher than n days ago (bullish momentum); rising ROC = accelerating.
- ROC < 0: bearish momentum.
- **Zero-line crossover:** crossing above 0 is a buy signal; below 0 a sell signal.
- Extreme high or low ROC relative to the stock's own history signals overbought or oversold.
- Divergence with price warns of a reversal.

<svg width="100%" style="max-width:680px;display:block;margin:12px auto" viewBox="0 0 680 322" role="img" xmlns="http://www.w3.org/2000/svg">
<title>ROC around the zero line</title>
<desc>A rate-of-change line oscillating around a dashed zero line. Where it is above zero the area is shaded green, where it is below zero it is shaded red. A green dot marks each upward zero crossing, labelled buy, and a red dot marks each downward crossing, labelled sell.</desc>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="46" y="40" text-anchor="start">ROC (n-day)</text>
<polygon points="40,200 90,240 140,190 152.5,170" fill="#E24B4A" fill-opacity="0.3" stroke="none"/>
<polygon points="152.5,170 190,110 240,70 290,130 315,170" fill="#639922" fill-opacity="0.3" stroke="none"/>
<polygon points="315,170 340,210 390,260 440,220 471.3,170" fill="#E24B4A" fill-opacity="0.3" stroke="none"/>
<polygon points="471.3,170 490,140 540,90 590,120 640,160" fill="#639922" fill-opacity="0.3" stroke="none"/>
<line x1="40" y1="170" x2="640" y2="170" stroke="#888780" stroke-width="1" stroke-dasharray="6 4"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="646" y="174" text-anchor="start">0</text>
<polyline points="40,200 90,240 140,190 190,110 240,70 290,130 340,210 390,260 440,220 490,140 540,90 590,120 640,160" fill="none" stroke="#7F77DD" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="152.5" cy="170" r="5" fill="#639922" stroke="#3B6D11" stroke-width="1"/>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="144.5" y="156" text-anchor="end">Buy</text>
<circle cx="315" cy="170" r="5" fill="#E24B4A" stroke="#A32D2D" stroke-width="1"/>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="323" y="156" text-anchor="start">Sell</text>
<circle cx="471.3" cy="170" r="5" fill="#639922" stroke="#3B6D11" stroke-width="1"/>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="463.3" y="156" text-anchor="end">Buy</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="340" y="290" text-anchor="middle">Green area: price above its level n days ago (bullish momentum).</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="340" y="308" text-anchor="middle">Red area: price below it (bearish). Zero-line crossings are the signals.</text>
</svg>

### Worked example: ROC

Using the same prices (day 15 close 117):
- **10-day ROC** = (117 − 106) ÷ 106 × 100 = **+10.38%** (day 5 close was 106).
- **5-day ROC** = (117 − 111) ÷ 111 × 100 = **+5.41%** (day 10 close was 111).

**Interpretation:** both are positive, so momentum is bullish. The 5-day ROC (5.41%) is about half the 10-day (10.38%), so the pace of the rise has been steady rather than accelerating. Combined with RSI 79, the picture is a strong but stretched uptrend.

## Traps

- **Including the first day's close as a change.** 15 closes give 14 changes.
- **Writing losses as negative numbers** in the average loss. Use absolute values.
- **Dividing by days with a gain only.** Average gain and loss both divide by n (14).
- **Interpreting without context:** RSI 75 in a strong trend may stay overbought.

## What to remember

- RSI = 100 − 100/(1 + RS); RS = avg gain/avg loss over 14 days.
- > 70 overbought, < 30 oversold; divergence warns of reversal.
- Example: gains 23, losses 6, RS 3.833, RSI 79.31: overbought.
- ROC = (Cₜ − Cₜ₋ₙ)/Cₜ₋ₙ × 100; zero-line crossovers.
- Example: 10-day ROC +10.38%, 5-day +5.41%.

## Concept map

```mermaid
graph TD
    OS["MOMENTUM OSCILLATORS"] --> RSI["RSI = 100 − 100/(1+RS)<br/>RS = avg gain / avg loss"]
    OS --> ROC["ROC = (Ct − Ct−n)/Ct−n × 100"]
    RSI --> OB["> 70 overbought<br/>< 30 oversold"]
    RSI --> DV["Divergence:<br/>price vs RSI"]
    ROC --> ZL["Zero-line crossover"]
    ROC --> EX["Extremes vs history"]
    OB --> CF["Confirm with candles,<br/>trend, volume"]
```

## Flashcards
Q: Write the RSI formula.
A: RSI = 100 − 100 ÷ (1 + RS), where RS = average gain ÷ average loss over n (usually 14) days.

Q: What RSI levels signal overbought and oversold?
A: Above 70 overbought; below 30 oversold.

Q: Gains total 23 and losses total 6 over 14 days. RSI?
A: RS = 3.833; RSI = 79.31.

Q: What is a bearish RSI divergence?
A: Price makes a higher high but RSI makes a lower high: momentum weakening.

Q: Write the ROC formula.
A: (Cₜ − Cₜ₋ₙ) ÷ Cₜ₋ₙ × 100.

Q: Close today ₹117, ten days ago ₹106. 10-day ROC?
A: +10.38%.

Q: What does ROC crossing above zero signal?
A: Momentum turning positive: a buy signal.

## Sources
- BBA301F-5 course plan, Unit 3 (RSI and ROC practical problems)
- Wilder, *New Concepts in Technical Trading Systems* (1978); Murphy
- Previous: [[SAPM Unit 3 - TA-4 Dow Theory Trend Support and Resistance]] · Next: [[SAPM Unit 3 - TA-6 Moving Averages and MACD]]
- [[SAPM Unit 3 - Technical Analysis MOC (Node Map)]]
