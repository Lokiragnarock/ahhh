// A real squarified treemap (Bruls, Huizing, van Wijk 1999).
// Rectangle area is proportional to `value`. Used for both the unit-container
// layer and the topic-leaf layer of the Territory screen — never a uniform grid.

export interface TreemapItem {
  id: string;
  value: number;
}

export interface TreemapRect<T extends TreemapItem> {
  item: T;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Weighted<T extends TreemapItem> {
  item: T;
  area: number;
}

function worstRatio(areas: number[], length: number): number {
  if (areas.length === 0) return Infinity;
  const sum = areas.reduce((a, b) => a + b, 0);
  const max = Math.max(...areas);
  const min = Math.min(...areas);
  const lenSq = length * length;
  return Math.max((lenSq * max) / (sum * sum), (sum * sum) / (lenSq * min));
}

function layoutRow<T extends TreemapItem>(
  row: Weighted<T>[],
  x: number,
  y: number,
  w: number,
  h: number
): TreemapRect<T>[] {
  const rowArea = row.reduce((s, r) => s + r.area, 0);
  const rects: TreemapRect<T>[] = [];
  if (w < h) {
    // Row lies horizontally along the top edge.
    const rowHeight = rowArea / w;
    let cx = x;
    for (const r of row) {
      const itemWidth = rowHeight > 0 ? r.area / rowHeight : 0;
      rects.push({ item: r.item, x: cx, y, w: itemWidth, h: rowHeight });
      cx += itemWidth;
    }
  } else {
    // Row lies vertically along the left edge.
    const rowWidth = rowArea / h;
    let cy = y;
    for (const r of row) {
      const itemHeight = rowWidth > 0 ? r.area / rowWidth : 0;
      rects.push({ item: r.item, x, y: cy, w: rowWidth, h: itemHeight });
      cy += itemHeight;
    }
  }
  return rects;
}

export function squarify<T extends TreemapItem>(
  items: T[],
  x: number,
  y: number,
  w: number,
  h: number
): TreemapRect<T>[] {
  const data = items.filter((i) => i.value > 0).sort((a, b) => b.value - a.value);
  if (data.length === 0 || w <= 0 || h <= 0) return [];

  const totalValue = data.reduce((s, i) => s + i.value, 0);
  const totalArea = w * h;
  const scale = totalValue > 0 ? totalArea / totalValue : 0;
  const queue: Weighted<T>[] = data.map((item) => ({ item, area: item.value * scale }));

  const rects: TreemapRect<T>[] = [];
  let cx = x;
  let cy = y;
  let cw = w;
  let ch = h;
  let row: Weighted<T>[] = [];

  while (queue.length) {
    const length = Math.min(cw, ch);
    const next = queue[0];
    const candidate = [...row, next];
    const rowAreas = row.map((r) => r.area);
    const candidateAreas = candidate.map((r) => r.area);

    if (row.length === 0 || worstRatio(rowAreas, length) >= worstRatio(candidateAreas, length)) {
      row.push(next);
      queue.shift();
    } else {
      rects.push(...layoutRow(row, cx, cy, cw, ch));
      const rowArea = row.reduce((s, r) => s + r.area, 0);
      if (cw < ch) {
        const rowHeight = rowArea / cw;
        cy += rowHeight;
        ch -= rowHeight;
      } else {
        const rowWidth = rowArea / ch;
        cx += rowWidth;
        cw -= rowWidth;
      }
      row = [];
    }
  }
  if (row.length) {
    rects.push(...layoutRow(row, cx, cy, cw, ch));
  }
  return rects;
}
