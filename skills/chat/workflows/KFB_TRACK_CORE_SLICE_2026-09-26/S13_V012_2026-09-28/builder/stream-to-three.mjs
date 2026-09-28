// Reference loader: Track Core stream (kfb.track-core.stream/0.3, core v0.3 .. v0.8.1) -> three.js meshes.
// v2 (S4 brief v2): tunnel tubes / halls from stream.tunnels + tunnelRings (core v0.7+), and loadStream() for .json.gz.
// v5 (core v0.12): graph.nodes (roundabout): plate, kerbs via buildBody pseudo samples, markings, scenery placeholder.
// v3 (core v0.10): graph.deck = { zones, furniture } of the junction modules (gore fill, box apron, pit wall, cushions,
// garages, box marks, barrier caps, Weiche U barrier). Preview colours only; the look belongs to the design pass.
// Mirrors the Blender importer (b1_import_stream.py). The stream is the only input; nothing is re-solved here.
// Stream frame = three.js frame: right-handed, +Y up, heading 0 -> +Z. No axis swap needed.
//
//   import * as THREE from 'three';
//   import { buildTrack } from './stream-to-three.mjs';
//   const stream = await (await fetch('td03.stream.json')).json();
//   scene.add(buildTrack(THREE, stream));   // Group: body + markings mesh per route, vertex colours = stream paint
//
// Face roles (between slot i and i+1, ring closes under_R -> under_L). A skin assigns one colour per role.
export const FACE_ROLE = ['barrier_side', 'barrier_side', 'barrier_cap', 'barrier_side', 'shoulder', 'shoulder', 'road',
  'shoulder', 'shoulder', 'barrier_side', 'barrier_cap', 'barrier_side', 'barrier_side', 'underside'];
export const MARK_COLOUR = { edges: [0.992, 0.765, 0.282], centre: [0.957, 0.945, 0.910], bars: [0.498, 0.831, 1.0] };

// Stream colours are sRGB 0..1; three.js vertex colours are linear.
const lin = (c) => c.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));

const slotWorld = (q, i) => {
  const [lat, lift] = q.slots[i];
  return [0, 1, 2].map((k) => q.p[k] + q.R[k] * lat + q.U[k] * lift);
};

// Body: one quad strip per face role, per-sample colour from q.paint[role] (already blended across seams by the core).
// Runs break where the stream says so: no surface (air), or a break sample (brk) at split/merge topology changes.
export function buildBody(THREE, S) {
  const n = FACE_ROLE.length, pos = [], col = [], idx = [];
  const drawn = (a) => !(S[a].prm.surface < 0.5 || S[a + 1].prm.surface < 0.5 || S[a + 1].brk);
  // flat-coloured quads: 4 own vertices per face so colours do not bleed between roles
  const quad = (A, B, C, D, cA, cB) => {
    const b = pos.length / 3;
    for (const [p, c] of [[A, cA], [B, cA], [C, cB], [D, cB]]) { pos.push(...p); col.push(...lin(c)); }
    idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
  };
  // v3: the end face is triangulated as a real polygon in the section plane (the ring is not convex: a fan made a sail
  // across the road at mid-track breaks). Collapsed slots (side 0) are dropped first.
  const cap = (q, reverse) => {
    const pts2 = [], ids = [];
    for (let i = 0; i < n; i++) { const v = q.slots[i]; const l = pts2[pts2.length - 1]; if (l && Math.hypot(l.x - v[0], l.y - v[1]) < 1e-4) continue; pts2.push(new THREE.Vector2(v[0], v[1])); ids.push(i); }
    if (pts2.length > 2 && Math.hypot(pts2[0].x - pts2[pts2.length - 1].x, pts2[0].y - pts2[pts2.length - 1].y) < 1e-4) { pts2.pop(); ids.pop(); }
    if (pts2.length < 3) return;
    const tris = THREE.ShapeUtils.triangulateShape(pts2, []);
    const b = pos.length / 3; const c = lin(q.paint.underside);
    for (const i of ids) { pos.push(...slotWorld(q, i)); col.push(...c); }
    push3(tris, b, reverse ? q.T.map((v) => -v) : q.T);
  };
  // each end-face triangle is wound so it faces out of the body (start: -T, end: +T)
  const push3 = (tris, b, want) => { for (const [x, y, z] of tris) {
    const P = (k) => pos.slice(3 * (b + k), 3 * (b + k) + 3), A = P(x), B = P(y), C = P(z);
    const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) ? idx.push(b + x, b + y, b + z) : idx.push(b + x, b + z, b + y); } };
  // v3: an internal break (same position, new profile: a barrier run ends or starts mid-track) gets no full end face
  // across the road; only the side that changes is closed, from the larger of the two sections.
  const inner = (i) => i > 0 && i < S.length && S[i].brk && Math.hypot(S[i].p[0] - S[i - 1].p[0], S[i].p[1] - S[i - 1].p[1], S[i].p[2] - S[i - 1].p[2]) < 1e-3;
  const sideCaps = (qa, qb) => {   // qa ends a run, qb starts the next one at the same place
    for (const [lo, hi, rd] of [[0, 6, 6], [7, 13, 7]]) {
      const ext = (q) => Math.abs(q.slots[lo === 0 ? 0 : 13][0] - q.slots[rd][0]);
      const ea = ext(qa), eb = ext(qb); if (Math.abs(ea - eb) < 1e-3) continue;
      const q = ea > eb ? qa : qb, forward = ea > eb;
      const pts2 = [], ids = [];
      for (let i = lo; i <= hi; i++) { const v = q.slots[i]; pts2.push(new THREE.Vector2(v[0], v[1])); ids.push(i); }
      const under = q.slots[lo === 0 ? 0 : 13][1]; pts2.push(new THREE.Vector2(q.slots[rd][0], under)); ids.push(-1);
      const tris = THREE.ShapeUtils.triangulateShape(pts2, []), b = pos.length / 3, c = lin(q.paint.underside);
      for (let k = 0; k < ids.length; k++) { const [l, h] = [pts2[k].x, pts2[k].y]; pos.push(...[0, 1, 2].map((j) => q.p[j] + q.R[j] * l + q.U[j] * h)); col.push(...c); }
      push3(tris, b, forward ? q.T : q.T.map((v) => -v));
    }
  };
  for (let a = 0; a < S.length - 1; a++) {
    if (!drawn(a)) continue;
    const q0 = S[a], q1 = S[a + 1];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, role = FACE_ROLE[i];
      quad(slotWorld(q0, i), slotWorld(q0, j), slotWorld(q1, j), slotWorld(q1, i), q0.paint[role], q1.paint[role]);
    }
    if (a === 0 || !drawn(a - 1)) { if (a > 0 && inner(a)) sideCaps(S[a - 1], q0); else cap(q0, true); }
    if (a === S.length - 2 || !drawn(a + 1)) { if (!inner(a + 2)) cap(q1, false); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));  // linear
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

