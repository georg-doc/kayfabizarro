/* KFB transition-atlas v1 (T4, 28.09.) — Übergangsatlas auf T3 v2 / K2 (gelesen von track-look.v5).
 * Liest lab-track/transition-profiles.v1.json (kfb.transition-profiles/1): Zonen entlang TD03, Familien A/B/C, Layer-Fenster in u.
 * Owner: nur Look. Route, Fahrfläche, Kontakt, Kollision bleiben Track Core (TD03 unverändert, Kontaktfläche geschlossen).
 * Baut additiv: Markierungs-Knetsegmente, Bordstein aus Knetsteinen, Stadtsockel + Gehwegplatten, KayKit-Häuser (gebogen),
 *   Stadtmöbel (KayKit / Tiny Treats), Böschung + Graben + Zaunsockel, Tiny-Treats-Zaun, Dreiergruppen, Quellenbank, VFX-Probenbrett.
 * Kein Alpha-Fade: Wechsel über Knetflecken (Patch-Shader), abtauchende Segmente, wachsende Massen, gestaffelte Fenster. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { buildRoadMarkings, KFB_BLEND_GLSL, runoutY } from './road-markings.m1.js?r=4';
import { buildRoadMarkingsM2 } from './road-markings.m2.js?r=1';

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const h1 = n => { const v = Math.sin(n * 91.345 + 47.853) * 43758.5453; return v - Math.floor(v); };
const ni = g => (g.index ? g.toNonIndexed() : g);
const vn = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return h1(i) * (1 - u) + h1(i + 1) * u; };

export const PIN = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@378b209355b13304e3cff656ec0806ca5b89df28/';
export const SRC = {
  KK: 'media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/',
  TTH: 'media/3D_Assets/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/',
  TTP: 'media/3D_Assets/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/'
};
const ASSET_LIST = [
  ['KK', 'building_A'], ['KK', 'building_B'], ['KK', 'building_C'], ['KK', 'building_D'], ['KK', 'building_E'], ['KK', 'building_F'], ['KK', 'building_G'], ['KK', 'building_H'],
  ['KK', 'streetlight'], ['KK', 'firehydrant'], ['TTP', 'bench'], ['TTP', 'trashcan'], ['TTP', 'tree_large'], ['TTH', 'fence_straight_long'], ['TTH', 'fence_post']
];

// Knetflecken zwischen Grundfarbe (Material) und Biomfarbe B (aPBio 0) oder C (aPBio 1); Gewicht aPW, Musterkoordinate aPS
const PATCH_V = `attribute float aPW; attribute float aPBio; attribute vec2 aPS; varying float vPW; varying float vPBio; varying vec2 vPS;\n`;
const PATCH_F = 'uniform vec3 uPB, uPC; uniform float uPCell; varying float vPW; varying float vPBio; varying vec2 vPS;\n' + KFB_BLEND_GLSL;
const PATCH_APPLY = /* glsl */`
{ float rim; float sel = kfbBlend(vPS, uPCell, vPW, rim); vec3 alt = vPBio > 0.5 ? uPC : uPB;
  diffuseColor.rgb = mix(diffuseColor.rgb, alt, sel) * (1.0 - 0.12 * rim); }
`;
export function patchify(m, key, cell = 1.7) {
  const PU = { uPB: { value: new THREE.Color('#ffffff') }, uPC: { value: new THREE.Color('#ffffff') }, uPCell: { value: cell } };
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (sh, r) => { prev(sh, r); Object.assign(sh.uniforms, PU);
    sh.vertexShader = PATCH_V + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vPW = aPW; vPBio = aPBio; vPS = aPS;');
    sh.fragmentShader = PATCH_F + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + PATCH_APPLY); };
  m.customProgramCacheKey = () => 'kfb-clay-v10-t4patch2-' + key;
  m.userData.patch = PU; return PU;
}

