// FS01 · KFB Fahrschule (driving school) at the Otto-Maigler-See, Hürth · practice course, closed circuit.
// Georg 27.09: small satirical driving school / practice ground on the lake shore; pull, never a gate (optional practice).
// The course teaches every drive mode once, in the order a beginner needs them, and doubles as the test bench for new
// pieces before they go into a big track.
//   1 start/finish by the Strandbad car park
//   2 practice pad (free driving): slalom cones, parking boxes, brake line; the route runs through it as a guide line
//   3 Weiche (FORK 14.4 -> 28.8 -> 14.4 | 14.4): right = easy lane, left = jump lane (small forgiving jump), JOIN back
//   4 along the east shore, then out over the lake: lifebuoy hops (bounce pads) to the west shore
//   5 up the west shore: assisted mini loop (magnet run, locked)
//   6 magnet catch: banked right-hander back to the start (locked, magnet_catch)
// Plan coordinates = OSM local metres around 50.8845 N, 6.8500 E (x east, y north), from layout/otto_maigler_see.osm.json.
// Ground (shore) = 0 m, lake surface = -1.2 m.
import fs from 'node:fs';
import { compileGraph, runGraphChecks, padFrame } from '../track-core.mjs';

const rt = ([x, y, z]) => [x, z, -y];
const psiOf = (h) => Math.atan2(-Math.cos(h * Math.PI / 180), -Math.sin(h * Math.PI / 180)) * 180 / Math.PI;
const anchor = (x, y, z, h, grade = 0) => ({ p: rt([x, y, z]), headingDeg: psiOf(h), grade });
export const WATER = -1.2;
const ASSIST = { mode: 'assist' }, FREE = { mode: 'free' }, LOCKED = { mode: 'locked' };

