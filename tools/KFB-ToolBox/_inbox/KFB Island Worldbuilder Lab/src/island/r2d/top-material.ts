// Speckle transitions on the R2D top surface (R2D v0 island.js `patchTop`, Z. 333–352), with `kfbLayer` swapped for
// S1 `kfbSpeckleLayer` (src/clay/kfb-speckle.ts, Masterplan §7). Same contract: per-vertex weight aTW = (sand, paving,
// rock) → hard clay mask, no gradient, no alpha. Order rock → sand → paving, cells × 1.3 / 1 / 0.8 of uTCell.
// Lab change: the S1 hash uses Hoskins' sine-free hash (fract(sin) loses precision at large world coordinates, plan §4).
import * as THREE from 'three';
import { KFB_SPECKLE_GLSL, speckleThresholds } from '../../clay/kfb-speckle';
import type { R2DPal } from '../../palettes';

/** S1 cell in K2: ¼ MC = 1.6 (Steuerung F4) */
export const SPECKLE_CELL = 1.6;

const HOSKINS_H3 = 'vec3 kfbH3(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yxz + 33.33); return fract((p3.xxy + p3.yzz) * p3.zyx); }';
export const SPECKLE_GLSL_NOSIN = KFB_SPECKLE_GLSL.replace(/vec3 kfbH3\(vec2 p\)\{[^\n]*\}/, HOSKINS_H3);
if (SPECKLE_GLSL_NOSIN === KFB_SPECKLE_GLSL) throw new Error('[r2d] kfbH3 not found in KFB_SPECKLE_GLSL');

let K: number[] | null = null;
export const speckleK = () => (K ??= speckleThresholds());

/** Lauf 03 (MEDIUM): drops are clay blobs, not perfect circle decals: the lookup position is warped by a slow value noise
 *  (a third of a cell); each island has its own offset and cell size (uSO, uTCell), so the two islands never show the
 *  same pattern. Own sine-free hash. */
export const WARP_GLSL = `
float kfbWH(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float kfbVN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(kfbWH(i), kfbWH(i + vec2(1.0, 0.0)), f.x), mix(kfbWH(i + vec2(0.0, 1.0)), kfbWH(i + vec2(1.0, 1.0)), f.x), f.y); }
vec2 kfbWarp2(vec2 p, float cell){ vec2 q = p / (cell * 0.8); return p + cell * 0.34 * vec2(kfbVN(q) - 0.5, kfbVN(q + 19.7) - 0.5); }
vec3 kfbWarp3(vec3 p, float cell){ vec3 q = p / (cell * 0.8); return p + cell * 0.34 * vec3(kfbVN(q.yz) - 0.5, kfbVN(q.xz + 17.3) - 0.5, kfbVN(q.xy + 31.1) - 0.5); }
// one warp offset per pixel, shared by all layers (budget: a warp per layer cost the frame rate)
vec3 kfbWarpV3(vec3 p, float cell){ vec3 q = p / (cell * 0.8); return cell * 0.34 * vec3(kfbVN(q.yz) - 0.5, kfbVN(q.xz + 17.3) - 0.5, kfbVN(q.xy + 31.1) - 0.5); }
vec2 kfbWarpV2(vec2 p, float cell){ vec2 q = p / (cell * 0.8); return cell * 0.34 * vec2(kfbVN(q) - 0.5, kfbVN(q + 19.7) - 0.5); }
`;
/** Lauf 03 (MEDIUM moiré): on the terrain the clay relief fades with the pixel footprint (grazing views, distance), so
 *  its fine taps never beat against the pixel grid; near it is unchanged. Patched into the clay shader of R2D materials only. */
export const reliefFade = (fs: string) => { const a = '  g *= uClayK;'; if (!fs.includes(a)) throw new Error('[r2d] clay relief hook not found'); return fs.replace(a, '  g *= uClayK * 0.35 * mix(0.2, 1.0, lodMid);'); };

/** Lauf 03 (N2): the key light's shadow fades out over the rim roll (aShK 1 on the top → 0 at the roll's end), so the
 *  roll's self-shadow does not end in a hard strip above the body, which takes no shadow (it faces away from the key) */
const rollShadow = (fs: string) => {
  const chunk = THREE.ShaderChunk.lights_fragment_begin, a = '( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ]';
  if (!chunk.includes(a)) throw new Error('[r2d] directional shadow hook not found');
  return fs.replace('#include <lights_fragment_begin>', chunk.replace(a, '( directLight.visible && receiveShadow ) ? ( 1.0 - vShK ) + vShK * getShadow( directionalShadowMap[ i ]'));
};

