// V-797 · Materialzonen nach KayKit (Georg q213): ein Zonenfeld, gleich in JS (Bewuchs im Worker) und GLSL (Waldboden im Gelände-Shader).
// Wertrauschen mit ganzzahligem Hash (gleiche Bits in JS und WebGL2), zwei Oktaven. zoneN(x, z) ∈ [0, 1]; über ZONE.forest ist Waldzone.
export const ZONE = { scale: 120, forest: 0.56, edge: 0.06, seed: 1103 }

const hash = (ix, iz, s) => { let h = (Math.imul(ix, 73856093) ^ Math.imul(iz, 19349663) ^ s) >>> 0; h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995) >>> 0; h ^= h >>> 15; return (h & 0xffffff) / 16777216 }
const sm = (t) => t * t * (3 - 2 * t)
function vnoise(x, z, s) { const ix = Math.floor(x), iz = Math.floor(z), fx = sm(x - ix), fz = sm(z - iz)
  const a = hash(ix, iz, s), b = hash(ix + 1, iz, s), c = hash(ix, iz + 1, s), d = hash(ix + 1, iz + 1, s)
  return a + (b - a) * fx + (c - a) * fz + (a - b - c + d) * fx * fz }
export const zoneN = (x, z) => 0.7 * vnoise(x / ZONE.scale, z / ZONE.scale, ZONE.seed) + 0.3 * vnoise(x / (ZONE.scale * 0.43), z / (ZONE.scale * 0.43), ZONE.seed + 7)
// Art je Waldmasse (ein Wald = eine Baumfamilie, wie in den KayKit-Samples): sehr grobes Feld
export const speciesN = (x, z) => vnoise(x / 420, z / 420, ZONE.seed + 31)

export const ZONE_GLSL = `
uint kfbZH(int ix, int iz, int s){ uint h = (uint(ix) * 73856093u) ^ (uint(iz) * 19349663u) ^ uint(s); h ^= h >> 13u; h *= 0x5bd1e995u; h ^= h >> 15u; return h & 0xffffffu; }
float kfbZV(vec2 p, int s){ vec2 i = floor(p), f = p - i; f = f * f * (3.0 - 2.0 * f); int x = int(i.x), z = int(i.y);
  float a = float(kfbZH(x, z, s)) / 16777216.0, b = float(kfbZH(x + 1, z, s)) / 16777216.0, c = float(kfbZH(x, z + 1, s)) / 16777216.0, d = float(kfbZH(x + 1, z + 1, s)) / 16777216.0;
  return a + (b - a) * f.x + (c - a) * f.y + (a - b - c + d) * f.x * f.y; }
float kfbZone(vec2 xz){ return 0.7 * kfbZV(xz / ${ZONE.scale.toFixed(1)}, ${ZONE.seed}) + 0.3 * kfbZV(xz / ${(ZONE.scale * 0.43).toFixed(2)}, ${ZONE.seed + 7}); }
`
