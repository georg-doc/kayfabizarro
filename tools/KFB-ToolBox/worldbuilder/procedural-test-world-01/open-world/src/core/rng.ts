// Deterministic randomness. World code must use only this (never Math.random).

/** 32-bit integer hash of any number of integers (murmur3-style finaliser). */
export function hash(...v: number[]): number {
  let h = 0x9e3779b9 | 0;
  for (let i = 0; i < v.length; i++) {
    let k = Math.imul((v[i] | 0) ^ (i * 0x27d4eb2d), 0xcc9e2d51);
    k = (k << 15) | (k >>> 17);
    k = Math.imul(k, 0x1b873593);
    h ^= k;
    h = (h << 13) | (h >>> 19);
    h = (Math.imul(h, 5) + 0xe6546b64) | 0;
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/** Uniform [0,1) from integer inputs. */
export function rand01(...v: number[]): number {
  return hash(...v) / 4294967296;
}

/** Pick an element deterministically. */
export function pick<T>(arr: readonly T[], ...v: number[]): T {
  return arr[hash(...v) % arr.length];
}

/** Sequential PRNG for local loops (seed from hash()). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** String → int, for named sub-seeds ("roads", "rivers"…). */
export function strSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;
const GRAD = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];

/** Seeded 2-D simplex noise in [-1, 1]. */
export function simplex2(seed: number, x: number, y: number): number {
  const s = (x + y) * F2;
  const i = Math.floor(x + s), j = Math.floor(y + s);
  const t = (i + j) * G2;
  const x0 = x - (i - t), y0 = y - (j - t);
  const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
  const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
  let n = 0;
  const c = (gx: number, gy: number, dx: number, dy: number) => {
    let tt = 0.5 - dx * dx - dy * dy;
    if (tt < 0) return 0;
    const g = GRAD[hash(seed, gx, gy) & 7];
    tt *= tt;
    return tt * tt * (g[0] * dx + g[1] * dy);
  };
  n += c(i, j, x0, y0);
  n += c(i + i1, j + j1, x1, y1);
  n += c(i + 1, j + 1, x2, y2);
  return 70 * n;
}

/** Fractal simplex, roughly [-1, 1]. */
export function fbm2(seed: number, x: number, y: number, octaves = 4, lac = 2, gain = 0.5): number {
  let amp = 1, freq = 1, sum = 0, norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * simplex2(seed + o * 1013, x * freq, y * freq);
    norm += amp;
    amp *= gain;
    freq *= lac;
  }
  return sum / norm;
}
