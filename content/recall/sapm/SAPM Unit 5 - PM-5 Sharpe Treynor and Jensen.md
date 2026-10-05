---
title: "SAPM Unit 5 - PM-5 Sharpe Treynor and Jensen"
type: recall
status: active
created: 2026-10-05
source: "BBA301F-5 course plan Unit 5; textbook method (Fischer & Jordan, Reilly & Brown, Madhumati)"
tags: [sapm, recall, unit-5, portfolio-evaluation, sharpe, treynor, jensen]
node: PM-5
section: "5.5"
minutes: 45
deps: [PM-3]
weight: 45
exam_focus: true
state: unstudied
---

# PM-5: Sharpe, Treynor and Jensen

Covers: why portfolio evaluation needs risk-adjusted measures, the Sharpe ratio, the Treynor ratio, Jensen's alpha, how to rank funds, why the rankings can disagree, and which measure to use when. **(syllabus)**

## Where this fits in the ESE

This is the most likely 15-mark case in SAPM: three or four mutual funds with return, SD and beta, "rank them on Sharpe, Treynor and Jensen and advise". It also makes a 5-mark sum (one ratio) or a 10-mark "compare the three measures". CO5 is evaluation, and the ESE carries marks for it.

## Why raw return is not enough

A fund that earned 17% with SD 25% may be worse than one that earned 13% with SD 12%. Evaluation must ask **return per unit of risk taken**, and against what benchmark. Each measure picks a different risk.

## The three measures

| Measure | Formula | Risk used | Read as |
|---|---|---|---|
| **Sharpe ratio** | (R_p − R_f) ÷ σ_p | Total risk (SD) | Excess return per unit of total risk |
| **Treynor ratio** | (R_p − R_f) ÷ β_p | Systematic risk (beta) | Excess return per unit of market risk |
| **Jensen's alpha** | α = R_p − [R_f + β_p(R_m − R_f)] | Systematic risk via CAPM | Return above what CAPM says the beta deserved |

- Higher Sharpe and Treynor are better. Compare each fund with the **market's** ratio: beating it means the fund outperformed.
- Market Sharpe = (R_m − R_f) ÷ σ_m. Market Treynor = R_m − R_f (since β_m = 1).
- Positive alpha = superior performance (manager skill or luck); negative = underperformed CAPM.

## Which measure when

- **Sharpe** when the fund is the investor's **whole** portfolio (or a large part): total risk matters because nothing else diversifies it.
- **Treynor and Jensen** when the fund is **one of many** holdings in a well-diversified portfolio: only its beta adds to the investor's risk.
- If a fund is poorly diversified, Sharpe ranks it lower than Treynor does (its σ includes unsystematic risk that beta ignores). **That is why the rankings can disagree.**

## Worked example: the classic case, laid out as the exam answer

**Question (illustrative):** R_f = 6%. Market: return 12%, σ 14%, β 1. Evaluate three funds.

| Fund | Return | σ | β |
|---|---|---|---|
| X | 15% | 18% | 1.1 |
| Y | 13% | 12% | 0.9 |
| Z | 17% | 25% | 1.4 |

**1. Sharpe ratio**
- X = (15 − 6) ÷ 18 = **0.500**
- Y = (13 − 6) ÷ 12 = **0.583**
- Z = (17 − 6) ÷ 25 = **0.440**
- Market = (12 − 6) ÷ 14 = **0.429**
Rank: Y, X, Z. All beat the market.

**2. Treynor ratio** (in %)
- X = 9 ÷ 1.1 = **8.18**
- Y = 7 ÷ 0.9 = **7.78**
- Z = 11 ÷ 1.4 = **7.86**
- Market = 6 ÷ 1 = **6.00**
Rank: X, Z, Y. All beat the market.

**3. Jensen's alpha**
- X: CAPM return = 6 + 1.1 × 6 = 12.6; α = 15 − 12.6 = **+2.4%**
- Y: 6 + 0.9 × 6 = 11.4; α = 13 − 11.4 = **+1.6%**
- Z: 6 + 1.4 × 6 = 14.4; α = 17 − 14.4 = **+2.6%**
Rank: Z, X, Y.

**4. Summary table**

| Fund | Sharpe | Rank | Treynor | Rank | Jensen | Rank |
|---|---|---|---|---|---|---|
| X | 0.500 | 2 | 8.18 | 1 | 2.4 | 2 |
| Y | 0.583 | 1 | 7.78 | 3 | 1.6 | 3 |
| Z | 0.440 | 3 | 7.86 | 2 | 2.6 | 1 |
| Market | 0.429 | | 6.00 | | 0 | |

