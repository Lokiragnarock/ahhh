---
title: "SAPM Unit 1 - EI-3 Single Security Return and Risk"
type: recall
status: active
created: 2026-10-05
source: "BBA301F-5 course plan Unit 1; textbook method (Fischer & Jordan; Reilly & Brown; Madhumati)"
tags: [sapm, recall, unit-1, return, risk, hpr, standard-deviation, covariance, correlation]
node: EI-3
section: "1.3"
minutes: 45
deps: [EI-2]
weight: 45
exam_focus: true
state: unstudied
---

# EI-3: Risk-Return Analysis for a Single Security

Covers: holding period return, total return (income + capital gain), annualising returns, average return, variance and standard deviation from historical data, the coefficient of variation, and covariance and correlation between two securities. **(syllabus)**

## Where this fits in the ESE

The numerical core of Unit 1: a 5-mark HPR or SD sum, or a 10-mark "compute return, SD, covariance and correlation for two stocks and advise". The same tables reappear in Unit 5 (PM-1) for portfolios.

## Return

**Holding period return (HPR)** = (P₁ − P₀ + D) ÷ P₀
= dividend yield + capital gain yield = D/P₀ + (P₁ − P₀)/P₀.

**Total return** is the same idea: income (dividends) + capital gain (or loss), as a % of the price paid.

*Example:* buy at ₹250, receive a dividend of ₹8, sell at ₹280.
HPR = (280 − 250 + 8) ÷ 250 = 38 ÷ 250 = **15.2%** (dividend yield 3.2% + capital gain 12%).

**Annualising:** if the 15.2% was earned over 2 years, annual return = (1.152)^(1/2) − 1 = **7.33%** a year (compound), not 7.6%.

**Average (mean) return** from historical returns: R̄ = ΣR ÷ n (arithmetic mean).

## Risk: variance and standard deviation

From historical returns:
- **Variance σ² = Σ(R − R̄)² ÷ n** (use n − 1 for a sample if the question says so)
- **Standard deviation σ = √σ²**

From probabilities (expected scenarios): E(R) = ΣpR; σ² = Σp(R − E(R))² (see PM-1).

**Coefficient of variation (CV) = σ ÷ R̄**: risk per unit of return. Use it to compare stocks with different average returns: lower CV is better.

## Covariance and correlation (two securities)

- **Covariance = Σ(R_A − R̄_A)(R_B − R̄_B) ÷ n**: positive if the two move together, negative if opposite.
- **Correlation ρ = Cov ÷ (σ_A × σ_B)**, between −1 and +1: the strength of co-movement, unit-free.
  - +1: perfect positive; 0: no linear relation; −1: perfect negative.

## Worked example, laid out as the exam answer

**Question (illustrative):** annual returns over five years:

| Year | Stock A | Stock B |
|---|---|---|
| 1 | 12% | 8% |
| 2 | −4% | 2% |
| 3 | 18% | 12% |
| 4 | 10% | 6% |
| 5 | 14% | 12% |

Compute the mean, SD, CV, covariance and correlation, and advise a risk-averse investor.

1. **Means:** R̄_A = 50 ÷ 5 = **10%**; R̄_B = 40 ÷ 5 = **8%**.
2. **Deviations:**

| Year | d_A | d_B | d_A² | d_B² | d_A × d_B |
|---|---|---|---|---|---|
| 1 | 2 | 0 | 4 | 0 | 0 |
| 2 | −14 | −6 | 196 | 36 | 84 |
| 3 | 8 | 4 | 64 | 16 | 32 |
| 4 | 0 | −2 | 0 | 4 | 0 |
| 5 | 4 | 4 | 16 | 16 | 16 |
| **Total** | | | **280** | **72** | **132** |

