// Road-bed seam between the RKIT road kit and the island (contract kfb.road-bed/1, agreed 2026-10-08).
// The island side owns terrain, paths and rim; RKIT only delivers JSON (+ GLB) computed against the outline exported here.
// Coordinates: island-local (x, z relative to spec.pos), lab units (K2: H = 3.64, MacroCell = 6.4), y relative to the island base.
import type { IslandField } from './terrain';

/** FNV-1a over the polygon the terrain is really built from (rounded to mm) + seed + terrain params. */
export function outlineHash(f: IslandField): string {
  const s = JSON.stringify({ poly: f.poly.map(([x, z]) => [+x.toFixed(3), +z.toFixed(3)]), seed: f.spec.seed, terrain: f.spec.terrain });
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return 'fnv1a32:' + h.toString(16).padStart(8, '0');
}

/** Everything RKIT needs to compute a road bed for one island: outline, used polygon, uncarved ground heights. */
export function exportOutline(f: IslandField, step = 1) {
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  for (const [x, z] of f.poly) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
  x0 = Math.floor(x0); z0 = Math.floor(z0);
  const nx = Math.ceil((x1 - x0) / step) + 1, nz = Math.ceil((z1 - z0) / step) + 1;
  const data: (number | null)[] = [];
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const x = x0 + i * step, z = z0 + j * step;
    data.push(f.sd(x, z) > 0 ? +f.base(x, z).toFixed(3) : null);
  }
  return {
    schema: 'kfb.island-outline/1',
    islandId: f.spec.id,
    outlineHash: outlineHash(f),
    frame: 'island-local',
    units: 'lab',
    unitsNote: 'SCALE_CONTRACT_K2: no metres; H (Medium figure) = 3.64, MacroCell = 6.4; y relative to island base (spec.pos[1])',
    islandPos: f.spec.pos,
    outline: f.spec.outline,
    poly: f.poly.map(([x, z]) => [+x.toFixed(3), +z.toFixed(3)]),
    polyNote: 'poly = the polygon terrain, band and underside are built from (sampled + polygonized outline); road beds must use this one',
    centroid: f.c,
    radius: +f.radius.toFixed(3),
    ground: { kind: 'uncarved base height (no path beds)', step, x0, z0, nx, nz, rowMajor: 'z', data },
  };
}

// ---------------------------------------------------------------- kfb.road-bed/1 consumer (island side) ----------
type V3 = [number, number, number];
export interface RoadBedSpec {
  schema: string; rkitVersion: string; islandId: string; outlineHash: string; frame: string; units: string;
  roads: { id: string; profileFamily: string; sections: { s: number; support: number; family: string; L: V3[]; R: V3[] }[];
    seam: { L: { s: number; p: V3; from: V3; kind: string }[]; R: { s: number; p: V3; from: V3; kind: string }[]; falloff: number } }[];
  mask: V3[][]; clear: V3[][];
  anchors: { id: string; kind: string; p: V3; dir: V3; width: number }[];
  rim: { s: number; centre: V3; contour: V3[]; rootDepth: number }[];
}

