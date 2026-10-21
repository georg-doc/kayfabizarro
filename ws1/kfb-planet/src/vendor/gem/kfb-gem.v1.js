/*
 * MIT License
 *
 * Copyright (c) 2026 AmethystineAlpaca
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Portions ported from Morph Chess (MIT, (c) 2026 AmethystineAlpaca):
 *   pieces/ruby/material.js     ray-traced gemstone (refraction 1/1.76, Schlick fresnel .076, internal reflections,
 *                               Beer-Lambert absorption, lathe-profile span intersection, blurred low-energy tail)
 *   pieces/ruby/cut-ruby.js     deep-cut absorption tuning, dimmed front reflection
 *   pieces/ruby/glow-veins.js / vein-atlas.js / baked-veins.js   idea of fixed mineral veins (the baked per-geometry atlas
 *                               is not portable to KFB meshes; replaced by a procedural 3D vein field, see below)
 *   pieces/ruby/fracture-geometry.js   seeded plane splitting of the real closed surface with stitched caps
 *   pieces/ruby/fracture-motion.js     baked deterministic floor-contact motion (here: short cartoon version)
 *   pieces/night-oath/metal.js  isolated reflection studio rendered once into an environment (here: PMREM from the
 *                               KFB light mood's own sky colours, V-378-style, plus the jewelry-studio card layout)
 *   play/capture-effect.js      capture timing / fade idea
 * Audio from Morph Chess is NOT used (its glass recording is CC BY-NC; KFB allows CC0 only).
 */
/* KFB Gem v1 · kfb-gem.v1 · crystalline gemstone material for the chess pieces of set M (V-460, WS0 GEM_R1, 18.10.2026)
 *
 * A deliberate style break against the clay world, tuned to sit in it:
 *   - lit by the ONE KFB rig (kfb-stage-light: sun + hemisphere + figure light, shadows) through three's physical lighting:
 *     a dim tinted "hard candy" body takes the sun / violet fill like everything else, so no face goes black;
 *   - on top: faceted normals (cut look on any smooth hull), a traced interior (refraction, 2 internal bounces against a
 *     lathe proxy of the piece, Beer-Lambert absorption, Morph Chess formulas), procedural inner veins seen through the
 *     refracted ray (parallax), a slow 0.2 Hz pulse, and an environment reflection from a small PMREM that is built from the
 *     current mood's sky colours (no own lights; at night the environment is dark and only the veins glow softly).
 *
 * API (three r180, THREE passed in, like the other KFB vendor modules):
 *   const gem = createGem({ THREE, tint, depthTint, veins = true, seed, preset })   // preset 'ruby' | 'sapphire'
 *     gem.material         the shared idle material of this colour (one per tint/depthTint/veins key, shared by every handle)
 *     gem.apply(object3d)  every mesh below gets the gem material (+ a per-geometry attribute kfbGem: lathe-proxy row, height)
 *     gem.setState(s)      'idle' | 'active' | 'moving' | 'captured' (captured = cartoon shatter, <= 1.2 s, then hidden)
 *     gem.update(dt)       advances time (pulse, shimmer, shatter); deterministic, no clock reads
 *     gem.dispose()
 *     gem.setEnvironment(renderer, mood, { ground })   = setGemEnvironment for all gems of this THREE
 *     gem.getPracticalLight()   r2, option lantern: true: { id, type:'crystal', pos:[x,y,z] m, color, intensity, range, flicker:null } in the
 *                               practicals format of kfb-stage-light createPracticals (V-385: one rig; WS1 decides whether it becomes a real
 *                               pool light), intensity follows the mood glow and the same pulse as the shader; null without lantern
 * r2 (Georg TUNE 18.10.: night = pulsing, morphing lanterns): vein + inner glow scale with the mood's glow weight (MOODS_MESA glow: day 0
 *   = unchanged, dusk 0.4, night 1 = clearly luminous through emissive alone, no bloom); the pulse slows from 0.2 Hz (day) to 0.12 Hz
 *   (night) with more amplitude; at night facets and veins drift slowly (idle morph). The mood comes in through setGemEnvironment.
 * r3 (Georg: "lit from outside, not glowing from inside"; reference = Whackman torches): with the mood glow the stone becomes self-luminous:
 *   outside shading (sun/hemi diffuse, highlights, environment through the stone) is turned down, a hot core (white-gold / white-ice)
 *   dominates and falls off to a DARKER rim (inverted fresnel); the core follows the anatomy through a per-vertex thinness field
 *   (voxelised hull, inscribed radius along the inward normal -> kfbGem.w): crown points, spikes, ears, slit and waist burn brightest,
 *   the thick base glows least; small flame-like flicker over the slow pulse, warmer/brighter toward the top (heat gradient);
 *   option halo: true = one soft additive billboard per piece (1.3 x silhouette, very low alpha, mood-scaled, 0 by day), no post-processing.
 * r4 (WS0/Georg: torch reading): option pool: true = additive light pool on the floor under each piece (mood x pulse x flicker); the
 *   night pulse never drops below an ember (0.8..1.55); veins become light channels in the glow colour; outside specular 12 %, diffuse 30 %.
 *   setGemEnvironment({ THREE, renderer, mood, ground })  mood = kfb-stage-light moodAt(tod, MOODS_MESA) (or a MOODS entry)
 *   gemPresetForSide(side)   'white' | 'light' -> 'ruby', 'black' | 'dark' -> 'sapphire'
 *   options: quality 'game' (default: 1 traced internal bounce + the blurred Morph Chess tail) | 'high' (2 bounces, stills only);
 *            facet, interior, body, veinGlow, innerGlow, density, roughness (look tuning; defaults = presets)
 * Cost (GEM_R1 probe, M1 Max, headless ANGLE/Metal, warm GPU, 1600 x 1200, 32 pieces): about +3.9 ms GPU per frame when the gems cover
 *   13 % of the frame (vs. MeshStandardMaterial on the same meshes), about +2.5 ms in the full board view (1.3 % coverage).
 * Sharing: every state variant (idle / active / moving) of a colour is one material shared by all pieces in that state; all
 * gem materials compile to ONE program (customProgramCacheKey). Per-piece variation (pulse phase) comes from the object's
 * world position and the geometry attribute, never from per-object uniforms.
 */
export const VERSION = 'kfb-gem.v1';
export const STATES = Object.freeze(['idle', 'active', 'moving', 'captured']);
export const SHATTER_DURATION = 1.2;           // s, captured -> gone
export const PULSE_HZ = 0.2, PULSE_HZ_NIGHT = 0.12;
const NIGHT_VEIN = 1.4, NIGHT_CORE = 0.68, NIGHT_DIFF = 0.3, NIGHT_SPEC = 0.12, NIGHT_EXT_INNER = 0.35;   // r3/r4: night multipliers (x mood glow weight)
export const MAX_SPANS = 32, MAX_ROWS = 64, PROFILE_BINS = 16;
export const GEM_PRESETS = Object.freeze({
  // tint = colour at the surface / thin parts, depthTint = colour after ~half a piece height of travel, vein = glow colour
  ruby: Object.freeze({ tint: '#d2465e', depthTint: '#8a1428', vein: '#ffc27a', hot: '#ffd27a', glow: '#ff3b2e', body: 0.13, veinGlow: 1.0 }),
  sapphire: Object.freeze({ tint: '#4a6fd8', depthTint: '#1a2f86', vein: '#a8e0ff', hot: '#d8f0ff', glow: '#3f86ff', body: 0.14, veinGlow: 0.55 }),
});
export const gemPresetForSide = (side) => (/^(black|dark)$/i.test(String(side || '')) ? 'sapphire' : 'ruby');
/* per-state uniforms: x vein boost, y rim, z shimmer, w opacity */
const STATE_U = { idle: [1, 0, 0, 1], active: [2.3, 1, 0, 1], moving: [1.3, 0.2, 1, 1], captured: [1.8, 0, 0.6, 1] };