**5. Interpretation and advice**
- All three funds beat the market on every measure.
- **Y is best on Sharpe** but last on Treynor and Jensen: its low SD makes it the best stand-alone holding; its beta-adjusted excess return is the smallest.
- **Z is last on Sharpe** but first on Jensen: it earns the largest absolute alpha, but its SD (25%) is far above what its beta implies, so it carries a lot of unsystematic risk.
- **X is consistently near the top** (2, 1, 2).
- **Advice:** an investor putting all their money in one fund should pick **Y** (Sharpe). An investor adding one fund to an already diversified portfolio should pick **X** (best Treynor, good alpha). Z suits only an investor who can diversify away its residual risk and wants the highest alpha.

*Closing line:* the ranking depends on which risk is relevant to the investor; state it before you advise.

## Other measures (one line each, for a 10-mark answer)

- **M² (Modigliani-Modigliani)**: Sharpe ratio rescaled to the market's SD, in % return: M² = R_f + Sharpe_p × σ_m − R_m. Same ranking as Sharpe, easier to explain.
- **Information ratio**: (R_p − R_benchmark) ÷ tracking error. Measures active managers against their benchmark.
- **Fama's decomposition**: splits return into reward for risk and reward for selectivity.

## Traps

- **Dividing by β for Sharpe or by σ for Treynor.** Sharpe uses σ; Treynor uses β.
- **Forgetting to subtract R_f** in the numerator.
- **Using R_m instead of (R_m − R_f)** in Jensen's CAPM line.
- **Ranking without the market benchmark.** Always compute the market's Sharpe and Treynor; "beat the market" is a scored line.
- **Not explaining rank differences.** Disagreement is the examiner's point; explain it with diversification.

## What to remember

- Sharpe = (R_p − R_f)/σ_p; Treynor = (R_p − R_f)/β_p; α = R_p − [R_f + β(R_m − R_f)].
- Sharpe for the whole portfolio, Treynor/Jensen for one part of a diversified portfolio.
- Rankings differ when a fund is poorly diversified.
- Example: Sharpe Y > X > Z; Treynor X > Z > Y; Jensen Z > X > Y; market Sharpe 0.429, Treynor 6.

## Concept map

```mermaid
graph TD
    E["PORTFOLIO EVALUATION"] --> S["Sharpe<br/>(Rp − Rf) / σp<br/>total risk"]
    E --> T["Treynor<br/>(Rp − Rf) / βp<br/>market risk"]
    E --> J["Jensen's alpha<br/>Rp − CAPM return"]
    S --> W["Use for a whole portfolio"]
    T --> D["Use for one part of a<br/>diversified portfolio"]
    J --> D
    S --> X["Rankings differ when a fund<br/>carries unsystematic risk"]
    T --> X
```

## Flashcards
Q: Formula for the Sharpe ratio?
A: (R_p − R_f) ÷ σ_p.

Q: Formula for the Treynor ratio?
A: (R_p − R_f) ÷ β_p.

Q: Formula for Jensen's alpha?
A: α = R_p − [R_f + β_p(R_m − R_f)].

Q: When should you prefer Sharpe over Treynor?
A: When the fund is the investor's whole portfolio, so total risk matters.

Q: Why can Sharpe and Treynor rank funds differently?
A: A poorly diversified fund has high σ relative to its β; Sharpe penalises that unsystematic risk, Treynor ignores it.

Q: Fund return 15%, β 1.1, R_f 6%, R_m 12%. Jensen's alpha?
A: 15 − (6 + 1.1 × 6) = +2.4%.

Q: What is the market's Treynor ratio?
A: R_m − R_f, because the market's beta is 1.

Q: What does a negative alpha mean?
A: The fund earned less than CAPM required for its beta: it underperformed.

## Sources
- BBA301F-5 course plan, Unit 5 (equity portfolio evaluation: Sharpe, Treynor, Jensen)
- Sharpe (1966), Treynor (1965), Jensen (1968); Reilly & Brown ch. on performance evaluation
- Previous: [[SAPM Unit 5 - PM-4 Sharpe Single Index Model]] · Next: [[SAPM Unit 5 - PM-6 Active and Passive Strategies]]
- [[SAPM Unit 5 - Portfolio Management MOC (Node Map)]]