// Markings: flat bands lifted 3 cm over the road. 'edges' follow road edge minus inset; 'centre' and 'bars' sit on the
// road offset. Bar width = road width x band.span (the arrow taper lives in span; the core already tapers it).
export function buildMarkings(THREE, S, bands, lift = 0.03) {
  const pos = [], col = [], idx = []; const sArr = S.map((q) => q.s);
  const lo = (x) => { let a = 0, b = sArr.length; while (a < b) { const m = (a + b) >> 1; if (sArr[m] < x) a = m + 1; else b = m; } return a; };
  for (const bd of bands) {
    const seg = []; for (let i = Math.max(0, lo(bd.s0) - 1); i < S.length && S[i].s <= bd.s1 + 1e-6; i++) if (S[i].s >= bd.s0 - 1e-6) seg.push(S[i]);
    if (seg.length < 2) continue;
    const c = lin(MARK_COLOUR[bd.at] ?? [1, 1, 1]), base = pos.length / 3;
    for (const q of seg) {
      const half = q.prm.width / 2, lat = bd.at === 'edges' ? q.prm.offset + bd.side * (half - bd.inset) : q.prm.offset;
      const w = bd.at === 'bars' ? q.prm.width * bd.span : bd.w;
      for (const d of [-w / 2, w / 2]) { for (let k = 0; k < 3; k++) pos.push(q.p[k] + q.R[k] * (lat + d) + q.U[k] * lift); col.push(...c); }
    }
    for (let k = 0; k < seg.length - 1; k++) { const a = base + 2 * k; idx.push(a, a + 1, a + 3, a, a + 3, a + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

// Tunnels (core v0.7+): stream.tunnels = segments {id, host, kind: 'tube'|'hall', i0, i1, shapes}; every sample inside
// carries tunnel {ringId, wall}; stream.tunnelRings[ringId] = closed inner ring of [lateral, lift] in the sample frame.
// Mirrors blender/s8_tunnel_site.py tube_mesh: inner wall, outer shell (ring pushed out by `wall`), end rims.
// Preview colours per host (inner, outer, rim); the look is yours to replace.
export const TUNNEL_HOST = {
  mountain: [0xf0dcc0, 0xa0714a, 0xf4f1e8], building: [0xf6e0da, 0xd0453a, 0xf4f1e8], shaft: [0xe4dcf4, 0x6a3fb0, 0xf4f1e8],
  labyrinth: [0xd6f2e8, 0x1f8a70, 0xf4f1e8], earth: [0xeeeeee, 0x8a8580, 0xf4f1e8], bunker: [0xd9d6c8, 0x6b6f5a, 0xf2d24a],
  alien: [0xc8f7e8, 0x3fd6a8, 0xb07cf0], toy: [0xfff0e0, 0xff7a1a, 0x4f9be8], hangar: [0xe6e8ee, 0x8d96a8, 0xf2d24a] };
const hexRGB = (h) => [(h >> 16) & 255, (h >> 8) & 255, h & 255].map((v) => v / 255);
const outerRing = (ring, w) => ring.map((p, j) => { const a = ring[(j - 1 + ring.length) % ring.length], b = ring[(j + 1) % ring.length];
  const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1; return [p[0] + ty / l * w, p[1] - tx / l * w]; });
export function buildTunnels(THREE, stream, step = 2) {
  const S = stream.samples, rings = stream.tunnelRings, pos = [], col = [], idx = [];
  if (!rings || !stream.tunnels) return null;
  const at = (q, lat, lift) => [0, 1, 2].map((k) => q.p[k] + q.R[k] * lat + q.U[k] * lift);
  for (const seg of stream.tunnels) {
    const ids = []; for (let i = seg.i0; i <= seg.i1; i += step) ids.push(i); if (ids[ids.length - 1] !== seg.i1) ids.push(seg.i1);
    const [ci, co, cr] = (TUNNEL_HOST[seg.host] ?? TUNNEL_HOST.earth).map((h) => lin(hexRGB(h)));
    const wall = S[seg.i0].tunnel?.wall ?? 1.2;
    const RI = ids.map((i) => rings[S[i].tunnel.ringId]), RO = RI.map((r) => outerRing(r, wall)), N = RI[0].length;
    const ring = (k, R, c) => { const b = pos.length / 3; for (const [l, h] of R[k]) { pos.push(...at(S[ids[k]], l, h)); col.push(...c); } return b; };
    for (let k = 0; k < ids.length - 1; k++) for (const [R, c] of [[RI, ci], [RO, co]]) {
      const a = ring(k, R, c), b = ring(k + 1, R, c);
      for (let j = 0; j < N; j++) { const j1 = (j + 1) % N; idx.push(a + j, a + j1, b + j1, a + j, b + j1, b + j); } }
    for (const k of [0, ids.length - 1]) { const a = ring(k, RI, cr), b = ring(k, RO, cr);   // end rims (annulus)
      for (let j = 0; j < N; j++) { const j1 = (j + 1) % N; idx.push(a + j, a + j1, b + j1, a + j, b + j1, b + j); } }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

// Fetch a stream; .json.gz is inflated in the browser (DecompressionStream).
export async function loadStream(url) {
  const r = await fetch(url);
  if (!url.endsWith('.gz')) return r.json();
  return new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).json();
}

// ---------------------------------------------------------------- v3 deck layer (core v0.10 junction modules)
export const DECK_COLOUR = { gore: 0xe9dcc3, hatch: 0xe0703a, apron: 0xa7adb3, deckSide: 0xcfc6b6, cushion: 0xe0703a, garage: 0xe6d9bf, door: 0x55606b, roof: 0xcdbd9c, mark: 0xf4f1e8 };
const V = (a) => ({ x: a[0], y: a[1], z: a[2] });
const vadd = (a, b) => a.map((v, i) => v + b[i]), vsub = (a, b) => a.map((v, i) => v - b[i]), vmul = (a, k) => a.map((v) => v * k);
const vlen = (a) => Math.hypot(...a), vnorm = (a) => vmul(a, 1 / (vlen(a) || 1)), vcross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function hatchTexture(THREE) {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  g.fillStyle = '#' + DECK_COLOUR.gore.toString(16).padStart(6, '0'); g.fillRect(0, 0, 64, 64);
  g.strokeStyle = '#' + DECK_COLOUR.hatch.toString(16).padStart(6, '0'); g.lineWidth = 9;
  for (const o of [-64, 0, 64]) { g.beginPath(); g.moveTo(o, 64); g.lineTo(o + 64, 0); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
// strip from rows [[a, b], ...]: top face (with uv in metres / 2.4), underside, optional side wall on the b edge
export function zoneGeometry(THREE, z, sideB) {
  const U = z.U ?? [0, 1, 0], d = z.depth ?? 2.25, pos = [], uv = [], idx = [];
  let along = 0;
  const rows = z.rows; let want = U;
  const quad = (A, B, C, D, ua) => {   // wound so its normal points along `want`
    const n = vcross(vsub(B, A), vsub(C, A)), n2 = vcross(vsub(C, A), vsub(D, A)), nn = vlen(n) > vlen(n2) ? n : n2;
    if (nn[0] * want[0] + nn[1] * want[1] + nn[2] * want[2] < 0) { [A, B, C, D] = [D, C, B, A]; ua = [ua[6], ua[7], ua[4], ua[5], ua[2], ua[3], ua[0], ua[1]]; }
    const b = pos.length / 3; for (const p of [A, B, C, D]) pos.push(...p); uv.push(...ua); idx.push(b, b + 1, b + 2, b, b + 2, b + 3); };
  for (let k = 0; k < rows.length - 1; k++) {
    const [a0, b0] = rows[k], [a1, b1] = rows[k + 1], w0 = vlen(vsub(b0, a0)), w1 = vlen(vsub(b1, a1)), step = vlen(vsub(vmul(vadd(a1, b1), 0.5), vmul(vadd(a0, b0), 0.5)));
    const t = 1 / 2.4; want = U; quad(a0, b0, b1, a1, [0, along * t, w0 * t, along * t, w1 * t, (along + step) * t, 0, (along + step) * t]);
    const dn = (p) => vsub(p, vmul(U, d)); want = vmul(U, -1); quad(dn(a1), dn(b1), dn(b0), dn(a0), [0, 0, 0, 0, 0, 0, 0, 0]);
    if (sideB) { want = vsub(b0, a0); quad(b0, dn(b0), dn(b1), b1, [0, 0, 0, 0, 0, 0, 0, 0]); }
    along += step;
  }
  for (const k of [0, rows.length - 1]) { const [a, b] = rows[k]; if (vlen(vsub(b, a)) < 0.2) continue; const dn = (p) => vsub(p, vmul(U, d));
    const o = rows[k === 0 ? 1 : rows.length - 2]; want = vsub(vmul(vadd(a, b), 0.5), vmul(vadd(o[0], o[1]), 0.5)); quad(a, b, dn(b), dn(a), [0, 0, 0, 0, 0, 0, 0, 0]); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals(); return g;
}
function extrudeAlong(THREE, pts, U, w, h) {   // slim wall along a centre polyline, rounded top edge
  const pos = [], idx = [], prof = [[-w / 2, 0], [-w / 2, h - w / 2], [-w * 0.35, h - w * 0.15], [0, h], [w * 0.35, h - w * 0.15], [w / 2, h - w / 2], [w / 2, 0]];
  pts.forEach((p, i) => { const T = vnorm(vsub(pts[Math.min(i + 1, pts.length - 1)], pts[Math.max(i - 1, 0)])), R = vnorm(vcross(T, U));
    for (const [l, y] of prof) pos.push(...vadd(vadd(p, vmul(R, l)), vmul(U, y))); });
  const n = prof.length;
  for (let i = 0; i < pts.length - 1; i++) for (let j = 0; j < n - 1; j++) { const a = i * n + j, b = a + n; idx.push(a, b, b + 1, a, b + 1, a + 1); }
  for (const i of [0, pts.length - 1]) for (let j = 1; j < n - 1; j++) { const o = i * n; if (i) idx.push(o, o + j, o + j + 1); else idx.push(o, o + j + 1, o + j); }
  let g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g = g.toNonIndexed(); g.computeVertexNormals(); return g;
}
function place(THREE, mesh, p, T, U) {   // local +Y = U, local +Z = T
  const Y = new THREE.Vector3(...U).normalize(), Z = new THREE.Vector3(...T).normalize(), X = new THREE.Vector3().crossVectors(Y, Z).normalize(); Z.crossVectors(X, Y);
  mesh.matrix.makeBasis(X, Y, Z).setPosition(...p); mesh.matrixAutoUpdate = false; return mesh;
}
export function buildDeck(THREE, deck, barrierColour = [0.55, 0.36, 0.29]) {
  const group = new THREE.Group(); if (!deck) return group;
  const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, ...o });
  const barMat = std(new THREE.Color().setRGB(...barrierColour, THREE.SRGBColorSpace), { side: THREE.DoubleSide, flatShading: true });
  const hatch = std(0xffffff, { map: hatchTexture(THREE), polygonOffset: true, polygonOffsetFactor: 1 });
  for (const z of deck.zones ?? []) {
    const m = z.kind === 'gore' ? hatch : z.kind === 'plinth' ? std(DECK_COLOUR.deckSide) : std(DECK_COLOUR.apron);
    group.add(new THREE.Mesh(zoneGeometry(THREE, z, z.kind !== 'gore'), m));
  }
  for (const f of deck.furniture ?? []) {
    if (f.kind === 'wall') group.add(new THREE.Mesh(extrudeAlong(THREE, f.pts, f.U, f.w, f.h), barMat));
    else if (f.kind === 'cushion') { const m = new THREE.Mesh(new THREE.CylinderGeometry(f.r, f.r * 1.04, f.h, 28), std(DECK_COLOUR.cushion)); m.position.set(f.p[0], f.p[1] + f.h / 2, f.p[2]); group.add(m);
      const t = new THREE.Mesh(new THREE.CylinderGeometry(f.r * 1.01, f.r * 1.01, f.h * 0.22, 28), std(DECK_COLOUR.mark)); t.position.set(f.p[0], f.p[1] + f.h * 0.55, f.p[2]); group.add(t); }
    else if (f.kind === 'cap') {   // half cylinder in front of a barrier end
      const g = new THREE.CylinderGeometry(f.r, f.r, f.h, 20, 1, false, -Math.PI / 2, Math.PI); g.translate(0, f.h / 2, 0);
      group.add(place(THREE, new THREE.Mesh(g, barMat), f.p, f.T, f.U));
    } else if (f.kind === 'uturn') {
      const pos = [], idx = [], N = 32, a = vnorm(f.from), b = vnorm(f.T), U = f.U, ri = f.r - f.t / 2, ro = f.r + f.t / 2;
      for (let k = 0; k <= N; k++) { const th = Math.PI * k / N, d = vadd(vmul(a, Math.cos(th)), vmul(b, Math.sin(th)));
        for (const [r, y] of [[ri, f.base], [ri, f.hOut], [ro, f.hIn], [ro, f.base]]) pos.push(...vadd(vadd(f.c, vmul(d, r)), vmul(U, y))); }
      for (let k = 0; k < N; k++) for (let j = 0; j < 3; j++) { const p0 = k * 4 + j, p1 = p0 + 4; idx.push(p0, p1, p1 + 1, p0, p1 + 1, p0 + 1); }
      let g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g = g.toNonIndexed(); g.computeVertexNormals();
      group.add(new THREE.Mesh(g, barMat));
    } else if (f.kind === 'garage') {
      const [A, B, C, D] = f.base, U = f.U, up = (p, h) => vadd(p, vmul(U, h)), pos = [], idx = [];
      const box = [A, B, C, D, up(A, f.h), up(B, f.h), up(C, f.h), up(D, f.h)]; for (const p of box) pos.push(...p);
      idx.push(0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7, 4, 5, 6, 4, 6, 7);
      let g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g = g.toNonIndexed(); g.computeVertexNormals();
      group.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: DECK_COLOUR.garage, roughness: 0.9, side: THREE.DoubleSide, flatShading: true })));
      // door on the lane side (A-B), inset, 80 % wide, 4.2 m high
      const m = vmul(vadd(A, B), 0.5), ab = vsub(B, A), dw = vlen(ab) * 0.4, n = vnorm(vsub(A, D)), dh = 4.2, u = vnorm(ab);
      const q = [vadd(vsub(m, vmul(u, dw)), vmul(n, 0.02)), vadd(vadd(m, vmul(u, dw)), vmul(n, 0.02))];
      const dp = [...q[0], ...q[1], ...up(q[1], dh), ...up(q[0], dh)]; const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.Float32BufferAttribute(dp, 3)); dg.setIndex([0, 1, 2, 0, 2, 3]); dg.computeVertexNormals();
      group.add(new THREE.Mesh(dg, new THREE.MeshStandardMaterial({ color: DECK_COLOUR.door, roughness: 0.9, side: THREE.DoubleSide })));
    } else if (f.kind === 'boxmark') {
      const pos = [], idx = [], L = 0.25, lift = 0.03, U = [0, 1, 0], Q = f.quad;
      const seg = (p, q) => { const d = vnorm(vsub(q, p)), n = vmul(vnorm(vcross(U, d)), L / 2), b = pos.length / 3;
        for (const v of [vsub(p, n), vadd(p, n), vadd(q, n), vsub(q, n)]) pos.push(...vadd(v, vmul(U, lift))); idx.push(b, b + 2, b + 1, b, b + 3, b + 2); };
      seg(Q[0], Q[3]); seg(Q[1], Q[2]); seg(Q[3], Q[2]);
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      group.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: DECK_COLOUR.mark, roughness: 0.8, side: THREE.DoubleSide })));
    }
  }
  return group;
}

