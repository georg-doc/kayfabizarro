// Reference loader: Track Core stream (kfb.track-core.stream/0.3, core v0.3 .. v0.8.1) -> three.js meshes.
// v2 (S4 brief v2): tunnel tubes / halls from stream.tunnels + tunnelRings (core v0.7+), and loadStream() for .json.gz.
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
  const cap = (q, reverse) => {
    const ring = [...Array(n).keys()].map((i) => slotWorld(q, i)); if (reverse) ring.reverse();
    const b = pos.length / 3; const c = lin(q.paint.underside);
    for (const p of ring) { pos.push(...p); col.push(...c); }
    for (let i = 1; i < n - 1; i++) idx.push(b, b + i, b + i + 1);  // fan; the ring is convex enough for a preview
  };
  for (let a = 0; a < S.length - 1; a++) {
    if (!drawn(a)) continue;
    const q0 = S[a], q1 = S[a + 1];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, role = FACE_ROLE[i];
      quad(slotWorld(q0, i), slotWorld(q0, j), slotWorld(q1, j), slotWorld(q1, i), q0.paint[role], q1.paint[role]);
    }
    if (a === 0 || !drawn(a - 1)) cap(q0, true);
    if (a === S.length - 2 || !drawn(a + 1)) cap(q1, false);
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

// A single-route stream has `samples`; a graph stream has `routes: {id: stream}`.
export function buildTrack(THREE, stream, material) {
  const routes = stream.routes ? Object.values(stream.routes) : [stream];
  const group = new THREE.Group(); const mat = material ?? new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 });
  for (const r of routes) {
    group.add(new THREE.Mesh(buildBody(THREE, r.samples), mat));
    group.add(new THREE.Mesh(buildMarkings(THREE, r.samples, r.markings), mat));
    const tg = buildTunnels(THREE, r);   // double-sided: seen from inside and outside
    if (tg) group.add(new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, side: THREE.DoubleSide })));
  }
  return group;
}
