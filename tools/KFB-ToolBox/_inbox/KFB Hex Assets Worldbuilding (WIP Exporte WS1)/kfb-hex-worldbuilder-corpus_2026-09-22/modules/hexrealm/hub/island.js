/* Die Insel als Bibliothek statt als Seite.
   S11 löste Terrain, Fluss, Straße und Ufer inline in der Seite. Der Hub braucht dieselbe Insel,
   aber auch das, was S11 nur nebenbei kannte: welche Zelle frei ist, welche ein Gebäude trägt und
   wo eine Figur stehen darf. Also einmal hier, mit Rückgabewerten statt Seitenwirkungen. */
import { measure, measured } from '../lib/kit-lab.js';
import { hexMetrics, hexToWorld, wantedMask, solveCoast, normaliseShore, buildNetwork,
  endSeaEdge, solveHexTile, COAST_CORE, isRun, popcount } from '../lib/hex-grid.js';
import { PARTS, PACK_OF, bldRef, TERRAIN, RIVER_CHAINS, ROAD_CHAINS, BUILDINGS, NATURE, PROPS,
  GRID_FIXED } from '../scenes/hex-realm.js';

export const key = (c, r) => c + ',' + r;

/* Ladefolge: erst EIN Teil je Pack nacheinander, dann der Rest zu acht.
   Der Warmlauf muss sequentiell sein — alle Packs teilen sich eine Atlas-Textur, und zwölf
   gleichzeitige Anfragen auf dieselbe Datei zerlegen sie (Kacheln rendern schwarz). */
export async function loadParts(refs, onProgress) {
  const uniq = [...new Set(refs)];
  const byPack = new Map();
  for (const ref of uniq) {
    const p = ref.split(':')[0];
    if (!byPack.has(p)) byPack.set(p, []);
    byPack.get(p).push(ref);
  }
  let done = 0;
  const load = async (ref) => {
    const [pack, name] = ref.split(':');
    try { await measure(pack, name); } catch (e) { console.warn('skip', ref, e.message); }
    onProgress?.(++done, uniq.length);
  };
  const warm = [...byPack.values()].map((l) => l[0]);
  for (const ref of warm) await load(ref);
  const rest = uniq.filter((r) => !warm.includes(r));
  const worker = async () => { for (let ref; (ref = rest.shift()); ) await load(ref); };
  await Promise.all(Array.from({ length: 8 }, worker));
  return uniq.length;
}

export function islandRefs() {
  const tileNames = [...PARTS.base, ...PARTS.coast, ...PARTS.rivers, ...PARTS.roads];
  return [
    ...tileNames.map((n) => `${PACK_OF[n]}:${n}`),
    ...PARTS.nature.map((n) => `${PACK_OF[n]}:${n}`),
    ...PARTS.props.map((n) => `${PACK_OF[n]}:${n}`),
    ...BUILDINGS.map((b) => bldRef(b.kind, b.colour))
  ];
}

