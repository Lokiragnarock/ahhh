#!/usr/bin/env python3
"""Parse 2IIM's free CAT past-paper pages into AHH question-bank JSON.

Source: https://online.2iim.com/CAT-question-paper/ (free, no login; the
questions are the real CAT papers, re-typed by 2IIM). Nothing here is written
or reworded by us: stems, options and keys are copied as published.

Usage:
  python3 -I scripts/scrape-cat-2iim.py PAGES_DIR OUT_DIR [--fetch-images]

PAGES_DIR holds the saved section pages, named like
CAT-2025-Question-Paper-Slot-1-Quant.html. OUT_DIR gets one JSON file per
paper section, plus img/ for figures when --fetch-images is set.
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup, Comment, NavigableString, Tag

BASE = "https://online.2iim.com/CAT-question-paper/"
SECTION = {"Quant": "qa", "DILR": "dilr", "VARC": "varc"}
VA_RE = re.compile(
    r"jumbled|sentences \(labelled|sentence (that )?is missing|given sentence is missing|"
    r"followed by four|alternate summaries|five sentences|paragraph below",
    re.I,
)
NAME_RE = re.compile(r"CAT-(\d{4})-Question-Paper-Slot-(\d)-(Quant|DILR|VARC)")


def clean(s: str) -> str:
    s = s.replace("\xa0", " ")
    s = re.sub(r"[ \t\r\f\v]+", " ", s)
    s = re.sub(r" *\n *", "\n", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


class Converter:
    """HTML fragment -> markdown-ish text. MathJax \\( \\) is kept as is."""

    def __init__(self, page_url: str, img_dir: str, images: list):
        self.page_url = page_url
        self.img_dir = img_dir
        self.images = images  # (remote url, local relative path)

    def img(self, el: Tag) -> str:
        src = el.get("data-src") or el.get("src")
        if not src:
            return ""
        url = urljoin(self.page_url, src)
        name = re.sub(r"[^A-Za-z0-9._-]", "_", urlparse(url).path.split("/")[-1])
        local = f"img/{self.img_dir}/{name}"
        if (url, local) not in self.images:
            self.images.append((url, local))
        alt = clean(el.get("alt") or "figure")
        return f"\n\n![{alt}]({local})\n\n"

    def table(self, el: Tag) -> str:
        rows = []
        for tr in el.find_all("tr"):
            cells = [clean(self.inner(td)).replace("\n", " ").replace("|", "\\|") for td in tr.find_all(["td", "th"])]
            if cells:
                rows.append(cells)
        if not rows:
            return ""
        width = max(len(r) for r in rows)
        rows = [r + [""] * (width - len(r)) for r in rows]
        out = ["| " + " | ".join(rows[0]) + " |", "|" + "---|" * width]
        out += ["| " + " | ".join(r) + " |" for r in rows[1:]]
        return "\n\n" + "\n".join(out) + "\n\n"

    def inner(self, el) -> str:
        parts = []
        for c in el.children:
            parts.append(self.node(c))
        return "".join(parts)

    def node(self, c) -> str:
        if isinstance(c, Comment):
            return ""
        if isinstance(c, NavigableString):
            return re.sub(r"\s+", " ", str(c))
        if not isinstance(c, Tag):
            return ""
        n = c.name
        if n in ("script", "style", "noscript", "button"):
            return ""
        if n == "br":
            return "\n"
        if n == "img":
            return self.img(c)
        if n == "table":
            return self.table(c)
        if n in ("p", "div", "h3", "h5", "h6", "blockquote"):
            return "\n\n" + self.inner(c) + "\n\n"
        if n == "li":
            return "\n- " + self.inner(c)
        if n in ("b", "strong"):
            t = self.inner(c).strip()
            return f"**{t}**" if t else ""
        if n in ("i", "em"):
            t = self.inner(c).strip()
            return f"*{t}*" if t else ""
        if n in ("sup", "sub", "u"):
            return f"<{n}>{self.inner(c)}</{n}>"
        return self.inner(c)

    def md(self, el) -> str:
        return clean(self.node(el) if isinstance(el, Tag) else str(el))


def parse_answer(btn_group: Tag):
    """Return (letter or None, text) from the 'Correct Answer' tooltip."""
    for tip in btn_group.select("div.tooltip"):
        b = tip.find("button")
        if b and "Correct Answer" in " ".join(b.get_text().split()):
            span = tip.find("span", class_="tooltiptext")
            if not span:
                return None, ""
            txt = clean(span.get_text("\n"))
            m = re.match(r"Ch[a-z]{3,4}\s*([A-E])\b\s*(.*)", txt, re.S)
            if m:
                return m.group(1), clean(m.group(2))
            return None, txt
    return None, ""


def parse_stats(btn_group: Tag):
    for tip in btn_group.select("div.tooltip"):
        b = tip.find("button")
        if b and "Stats" in " ".join(b.get_text().split()):
            t = tip.get_text(" ")
            vals = {}
            for k in ("Correct", "Incorrect", "Unattempted"):
                m = re.search(k + r":\s*([\d.]+)%", t)
                if m:
                    vals[k.lower()] = float(m.group(1))
            return vals or None
    return None


def is_question_li(el: Tag) -> bool:
    if el.name != "li" or not isinstance(el.parent, Tag) or el.parent.name != "ol":
        return False
    if "ques" not in (el.parent.get("class") or []):
        return False
    return el.find("div", class_="btn-group") is not None or el.find("ol", class_="choice") is not None


def parse_page(path: Path, img_root: str):
    m = NAME_RE.search(path.name)
    year, slot, sec = int(m.group(1)), int(m.group(2)), SECTION[m.group(3)]
    page_url = urljoin(BASE, path.stem + "/")
    soup = BeautifulSoup(path.read_text(encoding="utf8", errors="replace"), "lxml")
    main = soup.select_one("div.span_4_of_5") or soup.body
    images = []
    conv = Converter(page_url, f"{year}-s{slot}-{sec}", images)

    # Walk the content column in document order. Text blocks that sit outside
    # a question are buffered; the buffer becomes the shared passage/set of the
    # questions that follow it.
    questions, groups = [], []
    buffer, current_group = [], None

    def walk(el: Tag):
        nonlocal buffer, current_group
        for c in el.children:
            if not isinstance(c, Tag):
                continue
            if is_question_li(c):
                if buffer:
                    text = clean("\n\n".join(b for b in buffer if b))
                    buffer = []
                    if text and sec != "qa":
                        current_group = {"id": f"cat-{year}-s{slot}-{sec}-set{len(groups) + 1}", "text": text}
                        groups.append(current_group)
                questions.append((c, current_group))
                continue
            if c.name in ("p", "table", "img", "blockquote") or (c.name == "div" and not c.find("li")):
                if c.find("span", class_="dropcap"):
                    continue  # 2IIM's own commentary on the paper
                buffer.append(conv.md(c))
                continue
            if c.name in ("h1", "h2", "h3", "h4", "header", "footer", "nav", "script", "style"):
                continue
            walk(c)

    walk(main)

    out = []
    for i, (li, group) in enumerate(questions, 1):
        qid = topic = None
        for com in li.find_all(string=lambda s: isinstance(s, Comment)):
            s = com.strip()
            mm = re.match(r"QID:\s*(\d+)", s)
            if mm:
                qid = mm.group(1)
            elif re.fullmatch(r"[A-Za-z0-9_&\- ]{2,60}", s) and topic is None:
                topic = s
        btns = li.find("div", class_="btn-group")
        letter, ans_text = parse_answer(btns) if btns else (None, "")
        h4 = li.find("h4")
        if h4:
            ht = " ".join(h4.get_text().split())
            mm = re.search(r"\s-\s([^-]+)$", ht)
            if mm and not re.search(r"(QA|DI ?LR|VA ?RC|DILR|VARC|Quant)$", mm.group(1).strip()):
                topic = topic or mm.group(1).strip()
        choice0 = li.find("ol", class_="choice")
        if not letter and choice0:
            opts0 = choice0.find_all("li", recursive=False)
            for k, o in enumerate(opts0):
                if "Cans" in (o.get("class") or []):
                    letter = chr(65 + k)
                    ans_text = clean(o.get_text(" "))
        if not ans_text:
            sans = li.find(class_="Sans")
            if sans:
                ans_text = clean(re.sub(r"^\s*Correct Answer\s*:?", "", sans.get_text(" ")))
        stats = parse_stats(btns) if btns else None
        expl = None
        if btns:
            a = btns.find("a", href=True)
            if a:
                expl = urljoin(page_url, a["href"])
        choice = li.find("ol", class_="choice")
        options = [clean(conv.inner(o)) for o in choice.find_all("li", recursive=False)] if choice else []
        stem_parts = []
        for c in li.children:
            if isinstance(c, Tag):
                if c.name == "h4" or c.name == "hr" or c.find("ol", class_="choice") or c.find("div", class_="btn-group") or "group" in (c.get("class") or []):
                    continue
                stem_parts.append(conv.md(c))
            elif isinstance(c, NavigableString) and not isinstance(c, Comment) and c.strip():
                stem_parts.append(clean(str(c)))
        stem = clean("\n\n".join(p for p in stem_parts if p))
        qtype = "mcq" if options else "tita"
        if qtype == "mcq" and not letter and ans_text:
            norm = lambda x: re.sub(r"\s+", "", x).lower()
            hits = [k for k, o in enumerate(options) if norm(o) == norm(ans_text)]
            if len(hits) == 1:
                letter = chr(65 + hits[0])
        if qtype == "tita":
            first = ans_text.split("\n")[0].strip()
            answer, ans_text = first, (ans_text if ans_text != first else None)
        else:
            answer = letter
        # Verbal-ability questions carry their own paragraph; they must not
        # inherit the RC passage that happens to sit above them on the page.
        if sec == "varc" and group and len(group["text"]) > 1000 and VA_RE.search(stem[:200]):
            group = None
        rec = {
            "id": f"cat-{year}-s{slot}-{sec}-{i:02d}",
            "exam": "CAT",
            "year": year,
            "slot": slot,
            "section": sec,
            "number": i,
            "type": qtype,
            "marks": {"correct": 3, "wrong": -1 if qtype == "mcq" else 0},
            "set": group["id"] if group else None,
            "question": stem,
            "options": [f"{chr(65 + k)}) {o}" for k, o in enumerate(options)] if options else None,
            "answer": answer or None,
            "answer_text": ans_text or None,
            "topic_2iim": topic,
            "node": None,
            "stats_2iim": stats,
            "explanation_url": expl,
            "official_qid": qid,
            "source": {"site": "2IIM", "url": page_url},
            "verified": False,
        }
        out.append(rec)
    meta = {
        "exam": "CAT",
        "year": year,
        "slot": slot,
        "section": sec,
        "source": page_url,
        "licence": "Real CAT questions (c) IIMs, as re-published free by 2IIM (c) 2IIM. Private study use in AHH only; do not republish.",
        "scraped": time.strftime("%Y-%m-%d"),
        "count": len(out),
        "sets": groups,
        "questions": out,
    }
    return meta, images


def main():
    pages, outdir = Path(sys.argv[1]), Path(sys.argv[2])
    fetch = "--fetch-images" in sys.argv
    outdir.mkdir(parents=True, exist_ok=True)
    summary = []
    for p in sorted(pages.glob("CAT-*.html")):
        meta, images = parse_page(p, "img")
        name = f"cat-{meta['year']}-slot-{meta['slot']}-{meta['section']}.json"
        (outdir / name).write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf8")
        if fetch:
            for url, local in images:
                dest = outdir / local
                if dest.exists() and dest.stat().st_size > 0:
                    continue
                dest.parent.mkdir(parents=True, exist_ok=True)
                subprocess.run(["curl", "-sS", "-m", "40", "-A", "Mozilla/5.0", "-o", str(dest), url], check=False)
                time.sleep(0.3)
        q = meta["questions"]
        summary.append((name, len(q), sum(x["type"] == "tita" for x in q), len(meta["sets"]), sum(not x["answer"] for x in q), len(images)))
    for s in summary:
        print("%-28s q=%3d tita=%2d sets=%2d noans=%d imgs=%d" % s)
    print("total", sum(s[1] for s in summary))


if __name__ == "__main__":
    main()
