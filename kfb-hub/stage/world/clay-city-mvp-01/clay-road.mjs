/* KFB CLAY-CITY-MVP-01 · geometric terrain-conforming clay road (replaces the canvas/raster road edge)
   Source of truth: the OSM road graph of the World r2 zone seam (centre line, class, name). OSM stays the
   orientation skeleton; nothing here is drawn into a texture.

   Method
   · centre lines are smoothed once (Chaikin ×2) and resampled every ROAD_RULE.sampleM metres;
   · width comes from the road class (ROAD_RULE.width), never from mixed OSM width tags;
   · two signed distance fields on a regular grid: dDrive (to the drive network minus half width) and
     dFoot (footways/paths). Each grid cell is split into two triangles and every triangle is clipped
     exactly against the iso lines (the field is linear on a triangle, so the clip is exact and the
     neighbouring cells share the very same edge points → watertight, no stair steps, no overlaps);
   · layers: ROAD dDrive ≤ 0 · WALK 0 ≤ dDrive ≤ sidewalk · PATH dFoot ≤ 0 outside the walk band;
   · every vertex is projected through the host terrain height owner plus a small presentation lift;
   · vertical side skirts on the kerb and outer edges hide any crack against the terrain;
   · intersections are the union of the field → stitched once by construction.
   Contact stays the continuous World ground box (Drive) and world.groundAt (walker, + surfaceAt lift):
   the kerb is a 4.5 cm visual lip, never a wall. A collision trimesh of the top surface is still exported
   for a later Track/World height owner. */
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

export const ROAD_RULE = Object.freeze({
  id: 'kfb-clay-road-geom-v1',
  cellM: 0.75,
  sampleM: 3,
  sidewalkM: 1.7,
  pathM: 1.8,
  width: { primary: 9, primary_link: 7, trunk: 9, secondary: 8, secondary_link: 6.5, tertiary: 7, tertiary_link: 6, unclassified: 6, residential: 6, living_street: 5, service: 4.2, pedestrian: 4 },
  foot: ['footway', 'path', 'cycleway', 'steps', 'track', 'bridleway'],
  lift: { road: 0.02, walk: 0.065, path: 0.018 },
  skirtM: 0.18,
  colors: { road: '#8a7890', walk: '#e3ca7d', path: '#d8b985', kerb: '#cdb46b' }
});

function chaikin(pts, it = 2) {
  let p = pts;
  for (let k = 0; k < it; k++) {
    if (p.length < 3) return p;
    const q = [p[0]];
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i], b = p[i + 1];
      q.push({ x: a.x * .75 + b.x * .25, z: a.z * .75 + b.z * .25 }, { x: a.x * .25 + b.x * .75, z: a.z * .25 + b.z * .75 });
    }
    q.push(p[p.length - 1]); p = q;
  }
  return p;
}
function resample(pts, step) {
  const out = [pts[0]]; let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], L = Math.hypot(b.x - a.x, b.z - a.z); if (L < 1e-6) continue;
    let t = step - acc;
    while (t < L) { out.push({ x: a.x + (b.x - a.x) * t / L, z: a.z + (b.z - a.z) * t / L }); t += step; }
    acc = L - (t - step);
  }
  const last = pts[pts.length - 1], pl = out[out.length - 1];
  if (Math.hypot(last.x - pl.x, last.z - pl.z) > 0.2) out.push(last); else out[out.length - 1] = last;
  return out;
}

/* segment buckets for fast distance queries */
function makeField(segs, rect, reach) {
  const B = 12, nx = Math.ceil((rect.maxX - rect.minX) / B) + 1, nz = Math.ceil((rect.maxZ - rect.minZ) / B) + 1;
  const cells = Array.from({ length: nx * nz }, () => []);
  segs.forEach((s, i) => {
    const r = s.hw + reach;
    const x0 = Math.floor((Math.min(s.ax, s.bx) - r - rect.minX) / B), x1 = Math.floor((Math.max(s.ax, s.bx) + r - rect.minX) / B);
    const z0 = Math.floor((Math.min(s.az, s.bz) - r - rect.minZ) / B), z1 = Math.floor((Math.max(s.az, s.bz) + r - rect.minZ) / B);
    for (let a = Math.max(0, x0); a <= Math.min(nx - 1, x1); a++) for (let b = Math.max(0, z0); b <= Math.min(nz - 1, z1); b++) cells[a * nz + b].push(i);
  });
  return (x, z, far = 1e3) => {
    const a = Math.floor((x - rect.minX) / B), b = Math.floor((z - rect.minZ) / B);
    if (a < 0 || b < 0 || a >= nx || b >= nz) return far;
    let best = far;
    for (const i of cells[a * nz + b]) {
      const s = segs[i], dx = s.bx - s.ax, dz = s.bz - s.az, l2 = dx * dx + dz * dz || 1;
      const k = Math.max(0, Math.min(1, ((x - s.ax) * dx + (z - s.az) * dz) / l2));
      const d = Math.hypot(x - s.ax - dx * k, z - s.az - dz * k) - s.hw;
      if (d < best) best = d;
    }
    return best;
  };
}

