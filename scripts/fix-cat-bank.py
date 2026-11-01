#!/usr/bin/env python3
"""Clean up the raw CAT bank in content/question-bank/cat in place.

Safe to re-run: every step only acts on things that are still broken.

  python3 -I scripts/fix-cat-bank.py BANK_DIR [--cracku CRACKU_DIR]

Steps
  1. MathJax repair. 2IIM's 2017-2021 pages carry maths like
     `\\\\frac{1}{2})` (one opening `\\(` lost, one backslash of the closing
     `\\)` lost), which renders broken on 2IIM too. Each such run is rebuilt as
     `\\(\\frac{1}{2}\\)`. Only the delimiters change; the maths is untouched.
  2. TITA answers: `answer_value` holds the bare typed value ("2 flats" -> "2",
     "Rs. 19 crores" -> "19") so marking can compare numbers.
  3. Known one-off fixes (see FIXES below), each with a note.
  4. Duplicates: identical stems get `duplicate_of` pointing at the copy to keep.
  5. With --cracku: cross-check every answer key against Cracku's copy of the
     same paper and set `verified` / `verification`.
"""
import json
import re
import sys
from difflib import SequenceMatcher
from pathlib import Path

# ---------------------------------------------------------------- MathJax repair

CMD = re.compile(r"\\\\([A-Za-z]+)")


def repair_math(s: str) -> str:
    """Rebuild `\\\\cmd...)` / `\\\\cmd...\\\\)` runs as `\\(\\cmd...\\)`."""
    if not s or "\\\\" not in s:
        return s
    out, i, n = [], 0, len(s)
    while i < n:
        m = CMD.match(s, i)
        if not m:
            out.append(s[i])
            i += 1
            continue
        # Parse forward to the closing `)` (or `\\)`) at brace and paren depth 0.
        j, brace, paren = i, 0, 0
        end = None
        while j < n:
            if s.startswith("\\\\)", j) and brace == 0 and paren == 0:
                end, close_len = j, 3
                break
            if s.startswith("\\)", j) and brace == 0 and paren == 0:
                end, close_len = j, 2
                break
            ch = s[j]
            if ch == "{":
                brace += 1
            elif ch == "}":
                brace -= 1
            elif ch == "(":
                paren += 1
            elif ch == ")":
                if brace == 0 and paren == 0:
                    end, close_len = j, 1
                    break
                paren -= 1
            elif ch == "<" or ch == "\n":
                # Ran into HTML or a new line without a closer: stop here.
                end, close_len = j, 0
                break
            j += 1
        if end is None:
            end, close_len = n, 0
        body = s[i:end].replace("\\\\", "\\")
        out.append("\\(" + body + "\\)")
        i = end + close_len
    return "".join(out)


# ---------------------------------------------------------------- TITA values

def tita_value(ans: str) -> str:
    """Bare typed value: strip units and currency words, keep the number."""
    if ans is None:
        return None
    a = ans.strip()
    m = re.fullmatch(r"(?:Rs\.?\s*)?(-?\d+(?:\.\d+)?)\s*[A-Za-z%.\s]*", a)
    return m.group(1) if m else a


# ---------------------------------------------------------------- one-off fixes

FIXES = {
    # 2IIM shows this odd-sentence-out question with five numbered choices; in
    # the real paper it was a TITA where you type the sentence number.
    "cat-2024-s1-varc-03": {"to_tita": True, "note": "Odd sentence out: a TITA in the real paper; 2IIM lists it as five options."},
}


def apply_fixes(q: dict):
    fx = FIXES.get(q["id"])
    if not fx:
        return
    if fx.get("to_tita") and q["type"] == "mcq":
        k = "ABCDE".index(q["answer"])
        q["type"] = "tita"
        q["marks"] = {"correct": 3, "wrong": 0}
        q["answer"] = str(k + 1)  # the sentence number you type in the real paper
        q["answer_text"] = re.sub(r"^[A-E]\)\s*", "", q["options"][k]).strip()
        sentences = [re.sub(r"^[A-E]\)\s*", "", o).strip() for o in q["options"]]
        q["question"] += "\n\n" + "\n".join(f"{n}. {t}" for n, t in enumerate(sentences, 1))
        q["options"] = None
    q["note"] = fx["note"]


# ---------------------------------------------------------------- Cracku check

def norm(s: str) -> str:
    s = re.sub(r"<[^>]+>", " ", s or "")
    s = re.sub(r"\\[()\[\]]|\$\$?|\\[a-z]+", " ", s)
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return " ".join(s.split())


