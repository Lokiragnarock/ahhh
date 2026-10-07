---
title: "SAPM Unit 5 - PM-2 Diversification and Markowitz"
type: recall
status: active
created: 2026-10-05
source: "BBA301F-5 course plan Unit 5; textbook method (Fischer & Jordan, Reilly & Brown, Madhumati)"
tags: [sapm, recall, unit-5, markowitz, efficient-frontier, diversification]
node: PM-2
section: "5.2"
minutes: 40
deps: [PM-1]
weight: 40
exam_focus: true
state: unstudied
---

# PM-2: Diversification and Markowitz

Covers: diversification and the risk-return trade-off, systematic vs unsystematic risk in a portfolio, the effect of correlation, Harry Markowitz's contribution (Modern Portfolio Theory), its assumptions, the efficient frontier and the optimal portfolio. **(syllabus)**

## Where this fits in the ESE

A classic 10-mark Section B question: "Explain Markowitz's portfolio theory with the efficient frontier" or "How does diversification reduce risk?". In a 15-mark case it is the theory paragraph that justifies why you mixed the stocks. Pair the theory with the correlation table below and you have both the concept and the numbers.

## Diversification and the risk-return trade-off

- **Total risk = systematic risk + unsystematic risk.**
- **Unsystematic (diversifiable, company-specific)**: strikes, a failed product, management fraud. Adding more stocks that don't move together washes it out.
- **Systematic (non-diversifiable, market)**: interest rates, inflation, recession, policy. Every stock is exposed, so diversification can't remove it.
- As stocks are added, portfolio SD falls quickly at first and then flattens at the market-risk floor. Most of the benefit comes in the first 15 to 20 well-chosen stocks.
- **Trade-off**: an investor who wants a higher expected return must accept higher (systematic) risk. Diversification gives you the lowest risk for each level of return; it doesn't give you free return.

Because unsystematic risk can be diversified away for free, the market pays no premium for it. That is the bridge to CAPM (PM-3): only beta is rewarded.

<svg width="100%" style="max-width:680px;display:block;margin:12px auto" viewBox="0 0 680 366" role="img" xmlns="http://www.w3.org/2000/svg">
<title>Portfolio risk against number of stocks</title>
<desc>Illustrative chart. Total portfolio risk falls steeply as stocks are added, then flattens. The flat red floor is systematic market risk, which diversification cannot remove. The amber gap between the curve and the floor is unsystematic risk, which diversification removes. Most of the benefit arrives by 15 to 20 stocks.</desc>
<line x1="70" y1="290" x2="70" y2="40" stroke="#888780" stroke-width="1.5"/>
<line x1="70" y1="290" x2="630" y2="290" stroke="#888780" stroke-width="1.5"/>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="70" y="26" text-anchor="start">Portfolio risk (SD)</text>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="350" y="336" text-anchor="middle">Number of stocks in the portfolio</text>
<line x1="88.7" y1="290" x2="88.7" y2="294" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="88.7" y="310" text-anchor="middle">1</text>
<line x1="256.7" y1="290" x2="256.7" y2="294" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="256.7" y="310" text-anchor="middle">10</text>
<line x1="443.3" y1="290" x2="443.3" y2="294" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="443.3" y="310" text-anchor="middle">20</text>
<line x1="630" y1="290" x2="630" y2="294" stroke="#888780" stroke-width="1.5"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="630" y="310" text-anchor="middle">30</text>
<polygon points="88.7,67.8 107.3,122.2 126,144.8 144.7,157.5 163.3,165.8 182,171.6 200.7,176 219.3,179.3 238,182 256.7,184.2 275.3,186.1 294,187.6 312.7,189 331.3,190.1 350,191.1 368.7,192 387.3,192.8 406,193.6 424.7,194.2 443.3,194.8 462,195.3 480.7,195.8 499.3,196.2 518,196.7 536.7,197 555.3,197.4 574,197.7 592.7,198 611.3,198.3 630,198.6 630,206.7 88.7,206.7" fill="#EF9F27" fill-opacity="0.5" stroke="none"/>
<line x1="70" y1="206.7" x2="630" y2="206.7" stroke="#A32D2D" stroke-width="2"/>
<polyline points="88.7,67.8 107.3,122.2 126,144.8 144.7,157.5 163.3,165.8 182,171.6 200.7,176 219.3,179.3 238,182 256.7,184.2 275.3,186.1 294,187.6 312.7,189 331.3,190.1 350,191.1 368.7,192 387.3,192.8 406,193.6 424.7,194.2 443.3,194.8 462,195.3 480.7,195.8 499.3,196.2 518,196.7 536.7,197 555.3,197.4 574,197.7 592.7,198 611.3,198.3 630,198.6" fill="none" stroke="#5F5E5A" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
<line x1="350" y1="195.1" x2="350" y2="245" stroke="#888780" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="443.3" y1="198.8" x2="443.3" y2="245" stroke="#888780" stroke-width="1" stroke-dasharray="4 3"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="396.7" y="262" text-anchor="middle">15 to 20 stocks</text>
<rect x="330" y="52" width="24" height="12" fill="#EF9F27" fill-opacity="0.5" stroke="#BA7517" stroke-width="1"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="362" y="62" text-anchor="start">Unsystematic risk: falls as stocks are added</text>
<line x1="330" y1="80" x2="354" y2="80" stroke="#5F5E5A" stroke-width="2"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="362" y="84" text-anchor="start">Total portfolio risk</text>
<line x1="330" y1="100" x2="354" y2="100" stroke="#A32D2D" stroke-width="2"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="362" y="104" text-anchor="start">Systematic (market) risk: the floor</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="350" y="358" text-anchor="middle">Illustrative shape, not data</text>
</svg>

