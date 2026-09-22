---
title: "Unit 2 — SAPM Cheat Sheet"
type: recall
status: active
created: 2026-08-04
source: claude-session
tags: [sapm, recall, unit-2, cheatsheet, fundamental-analysis]
---

# Unit 2 — SAPM Cheat Sheet

One page. Formulas, frameworks, and traps for the CIA 2 case study. Everything here is meant to be
held in short-term memory walking into the exam.

Reasoning behind any of these: [[Units 2-3 - How Security Analysis Actually Works]].

---

## EIC framework

| Level | What's assessed | Key signals |
|---|---|---|
| **Economy** | Macro environment | GDP growth, inflation, interest rates, fiscal/monetary policy |
| **Industry** | Competitive context | Life cycle stage, entry barriers, rivalry, regulatory environment |
| **Company** | The investment target | Management, moat, financials, valuation |

Top-down: macro conditions set the ceiling, industry sets the context, company selection happens last.

## Industry life cycle

| Stage | Growth | Competition | Investment implication |
|---|---|---|---|
| **Introduction** | Low, uncertain | Few players, high entry cost | High risk, speculative |
| **Growth** | Rapid | Increasing entrants, expanding market | Best risk-reward window |
| **Maturity** | Slowing | Intense, consolidated | Stable returns, dividend plays |
| **Decline** | Negative | Exits, shrinking demand | Avoid or short unless turnaround thesis |

## Financial ratios

| Category | Ratio | Formula | What it tells you |
|---|---|---|---|
| Liquidity | **Current Ratio** | Current Assets / Current Liabilities | Short-term solvency, cushion for obligations |
| Liquidity | **Quick Ratio** | (Current Assets − Inventory) / Current Liabilities | Solvency excluding illiquid inventory |
| Profitability | **ROE** | Net Income / Shareholders' Equity | Return generated on owners' capital |
| Profitability | **ROA** | Net Income / Total Assets | Return generated on total asset base |
| Profitability | **Net Profit Margin** | Net Income / Revenue × 100 | Bottom-line profitability per rupee of sales |
| Profitability | **Operating Margin** | Operating Income / Revenue × 100 | Core operating profitability, pre-financing/tax |
| Profitability | **EPS** | Net Income / Shares Outstanding | Earnings attributable per share |
| Valuation | **P/E** | Market Price per Share / EPS | Price paid per rupee of earnings |
| Valuation | **P/B** | Market Price per Share / Book Value per Share | Price paid per rupee of net asset value |
| Valuation | **P/S** | Market Cap / Total Revenue | Price paid per rupee of revenue |
| Valuation | **Dividend Yield** | Annual Dividend per Share / Market Price × 100 | Cash return relative to price paid |
| Leverage | **Debt-to-Equity** | Total Debt / Shareholders' Equity | Reliance on borrowed capital |
| Leverage | **Interest Coverage** | EBIT / Interest Expense | Ability to service debt from operating earnings |
| Efficiency | **Asset Turnover** | Revenue / Total Assets | How efficiently assets generate sales |
| Efficiency | **Inventory Turnover** | COGS / Average Inventory | How fast inventory is sold and replaced |

## Du Pont decomposition

```
ROE = Net Profit Margin  ×  Asset Turnover  ×  Equity Multiplier
    = (Net Income/Revenue) × (Revenue/Total Assets) × (Total Assets/Equity)
```

Breaks ROE into three drivers: how much profit per sale, how efficiently assets generate sales, how much leverage is used. A high ROE from a high equity multiplier is debt-driven, not operationally earned.

## Financial statements — what to read off each

| Statement | Key line items | What an analyst reads |
|---|---|---|
| **P&L** | Revenue, COGS, Operating Income, Net Income | Profitability trajectory, margin trends |
| **Balance Sheet** | Current Assets/Liabilities, Total Debt, Equity | Solvency, capital structure, asset base |
| **Cash Flow** | Operating CF, Investing CF, Financing CF | Earnings quality (CF vs reported profit), capex intensity |

