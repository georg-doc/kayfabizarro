// Card-Hex Ascent · authored vertical route (pure data, node-testable).
// Hex islets are clusters of real KayKit tiles; Cards are real Card Builder sheets on ink slabs.

export const HEX_W = 2.0, HEX_ROW = 0.75 * 2.3094; // pointy-Z axial layout
export const CLUSTERS = Object.freeze({
  1: [[0, 0]],
  2: [[-0.5, 0], [0.5, 0]],
  3: [[0, -0.5], [-0.5, 0.5], [0.5, 0.5]].map(([q, r]) => [q, r]),
  4: [[-0.5, 0], [0.5, 0], [0, 1], [0, -1]],
  7: [[0, 0], [1, 0], [-1, 0], [0.5, 1], [-0.5, 1], [0.5, -1], [-0.5, -1]],
});
// cluster offsets are given as (x in tile widths, z in rows) — converted to world here
export function clusterTiles(n) {
  if (n === 3) return [[0, -2 / 3 * HEX_ROW], [-HEX_W / 2, HEX_ROW / 3], [HEX_W / 2, HEX_ROW / 3]];
  return CLUSTERS[n].map(([x, r]) => [x * HEX_W, r * HEX_ROW]);
}

// Card fixture (frozen). Clown Card = ignore_dystopia:1 (WB2). anti_rules_toolkit has no card data in the Combat
// Card Builder registry snapshot, so the finale uses 1001_kayfabe_nights:5 "Shahryār, the Destroyer".
export const CARDS = Object.freeze([
  { id: 'card0', label: 'Card 0 · Spawn', packId: 'embrace_protopia', n: 1, x: 0, z: 0, top: 0, w: 13, encounter: 'practice' },
  { id: 'card1', label: 'Card 1 · Blaster Duel', packId: 'ignore_dystopia', n: 1, x: 0, z: 27.6, top: 5.0, w: 14, encounter: 'blaster' },
  { id: 'card2', label: 'Card 2 · Rifle Encounter', packId: 'forget_utopia', n: 1, x: 20, z: 41.2, top: 10.4, w: 18, encounter: 'rifle' },
  { id: 'card3', label: 'Card 3 · Minigun Finale', packId: '1001_kayfabe_nights', n: 5, x: 27.5, z: 55.2, top: 21.0, w: 15, encounter: 'minigun' },
]);
export const CARD_AR = 1.794; // Card Builder sheet format (quarter-page fit)

// family: hexagon | builder | snow. depth = extra tiles stacked beneath (visual body + side collision)
export const ISLETS = Object.freeze([
  // Zone A · KayKit Medieval Hexagon — broad direct jumps, first Chill & Fun target, terraces
  { id: 'A1', zone: 'A', family: 'hexagon', x: 0, z: 6.5, top: 0.7, n: 3, depth: 1, decor: ['flag_red'] },
  { id: 'A2', zone: 'A', family: 'hexagon', x: 1.4, z: 10.5, top: 1.6, n: 2, depth: 1, decor: ['rock_single_B'] },
  { id: 'A3', zone: 'A', family: 'hexagon', x: -0.9, z: 14.2, top: 2.5, n: 3, depth: 2, decor: ['tree_single_A', 'barrel'] },
  { id: 'A4', zone: 'A', family: 'hexagon', x: 0.8, z: 18.0, top: 3.4, n: 1, depth: 2 },
  { id: 'A5', zone: 'A', family: 'hexagon', x: 0, z: 21.3, top: 4.3, n: 3, depth: 2, decor: ['tent'] },
  // Zone B · KayKit Medieval Builder — narrower connectors, one obvious long jump, a planned double, optional flank
  { id: 'B1', zone: 'B', family: 'builder', x: 9.4, z: 27.6, top: 5.7, n: 2, depth: 1, tile: 'hex_forest', decor: ['detail_treeA'] },
  { id: 'B2', zone: 'B', family: 'builder', x: 12.4, z: 26.0, top: 6.6, n: 1, depth: 2, tile: 'hex_rock' },
  { id: 'B3', zone: 'B', family: 'builder', x: 16.5, z: 26.2, top: 6.9, n: 1, depth: 2, tile: 'hex_rock', decor: ['detail_rocks_small'] },
  { id: 'B4', zone: 'B', family: 'builder', x: 19.2, z: 28.6, top: 8.4, n: 1, depth: 3, tile: 'hex_sand' },
  { id: 'B5', zone: 'B', family: 'builder', x: 19.8, z: 32.3, top: 9.3, n: 3, depth: 3, tile: 'hex_forest', decor: ['detail_treeC'] },
  { id: 'BF1', zone: 'B', family: 'builder', x: 11.0, z: 30.6, top: 7.0, n: 1, depth: 2, tile: 'hex_forest', flank: true, decor: ['detail_treeB'] },
  { id: 'BF2', zone: 'B', family: 'builder', x: 14.6, z: 32.6, top: 8.3, n: 1, depth: 2, tile: 'hex_rock', flank: true },
  // Zone C · KayKit Medieval Snow Biome — strongest vertical silhouette, direct + long/double chain
  { id: 'C1', zone: 'C', family: 'snow', x: 20.0, z: 49.0, top: 11.3, n: 3, depth: 3, decor: ['detail_forestA_snow'] },
  { id: 'C2', zone: 'C', family: 'snow', x: 23.4, z: 51.8, top: 12.8, n: 1, depth: 5 },
  { id: 'C3', zone: 'C', family: 'snow', x: 21.2, z: 55.0, top: 13.9, n: 1, depth: 6 },
  { id: 'C4', zone: 'C', family: 'snow', x: 17.4, z: 55.8, top: 15.4, n: 2, depth: 7, decor: ['detail_forestB_snow'] },
  { id: 'C5', zone: 'C', family: 'snow', x: 14.6, z: 52.6, top: 16.4, n: 1, depth: 8 },
  { id: 'C6', zone: 'C', family: 'snow', x: 15.6, z: 48.6, top: 17.6, n: 1, depth: 9 },
  { id: 'C7', zone: 'C', family: 'snow', x: 19.0, z: 46.6, top: 18.8, n: 1, depth: 9 },
  { id: 'C8', zone: 'C', family: 'snow', x: 22.6, z: 48.0, top: 20.1, n: 2, depth: 10, decor: ['well_snow'] },
]);
// Enemy pillar (not on the assist route): the elevated Card 2 rifleman stands here.
export const PERCHES = Object.freeze([
  { id: 'P2', zone: 'card2', family: 'builder', x: 31.4, z: 41.6, top: 12.6, n: 1, depth: 4, tile: 'hex_rock', assist: false },
]);
// Off-route scenery so each family reads as itself at distance (not walkable).
export const SCENERY = Object.freeze([
  { family: 'hexagon', piece: 'decoration/nature/mountain_A_grass_trees.gltf', x: -9, z: 12, y: -3, s: 2.2 },
  { family: 'hexagon', piece: 'decoration/nature/hills_B_trees.gltf', x: 8, z: 8, y: -2.2, s: 1.8 },
  { family: 'hexagon', piece: 'decoration/nature/trees_A_large.gltf', x: -8, z: 22, y: 0.5, s: 1.6 },
  { family: 'builder', piece: 'objects/gltf/mountain.gltf.glb', x: 14, z: 20, y: 1.5, s: 2.6 },
  { family: 'builder', piece: 'objects/gltf/watchtower.gltf.glb', x: 24, z: 24, y: 4.0, s: 1.6 },
  { family: 'snow', piece: 'objects/gltf/mountain_snow.gltf.glb', x: 10, z: 58, y: 8, s: 4.2 },
  { family: 'snow', piece: 'objects/gltf/forest_snow.gltf.glb', x: 31, z: 47, y: 12, s: 2.0 },
]);

