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
