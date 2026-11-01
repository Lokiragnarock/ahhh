# CAT question bank (raw)

These are the real CAT past papers, 2017 to 2025, every slot and every section: **1,830 questions in 72 files**. They were scraped from 2IIM's free CAT question-paper pages (https://online.2iim.com/CAT-question-paper/) on 31 October 2026 by `scripts/scrape-cat-2iim.py`. Nothing here is AI-written or reworded. Stems, options and answer keys are copied as 2IIM published them.

This folder is a raw bank. The app does not read it yet. The next step tags each question with a `cat-qa` / `cat-dilr` / `cat-varc` node and builds tests from it, once the CAT track exists in `src/lib/tracks.ts`.

## Counts

| Year | Slots | VARC | DILR | QA | Total | TITA | Paper format |
|---|---|---|---|---|---|---|---|
| 2017 | 2 | 68 | 64 | 68 | 200 | 52 | 100 a slot (34/32/34), 3 hours |
| 2018 | 2 | 68 | 64 | 68 | 200 | 54 | same |
| 2019 | 2 | 68 | 64 | 68 | 200 | 52 | same |
| 2020 | 3 | 78 | 72 | 78 | 228 | 57 | 76 a slot (26/24/26), 2 hours |
| 2021 | 3 | 72 | 60 | 66 | 198 | 54 | 66 a slot (24/20/22) |
| 2022 | 3 | 72 | 60 | 66 | 198 | 51 | same |
| 2023 | 3 | 72 | 60 | 66 | 198 | 60 | same |
| 2024 | 3 | 72 | 66 | 66 | 204 | 59 | 68 a slot (24/22/22) |
| 2025 | 3 | 72 | 66 | 66 | 204 | 69 | same |
| **All** | 24 | 642 | 576 | 612 | **1,830** | 508 | |

Every slot's count matches the official IIM pattern for its year (see `docs/cat-plan.md`). VARC also splits correctly: 24 RC + 10 VA a slot for 2017 to 2019, 18 RC + 8 VA for 2020, and 16 RC + 8 VA from 2021 onwards.

## Files

One file per slot and section: `cat-<year>-slot-<n>-<qa|dilr|varc>.json`. Figures are in `img/<year>-s<slot>-<section>/` (68 images, all from DILR sets and a few QA questions).

```jsonc
{
  "exam": "CAT", "year": 2025, "slot": 1, "section": "dilr",
  "source": "https://online.2iim.com/CAT-question-paper/CAT-2025-Question-Paper-Slot-1-DILR/",
  "licence": "...", "scraped": "2026-10-31", "count": 22,
  "sets": [ { "id": "cat-2025-s1-dilr-set1", "text": "A train travels from Station A ..." } ],
  "questions": [
    {
      "id": "cat-2025-s1-dilr-01",
      "type": "mcq",                       // or "tita" (type in the answer)
      "marks": { "correct": 3, "wrong": -1 },  // TITA: wrong = 0
      "set": "cat-2025-s1-dilr-set1",      // shared RC passage / DILR set, or null
      "question": "What was the occupancy factor for segment D – E?",
      "options": ["A) 35%", "B) 84%", "C) 77%", "D) 70%"],   // null for TITA
      "answer": "D",                       // letter for MCQ, typed value for TITA
      "answer_text": "70%",
      "topic_2iim": null,                  // 2IIM's own topic label where given
      "node": null,                        // to fill: QA-n / DI-n / VA-n
      "stats_2iim": { "correct": 9.29, "incorrect": 12.0, "unattempted": 78.71 },
      "explanation_url": "https://online.2iim.com/.../dilr-question-1.shtml",
      "official_qid": "3328181513",        // IIM question id (2024 and 2025 only)
      "source": { "site": "2IIM", "url": "..." },
      "verified": false
    }
  ]
}
```

Text is markdown. Maths stays in MathJax form (`\( ... \)`), so the app will need KaTeX or MathJax to render it. Tables are markdown tables, and figures are `![figure](img/...)` paths relative to this folder.

## Known issues (fix before tests go live)

- **Answer keys are from one source only.** `verified` is false everywhere. The plan's rule is that a second copy (Cracku, https://cracku.in/cat-previous-papers/) or an official key must agree first. Cracku's pages list the same questions, but they load solutions with JavaScript, so that cross-check is not done yet.
- **One duplicate:** the "fruit seller ... 40% mangoes" question appears in both CAT 2023 slot 3 QA (Q14) and CAT 2024 slot 2 QA (Q12). Cracku lists it in both papers too. Only the 2024 copy carries an official IIM question id, so the 2023 copy is probably an error in both sites. Keep the 2024 copy.
- **CAT 2024 slot 1 VARC Q3** (odd sentence out) is stored as a five-option MCQ, because 2IIM shows it that way. In the real paper it was a TITA.
- **2018 QA:** a few options carry 2IIM's broken MathJax (for example `\\frac{π}{4})<sup>...`). These need fixing by hand from the PDF.
- **2017 to 2019 TITA answers** sometimes include units ("2 flats", "Rs. 19 crores"). Normalise them to the bare number before auto-marking.
- **Three short DILR stems** ("Who can V see?", "Object o4 was given to") are correct; they only make sense with their set.

## Licence

The questions are © the IIMs (CAT), as re-published free (no login) by 2IIM (© 2IIM). AHH is private, so this is for Lokesh's personal study only. Do not make this repository or these files public.

## Re-running

```bash
python3 -I scripts/scrape-cat-2iim.py PAGES_DIR content/question-bank/cat --fetch-images
```

`PAGES_DIR` holds the saved 2IIM section pages (`CAT-2025-Question-Paper-Slot-1-Quant.html`, and so on), fetched from the links on https://online.2iim.com/CAT-question-paper/ with a 1-second delay between requests.