const REG = new WeakMap();                     // THREE namespace -> { time, profiles, bundles, envs, env }
function registry(THREE) {
  let R = REG.get(THREE);
  if (R) return R;
  const data = new Float32Array((1 + MAX_SPANS) * MAX_ROWS * 4);
  const tex = new THREE.DataTexture(data, 1 + MAX_SPANS, MAX_ROWS, THREE.RGBAFormat, THREE.FloatType);
  tex.minFilter = tex.magFilter = THREE.NearestFilter; tex.generateMipmaps = false; tex.needsUpdate = true;
  R = { time: { value: 0 }, mood: { value: new THREE.Vector4(0, 0, 0, 0) }, profiles: { tex, data, rows: new Map(), next: 0 }, bundles: new Map(), envs: new Map(), env: null };   // mood.x = glow weight 0..1
  REG.set(THREE, R);
  return R;
}

/* ---------- lathe proxy (port of the Morph Chess profile spans; here measured from the real hull) ----------
   Per height bin the largest radius around the vertical axis; edge radius = max of the two neighbouring bins (+1 %), so the
   piecewise-linear lathe contains every vertex and every surface point starts its trace inside. Closed with a bottom and a top disc. */
export function measureProfile(THREE, geometry, bins = PROFILE_BINS) {
  const P = geometry.attributes.position; geometry.computeBoundingBox();
  const b = geometry.boundingBox, ax = (b.min.x + b.max.x) / 2, az = (b.min.z + b.max.z) / 2, y0 = b.min.y, y1 = b.max.y, h = Math.max(1e-6, y1 - y0);
  const r = new Float32Array(bins);
  for (let i = 0; i < P.count; i++) { const k = Math.min(bins - 1, Math.max(0, Math.floor(((P.getY(i) - y0) / h) * bins))); r[k] = Math.max(r[k], Math.hypot(P.getX(i) - ax, P.getZ(i) - az)); }
  for (let k = 0; k < bins; k++) if (r[k] === 0) r[k] = Math.max(r[k - 1] || 0, r[k + 1] || 0);
  const edge = []; for (let k = 0; k <= bins; k++) edge.push(Math.max(r[k - 1] || 0, r[k] || 0) * 1.01 + h * 1e-4);
  const spans = [[0, y0, edge[0], y0]];
  for (let k = 0; k < bins; k++) spans.push([edge[k], y0 + (h * k) / bins, edge[k + 1], y0 + (h * (k + 1)) / bins]);
  spans.push([edge[bins], y1, 0, y1]);
  return { axis: [ax, az], y0, y1, height: h, spans };
}
function registerProfile(THREE, geometry) {
  const R = registry(THREE), Pr = R.profiles;
  if (Pr.rows.has(geometry.uuid)) return Pr.rows.get(geometry.uuid);
  if (Pr.next >= MAX_ROWS) return { row: -1, height: 1 };
  const prof = measureProfile(THREE, geometry), row = Pr.next++, W = 1 + MAX_SPANS, o = row * W * 4;
  Pr.data.set([prof.axis[0], prof.axis[1], prof.height, prof.spans.length], o);
  prof.spans.forEach((s, j) => Pr.data.set(s, o + (j + 1) * 4));
  Pr.tex.needsUpdate = true;
  const rec = { row, height: prof.height, profile: prof };
  Pr.rows.set(geometry.uuid, rec);
  return rec;
}
function hash01(s) { let h = 0x811c9dc5; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0) / 4294967296; }
/* r3: per-vertex thinness 0..1 (1 = thinnest). The hull is voxelised (parity fill along z), a chamfer distance transform gives the
   inscribed radius inside, and every vertex takes the largest radius met along its inward normal = local half thickness. */
export function measureThinness(THREE, geometry, res = 56) {
  const P = geometry.attributes.position, N = geometry.attributes.normal, I = geometry.index ? geometry.index.array : null;
  geometry.computeBoundingBox(); const b = geometry.boundingBox, size = b.getSize(new THREE.Vector3()), H = Math.max(1e-6, size.y);
  const c = Math.max(size.x, size.y, size.z) / res, nx = Math.ceil(size.x / c) + 2, ny = Math.ceil(size.y / c) + 2, nz = Math.ceil(size.z / c) + 2;
  const ox = b.min.x - c, oy = b.min.y - c, oz = b.min.z - c, cols = Array.from({ length: nx * ny }, () => []);
  const T = I ? I.length / 3 : P.count / 3, ix = (t, k) => (I ? I[3 * t + k] : 3 * t + k);
  for (let t = 0; t < T; t++) {
    const a = ix(t, 0), bb = ix(t, 1), cc = ix(t, 2);
    const x0 = P.getX(a), y0 = P.getY(a), z0 = P.getZ(a), x1 = P.getX(bb), y1 = P.getY(bb), z1 = P.getZ(bb), x2 = P.getX(cc), y2 = P.getY(cc), z2 = P.getZ(cc);
    const den = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2); if (Math.abs(den) < 1e-14) continue;
    const i0 = Math.max(0, Math.ceil((Math.min(x0, x1, x2) - ox) / c - 0.5)), i1 = Math.min(nx - 1, Math.floor((Math.max(x0, x1, x2) - ox) / c - 0.5));
    const j0 = Math.max(0, Math.ceil((Math.min(y0, y1, y2) - oy) / c - 0.5)), j1 = Math.min(ny - 1, Math.floor((Math.max(y0, y1, y2) - oy) / c - 0.5));
    for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
      const x = ox + (i + 0.5) * c, y = oy + (j + 0.5) * c, l0 = ((y1 - y2) * (x - x2) + (x2 - x1) * (y - y2)) / den, l1 = ((y2 - y0) * (x - x2) + (x0 - x2) * (y - y2)) / den, l2 = 1 - l0 - l1;
      if (l0 < 0 || l1 < 0 || l2 < 0) continue; cols[i * ny + j].push(l0 * z0 + l1 * z1 + l2 * z2);
    }
  }
  const D = new Float32Array(nx * ny * nz), id = (i, j, k) => (i * ny + j) * nz + k, BIG = 1e9;
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const z = cols[i * ny + j].sort((p, q) => p - q);
    for (let q = 0; q + 1 < z.length; q += 2) { const k0 = Math.max(0, Math.ceil((z[q] - oz) / c - 0.5)), k1 = Math.min(nz - 1, Math.floor((z[q + 1] - oz) / c - 0.5)); for (let k = k0; k <= k1; k++) D[id(i, j, k)] = BIG; } }
  const W = [[1, 0, 0, 1], [0, 1, 0, 1], [0, 0, 1, 1], [1, 1, 0, Math.SQRT2], [1, -1, 0, Math.SQRT2], [1, 0, 1, Math.SQRT2], [1, 0, -1, Math.SQRT2], [0, 1, 1, Math.SQRT2], [0, 1, -1, Math.SQRT2], [1, 1, 1, 1.732], [1, 1, -1, 1.732], [1, -1, 1, 1.732], [1, -1, -1, 1.732]];
  for (const dir of [1, -1]) for (let i = dir > 0 ? 0 : nx - 1; dir > 0 ? i < nx : i >= 0; i += dir) for (let j = dir > 0 ? 0 : ny - 1; dir > 0 ? j < ny : j >= 0; j += dir) for (let k = dir > 0 ? 0 : nz - 1; dir > 0 ? k < nz : k >= 0; k += dir) {
    const o = id(i, j, k); if (D[o] === 0) continue; let v = D[o];
    for (const [a, bq, cq, w] of W) { const ii = i - dir * a, jj = j - dir * bq, kk = k - dir * cq; if (ii < 0 || jj < 0 || kk < 0 || ii >= nx || jj >= ny || kk >= nz) { v = Math.min(v, w); continue; } v = Math.min(v, D[id(ii, jj, kk)] + w); }
    D[o] = v;
  }
  const at = (x, y, z) => { const i = Math.floor((x - ox) / c), j = Math.floor((y - oy) / c), k = Math.floor((z - oz) / c); return i < 0 || j < 0 || k < 0 || i >= nx || j >= ny || k >= nz ? 0 : D[id(i, j, k)]; };
  const out = new Float32Array(P.count);
  for (let v = 0; v < P.count; v++) {
    const x = P.getX(v), y = P.getY(v), z = P.getZ(v), qx = N ? -N.getX(v) : 0, qy = N ? -N.getY(v) : -1, qz = N ? -N.getZ(v) : 0; let m = 0, seen = false;
    for (let st = 0.6; st < res; st += 0.7) { const d = at(x + qx * st * c, y + qy * st * c, z + qz * st * c); if (d > 0) { seen = true; m = Math.max(m, d); } else if (seen) break; }
    const thick = 2 * m * c / H;                                   // local thickness in piece heights
    out[v] = Math.min(1, Math.max(0, 1 - (thick - 0.04) / 0.32));
  }
  return out;
}
function ensureGemAttribute(THREE, geometry, seed) {
  const R = registry(THREE);
  if (geometry.attributes.kfbGem && R.profiles.rows.has(geometry.uuid)) return geometry.attributes.kfbGem;   // row still valid
  const rec = registerProfile(THREE, geometry), n = geometry.attributes.position.count, a = new Float32Array(n * 4);
  const phase = hash01(seed + '|' + (geometry.name || ''));
  let thin = null; try { thin = measureThinness(THREE, geometry); } catch (e) { thin = null; }
  for (let i = 0; i < n; i++) { a[i * 4] = rec.row + 1; a[i * 4 + 1] = rec.height; a[i * 4 + 2] = phase; a[i * 4 + 3] = thin ? thin[i] : 0.5; }
  const attr = new THREE.BufferAttribute(a, 4); geometry.setAttribute('kfbGem', attr);
  return attr;
}