// ---------------------------------------------------------------- v4 transition preview (core v0.11 zones)
// PREVIEW ONLY. The core zone is data: q.zone = {from, to, u, w: {layer: 0..1}} and q.biome outside zones. This builds a
// schematic look from it so the staggering can be judged in the builder: road tone, the Knetstrang lowering into a curb
// or berm, light clay curb stones that start single and close up, sidewalk slabs, grass / dry clay pancakes in threes.
// Colours are placeholders; the look belongs to Claude Design (T4) and Blender (B0). Contact geometry is never changed:
// buildTrack(..., {contact: true}) shows the unmodified profile.
export const BIOME_PREVIEW = {
  track:  { road: null, edge: null, strang: null, height: 1.0 },
  city:   { road: [0.30, 0.32, 0.34], edge: [0.85, 0.82, 0.76], strang: [0.83, 0.79, 0.72], height: 0.22, curb: 1, walk: 1 },
  nature: { road: [0.49, 0.42, 0.33], edge: [0.55, 0.62, 0.36], strang: [0.47, 0.60, 0.33], height: 0.45, tufts: [0.43, 0.62, 0.30] },
  canyon: { road: [0.60, 0.43, 0.28], edge: [0.77, 0.56, 0.34], strang: [0.74, 0.50, 0.29], height: 0.5, tufts: [0.80, 0.55, 0.30] },
  coast:  { road: [0.36, 0.45, 0.47], edge: [0.85, 0.79, 0.62], strang: [0.80, 0.74, 0.58], height: 0.4, tufts: [0.88, 0.83, 0.66] },
};
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const hsh = (i, k) => { let h = (i * 374761393 + k * 668265263) >>> 0; h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
function stateOf(q) {   // {from, to, w} for any sample
  if (q.zone) return q.zone; const b = q.biome ?? 'track'; return { from: b, to: b, w: new Proxy({}, { get: () => 1 }) };
}
export function lookSamples(S) {
  if (!S.some((q) => q.zone || (q.biome && q.biome !== 'track'))) return S;
  const I = (n) => ['under_L', 'barrier_out_bot_L', 'barrier_out_top_L', 'barrier_in_top_L', 'barrier_in_bot_L', 'shoulder_L', 'road_L', 'road_R', 'shoulder_R', 'barrier_in_bot_R', 'barrier_in_top_R', 'barrier_out_top_R', 'barrier_out_bot_R', 'under_R'].indexOf(n);
  return S.map((q) => {
    const z = stateOf(q), A = BIOME_PREVIEW[z.from], B = BIOME_PREVIEW[z.to];
    const h = A.height + (B.height - A.height) * z.w.barrier;
    const slots = q.slots.map((v) => [...v]);
    for (const sd of ['L', 'R']) { const base = slots[I('barrier_in_bot_' + sd)][1];
      for (const k of ['barrier_in_top_' + sd, 'barrier_out_top_' + sd]) slots[I(k)][1] = base + (slots[I(k)][1] - base) * h; }
    const paint = { ...q.paint };
    const col = (role, key, w) => { const a = A[key] ?? q.paint[role], b = B[key] ?? q.paint[role]; paint[role] = mix(a, b, w); };
    // no colour gradient on the road: the base tone steps late (w >= 0.92) under clay patches that were pressed on
    // earlier (buildTransitionDressing); a curb edge steps under the closed stone row; the Knetstrang tone follows its form
    col('road', 'road', z.w.surface >= 0.92 ? 1 : 0);
    col('shoulder', 'edge', (A.curb || B.curb) ? (z.w.curb >= 0.85 ? 1 : 0) : z.w.curb);
    col('barrier_side', 'strang', z.w.barrier); col('barrier_cap', 'strang', z.w.barrier);
    return { ...q, slots, paint };
  });
}
export function buildTransitionDressing(THREE, S, sides = [-1, 1]) {   // v5: kerb runs of a node dress their outer side only
  const g = new THREE.Group(); if (!S.some((q) => q.zone || (q.biome && q.biome !== 'track'))) return g;
  const at = (q, l, h) => new THREE.Vector3(q.p[0] + q.R[0] * l + q.U[0] * h, q.p[1] + q.R[1] * l + q.U[1] * h, q.p[2] + q.R[2] * l + q.U[2] * h);
  const stones = [], slabs = [], tufts = [], patches = []; let lastS = -1e9, lastSlab = -1e9, lastTuft = -1e9, lastP = -1e9, k = 0;
  for (let i = 0; i < S.length; i++) {
    const q = S[i], z = stateOf(q), A = BIOME_PREVIEW[z.from], B = BIOME_PREVIEW[z.to];
    if (q.prm.surface < 0.5) continue;
    const curb = (A.curb ?? 0) + ((B.curb ?? 0) - (A.curb ?? 0)) * z.w.curb, walk = (A.walk ?? 0) + ((B.walk ?? 0) - (A.walk ?? 0)) * Math.max(0, (z.w.curb - 0.35) / 0.65);
    const tuftC = z.w.nature > 0.5 ? B.tufts : A.tufts, tuft = (A.tufts ? 1 - z.w.nature : 0) + (B.tufts ? z.w.nature : 0);
    const half = q.prm.width / 2, o = q.prm.offset, base = sides.length === 1 && sides[0] > 0 ? q.slots[9][1] : q.slots[4][1];
    if (q.zone && q.s - lastP >= 1.6 && z.w.surface > 0 && z.w.surface < 0.999) { lastP = q.s;   // road patches in the target tone
      const tgt = (B.road ?? q.paint.road), n = Math.max(3, Math.round(q.prm.width / 2.6));
      for (let j = 0; j < n; j++) if (hsh(i, j + 40) < Math.min(1, z.w.surface * 1.15)) patches.push({ q, lat: o - half + (j + 0.5) * q.prm.width / n + 0.6 * (hsh(i, j + 60) - 0.5), fwd: 0.5 * (hsh(i, j + 80) - 0.5), r: 1.35 + 0.5 * hsh(i, j + 90), c: tgt.map((v) => v * (0.96 + 0.08 * hsh(i, j + 99))) }); }
    if (q.s - lastS >= 1.15) { lastS = q.s; k++;
      for (const sd of sides) { if (hsh(k, sd + 3) < curb) stones.push({ q, lat: o + sd * (half + 0.62), h: base + 0.16, sd, c: [0.87 + 0.06 * hsh(k, 7), 0.84, 0.78] }); } }
    if (q.s - lastSlab >= 2.3) { lastSlab = q.s;
      for (const sd of sides) if (hsh(i, sd + 11) < walk) slabs.push({ q, lat: o + sd * (half + 2.9), h: base + 0.35 * (BIOME_PREVIEW.city.height) + 0.1, sd }); }
    if (q.s - lastTuft >= 7 && tuft > 0.02) { lastTuft = q.s;
      for (const sd of sides) if (hsh(i, sd + 23) < tuft) for (let t = 0; t < 3; t++) tufts.push({ q, lat: o + sd * (half + 6.2 + 1.6 * t + 0.8 * hsh(i, t)), fwd: (t - 1) * 1.3, h: -0.25, r: 0.7 + 0.5 * hsh(i, t + 5), c: tuftC ?? [0.4, 0.6, 0.3] }); }
  }
  const inst = (geo, list, place) => { if (!list.length) return; const m = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.9 }), list.length);
    const M = new THREE.Matrix4(), c = new THREE.Color(); list.forEach((e, j) => { place(e, M); m.setMatrixAt(j, M); c.setRGB(...e.c, THREE.SRGBColorSpace); m.setColorAt(j, c); }); g.add(m); };
  const frameM = (q, p, M, sx, sy, sz) => { const Z = new THREE.Vector3(...q.T), Y = new THREE.Vector3(...q.U), X = new THREE.Vector3(...q.R).negate(); M.makeBasis(X.multiplyScalar(sx), Y.multiplyScalar(sy), Z.multiplyScalar(sz)).setPosition(p); };
  const round = new THREE.SphereGeometry(0.5, 14, 10);
  inst(round, stones, (e, M) => frameM(e.q, at(e.q, e.lat, e.h), M, 0.95, 0.42, 1.0));
  inst(new THREE.BoxGeometry(1, 1, 1), slabs.map((e) => ({ ...e, c: [0.80, 0.77, 0.71] })), (e, M) => frameM(e.q, at(e.q, e.lat, e.h), M, 2.6, 0.2, 2.05));
  inst(new THREE.CylinderGeometry(1, 1, 1, 18), patches, (e, M) => { const p = at(e.q, e.lat, 0.012).addScaledVector(new THREE.Vector3(...e.q.T), e.fwd); frameM(e.q, p, M, 1.25 * e.r, 0.01, e.r); });
  inst(round, tufts, (e, M) => { const p = at(e.q, e.lat, e.h).addScaledVector(new THREE.Vector3(...e.q.T), e.fwd); frameM(e.q, p, M, 2 * e.r, 0.5 * e.r, 2 * e.r); });
  return g;
}