## The effect of correlation, the table to draw

A: 15% return, σ 20%. B: 10% return, σ 12%. Portfolio 50:50, so E(Rp) = 12.5% in every row.

| ρ | σp | What it shows |
|---|---|---|
| +1 | 16.00% | No benefit: σp is the weighted average |
| +0.5 | 14.00% | Some benefit |
| 0 | 11.66% | Below both the average and A's risk |
| −0.5 | 8.72% | Large benefit |
| −1 | 4.00% | Maximum benefit |

With ρ = −1 the risk can be made zero: w_A = σ_B ÷ (σ_A + σ_B) = 12 ÷ 32 = **37.5%** in A, 62.5% in B.

**The lower the correlation, the greater the risk reduction.** Markowitz's point is that a security's contribution to portfolio risk depends on how it co-moves with the rest, not on its own SD.

## Markowitz: Modern Portfolio Theory (1952)

**Contribution:** before Markowitz, investors picked individually attractive stocks and assumed "more stocks = safer". Markowitz showed that risk must be measured at the portfolio level using variances **and covariances**, and gave a method (mean-variance optimisation) to find the best combinations. He won the Nobel Prize in 1990.

**Assumptions** (write five or six):
1. Investors are rational and **risk-averse**: for the same return they choose lower risk.
2. Investors decide on **expected return and variance (SD)** only.
3. Returns are normally distributed.
4. Investors want to maximise utility and prefer more return to less.
5. Single-period horizon.
6. Markets are perfect: no taxes or transaction costs, assets are divisible.

**Dominance rule:** portfolio X dominates Y if X has (a) higher return for the same risk, or (b) lower risk for the same return.

## The efficient frontier

Plot every possible portfolio of the available stocks on a graph of return (y-axis) against risk σ (x-axis). The set forms a region. Its **upper-left edge** is the efficient frontier: portfolios that give the highest return for each level of risk.

- Portfolios **on** the frontier are efficient.
- Portfolios **inside** the region are inefficient: another portfolio gives more return for the same risk.
- Portfolios **below the minimum-variance point** on the lower edge are dominated.
- The **minimum-variance portfolio** is the leftmost point.

Draw it as a curve bulging to the upper-left, with the minimum-variance point marked, a few dominated dots inside, and the efficient segment bold.

<svg width="100%" style="max-width:680px;display:block;margin:12px auto" viewBox="0 0 680 372" role="img" xmlns="http://www.w3.org/2000/svg">
<title>Efficient frontier</title>
<desc>Illustrative chart of expected return against risk. A curve bulges to the upper left. Its leftmost point is the minimum-variance portfolio. The upper branch above that point is the efficient frontier, drawn in green. The lower branch below that point is inefficient. Two red dots to the right of the curve are dominated: a frontier portfolio gives more return for the same risk.</desc>
<line x1="70" y1="300" x2="70" y2="36" stroke="#888780" stroke-width="1.5"/>
<line x1="70" y1="300" x2="640" y2="300" stroke="#888780" stroke-width="1.5"/>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="70" y="26" text-anchor="start">Expected return</text>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="355" y="350" text-anchor="middle">Risk (SD)</text>
<polyline points="260,204 261.1,210 264.5,216 269.9,222 277.3,228 286.4,234 297.1,240 309.1,246 322.2,252 336.3,258 351.2,264 366.8,270 383,276" fill="none" stroke="#888780" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="6 4"/>
<polyline points="260,204 261.1,198 264.5,192 269.9,186 277.3,180 286.4,174 297.1,168 309.1,162 322.2,156 336.3,150 351.2,144 366.8,138 383,132 399.7,126 416.8,120 434.4,114 452.2,108 470.3,102 488.7,96 507.2,90 526,84 544.9,78 564,72 583.2,66 602.5,60" fill="none" stroke="#3B6D11" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="260" cy="204" r="6" fill="#639922" stroke="#3B6D11" stroke-width="2"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="248" y="208" text-anchor="end">Minimum variance</text>
<circle cx="450" cy="132" r="5" fill="#E24B4A" stroke="#A32D2D" stroke-width="2"/>
<circle cx="526" cy="180" r="5" fill="#E24B4A" stroke="#A32D2D" stroke-width="2"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="460" y="136" text-anchor="start">Dominated</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="536" y="184" text-anchor="start">Dominated</text>
<line x1="450" y1="126" x2="450" y2="112.7" stroke="#A32D2D" stroke-width="1" stroke-dasharray="4 3"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="460" y="154" text-anchor="start">same risk, more return on the curve</text>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="493.2" y="82" text-anchor="end">Efficient frontier</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="395" y="280" text-anchor="start">Inefficient lower edge</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="355" y="366" text-anchor="middle">Illustrative shape. All portfolios lie on or to the right of the curve.</text>
</svg>

