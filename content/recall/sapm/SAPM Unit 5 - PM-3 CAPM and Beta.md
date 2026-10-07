---
title: "SAPM Unit 5 - PM-3 CAPM and Beta"
type: recall
status: active
created: 2026-10-05
source: "BBA301F-5 course plan Unit 5; textbook method (Fischer & Jordan, Reilly & Brown, Madhumati)"
tags: [sapm, recall, unit-5, capm, beta, sml]
node: PM-3
section: "5.3"
minutes: 45
deps: [PM-2]
weight: 45
exam_focus: true
state: unstudied
---

# PM-3: CAPM and Beta

Covers: the Capital Asset Pricing Model, its assumptions, beta as the measure of systematic risk, computing beta from returns, portfolio beta, the Security Market Line, and using CAPM to decide whether a stock is under- or overvalued. **(syllabus)**

## Where this fits in the ESE

CAPM is the single most examinable formula in Unit 5. Expect a 5-mark sum (required return, or beta from five years of returns), a 10-mark "explain CAPM, assumptions and limitations", and a CAPM step inside the 15-mark case (required return feeds Jensen's alpha in PM-5 and the cost of equity in Unit 4's dividend models).

## The idea in one paragraph

PM-2 showed that unsystematic risk can be diversified away for free. So in equilibrium the market pays a premium **only for systematic risk**, and beta measures systematic risk. A stock's required return is therefore the risk-free rate plus a premium proportional to its beta.

## The formula

**E(Rᵢ) = R_f + βᵢ (R_m − R_f)**

- R_f: risk-free rate (91-day T-bill or 10-year G-sec yield in India).
- R_m: expected market return (Nifty 50 / Sensex).
- (R_m − R_f): **market risk premium**.
- βᵢ(R_m − R_f): the stock's risk premium.

## Beta

**β = Cov(Rᵢ, R_m) ÷ σ_m²**  (also β = ρ_im σᵢ ÷ σ_m)

| Beta | Meaning | Type |
|---|---|---|
| β > 1 | Moves more than the market | Aggressive (e.g. metals, realty) |
| β = 1 | Moves with the market | Market-like (an index fund) |
| 0 < β < 1 | Moves less than the market | Defensive (FMCG, pharma) |
| β = 0 | No market co-movement | Risk-free asset |
| β < 0 | Moves against the market | Rare (gold at times) |

A β of 1.5 means: if the market rises 10%, the stock is expected to rise 15%; if it falls 10%, the stock is expected to fall 15%.

**Portfolio beta** is the weighted average of the stocks' betas: **βp = Σ wᵢ βᵢ**. (Unlike SD, beta does average.)

## Assumptions of CAPM

1. Investors are risk-averse and diversify (Markowitz investors).
2. They can borrow and lend unlimited amounts at the risk-free rate.
3. Homogeneous expectations: all investors agree on returns, variances and covariances.
4. Single-period horizon.
5. Perfect markets: no taxes, no transaction costs, assets divisible, information free.
6. No investor can influence prices (price-takers).

## Security Market Line (SML)

Plot required return (y-axis) against **beta** (x-axis). The SML starts at R_f (β = 0) and passes through the market (β = 1, R_m). Its slope is the market risk premium.

- A stock whose expected return plots **above** the SML gives more than the required return for its beta: **undervalued, buy**.
- **Below** the SML: **overvalued, sell or avoid**.
- **On** the line: fairly priced.

