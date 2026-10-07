/** Minimal binary min-heap of (priority, id) for A*. */
export class MinHeap {
  private p: number[] = [];
  private v: number[] = [];
  clear(): void {
    this.p.length = 0;
    this.v.length = 0;
  }
  get size(): number {
    return this.p.length;
  }
  push(pri: number, id: number): void {
    const p = this.p, v = this.v;
    let i = p.length;
    p.push(pri);
    v.push(id);
    while (i > 0) {
      const j = (i - 1) >> 1;
      if (p[j] <= pri) break;
      p[i] = p[j];
      v[i] = v[j];
      i = j;
    }
    p[i] = pri;
    v[i] = id;
  }
  /** Pops the id with the lowest priority (call only when size > 0). */
  pop(): number {
    const p = this.p, v = this.v;
    const top = v[0];
    const lp = p.pop()!, lv = v.pop()!;
    const n = p.length;
    if (n) {
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        if (l >= n) break;
        const r = l + 1;
        const c = r < n && p[r] < p[l] ? r : l;
        if (p[c] >= lp) break;
        p[i] = p[c];
        v[i] = v[c];
        i = c;
      }
      p[i] = lp;
      v[i] = lv;
    }
    return top;
  }
}