/* ---------- shader ---------- */
const VERT_PARS = /* glsl */`
attribute vec4 kfbGem;
varying vec3 vGemPos; varying vec3 vGemN; varying vec3 vGemEye; varying vec4 vGemInfo;
varying vec3 vGemM0; varying vec3 vGemM1; varying vec3 vGemM2; varying float vGemSeed;
`;
const VERT_MAIN = /* glsl */`
vGemPos = transformed; vGemN = objectNormal; vGemInfo = kfbGem;
{ mat3 gm = mat3(modelMatrix); vGemEye = (transpose(gm) * (cameraPosition - modelMatrix[3].xyz)) / dot(gm[0], gm[0]); }   // rotation x uniform scale (KFB pieces); no per-vertex inverse()
vGemM0 = modelMatrix[0].xyz; vGemM1 = modelMatrix[1].xyz; vGemM2 = modelMatrix[2].xyz;
vGemSeed = fract(dot(floor(modelMatrix[3].xz * 4.0 + 0.5), vec2(0.1031, 0.0973)));   // r2: exact in float32, so getPracticalLight() pulses in phase
`;
const FRAG_PARS = /* glsl */`
#define GEM_MAX_SPANS ${MAX_SPANS}
uniform sampler2D uGemProfiles; uniform float uGemTime; uniform vec4 uGemState;
uniform vec3 uGemSigma; uniform vec3 uGemVein; uniform vec3 uGemTintL; uniform vec3 uGemHot; uniform vec3 uGemGlow; uniform vec4 uGemParams; uniform vec4 uGemLook;
uniform vec3 uGemSkyTop; uniform vec3 uGemSkyBot; uniform vec4 uGemMood;
varying vec3 vGemPos; varying vec3 vGemN; varying vec3 vGemEye; varying vec4 vGemInfo;
varying vec3 vGemM0; varying vec3 vGemM1; varying vec3 vGemM2; varying float vGemSeed;
vec3 gemToWorld(vec3 d) { return normalize(vGemM0 * d.x + vGemM1 * d.y + vGemM2 * d.z); }
vec3 gemEnv(vec3 dirLocal, float rough) {
  vec3 w = gemToWorld(dirLocal);
#ifdef USE_ENVMAP
  return textureCubeUV(envMap, envMapRotation * w, rough).rgb * envMapIntensity;
#else
  return mix(uGemSkyBot, uGemSkyTop, clamp(w.y * 0.5 + 0.5, 0.0, 1.0));
#endif
}
float gemFresnel(float c) { return .076 + .924 * pow(1.0 - clamp(c, 0.0, 1.0), 5.0); }
float gemHash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float gemNoise(vec3 x) {
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(gemHash(i), gemHash(i + vec3(1, 0, 0)), f.x), mix(gemHash(i + vec3(0, 1, 0)), gemHash(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(gemHash(i + vec3(0, 0, 1)), gemHash(i + vec3(1, 0, 1)), f.x), mix(gemHash(i + vec3(0, 1, 1)), gemHash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
/* cut look on a smooth hull: snap the local normal to 10 azimuth sectors x 5 elevation bands around the piece axis, odd sectors
   shifted by half a band (staggered like a brilliant cut instead of a grid) */
vec3 gemFacet(vec3 n, float amt, float rot) {
  float S = 6.2831853 / 10.0, E = 3.1415927 / 5.0;
  if (dot(n.xz, n.xz) < 1e-8) return n;                     // straight up/down: no azimuth (atan(0, 0) is undefined)
  float az = atan(n.z, n.x) + rot, el = asin(clamp(n.y, -1.0, 1.0));
  float sec = floor(az / S), odd = mod(sec, 2.0), ua = az / S - sec;
  float eb = el / E + 0.5 * odd, ue = eb - floor(eb);
  float azq = (sec + 0.5) * S - rot, elq = clamp((floor(eb) + 0.5 - 0.5 * odd) * E, -1.5707, 1.5707);
  /* soft edges: within 14 % of a facet border the smooth normal comes back, so surface noise near a border cannot speckle */
  float wa = smoothstep(0.0, 0.14, min(ua, 1.0 - ua)), we = smoothstep(0.0, 0.14, min(ue, 1.0 - ue));
  azq = mix(az - rot, azq, wa); elq = mix(el, elq, we);
  vec3 f = vec3(cos(elq) * cos(azq), sin(elq), cos(elq) * sin(azq));
  return normalize(mix(n, f, amt));
}
vec3 gemNL; float gemCos;
`;
/* after normal_fragment_maps: faceted normal, in local space for the trace and in view space for three's lighting */
const FRAG_NORMAL = /* glsl */`
{
  float rot = uGemParams.z * 0.5236 + uGemState.z * uGemTime * 0.35 + uGemMood.x * uGemTime * 0.06;   // r2: night = slow idle morph
  vec3 n0 = dot(vGemN, vGemN) > 1e-12 ? normalize(vGemN) : vec3(0.0, 1.0, 0.0);
  gemNL = gemFacet(n0, uGemLook.x, rot);
  if (any(isnan(gemNL))) gemNL = n0;
  normal = normalize(mat3(viewMatrix) * gemToWorld(gemNL));
}
`;
/* before opaque_fragment: traced interior + veins + rim, added to the lit result (linear HDR, tone mapped by three) */
const FRAG_INTERIOR = /* glsl */`
{
  float H = max(vGemInfo.y, 1e-3);
  int row = int(vGemInfo.x + 0.5) - 1;
  vec3 axisOff = vec3(0.0); int nSpans = 0;
  if (row >= 0) { vec4 meta = texelFetch(uGemProfiles, ivec2(0, row), 0); axisOff = vec3(meta.x, 0.0, meta.y); nSpans = int(meta.w + 0.5); }
  vec3 P = vGemPos - axisOff;
  vec3 I = normalize(vGemPos - vGemEye);
  vec3 N = gemNL; if (dot(N, I) > 0.0) N = -N;
  gemCos = clamp(-dot(I, N), 0.0, 1.0);
  float F = gemFresnel(gemCos);
  vec3 Nr = N;
  if (uGemState.z > 0.0) {                                   // moving: gentle shimmer in the refraction
    vec3 q = P / H * 3.0 + vec3(0.0, uGemTime * 0.8, 0.0);
    Nr = normalize(N + uGemState.z * 0.28 * (vec3(gemNoise(q), gemNoise(q + 7.1), gemNoise(q + 13.7)) - 0.5));
  }
  vec3 dir = refract(I, Nr, 1.0 / 1.76);
  vec3 org = P + dir * 0.002 * H;
  vec3 thr = vec3(1.0 - F), inner = vec3(0.0);
  float firstLen = 0.35 * H;
  for (int b = 0; b < GEM_BOUNCES; b++) {
    if (max(thr.r, max(thr.g, thr.b)) < 0.015) break;
    float nearest = 1e5; vec3 bnd = -N;
    for (int j = 0; j < GEM_MAX_SPANS; j++) {
      if (j >= nSpans) break;
      vec4 sp = texelFetch(uGemProfiles, ivec2(j + 1, row), 0);
      if (abs(dir.y) > 1e-4) {                                  // cheap reject: the ray's height band must reach this span in [0, nearest]
        float ta = (sp.y - org.y) / dir.y, tb = (sp.w - org.y) / dir.y;
        if (max(ta, tb) < 0.0 || min(ta, tb) > nearest) continue;
      } else if (org.y < min(sp.y, sp.w) - 1e-4 * H || org.y > max(sp.y, sp.w) + 1e-4 * H) continue;
      float dy = sp.w - sp.y;
      if (abs(dy) < 1e-5 * H) {
        if (abs(dir.y) > 1e-5) {
          float t = (sp.y - org.y) / dir.y; float r = length((org + dir * t).xz);
          if (t > 1e-4 * H && t < nearest && r >= min(sp.x, sp.z) - 1e-4 * H && r <= max(sp.x, sp.z) + 1e-4 * H) { nearest = t; bnd = vec3(0.0, sp.z > sp.x ? -1.0 : 1.0, 0.0); }
        }
      } else {
        float slope = (sp.z - sp.x) / dy, radius = sp.x + slope * (org.y - sp.y), dr = slope * dir.y;
        float aa = dot(dir.xz, dir.xz) - dr * dr, bb = 2.0 * (dot(org.xz, dir.xz) - radius * dr), cc = dot(org.xz, org.xz) - radius * radius;
        float disc = bb * bb - 4.0 * aa * cc;
        if (disc >= 0.0 && abs(aa) > 1e-6) {
          float sq = sqrt(disc);
          for (int k = 0; k < 2; k++) {
            float t = (-bb + (k == 0 ? -1.0 : 1.0) * sq) / (2.0 * aa); vec3 pt = org + dir * t;
            if (t > 1e-4 * H && t < nearest && pt.y >= sp.y - 1e-5 * H && pt.y <= sp.w + 1e-5 * H) { nearest = t; vec2 nxz = normalize(pt.xz + 1e-6); bnd = normalize(vec3(nxz.x, -slope, nxz.y)); }
          }
        }
      }
    }
    if (nearest > 9e4) { nearest = (b == 0 ? 0.28 : 0.14) * H; bnd = b == 0 ? -N : normalize(dir); }   // no proxy (shards): slab
    if (b == 0) firstLen = nearest;
    org += dir * nearest;
    thr *= exp(-uGemSigma * (nearest / H + 0.04));
    vec3 outg = refract(dir, -bnd, 1.76); float R = 1.0;
    if (dot(outg, outg) > 0.001) { R = gemFresnel(dot(dir, bnd)); inner += thr * (1.0 - R) * gemEnv(outg, 0.22); }
    thr *= R; dir = reflect(dir, bnd); org += dir * 0.002 * H;
  }
  inner += thr * exp(-uGemSigma * 0.35) * gemEnv(dir, 0.65) * 0.3;   // low-energy tail, blurred (Morph Chess)
  /* veins: procedural mineral sheets seen along the refracted ray (3 depths, parallax), fixed in the piece */
  float vein = 0.0;
  if (uGemParams.y > 0.5) {
    vec3 d0 = refract(I, N, 1.0 / 1.76), so = P / H + vec3(uGemParams.z * 3.7, uGemMood.x * uGemTime * 0.015, uGemParams.z * 1.9);
    for (int k = 0; k < 3; k++) {
      float t = 0.025 + 0.06 * float(k); if (t * H > firstLen) break;
      vec3 p = so + d0 * t; float wb = gemNoise(p * 2.3 + 19.0);
      float mask = smoothstep(0.30, 0.50, gemNoise(p * 1.4 + 31.0));          // veins only in parts of the stone
      float a = gemNoise(p * 5.5) + 0.5 * gemNoise(p * 11.0 + 5.0);
      vein = max(vein, mask * (1.0 - smoothstep(0.0, 0.006 + 0.012 * wb, abs(a - 0.74))) * (1.0 - 0.3 * float(k)));
    }
  }
  float NG = uGemMood.x;                                       // r2: mood glow weight (day 0, dusk 0.4, night 1)
  float pulse = 0.5 + 0.5 * sin(6.2831853 * mix(${PULSE_HZ.toFixed(2)}, ${PULSE_HZ_NIGHT.toFixed(2)}, NG) * uGemTime + 6.2831853 * (uGemParams.z + vGemInfo.z + vGemSeed));
  float pk = mix(0.7, 0.8, NG) + mix(0.6, 0.75, NG) * pulse;   // r4: night 0.8..1.55 (the low phase still glows: ember, not off)
  float glow = uGemParams.w * pk * uGemState.x * (1.0 + ${NIGHT_VEIN.toFixed(2)} * NG);
  inner = mix(inner, inner * 0.4, vein * 0.5);
  vec3 emit = mix(uGemVein, mix(uGemGlow, uGemHot, 0.45), NG) * vein * glow;   // r4: at night veins are light channels in the glow colour, not white marble
  float rimF = pow(1.0 - gemCos, 2.5);
  emit += mix(vec3(1.0), uGemVein, 0.8) * rimF * rimF * uGemState.y * 0.45;            // active: soft rim, tinted
  emit += uGemVein * uGemLook.w * (0.6 + 0.4 * pulse) * (0.35 + 0.65 * rimF) * (1.0 + uGemState.y) * (1.0 - NG);   // day: faint grazing glow (gone at night: the rim must be darker)
  /* r3 self-luminous core (night, partly dusk): hot centre -> darker rim (inverted fresnel), following the anatomy (thinness field),
     warmer/brighter toward the top (heat), small flame flicker + upward licks over the slow pulse */
  if (NG > 0.001) {
    float thin = clamp(vGemInfo.w, 0.0, 1.0);
    float y0 = row >= 0 ? texelFetch(uGemProfiles, ivec2(1, row), 0).y : -0.5 * H;
    float hf = clamp((vGemPos.y - y0) / H, 0.0, 1.0);
    float facing = pow(gemCos, mix(2.0, 0.7, thin));                 // thick parts: hot centre, dark rim; thin parts glow through almost entirely
    float facet = 0.5 + 0.5 * sin(dot(gemNL, vec3(5.1, 3.7, 4.3)) * 3.0 + 1.3);   // per-facet value (snapped normal is constant per facet): the glow is seen through cut faces
    float heat = mix(0.72, 1.25, hf);
    float ph = 6.2831853 * (vGemSeed * 3.0 + vGemInfo.z * 5.0);
    float fl = 1.0 + 0.06 * sin(6.2831853 * 1.7 * uGemTime + ph) + 0.04 * sin(6.2831853 * 2.9 * uGemTime + 1.7 + ph * 1.3) + 0.025 * sin(6.2831853 * 5.3 * uGemTime + 4.1 + ph * 0.7);
    float lick = 0.78 + 0.44 * gemNoise(vec3(P.x / H * 2.6, P.y / H * 3.2 - uGemTime * 1.1, P.z / H * 2.6) + vGemSeed * 7.0);
    float sCore = clamp(facing * (0.3 + 0.7 * thin) * heat * mix(0.8, 1.1, facet), 0.0, 1.0);
    /* colour ramp: deep stone colour at the rim -> saturated glow colour -> white-gold / white-ice only in the hottest spots */
    float hot = smoothstep(0.6, 1.0, sCore * mix(0.9, 1.18, pulse));   // the core cools toward the glow colour in the low phase of the pulse
    vec3 col = mix(mix(uGemTintL * 0.45, uGemGlow, smoothstep(0.0, 0.55, sCore)), uGemHot, 0.85 * hot) * (0.85 + 0.7 * hot);   // hot zones also brighter, so white-gold reads hot, not beige
    float coreI = ${NIGHT_CORE.toFixed(2)} * (0.1 + 0.9 * thin) * (0.12 + 0.88 * facing) * heat * fl * mix(1.0, lick, 0.55) * mix(0.62, 1.12, facet) * pk * uGemState.x;
    emit += col * coreI * NG;
    outgoingLight = mix(outgoingLight, totalDiffuse * ${NIGHT_DIFF.toFixed(2)} + totalSpecular * ${NIGHT_SPEC.toFixed(2)} + totalEmissiveRadiance, NG);   // r4: outside diffuse 30 %, specular/reflections 12 %
    inner *= mix(1.0, ${NIGHT_EXT_INNER.toFixed(2)}, NG);            // environment seen through the stone too
  }
  vec3 gemAdd = inner * uGemLook.y + emit;
  if (!any(isnan(gemAdd)) && !any(isinf(gemAdd))) outgoingLight += max(gemAdd, vec3(0.0));
}
`;