3. **Variance and SD (÷ n):** σ²_A = 280 ÷ 5 = 56, **σ_A = 7.48%**; σ²_B = 72 ÷ 5 = 14.4, **σ_B = 3.79%**. (With n − 1: 8.37% and 4.24%.)
4. **CV:** A = 7.48 ÷ 10 = **0.75**; B = 3.79 ÷ 8 = **0.47**.
5. **Covariance** = 132 ÷ 5 = **26.4**; **correlation** = 26.4 ÷ (7.48 × 3.79) = **0.93**.

<svg width="100%" style="max-width:680px;display:block;margin:12px auto" viewBox="0 0 680 280" role="img" xmlns="http://www.w3.org/2000/svg">
<title>Stock A and Stock B annual returns with means</title>
<desc>Annual returns for five years. Stock A swings between minus 4 and 18 percent around its 10 percent mean, standard deviation 7.48. Stock B stays between 2 and 12 percent around its 8 percent mean, standard deviation 3.79.</desc>
<line x1="80" y1="30" x2="80" y2="220" stroke="#888780" stroke-width="1"/>
<line x1="80" y1="182.0" x2="600" y2="182.0" stroke="#888780" stroke-width="1"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="74" y="186.0" text-anchor="end">0%</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="74" y="110.0" text-anchor="end">10%</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="74" y="34.0" text-anchor="end">20%</text>
<line x1="80" y1="106.0" x2="600" y2="106.0" stroke="#1D9E75" stroke-width="1.5" stroke-dasharray="6 4"/>
<line x1="80" y1="121.2" x2="600" y2="121.2" stroke="#7F77DD" stroke-width="1.5" stroke-dasharray="6 4"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="606" y="105.0" text-anchor="start">A mean 10%</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="606" y="131.2" text-anchor="start">B mean 8%</text>
<polyline points="120,90.8 235,212.4 350,45.2 465,106.0 580,75.6" fill="none" stroke="#1D9E75" stroke-width="2" stroke-linejoin="round"/>
<polyline points="120,121.2 235,166.8 350,90.8 465,136.4 580,90.8" fill="none" stroke="#7F77DD" stroke-width="2" stroke-linejoin="round"/>
<circle cx="120" cy="90.8" r="4" fill="#1D9E75" stroke="#1D9E75" stroke-width="1"/>
<circle cx="120" cy="121.2" r="4" fill="#7F77DD" stroke="#7F77DD" stroke-width="1"/>
<circle cx="235" cy="212.4" r="4" fill="#1D9E75" stroke="#1D9E75" stroke-width="1"/>
<circle cx="235" cy="166.8" r="4" fill="#7F77DD" stroke="#7F77DD" stroke-width="1"/>
<circle cx="350" cy="45.2" r="4" fill="#1D9E75" stroke="#1D9E75" stroke-width="1"/>
<circle cx="350" cy="90.8" r="4" fill="#7F77DD" stroke="#7F77DD" stroke-width="1"/>
<circle cx="465" cy="106.0" r="4" fill="#1D9E75" stroke="#1D9E75" stroke-width="1"/>
<circle cx="465" cy="136.4" r="4" fill="#7F77DD" stroke="#7F77DD" stroke-width="1"/>
<circle cx="580" cy="75.6" r="4" fill="#1D9E75" stroke="#1D9E75" stroke-width="1"/>
<circle cx="580" cy="90.8" r="4" fill="#7F77DD" stroke="#7F77DD" stroke-width="1"/>
<text font-size="12" font-weight="500" fill="currentColor" font-family="inherit" x="120" y="242" text-anchor="middle">Year 1</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="120" y="260" text-anchor="middle">A 12   B 8</text>
<text font-size="12" font-weight="500" fill="currentColor" font-family="inherit" x="235" y="242" text-anchor="middle">Year 2</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="235" y="260" text-anchor="middle">A -4   B 2</text>
<text font-size="12" font-weight="500" fill="currentColor" font-family="inherit" x="350" y="242" text-anchor="middle">Year 3</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="350" y="260" text-anchor="middle">A 18   B 12</text>
<text font-size="12" font-weight="500" fill="currentColor" font-family="inherit" x="465" y="242" text-anchor="middle">Year 4</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="465" y="260" text-anchor="middle">A 10   B 6</text>
<text font-size="12" font-weight="500" fill="currentColor" font-family="inherit" x="580" y="242" text-anchor="middle">Year 5</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="580" y="260" text-anchor="middle">A 14   B 12</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="40" y="20" text-anchor="start">Annual return (%)</text>
<line x1="200" y1="16" x2="220" y2="16" stroke="#1D9E75" stroke-width="2"/>
<text font-size="12" fill="currentColor" font-family="inherit" x="226" y="20" text-anchor="start">Stock A (SD 7.48%)</text>
<line x1="356" y1="16" x2="376" y2="16" stroke="#7F77DD" stroke-width="2"/>
<text font-size="12" fill="currentColor" font-family="inherit" x="382" y="20" text-anchor="start">Stock B (SD 3.79%)</text>
</svg>

