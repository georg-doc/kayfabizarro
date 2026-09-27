// TD03 · Tokyo Drift at the Uni-Center · route authored in Blender plan coordinates (hub centre = origin, z up),
// converted to the runtime frame. Anchors = building sockets (helix hole, roof ring, orange arm, yellow wing).
import fs from 'node:fs';
import { compileRecipe, runChecks } from '../track-core.mjs';
export const B = { hub_r: 68, hole_r: 36, core_r: 13, arm_w: 28, arm_len: 50, arms: { orange: 90, green: 210, yellow: 330 }, podium_h: 5, levels: 3, wing_decks: 6, wing_h: 6 };
B.D0 = Math.sqrt(B.hub_r ** 2 - (B.arm_w / 2) ** 2); B.roof = B.levels * B.podium_h;
export const rt = ([x, y, z]) => [x, z, -y];                                    // Blender (x, y, z-up) -> runtime (x, y-up, z)
export const psiOf = (h) => Math.atan2(-Math.cos(h * Math.PI / 180), -Math.sin(h * Math.PI / 180)) * 180 / Math.PI; // Blender heading deg -> runtime psi deg
export const anchor = (x, y, z, h, grade = 0) => ({ p: rt([x, y, z]), headingDeg: psiOf(h), grade });
const ring = (a, r, z) => [r * Math.cos(a * Math.PI / 180), r * Math.sin(a * Math.PI / 180), z];

export function recipe(v = {}) {
  const Z = B.roof + 0.3, RR = v.rRing ?? 52, RH = v.rHelix ?? 24.5;
  return {
    schema: 'kfb.route-recipe/0.1-draft', id: 'TD03_UNICENTER_DRIFT', label: 'Tokyo Drift · Uni-Center · S3 showcase v1',
    units: 'metres, degrees; runtime frame; authored from Blender plan anchors (layout/td03.mjs)',
    start: { p: rt([RH, -140, 0]), headingDeg: psiOf(90) },
    defaults: { widthClass: 'STANDARD', markings: 'STREET' },
    pieces: [
      // K1 street -> parking helix in the atrium: 3 turns, 15 m, slim parking parapets, flat
      { id: 'street_in', type: 'STRAIGHT', length: 107 },  // helix clothoid ease (6 m) shifts its centre 3 m ahead -> start 3 m earlier
      { id: 'park_in', type: 'WIDTH_STEP', length: 30, tags: ['parkdeck', 'crossing_ok'],
        params: { sideL: { to: 0.35 }, sideR: { to: 0.35 }, deckDepth: { to: 1.0 }, barrierH: { to: 0.9 }, barrierOuterTop: { to: 0.8 } } },
      // three turns, one flight per parking level: each flight levels out at its floor (5 / 10 / 15 m), like a car park
      { id: 'helix', type: 'SPIRAL', turn: -1080, radius: RH, rise: Z, riseEase: 'ramp', riseBlend: 0.3, riseSteps: 3, ease: 6, bankDeg: 0,
        tags: ['parkdeck', 'crossing_ok'] },
      { id: 'atrium_up', type: 'STRAIGHT', length: 18, markings: 'TRACK', params: { barrierH: { to: 1.35 }, barrierOuterTop: { to: 1.18 } } },
      { id: 'roof_hairpin', type: 'HAIRPIN_180', dir: 1, radius: (RR - RH) / 2, ease: 6, bankDeg: 0 },
      { id: 'to_ring', type: 'CONNECT', to: anchor(RR, 0, Z, -90), bankDeg: 0 },
      { id: 'drift_ring', type: 'CURVE_EASE', turn: v.ringTurn ?? 210, radius: RR, ease: 16, bankDeg: 0, tags: ['drift'],
        widthTo: 'WIDE', widthZone: [0, 0.25], params: { sideL: { to: 0.6, zone: [0, 0.25] }, sideR: { to: 0.6, zone: [0, 0.25] } } },
      // over to the orange arm, big roof loop pointing out over the plaza
      { id: 'to_orange', type: 'CONNECT', to: anchor(0, B.D0 + 8, Z, 90), stretch: 1.0, bankDeg: 0,
        widthTo: 'STANDARD', params: { sideL: { to: 0.3 }, sideR: { to: 0.3 }, deckDepth: { to: 1.0 } } },
      { id: 'mag_in', type: 'STRAIGHT', length: 14, markings: 'MAG' },
      { id: 'roof_loop', type: 'LOOP', height: v.loopH ?? 26, side: 1 },
      { id: 'loop_out', type: 'STRAIGHT', length: 20, markings: 'TRACK' },
      { id: 'plaza_hairpin', type: 'HAIRPIN_180', dir: 1, radius: 22, ease: 12, widthTo: 'WIDE', bankDeg: 0, tags: ['drift'] },
      { id: 'east_run', type: 'CONNECT', to: anchor(80, 45, Z, -90), stretch: 1.0, bankDeg: 0 },
      { id: 'turn_east', type: 'CURVE_EASE', turn: -90, radius: 30, bankDeg: 0 },
      // finale: jump off the elevated run down to the street, exit east
      { id: 'std_jump', type: 'WIDTH_STEP', length: 20, widthTo: 'STANDARD', params: { sideL: { to: 1 }, sideR: { to: 1 }, deckDepth: { to: 2.25 } } },
      { id: 'kicker', type: 'KICKER', length: 30, lipHeight: 2, lipDeg: 14 },
      { id: 'air', type: 'AIR', gap: 30, drop: 3 },
      { id: 'landing', type: 'LANDING', length: 60, drop: Z + 2 - 3 },
      { id: 'street_out', type: 'STRAIGHT', length: 40, markings: 'STREET' },
    ],
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = recipe(); const A = compileRecipe(r);
  for (const j of A.joints) { const q = A.samples[Math.min(j.index, A.samples.length - 1)]; console.log(j.piece.padEnd(12), 's', q.s.toFixed(1).padStart(7), 'B', [q.p[0], -q.p[2], q.p[1]].map((v) => v.toFixed(1)).join(', ')); }
  const e = A.samples[A.samples.length - 1]; console.log('end B', [e.p[0], -e.p[2], e.p[1]].map((v) => v.toFixed(1)).join(', '));
  for (const c of runChecks(A).results) if (!c.pass) console.log('FAIL', c.id, c.value, c.note ?? '');
  fs.writeFileSync('out/td03.stream.json', JSON.stringify(A));
}
