// TD04 · Tokyo Drift at the Uni-Center · closed circuit. TD03 up to the plaza hairpin, then (new):
//   K3 balcony climb: two laps round the yellow wing (rounded rectangle, right turns = positive turn in the core), 15.3 m -> ~27 m, one lap per
//      wing floor (6 m), slim parapets; laps stack in plan (designed crossings, headroom checked)
//   finale: straight off the top lap, kicker past the wing tip, air, long landing down to the street
//   street return: sweeping right turns back to the start/finish on the south street; the last CONNECT lands exactly on
//      the start frame (`closure` check)
// Balcony geometry from TD02 K3 (balcony_off / balcony_corner / wing_h), widened for the STANDARD 14.4 section:
// offset from the wing edge = half section (7.2 + 0.35 x 4.32 = 8.71 m) + 3.3 m; corner radius 13 m keeps the inner
// edge 2.9 m off the wing corner (clearance = R - half - sqrt(2)(R - off)).
import fs from 'node:fs';
import { compileRecipe, runChecks } from '../track-core.mjs';
import { B, rt, psiOf, anchor, recipe as td03 } from './td03.mjs';

export const K3 = { wing: 330, off: 12, R: 13, ease: 6, laps: 2, lapRise: 6, entryBlend: 0.25, exitBlend: 0.5 };
const DEG = Math.PI / 180;
// arm frame (Blender plan): u along the yellow arm (outwards), v to its left
const U_ = [Math.cos(K3.wing * DEG), Math.sin(K3.wing * DEG)], V_ = [-U_[1], U_[0]];
export const armPt = (a, c) => [a * U_[0] + c * V_[0], a * U_[1] + c * V_[1]];

// horizontal length of a plan piece (as the core measures it): CURVE_EASE L = theta R + ease
const hLen = (pc) => (pc.type === 'STRAIGHT' || pc.type === 'WIDTH_STEP' ? pc.length : Math.abs(pc.turn) * DEG * pc.radius + pc.ease);

// o.lapRise: height per lap; o.corners: per corner (8 = 2 laps x 4) { bank (deg, >0 = into the right turn), bump (m) }
export function balcony(Z, o = {}) {
  const lapRise = o.lapRise ?? K3.lapRise; let ci = 0;
  const a0 = B.D0 - K3.off, a1 = B.D0 + B.arm_len + K3.off, c1 = B.arm_w / 2 + K3.off;   // rectangle in the arm frame
  const longS = a1 - a0 - 2 * K3.R, shortS = 2 * c1 - 2 * K3.R;
  const corner = (id) => { const c = o.corners?.[ci++] ?? {};
    return { id, type: 'CURVE_EASE', turn: 90, radius: K3.R, ease: o.ease ?? K3.ease, bankDeg: c.bank ?? 0, bump: c.bump ?? 0 }; };
  // laps start and end in the middle of the NE side (clear of the roof hairpin on the way in, straight exit on top)
  const lap = (k) => [
    { id: `k3_l${k}_ne_out`, type: 'STRAIGHT', length: longS / 2 }, corner(`k3_l${k}_c_tip_n`),
    { id: `k3_l${k}_tip`, type: 'STRAIGHT', length: shortS }, corner(`k3_l${k}_c_tip_s`),
    { id: `k3_l${k}_sw`, type: 'STRAIGHT', length: longS }, corner(`k3_l${k}_c_hub_s`),
    { id: `k3_l${k}_hub`, type: 'STRAIGHT', length: shortS }, corner(`k3_l${k}_c_hub_n`),
    { id: `k3_l${k}_ne_in`, type: 'STRAIGHT', length: longS / 2 },
  ];
  const pieces = [];
  for (let k = 1; k <= K3.laps; k++) pieces.push(...lap(k));
  // one continuous climb over all pieces: constant grade, eased in on the first piece and out on the last
  const L = pieces.map(hLen), eff = L.map((l, i) => l * (i === 0 ? 1 - K3.entryBlend / 2 : i === L.length - 1 ? 1 - K3.exitBlend / 2 : 1));
  // grade: exactly one wing floor per lap, so lap 2 sits 6.00 m over lap 1; the eased ends shave a little off the total
  const lapLen = L.slice(0, 9).reduce((x, y) => x + y, 0), g = lapRise / lapLen, H = g * eff.reduce((x, y) => x + y, 0);
  pieces.forEach((pc, i) => {
    pc.rise = g * eff[i];
    pc.riseEase = i === 0 ? 'rampIn' : i === pieces.length - 1 ? 'rampOut' : 'linear';
    if (i === 0) pc.riseBlend = K3.entryBlend; if (i === pieces.length - 1) pc.riseBlend = K3.exitBlend;
    pc.tags = ['balcony', 'crossing_ok'];
  });
  // start: middle of the NE side, heading out along the arm
  const start = anchor(...armPt((a0 + a1) / 2, c1), Z, K3.wing);
  return { pieces, start, grade: g, lapLen, rise: H, rect: { a0, a1, c1, longS, shortS } };
}