function makeBundle(THREE, key, p) {
  const R = registry(THREE);
  const sigma = new THREE.Color(p.depthTint); const sg = [sigma.r, sigma.g, sigma.b].map((c) => -Math.log(Math.min(1, Math.max(0.01, c))) / 0.5 * (p.density ?? 1));
  const shared = {
    uGemProfiles: { value: R.profiles.tex }, uGemTime: R.time,
    uGemSigma: { value: new THREE.Vector3(...sg) }, uGemVein: { value: new THREE.Color(p.vein) },
    // x seed phase, y veins on, z facet rotation seed, w vein glow
    uGemParams: { value: new THREE.Vector4(hash01(p.seed), p.veins ? 1 : 0, hash01('rot' + p.seed), p.veinGlow ?? 0.7) },
    // x facet amount, y interior gain, z -, w faint inner glow
    uGemLook: { value: new THREE.Vector4(p.facet ?? 0.88, p.interior ?? 1.5, 0, p.innerGlow ?? 0.05) },
    uGemSkyTop: { value: new THREE.Color('#b4bdee') }, uGemSkyBot: { value: new THREE.Color('#8a7f72') },
    uGemMood: R.mood, uGemTintL: { value: new THREE.Color(p.tint) }, uGemHot: { value: new THREE.Color(p.hot || p.vein).lerp(new THREE.Color('#ffffff'), p.hot ? 0 : 0.5) }, uGemGlow: { value: new THREE.Color(p.glow || p.tint) },
  };
  const variants = new Map(), bounces = p.quality === 'high' ? 2 : 1;   // game: 1 traced internal bounce + blurred tail; high (proof stills): 2
  const bundle = { key, params: p, shared, variants, users: 0, clones: new Set() };
  bundle.make = (state, own = false) => {
    if (!own && variants.has(state)) return variants.get(state);
    const body = new THREE.Color(p.tint).multiplyScalar(p.body ?? 0.3);
    const m = new THREE.MeshPhysicalMaterial({ name: `${VERSION} · ${p.name || key} · ${state}`, color: body, roughness: p.roughness ?? 0.12, metalness: 0, ior: 1.76, specularIntensity: 1, envMapIntensity: 1 });
    if (R.env) m.envMap = R.env;
    const stateU = { value: new THREE.Vector4(...STATE_U[state]) };
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, shared, { uGemState: stateU });
      sh.fragmentShader = '#define GEM_BOUNCES ' + bounces + '\n' + sh.fragmentShader;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\n' + VERT_PARS).replace('#include <begin_vertex>', '#include <begin_vertex>\n' + VERT_MAIN);
      sh.fragmentShader = sh.fragmentShader.replace('#include <clipping_planes_pars_fragment>', '#include <clipping_planes_pars_fragment>\n' + FRAG_PARS)
        .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' + FRAG_NORMAL)
        .replace('#include <opaque_fragment>', FRAG_INTERIOR + '\n#include <opaque_fragment>\ngl_FragColor.a *= uGemState.w;');
    };
    m.customProgramCacheKey = () => VERSION + '|b' + bounces;
    m.userData.kfbGem = { version: VERSION, key, state, stateU };
    if (own) bundle.clones.add(m); else variants.set(state, m);
    return m;
  };
  R.bundles.set(key, bundle);
  return bundle;
}
function bundleFor(THREE, p) {
  const key = [p.tint, p.depthTint, p.vein, p.veins ? 1 : 0, p.body, p.density ?? 1, p.quality || 'game'].join('|');
  const R = registry(THREE);
  return R.bundles.get(key) || makeBundle(THREE, key, p);
}

