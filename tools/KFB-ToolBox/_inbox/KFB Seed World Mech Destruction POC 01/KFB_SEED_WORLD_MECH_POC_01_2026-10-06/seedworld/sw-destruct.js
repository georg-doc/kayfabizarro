/* KFB Seed World · POC 01 · local procedural destruction
   RESEARCH PLAYGROUND · NOT WORLD STUDIO · NOT COMBAT ARENA
   INTACT_COMPILED → (projectile touches it) PROMOTE → DESTRUCTIBLE_LOCAL, max 4 at a time.
   Cells come from the same BuildingRecipe (floor × façade bay, corner columns, floor slabs, roof sections).
   Support score → unsupported clusters wait (anticipation), then fall (impact, follow-through).
   Fixed pools: debris 256 · rubble 1000 · chips 320 · dust 200 · fire 64. Nothing allocates per bullet.
   Leaving the active area serialises only {buildingId, 2-bit cell states, collapse, rubble count}. */

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { cellsFor, rubbleFor } from './sw-mesh.js';

export const CAPS = { promoted: 4, cells: 2200, cellWin: 1800, debris: 256, rubble: 1000, chips: 320, dust: 200, fire: 64 };
const G = 22;
const withColor = (g) => { g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 3).fill(1), 3)); return g; };

export function pack2(st) { const out = new Uint8Array(Math.ceil(st.length / 4)); for (let i = 0; i < st.length; i++) out[i >> 2] |= (Math.min(2, st[i] === 3 ? 2 : st[i]) & 3) << ((i & 3) * 2); return out; }
export function unpack2(bits, n) { const st = new Uint8Array(n); for (let i = 0; i < n; i++) st[i] = (bits[i >> 2] >> ((i & 3) * 2)) & 3; return st; }

