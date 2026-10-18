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
export const PULSE_HZ = 0.2;
export const MAX_SPANS = 32, MAX_ROWS = 64, PROFILE_BINS = 16;
export const GEM_PRESETS = Object.freeze({
  // tint = colour at the surface / thin parts, depthTint = colour after ~half a piece height of travel, vein = glow colour
  ruby: Object.freeze({ tint: '#d2465e', depthTint: '#8a1428', vein: '#ffc27a', body: 0.13, veinGlow: 1.0 }),
  sapphire: Object.freeze({ tint: '#4a6fd8', depthTint: '#1a2f86', vein: '#a8e0ff', body: 0.14, veinGlow: 0.55 }),
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
  R = { time: { value: 0 }, profiles: { tex, data, rows: new Map(), next: 0 }, bundles: new Map(), envs: new Map(), env: null };
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
function ensureGemAttribute(THREE, geometry, seed) {
  const R = registry(THREE);
  if (geometry.attributes.kfbGem && R.profiles.rows.has(geometry.uuid)) return geometry.attributes.kfbGem;   // row still valid
  const rec = registerProfile(THREE, geometry), n = geometry.attributes.position.count, a = new Float32Array(n * 4);
  const phase = hash01(seed + '|' + (geometry.name || ''));
  for (let i = 0; i < n; i++) { a[i * 4] = rec.row + 1; a[i * 4 + 1] = rec.height; a[i * 4 + 2] = phase; a[i * 4 + 3] = 0; }
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
vGemSeed = fract(sin(dot(modelMatrix[3].xz, vec2(12.9898, 78.233))) * 43758.5453);
`;
const FRAG_PARS = /* glsl */`
#define GEM_MAX_SPANS ${MAX_SPANS}
uniform sampler2D uGemProfiles; uniform float uGemTime; uniform vec4 uGemState;
uniform vec3 uGemSigma; uniform vec3 uGemVein; uniform vec4 uGemParams; uniform vec4 uGemLook;
uniform vec3 uGemSkyTop; uniform vec3 uGemSkyBot;
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
  float rot = uGemParams.z * 0.5236 + uGemState.z * uGemTime * 0.35;
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
    vec3 d0 = refract(I, N, 1.0 / 1.76), so = P / H + vec3(uGemParams.z * 3.7, 0.0, uGemParams.z * 1.9);
    for (int k = 0; k < 3; k++) {
      float t = 0.025 + 0.06 * float(k); if (t * H > firstLen) break;
      vec3 p = so + d0 * t; float wb = gemNoise(p * 2.3 + 19.0);
      float mask = smoothstep(0.30, 0.50, gemNoise(p * 1.4 + 31.0));          // veins only in parts of the stone
      float a = gemNoise(p * 5.5) + 0.5 * gemNoise(p * 11.0 + 5.0);
      vein = max(vein, mask * (1.0 - smoothstep(0.0, 0.006 + 0.012 * wb, abs(a - 0.74))) * (1.0 - 0.3 * float(k)));
    }
  }
  float pulse = 0.5 + 0.5 * sin(6.2831853 * ${PULSE_HZ.toFixed(2)} * uGemTime + 6.2831853 * (uGemParams.z + vGemInfo.z + vGemSeed));
  float glow = uGemParams.w * (0.7 + 0.6 * pulse) * uGemState.x;
  inner = mix(inner, inner * 0.4, vein * 0.5);
  vec3 emit = uGemVein * vein * glow;
  float rimF = pow(1.0 - gemCos, 2.5);
  emit += mix(vec3(1.0), uGemVein, 0.8) * rimF * rimF * uGemState.y * 0.45;            // active: soft rim, tinted
  emit += uGemVein * uGemLook.w * (0.6 + 0.4 * pulse) * (0.35 + 0.65 * rimF) * (1.0 + uGemState.y);   // faint inner glow, mostly at grazing angles
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
  R.env = env.texture;
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
export function createGem({ THREE, tint, depthTint, veins = true, seed = 0, preset = null, vein = null, ...look } = {}) {
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
        if (!m.isMesh || !m.geometry?.attributes?.position || m.userData.kfbGemShard) return;
        if (!m.geometry.attributes.normal) m.geometry.computeVertexNormals();
        ensureGemAttribute(THREE, m.geometry, seed);
        if (!m.userData.kfbGemPrev) m.userData.kfbGemPrev = m.material;
        m.material = bundle.make(state === 'captured' || state === 'gone' ? 'idle' : state);
        m.userData.kfbGem = handle;
        if (!meshes.includes(m)) meshes.push(m);
      });
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
    info() { return { version: VERSION, state, key: bundle.key, meshes: meshes.length, time: +t.toFixed(3), shards: shatter ? shatter.items.reduce((a, it) => a + it.shards.length, 0) : 0 }; },
    dispose() {
      if (disposed) return; disposed = true; stopShatter();
      for (const m of meshes) { if (m.userData.kfbGemPrev) m.material = m.userData.kfbGemPrev; delete m.userData.kfbGemPrev; delete m.userData.kfbGem; }
      meshes.length = 0;
      if (--bundle.users <= 0) { for (const m of bundle.variants.values()) m.dispose(); bundle.variants.clear(); R.bundles.delete(bundle.key); }
      if (!R.bundles.size) { R.profiles.rows.clear(); R.profiles.next = 0; }   // all gems gone: proxy rows are recycled (re-registered on apply)
    },
  };
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
