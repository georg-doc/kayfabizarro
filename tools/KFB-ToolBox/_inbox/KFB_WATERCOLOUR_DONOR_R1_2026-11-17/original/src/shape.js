// Shapes for things made by hand: nothing flat or sharp. Balls, turned pieces, rounded blocks, rolled coils, and a
// way to knead any of them a little out of true.
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { noise, rng } from './noise.js';

const TAU = Math.PI * 2;
export const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/** One skin over the whole piece: its corners joined, lit as one soft thing. */
export function smooth(g) {
  g.deleteAttribute('uv'); g.deleteAttribute('normal');
  g = mergeVertices(g, 1e-4);
  g.computeVertexNormals();
  return g;
}
const n3 = (x, y, z, s) => 0.6 * noise(x + s, y + z * 0.71) + 0.6 * noise(z - s * 1.3, x * 0.83 - y * 0.57 + 5);
/** Kneads a piece out of true: `amount` in or out, in lumps `grain` to the unit, and `dents` thumb presses of about `press` across. */
export function knead(g, amount = 0.02, grain = 1.6, seed = 1, dents = 0, press = 0.3) {
  const p = g.attributes.position, n = g.attributes.normal, v = new THREE.Vector3(), c = new THREE.Vector3(), d = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const k = amount * n3(v.x * grain, v.y * grain, v.z * grain, seed);
    p.setXYZ(i, v.x + n.getX(i) * k, v.y + n.getY(i) * k, v.z + n.getZ(i) * k);
  }
  const rand = rng(seed * 7 + 3);
  for (let k = 0; k < dents; k++) {
    const j = Math.floor(rand() * p.count), r = press * (0.6 + 0.8 * rand());
    c.fromBufferAttribute(p, j); d.fromBufferAttribute(n, j);
    for (let i = 0; i < p.count; i++) {
      const far = v.fromBufferAttribute(p, i).distanceTo(c);
      if (far < r) { const push = r * 0.2 * (1 - (far / r) ** 2) ** 2; p.setXYZ(i, v.x - d.x * push, v.y - d.y * push, v.z - d.z * push); }
    }
  }
  g.computeVertexNormals();
  return g;
}
/** A ball of clay. */
export const ball = (r = 1, detail = 3) => smooth(new THREE.IcosahedronGeometry(r, detail));
/** A piece turned on its axis: [[radius, height], ...] from the bottom up. */
export const turned = (profile, around = 20) => smooth(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(Math.max(r, 0), y)), around));
/** A block with every edge and corner rounded off. */
export function block(w, h, d, round = 0.06, cell = 0.14) {
  round = Math.min(round, w / 2, h / 2, d / 2);
  const seg = (s) => Math.max(2, Math.round(s / cell));
  const g = new THREE.BoxGeometry(w, h, d, seg(w), seg(h), seg(d)), p = g.attributes.position, v = new THREE.Vector3(), c = new THREE.Vector3();
  const hx = w / 2 - round, hy = h / 2 - round, hz = d / 2 - round;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    c.set(Math.min(hx, Math.max(-hx, v.x)), Math.min(hy, Math.max(-hy, v.y)), Math.min(hz, Math.max(-hz, v.z)));
    v.sub(c);
    if (v.lengthSq() > 1e-12) v.setLength(round);
    p.setXYZ(i, c.x + v.x, c.y + v.y, c.z + v.z);
  }
  return smooth(g);
}
/**
 * A coil rolled between the palms: through `points`, as thick as `radius` (a number, or a function of how far
 * along, 0 to 1), its ends rounded. `flat` presses it (for one that lies on something); `closed` makes a ring.
 */
export function roll(points, radius, { around = 8, every = 0.14, closed = false, flat = 1 } = {}) {
  const curve = new THREE.CatmullRomCurve3(points, closed, 'centripetal'), len = curve.getLength(), R = typeof radius === 'function' ? radius : () => radius;
  const n = Math.max(3, Math.round(len / every)), e0 = Math.min(R(0), len * 0.35), e1 = Math.min(R(1), len * 0.35), stops = [];
  if (closed) for (let i = 0; i < n; i++) stops.push(i / n);
  else {
    for (const k of [0, 0.1, 0.32, 0.66]) stops.push((k * e0) / len);
    for (let i = 0; i <= n; i++) stops.push((e0 + (len - e0 - e1) * (i / n)) / len);
    for (const k of [0.66, 0.32, 0.1, 0]) stops.push(1 - (k * e1) / len);
  }
  const pos = [], index = [], p = new THREE.Vector3(), t = new THREE.Vector3(), nrm = new THREE.Vector3(0, 1, 0), b = new THREE.Vector3(), m = stops.length;
  curve.getTangentAt(0, t);
  if (Math.abs(t.y) > 0.9) nrm.set(1, 0, 0);
  stops.forEach((u) => {
    curve.getPointAt(u, p); curve.getTangentAt(u, t);
    nrm.addScaledVector(t, -nrm.dot(t)).normalize(); b.crossVectors(t, nrm);
    const s = u * len;
    let r = R(u);
    if (!closed) { if (s < e0) r *= Math.sqrt(Math.max(0, 1 - (1 - s / e0) ** 2)); else if (len - s < e1) r *= Math.sqrt(Math.max(0, 1 - (1 - (len - s) / e1) ** 2)); }
    for (let k = 0; k < around; k++) {
      const a = (k / around) * TAU, ox = nrm.x * Math.cos(a) * r + b.x * Math.sin(a) * r, oy = nrm.y * Math.cos(a) * r + b.y * Math.sin(a) * r, oz = nrm.z * Math.cos(a) * r + b.z * Math.sin(a) * r;
      pos.push(p.x + ox, p.y + oy * flat, p.z + oz);
    }
  });
  for (let i = 0; i < (closed ? m : m - 1); i++) for (let k = 0; k < around; k++) {
    const j = (i + 1) % m, k1 = (k + 1) % around, a = i * around + k, a1 = i * around + k1, c = j * around + k, c1 = j * around + k1;
    index.push(a, a1, c, a1, c1, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(index);
  return smooth(g);
}
/** Points of a ring of that radius round `centre`, square to `axis`. */
export function ring(centre, axis, radius, n = 12) {
  const a = axis.clone().normalize(), u = new THREE.Vector3(1, 0, 0);
  if (Math.abs(a.x) > 0.9) u.set(0, 0, 1);
  u.addScaledVector(a, -u.dot(a)).normalize();
  const w = new THREE.Vector3().crossVectors(a, u);
  return Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU; return centre.clone().addScaledVector(u, Math.cos(t) * radius).addScaledVector(w, Math.sin(t) * radius); });
}
/** Scales, turns (about the upright) and moves a piece, in that order. */
export function put(g, x, y, z, turn = 0, scale = 1) {
  if (scale !== 1) g.scale(scale, scale, scale);
  if (turn) g.rotateY(turn);
  return g.translate(x, y, z);
}
