// TN01 · KFB tunnel course: through a mountain, through a building, down a spiral shaft into the (satirical) hollow earth,
// a two-strand tube labyrinth (braid) on the cavern floor, the hollow-earth loop, up a second shaft and home. Closed.
// Georg 27.09: tunnels round, oval, rectangular, polygonal; deep into the earth (satirically: hollow earth), through
// mountain ranges and buildings; modular, from the same pieces as every other track; winding tunnels and labyrinths.
// Every tube is only a `tunnel` spec on ordinary pieces (STRAIGHT, CURVE_EASE, SPIRAL, OFFSET_S, CONNECT). Shapes:
//   mountain  round -> oval (morph inside the mountain, over the long right-hander)
//   building  rect (rounded corners), straight through the ground floor
//   shaft 1   poly (hexagon), 4 turns down, 207 m      shaft 2   round, 4 turns up
//   braid     strand M: poly (octagon, low gallery) dipping under, strand J: rect gallery arching over
// Plan coordinates: x east, y north, z up (metres). Ground = 0. Heading h: 0 = east, 90 = north (positive turn = right).
import fs from 'node:fs';
import { compileGraph, runGraphChecks } from '../track-core.mjs';

const rt = ([x, y, z]) => [x, z, -y];
const psiOf = (h) => Math.atan2(-Math.cos(h * Math.PI / 180), -Math.sin(h * Math.PI / 180)) * 180 / Math.PI;
const anchor = (x, y, z, h, grade = 0) => ({ p: rt([x, y, z]), headingDeg: psiOf(h), grade });

export const TN = {
  depth: 207,                                   // shaft drop (road level of the cavern floor = -207 - 4 portal ramps)
  cave: { c: [1700, -350], rx: 520, rz: 110, floorAbove: 80 },  // ellipsoid; floor 80 m above its bottom
  shaftR: 60, turns: 4,
  braid: { apart: 20, apartLen: 80, len: 200, dip: 9 },
};