/* Mitte der GEMESSENEN Box auf die Zellmitte, nicht den Pivot — KayKit-Pivots sitzen daneben. */
const centreOffset = (ref, rotDeg) => {
  const m = measured.get(ref.replace(':', '/'));
  if (!m) return [0, 0];
  const cx = (m.min[0] + m.max[0]) / 2, cz = (m.min[2] + m.max[2]) / 2;
  const a = (rotDeg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return [cx * c + cz * s, -cx * s + cz * c];
};

export function buildIsland() {
  const M = hexMetrics(measured.get('hex_base/hex_grass')?.size || [2, 1, 2.309]);
  const world = (c, r) => hexToWorld(c, r, M);

  const terrain = new Map();
  TERRAIN.forEach((line, row) => [...line].forEach((ch, col) => { if (ch !== '.') terrain.set(key(col, row), ch); }));
  const shoreFix = normaliseShore(terrain, { passes: 6 });

  const isLand = (c, r) => terrain.get(key(c, r)) === 'g';
  const isSea = (c, r) => !isLand(c, r);

  const river = buildNetwork(RIVER_CHAINS);
  const road = buildNetwork(ROAD_CHAINS);
  const riverSet = new Set(river.mask.keys());
  const roadSet = new Set(road.mask.keys());

  const coastPlan = new Map();
  const shoreCells = [];
  for (const [k, ch] of terrain) {
    if (ch !== 'g' || riverSet.has(k) || roadSet.has(k)) continue;
    const [c, r] = k.split(',').map(Number);
    const sea = wantedMask(c, r, isSea);
    if (!sea) continue;
    shoreCells.push({ c, r, sea, run: isRun(sea), n: popcount(sea) });
    const hit = solveCoast(sea);
    if (hit) coastPlan.set(k, hit);
  }
  const coastSet = new Set(coastPlan.keys());
  const cellKind = (c, r) => {
    const k = key(c, r);
    const co = coastPlan.get(k);
    if (co) return COAST_CORE[co.name] === 'g' ? 'g' : 'w';
    return terrain.get(k);
  };

  const riverEndSet = new Set(river.ends.map(([c, r]) => key(c, r)));
  const solved = { river: [], road: [], coast: [] };
  const unsolved = [];
  const cells = [];

  for (const [k, ch] of terrain) {
    const [col, row] = k.split(',').map(Number);
    if (riverSet.has(k) || roadSet.has(k) || coastSet.has(k)) continue;
    cells.push({ col, row, ref: ch === 'w' ? 'hex_base:hex_water' : 'hex_base:hex_grass', rot: 0, kind: ch });
  }
  for (const [col, row] of river.cells) {
    const chain = river.mask.get(key(col, row)) || 0;
    const want = riverEndSet.has(key(col, row)) ? chain | endSeaEdge(col, row, chain, isSea) : chain;
    const hit = solveHexTile(want, 'river');
    if (hit) { cells.push({ col, row, ref: 'hex_river:' + hit.name, rot: hit.rot, kind: 'river' }); solved.river.push({ col, row, ...hit }); }
    else { cells.push({ col, row, ref: 'hex_base:hex_grass', rot: 0, kind: 'river-fehlt' }); unsolved.push({ col, row, want, family: 'river' }); }
  }
  for (const [col, row] of road.cells) {
    const want = road.mask.get(key(col, row)) || 0;
    const hit = solveHexTile(want, 'road');
    if (hit) { cells.push({ col, row, ref: 'hex_roads:' + hit.name, rot: hit.rot, kind: 'road' }); solved.road.push({ col, row, ...hit }); }
    else { cells.push({ col, row, ref: 'hex_base:hex_grass', rot: 0, kind: 'road-fehlt' }); unsolved.push({ col, row, want, family: 'road' }); }
  }
  for (const [k, hit] of coastPlan) {
    const [col, row] = k.split(',').map(Number);
    cells.push({ col, row, ref: 'hex_coast:' + hit.name, rot: hit.rot, kind: 'coast' });
    solved.coast.push({ col, row, ...hit });
  }

  const placements = cells.map((c) => ({
    a: c.ref, p: world(c.col, c.row), r: c.rot, cell: [c.col, c.row], layer: 'tile', kind: c.kind
  }));

  const onCell = (ref, cell, rotDeg) => {
    const w = world(cell[0], cell[1]);
    const off = centreOffset(ref, rotDeg);
    return [w[0] - off[0], 0, w[2] - off[1]];
  };
  const scatter = (ref, cell, i, n, radius, rotDeg) => {
    const w = world(cell[0], cell[1]);
    const a = (i / Math.max(1, n)) * Math.PI * 2 + (cell[0] + cell[1]) * 0.7;
    const off = centreOffset(ref, rotDeg);
    return [w[0] + Math.cos(a) * radius - off[0], 0, w[2] + Math.sin(a) * radius - off[1]];
  };

  const buildingAt = new Map();
  for (const b of BUILDINGS) {
    const ref = bldRef(b.kind, b.colour);
    const rot = (b.cell[0] * 60) % 360;
    placements.push({ a: ref, p: onCell(ref, b.cell, rot), r: rot, cell: b.cell, layer: 'building', kind: b.kind });
    buildingAt.set(key(b.cell[0], b.cell[1]), { ...b, ref, rot });
  }
  for (const g of NATURE) g.parts.forEach((p, i) => {
    const ref = `${PACK_OF[p]}:${p}`, rot = (i * 53 + g.cell[0] * 31) % 360;
    const fixed = GRID_FIXED.has(p);
    placements.push({
      a: ref, r: fixed ? 0 : rot, cell: g.cell, layer: 'nature', fixed,
      p: fixed || g.parts.length === 1 ? onCell(ref, g.cell, fixed ? 0 : rot)
        : scatter(ref, g.cell, i, g.parts.length, M.inradius * 0.45, rot)
    });
  });
  for (const g of PROPS) g.parts.forEach((p, i) => {
    const ref = `${PACK_OF[p]}:${p}`, rot = (i * 71 + g.cell[1] * 23) % 360;
    placements.push({ a: ref, p: scatter(ref, g.cell, i + 1.5, g.parts.length + 2, M.inradius * 0.78, rot), r: rot, cell: g.cell, layer: 'prop' });
  });

  /* Freie Zellen: Land, nicht Ufer, ohne Gebäude, Straße, Fluss, Natur oder Requisite.
     Wird gebraucht, weil Wegweiser und Bewohner irgendwo stehen müssen, und eine
     handgetippte Liste bricht, sobald jemand ein Gebäude verschiebt. */
  const taken = new Set([...roadSet, ...riverSet, ...coastSet,
    ...BUILDINGS.map((b) => key(b.cell[0], b.cell[1])),
    ...NATURE.map((n) => key(n.cell[0], n.cell[1])),
    ...PROPS.map((p) => key(p.cell[0], p.cell[1]))]);
  const freeCells = [];
  for (const [k, ch] of terrain) {
    if (ch !== 'g' || taken.has(k)) continue;
    const [c, r] = k.split(',').map(Number);
    if (wantedMask(c, r, isSea) !== 0) continue;        // Innenzelle, kein Randfall
    freeCells.push([c, r]);
  }

  return {
    M, world, cells, placements, terrain, coastPlan, cellKind, isLand, isSea,
    buildingAt, freeCells, solved, unsolved, shoreFix, shoreCells, river, road, onCell, scatter
  };
}
