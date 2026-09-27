// TN02 · responsive tunnels (Georg 27.09): every piece must work for any track width and height, with tunnels too.
//   1 Gotthard-style arch tunnel (preset gotthard) whose section follows the road: STANDARD -> WIDE -> HERO -> NARROW
//   2 underground bunker (preset dumb) with a Weiche INSIDE: FORK and JOIN become junction halls; the main lane runs
//     on in an alien tube (preset alien), the branch in a toy-track tube (preset toy, skin toy), both rejoin in a hall
//   3 the bunker tube ends in the wall of a hangar (preset hangar, new tube, 70 m high) with room for a big ship
//   4 open return, closed circuit
// No section has a fixed size: w / h are 'auto' from the profile the tube carries (except the hangar height).
// Plan coordinates: x east, y north, z up (m). Heading h: 0 = east (positive turn = right).
import fs from 'node:fs';
import { compileGraph, runGraphChecks } from '../track-core.mjs';

const rt = ([x, y, z]) => [x, z, -y];
const psiOf = (h) => Math.atan2(-Math.cos(h * Math.PI / 180), -Math.sin(h * Math.PI / 180)) * 180 / Math.PI;
const anchor = (x, y, z, h, grade = 0) => ({ p: rt([x, y, z]), headingDeg: psiOf(h), grade });

export function graph(v = {}) {
  const main = {
    id: 'M', closed: true, start: anchor(0, 0, 0, 0),
    pieces: [
      { id: 'start_line', type: 'STRAIGHT', length: 40, tags: ['start_finish'] },
      { id: 'approach', type: 'STRAIGHT', length: 40 },
      // 1 · Gotthard: arch tube, the section follows every width step
      { id: 'g_portal', type: 'STRAIGHT', length: 40, tunnel: { preset: 'gotthard' } },
      { id: 'g_wide', type: 'WIDTH_STEP', length: 80, widthTo: 'WIDE' },
      { id: 'g_bend', type: 'CURVE_EASE', turn: -40, radius: 220, ease: 40 },
      { id: 'g_hero', type: 'WIDTH_STEP', length: 80, widthTo: 'HERO' },
      { id: 'g_bend2', type: 'CURVE_EASE', turn: 40, radius: 220, ease: 40 },
      { id: 'g_narrow', type: 'WIDTH_STEP', length: 100, widthTo: 'NARROW' },
      { id: 'g_exit', type: 'STRAIGHT', length: 40 },
      { id: 'daylight', type: 'WIDTH_STEP', length: 80, widthTo: 'STANDARD', tunnel: null },
      { id: 'valley', type: 'STRAIGHT', length: 60 },
      // 2 · bunker with a Weiche inside (halls), alien main tube, toy branch tube
      { id: 'b_portal', type: 'STRAIGHT', length: 40, tunnel: { preset: 'dumb' }, markings: 'TRACK' },
      { id: 'switch', type: 'FORK', fullWidth: 28.8, widen: 60, length: 70, keep: 1, gore: 10 },
      { id: 'm_alien', type: 'STRAIGHT', length: v.alienLen ?? 340, tunnel: { preset: 'alien', new: true }, markings: 'MAG' },
      { id: 'rejoin', type: 'JOIN', narrowTo: 14.4, length: 70, narrow: 60, keep: 1, gore: 10, tunnel: { preset: 'dumb', new: true }, markings: 'TRACK' },
      { id: 'b_run', type: 'STRAIGHT', length: 60 },
      // 3 · the bunker tube ends in the hangar wall: a new, huge tube; the ship stands beside the track
      { id: 'hangar', type: 'STRAIGHT', length: v.hangarLen ?? 240, tunnel: { preset: 'hangar', new: true } },
      { id: 'h_out', type: 'STRAIGHT', length: 40, tunnel: null, markings: 'STREET' },
      // 4 · open return
      { id: 'turn', type: 'HAIRPIN_180', dir: -1, radius: 160 },
      { id: 'return', type: 'CONNECT', to: anchor(-160, 420, 0, 180) },
      { id: 'hairpin', type: 'HAIRPIN_180', dir: -1, radius: 190 },
      { id: 'home', type: 'CONNECT', to: anchor(0, 0, 0, 0), bankDeg: 0 },
    ],
  };
  const J = {
    id: 'J', from: { route: 'M', piece: 'switch' }, to: { route: 'M', piece: 'rejoin' },
    pieces: [
      { id: 'j_away', type: 'OFFSET_S', length: 120, shift: -40, bankDeg: 0, tunnel: { preset: 'toy', new: true }, skin: 'toy', markings: 'TRACK' },
      { id: 'j_run', type: 'STRAIGHT', length: 100, skin: 'toy' },
      { id: 'j_back', type: 'OFFSET_S', length: 120, shift: 40, bankDeg: 0, skin: 'toy' },
    ],
  };
  return { schema: 'kfb.route-graph/0.1-draft', id: 'TN02_RESPONSIVE', label: 'KFB responsive tunnels · Gotthard · bunker Weiche · hangar · S9 v1', ds: 0.5,
    defaults: { widthClass: 'STANDARD', markings: 'STREET' }, routes: [main, J], ground: 0 };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const G = compileGraph(graph()); const C = runGraphChecks(G);
  for (const [rid, r] of Object.entries(C.routes)) for (const c of r.results) if (!c.pass || /tunnel|portal|clear/.test(c.id)) console.log(rid, c.pass ? 'ok  ' : (c.severity === 'warn' ? 'WARN' : 'FAIL'), c.id.padEnd(18), c.value, c.note ?? '');
  for (const c of C.results) console.log('G', c.pass ? 'ok  ' : 'FAIL', c.id, c.value, c.note ?? '');
  for (const [k, r] of Object.entries(G.routes)) for (const t of r.tunnels ?? []) { const q = r.samples[Math.floor((t.i0 + t.i1) / 2)];
    console.log(' ', k, t.id, t.kind, t.host, t.shapes.join('>'), t.length, 'w', q.tunnel.w, 'h', q.tunnel.h, 'fill', q.tunnel.fill); }
  const M = G.routes.M.samples; console.log('M length', M[M.length - 1].s.toFixed(1), 'J', G.routes.J.samples.length);
  fs.writeFileSync('out/tn02.graph.stream.json', JSON.stringify(G));
}