export function graph(v = {}) {
  const P = { ...TN, ...v };
  const floorZ = -P.depth;                                        // cavern floor road level
  const cz = floorZ - P.cave.floorAbove + P.cave.rz;              // cavern centre height (bottom + rz)
  const floorR = P.cave.rx * Math.sqrt(1 - ((floorZ - cz) / P.cave.rz) ** 2);
  const [CX, CY] = P.cave.c, wallW = CX - floorR, wallE = CX + floorR;
  const s1 = [CX - 650, CY + P.shaftR], s2 = [CX + 650, CY + P.shaftR];   // shaft entries (axis = entry - R north)
  const B = P.braid;
  const MOUNT = { host: 'mountain' }, LAB = { host: 'labyrinth' };
  const main = {
    id: 'M', closed: true, start: anchor(0, 0, 0, 0),
    pieces: [
      { id: 'start_line', type: 'STRAIGHT', length: 40, tags: ['start_finish'] },
      { id: 'meadow', type: 'STRAIGHT', length: 60 },
      // 1 · mountain: round portal, S-bends inside, morph to an oval over the long right-hander, oval portal out
      { id: 'mt_portal', type: 'STRAIGHT', length: 40, tunnel: { shape: 'round', ...MOUNT }, markings: 'TRACK' },
      { id: 'mt_left', type: 'CURVE_EASE', turn: -35, radius: 150, ease: 40 },
      { id: 'mt_right', type: 'CURVE_EASE', turn: 70, radius: 130, ease: 40, tunnel: { shape: 'oval', ...MOUNT } },
      { id: 'mt_left2', type: 'CURVE_EASE', turn: -35, radius: 150, ease: 40 },
      { id: 'mt_exit', type: 'STRAIGHT', length: 40 },
      { id: 'valley', type: 'STRAIGHT', length: 80, tunnel: null, markings: 'STREET' },
      // 2 · building: rectangular tube straight through the ground floor of a block
      { id: 'bld', type: 'STRAIGHT', length: 90, tunnel: { shape: 'rect', host: 'building' } },
      { id: 'bld_out', type: 'STRAIGHT', length: 40, tunnel: null },
      { id: 'to_shaft', type: 'CONNECT', to: anchor(s1[0] - 40, s1[1], 0, 0) },
      // 3 · shaft 1: hexagon tube, spiral 4 turns down into the hollow earth
      { id: 'shaft1_portal', type: 'STRAIGHT', length: 40, tunnel: { shape: 'poly', n: 6, host: 'shaft' }, markings: 'TRACK' },
      { id: 'shaft1', type: 'SPIRAL', turn: 360 * P.turns, radius: P.shaftR, ease: 30, rise: -P.depth, riseEase: 'ramp' },
      { id: 'shaft1_run', type: 'CONNECT', to: anchor(wallW - 8, CY, floorZ, 0) },
      { id: 'cave_gate', type: 'STRAIGHT', length: 16 },
      // 4 · cavern floor (open air under the inner sun), the braid: two strands swap sides twice, over / under
      { id: 'cave_floor', type: 'STRAIGHT', length: 12, tunnel: null, markings: 'MAG' },
      { id: 'switch', type: 'FORK', fullWidth: 28.8, widen: 30, length: 50, keep: 1 },
      { id: 'm_apart', type: 'OFFSET_S', length: B.apartLen, shift: B.apart, bankDeg: 0 },
      { id: 'm_swap1', type: 'OFFSET_S', length: B.len, shift: -2 * (B.apart + 12.02), bump: -B.dip, tunnel: { shape: 'poly', n: 8, h: 14, ...LAB } },
      { id: 'm_swap2', type: 'OFFSET_S', length: B.len, shift: 2 * (B.apart + 12.02), bump: -B.dip },
      { id: 'm_close', type: 'OFFSET_S', length: B.apartLen, shift: -B.apart, tunnel: null, bankDeg: 0 },
      { id: 'rejoin', type: 'JOIN', narrowTo: 14.4, length: 50, narrow: 30, keep: 1 },
      // 5 · the hollow-earth loop (cartoon: stands free under the inner sun), magnet-locked
      { id: 'loop_in', type: 'STRAIGHT', length: 16, drive: { mode: 'locked', fx: ['zero_g'] } },
      { id: 'sun_loop', type: 'LOOP', height: 60, side: 1, drive: { mode: 'locked', fx: ['zero_g'] } },
      { id: 'loop_out', type: 'STRAIGHT', length: 20 },
      { id: 'cave_out', type: 'CONNECT', to: anchor(wallE - 16, CY, floorZ, 0) },
      // 6 · shaft 2: round tube, 4 turns up, out through a hill
      { id: 'cave_exit', type: 'STRAIGHT', length: 24, tunnel: { shape: 'round', host: 'shaft' }, markings: 'TRACK' },
      { id: 'to_shaft2', type: 'CONNECT', to: anchor(s2[0], s2[1], floorZ, 0) },
      { id: 'shaft2', type: 'SPIRAL', turn: 360 * P.turns, radius: P.shaftR, ease: 30, rise: P.depth, riseEase: 'ramp' },
      { id: 'shaft2_portal', type: 'STRAIGHT', length: 40 },
      { id: 'daylight', type: 'STRAIGHT', length: 30, tunnel: null, markings: 'STREET' },
      // 7 · home over the surface: turn back north-west, long run north of the mountain, hairpin, start
      { id: 'turn_back', type: 'CURVE_EASE', turn: -180, radius: 90, ease: 40 },
      { id: 'north_run', type: 'CONNECT', to: anchor(-220, 300, 0, 180) },
      { id: 'hairpin', type: 'HAIRPIN_180', dir: -1, radius: 140 },
      { id: 'home', type: 'CONNECT', to: anchor(0, 0, 0, 0), bankDeg: 0 },
    ],
  };
  const J = {
    id: 'J', from: { route: 'M', piece: 'switch' }, to: { route: 'M', piece: 'rejoin' },
    pieces: [
      { id: 'j_apart', type: 'OFFSET_S', length: B.apartLen, shift: -B.apart, bankDeg: 0 },
      { id: 'j_swap1', type: 'OFFSET_S', length: B.len, shift: 2 * (B.apart + 12.02), bump: B.dip, tunnel: { shape: 'rect', ...LAB } },
      { id: 'j_swap2', type: 'OFFSET_S', length: B.len, shift: -2 * (B.apart + 12.02), bump: B.dip },
      { id: 'j_close', type: 'OFFSET_S', length: B.apartLen, shift: B.apart, tunnel: null, bankDeg: 0 },
    ],
  };
  const hosts = [{ id: 'hollow_earth', kind: 'cavern', center: rt([CX, CY, cz]), radii: [P.cave.rx, P.cave.rz, P.cave.rx], floorY: floorZ - 0.3,
    sun: { r: 22, at: rt([CX, CY, cz + 45]) }, note: 'satirical hollow earth: inner sun, thin crust' }];
  return { schema: 'kfb.route-graph/0.1-draft', id: 'TN01_TUNNELS', label: 'KFB tunnels · mountain · building · hollow earth · S8 v1', ds: 0.5,
    defaults: { widthClass: 'STANDARD', markings: 'STREET' }, routes: [main, J], hosts, ground: 0,
    meta: { floorZ, floorR, cavernCentre: [CX, CY, cz], shafts: [[s1[0], s1[1] - P.shaftR], [s2[0], s2[1] - P.shaftR]] } };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const g = graph(); const G = compileGraph(g); const C = runGraphChecks(G);
  for (const [rid, r] of Object.entries(C.routes)) for (const c of r.results) console.log(rid, c.pass ? 'ok  ' : (c.severity === 'warn' ? 'WARN' : 'FAIL'), c.id.padEnd(18), c.value, c.note ?? '');
  for (const c of C.results) console.log('G', c.pass ? 'ok  ' : 'FAIL', c.id, c.value, c.note ?? '');
  const M = G.routes.M.samples; console.log('M length', M[M.length - 1].s.toFixed(1), 'samples', M.length, 'J', G.routes.J.samples.length, 'meta', JSON.stringify(g.meta));
  for (const r of Object.values(G.routes)) for (const t of r.tunnels ?? []) console.log(' tube', t.id, t.host, t.length, t.shapes.join('>'));
  G.meta = g.meta; fs.writeFileSync('out/tn01.graph.stream.json', JSON.stringify(G));
}
