// Hot-path copies of src/core/rng.ts for the terrain generator — BIT-IDENTICAL results (same integer ops, same float
// expression order), but fixed arity: no rest-argument arrays, no per-call closures, no GRAD sub-arrays.
// core/rng stays the source of truth; gen.ts only uses these where they are called per cell. Any change in rng.ts must
// be mirrored here (the identity check in NOTES.md "Perf pass" compares the two).

// per-position salts of hash(): (i * 0x27d4eb2d) as int32
const X1 = (1 * 0x27d4eb2d) | 0;
const X2 = (2 * 0x27d4eb2d) | 0;
const X3 = (3 * 0x27d4eb2d) | 0;

function mix(h: number, v: number): number {
  let k = Math.imul(v, 0xcc9e2d51);
  k = (k << 15) | (k >>> 17);
  k = Math.imul(k, 0x1b873593);
  h ^= k;
  h = (h << 13) | (h >>> 19);
  return (Math.imul(h, 5) + 0xe6546b64) | 0;
}

function fin(h: number): number {
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/** === hash(a, b, c) */
export function hash3(a: number, b: number, c: number): number {
  let h = 0x9e3779b9 | 0;
  h = mix(h, a | 0);
  h = mix(h, (b | 0) ^ X1);
  h = mix(h, (c | 0) ^ X2);
  return fin(h);
}

/** === hash(a, b, c, d) */
export function hash4(a: number, b: number, c: number, d: number): number {
  let h = 0x9e3779b9 | 0;
  h = mix(h, a | 0);
  h = mix(h, (b | 0) ^ X1);
  h = mix(h, (c | 0) ^ X2);
  h = mix(h, (d | 0) ^ X3);
  return fin(h);
}

const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;
const G2x2 = 2 * G2;
const GX = [1, -1, 1, -1, 1, -1, 0, 0];
const GY = [1, 1, -1, -1, 0, 0, 1, -1];

/** === simplex2(seed, x, y) */
export function simplex2(seed: number, x: number, y: number): number {
  const s = (x + y) * F2;
  const i = Math.floor(x + s), j = Math.floor(y + s);
  const t = (i + j) * G2;
  const x0 = x - (i - t), y0 = y - (j - t);
  const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
  const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + G2x2, y2 = y0 - 1 + G2x2;
  // n starts at +0 and a skipped corner adds +0 in the original: skipping the add is exact
  let n = 0;
  let tt = 0.5 - x0 * x0 - y0 * y0;
  if (!(tt < 0)) {
    const g = hash3(seed, i, j) & 7;
    tt *= tt;
    n += tt * tt * (GX[g] * x0 + GY[g] * y0);
  }
  tt = 0.5 - x1 * x1 - y1 * y1;
  if (!(tt < 0)) {
    const g = hash3(seed, i + i1, j + j1) & 7;
    tt *= tt;
    n += tt * tt * (GX[g] * x1 + GY[g] * y1);
  }
  tt = 0.5 - x2 * x2 - y2 * y2;
  if (!(tt < 0)) {
    const g = hash3(seed, i + 1, j + 1) & 7;
    tt *= tt;
    n += tt * tt * (GX[g] * x2 + GY[g] * y2);
  }
  return 70 * n;
}

/** === fbm2(seed, x, y, octaves, lac, gain) */
export function fbm2(seed: number, x: number, y: number, octaves: number, lac: number, gain: number): number {
  let amp = 1, freq = 1, sum = 0, norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * simplex2(seed + o * 1013, x * freq, y * freq);
    norm += amp;
    amp *= gain;
    freq *= lac;
  }
  return sum / norm;
}

// ---------------------------------------------------------------- pre-mixed seeds (hot paths)
// hash(seed, i, j) = fin(mix(mix(mix(H0, seed), i ^ X1), j ^ X2)): the seed stage is constant per noise field and the
// i stage is shared by the corners with the same i → 5 mixes per simplex instead of 9. Still bit-identical.

/** Seed state for simplex2m / Fbm: === the first mixing stage of hash(seed, …). */
export function seedMix(seed: number): number {
  return mix(0x9e3779b9 | 0, seed | 0);
}

/** === simplex2(seed, x, y) with hs = seedMix(seed). */
export function simplex2m(hs: number, x: number, y: number): number {
  const s = (x + y) * F2;
  const i = Math.floor(x + s), j = Math.floor(y + s);
  const t = (i + j) * G2;
  const x0 = x - (i - t), y0 = y - (j - t);
  const up = x0 > y0;
  const i1 = up ? 1 : 0, j1 = up ? 0 : 1;
  const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + G2x2, y2 = y0 - 1 + G2x2;
  const t0 = 0.5 - x0 * x0 - y0 * y0;
  const t1 = 0.5 - x1 * x1 - y1 * y1;
  const t2 = 0.5 - x2 * x2 - y2 * y2;
  const c0 = !(t0 < 0), c1 = !(t1 < 0), c2 = !(t2 < 0);
  // i-stage states: column i (corner 0, and corner 1 when it moves in j) and column i+1 (corner 2, corner 1 when up)
  const hA = c0 || (c1 && !up) ? mix(hs, (i | 0) ^ X1) : 0;
  const hB = c2 || (c1 && up) ? mix(hs, ((i + 1) | 0) ^ X1) : 0;
  let n = 0;
  let tt: number;
  if (c0) {
    const g = fin(mix(hA, (j | 0) ^ X2)) & 7;
    tt = t0 * t0;
    n += tt * tt * (GX[g] * x0 + GY[g] * y0);
  }
  if (c1) {
    const g = (up ? fin(mix(hB, (j | 0) ^ X2)) : fin(mix(hA, ((j + 1) | 0) ^ X2))) & 7;
    tt = t1 * t1;
    n += tt * tt * (GX[g] * x1 + GY[g] * y1);
  }
  if (c2) {
    const g = fin(mix(hB, ((j + 1) | 0) ^ X2)) & 7;
    tt = t2 * t2;
    n += tt * tt * (GX[g] * x2 + GY[g] * y2);
  }
  return 70 * n;
}

/** === fbm2(seed, x, y, octaves, lac, gain) with all per-octave constants precomputed. */
export class Fbm {
  private hs: number[] = [];
  private amp: number[] = [];
  private freq: number[] = [];
  private norm: number;
  constructor(seed: number, private octaves: number, lac: number, gain: number) {
    let amp = 1, freq = 1, norm = 0;
    for (let o = 0; o < octaves; o++) {
      this.hs.push(seedMix(seed + o * 1013));
      this.amp.push(amp);
      this.freq.push(freq);
      norm += amp;
      amp *= gain;
      freq *= lac;
    }
    this.norm = norm;
  }
  at(x: number, y: number): number {
    let sum = 0;
    for (let o = 0; o < this.octaves; o++) {
      const f = this.freq[o];
      sum += this.amp[o] * simplex2m(this.hs[o], x * f, y * f);
    }
    return sum / this.norm;
  }
}