def load_cracku(cdir: Path):
    """Return {(year, slot, sec): [ {stem, options[], answer} ]} from saved pages."""
    from bs4 import BeautifulSoup

    secmap = {"quant": "qa", "quantitative-aptitude": "qa", "lrdi": "dilr", "dilr": "dilr", "varc": "varc", "verbal-ability": "varc"}
    papers = {}
    for line in (cdir / "qlinks.tsv").read_text().splitlines():
        sec_slug, q_slug = line.split("\t")
        m = re.match(r"cat-(\d{4})-(?:slot|shift)-(\d)-(.+)-question-paper-solved", sec_slug)
        key = (int(m.group(1)), int(m.group(2)), secmap[m.group(3)])
        f = cdir / "q" / f"{q_slug}.html"
        if not f.exists():
            continue
        html = f.read_text(errors="replace")
        soup = BeautifulSoup(html, "lxml")
        # The answer the page reveals on submit.
        am = re.search(r"html \+= \"<p><b> Correct Answer:</b> \" \+'([^']*)'", html)
        ans = am.group(1).strip() if am else None
        box = soup.select_one("div.options-box")
        options = []
        if box:
            for b in box.select("button[data-option]"):
                c = b.select_one(".option-content") or b
                options.append(" ".join(c.get_text(" ").split()))
        # Question text: the block right before the options / answer box.
        qtext = ""
        qd = soup.select_one(".question-text") or soup.select_one("[class*=question-text]")
        if qd:
            qtext = qd.get_text(" ")
        else:
            t = soup.select_one("title")
            qtext = t.get_text() if t else ""
        papers.setdefault(key, []).append({"slug": q_slug, "stem": qtext, "options": options, "answer": ans})
    return papers


def cracku_answer_text(c: dict):
    a = c["answer"]
    if a is None:
        return None
    if c["options"] and re.fullmatch(r"\d", a) and 1 <= int(a) <= len(c["options"]):
        return c["options"][int(a) - 1]
    return a


def verify(bank: list, papers: dict):
    stats = {"match": 0, "mismatch": 0, "unmatched": 0}
    for d in bank:
        cands = papers.get((d["year"], d["slot"], d["section"]), [])
        used = set()
        for q in d["questions"]:
            stem = norm(q["question"])
            best, score = None, 0.0
            for k, c in enumerate(cands):
                if k in used:
                    continue
                cs = norm(c["stem"])
                r = SequenceMatcher(None, stem[:300], cs[:300]).ratio()
                # RC/DILR stems are short and generic; options disambiguate.
                if q["options"] and c["options"]:
                    ro = SequenceMatcher(None, norm(" ".join(q["options"])), norm(" ".join(c["options"]))).ratio()
                    r = 0.5 * r + 0.5 * ro
                if r > score:
                    best, score = k, r
            if best is None or score < 0.6:
                q["verified"] = False
                q["verification"] = {"source": "Cracku", "result": "not found"}
                stats["unmatched"] += 1
                continue
            used.add(best)
            c = cands[best]
            theirs = cracku_answer_text(c)
            if q["type"] == "mcq":
                k = "ABCDE".index(q["answer"]) if q["answer"] in list("ABCDE") else None
                ours = re.sub(r"^[A-E]\)\s*", "", q["options"][k]) if k is not None else None
                ok = ours is not None and theirs is not None and norm(ours) == norm(theirs)
            else:
                ours = q.get("answer_value") or q["answer"]
                ok = theirs is not None and (norm(ours) == norm(theirs) or tita_value(theirs) == ours)
            q["verified"] = bool(ok)
            q["verification"] = {
                "source": "Cracku",
                "url": "https://cracku.in/" + c["slug"],
                "result": "match" if ok else "mismatch",
                "cracku_answer": theirs,
            }
            stats["match" if ok else "mismatch"] += 1
    return stats


# ---------------------------------------------------------------- main

def main():
    bank_dir = Path(sys.argv[1])
    cracku = Path(sys.argv[sys.argv.index("--cracku") + 1]) if "--cracku" in sys.argv else None
    files = sorted(bank_dir.glob("cat-*.json"))
    bank = [json.loads(f.read_text()) for f in files]

    math_fixed = 0
    for d in bank:
        for s in d["sets"]:
            new = repair_math(s["text"])
            math_fixed += new != s["text"]
            s["text"] = new
        for q in d["questions"]:
            for k in ("question", "answer_text", "answer"):
                if q.get(k):
                    new = repair_math(q[k])
                    math_fixed += new != q[k]
                    q[k] = new
            if q["options"]:
                new = [repair_math(o) for o in q["options"]]
                math_fixed += sum(a != b for a, b in zip(new, q["options"]))
                q["options"] = new
            apply_fixes(q)
            if q["type"] == "tita":
                q["answer_value"] = tita_value(q["answer"])
            else:
                q.pop("answer_value", None)

    # Duplicates: keep the copy that carries an official IIM question id, else the later paper.
    by_stem = {}
    for d in bank:
        for q in d["questions"]:
            by_stem.setdefault(norm(q["question"]), []).append(q)
    dupes = 0
    for stem, qs in by_stem.items():
        if len(qs) < 2 or len(stem) < 120:
            continue  # short generic RC/DILR stems repeat legitimately
        keep = sorted(qs, key=lambda q: (q.get("official_qid") is not None, q["year"], q["slot"]))[-1]
        for q in qs:
            if q is not keep:
                q["duplicate_of"] = keep["id"]
                dupes += 1

    vstats = verify(bank, load_cracku(cracku)) if cracku else None

    for f, d in zip(files, bank):
        f.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf8")
    print(f"maths repaired in {math_fixed} fields; duplicates flagged: {dupes}")
    if vstats:
        print("cracku:", vstats)


if __name__ == "__main__":
    main()