export function makeAtlas({ S, N, ds, TP, GY, MR, M2 }) {
  const Lend = S[N - 1].s;
  const idx = s => clamp(Math.round(s / ds), 0, N - 1);
  const zones = TP.zones.map(z => ({ ...z, fam: TP.families[z.family] })).sort((a, b) => a.s0 - b.s0);
  const Z = Object.fromEntries(zones.map(z => [z.id, z]));
  const BIO = { city: 0, nature: 1 };
  const nonTrack = f => (f.to === 'track' ? f.from : f.to);
  const seg = s => { for (const z of zones) if (s >= z.s0 && s <= z.s1) return { z, u: (s - z.s0) / (z.s1 - z.s0) };
    let reg = zones[0].fam.from, zz = zones[0]; for (const z of zones) if (s > z.s1) { reg = z.fam.to; zz = z; } return { reg, zz }; };
  const w = (layer, s, side = 0) => { const g = seg(s);
    if (g.reg) return g.reg === 'track' ? 0 : 1;
    const f = g.z.fam, win = f.windows[layer] || [0.3, 0.7], u = g.u - (f.sideLag || 0) * side * 0.5, t = sstep(win[0], win[1], u);
    return f.to === 'track' ? 1 - t : t; };
  const bio = s => { const g = seg(s); if (g.reg) return BIO[g.reg] ?? -1; return BIO[nonTrack(g.z.fam)]; };
  const sideOn = (s, sd) => { const g = seg(s), z = g.z || g.zz, L = z.sides || ['left', 'right']; return L.includes(sd < 0 ? 'left' : 'right'); };
  const groundK = i => 1 - sstep(1.2, 4.0, S[i].p[1]);
  const curbK = i => 1 - sstep(3.0, 8.0, S[i].p[1]);
  const barrierT = (s, sd, i) => { const b = bio(s); if (b < 0 || !sideOn(s, sd)) return 0; const t = w('barrier', s, sd); return b === 0 ? t * groundK(i) : t; };
  const roadTrack = (s, skin) => (skin === 'mag' ? 1 : 1 - w('road', s, 0));
  const off = q => q.prm.offset || 0;
  const edgeOf = (q, sd) => (sd > 0 ? q.slots[7][0] - off(q) : off(q) - q.slots[6][0]);
  // Weltpunkt: seitlicher Abstand d vom Mittelstreifen nach außen (Seite sd), Höhe h über dem Sample (U) oder absolut
  const P = (q, sd, d, h) => [q.p[0] + q.R[0] * (off(q) + sd * d) + q.U[0] * h, q.p[1] + q.R[1] * (off(q) + sd * d) + q.U[1] * h, q.p[2] + q.R[2] * (off(q) + sd * d) + q.U[2] * h];
  const PA = (q, sd, d, y) => [q.p[0] + q.R[0] * (off(q) + sd * d), y, q.p[2] + q.R[2] * (off(q) + sd * d)];

  // Abstandsraster mit s (für Häuser-Freiraum und blocked())
  const CELL = 8, grid = new Map();
  for (let i = 0; i < N; i += 2) { const q = S[i], k = Math.floor(q.p[0] / CELL) + ',' + Math.floor(q.p[2] / CELL); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(i); }
  const scan = (x, z, maxR, fn) => { const cx = Math.floor(x / CELL), cz = Math.floor(z / CELL), n = Math.ceil(maxR / CELL);
    for (let a = -n; a <= n; a++) for (let b = -n; b <= n; b++) { const L = grid.get((cx + a) + ',' + (cz + b)); if (L) for (const j of L) fn(j); } };
  const clearOther = (x, z, s, excl = 70, maxR = 60, yMin = -99) => { let best = maxR;
    scan(x, z, maxR, j => { const q = S[j]; if (Math.abs(q.s - s) < excl || q.p[1] < yMin) return; const d = Math.hypot(q.p[0] - x, q.p[2] - z); if (d < best) best = d; }); return best; };
  const nearest = (x, z, maxR = 100) => { let best = maxR, bi = -1; scan(x, z, maxR, j => { const q = S[j], d = Math.hypot(q.p[0] - x, q.p[2] - z); if (d < best) { best = d; bi = j; } }); return bi < 0 ? null : { i: bi, d: best }; };

  const A = { zones, Z, w, bio, seg, sideOn, groundK, barrierT, roadTrack, edgeOf, info: { markPieces: 0, curbStones: 0, slabs: 0, houses: 0, props: 0, fence: 0, triples: 0, assets: 0, assetMs: 0, errors: [] } };

  // ---------- Plan (vor der Welt: Fußabdrücke für blocked) ----------
  const spans = [], damRows = []; let board = null;
  const DAM_SD = -1, damOuterMax = 66;
  A.plan = ({ ctr, ext, distXZ }) => {
    for (const sd of [-1, 1]) { let a = -1; for (let s = 0; s <= Lend + 1; s += 1) { const i = idx(s), on = s <= Lend && bio(s) === 0 && groundK(i) > 0.8 && sideOn(s, sd) && w('sidewalk', s, sd) > 0.01;
      if (on && a < 0) a = s; if (!on && a >= 0) { if (s - a > 6) spans.push({ sd, a, b: s - 1 }); a = -1; } } }
    const z0 = Z.ZB, z1 = Z.ZN;
    for (let s = z0.s0; s <= z1.s1; s += 1) { const i = idx(s), q = S[i], e = edgeOf(q, DAM_SD);
      const wE = w('embank', s, DAM_SD), wD = w('ditch', s, DAM_SD), wF = w('fence', s, DAM_SD), wN = w('nature', s, DAM_SD);
      const te = sstep(0, 1, wE), Yt = lerp(GY - 1.2, q.p[1] - 0.3, te), H = Yt - GY, run = 1.35 * Math.max(0, H) + 5, x2 = e + 5.2;
      const wob = 1 + 0.08 * (vn(s / 23 + 4.2) - 0.5) * 2, crown = (1 - te) * 1.6;
      const pts = [[e - 2.2, GY - 1.2, 1, 1], [e - 1.4, Yt - 2.6, 1, 1], [e + 0.4, Yt - 0.9, 0, 0], [e + 2.3, Yt - 0.05, 0, 0], [x2, Yt + 0.05 + crown * 0.3, 0, 0],
        [x2 + 0.9, Yt - 1.05 * wD + crown * 0.4, wD, 0], [x2 + 2.1, Yt - 1.1 * wD + crown * 0.5, wD, 0], [x2 + 3.0, Yt + crown * 0.6, 0, 0], [x2 + 3.9, Yt + 0.5 * wF + crown * 0.7, 0, 0],
        [x2 + 4.8, Yt + 0.05 + crown * 0.8, 0, 1], [x2 + 10 * wob, Yt + 0.35 + crown, 0, 1], [x2 + 15 * wob, Yt + 0.1 + crown * 0.8, 0, 1]];
      const dTop = x2 + 15 * wob, yTop = Yt + 0.1 + crown * 0.8;
      for (let k = 1; k <= 6; k++) { const t = k / 6; pts.push([dTop + run * t * wob, GY - 0.5 + (yTop - GY + 0.5) * (1 - Math.pow(t, 2.2)), sstep(0.2, 0.85, t), 1]); }
      pts.push([dTop + run * wob + 4, GY - 1.0, 1, 1]);
      damRows.push({ s, i, e, Yt, wE, wD, wF, wN, x2, pts, outer: dTop + run * wob + 4 });
    }
    const bw = 4 * 17 + 4, bd = 7 * 17 + 4;
    for (const [dx, dz] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      const x = ctr.x + dx * (ext.x / 2 + 105), z = ctr.z + dz * (ext.z / 2 + 105);
      const ok = [[0, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]].every(([a, b]) => distXZ(x + a * bw / 2, z + b * bd / 2, 80) >= 38);
      if (ok) { board = { x, z, w: bw, d: bd }; break; } }
    A.board = board;
  };
  const damAt = s => damRows[clamp(Math.round(s - Z.ZB.s0), 0, damRows.length - 1)];
  A.blocked = (x, z, r = 0) => {
    if (board && Math.abs(x - board.x) < board.w / 2 + 40 + r * 0.6 && Math.abs(z - board.z) < board.d / 2 + 12 + r * 0.6) return true;
    for (const q of [S[0], S[N - 1]]) if (Math.hypot(x - q.p[0], z - q.p[2]) < 58 + r * 0.6) return true;
    const n = nearest(x, z, 100); if (!n) return false; const q = S[n.i], lat = (x - q.p[0]) * q.R[0] + (z - q.p[2]) * q.R[2];
    if (q.s >= Z.ZB.s0 - 10 && q.s <= Z.ZN.s1 + 10 && lat * DAM_SD > 0 && Math.abs(lat) < damOuterMax + r * 0.6) return true;
    if (bio(q.s) === 0 && groundK(n.i) > 0.3 && Math.abs(lat) < 46 + r * 0.6) return true;
    return false;
  };

  // ---------- Böschung + Dreiergruppen (vor dem Backen der Welt-Bins) ----------
  A.buildNature = B => {
    const { addMesh, M, tree, bush, rock } = B;
    const pos = [], pw = [], pb = [], ps = [], ind = []; const C = damRows[0].pts.length;
    damRows.forEach((r, ri) => { const q = S[r.i];
      for (const [d, y, wgt, bi] of r.pts) { const p = PA(q, DAM_SD, d, y); pos.push(...p); pw.push(wgt); pb.push(bi); ps.push(r.s, d); }
      if (ri > 0) { const a0 = (ri - 1) * C, b0 = ri * C; for (let c = 0; c < C - 1; c++) { const A0 = a0 + c, B0 = b0 + c, C0 = a0 + c + 1, D0 = b0 + c + 1;
        if (DAM_SD < 0) ind.push(A0, B0, C0, C0, B0, D0); else ind.push(A0, C0, B0, C0, D0, B0); } } });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aPW', new THREE.Float32BufferAttribute(pw, 1)); g.setAttribute('aPBio', new THREE.Float32BufferAttribute(pb, 1)); g.setAttribute('aPS', new THREE.Float32BufferAttribute(ps, 2));
    g.setIndex(ind); g.computeVertexNormals(); B.seedGeometry(THREE, g, 1201);
    addMesh(g, M.dam, { name: 't4-boeschung' });
    // Dreiergruppen auf der Wiese hinter dem Zaun: Baum (Anker) · zwei Büsche · Fels, jede dritte Stelle bleibt Sichtachse
    let k = 0;
    for (let s = Z.ZB.s0 + 20; s < Z.ZN.s1 - 18; s += 12, k++) { if (k % 3 === 2) continue; const r = damAt(s); if (r.wN < 0.12 + 0.3 * h1(k * 13 + 3) || r.Yt < S[r.i].p[1] - 3.5) continue;
      const q = S[r.i], sc = 0.8 + 0.35 * h1(k * 5 + 1), at2 = (d, ds2) => { const rr = damAt(s + ds2), qq = S[rr.i]; return { p: PA(qq, DAM_SD, d, 0), y: rr.Yt + 0.3 }; };
      const t = at2(r.x2 + 10, 0); tree(t.p[0], t.p[2], sc, 6000 + k * 20, t.y);
      const b1 = at2(r.x2 + 7, 4.5), b2 = at2(r.x2 + 13, -3.5); bush(b1.p[0], b1.p[2], sc * 0.9, 6000 + k * 20 + 7, b1.y); bush(b2.p[0], b2.p[2], sc * 0.85, 6000 + k * 20 + 11, b2.y);
      const rk = at2(r.x2 + 8.2, -6); rock(rk.p[0], rk.p[2], sc * 0.8, 6000 + k * 20 + 15, rk.y - 0.1);
      A.info.triples++; }
  };

  // ---------- Hauptbau (nach der Welt, lädt KayKit/Tiny Treats) ----------
  const src = {};
  const geoOf = gl => { gl.scene.updateMatrixWorld(true); const parts = []; let mat = null;
    gl.scene.traverse(o => { if (!o.isMesh) return; let g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld); if (g.index) g = ni(g);
      for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k); parts.push(g); mat = mat || o.material; });
    const g = parts.length > 1 ? mergeGeometries(parts) : parts[0]; g.computeBoundingBox(); const b = g.boundingBox, c = b.getCenter(new THREE.Vector3());
    g.translate(-c.x, -b.min.y, -c.z); g.computeBoundingBox(); return { g, mat, box: g.boundingBox.clone(), size: g.boundingBox.getSize(new THREE.Vector3()), scene: gl.scene }; };
  const place = (g, pos, fwd, yaw = 0) => { // lokales +Z zeigt nach fwd (horizontal), +Y hoch
    const Zv = new THREE.Vector3(fwd[0], 0, fwd[2]).normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw), Y = new THREE.Vector3(0, 1, 0), X = new THREE.Vector3().crossVectors(Y, Zv);
    g.applyMatrix4(new THREE.Matrix4().makeBasis(X, Y, Zv).setPosition(pos[0], pos[1], pos[2])); return g; };
  const bend = (base, sc, ysc, bnd, dir, twist) => { const g = base.g.clone(); g.scale(sc, sc * ysc, sc); const p = g.attributes.position, n = g.attributes.normal, H = base.size.y * sc * ysc;
    for (let i = 0; i < p.count; i++) { const t = clamp(p.getY(i) / H, 0, 1), b = bnd * H * t * t, a = twist * t, c = Math.cos(a), s = Math.sin(a), x = p.getX(i), z = p.getZ(i);
      p.setXYZ(i, x * c - z * s + b * dir[0], p.getY(i), x * s + z * c + b * dir[1]); if (n) { const nx = n.getX(i), nz = n.getZ(i); n.setXYZ(i, nx * c - nz * s, n.getY(i), nx * s + nz * c); } }
    return g; };

  A.build = async B => {
    const { addMesh, M, seedGeometry, onNote, makeClayMaterial, U, prof, K, QUIET, TOOLMIX } = B;
    const t0 = performance.now(); onNote('Quellen werden geladen (KayKit, Tiny Treats) …');
    const loader = new GLTFLoader();
    await Promise.all(ASSET_LIST.map(async ([pk, nm]) => { try { const gl = await loader.loadAsync(PIN + SRC[pk] + nm + '.gltf'); src[nm] = { ...geoOf(gl), pack: pk, file: SRC[pk] + nm + '.gltf' }; A.info.assets++; }
      catch (e) { A.info.errors.push('SOURCE_REQUIRED ' + nm + ': ' + e.message); } }));
    A.info.assetMs = Math.round(performance.now() - t0); A.src = src;
    const mk = (s, cls, over = {}) => makeClayMaterial(THREE, U, { src: s, profile: { ...prof(cls === 'trunk' || cls === 'nature' ? 'nature' : 'house', 0.6, K, cls === 'house' ? QUIET : { print: 0.3, dent: 0 }), tools: TOOLMIX[cls], legacy: 0, ...over } });
    const kkMat = src.building_A?.mat, ttMat = src.fence_straight_long?.mat || src.bench?.mat;
    if (kkMat) M.kk = mk(kkMat, 'house'); if (ttMat) { M.ttWood = mk(ttMat, 'trunk'); M.ttLeaf = mk(ttMat, 'nature'); }
    const bins = {}; const put = (key, g, seed) => { seedGeometry(THREE, g, seed); (bins[key] = bins[key] || []).push(g); };
    const kkBins = { kk: [] }, ttW = [], ttL = [];

    // Markierungen M2 (lab-track/road-markings.m2.json), Fallback M1: Bänder folgen der Fahrbahn, Zebra vor Sackgassen
    const MV = M2 ? 'm2' : 'm1'; onNote('Markierungen ' + MV.toUpperCase() + ' werden gerollt …');
    const MK = M2 ? buildRoadMarkingsM2({ THREE, S, N, ds, A, M2, MR1: MR, seedGeometry }) : buildRoadMarkings({ THREE, S, N, ds, A, MR, seedGeometry });
    if (MK.hell) addMesh(MK.hell, M.markH, { name: MV + '-markierung-hell', cast: false });
    if (MK.signal) addMesh(MK.signal, M.markS, { name: MV + '-markierung-signal', cast: false });
    A.info.markPieces = MK.pieces; A.info.markSet = MV; A.info.mark = MK.info || null; A.markEnds = MK.ends;

    // Bordstein: gequetschte Knetsteine auf dem abgesenkten Wulst, erst vereinzelt, dann durchgehend
    onNote('Bordstein wird gesetzt …');
    const curb = [];
    for (let s = 0.5; s < Lend - 0.5; s += 1.05) { if (bio(s) !== 0) continue; const i = idx(s), q = S[i];
      for (const sd of [-1, 1]) { if (!sideOn(s, sd)) continue; const wc = w('curb', s, sd) * curbK(i), hh = h1(Math.floor(s * 3.1) + sd * 57); if (wc < 0.02 || hh > Math.pow(wc, 0.8)) continue;
        const grow = sstep(0, 0.6, wc), g = new RoundedBoxGeometry(0.56, 0.36, 0.9, 2, 0.13); g.deleteAttribute('uv');
        g.scale(1 + 0.12 * (hh - 0.5), (0.45 + 0.55 * grow) * (1 + 0.15 * (h1(hh * 99) - 0.5)), 1 - 0.1 * h1(hh * 7));
        const T = new THREE.Vector3(...q.T), Uv = new THREE.Vector3(...q.U), R = new THREE.Vector3(...q.R); const m4 = new THREE.Matrix4().makeBasis(R, Uv, T.negate()).multiply(new THREE.Matrix4().makeRotationY((hh - 0.5) * 0.12));
        const p = P(q, sd, edgeOf(q, sd) + 0.62, 0.1); m4.setPosition(p[0], p[1], p[2]); g.applyMatrix4(m4); seedGeometry(THREE, g, 2600 + curb.length); curb.push(g); } }
    if (curb.length) addMesh(mergeGeometries(curb.map(g => ni(g))), M.curb, { name: 't4-bordstein' });
    A.info.curbStones = curb.length;

    // Stadtsockel (breitet sich mit dem Gehweg-Fenster aus) + Gehwegplatten in drei Reihen
    onNote('Stadt wird gesockelt …');
    const slabs = [], plates = [];
    for (const sp of spans) { const { sd, a, b } = sp; const pos = [], ind = []; let rows = 0, C = 0;
      for (let s = a; s <= b; s += 1) { const i = idx(s), q = S[i], e = edgeOf(q, sd), wS = w('sidewalk', s, sd), dOut = e + 1.6 + 34 * sstep(0, 1, wS) * (0.94 + 0.12 * vn(s / 17 + sd));
        const pts = [[e + 0.3, -1.0], [e + 0.6, 0.1], [e + 0.9, 0.15], [Math.max(e + 1.0, dOut - 2), 0.16], [dOut - 0.6, 0.02], [dOut + 0.5, GY - 0.45], [dOut + 1.0, GY - 0.9]];
        C = pts.length; for (const [d, y] of pts) pos.push(...PA(q, sd, d, y));
        if (rows > 0) { const a0 = (rows - 1) * C, b0 = rows * C; for (let c = 0; c < C - 1; c++) { const A0 = a0 + c, B0 = b0 + c, C0 = a0 + c + 1, D0 = b0 + c + 1; if (sd < 0) ind.push(A0, B0, C0, C0, B0, D0); else ind.push(A0, C0, B0, C0, D0, B0); } }
        rows++; }
      if (rows > 1) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(ind); g.computeVertexNormals(); plates.push(ni(g)); }
      for (let s = a + 1; s <= b - 1; s += 2.1) { const i = idx(s), q = S[i], e = edgeOf(q, sd), wS = w('sidewalk', s, sd);
        for (let r = 0; r < 3; r++) { const hh = h1(Math.floor(s * 4.7) * 3 + r + sd * 91); if (wS < 0.1 + r * 0.2 + 0.28 * hh) continue;
          const g = new RoundedBoxGeometry(1.6, 0.2, 1.95, 2, 0.07); g.deleteAttribute('uv'); g.scale(1 + 0.06 * (hh - 0.5), 1 + 0.3 * (h1(hh * 31) - 0.5), 1);
          place(g, PA(q, sd, e + 1.35 + r * 1.75, 0.22), q.T, (hh - 0.5) * 0.06); seedGeometry(THREE, g, 3000 + slabs.length); slabs.push(g); } } }
    // Plätze an den Streckenenden (Quartier schließt die Blickachse)
    const ends = [[S[0], -1], [S[N - 1], 1]];
    for (const [q, dir] of ends) { if (bio(q.s) !== 0) continue; const e = edgeOf(q, 1), g = new RoundedBoxGeometry(2 * (e + 34), 1.4, 46, 4, 0.6); g.deleteAttribute('uv');
      const c = [q.p[0] + q.T[0] * dir * 24.5, 0.15 - 0.7, q.p[2] + q.T[2] * dir * 24.5]; place(g, c, q.T); plates.push(ni(g)); }
    // Verwehung (road-markings.m1 runout + transitions.cover): Asphalt und Linien laufen gerade weiter, der Platzsand weht darüber.
    // Loses über Festes: kein Asphalt außerhalb der Fahrbahn, die Endform entsteht aus der Verwehung.
    if (M.drift) { const RO = MR.runout, mT = MR.unit.m, L = RO.length * mT, B0 = RO.before * mT;
      for (const [q, dir] of ends) { if (bio(q.s) !== 0) continue;
        const l6 = q.slots[6][0], l7 = q.slots[7][0], hw = (l7 - l6) / 2, cx = (l6 + l7) / 2, T = q.T, R = q.R, Uv = q.U;
        const grid = (v0, v1, dv, x0, nx, fn) => { const pos = [], aw = [], su = [], ind = [], xs = [], vs = [];
          for (let k = 0; k <= nx; k++) xs.push(-x0 + 2 * x0 * k / nx); for (let v = v0; v <= v1 + 1e-6; v += dv) vs.push(v);
          for (const v of vs) for (const x of xs) { const [y, wv] = fn(x, v), lat = cx + x;
            pos.push(q.p[0] + T[0] * dir * v + R[0] * lat + Uv[0] * y, q.p[1] + T[1] * dir * v + R[1] * lat + Uv[1] * y, q.p[2] + T[2] * dir * v + R[2] * lat + Uv[2] * y); aw.push(wv); su.push(q.s + dir * v, lat); }
          const C = xs.length; for (let r = 0; r < vs.length - 1; r++) for (let c = 0; c < C - 1; c++) { const A0 = r * C + c, B1 = A0 + 1, C0 = A0 + C, D0 = C0 + 1;
            if (dir > 0) ind.push(A0, B1, C0, B1, D0, C0); else ind.push(A0, C0, B1, B1, C0, D0); }
          const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('aW', new THREE.Float32BufferAttribute(aw, 1));
          g.setAttribute('aBio', new THREE.Float32BufferAttribute(new Float32Array(aw.length), 1)); g.setAttribute('aSU', new THREE.Float32BufferAttribute(su, 2)); g.setIndex(ind); g.computeVertexNormals(); return g; };
        const ga = grid(0, L * 0.97, 0.5, hw, 14, (x, v) => [runoutY(MR, v) + 0.004, 0]); seedGeometry(THREE, ga, 3600 + (dir > 0 ? 1 : 0)); addMesh(ga, M.road, { name: 'm1-strasse-weiter', cast: false });
        const gs = grid(-B0, L, 0.4, hw + 0.3, 40, (x, v) => { const t = v / L, qq = Math.abs(x) / hw; return [runoutY(MR, Math.max(0, v)) + RO.lift, clamp(1.08 * t + RO.edgeK * Math.pow(qq, RO.edgePow) + 0.03, 0, 1)]; });
        seedGeometry(THREE, gs, 3610 + (dir > 0 ? 1 : 0)); addMesh(gs, M.drift, { name: 'm1-verwehung', cast: false }); A.info.runouts = (A.info.runouts || 0) + 1; } }
    plates.forEach((g, n) => seedGeometry(THREE, g, 3500 + n));
    if (plates.length) addMesh(mergeGeometries(plates), M.plate, { name: 't4-stadtsockel' });
    if (slabs.length) addMesh(mergeGeometries(slabs.map(g => ni(g))), M.walk, { name: 't4-gehweg' });
    A.info.slabs = slabs.length;

    // Häuser: KayKit City Builder Bits, Maß 4,1 (wie city-assets.js), ungleich hoch, leicht gebogen, Front zur Straße
    onNote('Häuser werden gebogen …');
    const HOUSES = ['building_A', 'building_B', 'building_C', 'building_D', 'building_E', 'building_F', 'building_G', 'building_H'].filter(n => src[n]);
    const RHY = [1.25, 0.92, 1.1, 1.38, 0.95, 1.18, 1.02, 1.3], SC = 4.1;
    const house = (nm, pos, fwd, k) => { const base = src[nm], ysc = RHY[k % RHY.length], bd = (h1(k * 17 + 5) - 0.5) * 0.12, dirA = h1(k * 3 + 1) * Math.PI * 2;
      const g = place(bend(base, SC, ysc, bd, [Math.cos(dirA), Math.sin(dirA)], (h1(k * 29) - 0.5) * 0.18), pos, fwd); put('kk', g, 4000 + k); A.info.houses++; };
    if (HOUSES.length && M.kk) {
      let k = 0;
      for (const sp of spans) { const { sd, a, b } = sp; let s = a + 3;
        while (s < b - 4) { const nm = HOUSES[(k * 5 + (sd > 0 ? 3 : 0)) % HOUSES.length], W = src[nm].size.x * SC, D = src[nm].size.z * SC, mid = s + W / 2;
          if (mid + W / 2 > b) break; const i = idx(mid), q = S[i], e = edgeOf(q, sd), c = PA(q, sd, e + 6.2 + D / 2, 0.12);
          const ok = w('props', mid, sd) > 0.12 + 0.6 * h1(k * 7 + 2) && clearOther(c[0], c[2], mid, 70, 40) > D / 2 + 13;
          if (ok) house(nm, c, [-sd * q.R[0], 0, -sd * q.R[2]], k);
          s += W + 1.2 + 2.6 * h1(k * 11 + 4); k++; } }
      for (const [q, dir] of ends) { if (bio(q.s) !== 0) continue; let lat = -22; let j = 0;
        while (lat < 22) { const nm = HOUSES[(j * 3 + (dir > 0 ? 1 : 4)) % HOUSES.length], W = src[nm].size.x * SC, D = src[nm].size.z * SC; if (lat + W > 24) break;
          const d = lat + W / 2, c = [q.p[0] + q.T[0] * dir * (40 + D / 2 - 14) + q.R[0] * d, 0.12, q.p[2] + q.T[2] * dir * (40 + D / 2 - 14) + q.R[2] * d];
          house(nm, c, [-dir * q.T[0], 0, -dir * q.T[2]], 50 + j + (dir > 0 ? 20 : 0)); lat += W + 0.8 + 1.6 * h1(j * 5 + dir); j++; } }
    }
    // Stadtmöbel nach der Großform: Laterne 21 m · Baum versetzt · Bank + Mülleimer 42 m · Hydrant 63 m
    const prop = (nm, bin, sc, pos, fwd, seed) => { const b = src[nm]; if (!b) return; const g = b.g.clone(); g.scale(sc, sc, sc); place(g, pos, fwd); seedGeometry(THREE, g, seed); bin.push(g); A.info.props++; };
    for (const sp of spans) { const { sd, a, b } = sp;
      for (let s = a + 4; s < b - 2; s += 10.5) { const i = idx(s), q = S[i], e = edgeOf(q, sd), n = Math.round(s / 10.5), hh = h1(n * 13 + sd * 7); if (w('props', s, sd) < 0.15 + 0.6 * hh) continue;
        const fwd = [-sd * q.R[0], 0, -sd * q.R[2]];
        if (n % 2 === 0) prop('streetlight', kkBins.kk, 5.95, PA(q, sd, e + 1.55, 0.3), fwd, 4500 + n);
        else prop('tree_large', ttL, 1.9, PA(q, sd, e + 3.1, 0.2), fwd, 4600 + n);
        if (n % 4 === 1) { prop('bench', ttW, 1.6, PA(q, sd, e + 4.7, 0.3), fwd, 4700 + n); const q2 = S[idx(s + 2.4)]; prop('trashcan', ttW, 1.6, PA(q2, sd, e + 4.8, 0.3), fwd, 4800 + n); }
        if (n % 6 === 3) prop('firehydrant', kkBins.kk, 3.49, PA(S[idx(s - 3)], sd, e + 1.35, 0.3), fwd, 4900 + n); } }
    for (const g of kkBins.kk) (bins.kk = bins.kk || []).push(g);

    // Zaun: Tiny Treats Homely House fence_straight_long / fence_post, Maß 1,5, auf dem Sockel hinter dem Graben
    if (src.fence_straight_long && src.fence_post && damRows.length) { const FS = 1.5, pitch = 2.0 * FS;
      for (let s = Z.ZB.s0 + 1.5; s < Z.ZN.s1 - 1.5; s += pitch) { const r = damAt(s); if (r.wF < 0.22) continue; const q = S[r.i], hh = h1(Math.floor(s) * 3 + 5);
        const full = r.wF > 0.55 + 0.25 * hh, nm = full ? 'fence_straight_long' : 'fence_post', g = src[nm].g.clone(); g.scale(FS, FS * (0.96 + 0.08 * hh), FS);
        const p = PA(q, DAM_SD, r.x2 + 3.9, r.Yt + 0.5 * r.wF - 0.12), Tn = [q.T[0], 0, q.T[2]];
        place(g, p, [-Tn[2], 0, Tn[0]], (hh - 0.5) * 0.05); seedGeometry(THREE, g, 5000 + A.info.fence); ttW.push(g); A.info.fence++; } }

    // Quellenbank: je Quelle links unverändert (Originalmaterial), rechts Knete + begründete Verformung
    if (board) { const bx = board.x + board.w / 2 + 20, items = [['building_A', SC, 'bend'], ['building_E', SC, 'bend'], ['fence_straight_long', 1.5, ''], ['streetlight', 5.95, ''], ['tree_large', 1.9, '']].filter(([n]) => src[n]);
      const plin = []; A.bench = [];
      items.forEach(([nm, sc, how], j) => { const z = board.z - board.d / 2 + 10 + j * 23;
        for (const [side, dx] of [['src', 6.5], ['clay', -6.5]]) { const pg = new RoundedBoxGeometry(11, 1.4, 11, 3, 0.5); pg.deleteAttribute('uv'); pg.translate(bx + dx, GY + 0.1, z); seedGeometry(THREE, pg, 5600 + j * 2 + (side === 'clay' ? 1 : 0)); plin.push(ni(pg));
          const top = [bx + dx, GY + 0.8, z];
          if (side === 'src') { const o = src[nm].scene.clone(true); o.scale.setScalar(sc); o.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(o), c = bb.getCenter(new THREE.Vector3());
            o.position.set(top[0] - c.x, top[1] - bb.min.y, top[2] - c.z); o.traverse(m => { if (m.isMesh) { m.castShadow = m.receiveShadow = true; } }); B.root.add(o); }
          else { const g = how === 'bend' ? bend(src[nm], sc, RHY[j], 0.06, [1, 0], 0.08) : (() => { const g2 = src[nm].g.clone(); g2.scale(sc, sc, sc); return g2; })();
            place(g, top, [1, 0, 0]); seedGeometry(THREE, g, 5700 + j); (src[nm].pack === 'KK' ? (bins.kk = bins.kk || []) : nm === 'tree_large' ? ttL : ttW).push(g); } }
        A.bench.push({ nm, file: src[nm].file, pack: src[nm].pack, scale: sc, z }); });
      addMesh(mergeGeometries(plin), M.plate, { name: 't4-quellenbank' });
      const z0b = board.z - board.d / 2 + 10; A.shotBench = { pos: new THREE.Vector3(bx + 10, GY + 19, z0b - 34), tgt: new THREE.Vector3(bx, GY + 3, z0b + 26) }; }

    if (bins.kk?.length && M.kk) addMesh(mergeGeometries(bins.kk), M.kk, { name: 't4-kaykit' });
    if (ttW.length && M.ttWood) addMesh(mergeGeometries(ttW), M.ttWood, { name: 't4-tinytreats-holz' });
    if (ttL.length && M.ttLeaf) addMesh(mergeGeometries(ttL), M.ttLeaf, { name: 't4-tinytreats-baum' });

    // VFX-Probenbrett: Zeilen = Ereignisse, Spalten = Biome
    A.cells = [];
    if (board) { const EVT = ['roll', 'drift', 'scrape', 'landing', 'boost', 'biome'], BIOS = ['city', 'meadow', 'canyon', 'coast'], P0 = 17;
      const slabsB = { city: [], meadow: [], canyon: [], coast: [] }, walls = [], pads = [];
      const x0 = board.x - 1.5 * P0, z0 = board.z - 2.5 * P0 - P0 * 0.5;
      EVT.forEach((ev, r) => BIOS.forEach((bi, c) => { const cx = x0 + c * P0, cz = z0 + r * P0, top = GY + 0.9, bB = BIOS[(c + 1) % 4];
        const halves = ev === 'biome' ? [[bi, -3.75, 7.5], [bB, 3.75, 7.5]] : [[bi, 0, 15]];
        for (const [b2, dx, wd] of halves) { const g = new RoundedBoxGeometry(wd, 1.4, 15, 3, 0.45); g.deleteAttribute('uv'); g.translate(cx + dx, top - 0.7, cz); seedGeometry(THREE, g, 5800 + r * 8 + c); slabsB[b2].push(ni(g)); }
        if (ev === 'scrape') { const g = new THREE.CapsuleGeometry(0.75, 12, 6, 14); g.rotateX(Math.PI / 2); g.translate(cx - 5.2, top + 0.55, cz); seedGeometry(THREE, g, 5900 + c); walls.push(ni(g)); }
        if (ev === 'boost') { const g = new RoundedBoxGeometry(3.2, 0.14, 9, 2, 0.06); g.deleteAttribute('uv'); g.translate(cx, top + 0.05, cz); seedGeometry(THREE, g, 5950 + c); pads.push(ni(g)); }
        A.cells.push({ event: ev, biome: bi, biomeB: bB, c: new THREE.Vector3(cx, top, cz), r, col: c }); }));
      for (const [b2, list] of Object.entries(slabsB)) if (list.length) addMesh(mergeGeometries(list), M['vfxGround_' + b2], { name: 't4-brett-' + b2 });
      addMesh(mergeGeometries(walls.map(g => { for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'claySeed'].includes(k)) g.deleteAttribute(k); return g; })), M.strang, { name: 't4-brett-bande' });
      addMesh(mergeGeometries(pads), M.pad, { name: 't4-brett-boost' });
      const bp = new RoundedBoxGeometry(board.w + 4, 1.0, board.d + 4, 3, 0.5); bp.deleteAttribute('uv'); bp.translate(board.x, GY - 0.25, board.z); seedGeometry(THREE, bp, 5990); addMesh(bp, M.plate, { name: 't4-brett-sockel' });
      A.shotAtlas = { pos: new THREE.Vector3(board.x - 88, GY + 82, board.z - 6), tgt: new THREE.Vector3(board.x + 4, GY, board.z) };
      A.shotRow = r => { const z = z0 + r * P0; return { pos: new THREE.Vector3(board.x, GY + 24, z - 38), tgt: new THREE.Vector3(board.x, GY, z + 2) }; };
    }
    A.info.buildMs = Math.round(performance.now() - t0);
  };

  // ---------- Kameras, Licht, Welt ----------
  A.shots = at => { const V3 = (q, sd, d, h) => new THREE.Vector3(...P(q, sd, d, h)), Q = s => S[idx(s)];
    const za = Z.ZA, zb = Z.ZB, zn = Z.ZN, mid = Q((zn.s1 + za.s0) / 2);
    const sh = {
      totale: { pos: new THREE.Vector3(mid.p[0] - 10, 175, mid.p[2] - 300), tgt: new THREE.Vector3(mid.p[0] + 20, 0, mid.p[2] - 45), s: null },
      stadt: { pos: V3(Q(za.s0 + 30), 1, 46, 26), tgt: V3(Q(za.s0 + 62), -1, 4, 0), s: za.s0 + 60 },
      natur: { pos: V3(Q(zb.s0 + 30), -1, 92, 44), tgt: V3(Q(zb.s0 + 52), -1, 14, -4), s: zb.s0 + 55 },
      rueck: { pos: V3(Q(zn.s0 + 2), -1, 4, 6.5), tgt: V3(Q(zn.s0 + 40), -1, 1.5, 0.5), s: zn.s0 + 20 },
      fuss: { pos: V3(Q(za.s1 - 14), 1, 14.2, 1.9), tgt: V3(Q(za.s0 + 34), 0, 2, 3), s: za.s1 - 10 }
    };
    if (A.shotAtlas) { sh.atlas = { ...A.shotAtlas, s: null }; ['roll', 'drift', 'scrape', 'landing', 'boost', 'biome'].forEach((e, r) => { sh['vfx_' + e] = { ...A.shotRow(r), s: null }; }); }
    if (A.shotBench) sh.quellen = { ...A.shotBench, s: null };
    return sh; };
  const cA = new THREE.Color(), cB = new THREE.Color();
  const mood = { hs: new THREE.Color('#eef4fa'), hg: new THREE.Color('#9a8a78'), hi: 1.05, sc: new THREE.Color('#fff4e6'), si: 2.9 };
  A.mood = (s, hemi, sun, snap = false) => { const L = TP.light, b = s == null ? -1 : bio(s), wl = s == null ? 0 : w('light', s), T = L.track, X = b === 0 ? L.city : b === 1 ? L.nature : L.track;
    const k = snap ? 1 : 0.06;
    mood.hs.lerp(cA.set(T.hemiSky).lerp(cB.set(X.hemiSky), wl), k); mood.hg.lerp(cA.set(T.hemiGround).lerp(cB.set(X.hemiGround), wl), k); mood.sc.lerp(cA.set(T.sun).lerp(cB.set(X.sun), wl), k);
    mood.hi = lerp(mood.hi, lerp(T.hemi, X.hemi, wl), k); mood.si = lerp(mood.si, lerp(T.sunI, X.sunI, wl), k);
    hemi.color.copy(mood.hs); hemi.groundColor.copy(mood.hg); hemi.intensity = mood.hi; sun.color.copy(mood.sc); sun.intensity = mood.si; };
  A.setWorld = (key, M, RU) => { const Pz = TP.worldPresets[key] || TP.worldPresets.canyon;
    const MC = MR.colors.worlds[key] || MR.colors.worlds.canyon; M.markH?.color.set(MC.hell); M.markS?.color.set(MC.signal); M.curb?.color.set(Pz.city.curb); M.plate?.color.set(Pz.city.plate); M.drift?.color.set(Pz.city.plate); M.walk?.color.set(Pz.city.walk); M.dam?.color.set(Pz.nature.grass);
    if (M.strangT?.userData.patch) { M.strangT.userData.patch.uPB.value.set(Pz.city.curb); M.strangT.userData.patch.uPC.value.set(Pz.nature.grass); }
    if (M.dam?.userData.patch) { M.dam.userData.patch.uPB.value.set(Pz.nature.ditch); M.dam.userData.patch.uPC.value.set(Pz.nature.hill); }
    if (RU.uRoadC) RU.uRoadC.value.set(Pz.nature.path); A.trackBiome = Pz.trackBiome; };
  A.trackBiome = 'canyon';
  A.vfxBiome = s => { const b = bio(s), tb = A.trackBiome; if (b < 0) return { a: tb, b: tb, w: 0 }; return { a: tb, b: b === 0 ? 'city' : 'meadow', w: w('vfx', s) }; };
  A.barrierBiome = (s, sd) => { const b = bio(s), i = idx(s); if (b === 0 && barrierT(s, sd, i) > 0.5) return 'city'; if (b === 1 && barrierT(s, sd, i) > 0.4) return 'meadow'; return A.trackBiome; };
  A.vfxMids = () => zones.map(z => { const win = z.fam.windows.vfx || [0.3, 0.7]; return z.s0 + (z.s1 - z.s0) * (win[0] + win[1]) / 2; });
  return A;
}
