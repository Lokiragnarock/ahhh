// Converts the GRE Quant Lab bank (content/sources/gre/gre-quant-lab) into
// AHH practice JSON (content/tests/gre-quant). Re-run after changing the node
// rules or the translations:
//
//   node scripts/gre-import.mjs           # write content/tests/gre-quant
//   node scripts/gre-import.mjs --check   # report counts, write nothing
//
// Question text, figures, options and answers are copied as they are. Only
// the Turkish explanations (expl, short) are replaced, by the English in
// translations.en.json (keyed by the first 10 hex characters of the sha1 of
// the Turkish text). Nothing here writes or changes a question.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "content", "sources", "gre", "gre-quant-lab");
const OUT = path.join(ROOT, "content", "tests", "gre-quant");
const CHECK = process.argv.includes("--check");

export const NODES = {
  "Q-1": "Arithmetic and number properties",
  "Q-2": "Percents and ratios",
  "Q-3": "Algebra",
  "Q-4": "Word problems and rates",
  "Q-5": "Lines, angles, triangles",
  "Q-6": "Circles, polygons, coordinates, solids",
  "Q-7": "Statistics and distributions",
  "Q-8": "Counting and probability",
  "Q-9": "Data interpretation",
  "Q-10": "Quantitative Comparison method",
};
const NODE_FILES = {
  "Q-1": "q-01-arithmetic-number-properties.json",
  "Q-2": "q-02-percents-ratios.json",
  "Q-3": "q-03-algebra.json",
  "Q-4": "q-04-word-problems-rates.json",
  "Q-5": "q-05-lines-angles-triangles.json",
  "Q-6": "q-06-circles-polygons-coordinates-solids.json",
  "Q-7": "q-07-statistics-distributions.json",
  "Q-8": "q-08-counting-probability.json",
  "Q-9": "q-09-data-interpretation.json",
};

// ---- node map, by the Turkish subtopic (`sub`) and the source's `topic` ----

const has = (s, re) => re.test(s);
// "iş" (work) as a whole word, so işaret (sign) and değişim (change) miss.
const WORK = /(^|[\s(/])iş([\s/)]|$)/;
const RATES = /hız|debi|karışım|karşılaşma|birlikte çalışma|doldurma/;
const COUNTING = /olasılık|permütasyon|kombinasyon|^sayma|gruplara ayırma|diziliş|kapsama|venn|kümeler|binom/;
const STATS = /ortalama|medyan|(^|[\s/])mod([\s/)]|$)|standart sapma|çeyrek|iqr|açıklık|dağılım|veri dönüşümü|kutu grafiği/;
const DATA_DISPLAY = /tablo|grafik|histogram|saçılım/;
const COORD = /koordinat|doğrular|doğru üzerindeki|doğruların|doğru denklemi|eğim|eksen|çember|orijin|orta nokta|iki nokta|doğruya|yansıma|düzlem/;
const PERCENT = /yüzde|artış|azalış|oran|indirim|kâr|faiz|büyüme|(^|[\s(/])pay([\s/)]|$)|birim fiyat|birim dönüşümü|vergi|projeksiyon|yoğunluk|kişi başı|taban değiş|senaryo|gelir|trend/;
const GEO_TRI = /üçgen|açı|pisagor|30-60-90|hipotenüs|kenarortay|paralel doğru|doğrular/;

export function nodeOf(q) {
  const sub = q.sub.toLocaleLowerCase("tr-TR");
  if (q.topic === "geo") {
    // Triangles first unless the shape is a circle, polygon, solid or sits
    // on axes; plain triangle / angle / line questions are Q-5.
    if (has(sub, GEO_TRI) && !has(sub, /çember|daire|koordinat|eksen|küp|silindir|küre|hacim|çokgen|altıgen|sekizgen|paralelkenar|yamuk|eşkenar dörtgen|dikdörtgen|doğruya|teğet|kiriş|çap/)) return "Q-5";
    return "Q-6";
  }
  if (q.topic === "data") {
    if (q.set || has(sub, DATA_DISPLAY)) return "Q-9";
    if (has(sub, COUNTING)) return "Q-8";
    return "Q-7";
  }
  // arith and alg
  if (has(sub, WORK) || has(sub, RATES)) return "Q-4";
  if (has(sub, COUNTING)) return "Q-8";
  if (has(sub, STATS)) return "Q-7";
  if (has(sub, COORD)) return "Q-6";
  if (has(sub, PERCENT)) return "Q-2";
  return q.topic === "alg" ? "Q-3" : "Q-1";
}

// ---- conversion ----

const QC_OPTIONS = [
  "A) Quantity A is greater.",
  "B) Quantity B is greater.",
  "C) The two quantities are equal.",
  "D) The relationship cannot be determined from the information given.",
];
const LETTERS = "ABCDEFGHIJ";

const hash = (t) => crypto.createHash("sha1").update(t).digest("hex").slice(0, 10);

function difficultyOf(testId, section) {
  if (section === "easy") return "easy";
  if (section === "hard") return "hard";
  // Drills k002 and k003 are the source's "Hell Mode" sets.
  if (testId === "k002" || testId === "k003") return "hard";
  return "medium";
}

