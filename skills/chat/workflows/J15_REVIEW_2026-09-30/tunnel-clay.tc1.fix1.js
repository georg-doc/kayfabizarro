/* TC1 · Knet-Tunnel-Baukasten (30.09.). Look-Schicht über dem Core-Tunnel, kein zweiter Track-Owner:
 * Lage, Länge, Ring (Innenkontur) und Wandstärke kommen aus dem Stream (tunnels + tunnelRings, bzw. td.tunnelLooks[look].ring,
 * je Look vom Track Core v0.12 kompiliert, Checks tunnel_clearance/portal_match/tunnel_shell grün). Hier wird nur verkleidet.
 * Modular: Röhre = Module fester Länge (Stoß = Gurt/Band/Rahmen), Portal = Bausatz je Look, Wirt = Knethügel oder freie Röhre.
 * Materialien = die vorhandenen T4-Knetmaterialien (T.M: rock, tower0/1, hill0/1, strang, cloud, pad, trunk) → gleiche Knete,
 * gleiche Palette, Weltwechsel färbt automatisch mit. Einziges eigenes Material: Lampen (emissive). */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { seedGeometry } from '../lab-clay/clay-material.v10.js?r=2';

export const TUNNEL_KITS = {
  stone_arch: { label: 'Stein-Bogen', host: 'mound', portal: 'arch_stones', interior: 'ribs', module: 8,
    mats: { wall: 'rock', rib: 'tower1', stone: 'rock', key: 'tower0', head: 'hill1', mound: 'hill0', boulder: 'rock', bush: 'leaf0' } },
  stone_rect: { label: 'Stein-Rechteck', host: 'mound', portal: 'rect_stones', interior: 'ribs', module: 8,
    mats: { wall: 'rock', rib: 'tower1', stone: 'rock', key: 'tower0', head: 'hill1', mound: 'hill0', boulder: 'rock', bush: 'leaf0' } },
  race_tube: { label: 'Race-Tube', host: 'shell', portal: 'race_rim', interior: 'bands', module: 6,
    mats: { band: ['strang', 'cloud'], rib: 'pad', rim: ['strang', 'cloud'], gantry: 'tower1' } },
  mine: { label: 'Minen-Stollen', host: 'mound', portal: 'timber', interior: 'frames', module: 5,
    mats: { wall: 'tower1', timber: 'trunk', plank: 'trunk', head: 'hill1', mound: 'hill0', boulder: 'rock', bush: 'leaf0' } }
};
export const LOOK_KEYS = Object.keys(TUNNEL_KITS);

const V3 = a => new THREE.Vector3(a[0], a[1], a[2]);
const hn = (x, y, z) => Math.sin(x * 1.7 + y * 0.3 + z * 2.1) * 0.5 + Math.sin(x * 0.37 - z * 0.9 + y * 1.3) * 0.35 + Math.sin(z * 0.23 + x * 0.11) * 0.15;
const rnd = s => () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
const Y_CUT = -0.7;   // sichtbare Kontur ab knapp unter Tischhöhe (T4 GY −0,6); darunter liegt die Röhre im Tisch

