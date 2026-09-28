/* KFB CLAY-CITY-MVP-01 · T4 Knet-Strecke segment in the city tile
   Visual owner: KFB Knet-Strecke T4 (intake on this branch, unchanged modules imported from GitHub).
   Geometry/contact owner: Track Core stream TD03 (kfb.track-core/0.8.1) — samples are used as they are,
   only placed with ONE rigid transform (rotation about Y + translation). Nothing on the driving surface is
   edited, smoothed or re-derived.
   Window: s 1245 → 1407.6 (east_run CONNECT inside ZB track→nature · nature · ZN nature→track · CURVE_EASE · WIDTH_STEP),
   ending at the KICKER joint = ramp/branch socket (the kicker itself is not built in this slice).
   The strang cross-section (sideProfile/ringOf), the deck strip, the lips and the road-surface shader are
   ported 1:1 from lab-track/track-look.v5.js (T4); markings are T4 M2 (buildRoadMarkingsM2), clipped to the
   window. T4 extras (kerb stones, embankment, fences, VFX board, bent KayKit houses) are NOT in this slice. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const T4_PIN = '7cc4a4f3fc40fcad56e75ddf587b77cd856e202c';
export const T4_DIR = 'tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T4/KFB_TRACK_T4_M2_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1/';
const T4 = `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@${T4_PIN}/` + T4_DIR.split('/').map(encodeURIComponent).join('/');
export const SEGMENT = Object.freeze({ s0: 1245, s1: 1407.6, socket: { piece: 'kicker', type: 'KICKER', kind: 'ramp/branch socket' }, world: 'canyon' });

const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const hash = (n) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const vnoise = (x) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash(i) * (1 - u) + hash(i + 1) * u; };

const ROAD_V = `attribute float aW; attribute float aBio; attribute vec2 aSU; varying float vW; varying float vBio; varying vec2 vSU;\n`;
const ROAD_APPLY = /* glsl */`
{ vec3 cO = vBio > 0.5 ? uRoadC : uRoadA; float rim; float sel = kfbBlend(vSU, 1.7, vW, rim); diffuseColor.rgb = mix(cO, uRoadB, sel) * (1.0 - 0.12 * rim); }
`;

async function gunzipJSON(url) {
  const r = await fetch(url); if (!r.ok) throw Error('T4_SOURCE_REQUIRED ' + url + ' ' + r.status);
  const ds = new DecompressionStream('gzip');
  return JSON.parse(await new Response(r.body.pipeThrough(ds)).text());
}
const json = async (f) => { const r = await fetch(T4 + f); if (!r.ok) throw Error('T4_SOURCE_REQUIRED ' + f + ' ' + r.status); return r.json(); };

export async function loadT4() {
  const t0 = performance.now();
  const [CM, CR, TM, AT, M1, M2m, td, TP, MR, M2] = await Promise.all([
    import(T4 + 'lab-clay/clay-material.v10.js'), import(T4 + 'lab-clay/clay-relief.v2.js'), import(T4 + 'lab-clay/clay-toolmix.v1.js'),
    import(T4 + 'lab-track/transition-atlas.v1.js'), import(T4 + 'lab-track/road-markings.m1.js'), import(T4 + 'lab-track/road-markings.m2.js'),
    gunzipJSON(T4 + 'lab-track/data/td03.stream.json.gz'), json('lab-track/transition-profiles.v1.json'), json('lab-track/road-markings.m1.json'), json('lab-track/road-markings.m2.json')
  ]);
  return { CM, CR, TM, AT, M1, M2m, td, TP, MR, M2, loadMs: Math.round(performance.now() - t0) };
}

/* local polyline of the window (for placement search), in stream coordinates */
export function windowPolyline(td, seg = SEGMENT, every = 8) {
  const S = td.samples, ds = td.ds, a = Math.round(seg.s0 / ds), b = Math.min(S.length - 1, Math.round(seg.s1 / ds)), out = [];
  for (let i = a; i <= b; i += every) out.push({ i, s: S[i].s, x: S[i].p[0], y: S[i].p[1], z: S[i].p[2], hw: (S[i].slots[13][0] - S[i].slots[0][0]) / 2 });
  return { a, b, pts: out, T0: S[a].T, p0: S[a].p };
}