function questionHtml(q, set) {
  const parts = ['<div class="gre-q">'];
  // The set's own intro ("Questions 11 and 12 are based on...") numbers the
  // source paper, so it is left out; the data itself is kept whole.
  if (set) parts.push(`<!--stim--><div class="gre-stim">${set.html}</div><!--/stim-->`);
  if (q.type === "qc") {
    if (q.fig) parts.push(`<div class="gre-fig">${q.fig}</div>`);
    if (q.given) parts.push(`<div class="given">${q.given}</div>`);
    parts.push(
      `<div class="gre-qc"><div class="h">Quantity A</div><div class="h">Quantity B</div><div>${q.qa}</div><div>${q.qb}</div></div>`
    );
  } else {
    parts.push(`<div class="stem">${q.stem}</div>`);
    if (q.fig) parts.push(`<div class="gre-fig">${q.fig}</div>`);
  }
  parts.push("</div>");
  return parts.join("");
}

function answerOf(q) {
  switch (q.type) {
    case "qc":
    case "mc":
      return LETTERS[q.answer];
    case "ma":
      return [...q.answer].sort((a, b) => a - b).map((i) => LETTERS[i]).join(",");
    case "ne":
      if (q.answer.kind !== "dec") throw new Error(`ne answer kind ${q.answer.kind}`);
      return String(q.answer.value);
    case "nef":
      if (q.answer.kind !== "frac") throw new Error(`nef answer kind ${q.answer.kind}`);
      return `${q.answer.value[0]}/${q.answer.value[1]}`;
  }
  throw new Error(`unknown type ${q.type}`);
}

const FORMAT = { qc: "qc", mc: "single", ma: "multi", ne: "numeric", nef: "fraction" };

function main() {
  const tr = JSON.parse(fs.readFileSync(path.join(SRC, "translations.en.json"), "utf8"));
  // Every data/<test>/<section>.json, tests in id order, sections s1, easy,
  // medium, hard (drills have one, main).
  const ORDER = ["main", "s1", "easy", "medium", "hard"];
  const tests = fs
    .readdirSync(path.join(SRC, "data"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({
      id: d.name,
      sections: fs
        .readdirSync(path.join(SRC, "data", d.name))
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.replace(/\.json$/, ""))
        .sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
  const byNode = Object.fromEntries(Object.keys(NODE_FILES).map((n) => [n, []]));
  const skipped = [];
  const missing = new Set();
  const subs = {};
  let total = 0;
  let qcCount = 0;

  for (const test of tests) {
    for (const section of test.sections) {
      const rel = path.join("data", test.id, `${section}.json`);
      const data = JSON.parse(fs.readFileSync(path.join(SRC, rel), "utf8"));
      for (const q of data.questions) {
        total += 1;
        const id = `GRE-${test.id}-${section}-${q.id}`;
        const set = q.set ? data.sets?.[q.set] : undefined;
        if (q.set && !set) {
          skipped.push({ id, reason: `data set ${q.set} not found in ${rel}` });
          continue;
        }
        const en = (t) => {
          if (!t.trim()) return "";
          const v = tr[hash(t)];
          if (!v) missing.add(hash(t));
          return v ?? t;
        };
        const node = nodeOf(q);
        (subs[node] ??= {})[q.sub] = (subs[node][q.sub] ?? 0) + 1;
        const out = {
          id,
          node,
          nodeTitle: NODES[node],
          unit: "GRE Quant",
          type: "mcq",
          marks: 1,
          difficulty: difficultyOf(test.id, section),
          html: true,
          format: FORMAT[q.type],
          question: questionHtml(q, set),
        };
        if (q.type === "qc") out.options = QC_OPTIONS;
        else if (q.type === "mc" || q.type === "ma") out.options = q.choices.map((c, i) => `${LETTERS[i]}) ${c}`);
        out.answer = answerOf(q);
        if (q.unit_after) out.unitAfter = q.unit_after;
        const shortcut = en(q.short);
        out.explanation =
          `<div class="gre-sol"><p><strong>Step by step.</strong> ${en(q.expl)}</p>` +
          (shortcut ? `<p><strong>Shortcut.</strong> ${shortcut}</p>` : "") +
          "</div>";
        if (q.type === "qc") {
          out.alsoNodes = [{ id: "Q-10", title: NODES["Q-10"] }];
          qcCount += 1;
        }
        out.source = `gre-quant-lab@9bdc26e ${rel} ${q.id} (${q.sub})`;
        byNode[node].push(out);
      }
    }
  }

  const counts = Object.fromEntries(Object.entries(byNode).map(([n, qs]) => [n, qs.length]));
  console.log(JSON.stringify({ total, converted: total - skipped.length, counts, "Q-10 (all qc)": qcCount, skipped, missingTranslations: missing.size }, null, 1));
  if (process.argv.includes("--subs")) console.log(JSON.stringify(subs, null, 1));
  if (CHECK) return;
  if (missing.size) {
    console.error(`Refusing to write: ${missing.size} explanations have no English translation.`);
    process.exit(1);
  }
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) if (f.endsWith(".json")) fs.unlinkSync(path.join(OUT, f));
  for (const [node, qs] of Object.entries(byNode)) {
    fs.writeFileSync(path.join(OUT, NODE_FILES[node]), JSON.stringify(qs, null, 1) + "\n");
  }
}

main();