export function recipe(v = {}) {
  const base = td03(v); const Z = B.roof + 0.3;
  const upTo = base.pieces.findIndex((p) => p.id === 'plaza_hairpin');
  const K = balcony(Z, v.balcony);
  const top = Z + K.rise, lip = 2, gap = 36, drop = 6, landLen = v.landLen ?? (v.balcony ? Math.round(110 * (top + lip - drop) / 23.4) : 110);
  const slim = { sideL: { to: 0.35 }, sideR: { to: 0.35 }, deckDepth: { to: 1.0 }, barrierH: { to: 0.9 }, barrierOuterTop: { to: 0.8 } };
  const full = { sideL: { to: 1 }, sideR: { to: 1 }, deckDepth: { to: 2.25 }, barrierH: { to: 1.35 }, barrierOuterTop: { to: 1.18 } };
  return {
    ...base, id: 'TD04_UNICENTER_CIRCUIT', label: 'Tokyo Drift · Uni-Center · S5 closed circuit v1', closed: true,
    pieces: [
      // TD03 up to the plaza hairpin; the drift ring becomes a designed crossing (the balcony's hub-end side passes over it)
      ...base.pieces.slice(0, upTo + 1).map((p) => (p.id === 'drift_ring' ? { ...p, tags: [...(p.tags ?? []), 'crossing_ok'] } : p)),
      // plaza -> yellow wing: back to STANDARD with slim balcony parapets, level at the roof
      { id: 'plaza_east', type: 'CONNECT', to: anchor(...(v.wp ?? [86, 40]), Z, v.wpHeading ?? 280), stretch: 1.0, bankDeg: 0, widthTo: 'STANDARD', params: slim },
      { id: 'to_balcony', type: 'CONNECT', to: K.start, stretch: 1.0, bankDeg: 0 },
      ...K.pieces,
      // finale: off the top lap along the NE side, past the wing tip, down to the street
      { id: 'k3_exit', type: 'STRAIGHT', length: v.exitLen ?? 4, tags: ['crossing_ok'] },
      { id: 'kicker', type: 'KICKER', length: 30, lipHeight: lip, lipDeg: 14, tags: ['crossing_ok'] },
      { id: 'air', type: 'AIR', gap, drop, tags: ['crossing_ok'] },
      { id: 'landing', type: 'LANDING', length: landLen, drop: top + lip - drop, tags: ['crossing_ok'] },
      // street return
      { id: 'street_back', type: 'WIDTH_STEP', length: 30, markings: 'STREET', params: full },
      { id: 'sweep_south', type: 'CURVE_EASE', turn: v.sweep ?? 150, radius: 40, ease: 16, bankDeg: 0 },
      { id: 'south_run', type: 'CONNECT', to: anchor(v.southX ?? 72.8, v.southY ?? -205, 0, 180), stretch: 1.0, bankDeg: 0 },
      { id: 'home_turn', type: 'CURVE_EASE', turn: 90, radius: v.homeR ?? 40, ease: 16, bankDeg: 0 },
      { id: 'to_start', type: 'CONNECT', to: base.start, stretch: 1.0, bankDeg: 0 },
    ],
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = recipe(); const A = compileRecipe(r);
  const K = balcony(B.roof + 0.3);
  console.log('balcony grade %', (100 * K.grade).toFixed(2), 'lap m', K.lapLen.toFixed(1), 'rise m', K.rise.toFixed(2), 'rect', JSON.stringify(K.rect));
  for (const j of A.joints) { const q = A.samples[Math.min(j.index, A.samples.length - 1)]; console.log(j.piece.padEnd(16), 's', q.s.toFixed(1).padStart(7), 'B', [q.p[0], -q.p[2], q.p[1]].map((x) => x.toFixed(1)).join(', ')); }
  const e = A.samples[A.samples.length - 1]; console.log('end B', [e.p[0], -e.p[2], e.p[1]].map((x) => x.toFixed(1)).join(', '), 'samples', A.samples.length, 'length', e.s.toFixed(1));
  for (const c of runChecks(A).results) console.log(c.pass ? 'ok  ' : 'FAIL', c.id.padEnd(18), c.value, c.note ?? '');
  fs.writeFileSync('out/td04.stream.json', JSON.stringify(A));
}
