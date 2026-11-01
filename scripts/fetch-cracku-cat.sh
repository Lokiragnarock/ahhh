#!/bin/bash
# Usage: fetch_cracku.sh WORKDIR   (WORKDIR has index.html from cracku.in/cat-previous-papers/)
W="$1"; cd "$W" || exit 1
mkdir -p sec q
grep -oE 'href="/cat-20(1[7-9]|2[0-5])-(slot|shift)-[0-9]-(quant|quantitative-aptitude|lrdi|dilr|varc|verbal-ability)-question-paper-solved"' index.html | sed 's/href="\///;s/"$//' | sort -u > sections.txt
while read s; do
  [ -s "sec/$s.html" ] || { curl -sSL -m 40 -A "Mozilla/5.0" "https://cracku.in/$s" -o "sec/$s.html"; sleep 1; }
done < sections.txt
: > qlinks.tsv
for f in sec/*.html; do
  s=$(basename "$f" .html)
  grep -oE 'href="/[0-9]+-[a-z0-9-]+-x-cat-[a-z0-9-]+"' "$f" | sed 's/href="\///;s/"$//' | awk '!seen[$0]++' | while read q; do printf "%s\t%s\n" "$s" "$q" >> qlinks.tsv; done
done
wc -l qlinks.tsv
cut -f2 qlinks.tsv | while read q; do
  [ -s "q/$q.html" ] || { curl -sSL -m 40 -A "Mozilla/5.0" "https://cracku.in/$q" -o "q/$q.html"; sleep 1; }
done
echo DONE $(ls q | wc -l)
