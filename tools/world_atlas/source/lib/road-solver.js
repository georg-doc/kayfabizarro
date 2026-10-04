/* Road solver · derives the connector table from the GEOMETRY, then lays roads that fit.

   Why measure instead of assume: a road tile is closed on some edges (kerb/sidewalk) and open on
   others (asphalt lane). Which edges are open cannot be read off the file name, and guessing it is
   exactly what produced the wrong corners and junctions before. So: raycast the rendered tile from
   above at sample points along each edge. Asphalt sits lower than the kerb — the height profile
   tells us where a road can continue.

   Sides are named N (-Z), E (+X), S (+Z), W (-X). A mask is a Set of open side names.
*/
import * as THREE from 'three';

export const SIDES = ['N', 'E', 'S', 'W'];
const SIDE_VEC = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };

/* classify one rendered node (already rotated) → { open:[sides], profile:{side:[heights]} } */
export function classifyNode(node, module, opts = {}) {
  /* inset must stay inside the kerb strip: measured on this pack the sidewalk is ~0.06 wide,
     at 0.10 inset every edge already reads asphalt and every tile looks open on all sides. */
  const inset = opts.inset ?? 0.03;
  const samples = opts.samples ?? 9;
  const h = module / 2;
  node.updateMatrixWorld(true);
  const ray = new THREE.Raycaster();
  const down = new THREE.Vector3(0, -1, 0);
  const profile = {};
  for (const s of SIDES) {
    const [vx, vz] = SIDE_VEC[s];
    const heights = [];
    for (let k = 0; k < samples; k++) {
      const t = (k / (samples - 1) - 0.5) * 2 * h * 0.8;   // across the edge
      const px = vx !== 0 ? vx * (h - inset) : t;
      const pz = vz !== 0 ? vz * (h - inset) : t;
      ray.set(new THREE.Vector3(px, 10, pz), down);
      const hit = ray.intersectObject(node, true)[0];
      heights.push(hit ? +hit.point.y.toFixed(4) : null);
    }
    profile[s] = heights;
  }
  return { profile };
}

/* Measure all pieces at all 4 rotations. instances(name, rotDeg) -> Promise<Object3D> */
export async function measureTable(names, instances, module, opts = {}) {
  const raw = [];
  for (const name of names) {
    for (const rot of [0, 90, 180, 270]) {
      const node = await instances(name, rot);
      raw.push({ name, rot, ...classifyNode(node, module, opts) });
    }
  }
  /* split asphalt from kerb: two height levels across the whole pack */
  const all = raw.flatMap((r) => SIDES.flatMap((s) => r.profile[s])).filter((v) => v !== null);
  const lo = Math.min(...all), hi = Math.max(...all);
  const threshold = opts.threshold ?? (lo + hi) / 2;
  const table = [];
  for (const r of raw) {
    const open = SIDES.filter((s) => {
      const hs = r.profile[s].filter((v) => v !== null);
      if (!hs.length) return false;
      const low = hs.filter((v) => v < threshold).length;
      return low >= Math.ceil(hs.length * 0.6);          // a lane, not a single stray sample
    });
    table.push({ name: r.name, rot: r.rot, open, key: open.join(''), profile: r.profile });
  }
  return { table, levels: { asphalt: +lo.toFixed(3), kerb: +hi.toFixed(3), threshold: +threshold.toFixed(3) } };
}

const maskKey = (sides) => SIDES.filter((s) => sides.includes(s)).join('');

/* map: array of equal-length strings. '#' road, '.' empty, other letters = road with a preference:
   'x' pedestrian crossing, 'c' curved corner. */
export function parseMap(map) {
  const cells = [];
  map.forEach((row, j) => [...row].forEach((ch, i) => {
    if (ch !== '.' && ch !== ' ') cells.push({ i, j, marker: ch });
  }));
  return cells;
}