**Earnings quality check**: if net income grows but operating cash flow does not, profits may be accrual-driven rather than cash-backed. Flag the divergence.

## Margin of safety

```
Margin of Safety % = (Intrinsic Value − Market Price) / Intrinsic Value × 100
```

Buy only when market price sits well below your estimate of intrinsic value — the gap is your buffer against being wrong.

---

## The formulas

```
RATIO FORMULAS

Liquidity
  Current Ratio        = Current Assets / Current Liabilities
  Quick Ratio          = (Current Assets − Inventory) / Current Liabilities

Profitability
  EPS                  = Net Income / Shares Outstanding
  ROE                  = Net Income / Shareholders' Equity
  ROA                  = Net Income / Total Assets
  Net Profit Margin    = Net Income / Revenue × 100
  Operating Margin     = Operating Income / Revenue × 100

Valuation
  P/E Ratio            = Market Price per Share / EPS
  P/B Ratio            = Market Price per Share / Book Value per Share
  P/S Ratio            = Market Cap / Total Revenue
  Dividend Yield       = Annual Dividend per Share / Market Price × 100

Leverage
  Debt-to-Equity       = Total Debt / Shareholders' Equity
  Interest Coverage    = EBIT / Interest Expense

Efficiency
  Asset Turnover       = Revenue / Total Assets
  Inventory Turnover   = COGS / Average Inventory

Du Pont
  ROE                  = (Net Income / Revenue) × (Revenue / Total Assets) × (Total Assets / Equity)
```

```
MARGIN OF SAFETY

  Margin of Safety %   = (Intrinsic Value − Market Price) / Intrinsic Value × 100
  Decision rule        = Buy when margin is positive and large enough to absorb valuation error
```

## Case-study answer checklist

1. Read the case. What is being asked — valuation, financial health, or investment recommendation?
2. Place the company in EIC context (macro conditions → industry position → company specifics).
3. Identify which ratios are relevant to the question. Don't compute all 15 — pick the ones that answer what's being asked.
4. Compute the ratios. Show workings.
5. Benchmark every ratio against industry average, historical trend, or a stated threshold. A ratio without a benchmark is a number, not an answer.
6. Check earnings quality: does operating cash flow support reported net income?
7. If valuation is asked, estimate intrinsic value and compute margin of safety.
8. State a clear recommendation with reasoning. The rubric rewards this explicitly.

## Seven traps

0. **A ratio without a benchmark is just a number.** P/E of 18 means nothing unless you say "vs. industry average of 22" or "vs. its own 5-year average of 15." Always state the comparison.
1. **High ROE can be a leverage artifact.** Du Pont decomposition: ROE = Margin x Turnover x Equity Multiplier. A company can show high ROE by loading debt (high equity multiplier), not by being efficient. Check D/E alongside ROE.
2. **High current ratio is not always good.** It can mean idle cash, bloated inventory, or poor working capital management. Context matters — compare to industry norms.
3. **P/E is meaningless for loss-making companies.** If EPS is negative, P/E is negative or undefined. Use P/B or P/S instead. Don't compute a P/E and present it as if it means something when earnings are negative.
4. **Net income without cash flow is suspicious.** If profit grows but operating CF does not, the company may be booking revenue it hasn't collected or deferring costs. Always cross-check the cash flow statement.
5. **Industry context changes what "good" means.** A D/E of 2 is alarming for an FMCG company, normal for a bank. An asset turnover of 0.3 is fine for a capital-heavy utility, terrible for a retailer. State the industry norm.
6. **Margin of safety requires an intrinsic value estimate first.** You cannot compute a margin of safety from market price alone. If the question doesn't give you enough data to estimate intrinsic value, say so rather than inventing a number.

## Links
- [[Units 2-3 - How Security Analysis Actually Works]]
- [[SAPM MOC]]
- [[Home]]