// A single-route stream has `samples`; a graph stream has `routes: {id: stream}`.
export function buildTrack(THREE, stream, material, opt = {}) {
  const routes = stream.routes ? Object.values(stream.routes) : [stream];
  const group = new THREE.Group(); const mat = material ?? new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 });
  for (const r of routes) {
    group.add(new THREE.Mesh(buildBody(THREE, opt.contact ? r.samples : lookSamples(r.samples)), mat));
    if (!opt.contact) group.add(buildTransitionDressing(THREE, r.samples));
    group.add(new THREE.Mesh(buildMarkings(THREE, r.samples, r.markings), mat));
    const tg = buildTunnels(THREE, r);   // double-sided: seen from inside and outside
    if (tg) group.add(new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, side: THREE.DoubleSide })));
  }
  if (stream.deck) { const q = routes[0].samples[0]; group.add(buildDeck(THREE, stream.deck, q?.paint?.barrier_side)); }
  for (const nb of stream.nodes ?? []) {   // v5: junction nodes; the kerbs borrow the paint of one of the node's arm samples
    const q = routes.flatMap((r) => r.samples).find((x) => x.tags?.includes(`node:${nb.id}`)) ?? routes[0].samples[0];
    group.add(buildNode(THREE, nb, q.paint, mat, opt));
  }
  return group;
}