/** per-island speckle offset and cell size from the seed */
export const speckleSeed = (seed: number) => ({ off: new THREE.Vector3(((seed * 13.7) % 997) + 0.37, ((seed * 7.1) % 991) + 0.61, ((seed * 3.3) % 983) + 0.83), cell: SPECKLE_CELL * (0.9 + 0.22 * ((seed * 0.618034) % 1)) });

/** shader body: three speckle layers over diffuseColor (used by the top surface and, with other weights, the Scholle) */
export const TOP_LAYERS = /* glsl */ `
{ float r1, r2, r3; vec3 kw3 = kfbWarpV3(vWP3, uTCell); vec2 kw2 = kfbWarpV2(vTS, uTCell);
  // rock in 3D (walls and steep peaks would streak with the top-down projection)
  float a = kfbSpeckleLayer3(vWP3 + kw3 * 1.3, uTCell * 1.3, vTW.z, r1); diffuseColor.rgb = mix(diffuseColor.rgb, uTR, a) * (1.0 - 0.10 * r1);
  float b = kfbSpeckleLayer(vTS + 31.7 + kw2, uTCell, vTW.x, r2); diffuseColor.rgb = mix(diffuseColor.rgb, uTS, b) * (1.0 - 0.10 * r2);
  float c = kfbSpeckleLayer(vTS + 57.3 + kw2 * 0.8, uTCell * 0.8, vTW.y, r3); diffuseColor.rgb = mix(diffuseColor.rgb, uTP, c) * (1.0 - 0.12 * r3); }`;

/**
 * Patch a clay material (clayMaterial('terrain', …)) with the speckle layers. `body` replaces the default three-layer
 * block (the Scholle uses its own: grass → earth by depth). Uniform colours come from the R2D palette (ENV_ROLES).
 */
export function patchSpeckle(m: THREE.Material, pal: R2DPal, key: string, body = TOP_LAYERS, seed = 0): THREE.Material {
  const ss = speckleSeed(seed);
  const PU = {
    uTS: { value: new THREE.Color(pal.sand) }, uTP: { value: new THREE.Color(pal.paved) }, uTR: { value: new THREE.Color(pal.rock) },
    uTG: { value: new THREE.Color(pal.lip) }, uTCell: { value: ss.cell }, uSO: { value: ss.off }, uSpeckleK: { value: speckleK() }, uSpeckleK3: { value: speckleK3() },
  };
  const ob = m.onBeforeCompile.bind(m), ck = m.customProgramCacheKey.bind(m);
  m.onBeforeCompile = (sh, r) => {
    ob(sh, r);
    Object.assign(sh.uniforms, PU);
    sh.vertexShader = 'uniform vec3 uSO; attribute vec3 aTW; attribute float aAO; attribute float aShK; varying vec3 vTW; varying vec2 vTS; varying vec3 vWP3; varying float vAO; varying float vShK;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vTW = aTW; vAO = aAO; vShK = aShK; vWP3 = (modelMatrix * vec4(position, 1.0)).xyz + uSO; vTS = vWP3.xz;');
    sh.fragmentShader = 'uniform vec3 uTS, uTP, uTR, uTG; uniform float uTCell; varying vec3 vTW; varying vec2 vTS; varying vec3 vWP3; varying float vAO; varying float vShK;\n' + SPECKLE_GLSL_NOSIN + SPECKLE3_GLSL + WARP_GLSL
      + rollShadow(reliefFade(sh.fragmentShader)).replace('#include <color_fragment>', '#include <color_fragment>\n' + body + '\n diffuseColor.rgb *= vAO;');
  };
  m.customProgramCacheKey = () => ck() + '-r2d-s1-ao-warp-rollsh-' + key;
  m.userData.speckle = PU;
  return m;
}

/*
 * 3D variant of the S1 disk field for steep surfaces (Scholle under the rim): spheres in 3D cells instead of disks in a
 * 2D grid, so the drops stay round on any face orientation, without projection streaks or a seam around the island.
 * Same levels, cells and weights as kfbSpeckleLayer; its own quantile table (the 3D field has another distribution).
 */