**Interpretation and advice:** A offers a higher average return (10% vs 8%) but much higher risk; per unit of return, B is less risky (CV 0.47 vs 0.75), so a **risk-averse investor should prefer B**. The correlation of 0.93 means the two move almost together, so combining them would give little diversification benefit (PM-2).

<svg width="100%" style="max-width:680px;display:block;margin:12px auto" viewBox="0 0 680 275" role="img" xmlns="http://www.w3.org/2000/svg">
<title>Stock A against Stock B returns, correlation 0.93</title>
<desc>Scatter of the five yearly return pairs, with Stock A return on the horizontal axis and Stock B on the vertical axis. Dashed lines mark the means 10 and 8. The points rise from lower left to upper right along a line, matching a correlation of 0.93 and covariance of 26.4.</desc>
<line x1="90" y1="220" x2="420" y2="220" stroke="#888780" stroke-width="1"/>
<line x1="90" y1="40" x2="90" y2="220" stroke="#888780" stroke-width="1"/>
<line x1="293.1" y1="40" x2="293.1" y2="220" stroke="#888780" stroke-width="1" stroke-dasharray="6 4"/>
<line x1="90" y1="117.1" x2="420" y2="117.1" stroke="#888780" stroke-width="1" stroke-dasharray="6 4"/>
<line x1="90" y1="214.1" x2="420" y2="56.6" stroke="#3B6D11" stroke-width="2" stroke-dasharray="6 4"/>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="166.2" y="238" text-anchor="middle">0</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="293.1" y="238" text-anchor="middle">10</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="420.0" y="238" text-anchor="middle">20</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="84" y="224.0" text-anchor="end">0</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="84" y="121.1" text-anchor="end">8</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="84" y="69.7" text-anchor="end">12</text>
<circle cx="318.5" cy="117.1" r="5" fill="#888780" stroke="#5F5E5A" stroke-width="1"/>
<circle cx="115.4" cy="194.3" r="5" fill="#888780" stroke="#5F5E5A" stroke-width="1"/>
<circle cx="394.6" cy="65.7" r="5" fill="#888780" stroke="#5F5E5A" stroke-width="1"/>
<circle cx="293.1" cy="142.9" r="5" fill="#888780" stroke="#5F5E5A" stroke-width="1"/>
<circle cx="343.8" cy="65.7" r="5" fill="#888780" stroke="#5F5E5A" stroke-width="1"/>
<text font-size="12" font-weight="500" fill="currentColor" font-family="inherit" x="326.5" y="111.1" text-anchor="start">Y1</text>
<text font-size="12" font-weight="500" fill="currentColor" font-family="inherit" x="123.4" y="188.3" text-anchor="start">Y2</text>
<text font-size="12" font-weight="500" fill="currentColor" font-family="inherit" x="402.6" y="59.7" text-anchor="start">Y3</text>
<text font-size="12" font-weight="500" fill="currentColor" font-family="inherit" x="301.1" y="147.9" text-anchor="start">Y4</text>
<text font-size="12" font-weight="500" fill="currentColor" font-family="inherit" x="351.8" y="59.7" text-anchor="start">Y5</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="90" y="24" text-anchor="start">Stock B return (%)</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="297.1" y="36" text-anchor="start">mean A 10</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="96" y="112.1" text-anchor="start">mean B 8</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="255" y="258" text-anchor="middle">Stock A return (%)</text>
<text font-size="14" font-weight="500" fill="currentColor" font-family="inherit" x="450" y="80" text-anchor="start">Correlation ρ = 0.93</text>
<text font-size="12" fill="currentColor" font-family="inherit" x="450" y="104" text-anchor="start">Covariance = 26.4</text>
<text font-size="12" fill="currentColor" font-family="inherit" x="450" y="124" text-anchor="start">26.4 ÷ (7.48 × 3.79) = 0.93</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="450" y="150" text-anchor="start">Points hug a rising line:</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="450" y="168" text-anchor="start">A and B move almost together,</text>
<text font-size="12" fill="currentColor" opacity="0.7" font-family="inherit" x="450" y="186" text-anchor="start">so little diversification.</text>
</svg>

