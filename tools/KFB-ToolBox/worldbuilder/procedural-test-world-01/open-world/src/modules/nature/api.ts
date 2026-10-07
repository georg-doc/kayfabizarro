// Public, pure canopy queries (used by the camera to stay below the canopy in forests).
// A CanopyIndex holds the crowns of the loaded chunks in a coarse 8 m grid; queries touch only a few cells.

/** Crown record: centre (x, z), radius r (m), base = world y of the lowest foliage. */
export interface Crown { x: number; z: number; r: number; base: number }

const CELL = 8;
/** Largest crown radius we index (m); queries search this far beyond their own radius. */
const MAX_R = 6;

export class CanopyIndex {
  private grid = new Map<number, Map<string, number[]>>();
  private owned = new Map<string, number[]>();

  private static key(ix: number, iz: number): number {
    return (ix + 32768) * 65536 + (iz + 32768);
  }

  /** Register a chunk's crowns (flat [x, z, r, base, …]); replaces any earlier entry of that chunk. */
  set(chunkKey: string, crowns: number[]): void {
    this.remove(chunkKey);
    const keys: number[] = [];
    const per = new Map<number, number[]>();
    for (let i = 0; i < crowns.length; i += 4) {
      const k = CanopyIndex.key(Math.floor(crowns[i] / CELL), Math.floor(crowns[i + 1] / CELL));
      let a = per.get(k);
      if (!a) per.set(k, (a = []));
      a.push(crowns[i], crowns[i + 1], crowns[i + 2], crowns[i + 3]);
    }
    for (const [k, a] of per) {
      let m = this.grid.get(k);
      if (!m) this.grid.set(k, (m = new Map()));
      m.set(chunkKey, a);
      keys.push(k);
    }
    this.owned.set(chunkKey, keys);
  }

  remove(chunkKey: string): void {
    const keys = this.owned.get(chunkKey);
    if (!keys) return;
    for (const k of keys) {
      const m = this.grid.get(k);
      m?.delete(chunkKey);
      if (m && !m.size) this.grid.delete(k);
    }
    this.owned.delete(chunkKey);
  }

  /** Visit crowns whose disk intersects the disk (x, z, radius). */
  forEach(x: number, z: number, radius: number, fn: (cx: number, cz: number, r: number, base: number) => void): void {
    const reach = radius + MAX_R;
    const x0 = Math.floor((x - reach) / CELL), x1 = Math.floor((x + reach) / CELL);
    const z0 = Math.floor((z - reach) / CELL), z1 = Math.floor((z + reach) / CELL);
    for (let iz = z0; iz <= z1; iz++)
      for (let ix = x0; ix <= x1; ix++) {
        const m = this.grid.get(CanopyIndex.key(ix, iz));
        if (!m) continue;
        for (const a of m.values())
          for (let i = 0; i < a.length; i += 4) {
            const rr = a[i + 2] + radius;
            if ((a[i] - x) ** 2 + (a[i + 1] - z) ** 2 < rr * rr) fn(a[i], a[i + 1], a[i + 2], a[i + 3]);
          }
      }
  }
}

/**
 * Lowest crown-base world height (y) of the trees whose crowns overlap the disk of `radius` around (x, z), or null when
 * the sky is open there.
 */
export function canopyBaseAt(index: CanopyIndex, x: number, z: number, radius = 3): number | null {
  let lo = Infinity;
  index.forEach(x, z, radius, (_x, _z, _r, base) => {
    if (base < lo) lo = base;
  });
  return lo === Infinity ? null : lo;
}

const RING = Array.from({ length: 12 }, (_, k) => [Math.cos((k * Math.PI) / 6), Math.sin((k * Math.PI) / 6)]);

/** Local canopy cover 0..1: fraction of 19 sample points (centre, rings at 3 m and 6 m) that lie under a crown. */
export function inForest(index: CanopyIndex, x: number, z: number): number {
  const pts: [number, number][] = [[x, z]];
  for (let k = 0; k < 6; k++) pts.push([x + RING[k * 2][0] * 3, z + RING[k * 2][1] * 3]);
  for (let k = 0; k < 12; k++) pts.push([x + RING[k][0] * 6, z + RING[k][1] * 6]);
  const crowns: number[] = [];
  index.forEach(x, z, 6, (cx, cz, r) => void crowns.push(cx, cz, r));
  let n = 0;
  for (const [px, pz] of pts) {
    for (let i = 0; i < crowns.length; i += 3)
      if ((crowns[i] - px) ** 2 + (crowns[i + 1] - pz) ** 2 < crowns[i + 2] * crowns[i + 2]) { n++; break; }
  }
  return n / pts.length;
}
