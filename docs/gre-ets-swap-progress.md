# GRE bank swap: progress

Goal (Lokesh, 2026-11-01): drop the GRE Quant Lab bank (Turkish, written for that
project, not official) and replace it with free official ETS material only.

## Done

- ETS files downloaded and stored in `content/sources/gre/ets/` (see SOURCE.txt):
  Practice Test 1 and 3 Quant (screen-reader .docx) with answer keys, and the GRE
  Sample Questions PDF. Text dumps in `content/sources/gre/ets/text/`.
- `scripts/docx2txt.py` dumps a .docx as text with [IMG:...] markers.
- Practice Test 3 = the paper-delivered Practice Book test. Practice Test 1 is a
  different test. So 70 real questions (2 tests x 35) with official answer keys.
- Step 1: `content/tests/gre-quant/ets-pt1.json` and `ets-pt3.json` (35 each), written
  from the text dumps. Answers only from the ETS keys, no explanations (ETS gives none).
  Figures and data tables are the large images from the .docx files, saved under
  `public/gre/ets/` and referenced with <img>. Math images were read from the .docx
  and typed as HTML.
- Step 2: `content/tests/gre-quant/ets-sample.json` (26 questions: 9 QC, 5 single,
  4 select all, 5 numeric, 1 fraction, 3 data interpretation) with the ETS explanations.
  Figures 1 to 6 are crops of the PDF pages (`public/gre/ets/sample-fig*.png`); the
  Figure 7 and 8 tables are typed as HTML.
- Step 3: removed the Quant Lab bank (`q-0*.json`, `content/sources/gre/gre-quant-lab/`,
  `scripts/gre-import.mjs`).
- Step 4: recall notes cleaned (no "Traps the bank keeps setting", no "Practise on"
  links to Quant Lab ids, no formula-card source line) and the MOC counts and source
  line rewritten for the ETS bank (96 questions).
- Step 5: `npm run build` and `npm run lint` clean; question pages render in the app
  (checked with `next start`).

## Notes for review

- Node assignment (Q-1 to Q-9) is my judgment from what each question asks; ETS does
  not tag its questions. Difficulty is left out (ETS gives none; the app shows medium).
- PT1 and PT3 question stems that say "figure for question N" keep ETS wording.
- Sample QC 6, last paragraph: the PDF layout drops the word "The" before
  "relationship in the final, simplified inequality"; it is restored.
- Sample data interpretation 3, choice C explanation: the PDF text layer is overlapped;
  the 2007 and 2008 expressions (1.05C and (1.12)(1.05)C) are put in the right order.
- No ETS item was left out as unreadable.

## Verbal (ETS Practice General Test 1 and 3)

- `content/tests/gre-verbal/ets-pt1.json` and `ets-pt3.json` (35 each: Section 2 has 15
  questions, Section 3 has 20), written from the screen-reader .docx files in
  `content/sources/gre/ets/`. Answers only from the ETS answer keys. ETS gives no
  explanations; where the key gives "Answer in Context" for a Text Completion item it is
  shown as the explanation. With `ets-sample.json` (7 items) the Verbal bank is 77 questions.
- Counts (PT1 / PT3): V-1 Text Completion 11 / 11, V-2 Sentence Equivalence 7 / 7,
  V-4 Reading Comprehension 15 / 14, V-5 Argument passages 2 / 3 (V-5 items also count in V-4).
- Formats follow `ets-sample.json`: the passage is repeated in each question's stimulus;
  multi-blank Text Completion is `multi` with choices "Blank (i): ..."; Sentence Equivalence is
  `multi` (select two); select-all is `multi`; select-in-passage is `single` with the sentences
  as choices. A passage portion that ETS sets in boldface and braces is shown in bold, no braces.
- The .docx files have no images in the Verbal sections, so nothing was added to
  `public/gre/ets/verbal/`.
- The text dumps in `content/sources/gre/ets/text/` lose curly punctuation, non-breaking
  hyphens and italics, so the questions were extracted again from the .docx files (hyphens
  and italics restored, e.g. "sixty-four", play and book titles in italics).
- Node assignment is my judgment from what each question asks. V-5: PT1 Section 3
  questions 15 (weaken) and 18 (what must be true); PT3 Section 2 question 6 (assumption),
  Section 3 questions 10 (weaken) and 20 (strengthen).
- Cross-check: every JSON answer compared with the ETS key, 70 of 70 match.
- Em dashes in the ETS text were replaced with commas (paired dashes) or a colon (one place)
  in: PT1 Section 3 passage for questions 5 and 6; PT3 Section 2 passages for questions
  10 and 11, 12 and 13, 14 and 15 (and the option for question 11); PT3 Section 3 questions
  5 and 6, the passages for 7 to 9, 15 to 17, 18 and 19 (and the quoted sentence in 19).
- Source defect kept as is: in the PT3 Section 3 passage for questions 7 to 9 the .docx
  reads "the civil that is, noncriminal law of early modern that is, sixteenth- to
  eighteenth-century England"; the dashes around those asides are missing in the file.
- Small fix: PT1 Section 3 question 14 had a stray space before the question mark after the
  italic play title; the space is removed.