(Don't confuse with the CML, which plots return against **total risk σ** and holds only for efficient portfolios. The SML holds for every security.)

## Worked example 1: required return and valuation decision

**Question (illustrative):** R_f = 6%, R_m = 13%. Stock P has β = 1.2; it trades at ₹200, is expected to pay a dividend of ₹6 and to trade at ₹230 in a year. Stock Q has β = 0.8 and an analyst's expected return of 10%. Advise.

1. Market risk premium = 13 − 6 = 7%.
2. P: required return = 6 + 1.2 × 7 = **14.4%**.
   Expected return = (6 + 230 − 200) ÷ 200 = 36 ÷ 200 = **18%**.
   18% > 14.4%, so P plots above the SML: **undervalued, buy**.
3. Q: required return = 6 + 0.8 × 7 = **11.6%**. Expected 10% < 11.6%, so Q plots below the SML: **overvalued, avoid or sell**.

<svg width="100%" style="max-width:680px;display:block;margin:12px auto" viewBox="0 0 680 358" role="img" xmlns="http://www.w3.org/2000/svg">
<title>Security market line with stocks P and Q</title>
<desc>Security market line from the risk-free rate 6% at beta 0, through the market at beta 1 and 13%. Stock P at beta 1.2 requires 14.4% but is expected to return 18%, so it plots above the line and is undervalued. Stock Q at beta 0.8 requires 11.6% but is expected to return 10%, so it plots below the line and is overvalued.</desc>
<line x1="70" y1="300" x2="70" y2="36" stroke="#888780" stroke-width="1.5"/>
<line x1="70" y1="300" x2="640" y2="300" stroke="#888780" stroke-width="1.5"/>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="70" y="26" text-anchor="start">Return (%)</text>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="355" y="350" text-anchor="middle">Beta</text>
<line x1="66" y1="300" x2="70" y2="300" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="60" y="304" text-anchor="end">0</text>
<line x1="66" y1="240" x2="70" y2="240" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="60" y="244" text-anchor="end">5</text>
<line x1="66" y1="180" x2="70" y2="180" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="60" y="184" text-anchor="end">10</text>
<line x1="66" y1="120" x2="70" y2="120" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="60" y="124" text-anchor="end">15</text>
<line x1="66" y1="60" x2="70" y2="60" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="60" y="64" text-anchor="end">20</text>
<line x1="70" y1="300" x2="70" y2="304" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="70" y="320" text-anchor="middle">0</text>
<line x1="210" y1="300" x2="210" y2="304" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="210" y="320" text-anchor="middle">0.5</text>
<line x1="350" y1="300" x2="350" y2="304" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="350" y="320" text-anchor="middle">1</text>
<line x1="490" y1="300" x2="490" y2="304" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="490" y="320" text-anchor="middle">1.5</text>
<line x1="630" y1="300" x2="630" y2="304" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="630" y="320" text-anchor="middle">2</text>
<polyline points="70,228 630,60" fill="none" stroke="#5F5E5A" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="560" y="104" text-anchor="start">SML</text>
<circle cx="70" cy="228" r="5" fill="#888780" stroke="#5F5E5A" stroke-width="2"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="80" y="246" text-anchor="start">Rf 6%</text>
<circle cx="350" cy="144" r="5" fill="#888780" stroke="#5F5E5A" stroke-width="2"/>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="340" y="132" text-anchor="end">Market: beta 1, 13%</text>
<line x1="406" y1="84" x2="406" y2="127.2" stroke="#3B6D11" stroke-width="1.5" stroke-dasharray="4 3"/>
<circle cx="406" cy="127.2" r="4" fill="none" stroke="#5F5E5A" stroke-width="2"/>
<circle cx="406" cy="84" r="6" fill="#639922" stroke="#3B6D11" stroke-width="2"/>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="416" y="89" text-anchor="start">P: expected 18%</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="416" y="147.2" text-anchor="start">P: required 14.4%</text>
<line x1="294" y1="160.8" x2="294" y2="180" stroke="#A32D2D" stroke-width="1.5" stroke-dasharray="4 3"/>
<circle cx="294" cy="160.8" r="4" fill="none" stroke="#5F5E5A" stroke-width="2"/>
<circle cx="294" cy="180" r="6" fill="#E24B4A" stroke="#A32D2D" stroke-width="2"/>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="284" y="185" text-anchor="end">Q: expected 10%</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="282" y="150.8" text-anchor="end">Q: required 11.6%</text>
<text font-size="12" font-weight="500" fill="currentColor" font-family="inherit" x="86" y="62" text-anchor="start">Above the line: undervalued, buy</text>
<text font-size="12" font-weight="500" fill="currentColor" font-family="inherit" x="630" y="280" text-anchor="end">Below the line: overvalued, avoid</text>
</svg>

## Worked example 2: beta from returns

**Question:** returns over five years:

| Year | Market R_m | Stock R_i |
|---|---|---|
| 1 | 10% | 14% |
| 2 | 4% | 2% |
| 3 | 16% | 22% |
| 4 | −2% | −6% |
| 5 | 12% | 18% |

1. Means: R̄_m = 40 ÷ 5 = 8%; R̄_i = 50 ÷ 5 = 10%.
2. Deviations (in %):

| Year | d_m | d_i | d_m × d_i | d_m² |
|---|---|---|---|---|
| 1 | 2 | 4 | 8 | 4 |
| 2 | −4 | −8 | 32 | 16 |
| 3 | 8 | 12 | 96 | 64 |
| 4 | −10 | −16 | 160 | 100 |
| 5 | 4 | 8 | 32 | 16 |
| **Total** | | | **328** | **200** |

3. Cov = 328 ÷ 5 = 65.6; σ_m² = 200 ÷ 5 = 40 (dividing by n − 1 instead gives the same β, because the divisor cancels).
4. **β = 65.6 ÷ 40 = 1.64.** An aggressive stock: it moves about 1.64 times the market.

<svg width="100%" style="max-width:680px;display:block;margin:12px auto" viewBox="0 0 680 368" role="img" xmlns="http://www.w3.org/2000/svg">
<title>Beta as the slope of a regression line</title>
<desc>Scatter of five years of stock returns against market returns, with the fitted line through the means at 8% and 10%. The slope is beta = 328 divided by 200 = 1.64, and the intercept is about minus 3.12%. A dashed triangle shows a run of 5 market points producing a rise of 8.2 stock points.</desc>
<rect x="70" y="40" width="550" height="270" fill="none" stroke="#888780" stroke-width="1"/>
<line x1="170" y1="40" x2="170" y2="310" stroke="#888780" stroke-width="1" stroke-dasharray="6 4"/>
<line x1="70" y1="235" x2="620" y2="235" stroke="#888780" stroke-width="1" stroke-dasharray="6 4"/>
<line x1="120" y1="310" x2="120" y2="314" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="120" y="330" text-anchor="middle">-2</text>
<line x1="170" y1="310" x2="170" y2="314" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="170" y="330" text-anchor="middle">0</text>
<line x1="295" y1="310" x2="295" y2="314" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="295" y="330" text-anchor="middle">5</text>
<line x1="420" y1="310" x2="420" y2="314" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="420" y="330" text-anchor="middle">10</text>
<line x1="545" y1="310" x2="545" y2="314" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="545" y="330" text-anchor="middle">15</text>
<line x1="66" y1="310" x2="70" y2="310" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="60" y="314" text-anchor="end">-10</text>
<line x1="66" y1="235" x2="70" y2="235" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="60" y="239" text-anchor="end">0</text>
<line x1="66" y1="160" x2="70" y2="160" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="60" y="164" text-anchor="end">10</text>
<line x1="66" y1="85" x2="70" y2="85" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="60" y="89" text-anchor="end">20</text>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="70" y="26" text-anchor="start">Stock return Ri (%)</text>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="345" y="358" text-anchor="middle">Market return Rm (%)</text>
<polyline points="95,295.3 595,49.3" fill="none" stroke="#7F77DD" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
<line x1="420" y1="130" x2="420" y2="135.4" stroke="#888780" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="270" y1="220" x2="270" y2="209.2" stroke="#888780" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="570" y1="70" x2="570" y2="61.6" stroke="#888780" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="120" y1="280" x2="120" y2="283" stroke="#888780" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="470" y1="100" x2="470" y2="110.8" stroke="#888780" stroke-width="1" stroke-dasharray="3 3"/>
<circle cx="420" cy="130" r="5" fill="#888780" stroke="#5F5E5A" stroke-width="2"/>
<circle cx="270" cy="220" r="5" fill="#888780" stroke="#5F5E5A" stroke-width="2"/>
<circle cx="570" cy="70" r="5" fill="#888780" stroke="#5F5E5A" stroke-width="2"/>
<circle cx="120" cy="280" r="5" fill="#888780" stroke="#5F5E5A" stroke-width="2"/>
<circle cx="470" cy="100" r="5" fill="#888780" stroke="#5F5E5A" stroke-width="2"/>
<circle cx="370" cy="160" r="6" fill="none" stroke="#3B6D11" stroke-width="2"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="358" y="182" text-anchor="end">Means (8, 10)</text>
<line x1="370" y1="160" x2="495" y2="160" stroke="#3B6D11" stroke-width="1.5" stroke-dasharray="5 4"/>
<line x1="495" y1="160" x2="495" y2="98.5" stroke="#3B6D11" stroke-width="1.5" stroke-dasharray="5 4"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="432.5" y="176" text-anchor="middle">run 5</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="503" y="133.2" text-anchor="start">rise 8.2</text>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="612" y="262" text-anchor="end">Slope = beta = 328 / 200 = 1.64</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="612" y="282" text-anchor="end">Fitted line: Ri = -3.12 + 1.64 Rm</text>
</svg>

## Uses and limitations

**Uses:** required return / cost of equity; screening under- and overvalued stocks; setting hurdle rates; benchmark for performance (Jensen's alpha, PM-5).

**Limitations:** beta is estimated from the past and is unstable; the market portfolio can't be observed (Nifty is a proxy); unlimited risk-free borrowing is unrealistic; empirical tests show low-beta stocks earning more than CAPM predicts; ignores other factors (size, value, momentum) that APT and multi-factor models include.

## Traps

- **Using R_m instead of (R_m − R_f)** as the premium. 6 + 1.2 × 13 is wrong.
- **Treating total SD as the risk CAPM prices.** CAPM prices beta only.
- **Reading "above the SML" as overvalued.** Above = return too high for the risk = price too low = undervalued.
- **Averaging SDs but not betas.** Portfolio beta *is* the weighted average.

## What to remember

- E(R) = R_f + β(R_m − R_f). β = Cov(i,m) ÷ σ_m².
- βp = Σ wβ.
- Above SML = undervalued (buy); below = overvalued.
- Example 1: P required 14.4% vs expected 18%, buy; Q required 11.6% vs 10%, avoid.
- Example 2: β = 328 ÷ 200 = 1.64.

## Concept map

```mermaid
graph TD
    D["Diversification removes<br/>unsystematic risk"] --> B["Only systematic risk is priced"]
    B --> BE["Beta = Cov(i,m) / σm²"]
    BE --> C["CAPM<br/>E(R) = Rf + β(Rm − Rf)"]
    C --> SML["Security Market Line<br/>return vs beta"]
    SML --> U["Above: undervalued, buy"]
    SML --> O["Below: overvalued, sell"]
    C --> J["PM-5 Jensen's alpha"]
    C --> K["Unit 4 cost of equity<br/>in dividend models"]
```

## Flashcards
Q: Write the CAPM formula.
A: E(Rᵢ) = R_f + βᵢ(R_m − R_f).

Q: How is beta calculated?
A: β = Cov(Rᵢ, R_m) ÷ Var(R_m), or ρ × σᵢ ÷ σ_m.

Q: What does a beta of 0.7 mean?
A: A defensive stock: it is expected to move 0.7% for every 1% market move.

Q: R_f 6%, R_m 13%, β 1.2. Required return?
A: 6 + 1.2 × 7 = 14.4%.

Q: A stock plots above the SML. Buy or sell?
A: Buy: it offers more return than its beta requires, so it is undervalued.

Q: What is the difference between the SML and the CML?
A: The SML plots return against beta and holds for every security; the CML plots return against total risk σ and holds only for efficient portfolios.

Q: How is portfolio beta found?
A: The weighted average of the individual betas.

Q: Name three limitations of CAPM.
A: Unstable historical beta; unobservable market portfolio; unrealistic risk-free borrowing and other assumptions (also ignores other factors).

## Sources
- BBA301F-5 course plan, Unit 5 (CAPM, beta and systematic risk, application in equity decisions)
- Sharpe (1964), Lintner (1965); Reilly & Brown, *Investment Analysis & Portfolio Management*
- Previous: [[SAPM Unit 5 - PM-2 Diversification and Markowitz]] · Next: [[SAPM Unit 5 - PM-4 Sharpe Single Index Model]]
- [[SAPM Unit 5 - Portfolio Management MOC (Node Map)]]