## The optimal portfolio

The investor's **indifference curves** (combinations of risk and return giving equal satisfaction) slope upward and are steeper for more risk-averse investors. The **optimal portfolio** is where the highest attainable indifference curve **touches** the efficient frontier. A conservative investor's tangency is near the minimum-variance end; an aggressive investor's is further up the frontier.

(Extension, textbook: once a risk-free asset is added, the best line from Rf touches the frontier at the market portfolio. That line is the Capital Market Line, and it leads to CAPM.)

## Limitations of Markowitz

- Needs a huge number of inputs: n returns, n variances and n(n−1)/2 covariances. For 100 stocks that is 4,950 covariances. (Sharpe's index model, PM-4, fixes this.)
- Relies on historical estimates that may not hold.
- Assumes normal returns and rational investors; real markets show fat tails and behavioural biases.
- Ignores transaction costs and taxes.
- Single period only.

## What to remember

- Total risk = systematic + unsystematic. Only unsystematic can be diversified away.
- Lower correlation means more risk reduction; at ρ = −1, risk can reach zero.
- 50:50 A/B table: 16.00, 14.00, 11.66, 8.72, 4.00% for ρ = +1, 0.5, 0, −0.5, −1.
- Markowitz: risk-averse investors, mean-variance, covariance matters, efficient frontier.
- Optimal portfolio = tangency of the highest indifference curve with the frontier.
- Main limitation: n(n−1)/2 covariances, which Sharpe's index model solves.

## Concept map

```mermaid
graph TD
    T["TOTAL RISK"] --> S["Systematic<br/>market, not diversifiable"]
    T --> U["Unsystematic<br/>company, diversifiable"]
    U --> D["Diversification<br/>works through low ρ"]
    D --> M["Markowitz 1952<br/>mean-variance"]
    M --> A["Assumptions<br/>risk-averse, mean-variance,<br/>single period, perfect market"]
    M --> F["Efficient frontier<br/>upper-left edge"]
    F --> O["Optimal portfolio<br/>tangency with<br/>indifference curve"]
    M --> L["Limitation:<br/>n(n−1)/2 covariances"]
    L --> SIM["PM-4 Sharpe index model"]
    S --> CAPM["PM-3 CAPM: only beta is rewarded"]
```

## Flashcards
Q: Which risk can diversification remove, and which can it not?
A: It removes unsystematic (company-specific) risk; systematic (market) risk remains.

Q: What happens to portfolio risk as correlation falls?
A: It falls; at ρ = −1 it can be reduced to zero with the right weights.

Q: Zero-risk weight in A when ρ = −1?
A: w_A = σ_B ÷ (σ_A + σ_B).

Q: Name four assumptions of Markowitz's theory.
A: Risk-averse rational investors; decisions on mean and variance only; single period; perfect markets with no taxes or costs (also normal returns).

Q: What is the efficient frontier?
A: The upper-left edge of all possible portfolios: the highest return for each level of risk.

Q: How is the optimal portfolio chosen?
A: Where the investor's highest attainable indifference curve is tangent to the efficient frontier.

Q: What is the dominance rule?
A: X dominates Y if it gives more return for the same risk, or less risk for the same return.

Q: Biggest practical limitation of Markowitz?
A: The number of inputs: n(n−1)/2 covariances, 4,950 for 100 stocks.

## Sources
- BBA301F-5 course plan, Unit 5 (Modern Portfolio Theory, efficient frontier, optimal equity portfolio)
- Markowitz, H. (1952), "Portfolio Selection", *Journal of Finance*
- Previous: [[SAPM Unit 5 - PM-1 Portfolio Return and Risk]] · Next: [[SAPM Unit 5 - PM-3 CAPM and Beta]]
- [[SAPM Unit 5 - Portfolio Management MOC (Node Map)]]
