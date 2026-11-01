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
- PT1 sections 4 and 5 read through and matched against the key (all formats present:
  QC, single, select all, numeric, fraction).

## To do

1. Write `content/tests/gre-quant/ets-pt1.json` and `ets-pt3.json` by hand from the text
   dumps. Rules: copy wording exactly; write maths as HTML from the spoken form
   ("three halves" -> 3/2 fraction span); answers only from the ETS keys; no
   explanations unless ETS gives one. Figures: use the large images from the .docx
   (`word/media/`), saved under `public/gre/ets/`, referenced with <img>.
   Each question needs node Q-1..Q-9 (+ alsoNodes Q-10 for QC), format, html: true.
2. Add the Sample Questions PDF questions (with ETS explanations).
3. Remove the GRE Quant Lab bank: `content/tests/gre-quant/q-0*.json`,
   `content/sources/gre/gre-quant-lab/`, `scripts/gre-import.mjs`.
4. Notes in `content/recall/gre-quant/`: remove "Traps the bank keeps setting" and
   "Practise on" links that point at GRE-... Quant Lab ids; drop the Q-7 formula-card
   source line; update the MOC counts and source line.
5. `npm run build`, check in the browser, commit, push.

The GRE Quant Lab bank is still live until step 3 so GRE practice is not empty.