export const INCREMENTS = Object.freeze({
  S1: { zones: ['A'], cards: ['card0', 'card1'], finale: 'card1' },
  S2: { zones: ['A', 'B'], cards: ['card0', 'card1', 'card2'], finale: 'card2' },
  S3: { zones: ['A', 'B', 'C'], cards: ['card0', 'card1', 'card2', 'card3'], finale: 'card3' },
});

export function cardDims(c) { return { hw: c.w / 2, hd: c.w / CARD_AR / 2 }; }

// Fill a SupportGraph with the route for one increment (pure; level.mjs adds the visuals).
export function buildSupports(graph, inc = 'S3') {
  const I = INCREMENTS[inc]; let route = 0; const out = { cards: [], islets: [] };
  const order = [['card', 'card0'], ...ISLETS.filter(i => i.zone === 'A').map(i => ['islet', i]), ['card', 'card1'],
    ...ISLETS.filter(i => i.zone === 'B').map(i => ['islet', i]), ['card', 'card2'], ...PERCHES.map(p => ['perch', p]),
    ...ISLETS.filter(i => i.zone === 'C').map(i => ['islet', i]), ['card', 'card3']];
  for (const [kind, v] of order) {
    if (kind === 'card') {
      if (!I.cards.includes(v)) continue;
      const c = CARDS.find(k => k.id === v), d = cardDims(c);
      graph.add({ id: c.id, kind: 'rect', x: c.x, z: c.z, top: c.top, hw: d.hw, hd: d.hd, bottom: c.top - 0.6, route: route++, zone: c.id, card: c.id, family: 'card' });
      out.cards.push(c);
    } else {
      if (kind === 'islet' && !I.zones.includes(v.zone)) continue;
      if (kind === 'perch' && !I.cards.includes(v.zone)) continue;
      const offRoute = v.flank || kind === 'perch';
      const r = offRoute ? -1 : route++;
      clusterTiles(v.n).forEach(([dx, dz], k) => graph.add({ id: `${v.id}.${k}`, islet: v.id, kind: 'hex', x: v.x + dx, z: v.z + dz, top: v.top, bottom: v.top - 1 - v.depth,
        route: r, zone: v.zone ?? v.id, family: v.family, assist: v.assist ?? true }));
      out.islets.push(v);
    }
  }
  clampColumns(graph);
  return out;
}

// Columns may never reach into the air space above a lower walkable support (body + jump headroom).
export const HEADROOM = 4.8;
export function clampColumns(graph) {
  const clamped = [];
  for (const s of graph.items) {
    if (s.kind !== 'hex') continue;
    let minBottom = s.bottom;
    for (const o of graph.items) {
      if (o === s || o.top >= s.top - 0.01) continue;
      // horizontal clearance between the two footprints (approximate by circumradius for hex, half-extent for rect)
      const ro = o.kind === 'hex' ? o.rOut : Math.hypot(o.hw, o.hd);
      let gap;
      if (o.kind === 'rect') gap = Math.max(0, graph.edgeDistance(o, s.x, s.z) - s.rOut);
      else gap = Math.hypot(o.x - s.x, o.z - s.z) - s.rOut - ro;
      if (gap < 0.9) minBottom = Math.max(minBottom, o.top + HEADROOM);
    }
    if (minBottom > s.bottom + 1e-6) { clamped.push(s.id); s.bottom = Math.min(minBottom, s.top - 1); }
  }
  return clamped;
}
