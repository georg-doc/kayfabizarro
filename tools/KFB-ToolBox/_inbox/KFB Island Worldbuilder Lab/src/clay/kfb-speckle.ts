// KFB speckle transition, candidate S1 (2026-10-09). Same contract as kfbBlend/kfbLayer (per-vertex weight w → hard
// clay mask), but the field is a max of discrete jittered clay disks instead of a difference of summed Gaussians:
// iso-contours stay unions of round drops (scalloped, "spilled paint") instead of merging into amorphous areas.
// Disks are fixed in the world (a splash does not change size when you walk closer); only the finest dot level fades out
// once it gets smaller than a few pixels. Edges are anti-aliased with fwidth. Research: docs/research/NOTEBOOKLM_P1_*.

/** quantile table: k such that coverage{F > k} ≈ w, sampled from the same field (64 steps, w = 0 … 1) */
export const SPECKLE_STEPS = 64;

const fract = (v: number) => v - Math.floor(v);
const h3 = (x: number, y: number): [number, number, number] => [
  fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453),
  fract(Math.sin(x * 269.5 + y * 183.3) * 43758.5453),
  fract(Math.sin(x * 419.2 + y * 371.9) * 43758.5453),
];

/** JS twin of kfbDiskField (GLSL below), used only for calibration */
function diskField(x: number, y: number, seed: number): number {
  x += 0.18 * Math.sin(y * 1.7 + seed); y += 0.18 * Math.cos(x * 1.9 + seed);
  const bx = Math.floor(x), by = Math.floor(y);
  let F = -1e9;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const cx = bx + i, cy = by + j, h = h3(cx + seed, cy + seed), h2 = h3(cx + seed + 7.3, cy + seed + 7.3);
    const px = cx + 0.15 + 0.7 * h[0], py = cy + 0.15 + 0.7 * h[1], r = 0.28 + 0.32 * h[2], ht = 0.45 + 0.55 * h2[0];
    F = Math.max(F, ht * (1 - Math.hypot(x - px, y - py) / r));
  }
  return F;
}

/** k(w) for w = i / (STEPS − 1); coverage of {F > k} is w */
export function speckleThresholds(samples = 40000): number[] {
  const v: number[] = [];
  for (let n = 0; n < samples; n++) v.push(diskField(fract(Math.sin(n * 12.9898) * 43758.5453) * 97.0, fract(Math.sin(n * 78.233) * 43758.5453) * 97.0, 17.0));
  v.sort((a, b) => a - b);
  const k: number[] = [];
  for (let i = 0; i < SPECKLE_STEPS; i++) {
    const w = i / (SPECKLE_STEPS - 1);
    k.push(v[Math.min(v.length - 1, Math.max(0, Math.round((1 - w) * (v.length - 1))))]);
  }
  return k;
}

export const KFB_SPECKLE_GLSL = /* glsl */ `
uniform float uSpeckleK[${SPECKLE_STEPS}];
vec3 kfbH3(vec2 p){ vec3 q = vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9))); return fract(sin(q) * 43758.5453); }
float kfbDiskField(vec2 x, float seed){
  x += 0.18 * vec2(sin(x.y * 1.7 + seed), cos(x.x * 1.9 + seed));
  vec2 b = floor(x); float F = -1e9;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 c = b + vec2(float(i), float(j)); vec3 h = kfbH3(c + seed); float ht = 0.45 + 0.55 * kfbH3(c + seed + 7.3).x;
    vec2 p = c + 0.15 + 0.7 * h.xy; float r = 0.28 + 0.32 * h.z;
    F = max(F, ht * (1.0 - length(x - p) / r)); }
  return F; }
float kfbSpeckleK(float w){ float t = clamp(w, 0.0, 1.0) * ${SPECKLE_STEPS - 1}.0; int i = int(floor(t)); int j = min(i + 1, ${SPECKLE_STEPS - 1});
  return mix(uSpeckleK[i], uSpeckleK[j], fract(t)); }
/** one level: mask 0..1 (anti-aliased hard clay edge), rim 0..1 for the slight edge darkening */
float kfbSpeckle(vec2 su, float cell, float seed, float w, out float rim){ rim = 0.0; if (w <= 0.001) return 0.0; if (w >= 0.999) return 1.0;
  float F = kfbDiskField(su / cell, seed); float k = kfbSpeckleK(w); float fw = max(fwidth(F), 1e-4);
  rim = 1.0 - smoothstep(fw, 4.0 * fw + 0.03, abs(F - k)); return smoothstep(k - fw, k + fw, F); }
/** pixel size of one cell of this level: > 1 means the level is still drawable */
float kfbSpeckleLod(vec2 su, float cell){ vec2 g = fwidth(su / cell); return clamp((0.35 - max(g.x, g.y)) / 0.2, 0.0, 1.0); }
/** three sizes outward + micro dots near the camera, drops of the base back in two sizes. The rim is taken from the
 *  final mask only (1–2 px at the visible edge), so hidden disks never draw ghost outlines. Small levels thin out with
 *  w^1.5 so the outermost dots get sparse instead of ending on a line. */
float kfbSpeckleLayer(vec2 p, float cell, float w, out float rim){ rim = 0.0; if (w <= 0.001) return 0.0; if (w >= 0.999) return 1.0;
  float r; float w15 = w * sqrt(w), v = 1.0 - w, v15 = v * sqrt(v);
  float a = kfbSpeckle(p, cell, 17.0, w, r);
  float m = kfbSpeckle(p + 13.1, cell * 0.42, 29.0, smoothstep(0.0, 0.95, w15) * 0.5, r);
  float s = kfbSpeckle(p + 27.7, cell * 0.2, 41.0, smoothstep(0.0, 0.7, w15) * 0.32, r);
  float u = kfbSpeckle(p + 51.9, cell * 0.09, 53.0, smoothstep(0.0, 0.6, w15) * 0.22, r) * kfbSpeckleLod(p, cell * 0.09);
  float b = kfbSpeckle(p + 41.3, cell * 0.36, 67.0, smoothstep(0.0, 0.95, v15) * 0.42, r);
  float b2 = kfbSpeckle(p + 63.7, cell * 0.16, 79.0, smoothstep(0.0, 0.8, v15) * 0.25, r) * kfbSpeckleLod(p, cell * 0.16);
  float sel = max(max(a, m), max(s, u)) * (1.0 - max(b, b2));
  rim = clamp(fwidth(sel) * 0.9, 0.0, 1.0); return sel; }
`;