function flipWinding(g) {
  if (g.index) { const a = g.index.array; for (let k = 0; k < a.length; k += 3) { const t = a[k + 1]; a[k + 1] = a[k + 2]; a[k + 2] = t; } g.index.needsUpdate = true; return; }
  for (const at of Object.values(g.attributes)) { const n = at.itemSize, a = at.array; for (let k = 0; k < at.count; k += 3) for (let c = 0; c < n; c++) { const i1 = (k + 1) * n + c, i2 = (k + 2) * n + c, t = a[i1]; a[i1] = a[i2]; a[i2] = t; } at.needsUpdate = true; }
}
function placeInFrame(g, F) {   // F = {o, X, Y, Z}; lokale x/y/z → Welt, Spiegelung wird durch Umkehr der Dreiecke aufgefangen
  const m = new THREE.Matrix4().makeBasis(F.X, F.Y, F.Z).setPosition(F.o); g.applyMatrix4(m);
  if (new THREE.Vector3().crossVectors(F.X, F.Y).dot(F.Z) < 0) flipWinding(g); return g;
}
function gridGeom(rows, want) {   // rows: Vector3[][], want(i,j): gewünschte Normalenrichtung
  const R = rows.length, C = rows[0].length, pos = new Float32Array(R * C * 3);
  rows.forEach((r, i) => r.forEach((v, j) => { pos[(i * C + j) * 3] = v.x; pos[(i * C + j) * 3 + 1] = v.y; pos[(i * C + j) * 3 + 2] = v.z; }));
  const i0 = Math.min(R - 2, R >> 1), j0 = Math.min(C - 2, C >> 1), a = rows[i0][j0], b = rows[i0 + 1][j0], c = rows[i0][j0 + 1];
  const flip = new THREE.Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a)).dot(want(i0, j0)) < 0, idx = [];
  for (let i = 0; i < R - 1; i++) for (let j = 0; j < C - 1; j++) { const A = i * C + j, B = (i + 1) * C + j, Cc = i * C + j + 1, D = (i + 1) * C + j + 1;
    if (!flip) idx.push(A, B, Cc, Cc, B, D); else idx.push(A, Cc, B, Cc, D, B); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
function outline(ring, yCut = Y_CUT, maxSeg = 1.0) {   // Ringfolge: Boden-Mitte → rechte Wand → Scheitel → linke Wand → Boden
  const n = ring.length, vis = ring.map(p => p[1] >= yCut), a = vis.indexOf(true), b = vis.lastIndexOf(true), P = [];
  const cut = (p, q) => { const t = (yCut - p[1]) / (q[1] - p[1]); return [p[0] + (q[0] - p[0]) * t, yCut]; };
  P.push(cut(ring[(a - 1 + n) % n], ring[a])); for (let i = a; i <= b; i++) P.push(ring[i]); P.push(cut(ring[b], ring[(b + 1) % n]));
  const D = [P[0]]; for (let i = 1; i < P.length; i++) { const p = P[i - 1], q = P[i], k = Math.max(1, Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / maxSeg)); for (let m = 1; m <= k; m++) D.push([p[0] + (q[0] - p[0]) * m / k, p[1] + (q[1] - p[1]) * m / k]); }
  const ys = D.map(p => p[1]), cy = (Math.max(...ys) + yCut) / 2;
  const N = D.map((p, i) => { const u = D[Math.max(0, i - 1)], v = D[Math.min(D.length - 1, i + 1)]; let nx = v[1] - u[1], ny = -(v[0] - u[0]); const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    if (nx * p[0] + ny * (p[1] - cy) < 0) { nx = -nx; ny = -ny; } return [nx, ny]; });
  const L = [0]; for (let i = 1; i < D.length; i++) L.push(L[i - 1] + Math.hypot(D[i][0] - D[i - 1][0], D[i][1] - D[i - 1][1]));
  const xs = D.map(p => p[0]);
  return { P: D, N, L, len: L[L.length - 1], xL: Math.min(...xs), xR: Math.max(...xs), top: Math.max(...ys), cy };
}
const atLen = (O, s) => { let i = 1; while (i < O.L.length - 1 && O.L[i] < s) i++; const t = (s - O.L[i - 1]) / ((O.L[i] - O.L[i - 1]) || 1), a = O.P[i - 1], b = O.P[i];
  return { p: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], n: O.N[t < 0.5 ? i - 1 : i], t: [b[0] - a[0], b[1] - a[1]] }; };