export function graph(v = {}) {
  const S0 = [-720, -175];                       // start/finish, heading east, north of the Strandbad car park
  const padC = [S0[0] + 30 + 95, S0[1]];         // practice pad centre (route runs along its axis)
  const hop = (k) => [                            // one lifebuoy: kicker, air, landing on the buoy (bounce fx on the buoy)
    { id: `buoy${k}_kick`, type: 'KICKER', length: 14, lipHeight: 1.5, lipDeg: 16, skin: 'buoy', drive: { mode: 'assist', fx: ['bounce'] } },
    { id: `buoy${k}_air`, type: 'AIR', gap: 26, drop: 1.5, drive: { mode: 'assist', fx: ['bounce'] } },
    { id: `buoy${k}_land`, type: 'LANDING', length: 26, drop: 0, skin: 'buoy', drive: { mode: 'assist', fx: ['bounce'] } },
  ];
  const main = {
    id: 'M', closed: true, start: anchor(...S0, 0, 0),
    pieces: [
      { id: 'start_line', type: 'STRAIGHT', length: 30, tags: ['start_finish'], drive: ASSIST },
      { id: 'practice', type: 'STRAIGHT', length: 190, drive: FREE, tags: ['practice_pad'] },
      { id: 'shore_bend', type: 'CURVE_EASE', turn: 45, radius: 60, ease: 18, drive: ASSIST },
      // the Weiche: right lane = easy (main), left lane = jump lane (branch J)
      { id: 'switch', type: 'FORK', fullWidth: 28.8, widen: 30, length: 60, keep: 1, drive: ASSIST },
      { id: 'easy_lane', type: 'STRAIGHT', length: v.easyLen ?? 96, drive: ASSIST },
      { id: 'rejoin', type: 'JOIN', narrowTo: 14.4, length: 60, narrow: 30, keep: 1, drive: ASSIST },
      { id: 'east_shore', type: 'CONNECT', to: anchor(v.eastX ?? -270, v.eastY ?? -470, 0, 270), drive: ASSIST },
      { id: 'to_pier', type: 'CURVE_EASE', turn: 90, radius: 38, ease: 16, drive: ASSIST },
      // pier: up onto the lifebuoy line (buoys float, their dip stays above the water), hops, down onto the west beach
      { id: 'pier_out', type: 'STRAIGHT', length: 30, rise: v.pierRise ?? 2.2, markings: 'TRACK', drive: ASSIST },
      ...Array.from({ length: v.hops ?? 6 }, (_, k) => hop(k + 1)).flat(),
      { id: 'pier_in', type: 'STRAIGHT', length: 30, rise: -(v.pierRise ?? 2.2), markings: 'TRACK', skin: 'track', drive: ASSIST },
      { id: 'beach_run', type: 'STRAIGHT', length: v.beachRun ?? 120, drive: ASSIST },
      { id: 'west_turn', type: 'CURVE_EASE', turn: 90, radius: 40, ease: 16, drive: ASSIST },
      { id: 'west_shore', type: 'CONNECT', to: anchor(v.loopX ?? -962, v.loopY ?? -400, 0, 90), drive: ASSIST },
      { id: 'loop_in', type: 'STRAIGHT', length: 16, markings: 'MAG', drive: LOCKED, params: { sideL: { to: 0.45 }, sideR: { to: 0.45 }, deckDepth: { to: 1.0 } } },
      { id: 'mini_loop', type: 'LOOP', height: v.loopH ?? 16, side: 1, drive: LOCKED },
      { id: 'loop_out', type: 'STRAIGHT', length: 20, markings: 'TRACK', drive: ASSIST, params: { sideL: { to: 1 }, sideR: { to: 1 }, deckDepth: { to: 2.25 } } },
      { id: 'north_run', type: 'CONNECT', to: anchor(v.catchX ?? -945, v.catchY ?? -300, v.catchZ ?? 2.8, 90), drive: ASSIST },
      // magnet catch: banked right-hander on a berm (the run-in climbs 2.8 m, the curve bulges 1 m more, so the low road edge
      // stays above the ground while the bank blends in and out); the car is held
      // on the deck and handed back on the home straight
      { id: 'magnet_catch', type: 'CURVE_EASE', turn: 90, radius: 42, ease: 18, bankDeg: 18, bump: v.catchLift ?? 1.0, markings: 'MAG', drive: { mode: 'locked', fx: ['magnet_catch'] } },
      { id: 'home', type: 'CONNECT', to: anchor(...S0, 0, 0), markings: 'STREET', drive: ASSIST },
    ],
  };
  const jump = {
    id: 'J', from: { route: 'M', piece: 'switch' }, to: { route: 'M', piece: 'rejoin' },
    pieces: [
      { id: 'j_run', type: 'STRAIGHT', length: 12, markings: 'TRACK', drive: ASSIST },
      { id: 'j_kick', type: 'KICKER', length: 20, lipHeight: 1.2, lipDeg: 10, drive: ASSIST },
      { id: 'j_air', type: 'AIR', gap: 12, drop: 0.2, drive: ASSIST },
      { id: 'j_land', type: 'LANDING', length: 12, drop: 1.0, drive: ASSIST },   // short ramp down to the ground, no dip
    ],
  };
  const pad = {
    id: 'practice_pad', kind: 'practice', center: [padC[0], -padC[1]], y: 0, size: [200, 92], headingDeg: psiOf(0), radius: 14,
    stations: [
      { type: 'cones', pts: [-80, -66, -52, -38, -24, -10].map((u, i) => [u, -26 + (i % 2) * 7]) },     // slalom, north side
      { type: 'parking_box', at: [30, 30], size: [3, 6], headingDeg: 0 }, { type: 'parking_box', at: [36, 30], size: [3, 6], headingDeg: 0 },
      { type: 'parking_box', at: [42, 30], size: [3, 6], headingDeg: 0 },                               // parallel boxes, south side
      { type: 'brake_line', from: [78, -40], to: [78, 40] },                                             // full stop before the line
      { type: 'sign', at: [-92, -38], text: 'KFB FAHRSCHULE' },
    ],
  };
  return { schema: 'kfb.route-graph/0.1-draft', id: 'FS01_FAHRSCHULE', label: 'KFB Fahrschule · Otto-Maigler-See · S7 v1', ds: 0.5,
    // flat by default (a driving school); only the magnet catch is banked, explicitly
    defaults: { widthClass: 'STANDARD', markings: 'STREET', autoBank: { gain: 0, limitDeg: 0 } }, routes: [main, jump], pads: [pad], water: WATER };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const G = compileGraph(graph()); const C = runGraphChecks(G);
  for (const [rid, r] of Object.entries(C.routes)) for (const c of r.results) console.log(rid, c.pass ? 'ok  ' : (c.severity === 'warn' ? 'WARN' : 'FAIL'), c.id.padEnd(18), c.value, c.note ?? '');
  for (const c of C.results) console.log('G', c.pass ? 'ok  ' : 'FAIL', c.id, c.value, c.note ?? '');
  const M = G.routes.M.samples; console.log('M length', M[M.length - 1].s.toFixed(1), 'samples', M.length, 'J', G.routes.J.samples.length);
  fs.writeFileSync('out/fs01.graph.stream.json', JSON.stringify(G));
}
