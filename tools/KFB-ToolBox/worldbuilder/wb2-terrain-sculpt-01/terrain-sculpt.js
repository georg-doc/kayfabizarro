/* KFB WorldBuilder · WB2 continuous terrain sculpt layer
   Owner: WorldBuilder terrain authoring.
   Scope: deterministic additive heightfield strokes only.
   No object picking, TransformControls, voxel/hex topology, CSG or runtime ownership. */

export const SCULPT_VERSION = 1;
export const SCULPT_FALLOFF = 'smooth-c2';

const finite = (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function ensureSculpt(terrain) {
  if (!terrain || typeof terrain !== 'object') throw new Error('terrain state required');
  if (!terrain.sculpt || typeof terrain.sculpt !== 'object') {
    terrain.sculpt = { version: SCULPT_VERSION, strokes: [] };
  }
  terrain.sculpt.version = SCULPT_VERSION;
  if (!Array.isArray(terrain.sculpt.strokes)) terrain.sculpt.strokes = [];
  terrain.sculpt.strokes = terrain.sculpt.strokes.map(normalizeStroke).filter(Boolean);
  return terrain.sculpt;
}

export function brushWeight(distance, radius) {
  const r = Math.max(1e-6, finite(radius, 1));
  const d = Math.max(0, finite(distance, 0));
  if (d >= r) return 0;
  const t = clamp(d / r, 0, 1);
  const q = 1 - t * t;
  return q * q;
}

export function makeStroke(mode, radius, strength) {
  const m = mode === 'lower' ? 'lower' : 'raise';
  return {
    mode: m,
    radius: Math.max(0.05, finite(radius, 1.25)),
    strength: Math.max(0.001, finite(strength, 0.12)),
    falloff: SCULPT_FALLOFF,
    points: []
  };
}

export function normalizeStroke(input) {
  if (!input || typeof input !== 'object') return null;
  const stroke = makeStroke(input.mode, input.radius, input.strength);
  if (Array.isArray(input.points)) {
    for (const p of input.points) {
      if (!Array.isArray(p) || p.length < 2) continue;
      const x = Number(p[0]), z = Number(p[1]);
      if (Number.isFinite(x) && Number.isFinite(z)) stroke.points.push([+x.toFixed(4), +z.toFixed(4)]);
    }
  }
  return stroke;
}

export function pointSpacing(radius, gridStep = 0.225) {
  return Math.max(Math.max(0.01, finite(gridStep, 0.225)) * 0.5, Math.max(0.05, finite(radius, 1)) * 0.18);
}

export function addStrokePoint(stroke, x, z, minSpacing = 0) {
  if (!stroke || !Array.isArray(stroke.points)) return false;
  const px = finite(x, NaN), pz = finite(z, NaN);
  if (!Number.isFinite(px) || !Number.isFinite(pz)) return false;
  const last = stroke.points[stroke.points.length - 1];
  if (last && Math.hypot(px - last[0], pz - last[1]) < Math.max(0, finite(minSpacing, 0))) return false;
  stroke.points.push([+px.toFixed(4), +pz.toFixed(4)]);
  return true;
}

export function dabDeltaAt(x, z, mode, cx, cz, radius, strength) {
  const d = Math.hypot(finite(x), finite(z), -finite(cx), -finite(cz));
  const w = brushWeight(d, radius);
  if (!w) return 0;
  const sign = mode === 'lower' ? -1 : 1;
  return sign * Math.max(0, finite(strength, 0)) * w;
}

export function strokeDeltaAt(x, z, stroke) {
  if (!stroke || !Array.isArray(stroke.points)) return 0;
  let sum = 0;
  for (const p of stroke.points) {
    sum += dabDeltaAt(x, z, stroke.mode, p[0], p[1], stroke.radius, stroke.strength);
  }
  return sum;
}

export function sculptDeltaAt(x, z, sculpt) {
  if (!sculpt || !Array.isArray(sculpt.strokes)) return 0;
  let sum = 0;
  for (const stroke of sculpt.strokes) sum += strokeDeltaAt(x, z, stroke);
  return sum;
}

export function applyDabToGeometry(geometry, mode, cx, cz, radius, strength) {
  const pos = geometry?.attributes?.position;
  if (!pos) return 0;
  let changed = 0;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const dy = dabDeltaAt(x, z, mode, cx, cz, radius, strength);
    if (!dy) continue;
    pos.setY(i, pos.getY(i) + dy);
    changed++;
  }
  if (changed) pos.needsUpdate = true;
  return changed;
}

export function strokeCount(sculpt) {
  return Array.isArray(sculpt?.strokes) ? sculpt.strokes.length : 0;
}
