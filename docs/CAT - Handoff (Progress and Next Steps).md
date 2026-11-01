---
title: "CAT - Handoff (Progress and Next Steps)"
type: handoff
status: active
created: 2026-11-01
tags: [cat, handoff]
---

# CAT track: progress and handoff (1 November 2026)

**For the next session:** read this note first, then `docs/cat-plan.md` and `content/recall`-style node maps once they exist. Repo `Lokiragnarock/ahhh`, branch `claude/keen-goodall-pfcpky` (not merged to `main`).

Branch: `claude/keen-goodall-pfcpky`. Target exam: **CAT 2027**. Plan, format and node map: `docs/cat-plan.md` (node map still waiting for Lokesh's go or edits).

## Done

- **Question bank:** `content/question-bank/cat/` has 1,830 real CAT questions (2017 to 2025, all 24 slots, all sections) plus 68 figures, scraped from 2IIM's free pages. Format, counts and licence are in that folder's README.
- **Scraper:** `scripts/scrape-cat-2iim.py PAGES_DIR content/question-bank/cat --fetch-images` rebuilds the raw bank from saved 2IIM pages.
- **Fixes:** `scripts/fix-cat-bank.py content/question-bank/cat [--cracku DIR]` is re-runnable. It:
  - repaired 164 broken maths fields (2IIM's lost MathJax delimiters);
  - added `answer_value` to every TITA (units stripped);
  - turned CAT 2024 slot 1 VARC Q3 back into a TITA (odd sentence out, answer 1);
  - flagged the fruit-seller question in 2023 slot 3 QA as `duplicate_of` the 2024 slot 2 copy.
- **Repo visibility:** the repo `Lokiragnarock/ahhh` is **public**, and the bank was pushed at Lokesh's request. Lokesh is switching it to private.

## In progress: answer-key cross-check against Cracku

- `scripts/fetch-cracku-cat.sh WORKDIR` downloads Cracku's 72 section pages and about 1,799 question pages, one request a second; Cracku answers in about 3 seconds a page. WORKDIR must first hold `index.html` from https://cracku.in/cat-previous-papers/. The script skips pages already saved, so it can resume.
- **Partial run (561 of 1,799 pages):** 490 match, 12 flagged, 1,328 not yet checked (shown as `"result": "not found"`). Each question carries `verified` and `verification` (Cracku URL and Cracku's answer).
- **The 12 flagged are almost all false alarms:**
  - Cosmetic differences: typos ("hanger" vs "anchor", "individualsto"), units ("8" vs "8 sq. units"), digit grouping ("1,21,000" vs "121000") and maths formatting. These are 2017 s1 QA-15, VARC-01, VARC-15 and VARC-31; 2018 s1 QA-15 and VARC-16; 2019 s2 QA-01.
  - Probably swapped pairings by the matcher: 2017 s2 DILR-03/04 and 2018 s2 DILR-17/19.
  - One empty Cracku answer: 2017 s1 DILR-17.

## Next steps

1. Finish the Cracku download: fetch `index.html`, then run `scripts/fetch-cracku-cat.sh WORKDIR`. It takes about 1.5 hours from scratch, because the scratchpad copy dies with this session.
2. Make the comparison tolerant before re-running `fix-cat-bank.py --cracku WORKDIR`:
   - strip units and digit grouping in both answers;
   - fuzzy-match option text (ratio of 0.9 or more) instead of requiring an exact match;
   - match questions in order within a set first, then by stem similarity, so neighbouring DILR questions can't swap.
3. Hand-check the true disagreements that remain against the 2IIM explanation pages.
4. Once Lokesh agrees the node map, tag each question's `node` (QA-n, DI-n or VA-n) and build `content/tests/cat-*` and the `cat-` track entry, after the GRE branch has made tracks generic.