function h3js(x: number, y: number, z: number): [number, number, number, number] {
  let p = [x * 0.1031 % 1, y * 0.103 % 1, z * 0.0973 % 1].map((v) => v - Math.floor(v));
  const d = p[0] * (p[1] + 33.33) + p[1] * (p[0] + 33.33) + p[2] * (p[2] + 33.33);
  p = p.map((v) => v + d);
  const f = (v: number) => v - Math.floor(v);
  return [f((p[0] + p[1]) * p[2]), f((p[0] + p[2]) * p[1]), f((p[1] + p[2]) * p[0]), f((p[2] + p[0]) * p[2] * 1.37)];
}
function diskField3(x: number, y: number, z: number, seed: number) {
  const bx = Math.floor(x), by = Math.floor(y), bz = Math.floor(z);
  let F = -1e9;
  for (let k = -1; k <= 1; k++) for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const cx = bx + i, cy = by + j, cz = bz + k, h = h3js(cx + seed, cy + seed, cz + seed), h2 = h3js(cx + seed + 7.3, cy + seed + 7.3, cz + seed + 7.3);
    const px = cx + 0.15 + 0.7 * h[0], py = cy + 0.15 + 0.7 * h[1], pz = cz + 0.15 + 0.7 * h[2], r = 0.28 + 0.32 * h[3], ht = 0.45 + 0.55 * h2[0];
    F = Math.max(F, ht * (1 - Math.hypot(x - px, y - py, z - pz) / r));
  }
  return F;
}
let K3: number[] | null = null;
export function speckleK3(samples = 30000): number[] {
  if (K3) return K3;
  const v: number[] = [], R = (n: number) => { const s = Math.sin(n * 12.9898) * 43758.5453; return s - Math.floor(s); };
  for (let n = 0; n < samples; n++) v.push(diskField3(R(n) * 61, R(n + 0.5) * 61, R(n + 0.25) * 61, 17));
  v.sort((a, b) => a - b);
  const STEPS = 64;
  K3 = [...Array(STEPS).keys()].map((i) => v[Math.min(v.length - 1, Math.max(0, Math.round((1 - i / (STEPS - 1)) * (v.length - 1))))]);
  return K3;
}
// sphere radii 0.28–0.60 = S1 disk radii 1:1 (larger radii made bigger, ring-shaped drops at the lip)
export const SPECKLE3_GLSL = /* glsl */ `
uniform float uSpeckleK3[64];
vec4 kfbH4(vec3 q){ vec3 p3 = fract(q * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yxz + 33.33);
  return vec4(fract((p3.xxy + p3.yzz) * p3.zyx), fract((p3.z + p3.x) * p3.z * 1.37)); }
float kfbDiskField3(vec3 x, float seed){ vec3 b = floor(x); float F = -1e9;
  for (int k = -1; k <= 1; k++) for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec3 c = b + vec3(float(i), float(j), float(k)); vec4 h = kfbH4(c + seed); float ht = 0.45 + 0.55 * kfbH4(c + seed + 7.3).x;
    vec3 p = c + 0.15 + 0.7 * h.xyz; float r = 0.28 + 0.32 * h.w; F = max(F, ht * (1.0 - length(x - p) / r)); }
  return F; }
float kfbSpeckleK3(float w){ float t = clamp(w, 0.0, 1.0) * 63.0; int i = int(floor(t)); int j = min(i + 1, 63); return mix(uSpeckleK3[i], uSpeckleK3[j], fract(t)); }
// No early returns before fwidth(): derivatives in divergent control flow are undefined and drew a dashed rim line along
// the w = 0.999 isoline. Field and derivatives are evaluated on every path; w only selects afterwards.
float kfbSpeckle3(vec3 su, float cell, float seed, float w){
  float F = kfbDiskField3(su / cell, seed); float k = kfbSpeckleK3(w); float fw = max(fwidth(F), 1e-4);
  float m = smoothstep(k - fw, k + fw, F);
  return w <= 0.001 ? 0.0 : w >= 0.999 ? 1.0 : m; }
// the quantile table comes from 30 k JS samples: its extreme end (w → 1) is not the true field minimum, which left tiny
// holes along the onset line. The top 4 % of w count as solid, so holes start inside the reliable part of the table.
/** pixel size of one cell (3D twin of kfbSpeckleLod): fine levels fade once a cell gets smaller than a few pixels */
float kfbSpeckleLod3(vec3 p, float cell){ vec3 g = fwidth(p / cell); return clamp((0.35 - max(g.x, max(g.y, g.z))) / 0.2, 0.0, 1.0); }
float kfbSpeckleLayer3(vec3 p, float cell, float w0, out float rim){
  float w = clamp(w0 / 0.96, 0.0, 1.0), w15 = w * sqrt(w), v = 1.0 - w, v15 = v * sqrt(v);
  float a = kfbSpeckle3(p, cell, 17.0, w);
  float m = kfbSpeckle3(p + 13.1, cell * 0.42, 29.0, smoothstep(0.0, 0.95, w15) * 0.5);
  float s = kfbSpeckle3(p + 27.7, cell * 0.2, 41.0, smoothstep(0.0, 0.7, w15) * 0.32);
  float u = kfbSpeckle3(p + 51.9, cell * 0.09, 53.0, smoothstep(0.0, 0.6, w15) * 0.22) * kfbSpeckleLod3(p, cell * 0.09);
  float b = kfbSpeckle3(p + 41.3, cell * 0.36, 67.0, smoothstep(0.0, 0.95, v15) * 0.42);
  float b2 = kfbSpeckle3(p + 63.7, cell * 0.16, 79.0, smoothstep(0.0, 0.8, v15) * 0.25) * kfbSpeckleLod3(p, cell * 0.16);
  float sel = max(max(a, m), max(s, u)) * (1.0 - max(b, b2));   // all six S1 levels (micro dots, small drop-backs)
  sel = w <= 0.001 ? 0.0 : w >= 0.999 ? 1.0 : sel;
  rim = clamp(fwidth(sel) * 0.9, 0.0, 1.0); return sel; }
`;