/* ---------- environment: small PMREM from the mood's sky colours (+ jewelry-studio cards, Morph Chess layout) ---------- */
function sunDirOf(m) { if (m.sunDir) return m.sunDir; const e = (m.elev * Math.PI) / 180, a = (m.az * Math.PI) / 180; return [Math.cos(e) * Math.sin(a), Math.sin(e), Math.cos(e) * Math.cos(a)]; }
export function gemEnvironment({ THREE, renderer, mood, ground = '#9a8a78' }) {
  const R = registry(THREE), sd = sunDirOf(mood);
  const key = JSON.stringify([mood.sun, +(+mood.sunI).toFixed(4), mood.hemiSky, +(+mood.hemiI).toFixed(4), +(+(mood.bounce ?? 1)).toFixed(4), sd.map((v) => +v.toFixed(4)), ground]);
  if (R.envs.has(key)) return R.envs.get(key);
  const scene = new THREE.Scene(), C = (h, k) => new THREE.Color(h).multiplyScalar(k);
  // the dome is kept dim (jewel contrast needs dark areas, Morph Chess studio idea); the cards carry the brightness
  const top = C(mood.hemiSky, mood.hemiI * 0.5), bot = C(ground, (mood.bounce ?? 1) * mood.hemiI * 0.35), hor = top.clone().lerp(bot, 0.5);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(10, 48, 24), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, uniforms: { top: { value: top }, bot: { value: bot }, hor: { value: hor } },
    vertexShader: 'varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 top, bot, hor; varying vec3 vD; void main(){ float y = normalize(vD).y; vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.0, 0.6, y)) : mix(hor, bot, smoothstep(0.0, 0.25, -y)); gl_FragColor = vec4(c, 1.0); }',
  }));
  scene.add(dome);
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'), gr = g.createRadialGradient(48, 40, 4, 64, 64, 90);
  gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.55, '#d9d9d9'); gr.addColorStop(1, '#4a4a4a'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const soft = new THREE.CanvasTexture(cv); soft.colorSpace = THREE.SRGBColorSpace;
  const cv2 = document.createElement('canvas'); cv2.width = cv2.height = 64; const g2 = cv2.getContext('2d'), r2 = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
  r2.addColorStop(0, 'rgba(255,255,255,1)'); r2.addColorStop(0.4, 'rgba(255,255,255,0.6)'); r2.addColorStop(1, 'rgba(255,255,255,0)'); g2.fillStyle = r2; g2.fillRect(0, 0, 64, 64);
  const disc = new THREE.CanvasTexture(cv2);
  const card = (color, k, size, pos, map = soft, blend = false) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...size), new THREE.MeshBasicMaterial({ color: C(color, k), side: THREE.DoubleSide, map, transparent: blend, depthWrite: !blend, blending: blend ? THREE.AdditiveBlending : THREE.NormalBlending }));
    mesh.position.set(...pos); mesh.lookAt(0, 0, 0); scene.add(mesh);
  };
  // jewelry studio cards (Morph Chess material.js), scaled by how bright the mood is: day sparkles, night stays dim
  const L = Math.min(1.2, 0.18 * mood.sunI + 0.55 * mood.hemiI);
  card('#ffffff', 6.0 * L, [2, 4], [-3, 3, 4]);
  card('#fff4ed', 2.6 * L, [1.2, 5], [4, 1, 1]);
  card('#ffffff', 3.0 * L, [3, 2], [0, 5, -2]);
  card('#ffffff', 1.8 * L, [2, 4], [-2, 0, -4]);
  card('#ffffff', 2.8 * L, [1.5, 3], [3, -1, -4]);
  card('#ffffff', 2.2 * L, [1.2, 3], [-4.2, 0.8, -1]);
  card(mood.sun, 9 * mood.sunI, [1.8, 1.8], sd.map((v) => v * 8), disc, true);       // the mood's sun, as a soft disc
  const pm = new THREE.PMREMGenerator(renderer), rt = pm.fromScene(scene, 0.02, 0.1, 30); pm.dispose();
  scene.traverse((o) => { o.geometry?.dispose(); o.material?.dispose(); }); soft.dispose(); disc.dispose();
  const env = { texture: rt.texture, target: rt, key, sky: { top, bot } };
  R.envs.set(key, env);
  return env;
}
export function setGemEnvironment({ THREE, renderer, mood, ground }) {
  const R = registry(THREE), env = gemEnvironment({ THREE, renderer, mood, ground });
  R.env = env.texture; R.mood.value.x = Math.max(0, Math.min(1, mood.glow ?? 0));
  for (const b of R.bundles.values()) {
    b.shared.uGemSkyTop.value.copy(env.sky.top); b.shared.uGemSkyBot.value.copy(env.sky.bot);
    for (const m of [...b.variants.values(), ...b.clones]) if (m.envMap !== env.texture) { m.envMap = env.texture; m.needsUpdate = true; }
  }
  return env;
}