/* clip a convex polygon (vertices {x,z,dr,df,iso}) by f(v) ≥ 0, f linear; new vertices get tag */
function clip(poly, f, tag) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b);
    if (fa >= 0) out.push(a);
    if ((fa >= 0) !== (fb >= 0)) {
      const t = fa / (fa - fb);
      out.push({ x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t, dr: a.dr + (b.dr - a.dr) * t, df: a.df + (b.df - a.df) * t, iso: tag });
    }
  }
  return out;
}

export function buildClayRoad({ zone, rect, heightAt, rule = ROAD_RULE }) {
  const t0 = performance.now();
  const R = { minX: rect.minX, maxX: rect.maxX, minZ: rect.minZ, maxZ: rect.maxZ };
  const pad = 14, near = (r) => r.line.some((p) => p.x > R.minX - pad && p.x < R.maxX + pad && p.z > R.minZ - pad && p.z < R.maxZ + pad);
  const FOOT = new Set(rule.foot);
  const drive = [], foot = [], used = { drive: {}, foot: {}, names: new Set() };
  for (const r of zone.roads) {
    if (r.tunnel === 'yes' || r.layer < 0 || r.area === 'yes' || !r.line || r.line.length < 2 || !near(r)) continue;
    const w = rule.width[r.cls], isFoot = !w && FOOT.has(r.cls);
    if (!w && !isFoot) continue;
    const pts = resample(chaikin(r.line.map((p) => ({ x: p.x, z: p.z }))), rule.sampleM), hw = (w || rule.pathM) / 2;
    const list = isFoot ? foot : drive;
    for (let i = 1; i < pts.length; i++) list.push({ ax: pts[i - 1].x, az: pts[i - 1].z, bx: pts[i].x, bz: pts[i].z, hw, cls: r.cls });
    const u = isFoot ? used.foot : used.drive; u[r.cls] = (u[r.cls] || 0) + 1; if (r.name) used.names.add(r.name);
  }
  const reach = rule.sidewalkM + rule.cellM * 2;
  const dDrive = makeField(drive, R, reach), dFoot = makeField(foot, R, rule.cellM * 2);
  const C = rule.cellM, nx = Math.round((R.maxX - R.minX) / C), nz = Math.round((R.maxZ - R.minZ) / C);
  const V = new Array((nx + 1) * (nz + 1));
  for (let i = 0; i <= nx; i++) for (let j = 0; j <= nz; j++) {
    const x = R.minX + i * C, z = R.minZ + j * C;
    V[i * (nz + 1) + j] = { x, z, dr: dDrive(x, z, 50), df: dFoot(x, z, 50), iso: null };
  }
  const SW = rule.sidewalkM, L = rule.lift;
  const layers = [
    { id: 'road', lift: L.road, color: new THREE.Color(rule.colors.road), clips: [[(v) => -v.dr, 'r0']] },
    { id: 'walk', lift: L.walk, color: new THREE.Color(rule.colors.walk), clips: [[(v) => v.dr, 'r0'], [(v) => SW - v.dr, 'rS']] },
    { id: 'path', lift: L.path, color: new THREE.Color(rule.colors.path), clips: [[(v) => -v.df, 'f0'], [(v) => v.dr - SW, 'rS']] }
  ];
  const skirtOn = { walk: ['r0', 'rS'] };   // paths sit 1.8 cm proud: no skirt needed
  const P = [], Cc = [], S = [], Sc = [], stats = { road: 0, walk: 0, path: 0, skirts: 0 };
  const kerb = new THREE.Color(rule.colors.kerb), hCache = new Map();
  const H = (x, z) => { const k = x.toFixed(3) + ',' + z.toFixed(3); let h = hCache.get(k); if (h === undefined) { h = heightAt(x, z); hCache.set(k, h); } return h; };
  const emitTri = (a, b, c, lay) => {
    for (const v of [a, c, b]) { P.push(v.x, H(v.x, v.z) + lay.lift, v.z); Cc.push(lay.color.r, lay.color.g, lay.color.b); }
    stats[lay.id]++;
  };
  const emitSkirt = (a, b, lay) => {
    const ya = H(a.x, a.z), yb = H(b.x, b.z), bot = -rule.skirtM;
    S.push(a.x, ya + lay.lift, a.z, b.x, yb + lay.lift, b.z, b.x, yb + bot, b.z, a.x, ya + lay.lift, a.z, b.x, yb + bot, b.z, a.x, ya + bot, a.z);
    for (let k = 0; k < 6; k++) Sc.push(kerb.r, kerb.g, kerb.b);
    stats.skirts++;
  };
  const anyNear = (tri) => tri.some((v) => v.dr < SW + C * 1.5 || v.df < C * 1.5);
  /* full interior cells of one layer are merged along x into runs of up to RUN cells (fewer triangles,
     still terrain-projected at every run end; RUN·cell = 6 m keeps the ribbon on sculpted ground) */
  const RUN = 8, inside = (v, lay) => lay.clips.every(([f]) => f(v) > 1e-6);
  const fullOf = (i, j) => {
    const q = [V[i * (nz + 1) + j], V[(i + 1) * (nz + 1) + j], V[(i + 1) * (nz + 1) + j + 1], V[i * (nz + 1) + j + 1]];
    for (let k = 0; k < layers.length; k++) if (q.every((v) => inside(v, layers[k]))) return k;
    return -1;
  };
  const done = new Uint8Array(nx * nz);
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const k = fullOf(i, j); if (k < 0) continue;
    let e = i; while (e + 1 < nx && e + 1 - i < RUN && fullOf(e + 1, j) === k) e++;
    const a = V[i * (nz + 1) + j], b = V[(e + 1) * (nz + 1) + j], c = V[(e + 1) * (nz + 1) + j + 1], d = V[i * (nz + 1) + j + 1];
    emitTri(a, b, c, layers[k]); emitTri(a, c, d, layers[k]);
    for (let q = i; q <= e; q++) done[q * nz + j] = 1;
    i = e;
  }
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
    if (done[i * nz + j]) continue;
    const a = V[i * (nz + 1) + j], b = V[(i + 1) * (nz + 1) + j], c = V[(i + 1) * (nz + 1) + j + 1], d = V[i * (nz + 1) + j + 1];
    for (const tri of [[a, b, c], [a, c, d]]) {
      if (!anyNear(tri)) continue;
      for (const lay of layers) {
        let poly = tri;
        for (const [f, tag] of lay.clips) { poly = clip(poly, f, tag); if (poly.length < 3) break; }
        if (poly.length < 3) continue;
        for (let k = 1; k < poly.length - 1; k++) emitTri(poly[0], poly[k], poly[k + 1], lay);
        const tags = skirtOn[lay.id];
        if (tags) for (let k = 0; k < poly.length; k++) {
          const p = poly[k], q = poly[(k + 1) % poly.length];
          if (p.iso && p.iso === q.iso && tags.includes(p.iso)) emitSkirt(p, q, lay);
        }
      }
    }
  }
  let top = new THREE.BufferGeometry();
  top.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  top.setAttribute('color', new THREE.Float32BufferAttribute(Cc, 3));
  top = mergeVertices(top, 1e-4); top.computeVertexNormals();
  const skirt = new THREE.BufferGeometry();
  skirt.setAttribute('position', new THREE.Float32BufferAttribute(S, 3));
  skirt.setAttribute('color', new THREE.Float32BufferAttribute(Sc, 3));
  skirt.computeVertexNormals();
  /* surface height for the walker: same fields, same lifts */
  const surfaceAt = (x, z) => {
    if (x < R.minX || x > R.maxX || z < R.minZ || z > R.maxZ) return 0;
    const dr = dDrive(x, z, 50); if (dr <= 0) return L.road; if (dr <= SW) return L.walk;
    return dFoot(x, z, 50) <= 0 ? L.path : 0;
  };
  const collision = { vertices: new Float32Array(top.attributes.position.array), indices: new Uint32Array(top.index.array) };
  return {
    top, skirt, surfaceAt, collision, dDrive, dFoot, sidewalkM: SW,
    report: {
      rule: rule.id, cellM: C, sampleM: rule.sampleM, grid: [nx, nz], rect: R,
      driveSegments: drive.length, footSegments: foot.length, classes: used, names: [...used.names],
      triangles: { road: stats.road, walk: stats.walk, path: stats.path, top: top.index.count / 3, skirt: stats.skirts * 2 },
      liftM: L, sidewalkM: SW, buildMs: +(performance.now() - t0).toFixed(1),
      method: 'SDF union on 0.75 m grid, exact per-triangle iso clip, terrain-projected, kerb/outer skirts'
    }
  };
}