## Traps

- **Leaving out the dividend** in HPR.
- **Simple-dividing a multi-year return** instead of compounding.
- **Mixing n and n − 1**: state which you use.
- **Comparing SDs of stocks with different means** without CV.
- **Correlation outside −1 to +1** = arithmetic error.

## What to remember

- HPR = (P₁ − P₀ + D)/P₀: ₹250 → ₹280 with ₹8 dividend = 15.2%; over 2 years = 7.33% a year.
- σ = √[Σ(R − R̄)²/n]; CV = σ/R̄.
- Cov = Σd_A d_B/n; ρ = Cov/(σ_Aσ_B).
- Example: A 10% / 7.48% (CV 0.75); B 8% / 3.79% (CV 0.47); Cov 26.4; ρ 0.93.

## Concept map

```mermaid
graph TD
    R["RETURN"] --> H["HPR = (P1 − P0 + D)/P0"]
    H --> Y["Dividend yield + capital gain"]
    R --> AN["Annualise by compounding"]
    R --> M["Mean return"]
    K["RISK"] --> V["Variance Σ(R − R̄)²/n"]
    V --> SD["SD = √variance"]
    SD --> CV["CV = σ / mean"]
    K --> CO["Covariance and correlation<br/>between two stocks"]
    CO --> PM["Unit 5: portfolio risk"]
```

## Flashcards
Q: Formula for holding period return?
A: (P₁ − P₀ + D) ÷ P₀.

Q: Buy ₹250, dividend ₹8, sell ₹280. HPR?
A: 15.2%.

Q: A 15.2% return over two years. Annual compound return?
A: (1.152)^(1/2) − 1 = 7.33%.

Q: Formula for standard deviation from historical returns?
A: √[Σ(R − R̄)² ÷ n] (or n − 1 for a sample).

Q: What does the coefficient of variation measure?
A: Risk per unit of return: σ ÷ mean return.

Q: Formula for the correlation coefficient?
A: Covariance ÷ (σ_A × σ_B).

Q: What does a correlation of 0.93 between two stocks imply for diversification?
A: They move almost together, so combining them reduces risk very little.

## Sources
- BBA301F-5 course plan, Unit 1 (risk-return analysis for a single security: HPR, total return, SD, variance, correlation, covariance)
- Fischer & Jordan; Reilly & Brown
- Previous: [[SAPM Unit 1 - EI-2 Types of Risk in Equity Investment]] · Next: [[SAPM Unit 1 - EI-4 Regulatory Framework and Indian Investors]]
- [[SAPM Unit 1 - Equity Investments MOC (Node Map)]]