export function requiredMask(cells, i, j) {
  const has = (x, z) => cells.some((c) => c.i === x && c.j === z);
  const open = [];
  if (has(i, j - 1)) open.push('N');
  if (has(i + 1, j)) open.push('E');
  if (has(i, j + 1)) open.push('S');
  if (has(i - 1, j)) open.push('W');
  return maskKey(open);
}

/* preference order per marker; the solver always requires an exact mask match */
const PREFER = {
  '#': [],
  x: ['road_straight_crossing'],
  c: ['road_corner_curved'],
  '@': ['road_corner']
};

export function solve(map, table, opts = {}) {
  const cells = parseMap(map);
  const placements = [], report = { unmatched: [], dangling: [], used: {}, cells: [] };
  for (const cell of cells) {
    const need = requiredMask(cells, cell.i, cell.j);
    const cands = table.filter((t) => t.key === need);
    if (!cands.length) { report.unmatched.push({ ...cell, need }); continue; }
    const pref = PREFER[cell.marker] || [];
    const pick = cands.find((c) => pref.includes(c.name)) || cands[0];
    placements.push({ a: (opts.pack || 'city_kk') + ':' + pick.name, m: [cell.i, cell.j], r: pick.rot, marker: cell.marker, mask: need });
    report.used[pick.name] = (report.used[pick.name] || 0) + 1;
    report.cells.push({ ...cell, need, name: pick.name, rot: pick.rot, prefHonoured: !pref.length || pref.includes(pick.name) });
    /* a road edge that leads nowhere */
    for (const s of pick.open) if (!need.includes(s)) report.dangling.push({ ...cell, side: s, name: pick.name });
  }
  report.clean = report.unmatched.length === 0 && report.dangling.length === 0;
  return { placements, report, cells };
}

/* Pavement slots, derived from the measured connector table: a tile's CLOSED sides are kerb, its
   OPEN sides are roadway. So legal furniture positions are the midpoints of closed sides, inset to
   the middle of the kerb strip (measured: kerb reads up to ~0.08 from the tile edge, asphalt from
   ~0.10 inward). This replaces hand-typed [i±0.4, j±0.4] offsets, which put benches in the road. */
const INWARD = { N: 180, E: 270, S: 0, W: 90 };

export function kerbSlots(placements, table, module, opts = {}) {
  const mid = module / 2 - (opts.kerbCentre ?? 0.04);
  const slots = [];
  for (const pl of placements) {
    if (!pl.m) continue;
    const name = pl.a.split(':')[1];
    const entry = table.find((t) => t.name === name && t.rot === pl.r);
    if (!entry) continue;
    for (const s of SIDES) {
      if (entry.open.includes(s)) continue;
      const [vx, vz] = SIDE_VEC[s];
      slots.push({
        p: [pl.m[0] * module + vx * mid, 0, pl.m[1] * module + vz * mid],
        side: s, facing: INWARD[s], cell: pl.m, tile: name
      });
    }
  }
  slots.sort((a, b) => a.cell[1] - b.cell[1] || a.cell[0] - b.cell[0] || SIDES.indexOf(a.side) - SIDES.indexOf(b.side));
  return slots;
}

/* connector markers for the overlay: small dots on every open road edge of every placed tile */
export function connectorMarkers(placements, table, module) {
  const g = new THREE.Group();
  const geo = new THREE.SphereGeometry(module * 0.055, 12, 8);
  const matOK = new THREE.MeshBasicMaterial({ color: 0x4cd07a });
  const matEnd = new THREE.MeshBasicMaterial({ color: 0xff7a45 });
  for (const pl of placements) {
    const name = pl.a.split(':')[1];
    const entry = table.find((t) => t.name === name && t.rot === pl.r);
    if (!entry) continue;
    for (const s of entry.open) {
      const [vx, vz] = SIDE_VEC[s];
      const m = new THREE.Mesh(geo, pl.mask.includes(s) ? matOK : matEnd);
      m.position.set(pl.m[0] * module + vx * module * 0.5, 0.22, pl.m[1] * module + vz * module * 0.5);
      g.add(m);
    }
  }
  return g;
}