/* ---------- fracture (port of Morph Chess fracture-geometry.js: seeded plane splits of the closed surface, caps stitched) ---------- */
export function seededRandom(seed = 85173) {
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let v = Math.imul(seed ^ seed >>> 15, 1 | seed); v = v + Math.imul(v ^ v >>> 7, 61 | v) ^ v; return ((v ^ v >>> 14) >>> 0) / 4294967296; };
}
const EPS = 1e-7;
function fractureGeometry(THREE, geometry, { count = 8, seed = 85173, minPart = 0.07 } = {}) {
  const V3 = THREE.Vector3, vkey = (p) => Math.round(p.x * 1e5) + ',' + Math.round(p.y * 1e5) + ',' + Math.round(p.z * 1e5);
  const position = geometry.attributes.position, index = geometry.index, faces = [];
  for (let i = 0; i < (index ? index.count : position.count); i += 3) {
    const f = [0, 1, 2].map((o) => new V3().fromBufferAttribute(position, index ? index.getX(i + o) : i + o));
    if (f[1].clone().sub(f[0]).cross(f[2].clone().sub(f[0])).lengthSq() > 1e-18) faces.push(f);
  }
  const measure = (fs) => { let vol = 0; const c = new V3(), bb = new THREE.Box3();
    for (const f of fs) { f.forEach((p) => bb.expandByPoint(p)); for (let i = 1; i < f.length - 1; i++) { const t = f[0].dot(f[i].clone().cross(f[i + 1])) / 6; vol += t; c.addScaledVector(f[0].clone().add(f[i]).add(f[i + 1]), t / 4); } }
    return { faces: fs, volume: vol, center: c.divideScalar(vol || 1), bounds: bb }; };
  const split = (fs, n, off) => {
    const neg = [], pos = [], segs = [];
    for (const f of fs) {
      const d = f.map((p) => n.dot(p) - off);
      if (d.every((v) => v <= EPS)) { neg.push(f); continue; }
      if (d.every((v) => v >= -EPS)) { pos.push(f); continue; }
      const below = [], above = [], cross = [];
      for (let i = 0; i < f.length; i++) { const p = f[i], q = f[(i + 1) % f.length], a = d[i], b = d[(i + 1) % f.length];
        if (a <= EPS) below.push(p); if (a >= -EPS) above.push(p); if (Math.abs(a) < EPS) cross.push(p);
        if ((a < -EPS && b > EPS) || (a > EPS && b < -EPS)) { const x = p.clone().lerp(q, a / (a - b)); below.push(x); above.push(x); cross.push(x); } }
      if (below.length >= 3) neg.push(below); if (above.length >= 3) pos.push(above);
      const u = [...new Map(cross.map((p) => [vkey(p), p])).values()]; if (u.length === 2) segs.push(u);
    }
    if (!segs.length) return null;
    const nodes = new Map();
    for (const [a, b] of segs) { const ka = vkey(a), kb = vkey(b); if (ka === kb) continue;
      for (const [k, p, nb] of [[ka, a, kb], [kb, b, ka]]) { if (!nodes.has(k)) nodes.set(k, { p, adj: new Set() }); nodes.get(k).adj.add(nb); } }
    if ([...nodes.values()].some((x) => x.adj.size !== 2)) return null;
    const u = new V3(Math.abs(n.y) < 0.9 ? 0 : 1, Math.abs(n.y) < 0.9 ? 1 : 0, 0).cross(n).normalize(), v = n.clone().cross(u), left = new Set(nodes.keys());
    while (left.size) {
      const start = left.values().next().value, loop = []; let cur = start, prev = null;
      do { loop.push(nodes.get(cur).p); left.delete(cur); const nx = [...nodes.get(cur).adj].find((k) => k !== prev); prev = cur; cur = nx; } while (cur !== start && left.has(cur));
      if (cur !== start || loop.length < 3) return null;
      const pr = loop.map((p) => new THREE.Vector2(p.dot(u), p.dot(v)));
      for (const ix of THREE.ShapeUtils.triangulateShape(pr, [])) { const t = ix.map((i) => loop[i]); const dd = t[1].clone().sub(t[0]).cross(t[2].clone().sub(t[0])); if (dd.lengthSq() < 1e-18) continue; if (dd.dot(n) < 0) t.reverse(); neg.push(t); pos.push([...t].reverse()); }
    }
    return [measure(neg), measure(pos)];
  };
  const rnd = seededRandom(seed), parts = [measure(faces)];
  for (let it = 0; parts.length < count && it < count * 10; it++) {
    let sel = 0, best = -Infinity; parts.forEach((pt, i) => { const s = pt.volume * (0.35 + rnd()); if (s > best) { best = s; sel = i; } });
    const pt = parts[sel], sz = pt.bounds.getSize(new V3());
    const n = new V3((rnd() - 0.5) * sz.x, (rnd() - 0.5) * sz.y * 1.4, (rnd() - 0.5) * sz.z).normalize();
    const off = n.dot(pt.center) + (rnd() - 0.5) * Math.min(sz.x, sz.y, sz.z) * 0.45;
    const s = split(pt.faces, n, off);
    if (!s || s.some((x) => x.volume < pt.volume * minPart)) continue;
    if (Math.abs(s[0].volume + s[1].volume - pt.volume) > Math.abs(pt.volume) * 1e-3) continue;
    parts.splice(sel, 1, ...s);
  }
  return parts.map((pt) => {
    const verts = [], pts = []; let big = 0, rest = new V3(0, -1, 0);
    for (const f of pt.faces) for (let i = 1; i < f.length - 1; i++) { const t = [f[0], f[i], f[i + 1]], nn = t[1].clone().sub(t[0]).cross(t[2].clone().sub(t[0])); if (nn.lengthSq() < 1e-18) continue;
      if (nn.length() > big) { big = nn.length(); rest = nn.clone().normalize(); } for (const p of t) { const q = p.clone().sub(pt.center); verts.push(q.x, q.y, q.z); if (pts.length < 600 && (verts.length / 3) % 7 === 0) pts.push(q); } }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3)); g.computeVertexNormals(); g.computeBoundingSphere();
    return { geometry: g, center: pt.center.clone(), volume: pt.volume, vertices: pts.length ? pts : [new V3()], restingNormal: rest };
  });
}
/* cartoon motion (new, after fracture-motion.js): a short pop, few big shards fly out and up, bounce twice, settle, fade.
   Baked once at 60 fps in the piece's own geometry units (H = piece height); playback is deterministic. */