const subOutline = (O, s0, s1) => { const P = [], N = []; const k = Math.max(2, Math.ceil((s1 - s0) / 0.8)); for (let m = 0; m <= k; m++) { const q = atLen(O, s0 + (s1 - s0) * m / k); P.push(q.p); N.push(q.n); } return { P, N }; };
const circle = (r, n = 10) => Array.from({ length: n + 1 }, (_, k) => { const a = 2 * Math.PI * k / n; return [Math.cos(a) * r, Math.sin(a) * r]; });
const rrect = (a, b, r = 0.14) => { const out = []; for (const [cx, cy, a0] of [[a / 2 - r, b / 2 - r, 0], [-a / 2 + r, b / 2 - r, 90], [-a / 2 + r, -b / 2 + r, 180], [a / 2 - r, -b / 2 + r, 270]]) for (let k = 0; k <= 2; k++) { const t = (a0 + 45 * k) * Math.PI / 180; out.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]); } out.push(out[0]); return out; };

function hull2(pts) { const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); } return lo.slice(0, -1).concat(up.slice(0, -1)); }
function sdHull(H, x, y) { let inside = true, d = 1e9; for (let k = 0; k < H.length; k++) { const a = H[k], b = H[(k + 1) % H.length], ex = b[0] - a[0], ey = b[1] - a[1], l2 = ex * ex + ey * ey, t = Math.max(0, Math.min(1, ((x - a[0]) * ex + (y - a[1]) * ey) / l2));
  d = Math.min(d, Math.hypot(x - a[0] - t * ex, y - a[1] - t * ey)); if (ex * (y - a[1]) - ey * (x - a[0]) < 0) inside = false; } return inside ? -d : d; }
// Einbaufreiheit: Abstand jedes Innenausbau-Punkts (Rahmen-lokal, quer/hoch) zur Core-Pflichtfläche = Hülle aus Slots ≥ −0,4 m + Fahrzeughülle 7,0 m über der Fahrbahn (needOf, Core v0.12)
const HEADROOM = 7.0;