/** Scholle: grass of the rim roll runs down into the earth body as speckle (weight aGW from the depth under the rim). */
export function patchScholle(m: THREE.Material, pal: R2DPal, strata: [string, string, string] = [pal.earth, pal.earthDark, pal.earthDark], rock = pal.rock, map?: { tex: THREE.Texture; box: { minX: number; minZ: number; W: number } }, seed = 0): THREE.Material {
  const ss = speckleSeed(seed);
  const PU = { uGMap: { value: map?.tex ?? null }, uGBox: { value: new THREE.Vector3(map?.box.minX ?? 0, map?.box.minZ ?? 0, map?.box.W ?? 1) }, uS1: { value: new THREE.Color(strata[1]) }, uS2: { value: new THREE.Color(strata[2]) }, uSR: { value: new THREE.Color(rock) },
    uTCell: { value: ss.cell }, uSO: { value: ss.off }, uSpeckleK3: { value: speckleK3() }, uDbg: { value: Number(new URLSearchParams(location.search).get('dbgScholle') ?? 0) } };
  const ob = m.onBeforeCompile.bind(m), ck = m.customProgramCacheKey.bind(m);
  m.onBeforeCompile = (sh, r) => {
    ob(sh, r);
    Object.assign(sh.uniforms, PU);
    // aGC = the colour map's grass at the same rim point (linear): the body's grass continues the roll without a step
    sh.vertexShader = 'uniform vec3 uSO; attribute float aGW; attribute float aAO; varying float vAO; attribute vec3 aST; attribute vec3 aGC; varying float vGW; varying vec3 vST; varying vec3 vGC; varying vec3 vWP; varying vec2 vLP;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vAO = aAO; vGW = aGW; vST = aST; vGC = aGC; vLP = position.xz; vWP = (modelMatrix * vec4(position, 1.0)).xyz + uSO;');
    sh.fragmentShader = 'varying float vAO; uniform vec3 uS1, uS2, uSR; uniform float uTCell; uniform float uDbg; uniform sampler2D uGMap; uniform vec3 uGBox; varying float vGW; varying vec3 vST; varying vec3 vGC; varying vec3 vWP; varying vec2 vLP;\n' + WARP_GLSL + SPECKLE3_GLSL
      + reliefFade(sh.fragmentShader).replace('#include <color_fragment>', `#include <color_fragment>
{ float r0, r1, r2, r3; vec3 kw = kfbWarpV3(vWP, uTCell);
  float l1 = kfbSpeckleLayer3(vWP + 91.7 + kw * 1.5, uTCell * 4.0, vST.x, r0); diffuseColor.rgb = mix(diffuseColor.rgb, uS1, l1) * (1.0 - 0.10 * r0);
  float l2 = kfbSpeckleLayer3(vWP + 47.3 + kw * 1.5, uTCell * 4.0, vST.y, r1); diffuseColor.rgb = mix(diffuseColor.rgb, uS2, l2) * (1.0 - 0.10 * r1);
  float rk = kfbSpeckleLayer3(vWP + 13.9 + kw * 1.3, uTCell * 2.0, vST.z, r2); diffuseColor.rgb = mix(diffuseColor.rgb, uSR, rk) * (1.0 - 0.10 * r2);
  float g = kfbSpeckleLayer3(vWP + kw, uTCell, vGW, r3);
  if (uDbg > 0.5 && uDbg < 2.5) { g = uDbg < 1.5 ? 1.0 : 0.0; r3 = 0.0; }
  // grass = the top's colour map at the same x/z (same patch as the roll above, hard patch edges, no vertex interpolation)
  vec3 gc = ${map ? 'texture2D(uGMap, (vLP - uGBox.xy) / uGBox.z).rgb' : 'vGC'};   // sRGB texture: WebGL2 decodes to linear on sampling
  diffuseColor.rgb = mix(diffuseColor.rgb, gc, g) * (1.0 - 0.10 * r3);
  diffuseColor.rgb *= vAO;
  if (uDbg > 2.5 && uDbg < 3.5) diffuseColor.rgb = vec3(vGW);
  if (uDbg > 4.5) diffuseColor.rgb = vec3(vAO); }`);
  };
  m.customProgramCacheKey = () => ck() + '-r2d-scholle-s1-strata-ao-warp' + (map ? '-map' : '');
  return m;
}