function bakeShatter(THREE, shards, H, seed, duration = SHATTER_DURATION) {
  const FPS = 60, frames = Math.ceil(duration * FPS) + 1, STEP = 1 / 120, rnd = seededRandom(seed), V3 = THREE.Vector3;
  const g = 3.6 * H, q = new THREE.Quaternion(), turn = new THREE.Quaternion(), tmp = new V3();
  const lowest = (vs, qq) => { let m = Infinity; for (const v of vs) m = Math.min(m, tmp.copy(v).applyQuaternion(qq).y); return m; };
  for (const s of shards) {
    const p = s.center.clone(); q.identity();
    const out = new V3(s.center.x, 0, s.center.z); if (out.lengthSq() < 1e-8) out.set(rnd() - 0.5, 0, rnd() - 0.5); out.normalize();
    const ang = (rnd() - 0.5) * 0.9; out.applyAxisAngle(new V3(0, 1, 0), ang);
    const hfrac = Math.max(0, Math.min(1, s.center.y / H));
    const vel = out.multiplyScalar((0.4 + 0.45 * rnd()) * H).add(new V3(0, (0.35 + 0.35 * rnd() + 0.2 * hfrac) * H, 0));
    const spin = new V3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(); let w = 5 + 7 * rnd(), bounces = 0;
    const F = new Float32Array(frames * 7);
    for (let f = 0; f < frames; f++) {
      for (let k = 0; f && k < 2; k++) {
        const t = (f - 1) / FPS + (k + 1) * STEP;
        if (t < 0.06) { p.addScaledVector(vel, STEP * 0.25); continue; }        // crack: the piece swells apart before it flies
        vel.y -= g * STEP; p.addScaledVector(vel, STEP);
        turn.setFromAxisAngle(spin, w * STEP); q.premultiply(turn).normalize();
        const bottom = p.y + lowest(s.vertices, q);
        if (bottom < 0) { p.y -= bottom; if (vel.y < -0.15 * H && bounces < 2) { vel.y = -vel.y * 0.42; bounces++; } else vel.y = 0; vel.x *= 0.72; vel.z *= 0.72; w *= 0.6; }
      }
      p.toArray(F, f * 7); q.toArray(F, f * 7 + 3);
    }
    s.frames = F;
  }
  return shards;
}
function sampleShatter(THREE, s, t, obj) {
  const n = s.frames.length / 7, x = Math.max(0, Math.min(n - 1, t * 60)), a = Math.floor(x), b = Math.min(n - 1, a + 1), m = x - a;
  obj.position.fromArray(s.frames, a * 7).lerp(new THREE.Vector3().fromArray(s.frames, b * 7), m);
  obj.quaternion.fromArray(s.frames, a * 7 + 3).slerp(new THREE.Quaternion().fromArray(s.frames, b * 7 + 3), m);
}
const SHARD_CACHE = new WeakMap();

/**
 * createGem({ THREE, tint, depthTint, veins = true, seed, preset, vein, ... }) -> handle (see header)
 */