// ---------------------------------------------------------------- v5 junction nodes (core v0.12): roundabout
// Plate strips + island from node.deck.zones; kerb runs as pseudo samples through buildBody, so they get the kit's side
// section and the same look path (lookSamples by node biome) as the arm routes: the mouths meet without a seam. Node
// markings are flat polylines (dashed where the core says so), splitter hatch, bollards, a scenery PLACEHOLDER on the
// centre anchor (the real sets come from Design / Blender), and the NPC paths when opt.paths is set.
export function kerbSamples(k, section, paint, biome) {
  let pts = k.closed ? [...k.pts, k.pts[0]] : [...k.pts], N = k.closed ? [...k.N, k.N[0]] : [...k.N];
  const Tof = (n) => [n[2], 0, -n[0]];   // T = U x R with U = +Y, R = outward normal
  const fwd = (i) => { const a = pts[Math.min(i, pts.length - 2)], b = pts[Math.min(i, pts.length - 2) + 1]; return [b[0] - a[0], 0, b[2] - a[2]]; };
  const d0 = fwd(0), t0 = Tof(N[0]); if (d0[0] * t0[0] + d0[2] * t0[2] < 0) { pts = pts.reverse(); N = N.reverse(); }
  const bottom = section[section.length - 1], L = [bottom, bottom, bottom, bottom, bottom, bottom, [0, 0]];
  const slots = [...L, ...section.slice(0, 7)];
  let s = 0;
  return pts.map((p, i) => { if (i) s += Math.hypot(p[0] - pts[i - 1][0], p[2] - pts[i - 1][2]);
    return { s, p, T: Tof(N[i]), U: [0, 1, 0], R: N[i], slots, prm: { surface: 1, width: 0, offset: 0 }, paint, tags: [], ...(biome && biome !== 'track' ? { biome } : {}) }; });
}
const seeded = (str) => { let h = 2166136261 >>> 0; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return () => { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0; return ((h ^= h >>> 16) >>> 0) / 4294967296; }; };
function polyRibbon(pts, w, closed, dash, gap, lift) {   // flat band along a polyline in the XZ plane -> [pos], [idx]
  const P = closed ? [...pts, pts[0]] : pts, pos = [], idx = [];
  const seg = (a, b) => { const dx = b[0] - a[0], dz = b[2] - a[2], l = Math.hypot(dx, dz) || 1, nx = -dz / l * w / 2, nz = dx / l * w / 2, k = pos.length / 3;
    pos.push(a[0] + nx, a[1] + lift, a[2] + nz, a[0] - nx, a[1] + lift, a[2] - nz, b[0] + nx, b[1] + lift, b[2] + nz, b[0] - nx, b[1] + lift, b[2] - nz); idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); };
  if (!dash) { for (let i = 0; i < P.length - 1; i++) seg(P[i], P[i + 1]); return { pos, idx }; }
  let acc = 0; const per = dash + gap;
  for (let i = 0; i < P.length - 1; i++) { const a = P[i], b = P[i + 1], l = Math.hypot(b[0] - a[0], b[2] - a[2]);
    const at = (t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    let u = 0; while (u < l - 1e-9) { const ph = (acc + u) % per, on = ph < dash, rest = on ? dash - ph : per - ph, v = Math.min(l, u + rest);
      if (on) seg(at(u / l), at(v / l)); u = v; } acc += l; }
  return { pos, idx };
}
export function buildNode(THREE, nb, paint, mat, opt = {}) {
  const g = new THREE.Group(), look = !opt.contact, B = BIOME_PREVIEW[nb.biome] ?? BIOME_PREVIEW.track;
  const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: new THREE.Color().setRGB(...c, THREE.SRGBColorSpace), roughness: 0.9, ...o });
  const road = (look && B.road) || paint.road;
  for (const z of nb.deck.zones) {
    if (z.kind === 'hatch') { const lz = { ...z, rows: z.rows.map(([a, b]) => [[a[0], a[1] + 0.02, a[2]], [b[0], b[1] + 0.02, b[2]]]) };
      g.add(new THREE.Mesh(zoneGeometry(THREE, lz, false), new THREE.MeshStandardMaterial({ map: hatchTexture(THREE), roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -1 }))); continue; }
    g.add(new THREE.Mesh(zoneGeometry(THREE, z, false), z.kind === 'island' ? std([0.55, 0.66, 0.40]) : std(road)));
  }
  for (const k of nb.kerbs) { const S = kerbSamples(k, nb.section, paint, nb.biome); g.add(new THREE.Mesh(buildBody(THREE, look ? lookSamples(S) : S), mat)); if (look) g.add(buildTransitionDressing(THREE, S, [1])); }
  const mk = (list, c) => { const pos = [], idx = []; for (const m of list) { const r = polyRibbon(m.pts, m.w, m.closed, m.dash, m.gap, 0.03), b = pos.length / 3; pos.push(...r.pos); idx.push(...r.idx.map((i) => i + b)); }
    if (!pos.length) return; const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
    g.add(new THREE.Mesh(geo, std(c, { side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 }))); };
  mk(nb.markings.filter((m) => m.kind === 'edge'), MARK_COLOUR.edges); mk(nb.markings.filter((m) => m.kind !== 'edge'), MARK_COLOUR.centre);
  g.add(buildDeck(THREE, { zones: [], furniture: nb.deck.furniture }));
  if (nb.anchor) g.add(sceneryPlaceholder(THREE, nb.anchor));
  if (opt.paths) for (const P of nb.paths) { const geo = new THREE.BufferGeometry().setFromPoints(P.pts.map((p) => new THREE.Vector3(p[0], p[1] + 0.25, p[2])));
    g.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x1f8a86, transparent: true, opacity: 0.55 }))); }
  return g;
}
// PLACEHOLDER scenery on the centre anchor: shows kind, size and facing only. Local +Z = anchor.T (towards the arrivals).
export function sceneryPlaceholder(THREE, a) {
  const g = new THREE.Group(), rnd = seeded(String(a.scenery?.seed ?? a.id)), r = a.r, kind = a.scenery?.kind ?? 'park', set = a.scenery?.set;
  const clay = (c) => new THREE.MeshStandardMaterial({ color: new THREE.Color().setRGB(...c, THREE.SRGBColorSpace), roughness: 0.95 });
  const put = (m, x, y, z) => { m.position.set(x, y, z); g.add(m); return m; };
  const figure = (x, z, c, h = 1.8, y = 0) => { put(new THREE.Mesh(new THREE.CapsuleGeometry(0.45, h - 0.9, 4, 10), clay(c)), x, y + h / 2, z); put(new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 10), clay([0.85, 0.72, 0.58])), x, y + h + 0.25, z); };
  if (kind === 'statue') {
    put(new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.6, 3.4), clay([0.78, 0.75, 0.70])), 0, 0.8, 0);
    put(new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.0, 3.4, 16), clay([0.62, 0.66, 0.70])), 0, 3.3, 0);
    put(new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 12), clay([0.62, 0.66, 0.70])), 0, 5.5, 0.15);
  } else if (kind === 'pond') {
    const w = new THREE.Mesh(new THREE.CircleGeometry(r * 0.72, 48), clay([0.36, 0.60, 0.74])); w.rotation.x = -Math.PI / 2; put(w, 0, 0.04, 0);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(r * 0.72, 0.35, 8, 48), clay([0.80, 0.76, 0.68])); rim.rotation.x = Math.PI / 2; put(rim, 0, 0.1, 0);
  } else if (kind === 'resident') {
    put(new THREE.Mesh(new THREE.CylinderGeometry(r * 0.55, r * 0.58, 0.5, 40), clay([0.72, 0.52, 0.36])), 0, 0.25, 0);
    const n = set === 'dance_party' ? 9 : 4, cols = set === 'orc_band' ? [[0.45, 0.62, 0.35]] : [[0.90, 0.45, 0.55], [0.40, 0.55, 0.90], [0.95, 0.80, 0.35]];
    for (let i = 0; i < n; i++) { const t = set === 'dance_party' ? 2 * Math.PI * i / n : (i - (n - 1) / 2) * 0.45, rr = set === 'dance_party' ? r * 0.35 : r * 0.25;
      const x = set === 'dance_party' ? rr * Math.cos(t) : rr * Math.sin(t) * 2.2, z = set === 'dance_party' ? rr * Math.sin(t) : -rr * 0.3;
      figure(x, z, cols[i % cols.length], set === 'orc_band' ? 2.3 : 1.8, 0.5); }
    if (set === 'dance_party') { put(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 6, 6), clay([0.5, 0.5, 0.5])), 0, 3.5, 0); put(new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 12), clay([0.85, 0.87, 0.92])), 0, 6.6, 0); }
    if (set === 'orc_band') put(new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.9, 20), clay([0.80, 0.30, 0.25])), 0, 0.95, -r * 0.2);
  } else {   // park: a handful of clay trees
    const n = Math.max(3, Math.min(9, Math.round(r * r / 18)));
    for (let i = 0; i < n; i++) { const t = 2 * Math.PI * (i + rnd() * 0.5) / n, rr = r * (0.35 + 0.4 * rnd()), x = rr * Math.cos(t), z = rr * Math.sin(t), h = 2.4 + 1.6 * rnd();
      put(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, h, 8), clay([0.52, 0.38, 0.26])), x, h / 2, z);
      put(new THREE.Mesh(new THREE.SphereGeometry(1.6 + 0.8 * rnd(), 14, 10), clay([0.40, 0.60, 0.32])), x, h + 1.2, z); }
  }
  const Z = new THREE.Vector3(...a.T).normalize(), Y = new THREE.Vector3(0, 1, 0), X = new THREE.Vector3().crossVectors(Y, Z).normalize();
  g.matrix.makeBasis(X, Y, Z).setPosition(...a.p); g.matrixAutoUpdate = false; return g;
}