export function mountClayTunnels(T, opts = {}) {
  const td = T.td, S = td.samples, M = T.M, host = opts.parent || T.scene;
  const lampMat = new THREE.MeshStandardMaterial({ color: 0xfff2c8, emissive: 0xffc15a, emissiveIntensity: 2.2, roughness: 0.5 });
  let group = null, info = { look: null };
  const F = i => { const q = S[i]; return { p: V3(q.p), R: V3(q.R), U: V3(q.U), T: V3(q.T) }; };
  const W = (f, lat, lift, along = 0) => f.p.clone().addScaledVector(f.R, lat).addScaledVector(f.U, lift).addScaledVector(f.T, along);
  const ringFor = (look, i) => td.tunnelLooks?.looks?.[look]?.ring || td.tunnelRings?.[S[i].tunnel?.ringId] || td.tunnelRings?.[0];

  function build(look) {
    const kit = TUNNEL_KITS[look] || TUNNEL_KITS.stone_arch, bins = {}, lamps = [], mats = kit.mats; let seed = 1, modules = 0, parts = 0, H = null, clr = 1e9, clrAt = '';
    const probe = (g, tag) => { if (!H) return; const p = g.attributes.position; for (let k = 0; k < p.count; k++) { const d = sdHull(H, p.getX(k), p.getY(k)); if (d < clr) { clr = d; clrAt = tag; } } };
    const put = (key, g) => { if (!M[key]) key = 'rock'; let n = g.index ? g.toNonIndexed() : g; if (n.attributes.uv) n.deleteAttribute('uv'); if (n.attributes.uv1) n.deleteAttribute('uv1');
      if (!n.attributes.normal) n.computeVertexNormals();
      if (!n.attributes.color) n.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n.attributes.position.count * 3).fill(1), 3));
      seedGeometry(THREE, n, 900 + seed++); (bins[key] ||= []).push(n); };
    const box = (key, w, h, d, r, x, y, z, rz, Fr, tag) => { const g = new RoundedBoxGeometry(w, h, d, 1, Math.min(r, w / 2 - 0.01, h / 2 - 0.01, d / 2 - 0.01)); g.rotateZ(rz); g.translate(x, y, z); if (tag) probe(g, tag); placeInFrame(g, Fr); put(key, g); parts++; return g; };
    const blob = (key, r, x, y, z, Fr, sy = 1, detail = 1, emissive = false, tag) => { const g = new THREE.IcosahedronGeometry(r, detail); g.scale(1, sy, 1); g.translate(x, y, z); if (tag) probe(g, tag); placeInFrame(g, Fr); if (emissive) lamps.push(g); else put(key, g); parts++; };
    const sweep = (key, P, N, a0, z0, prof, Fr, tag) => { if (tag && H) for (let k = 0; k < P.length; k++) for (const [a] of prof) { const d = sdHull(H, P[k][0] + N[k][0] * (a0 + a), P[k][1] + N[k][1] * (a0 + a)); if (d < clr) { clr = d; clrAt = tag; } }   // Profil [a (Normale), b (Z)] entlang einer 2D-Kontur im Rahmen Fr
      const rows = P.map((p, k) => prof.map(([a, b]) => { const x = p[0] + N[k][0] * (a0 + a), y = p[1] + N[k][1] * (a0 + a); return Fr.o.clone().addScaledVector(Fr.X, x).addScaledVector(Fr.Y, y).addScaledVector(Fr.Z, z0 + b); }));
      const ctr = k => { const p = P[k]; return Fr.o.clone().addScaledVector(Fr.X, p[0] + N[k][0] * a0).addScaledVector(Fr.Y, p[1] + N[k][1] * a0).addScaledVector(Fr.Z, z0); };
      put(key, gridGeom(rows, (i, j) => rows[i][j].clone().sub(ctr(i)))); parts++; };
    for (const seg of td.tunnels || []) {
      const ring = ringFor(look, seg.i0), O = outline(ring), wall = S[seg.i0].tunnel?.wall ?? 1.2, half = Math.max(-O.xL, O.xR);
      { const sl = S[seg.i0].slots, need = sl.filter(([, y]) => y >= -0.4); need.push([sl[6][0], HEADROOM], [sl[7][0], HEADROOM]); H = hull2(need); }
      const ids = []; for (let i = seg.i0; i <= seg.i1; i += 4) ids.push(i); if (ids[ids.length - 1] !== seg.i1) ids.push(seg.i1);
      const s0 = S[seg.i0].s, s1 = S[seg.i1].s, ML = kit.module, nMod = Math.max(1, Math.round((s1 - s0) / ML)), mLen = (s1 - s0) / nMod; modules += nMod;
      const modOf = i => Math.min(nMod - 1, Math.floor((S[i].s - s0) / mLen));
      const Ffr = i => { const f = F(i); return { o: f.p, X: f.R, Y: f.U, Z: f.T }; };
      // ---------- Röhre: Module mit leichtem Kissenbauch, Innenwand ----------
      for (let m = 0; m < nMod; m++) {
        const mi = ids.filter(i => modOf(i) === m || (modOf(i) === m + 1 && S[i].s - s0 <= (m + 1) * mLen + 4 * td.ds + 0.01)); if (mi.length < 2) continue;
        const rough = look === 'mine' ? 0.22 : 0.08, rows = mi.map(i => { const f = F(i), belly = 0.16 * Math.abs(Math.sin(Math.PI * (S[i].s - s0) / mLen));   /* FIX (Coworker 30.09): belly as a continuous function of s; the per-module u gave the shared joint row two different offsets (step = slit at every joint) */
          return O.P.map((p, j) => { const d = belly + rough * (0.5 + 0.5 * hn(p[0] * 0.6, p[1] * 0.6, S[i].s * 0.35)); /* nur nach außen: Wand weicht zwischen den Stößen zurück, nie in den Core-Ring */ return W(f, p[0] + O.N[j][0] * d, p[1] + O.N[j][1] * d); }); });
        const wk = kit.interior === 'bands' ? mats.band[m % 2] : mats.wall;
        if (m === 0) O.P.forEach((p, j) => { const d = sdHull(H, p[0], p[1]); if (d < clr) { clr = d; clrAt = 'Innenwand'; } });
        put(wk, gridGeom(rows, (i, j) => { const f = F(mi[i]); return f.R.clone().multiplyScalar(-O.N[j][0]).addScaledVector(f.U, -O.N[j][1]); }));
        if (kit.host === 'shell') { const orows = mi.map(i => { const f = F(i); return O.P.map((p, j) => W(f, p[0] + O.N[j][0] * wall, p[1] + O.N[j][1] * wall)); });
          put(mats.band[m % 2], gridGeom(orows, (i, j) => { const f = F(mi[i]); return f.R.clone().multiplyScalar(O.N[j][0]).addScaledVector(f.U, O.N[j][1]); })); }
      }
      // ---------- Stöße: Gurtbogen (Stein), Band-Ring (Tube), Türstock (Mine) + Lampen ----------
      for (let m = 1; m < nMod; m++) {
        const iJ = Math.min(seg.i1, seg.i0 + Math.round((m * mLen) / td.ds)), Fr = Ffr(iJ);
        if (kit.interior === 'ribs') sweep(mats.rib, O.P, O.N, 0, 0, [[0.15, -0.5], [-0.2, -0.45], [-0.35, 0], [-0.2, 0.45], [0.15, 0.5], [0.15, -0.5]], Fr, 'Gurtbogen');
        if (kit.interior === 'bands') { sweep(mats.rib, O.P, O.N, 0, 0, circle(0.3, 6).map(([a, b]) => [a + 0.05, b]), Fr, 'Band-Ring'); sweep(mats.rib, O.P, O.N, wall, 0, circle(0.34, 6).map(([a, b]) => [a + 0.12, b]), Fr); }
        if (kit.interior === 'frames') { const hp = O.top - Y_CUT - 0.2;
          for (const sx of [-1, 1]) box(mats.timber, 0.8, hp, 0.8, 0.18, sx * (half - 0.55), Y_CUT + hp / 2, 0, 0.02 * sx * (m % 3 - 1), Fr, 'Türstock-Stempel');
          box(mats.timber, 2 * half - 0.6, 0.75, 0.85, 0.2, 0, O.top - 0.75, 0, 0.012 * ((m * 7) % 3 - 1), Fr, 'Türstock-Kappe');
          for (const sx of [-1, 1]) box(mats.timber, 0.5, 2.6, 0.55, 0.12, sx * (half - 1.6), O.top - 1.8, 0, sx * Math.PI / 4, Fr, 'Türstock-Strebe');
          if (m % 2 === 0) { const sx = m % 4 ? 1 : -1, lx = sx * (half - 1.1); box(mats.timber, 0.14, 0.9, 0.14, 0.05, lx, O.top - 1.55, 0.5, 0, Fr, 'Laternenhaken'); blob(null, 0.36, lx, O.top - 2.15, 0.5, Fr, 1.2, 1, true, 'Laterne'); } }
      }
      for (let m = 0; m < nMod; m++) {   // Lampen je Modulmitte
        const Fr = Ffr(Math.min(seg.i1, seg.i0 + Math.round(((m + 0.5) * mLen) / td.ds)));
        if (kit.interior === 'ribs') { const g = new RoundedBoxGeometry(1.8, 0.34, 0.8, 2, 0.14); g.translate(0, O.top - 0.32, 0); probe(g, 'Deckenlampe'); lamps.push(placeInFrame(g, Fr)); }
        if (kit.interior === 'bands') for (const side of [0.18, 0.82]) { const q = atLen(O, O.len * side); const g = new THREE.IcosahedronGeometry(0.28, 1); g.translate(q.p[0] - q.n[0] * 0.3, q.p[1] - q.n[1] * 0.3, 0); probe(g, 'Lampenband'); lamps.push(placeInFrame(g, Fr)); }
      }
      // ---------- Wirt: Knethügel (Profil hängt stetig an s) oder freie Röhre ----------
      const Oo = { P: O.P.map((p, j) => [p[0] + O.N[j][0] * wall, p[1] + O.N[j][1] * wall]) };
      const env = lat => { let y = -1e9; for (let k = 1; k < Oo.P.length; k++) { const a = Oo.P[k - 1], b = Oo.P[k]; if ((lat - a[0]) * (lat - b[0]) <= 0 && a[0] !== b[0]) y = Math.max(y, a[1] + (b[1] - a[1]) * (lat - a[0]) / (b[0] - a[0])); } return y; };
      const NP = 44, yB = -1.0, ramp = s => { const d = Math.min(s - s0, s1 - s), x = Math.max(0, Math.min(1, d / 34)); return x * x * (3 - 2 * x); };
      const moundLift = (lat, s, Wm, Ht) => { const u = Math.min(1, Math.abs(lat) / Wm), e = ramp(s), c = 0.38 * Wm * Math.sin(s * 0.027 + 0.8);
        let y = yB + (Ht - yB) * Math.pow(Math.max(0, 1 - u * u), 0.8) + e * 7.5 * Math.exp(-(((lat - c) / (0.28 * Wm)) ** 2)) * (1 - u) + (0.5 + 1.4 * e) * hn(lat * 0.17, 0, s * 0.07) * (1 - u);
        if (Math.abs(lat) < half + wall + 0.2) y = Math.max(y, env(lat) + 1.3); return y; };
      const WmAt = s => half + wall + 7 + ramp(s) * (16 + 6 * Math.sin(s * 0.041 + 1.3)), HtAt = s => O.top + wall + 3.0 + ramp(s) * (7 + 3 * Math.sin(s * 0.057 + 0.4));
      const prof = s => { const Wm = WmAt(s), Ht = HtAt(s); return Array.from({ length: NP + 1 }, (_, k) => { const lat = -Wm + 2 * Wm * k / NP; return [lat, moundLift(lat, s, Wm, Ht)]; }); };
      if (kit.host === 'mound') {
        const CH = 16; for (let c = 0; c < ids.length - 1; c += CH) { const sub = ids.slice(c, Math.min(ids.length, c + CH + 1));
          const rows = sub.map(i => { const f = F(i); return prof(S[i].s).map(([l, y]) => W(f, l, y)); });
          put(mats.mound, gridGeom(rows, (i, j) => { const f = F(sub[i]); return rows[i][j].clone().sub(f.p.clone().addScaledVector(f.U, -25)); })); }
        const r = rnd(7 + seg.i0);   // Deko oben: Findlinge + Büsche
        for (let k = 0; k < 26; k++) { const i = ids[Math.floor(r() * ids.length)], s = S[i].s, Wm = WmAt(s), lat = (r() * 2 - 1) * Wm * 0.62, f = Ffr(i), y = moundLift(lat, s, Wm, HtAt(s));
          if (k % 3 === 0) blob(mats.boulder, 1.6 + r() * 2.4, lat, y - 0.5, 0, f, 0.6); else blob(mats.bush, 1.4 + r() * 1.4, lat, y + 0.5, 0, f, 0.85); }
      }
      // ---------- Portale ----------
      for (const end of ['in', 'out']) {
        const i = end === 'in' ? seg.i0 : seg.i1, f = F(i), n = end === 'in' ? f.T.clone().negate() : f.T.clone(), Fr = { o: f.p, X: f.R, Y: f.U, Z: n };
        if (kit.host === 'mound') {   // Stirnwand: Hügelschnitt mit Öffnung, weich gefast
          const pr = prof(S[i].s), sh = new THREE.Shape(); sh.moveTo(pr[0][0], yB - 0.5); pr.forEach(([x, y]) => sh.lineTo(x, y)); sh.lineTo(pr[pr.length - 1][0], yB - 0.5); sh.closePath();
          const hole = new THREE.Path(), hp = O.P.map((p, j) => [p[0] + O.N[j][0] * 0.4, Math.max(Y_CUT + 0.3, p[1] + O.N[j][1] * 0.4)]); hole.moveTo(hp[0][0], hp[0][1]); hp.slice(1).forEach(([x, y]) => hole.lineTo(x, y)); hole.closePath(); sh.holes.push(hole);
          const g = new THREE.ExtrudeGeometry(sh, { depth: 1.2, bevelEnabled: true, bevelThickness: 0.35, bevelSize: 0.35, bevelSegments: 2, curveSegments: 4 }); g.translate(0, 0, -0.35); placeInFrame(g, Fr); put(mats.head, g); parts++;
        }
        if (kit.portal === 'arch_stones') {
          const cnt = Math.max(9, Math.round(O.len / 2.1) | 1), sl = O.len / cnt, kc = (cnt - 1) / 2;
          for (let k = 0; k < cnt; k++) { const q = atLen(O, (k + 0.5) * sl), key = k === kc, rad = key ? 2.7 : 1.9 + 0.25 * hn(k, 1, 0), dep = key ? 2.1 : 1.7, rz = Math.atan2(q.t[1], q.t[0]);
            box(key ? mats.key : mats.stone, sl * 0.9, rad, dep, 0.34, q.p[0] + q.n[0] * (rad / 2 + 0.02), q.p[1] + q.n[1] * (rad / 2 + 0.02), 1.05 + dep / 2 - 0.5, rz + 0.03 * hn(k, 2, 3), Fr); }
          for (const sx of [-1, 1]) box(mats.stone, 3.2, 1.5, 2.5, 0.36, sx * (half + 1.3), Y_CUT + 0.55, 1.3, 0, Fr);
        }
        if (kit.portal === 'rect_stones') {
          for (const sx of [-1, 1]) for (let k = 0, y = Y_CUT; y < O.top - 0.2; k++) { const h = Math.min(1.55, O.top - y + 0.05), wq = k % 2 ? 1.7 : 2.6;
            box(mats.stone, wq, h * 0.94, 1.9, 0.3, sx * (half + wq / 2 - 0.1), y + h / 2, 1.4, 0.02 * hn(k, sx, 1), Fr); y += h; }
          const span = 2 * half + 5.2, bw = span / 3;
          for (let k = 0; k < 3; k++) box(k === 1 ? mats.key : mats.stone, bw * 0.96, 2.3, 2.1, 0.36, -span / 2 + bw * (k + 0.5), O.top + 1.15, 1.45, 0, Fr);
          box(mats.stone, span + 1.4, 0.7, 2.6, 0.28, 0, O.top + 2.65, 1.55, 0, Fr);
        }
        if (kit.portal === 'race_rim') {
          const nArc = 14, sl = O.len / nArc; for (let k = 0; k < nArc; k++) { const so = subOutline(O, k * sl, (k + 1) * sl); sweep(mats.rim[k % 2], so.P, so.N, wall / 2, 0.2, circle(1.0, 10), Fr); }
          const gy = O.top + wall + 1.35; box(mats.gantry, 18, 2.7, 1.0, 0.4, 0, gy, 0.6, 0, Fr);
          for (let k = -2; k <= 2; k++) blob(null, 0.46, k * 3.2, gy, 1.2, Fr, 1, 1, true);
          for (const sx of [-1, 1]) box(mats.gantry, 0.9, 1.6, 0.9, 0.3, sx * 7.6, gy - 1.9, 0.6, 0, Fr);
        }
        if (kit.portal === 'timber') {
          const hp = O.top - Y_CUT + 0.9;
          for (const sx of [-1, 1]) box(mats.timber, 1.05, hp, 1.15, 0.22, sx * (half - 0.6), Y_CUT + hp / 2, 1.3, sx * 0.025, Fr, 'Portal-Stempel');
          box(mats.timber, 2 * half + 3.4, 1.25, 1.35, 0.26, 0, O.top + 0.35, 1.45, -0.012, Fr, 'Portal-Kappe');
          for (const sx of [-1, 1]) box(mats.timber, 0.6, 3.8, 0.7, 0.14, sx * (half + 1.25), O.top - 0.9, 1.55, sx * Math.PI / 4, Fr);
          const r = rnd(31 + seg.i0 + (end === 'in' ? 0 : 99)), x0 = half + 3.6, yTop = O.top + 2.4;
          for (let y = Y_CUT + 0.5, row = 0; y < yTop; y += 1.0, row++) {
            const spans = y < O.top + 1.0 ? [[-x0, -half - 0.1], [half + 0.1, x0]] : [[-x0, x0]];
            for (const [a, b] of spans) { let x = a - (row % 2) * 0.7; while (x < b - 0.3) { const L = Math.min(b - x, 3.2 + r() * 2.6); if (L > 0.6) box(mats.plank, L - 0.12, 0.9, 0.3, 0.1, x + L / 2, y, 1.72, (r() - 0.5) * 0.05, Fr); x += L; } } }
          for (const sx of [-1, 1]) { box(mats.timber, 0.14, 0.9, 0.14, 0.05, sx * (half + 2.9), O.top - 0.55, 1.9, 0, Fr, 'Portal-Laterne'); blob(null, 0.42, sx * (half + 2.9), O.top - 1.2, 1.9, Fr, 1.2, 1, true, 'Portal-Laterne'); }
        }
      }
    }
    const g = new THREE.Group(); g.name = 'tc1-tunnel-' + look; let tris = 0;
    for (const [key, list] of Object.entries(bins)) { const geo = mergeGeometries(list, false); const o = new THREE.Mesh(geo, M[key]); o.name = 'tc1-' + key; o.castShadow = true; o.receiveShadow = true; g.add(o); tris += geo.attributes.position.count / 3; }
    if (lamps.length) { const lg = mergeGeometries(lamps.map(x => { const n = x.index ? x.toNonIndexed() : x; for (const k of Object.keys(n.attributes)) if (k !== 'position' && k !== 'normal') n.deleteAttribute(k); return n; }), false); const o = new THREE.Mesh(lg, lampMat); o.name = 'tc1-lamps'; g.add(o); tris += lg.attributes.position.count / 3; }
    return { g, info: { look, label: kit.label, host: kit.host, portal: kit.portal, interior: kit.interior, moduleLen: kit.module, modules, parts, lamps: lamps.length, meshes: g.children.length, tris: Math.round(tris), clearance: { value: +clr.toFixed(3), at: clrAt, min: 0.3, pass: clr >= 0.3, rule: 'Innenausbau ≥ 0,3 m (Core-margin) außerhalb der Pflichtfläche: Slots ≥ −0,4 m + 7,0 m Fahrzeughülle' }, ringFrom: td.tunnelLooks?.looks?.[look] ? 'td.tunnelLooks.looks.' + look + ' (Core v0.12)' : 'td.tunnelRings (Core)' } };
  }
  function setLook(look) {
    if (group) { host.remove(group); group.traverse(o => o.geometry && o.geometry.dispose()); }
    const t0 = performance.now(), r = build(look); group = r.g; host.add(group); info = { ...r.info, buildMs: Math.round(performance.now() - t0) }; return info;
  }
  setLook(opts.look || 'stone_arch');
  return { setLook, get info() { return info; }, get group() { return group; }, kits: TUNNEL_KITS };
}