export function createGem({ THREE, tint, depthTint, veins = true, seed = 0, preset = null, vein = null, lantern = false, lanternStrength = 1.8, halo = false, haloAlpha = 0.15, pool = false, poolAlpha = 0.32, ...look } = {}) {
  if (!THREE) throw new Error('kfb-gem.v1: THREE missing');
  const P = GEM_PRESETS[preset || (tint ? '' : 'ruby')] || {};
  const params = { ...P, ...look, tint: tint || P.tint || '#d2465e', depthTint: depthTint || P.depthTint || tint || '#8a1428', vein: vein || P.vein || '#ff8a70', veins: !!veins, seed: String(preset || tint || 'gem'), name: preset || 'custom' };
  const R = registry(THREE), bundle = bundleFor(THREE, params); bundle.users++;
  const meshes = [];
  let state = 'idle', t = 0, shatter = null, disposed = false;
  const handle = {
    version: VERSION, seed,
    get material() { return bundle.make('idle'); },
    get state() { return state; },
    get meshes() { return meshes.slice(); },
    apply(object3d) {
      object3d.traverse((m) => {
        if (!m.isMesh || !m.geometry?.attributes?.position || m.userData.kfbGemShard || m.userData.kfbGemPool) return;
        if (!m.geometry.attributes.normal) m.geometry.computeVertexNormals();
        ensureGemAttribute(THREE, m.geometry, seed);
        if (!m.userData.kfbGemPrev) m.userData.kfbGemPrev = m.material;
        m.material = bundle.make(state === 'captured' || state === 'gone' ? 'idle' : state);
        m.userData.kfbGem = handle;
        if (!meshes.includes(m)) meshes.push(m);
      });
      if (halo || pool) syncHalos();
      return handle;
    },
    setState(s) {
      if (!STATES.includes(s)) throw new Error('kfb-gem.v1: unknown state ' + s);
      if (s === 'captured') { if (!shatter) startShatter(); state = 'captured'; return handle; }
      if (shatter) stopShatter();
      state = s; for (const m of meshes) m.material = bundle.make(s);
      return handle;
    },
    update(dt = 0) {
      t += dt; R.time.value = Math.max(R.time.value, t);
      if (shatter) {
        shatter.t += dt; const st = Math.min(shatter.t, SHATTER_DURATION);
        for (const it of shatter.items) for (const s of it.shards) sampleShatter(THREE, s, st, s.mesh);
        const fade = Math.min(1, Math.max(0, (shatter.t - 0.72) / (SHATTER_DURATION - 0.72)));
        shatter.mat.userData.kfbGem.stateU.value.w = 1 - fade * fade * (3 - 2 * fade);
        if (shatter.t >= SHATTER_DURATION) { for (const it of shatter.items) it.group.visible = false; state = 'gone'; }
      }
      return handle;
    },
    setEnvironment(renderer, mood, opts = {}) { return setGemEnvironment({ THREE, renderer, mood, ...opts }); },
    get lantern() { return lantern; }, set lantern(v) { lantern = !!v; },
    get halo() { return halo; }, set halo(v) { halo = !!v; syncHalos(); },
    get pool() { return pool; }, set pool(v) { pool = !!v; syncHalos(); },
    /* r2: practical light offer (V-385 one rig: the game decides whether this becomes a pool light). Format = kfb-stage-light createPracticals
       entry; intensity = lanternStrength x mood glow x the shader's own pulse and flicker (same formulas), colour = hot core mixed warm. */
    getPracticalLight() {
      if (!lantern || !meshes.length || state === 'gone') return null;
      const m = meshes.find((x) => x.geometry?.attributes?.kfbGem) || meshes[0], g = m.geometry; g.computeBoundingBox();
      const b = g.boundingBox, local = new THREE.Vector3((b.min.x + b.max.x) / 2, b.min.y + 0.55 * (b.max.y - b.min.y), (b.min.z + b.max.z) / 2);
      m.updateWorldMatrix(true, false); const pos = local.applyMatrix4(m.matrixWorld), ws = new THREE.Vector3().setFromMatrixScale(m.matrixWorld).x;
      const L = lifeOf(m), col = new THREE.Color(params.glow || params.tint).lerp(new THREE.Color(params.hot || params.vein), 0.3);   // r4: saturated glow colour, so the floor pool reads red / blue
      return { id: 'kfb-gem:' + m.uuid, type: 'crystal', pos: pos.toArray().map((v) => +v.toFixed(4)), color: '#' + col.getHexString(), intensity: +(lanternStrength * L.NG * L.pk * L.fl / 1.55).toFixed(4), range: +(1.6 * (b.max.y - b.min.y) * ws).toFixed(3), flicker: null, pulse: +L.pulse.toFixed(4), glowWeight: L.NG };
    },
    info() { return { version: VERSION, state, key: bundle.key, meshes: meshes.length, time: +t.toFixed(3), shards: shatter ? shatter.items.reduce((a, it) => a + it.shards.length, 0) : 0 }; },
    dispose() {
      if (disposed) return; disposed = true; stopShatter(); halo = false; pool = false; syncHalos();
      for (const m of meshes) { if (m.userData.kfbGemPrev) m.material = m.userData.kfbGemPrev; delete m.userData.kfbGemPrev; delete m.userData.kfbGem; }
      meshes.length = 0;
      if (--bundle.users <= 0) { for (const m of bundle.variants.values()) m.dispose(); bundle.variants.clear(); R.bundles.delete(bundle.key); }
      if (!R.bundles.size) { R.profiles.rows.clear(); R.profiles.next = 0; }   // all gems gone: proxy rows are recycled (re-registered on apply)
    },
  };
  /* r3: the shader's pulse + flicker for one mesh, in JS (same formulas and phase: vGemSeed is exact in float32) */
  function lifeOf(m) {
    const g = m.geometry, NG = R.mood.value.x, e = m.matrixWorld.elements, t = R.time.value;
    let sp = (Math.floor(e[12] * 4 + 0.5) * 0.1031 + Math.floor(e[14] * 4 + 0.5) * 0.0973) % 1; if (sp < 0) sp += 1;
    const gz = g.attributes.kfbGem?.getZ(0) || 0, phz = bundle.shared.uGemParams.value.z + gz + sp;
    const hz = PULSE_HZ + (PULSE_HZ_NIGHT - PULSE_HZ) * NG, pulse = 0.5 + 0.5 * Math.sin(2 * Math.PI * hz * t + 2 * Math.PI * phz);
    const pk = (0.7 + (0.8 - 0.7) * NG) + (0.6 + (0.75 - 0.6) * NG) * pulse, ph = 2 * Math.PI * (sp * 3 + gz * 5);
    const fl = 1 + 0.06 * Math.sin(2 * Math.PI * 1.7 * t + ph) + 0.04 * Math.sin(2 * Math.PI * 2.9 * t + 1.7 + ph * 1.3) + 0.025 * Math.sin(2 * Math.PI * 5.3 * t + 4.1 + ph * 0.7);
    return { NG, pulse, pk, fl };
  }
  /* r3 halo: one soft additive billboard per mesh (child of the mesh), 1.3 x silhouette, very low alpha x mood glow x pulse/flicker;
     depth-tested, never writes depth; alpha is 0 by day. Bottom of the gradient is transparent, so the floor cut does not show. */
  const halos = new Map(), pools = new Map();
  function haloTexture() {
    if (R.haloTex) return R.haloTex;
    const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,0.55)'); gr.addColorStop(0.55, 'rgba(255,255,255,0.16)'); gr.addColorStop(0.85, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); R.haloTex = new THREE.CanvasTexture(cv); R.haloTex.colorSpace = THREE.SRGBColorSpace; return R.haloTex;
  }
  function syncHalos() {
    for (const m of meshes) {
      if (halo && !halos.has(m)) {
        m.geometry.computeBoundingBox(); const b = m.geometry.boundingBox, sz = b.getSize(new THREE.Vector3());
        const mat = new THREE.SpriteMaterial({ map: haloTexture(), color: new THREE.Color(params.hot || params.vein).lerp(new THREE.Color(params.tint), 0.35), transparent: true, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending, opacity: 0 });
        const sp = new THREE.Sprite(mat); sp.name = 'kfb-gem-halo'; sp.userData.noMeasure = true; sp.castShadow = false; sp.renderOrder = 3;
        sp.position.set((b.min.x + b.max.x) / 2, b.min.y + 0.52 * sz.y, (b.min.z + b.max.z) / 2); sp.scale.setScalar(1.3 * Math.max(sz.y, sz.x, sz.z));
        sp.onBeforeRender = () => { const L = lifeOf(m); mat.opacity = state === 'captured' || state === 'gone' ? 0 : haloAlpha * L.NG * L.pk * L.fl * uState(); };
        m.add(sp); halos.set(m, sp);
      } else if (!halo && halos.has(m)) { const sp = halos.get(m); sp.removeFromParent(); sp.material.dispose(); halos.delete(m); }
      /* r4 light pool: a lantern lights its floor. Additive floor decal (child of the mesh, at its base), glow colour, mood x pulse x
         flicker; works for any number of pieces without real lights. Real spill = getPracticalLight() (host decides). */
      if (pool && !pools.has(m)) {
        m.geometry.computeBoundingBox(); const b = m.geometry.boundingBox, sz = b.getSize(new THREE.Vector3()), d = Math.max(sz.x, sz.z);
        const mat = new THREE.MeshBasicMaterial({ map: haloTexture(), color: new THREE.Color(params.glow || params.tint), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
        const q = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), mat); q.name = 'kfb-gem-pool';
        Object.assign(q.userData, { noMeasure: true, noClay: true, kfbGemPool: true }); q.castShadow = false; q.receiveShadow = false; q.renderOrder = 2;
        q.position.set((b.min.x + b.max.x) / 2, b.min.y + 0.004 * sz.y, (b.min.z + b.max.z) / 2); q.scale.set(1.7 * d + 0.18 * sz.y, 1, 1.7 * d + 0.18 * sz.y);   // ~3 m for the king: stays on the floor
        q.onBeforeRender = () => { const L = lifeOf(m); mat.opacity = state === 'captured' || state === 'gone' ? 0 : Math.min(1, poolAlpha * L.NG * L.pk * L.fl); };
        m.add(q); pools.set(m, q);
      } else if (!pool && pools.has(m)) { const q = pools.get(m); q.removeFromParent(); q.material.dispose(); q.geometry.dispose(); pools.delete(m); }
    }
  }
  const uState = () => (state === 'active' ? 1.6 : 1);
  function startShatter() {
    const mat = bundle.make('captured', true); mat.transparent = true; mat.depthWrite = true;
    shatter = { t: 0, mat, items: [] };
    meshes.forEach((m, i) => {
      let tpl = SHARD_CACHE.get(m.geometry);
      if (!tpl) { tpl = fractureGeometry(THREE, m.geometry, { count: 8, seed: 85173 + i * 97 }); SHARD_CACHE.set(m.geometry, tpl); }
      const H = m.geometry.attributes.kfbGem?.getY(0) || 1;
      const shards = tpl.map((s) => ({ ...s, center: s.center.clone() }));
      bakeShatter(THREE, shards, H, 1028 + Math.floor(hash01(seed) * 1e6));
      const group = new THREE.Group(); group.name = 'kfb-gem-shatter';
      group.position.copy(m.position); group.quaternion.copy(m.quaternion); group.scale.copy(m.scale);
      for (const s of shards) {
        if (!s.geometry.attributes.kfbGem) { const n = s.geometry.attributes.position.count, a = new Float32Array(n * 4); for (let k = 0; k < n; k++) { a[k * 4 + 1] = H; a[k * 4 + 2] = hash01(seed); } s.geometry.setAttribute('kfbGem', new THREE.BufferAttribute(a, 4)); }
        const sm = new THREE.Mesh(s.geometry, mat); sm.userData.kfbGemShard = true; sm.userData.noMeasure = true; sm.castShadow = true; sm.receiveShadow = true; sm.frustumCulled = false;
        sm.position.copy(s.center); s.mesh = sm; group.add(sm);
      }
      // the intact piece is hidden through its material, not m.visible: hosts that frame or measure by visible meshes keep a stable box
      (m.parent || m).add(group); shatter.hidden = shatter.hidden || new THREE.MeshBasicMaterial({ visible: false }); m.material = shatter.hidden;
      shatter.items.push({ mesh: m, group, shards });
    });
  }
  function stopShatter() {
    if (!shatter) return;
    for (const it of shatter.items) { it.group.removeFromParent(); it.mesh.material = bundle.make(state === 'captured' || state === 'gone' ? 'idle' : state); }
    bundle.clones.delete(shatter.mat); shatter.mat.dispose(); shatter.hidden?.dispose(); shatter = null;
  }
  return handle;
}