export function createDestruct({ scene, world, material, winGeo, doorGeo }) {
  const fxMat = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
  fxMat.name = 'KFB_SeedWorld_FX';
  const box = withColor(new RoundedBoxGeometry(1, 1, 1, 1, 0.07));
  const ico = withColor(new THREE.IcosahedronGeometry(1, 0)), puff = withColor(new THREE.IcosahedronGeometry(1, 1));
  const IM = (geo, cap, mat = material, shadow = true) => { const m = new THREE.InstancedMesh(geo, mat, cap); m.count = 0; m.frustumCulled = false; m.castShadow = shadow; m.receiveShadow = shadow; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.setColorAt(0, new THREE.Color(1, 1, 1)); m.instanceColor.setUsage(THREE.DynamicDrawUsage); scene.add(m); return m; };
  const mCells = IM(box, CAPS.cells), mWin = IM(winGeo, CAPS.cellWin), mDoor = IM(doorGeo, 64), mDebris = IM(box, CAPS.debris), mRubble = IM(box, CAPS.rubble);
  const mChips = IM(ico, CAPS.chips), mDust = IM(puff, CAPS.dust, material, false), mFire = IM(puff, CAPS.fire, fxMat, false);
  mCells.name = 'destructible-cells'; mDebris.name = 'debris-pool'; mRubble.name = 'rubble';
  const lights = [0, 1].map(() => { const l = new THREE.PointLight('#ffb35c', 0, 40, 1.8); scene.add(l); return { l, t: 9, p: 1 }; });

  const P = [], demoting = [], byId = new Map();
  const debris = Array.from({ length: CAPS.debris }, () => ({ on: false, p: new THREE.Vector3(), v: new THREE.Vector3(), q: new THREE.Quaternion(), w: new THREE.Vector3(), s: new THREE.Vector3(), col: new THREE.Color(), age: 0, life: 0, rest: 0, b: '' }));
  const rubble = { m: new Float32Array(CAPS.rubble * 16), c: new Float32Array(CAPS.rubble * 3), b: new Array(CAPS.rubble).fill(''), n: 0, head: 0, dirty: false };
  const chips = [], dust = [], fire = [];
  const stats = { promoted: 0, promotedPeak: 0, debris: 0, debrisPeak: 0, rubble: 0, chips: 0, dust: 0, fire: 0, vfxPeak: 0, denied: 0, cascades: 0, cellsLost: 0, retired: 0, demoted: 0, reconstructed: 0 };
  let shake = 0, hitStop = 0, now = 0;
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3(), V = new THREE.Vector3(), V2 = new THREE.Vector3(), C = new THREE.Color(), E = new THREE.Euler();
  const BASIS = new THREE.Matrix4();
  const rnd = Math.random;

  /* ---------- promotion ---------- */
  function promote(rec) {
    let B = byId.get(rec.id);
    if (B && !B.leaving) { B.lastHit = now; return B; }
    if (P.length >= CAPS.promoted) {
      const settled = P.filter(isSettled).sort((a, b) => a.lastHit - b.lastHit);
      const v = settled[0] || [...P].sort((a, b) => a.lastHit - b.lastHit)[0];
      if (!v) { stats.denied++; return null; }
      demote(v, false);
    }
    if (B) { B.leaving = false; const k = demoting.indexOf(B); if (k >= 0) demoting.splice(k, 1); P.push(B); world.hidden.add(rec.id); B.lastHit = now; stats.promoted = P.length; return B; }
    const cells = cellsFor(rec), n = cells.length, stored = world.damage.get(rec.id);
    const st = stored ? Uint8Array.from(stored.state) : new Uint8Array(n);
    const maxHp = Float32Array.from(cells, (c) => c.hp), hp = Float32Array.from(maxHp);
    for (let i = 0; i < n; i++) if (st[i] === 1) hp[i] = maxHp[i] * 0.45;
    const adj = cells.map(() => []); cells.forEach((c, i) => { for (const j of [...c.lat, ...c.sup, c.below]) if (j >= 0) { adj[i].push(j); adj[j].push(i); } });
    const byFloor = []; cells.forEach((c, i) => { if (c.kind === 'wall' || c.kind === 'corner') (byFloor[c.floor] = byFloor[c.floor] || []).push(i); });
    B = { id: rec.id, rec, cells, st, hp, maxHp, adj, byFloor, doom: new Float32Array(n).fill(-1), drift: new Float32Array(n * 3), jig: new Float32Array(n), sc: new Int8Array(n), lastHit: now, dirty: true, leaving: false, reconstructed: !!stored };
    if (stored) stats.reconstructed++;
    world.setHidden(rec, true);
    P.push(B); byId.set(rec.id, B); stats.promoted = P.length; stats.promotedPeak = Math.max(stats.promotedPeak, P.length);
    return B;
  }
  function isSettled(B) { if (now - B.lastHit < 1.5) return false; for (let i = 0; i < B.st.length; i++) if (B.st[i] === 3) return false; for (const d of debris) if (d.on && d.b === B.id) return false; return true; }
  function topOf(B) { let t = B.rec.baseY; B.cells.forEach((c, i) => { if (B.st[i] === 0 || B.st[i] === 1) t = Math.max(t, c.p[1] + c.s[1] / 2 + 0.3); }); return t; }
  function snapshot(B) {
    const st = Uint8Array.from(B.st, (v) => (v === 3 ? 2 : v)); let gone = 0; for (const v of st) if (v === 2) gone++;
    return { state: st, bits: pack2(st), n: st.length, collapsed: gone / st.length > 0.55, rubble: gone, top: topOf(B) };
  }
  function store(B) { const s = snapshot(B); world.setDamage(B.rec, s.state, s.top); const e = world.damage.get(B.id); Object.assign(e, { bits: s.bits, n: s.n, collapsed: s.collapsed, rubble: s.rubble }); return s; }
  function dropOwned(id) {
    for (const d of debris) if (d.on && d.b === id) d.on = false;
    let w = 0; for (let r = 0; r < rubble.n; r++) { if (rubble.b[r] === id) continue; if (w !== r) { rubble.m.copyWithin(w * 16, r * 16, r * 16 + 16); rubble.c.copyWithin(w * 3, r * 3, r * 3 + 3); rubble.b[w] = rubble.b[r]; } w++; }
    if (w !== rubble.n) { rubble.n = w; rubble.head = w % CAPS.rubble; rubble.dirty = true; }
  }
  function demote(B, immediate) {
    const i = P.indexOf(B); if (i >= 0) P.splice(i, 1);
    for (let k = 0; k < B.st.length; k++) if (B.st[k] === 3) B.st[k] = 2;
    store(B); dropOwned(B.id); stats.demoted++;
    world.hidden.delete(B.id);
    if (!immediate && world.rebuild(B.rec)) { B.leaving = true; demoting.push(B); }
    else byId.delete(B.id);
    stats.promoted = P.length;
  }
  world.on('integrate', (c) => {
    for (let k = demoting.length - 1; k >= 0; k--) { const B = demoting[k]; if (B.rec.chunk[0] === c.cx && B.rec.chunk[1] === c.cz) { demoting.splice(k, 1); byId.delete(B.id); } }
  });
  world.on('release', (c) => {
    for (const B of [...P]) if (B.rec.chunk[0] === c.cx && B.rec.chunk[1] === c.cz) { demote(B, true); }
    for (let k = demoting.length - 1; k >= 0; k--) { const B = demoting[k]; if (B.rec.chunk[0] === c.cx && B.rec.chunk[1] === c.cz) { demoting.splice(k, 1); byId.delete(B.id); } }
  });

  /* ---------- support (deliberately simple: score 3 from below, −1 per lateral step) ---------- */
  const alive = (B, i) => i >= 0 && (B.st[i] === 0 || B.st[i] === 1);
  function support(B) {
    const { cells, sc } = B; sc.fill(0);
    for (const list of B.byFloor) {
      if (!list) continue;
      for (const i of list) { if (!alive(B, i)) continue; const c = cells[i]; sc[i] = c.below < 0 ? 3 : alive(B, c.below) && sc[c.below] > 0 ? 3 : 0; }
      for (let pass = 0; pass < 3; pass++) for (const i of list) { if (!alive(B, i) || sc[i] >= 3) continue; let m = 0; for (const j of cells[i].lat) if (alive(B, j) && sc[j] - 1 > m) m = sc[j] - 1; if (m > sc[i]) sc[i] = m; }
    }
    cells.forEach((c, i) => { if (c.kind === 'wall' || c.kind === 'corner' || !alive(B, i)) return; let k = 0; for (const j of c.sup) if (alive(B, j) && sc[j] > 0) k++; sc[i] = k >= c.minSup ? 1 : 0; });
    const loose = []; cells.forEach((c, i) => { if (alive(B, i) && sc[i] <= 0) loose.push(i); });
    if (!loose.length) return;
    const set = new Set(loose), seen = new Set();
    for (const s0 of loose) {
      if (seen.has(s0)) continue;
      const cl = [s0]; seen.add(s0);
      for (let q = 0; q < cl.length; q++) for (const j of B.adj[cl[q]]) if (set.has(j) && !seen.has(j)) { seen.add(j); cl.push(j); }
      const delay = 0.32 + rnd() * 0.38; let cx = 0, cy = 1e9, cz = 0, ox = 0, oz = 0;
      for (const i of cl) { const c = cells[i]; cx += c.p[0]; cz += c.p[2]; cy = Math.min(cy, c.p[1] - c.s[1] / 2); ox += c.Z[0]; oz += c.Z[2]; }
      cx /= cl.length; cz /= cl.length; const ol = Math.hypot(ox, oz) || 1;
      const dx = (ox / ol) * (0.8 + rnd()), dz = (oz / ol) * (0.8 + rnd());
      for (const i of cl) { B.st[i] = 3; B.doom[i] = delay + (cells[i].p[1] - cy) * 0.012 + rnd() * 0.05; B.drift[i * 3] = dx; B.drift[i * 3 + 1] = -0.5; B.drift[i * 3 + 2] = dz; }
      for (let k = 0; k < 5; k++) puffAt(cx + (rnd() - 0.5) * 3, cy + rnd() * 0.6, cz + (rnd() - 0.5) * 3, 0.5 + rnd() * 0.6, 0.9, 0.6);
      stats.cascades++;
    }
  }

  /* ---------- damage ---------- */
  function damageCell(B, i, dmg, dir, kind) {
    if (!alive(B, i)) return;
    B.hp[i] -= dmg; B.jig[i] = 1; B.lastHit = now;
    const c = B.cells[i];
    if (B.st[i] === 0 && B.hp[i] < B.maxHp[i] * 0.5) { B.st[i] = 1; for (let k = 0; k < 4; k++) chipAt(c.p[0] + c.Z[0] * 0.2, c.p[1] + (rnd() - 0.5) * c.s[1] * 0.6, c.p[2] + c.Z[2] * 0.2, c.Z, c.col, 1); }
    if (B.hp[i] <= 0) {
      const sp = kind === 'rocket' ? 9 + rnd() * 7 : 2.5 + rnd() * 2;
      V.set(dir.x, Math.max(0.2, dir.y), dir.z).normalize().multiplyScalar(sp); V.y += kind === 'rocket' ? 3 + rnd() * 5 : 1;
      detach(B, i, V, kind === 'rocket' ? 5 : 2);
    }
  }
  function detach(B, i, vel, spin) {
    const c = B.cells[i]; B.st[i] = 2; B.dirty = true; stats.cellsLost++;
    const pieces = c.s[0] > 1.8 && freeDebris() > 40 ? 2 : 1;
    BASIS.makeBasis(V2.fromArray(c.X), new THREE.Vector3().fromArray(c.Y), new THREE.Vector3().fromArray(c.Z)); Q.setFromRotationMatrix(BASIS);
    for (let k = 0; k < pieces; k++) {
      const d = take(); if (!d) break;
      const off = pieces === 1 ? 0 : (k - 0.5) * c.s[0] * 0.5;
      d.p.set(c.p[0] + c.X[0] * off, c.p[1], c.p[2] + c.X[2] * off); d.q.copy(Q); d.s.set(c.s[0] / pieces * 0.98, c.s[1] * 0.98, c.s[2]);
      d.v.copy(vel).add(V2.set((rnd() - 0.5) * 1.5, rnd(), (rnd() - 0.5) * 1.5)); d.w.set((rnd() - 0.5) * spin, (rnd() - 0.5) * spin, (rnd() - 0.5) * spin);
      d.col.setRGB(c.col[0], c.col[1], c.col[2]); d.age = 0; d.life = 7 + rnd() * 3; d.rest = 0; d.b = B.id;
    }
    for (let k = 0; k < 2; k++) puffAt(c.p[0], c.p[1], c.p[2], 0.35 + rnd() * 0.35, 0.7, 0.92);
  }
  function freeDebris() { let n = 0; for (const d of debris) if (!d.on) n++; return n; }
  function take() {
    for (const d of debris) if (!d.on) { d.on = true; return d; }
    // pool full: retire the oldest, smallest first (bias by volume)
    let best = null, bs = -1; for (const d of debris) { const score = d.age / (0.2 + d.s.x * d.s.y * d.s.z); if (score > bs) { bs = score; best = d; } }
    if (best) { toRubble(best); best.on = true; stats.retired++; }
    return best;
  }
  function toRubble(d) {
    const r = rubble.head; M.compose(d.p, d.q, d.s); M.toArray(rubble.m, r * 16); rubble.c[r * 3] = d.col.r * 0.85; rubble.c[r * 3 + 1] = d.col.g * 0.85; rubble.c[r * 3 + 2] = d.col.b * 0.85; rubble.b[r] = d.b;
    rubble.head = (r + 1) % CAPS.rubble; rubble.n = Math.min(CAPS.rubble, rubble.n + 1); rubble.dirty = true; d.on = false;
  }

  /* ---------- VFX pools (rings, no growth) ---------- */
  const ring = (arr, cap, o) => { if (arr.length >= cap) arr.shift(); arr.push(o); };
  function chipAt(x, y, z, n, col, k = 1) {
    const nx = n ? n[0] ?? n.x : 0, ny = n ? n[1] ?? n.y : 1, nz = n ? n[2] ?? n.z : 0;
    ring(chips, CAPS.chips, { p: new THREE.Vector3(x, y, z), v: new THREE.Vector3((rnd() - 0.5) * 5 + nx * 4 * k, rnd() * 4 + 1.5 + ny * 2, (rnd() - 0.5) * 5 + nz * 4 * k), age: 0, life: 0.7 + rnd() * 0.6, s: 0.1 + rnd() * 0.16, c: col, r: rnd() * 6 });
  }
  function puffAt(x, y, z, s, life = 1.1, light = 0.85) { ring(dust, CAPS.dust, { p: new THREE.Vector3(x, y, z), v: new THREE.Vector3((rnd() - 0.5) * 1.6, 0.6 + rnd() * 1.2, (rnd() - 0.5) * 1.6), age: 0, life: life * (0.8 + rnd() * 0.5), s, k: light }); }
  function fireAt(x, y, z, s, life = 0.35, v) { ring(fire, CAPS.fire, { p: new THREE.Vector3(x, y, z), v: v ? v.clone() : new THREE.Vector3(), age: 0, life, s }); }

  /* ---------- public hits ---------- */
  function rayCells(B, o, d, tmax) {
    let best = null;
    for (let i = 0; i < B.cells.length; i++) {
      if (!alive(B, i) && B.st[i] !== 3) continue;
      const c = B.cells[i], rx = o.x - c.p[0], ry = o.y - c.p[1], rz = o.z - c.p[2];
      const ax = [c.X, c.Y, c.Z]; let t0 = 0, t1 = best ? best.t : tmax, hitAx = 0, sg = 1, ok = true;
      for (let k = 0; k < 3 && ok; k++) {
        const a = ax[k], lo = rx * a[0] + ry * a[1] + rz * a[2], ld = d.x * a[0] + d.y * a[1] + d.z * a[2], h = c.s[k] / 2;
        if (Math.abs(ld) < 1e-9) { if (lo < -h || lo > h) ok = false; continue; }
        let ta = (-h - lo) / ld, tb = (h - lo) / ld, s = -1; if (ta > tb) { const t = ta; ta = tb; tb = t; s = 1; }
        if (ta > t0) { t0 = ta; hitAx = k; sg = s; } if (tb < t1) t1 = tb; if (t0 > t1) ok = false;
      }
      if (ok) { const a = ax[hitAx]; best = { t: t0, i, B, n: new THREE.Vector3(a[0] * sg, a[1] * sg, a[2] * sg) }; }
    }
    return best;
  }
  function raycast(o, d, far) {
    let h = world.raycast(o, d, far);
    for (const B of [...P, ...demoting]) {
      const r = rayCells(B, o, d, h ? h.t : far);
      if (r) h = { t: r.t, point: new THREE.Vector3(o.x + d.x * r.t, o.y + d.y * r.t, o.z + d.z * r.t), normal: r.n, kind: 'cell', B, i: r.i, rec: B.rec };
    }
    return h;
  }
  function bullet(h, o, d) {
    if (!h) return;
    const p = h.point;
    if (h.kind === 'terrain') { for (let k = 0; k < 3; k++) chipAt(p.x, p.y + 0.1, p.z, [0, 1, 0], [0.42, 0.34, 0.22], 0.6); if (rnd() < 0.3) puffAt(p.x, p.y + 0.2, p.z, 0.35, 0.6); return; }
    let B = h.B, i = h.i;
    if (h.kind === 'building') {
      B = promote(h.rec);
      if (B) { const r = rayCells(B, o, d, h.t + 9); if (r && r.t > h.t - 2) i = r.i; else i = -1; }
    }
    const col = B && i >= 0 ? B.cells[i].col : h.rec ? h.rec.wall : [0.6, 0.5, 0.4];
    for (let k = 0; k < 4; k++) chipAt(p.x, p.y, p.z, h.normal, col, 1);
    if (rnd() < 0.18) puffAt(p.x + h.normal.x * 0.3, p.y, p.z + h.normal.z * 0.3, 0.16 + rnd() * 0.12, 0.6, 0.95);
    fireAt(p.x + h.normal.x * 0.2, p.y + h.normal.y * 0.2, p.z + h.normal.z * 0.2, 0.35, 0.07);
    if (B && i >= 0) damageCell(B, i, 1, d, 'mg');
  }
  function rocket(p, d, radius = 5.5, power = 16) {
    hitStop = 0.075; shake = Math.min(1.6, shake + 1.1);
    const L = lights.reduce((a, b) => (a.t > b.t ? a : b)); L.l.position.copy(p).addScaledVector(d, -1); L.t = 0;
    for (let k = 0; k < 9; k++) fireAt(p.x + (rnd() - 0.5) * 2, p.y + (rnd() - 0.5) * 2, p.z + (rnd() - 0.5) * 2, 1.2 + rnd() * 1.8, 0.28 + rnd() * 0.2, V.set((rnd() - 0.5) * 6, rnd() * 5, (rnd() - 0.5) * 6));
    for (let k = 0; k < 8; k++) puffAt(p.x + (rnd() - 0.5) * 4, p.y + (rnd() - 0.5) * 2, p.z + (rnd() - 0.5) * 4, 0.6 + rnd() * 0.8, 1.4, 0.88);
    for (const { rec } of world.buildingsNear(p.x, p.z, radius + 1)) {
      const B = promote(rec); if (!B) continue;
      B.cells.forEach((c, i) => {
        if (!alive(B, i)) return;
        const dist = Math.max(0, Math.hypot(c.p[0] - p.x, c.p[1] - p.y, c.p[2] - p.z) - Math.max(c.s[0], c.s[1]) * 0.35);
        if (dist > radius) return;
        const dmg = power * Math.pow(1 - dist / radius, 0.7);
        V2.set(c.p[0] - p.x, c.p[1] - p.y + 0.6, c.p[2] - p.z).normalize().addScaledVector(d, 0.6).normalize();
        damageCell(B, i, dmg, V2, 'rocket');
      });
    }
    for (let k = 0; k < 10; k++) chipAt(p.x, p.y, p.z, [-d.x, 0.6, -d.z], [0.45, 0.36, 0.25], 2);
  }
  function collideSphere(p, r) {
    const push = new THREE.Vector3();
    for (const B of P) {
      const o = world.obbOf(B.rec); if (Math.hypot(p.x - o.cx, p.z - o.cz) > Math.max(o.hx, o.hz) + r + 2) continue;
      B.cells.forEach((c, i) => {
        if (!alive(B, i)) return;
        const rx = p.x - c.p[0], ry = p.y - c.p[1], rz = p.z - c.p[2], ax = [c.X, c.Y, c.Z], l = [0, 0, 0];
        for (let k = 0; k < 3; k++) { const a = ax[k]; l[k] = Math.max(-c.s[k] / 2, Math.min(c.s[k] / 2, rx * a[0] + ry * a[1] + rz * a[2])); }
        const qx = c.p[0] + c.X[0] * l[0] + c.Y[0] * l[1] + c.Z[0] * l[2], qy = c.p[1] + c.X[1] * l[0] + c.Y[1] * l[1] + c.Z[1] * l[2], qz = c.p[2] + c.X[2] * l[0] + c.Y[2] * l[1] + c.Z[2] * l[2];
        const ex = p.x - qx, ey = p.y - qy, ez = p.z - qz, dd = Math.hypot(ex, ey, ez);
        if (dd < r && dd > 1e-4) push.add(V.set(ex, ey, ez).multiplyScalar((r - dd) / dd));
      });
    }
    return push;
  }

  /* ---------- per frame ---------- */
  function update(dt, player) {
    now += dt; hitStop = Math.max(0, hitStop - dt); shake *= Math.exp(-4.5 * dt);
    for (const B of [...P]) {
      if (B.dirty) { B.dirty = false; support(B); }
      for (let i = 0; i < B.st.length; i++) {
        if (B.jig[i] > 0) B.jig[i] = Math.max(0, B.jig[i] - dt * 4);
        if (B.st[i] === 3) { B.doom[i] -= dt; if (B.doom[i] <= 0) { V.set(B.drift[i * 3], B.drift[i * 3 + 1], B.drift[i * 3 + 2]); detach(B, i, V, 1.6); } }
      }
      if (player && isSettled(B)) { const o = B.rec.centroid; if (Math.hypot(player.x - o[0], player.z - o[1]) > 210) demote(B, false); }
    }
    // debris
    let nD = 0;
    for (const d of debris) {
      if (!d.on) continue;
      d.age += dt; d.v.y -= G * dt; d.v.multiplyScalar(Math.exp(-0.25 * dt)); d.p.addScaledVector(d.v, dt);
      Q.setFromEuler(E.set(d.w.x * dt, d.w.y * dt, d.w.z * dt)); d.q.multiply(Q);
      const g = world.groundAt(d.p.x, d.p.z) + Math.min(d.s.x, d.s.y, d.s.z) * 0.45;
      if (d.p.y < g) {
        d.p.y = g;
        if (d.v.y < -3) { d.v.y = -d.v.y * 0.22; if (d.s.x * d.s.y > 1.5 && rnd() < 0.5) puffAt(d.p.x, g, d.p.z, 0.7 + rnd() * 0.6, 1.2, 0.8); } else d.v.y = 0;
        d.v.x *= 0.78; d.v.z *= 0.78; d.w.multiplyScalar(0.6);
        if (d.v.lengthSq() < 0.5) d.rest += dt; else d.rest = 0;
      }
      if (d.rest > 0.35 || d.age > d.life) toRubble(d); else nD++;
    }
    stats.debris = nD; stats.debrisPeak = Math.max(stats.debrisPeak, nD);
    for (let i = chips.length - 1; i >= 0; i--) { const c = chips[i]; c.age += dt; c.v.y -= G * dt; c.p.addScaledVector(c.v, dt); const g = world.groundAt(c.p.x, c.p.z) + 0.05; if (c.p.y < g) { c.p.y = g; c.v.multiplyScalar(0.3); c.v.y = Math.abs(c.v.y) * 0.4; } if (c.age > c.life) chips.splice(i, 1); }
    for (let i = dust.length - 1; i >= 0; i--) { const c = dust[i]; c.age += dt; c.v.multiplyScalar(Math.exp(-1.6 * dt)); c.p.addScaledVector(c.v, dt); if (c.age > c.life) dust.splice(i, 1); }
    for (let i = fire.length - 1; i >= 0; i--) { const c = fire[i]; c.age += dt; c.p.addScaledVector(c.v, dt); c.v.multiplyScalar(Math.exp(-3 * dt)); if (c.age > c.life) fire.splice(i, 1); }
    for (const L of lights) { L.t += dt; L.l.intensity = L.t < 0.35 ? (1 - L.t / 0.35) ** 2 * 420 : 0; }
    stats.chips = chips.length; stats.dust = dust.length; stats.fire = fire.length; stats.rubble = rubble.n;
    stats.vfxPeak = Math.max(stats.vfxPeak, chips.length + dust.length + fire.length);
    draw();
  }
  function draw() {
    let n = 0, w = 0, dr = 0; const t = now;
    for (const B of [...P, ...demoting]) {
      B.cells.forEach((c, i) => {
        const st = B.st[i]; if (st === 2) return; if (n >= CAPS.cells) return;
        let ox = 0, oy = 0, oz = 0, sq = 1;
        if (st === 3) { const a = Math.min(1, 1.2 - B.doom[i]) * 0.07; ox = Math.sin(t * 61 + i) * a; oz = Math.cos(t * 53 + i * 1.7) * a; oy = -Math.max(0, 0.5 - B.doom[i]) * 0.25; }
        if (B.jig[i] > 0) sq = 1 + Math.sin(B.jig[i] * 18) * 0.05 * B.jig[i];
        M.set(c.X[0] * c.s[0] * sq, c.Y[0] * c.s[1] / sq, c.Z[0] * c.s[2] * sq, c.p[0] + ox,
          c.X[1] * c.s[0] * sq, c.Y[1] * c.s[1] / sq, c.Z[1] * c.s[2] * sq, c.p[1] + oy,
          c.X[2] * c.s[0] * sq, c.Y[2] * c.s[1] / sq, c.Z[2] * c.s[2] * sq, c.p[2] + oz, 0, 0, 0, 1);
        mCells.setMatrixAt(n, M); const k = st === 1 ? 0.72 : st === 3 ? 0.9 : 1; mCells.setColorAt(n, C.setRGB(c.col[0] * k, c.col[1] * k, c.col[2] * k)); n++;
        if (c.win && w < CAPS.cellWin) {
          const tgt = c.win.kind === 'door' ? mDoor : mWin, col = c.win.kind === 'door' ? B.rec.door : B.rec.trim, idx = c.win.kind === 'door' ? dr++ : w++;
          if (c.win.kind === 'door' && idx >= 64) return;
          M.set(c.X[0] * c.win.w, 0, c.Z[0], c.p[0] + c.Z[0] * 0.18 + ox, c.X[1] * c.win.w, c.win.h, c.Z[1], c.p[1] + c.win.dy + oy, c.X[2] * c.win.w, 0, c.Z[2], c.p[2] + c.Z[2] * 0.18 + oz, 0, 0, 0, 1);
          tgt.setMatrixAt(idx, M); tgt.setColorAt(idx, C.setRGB(col[0], col[1], col[2]));
        }
      });
    }
    mCells.count = n; mWin.count = w; mDoor.count = dr;
    [mCells, mWin, mDoor].forEach((m) => { m.instanceMatrix.needsUpdate = true; m.instanceColor.needsUpdate = true; });
    let k = 0;
    for (const d of debris) { if (!d.on) continue; M.compose(d.p, d.q, d.s); mDebris.setMatrixAt(k, M); mDebris.setColorAt(k, d.col); k++; }
    mDebris.count = k; mDebris.instanceMatrix.needsUpdate = true; mDebris.instanceColor.needsUpdate = true;
    if (rubble.dirty) { mRubble.instanceMatrix.array.set(rubble.m); mRubble.instanceColor.array.set(rubble.c); mRubble.count = rubble.n; mRubble.instanceMatrix.needsUpdate = true; mRubble.instanceColor.needsUpdate = true; rubble.dirty = false; }
    chips.forEach((c, j) => { const f = 1 - Math.max(0, (c.age - c.life * 0.6) / (c.life * 0.4)); Q.setFromEuler(E.set(c.r + c.age * 6, c.r * 2, 0)); M.compose(c.p, Q, S.setScalar(c.s * f)); mChips.setMatrixAt(j, M); mChips.setColorAt(j, C.setRGB(c.c[0], c.c[1], c.c[2])); });
    mChips.count = chips.length; mChips.instanceMatrix.needsUpdate = true; mChips.instanceColor.needsUpdate = true;
    dust.forEach((c, j) => { const u = c.age / c.life, s = c.s * (0.4 + 1.6 * Math.sqrt(u)) * (1 - u * u); M.compose(c.p, Q.identity(), S.set(s, s * 0.85, s)); mDust.setMatrixAt(j, M); mDust.setColorAt(j, C.setRGB(c.k * 0.86, c.k * 0.82, c.k * 0.74)); });
    mDust.count = dust.length; mDust.instanceMatrix.needsUpdate = true; mDust.instanceColor.needsUpdate = true;
    fire.forEach((c, j) => { const u = c.age / c.life, s = c.s * (0.5 + u) * (1 - u * 0.7); M.compose(c.p, Q.identity(), S.setScalar(s)); mFire.setMatrixAt(j, M); mFire.setColorAt(j, C.setRGB(1.6, 0.9 - u * 0.5, 0.35 - u * 0.3)); });
    mFire.count = fire.length; mFire.instanceMatrix.needsUpdate = true; mFire.instanceColor.needsUpdate = true;
  }
  function reset() { for (const B of [...P]) { P.splice(P.indexOf(B), 1); } demoting.length = 0; byId.clear(); for (const d of debris) d.on = false; rubble.n = 0; rubble.head = 0; rubble.dirty = true; chips.length = dust.length = fire.length = 0; stats.promoted = 0; draw(); }

  return {
    stats, CAPS, P, demoting, byId, promote, demote, raycast, rayCells, bullet, rocket, collideSphere, update, reset, snapshot, store, support,
    trail: (p, big) => { puffAt(p.x, p.y, p.z, big ? 0.38 : 0.26, big ? 0.9 : 0.6, 0.95); if (big) fireAt(p.x, p.y, p.z, 0.32, 0.09); },
    muzzle: (p) => fireAt(p.x, p.y, p.z, 0.22, 0.05),
    get shake() { return shake; }, get hitStop() { return hitStop; },
    debrisActive: () => debris.filter((d) => d.on).length,
    owned: (id) => debris.filter((d) => d.on && d.b === id).length,
    meshes: [mCells, mWin, mDoor, mDebris, mRubble, mChips, mDust, mFire]
  };
}