function inPoly(x: number, z: number, poly: V3[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], zi = poly[i][2], xj = poly[j][0], zj = poly[j][2];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

/** Fast lookups on a road bed: mask / clear tests, nearest seam point (+ its height), rim hit. */
export class RoadBedField {
  /** seam polylines (only consecutive points closer than 2.5 are linked) */
  readonly seams: V3[][] = [];
  readonly falloff: number;
  constructor(readonly spec: RoadBedSpec) {
    this.falloff = spec.roads[0]?.seam.falloff ?? 3.2;
    for (const r of spec.roads) for (const side of [r.seam.L, r.seam.R]) {
      let cur: V3[] = [];
      for (const q of side) {
        const last = cur[cur.length - 1];
        if (last && Math.hypot(q.p[0] - last[0], q.p[2] - last[2]) > 2.5) { if (cur.length > 1) this.seams.push(cur); cur = []; }
        cur.push(q.p);
      }
      if (cur.length > 1) this.seams.push(cur);
    }
  }
  inMask(x: number, z: number) { return this.spec.mask.some((p) => inPoly(x, z, p)); }
  inClear(x: number, z: number) { return this.spec.clear.some((p) => inPoly(x, z, p)); }
  /** distance to the nearest seam segment and the seam height there */
  seamNear(x: number, z: number): { d: number; y: number } {
    let bd = Infinity, by = 0;
    for (const s of this.seams) for (let i = 1; i < s.length; i++) {
      const a = s[i - 1], b = s[i], ex = b[0] - a[0], ez = b[2] - a[2], L2 = ex * ex + ez * ez || 1;
      const t = Math.max(0, Math.min(1, ((x - a[0]) * ex + (z - a[2]) * ez) / L2));
      const px = a[0] + ex * t, pz = a[2] + ez * t, d = Math.hypot(x - px, z - pz);
      if (d < bd) { bd = d; by = a[1] + (b[1] - a[1]) * t; }
    }
    return { d: bd, y: by };
  }
  /** outline point inside a bridge-root zone (band is left open there, RKIT's root body fills it) */
  rimHit(x: number, z: number, tol = 0.9) {
    return this.spec.rim.some((r) => r.contour.some((c) => Math.hypot(c[0] - x, c[2] - z) < tol));
  }
}

const RB = new Map<string, Promise<RoadBedSpec | null>>();
/** road bed for an island, if public/roadbeds/index.json lists one (no 404 noise for islands without a road) */
export function fetchRoadBed(islandId: string): Promise<RoadBedSpec | null> {
  let p = RB.get(islandId);
  if (!p) {
    p = fetch('/roadbeds/index.json').then((r) => (r.ok ? r.json() : {})).catch(() => ({}))
      .then((idx: Record<string, string>) => (idx[islandId] ? fetch('/roadbeds/' + idx[islandId]).then((r) => r.json()) : null));
    RB.set(islandId, p);
  }
  return p;
}
export function setRoadBed(islandId: string, spec: RoadBedSpec | null) { RB.set(islandId, Promise.resolve(spec)); }

// ---------------------------------------------------------------- preview (until RKIT's GLB) + measurement --------
import * as THREE from 'three';

const ROLE_COL = { road: '#5b5f66', gutter: '#4b4e54', kerb: '#e6dfcf', walk: '#d9cdb3', slope: '#8a9a6a' };
/** cross-section order R4..R0, L0..L4 (walk out → edge → edge → walk out) and the role of each strip between them */
const ORDER: [('L' | 'R'), number][] = [['R', 4], ['R', 3], ['R', 2], ['R', 1], ['R', 0], ['L', 0], ['L', 1], ['L', 2], ['L', 3], ['L', 4]];
const STRIP_ROLE = ['walk', 'kerb', 'kerb', 'gutter', 'road', 'gutter', 'kerb', 'kerb', 'walk'] as const;

/** Road surface (road / kerb / walk) as triangles in island-local space: used for the preview mesh and for T1. */
export function roadSurface(spec: RoadBedSpec) {
  const tris: { a: V3; b: V3; c: V3; role: string; s: number; side: string }[] = [];
  for (const r of spec.roads) for (let i = 1; i < r.sections.length; i++) {
    const A = r.sections[i - 1], B = r.sections[i];
    for (let k = 0; k < ORDER.length - 1; k++) {
      const [s0, i0] = ORDER[k], [s1, i1] = ORDER[k + 1];
      const p00 = A[s0][i0], p01 = A[s1][i1], p10 = B[s0][i0], p11 = B[s1][i1];
      const role = STRIP_ROLE[k], side = k < 4 ? 'R' : k > 4 ? 'L' : 'C';
      tris.push({ a: p00, b: p10, c: p11, role, s: B.s, side }, { a: p00, b: p11, c: p01, role, s: B.s, side });
    }
  }
  return tris;
}

/** Preview of the road body from the stations + the slope band down to the seam (RKIT's GLB replaces this). */
export function buildRoadPreview(spec: RoadBedSpec): THREE.BufferGeometry {
  const pos: number[] = [], cols: number[] = [], c = new THREE.Color();
  const put = (p: V3, role: keyof typeof ROLE_COL) => { pos.push(p[0], p[1] + 0.002, p[2]); c.set(ROLE_COL[role]); cols.push(c.r, c.g, c.b); };
  for (const t of roadSurface(spec)) { put(t.a, t.role as any); put(t.b, t.role as any); put(t.c, t.role as any); }
  for (const r of spec.roads) for (const side of [r.seam.L, r.seam.R]) for (let i = 1; i < side.length; i++) {
    const a = side[i - 1], b = side[i];
    if (Math.hypot(a.p[0] - b.p[0], a.p[2] - b.p[2]) > 2.5) continue;
    put(a.from, 'slope'); put(b.from, 'slope'); put(b.p, 'slope');
    put(a.from, 'slope'); put(b.p, 'slope'); put(a.p, 'slope');
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  g.computeVertexNormals();
  return g;
}

function bary(px: number, pz: number, a: V3, b: V3, c: V3): number | null {
  const v0x = b[0] - a[0], v0z = b[2] - a[2], v1x = c[0] - a[0], v1z = c[2] - a[2], v2x = px - a[0], v2z = pz - a[2];
  const den = v0x * v1z - v1x * v0z;
  if (Math.abs(den) < 1e-12) return null;
  const v = (v2x * v1z - v1x * v2z) / den, w = (v0x * v2z - v2x * v0z) / den, u = 1 - v - w;
  if (u < -1e-6 || v < -1e-6 || w < -1e-6) return null;
  return u * a[1] + v * b[1] + w * c[1];
}

/**
 * Acceptance on the FINISHED island mesh (QA_RULEBOOK_TRANSITIONS_R1 T1/T2):
 * T1 terrain triangles (vertices + centroid) above road / kerb / walk, split by curve inner sides;
 * T2 every seam point is a terrain vertex and every seam segment a terrain edge.
 */
export function measureRoadBed(spec: RoadBedSpec, top: THREE.BufferGeometry, seams: V3[][]) {
  const surf = roadSurface(spec);
  // grid over surface triangles
  const G = 2, grid = new Map<string, number[]>();
  surf.forEach((t, i) => {
    const xs = [t.a[0], t.b[0], t.c[0]], zs = [t.a[2], t.b[2], t.c[2]];
    for (let gx = Math.floor(Math.min(...xs) / G); gx <= Math.floor(Math.max(...xs) / G); gx++)
      for (let gz = Math.floor(Math.min(...zs) / G); gz <= Math.floor(Math.max(...zs) / G); gz++) {
        const k = gx + ',' + gz; (grid.get(k) ?? grid.set(k, []).get(k)!).push(i);
      }
  });
  // curvature per station → inner side
  const inner = new Map<number, string>();
  for (const r of spec.roads) for (let i = 1; i < r.sections.length - 1; i++) {
    const h = (S: typeof r.sections[0]) => { const m = [(S.L[0][0] + S.R[0][0]) / 2, (S.L[0][2] + S.R[0][2]) / 2]; return m; };
    const p0 = h(r.sections[i - 1]), p1 = h(r.sections[i]), p2 = h(r.sections[i + 1]);
    const cross = (p1[0] - p0[0]) * (p2[1] - p1[1]) - (p1[1] - p0[1]) * (p2[0] - p1[0]);
    if (Math.abs(cross) > 1e-3) {
      // which side is inside: the side whose edge point is closer to the turn centre ≈ sign test against L
      const L = r.sections[i].L[0], sideL = (p1[0] - p0[0]) * (L[2] - p0[1]) - (p1[1] - p0[1]) * (L[0] - p0[0]);
      inner.set(r.sections[i].s, Math.sign(cross) === Math.sign(sideL) ? 'L' : 'R');
    }
  }
  const P = top.attributes.position as THREE.BufferAttribute, ix = top.index!;
  let checked = 0, above = 0, aboveCurveInner = 0, overlap = 0, maxAbove = 0;
  const worst: { s: number; side: string; role: string; dy: number }[] = [];
  const test = (x: number, y: number, z: number) => {
    const cell = grid.get(Math.floor(x / G) + ',' + Math.floor(z / G));
    if (!cell) return null;
    for (const i of cell) { const t = surf[i]; const ry = bary(x, z, t.a, t.b, t.c); if (ry !== null) return { t, dy: y - ry }; }
    return null;
  };
  for (let k = 0; k < ix.count; k += 3) {
    const vs = [ix.getX(k), ix.getX(k + 1), ix.getX(k + 2)].map((v) => [P.getX(v), P.getY(v), P.getZ(v)] as V3);
    const cen: V3 = [(vs[0][0] + vs[1][0] + vs[2][0]) / 3, (vs[0][1] + vs[1][1] + vs[2][1]) / 3, (vs[0][2] + vs[1][2] + vs[2][2]) / 3];
    checked++;
    let hitAbove = false, hitAny = false, dyMax = -Infinity, info: { t: any; dy: number } | null = null;
    for (const p of [cen, ...vs]) {
      const r = test(p[0], p[1], p[2]);
      if (!r) continue;
      // seam vertices sit exactly on the slope foot, never on the surface; tolerance 1 mm
      if (p !== cen && r.dy <= 0.001) continue;
      hitAny = true;
      if (r.dy > 0.001) { hitAbove = true; if (r.dy > dyMax) { dyMax = r.dy; info = r; } }
    }
    if (hitAny && !hitAbove) overlap++;
    if (hitAbove && info) {
      above++; maxAbove = Math.max(maxAbove, dyMax);
      if (inner.get(info.t.s) === info.t.side) aboveCurveInner++;
      if (worst.length < 8) worst.push({ s: info.t.s, side: info.t.side, role: info.t.role, dy: +dyMax.toFixed(3) });
    }
  }
  // T2: seam points / segments present in the mesh
  const vkey = (x: number, z: number) => x.toFixed(4) + ',' + z.toFixed(4);
  const vid = new Map<string, number>();
  for (let v = 0; v < P.count; v++) vid.set(vkey(P.getX(v), P.getZ(v)), v);
  const edges = new Set<string>();
  for (let k = 0; k < ix.count; k += 3) {
    const a = ix.getX(k), b = ix.getX(k + 1), c = ix.getX(k + 2);
    for (const [u, w] of [[a, b], [b, c], [c, a]]) edges.add(Math.min(u, w) + '-' + Math.max(u, w));
  }
  let seamPts = 0, seamMissing = 0, segs = 0, segMissing = 0, maxYErr = 0;
  for (const line of seams) {
    let prev = -1;
    for (const [x, y, z] of line) {
      seamPts++;
      const v = vid.get(vkey(x, z));
      if (v === undefined) { seamMissing++; prev = -1; continue; }
      maxYErr = Math.max(maxYErr, Math.abs(P.getY(v) - y));
      if (prev >= 0 && prev !== v) { segs++; if (!edges.has(Math.min(prev, v) + '-' + Math.max(prev, v))) segMissing++; }
      prev = v;
    }
  }
  return {
    T1: { terrainTriangles: checked, aboveRoadKerbWalk: above, aboveAtCurveInnerSide: aboveCurveInner, maxAbove: +maxAbove.toFixed(4), underSurfaceOnly: overlap, worst },
    T2: { seamPoints: seamPts, seamPointsNotInMesh: seamMissing, seamSegments: segs, seamSegmentsNotMeshEdges: segMissing, seamHeightErrorMax: +maxYErr.toFixed(5) },
    curveStations: inner.size,
  };
}

// ---------------------------------------------------------------- island body export for RKIT abutments (C2) -------
/**
 * Rock profiles at each bridge root (rim entry): island-local, lab units, y relative to the island base.
 * Axis = road centre tangent at the rim station, pointing out of the island; u along the axis (0 = rim centre, < 0 inland),
 * v across (right-handed with y up). Only the island body (ground, band, under) is hit, never the road preview.
 */
export function exportRimProfiles(group: THREE.Object3D, spec: RoadBedSpec, centroid: [number, number]) {
  const body = ['ground', 'band', 'under'].map((n) => group.getObjectByName(n)).filter(Boolean) as THREE.Object3D[];
  group.updateMatrixWorld(true);
  // raycasts must see faces from both sides (the underside faces down/out); restored at the end
  const sides = new Map<THREE.Material, THREE.Side>();
  for (const m of body as THREE.Mesh[]) for (const mm of [m.material].flat() as THREE.Material[]) { sides.set(mm, mm.side); mm.side = THREE.DoubleSide; }
  const o = new THREE.Vector3().setFromMatrixPosition(group.matrixWorld);
  const rc = new THREE.Raycaster();
  const hits = (from: THREE.Vector3, dir: THREE.Vector3) => { rc.set(from.clone().add(o), dir); rc.far = 400; return rc.intersectObjects(body, false).map((h) => h.point.clone().sub(o)); };
  const r3 = (v: number) => +v.toFixed(3);
  const road = spec.roads[0];
  const res = spec.rim.map((rim) => {
    // tangent of the centre line at the rim station
    let k = 0; road.sections.forEach((S, i) => { if (Math.abs(S.s - rim.s) < Math.abs(road.sections[k].s - rim.s)) k = i; });
    const mid = (S: typeof road.sections[0]) => new THREE.Vector3((S.L[0][0] + S.R[0][0]) / 2, 0, (S.L[0][2] + S.R[0][2]) / 2);
    const a = mid(road.sections[Math.max(0, k - 2)]), b = mid(road.sections[Math.min(road.sections.length - 1, k + 2)]);
    const ax = b.sub(a).setY(0).normalize();
    const c = new THREE.Vector3(rim.centre[0], 0, rim.centre[2]);
    if (ax.dot(new THREE.Vector3(c.x - centroid[0], 0, c.z - centroid[1])) < 0) ax.negate();
    const side = new THREE.Vector3(-ax.z, 0, ax.x); // v axis
    const P = (u: number, v: number, y: number) => c.clone().addScaledVector(ax, u).addScaledVector(side, v).setY(y);
    const down = new THREE.Vector3(0, -1, 0), inward = ax.clone().negate();
    // longitudinal section along the axis: top (highest hit) and underside (lowest hit) per u
    const longTop: number[][] = [], longBottom: number[][] = [];
    for (let u = -20; u <= 6; u += 0.5) {
      const h = hits(P(u, 0, 60), down);
      if (h.length) { longTop.push([r3(u), r3(Math.max(...h.map((p) => p.y)))]); longBottom.push([r3(u), r3(Math.min(...h.map((p) => p.y)))]); }
    }
    // rock face: per depth, where the body begins coming from outside along the axis (horizontal rays inward)
    const face = (v: number) => {
      const out: number[][] = [];
      for (let y = 0.6; y >= -20; y -= 0.5) {
        const h = hits(P(40, v, y), inward);
        if (h.length) { const p = h[0]; out.push([r3(y), r3(p.clone().sub(c).dot(ax))]); }
      }
      return out;
    };
    const cross: { v: number; face: number[][] }[] = [];
    for (let v = -15; v <= 15; v += 1) cross.push({ v, face: face(v) });
    return {
      rimS: rim.s, centre: [r3(c.x), 0, r3(c.z)], axis: [r3(ax.x), 0, r3(ax.z)], side: [r3(side.x), 0, r3(side.z)], rootDepth: rim.rootDepth,
      longitudinal: { note: 'u from -20 (inland) to +6 (outside); [u, y]', top: longTop, underside: longBottom, face: face(0) },
      cross: { note: 'per lateral offset v (−15…15, step 1): rock face as [y, u] from y = 0.6 down to −20; u = distance of the face along the axis from the rim centre', stations: cross },
    };
  });
  for (const [mm, sd] of sides) mm.side = sd;
  return res;
}