/* rigid placement: stream point p0 → world (x,z), stream heading T0 → world heading; deck height → ground */
export function makePlacement(win, x, z, heading, groundY = 0) {
  const t0 = Math.atan2(win.T0[0], win.T0[2]), th = heading - t0, c = Math.cos(th), s = Math.sin(th);
  const M = new THREE.Matrix4().makeTranslation(x, groundY, z).multiply(new THREE.Matrix4().makeRotationY(th)).multiply(new THREE.Matrix4().makeTranslation(-win.p0[0], -win.p0[1], -win.p0[2]));
  const apply = (p) => { const dx = p[0] - win.p0[0], dz = p[2] - win.p0[2]; return { x: x + dx * c + dz * s, y: groundY + p[1] - win.p0[1], z: z - dx * s + dz * c }; };
  return { M, th, apply };
}

export function buildT4Segment({ L, placement, seg = SEGMENT, tools = null, reliefTex = null, deferMarkings = false }) {
  const t0 = performance.now();
  const { CM, CR, TM, AT: ATm, M2m, td, TP, MR, M2 } = L;
  const { makeClayUniforms, makeClayMaterial, seedGeometry, PROFILES } = CM;
  const S = td.samples, N = S.length, ds = td.ds, a0 = Math.round(seg.s0 / ds), b0 = Math.min(N - 1, Math.round(seg.s1 / ds));
  const info = { tris: 0, errors: [], window: { s0: S[a0].s, s1: S[b0].s, samples: b0 - a0 + 1, joints: td.joints.filter((j) => j.s >= S[a0].s - 1 && j.s <= S[b0].s + 1).map((j) => j.piece + ':' + j.type) } };

  /* materials — T4 recipe (track-look.v5 lines 99–166), world preset canyon, hand measure K = 3 */
  let tex = reliefTex;   // host may hand in its (same clay-relief v2) texture: saves one relief bake at boot
  if (!tex) { const rel = CR.makeClayRelief({ size: 512, seed: 31 });
    tex = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true; tex.needsUpdate = true; }
  const U = makeClayUniforms(THREE, tex); U.uClayMottle.value = 0.04;
  if (tools) { [U.uClayToolA.value, U.uClayToolB.value, U.uClayToolC.value] = tools; U.uClayToolOn.value = 1; U.uClayLegacyStroke.value = 0; }
  U.uClayPrint.value = tex; U.uClayPrintOn.value = 0;
  const K = 3; U.uClayHand.value = 0.5 * K; U.uClayTile.value = 1.6 * K; U.uClayPrintTile.value = 4.5 * K; U.uClayMacro.value = 0.5; U.uClayLodK.value = 0.6; U.uClayStroke.value = 0.7;
  const QUIET = { print: 0.3, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 0.9, crease: 0.5 };
  const prof = (key, scale, k, over = {}) => { const p = { ...PROFILES[key], ...over }; p.scale = (scale ?? p.scale) * k; p.gougeSize *= k; p.crackSize *= k; p.dentSize *= k; return p; };
  const MIXKEY = { strangT: 'strang', strang: 'strang' };
  const M = {};
  const clay = (key, color, profile, extra = {}) => { const mk = MIXKEY[key], p = { ...profile, tools: tools && mk ? TM.TOOLMIX[mk] : null, legacy: tools && mk ? 0 : 1 };
    return (M[key] = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color, side: extra.side ?? THREE.FrontSide }), profile: p, role: extra.role })); };
  const W0 = { roadStreet: '#566680', roadTrack: '#3d4a60', strang: '#ef5a22', pad: '#f2b632' };
  const RU = { uRoadA: { value: new THREE.Color(W0.roadStreet) }, uRoadB: { value: new THREE.Color(W0.roadTrack) }, uRoadC: { value: new THREE.Color(TP.worldPresets.canyon.nature.path) } };
  {
    const m = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: '#ffffff' }), profile: { ...prof('road', 0.5, K), legacy: 1 } });
    const prev = m.onBeforeCompile;
    m.onBeforeCompile = (sh, r) => { prev(sh, r); Object.assign(sh.uniforms, RU);
      sh.vertexShader = ROAD_V + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vW = aW; vBio = aBio; vSU = aSU;');
      sh.fragmentShader = 'uniform vec3 uRoadA, uRoadB, uRoadC; varying float vW; varying float vBio; varying vec2 vSU;\n' + L.M1.KFB_BLEND_GLSL + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + ROAD_APPLY); };
    m.customProgramCacheKey = () => 'kfb-clay-v10-road7'; M.road = m;
  }
  clay('strang', W0.strang, prof('house', 0.6, K, QUIET));
  clay('strangT', W0.strang, prof('house', 0.6, K, QUIET));
  const PU = ATm.patchify(M.strangT, 'strang', 1.7);
  const T4C = TP.worldPresets.canyon;
  if (PU) { PU.uPB.value.set(T4C.city?.curb || '#e2d0bc'); PU.uPC.value.set(T4C.nature?.grass || '#6aae4c'); }
  clay('markH', MR.colors.worlds.canyon.hell, prof('water', 0.9, K, { print: 0.2, dent: 0 }), { role: 'knetbar' });
  clay('markS', MR.colors.worlds.canyon.signal, prof('water', 0.9, K, { print: 0.2, dent: 0 }), { role: 'knetbar' });
  clay('socket', W0.pad, prof('water', 0.9, K, { print: 0.2, dent: 0 }), { role: 'knetbar' });

  const tm = {}; let tq = performance.now(); const lap = (k) => { tm[k] = Math.round(performance.now() - tq); tq = performance.now(); };
  lap('materials');
  /* atlas over the full stream (zones use absolute s) */
  const AT = ATm.makeAtlas({ S, N, ds, TP, GY: -0.6, MR, M2 });
  const W3 = (q, l, h) => [q.p[0] + q.R[0] * l + q.U[0] * h, q.p[1] + q.R[1] * l + q.U[1] * h, q.p[2] + q.R[2] * l + q.U[2] * h];
  lap('atlas');
  const kr = new Float32Array(N), ks = new Float32Array(N);
  for (let i = 0; i < N; i++) { const a = S[Math.max(0, i - 4)], b = S[Math.min(N - 1, i + 4)], q = S[i];
    const d = (b.T[0] - a.T[0]) * q.R[0] + (b.T[1] - a.T[1]) * q.R[1] + (b.T[2] - a.T[2]) * q.R[2]; kr[i] = d / Math.max(0.5, b.s - a.s); }
  for (let i = 0; i < N; i++) { let v = 0, n = 0; for (let j = Math.max(0, i - 16); j <= Math.min(N - 1, i + 16); j++) { v += kr[j]; n++; } ks[i] = v / n; }
  const SIDE = { 1: { road: 7, sh: 8, ib: 9, it: 10, ot: 11, un: 13 }, [-1]: { road: 6, sh: 5, ib: 4, it: 3, ot: 2, un: 0 } };
  const RIB = 3.5;
  const sideProfile = (q, i, sd) => {
    const I = SIDE[sd], sl = q.slots, o = q.prm.offset || 0;
    const e = sd * (sl[I.road][0] - o), ib = sd * (sl[I.ib][0] - o), H = sl[I.it][1], drop = Math.max(0, -sl[I.sh][1]), D = sl[I.un][1];
    const bt = AT.barrierT(q.s, sd, i), bn = AT.bio(q.s) === 1, Hx = lerp(H, bn ? 0.5 : 0.32, bt), rxK = bn ? 1 + 0.9 * bt : 1, ibx = bn ? ib : lerp(ib, e + 0.35, bt);
    const inner = sstep(0.008, 0.022, ks[i] * sd) * (1 - bt), outer = sstep(0.014, 0.04, -ks[i] * sd) * (1 - bt);
    const wave = 0.06 * (vnoise(q.s / 9 + (sd > 0 ? 3.1 : 7.7)) - 0.5) * 2;
    const r = clamp(0.55 * (Hx + drop), 0.14, 1.25) * (1 + wave) * (1 + 0.32 * outer), rX = r * rxK;
    const cx = Math.max(ibx, e + 0.4) + 0.85 * rX + 0.12 * outer, top = Hx + 0.3 * outer, cy = top - r;
    const pts = [[e - 0.14, -0.03]];
    const xa = cx - 0.94 * rX, ya = cy - 0.34 * r, rib = 0.5 + 0.5 * Math.cos(2 * Math.PI * q.s / RIB);
    for (let n = 1; n <= 6; n++) { const t = n / 7; let y = lerp(0, ya, t * t) - drop * Math.sin(Math.PI * t);
      y += inner * 0.26 * rib * Math.sin(Math.PI * Math.min(1, t * 1.3)); pts.push([e + t * (xa - e), y]); }
    for (let n = 0; n <= 14; n++) { const th = (200 - n * (240 / 14)) * Math.PI / 180, rr = r * (1 + inner * 0.12 * rib * Math.max(0, 1 - n / 3)); pts.push([cx + rr * rxK * Math.cos(th), cy + rr * Math.sin(th)]); }
    const y0 = cy - 0.64 * r, b = 0.14 * r, Dm = Math.min(D, y0 - 0.1, -0.7);
    pts.push([cx + 0.95 * rX + b, lerp(y0, Dm, 0.4)], [cx + 0.86 * rX + b, lerp(y0, Dm, 0.78)], [cx + 0.5 * rX, Dm + 0.06], [cx * 0.55, Dm - 0.02], [0, Dm - 0.04]);
    return pts;
  };
  const ringOf = (q, i) => { const Lp = sideProfile(q, i, -1), Rp = sideProfile(q, i, 1);
    const pts = Lp.map(([x, y]) => W3(q, (q.prm.offset || 0) - x, y)); for (let n = Rp.length - 1; n >= 0; n--) pts.push(W3(q, (q.prm.offset || 0) + Rp[n][0], Rp[n][1])); return pts; };

  const runs = []; { let a = -1; for (let i = a0; i <= b0 + 1; i++) { const on = i <= b0 && (S[i].prm.surface ?? 1) > 0; if (on && a < 0) a = i; if (!on && a >= 0) { if (i - a > 2) runs.push([a, i - 1]); a = -1; } } }
  const wS = new Float32Array(N); for (let i = a0; i <= b0; i++) wS[i] = AT.roadTrack(S[i].s, S[i].skin);
  const bS = S.map((q, i) => (i >= a0 && i <= b0 && AT.bio(q.s) === 1 ? 1 : 0));

  const group = new THREE.Group(); group.name = 'T4 Knet-Strecke · TD03 s ' + seg.s0 + '–' + seg.s1;
  const addMesh = (g, mat, { cast = true, recv = true, name = '' } = {}) => { g.applyMatrix4(placement.M); g.computeVertexNormals(); const o = new THREE.Mesh(g, mat); o.castShadow = cast; o.receiveShadow = recv; o.name = name; group.add(o); info.tris += (g.index ? g.index.count : g.attributes.position.count) / 3; return o; };
  const lips = [], contact = { strang: null, deck: null };
  { const sp = [], si = [], rp = [], rw = [], rsu = [], ri = [], spw = [], spb = [], sps = [], rbio = []; let sBase = 0, rBase = 0;
    for (const [a, b] of runs) {
      let nr = 0;
      /* strang rows every STRIDE samples (1 m instead of 0.5 m: half the triangles, same cross-section);
         the deck keeps every Track Core sample (it is the contact surface) */
      const STRIDE = 2; let row = -1;
      for (let i = a; i <= b; i++) { const q = S[i];
        if ((i - a) % STRIDE === 0 || i === b) { const ring = ringOf(q, i); nr = ring.length; let arc = 0; row++;
          ring.forEach((p, k) => { if (k) arc += Math.hypot(p[0] - ring[k - 1][0], p[1] - ring[k - 1][1], p[2] - ring[k - 1][2]); sp.push(...p); const sd = k < nr / 2 ? -1 : 1; spw.push(AT.barrierT(q.s, sd, i)); spb.push(bS[i]); sps.push(q.s, arc); });
          if (row > 0) { const A = sBase + (row - 1) * nr, B = sBase + row * nr; for (let k = 0; k < nr - 1; k++) si.push(A + k, B + k, A + k + 1, A + k + 1, B + k, B + k + 1); } }
        const Lr = q.slots[6], Rr = q.slots[7];
        for (let n = 0; n <= 6; n++) { const lat = lerp(Lr[0], Rr[0], n / 6), h = lerp(Lr[1], Rr[1], n / 6); rp.push(...W3(q, lat, h)); rw.push(wS[i]); rbio.push(bS[i]); rsu.push(q.s, lat); }
        if (i > a) { const C = rBase + (i - a - 1) * 7, E = rBase + (i - a) * 7; for (let k = 0; k < 6; k++) ri.push(C + k, C + k + 1, E + k, C + k + 1, E + k + 1, E + k); } }
      for (const [i, dir, r0] of [[a, -1, 0], [b, 1, row]]) { const base = sBase + r0 * nr, c = [0, 0, 0];
        for (let k = 0; k < nr; k++) for (let j = 0; j < 3; j++) c[j] += sp[(base + k) * 3 + j] / nr;
        const ci = sp.length / 3; sp.push(...c); spw.push(0); spb.push(0); sps.push(S[i].s, 0); const T = S[i].T;
        for (let k = 0; k < nr - 1; k++) { const p0 = V(sp.slice((base + k) * 3, (base + k) * 3 + 3)), p1 = V(sp.slice((base + k + 1) * 3, (base + k + 1) * 3 + 3));
          const nrm = p0.clone().sub(V(c)).cross(p1.clone().sub(V(c))); if (nrm.dot(V(T)) * dir > 0) si.push(ci, base + k, base + k + 1); else si.push(ci, base + k + 1, base + k); } }
      sBase = sp.length / 3; rBase = rp.length / 3;
      for (const i of [a, b]) { const q = S[i], w = q.slots[13][0] - q.slots[0][0], g = new THREE.CapsuleGeometry(0.48, Math.max(0.5, w - 0.96), 8, 18);
        g.rotateZ(Math.PI / 2); g.applyMatrix4(new THREE.Matrix4().makeBasis(V(q.R), V(q.U), V(q.T).negate()));
        const c = W3(q, (q.slots[0][0] + q.slots[13][0]) / 2, -0.5); g.translate(c[0], c[1], c[2]); seedGeometry(THREE, g, 700 + i); lips.push(g); }
    }
    const gs = new THREE.BufferGeometry(); gs.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
    gs.setAttribute('aPW', new THREE.Float32BufferAttribute(spw, 1)); gs.setAttribute('aPBio', new THREE.Float32BufferAttribute(spb, 1)); gs.setAttribute('aPS', new THREE.Float32BufferAttribute(sps, 2)); gs.setIndex(si); seedGeometry(THREE, gs, 11);
    addMesh(gs, M.strangT, { name: 't4-strang' });
    const lg = mergeGeometries(lips.map((g) => { const n = g.index ? g.toNonIndexed() : g; n.deleteAttribute('uv'); return n; }), false); addMesh(lg, M.strang, { name: 't4-lippen' });
    const gr = new THREE.BufferGeometry(); gr.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3)); gr.setAttribute('aW', new THREE.Float32BufferAttribute(rw, 1)); gr.setAttribute('aBio', new THREE.Float32BufferAttribute(rbio, 1));
    gr.setAttribute('aSU', new THREE.Float32BufferAttribute(rsu, 2)); gr.setIndex(ri); seedGeometry(THREE, gr, 5);
    addMesh(gr, M.road, { name: 't4-fahrbahn' });
    contact.deck = { vertices: new Float32Array(gr.attributes.position.array), indices: new Uint32Array(gr.index.array) };
    contact.strang = { vertices: new Float32Array(gs.attributes.position.array), indices: new Uint32Array(gs.index.array) };
  }

  lap('strang+deck');
  /* M2 markings: built on the full stream (their rhythm runs backwards from events), clipped to the window by nearest sample.
     Costs ~1.5 s on the full TD03 → the host may defer it until after the first playable frame. */
  const addMarkings = () => { const tm0 = performance.now();
  try {
    const MK = M2m.buildRoadMarkingsM2({ THREE, S, N, ds, A: AT, M2, MR1: MR, seedGeometry });
    const grid = new Map(), CELL = 6; for (let i = 0; i < N; i++) { const p = S[i].p, k = Math.floor(p[0] / CELL) + ',' + Math.floor(p[2] / CELL); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(i); }
    const nearestI = (x, y, z) => { let best = 1e9, bi = -1; const cx = Math.floor(x / CELL), cz = Math.floor(z / CELL);
      for (let u = -2; u <= 2; u++) for (let v = -2; v <= 2; v++) { const Lk = grid.get((cx + u) + ',' + (cz + v)); if (Lk) for (const j of Lk) { const p = S[j].p, d = (p[0] - x) ** 2 + (p[1] - y) ** 2 * 4 + (p[2] - z) ** 2; if (d < best) { best = d; bi = j; } } } return bi; };
    const clipGeo = (g) => { if (!g) return null; const n = g.index ? g.toNonIndexed() : g, P = n.attributes.position, keep = [];
      for (let t = 0; t < P.count; t += 3) { const x = (P.getX(t) + P.getX(t + 1) + P.getX(t + 2)) / 3, y = (P.getY(t) + P.getY(t + 1) + P.getY(t + 2)) / 3, z = (P.getZ(t) + P.getZ(t + 1) + P.getZ(t + 2)) / 3, i = nearestI(x, y, z); if (i >= a0 && i <= b0) keep.push(t); }
      if (!keep.length) return null;
      const out = new THREE.BufferGeometry(); for (const [name, attr] of Object.entries(n.attributes)) { const w = attr.itemSize, arr = new Float32Array(keep.length * 3 * w); keep.forEach((t, k) => { for (let v = 0; v < 3; v++) for (let c = 0; c < w; c++) arr[(k * 3 + v) * w + c] = attr.array[(t + v) * w + c]; }); out.setAttribute(name, new THREE.BufferAttribute(arr, w)); }
      return out; };
    const h = clipGeo(MK.hell), sg = clipGeo(MK.signal);
    if (h) addMesh(h, M.markH, { name: 't4-m2-markierung-hell', cast: false });
    if (sg) addMesh(sg, M.markS, { name: 't4-m2-markierung-signal', cast: false });
    info.markings = { pieces: MK.pieces, hellTris: h ? h.attributes.position.count / 3 : 0, signalTris: sg ? sg.attributes.position.count / 3 : 0 };
  } catch (e) { info.errors.push('M2 markings: ' + e.message); }

    info.markingsMs = Math.round(performance.now() - tm0); info.drawCalls = group.children.length; info.tris = group.children.reduce((n, o) => n + (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3, 0); return info.markings; };
  if (!deferMarkings) addMarkings();
  lap('markings');
  /* ramp/branch socket at the KICKER joint: a flat clay chevron plate + a record */
  const qs = S[b0], sw = qs.slots[7][0] - qs.slots[6][0];
  { const w = sw * 0.6, th = 0.9, tip = 1.6, sh = new THREE.Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(0, tip); sh.lineTo(w / 2, 0); sh.lineTo(w / 2, -th); sh.lineTo(0, tip - th); sh.lineTo(-w / 2, -th); sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.14, bevelSegments: 3, curveSegments: 4 });
    const m = new THREE.Matrix4().makeBasis(V(qs.R), V(qs.T), V(qs.U)); m.setPosition(V(W3(qs, qs.prm.offset || 0, 0.03)).addScaledVector(V(qs.T), -3));
    g.applyMatrix4(m); g.deleteAttribute('uv'); seedGeometry(THREE, g, 9001); addMesh(g, M.socket, { name: 't4-socket-kicker', cast: false }); }
  const sp = placement.apply(qs.p), heading = Math.atan2(qs.T[0], qs.T[2]) + placement.th;
  info.socket = { ...seg.socket, s: +qs.s.toFixed(2), x: +sp.x.toFixed(2), y: +sp.y.toFixed(2), z: +sp.z.toFixed(2), heading: +heading.toFixed(3), deckWidthM: +sw.toFixed(2) };
  lap('socket'); info.stepMs = tm;
  info.buildMs = Math.round(performance.now() - t0);
  info.drawCalls = group.children.length;
  /* contact arrays were copied after addMesh → already in world space (same vertices the renderer draws) */
  return { group, contact, info, AT, materials: M, addMarkings: deferMarkings ? addMarkings : null };
}
