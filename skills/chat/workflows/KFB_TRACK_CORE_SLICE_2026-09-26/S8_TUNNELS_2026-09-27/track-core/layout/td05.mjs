// TD05 · Tokyo Drift at the Uni-Center · closed circuit with the TWISTED balcony (Georg 27.09): the laps are no longer
// parallel floors. Every corner tilts on its own (banked into the turn, or off-camber outwards) and bends up or down,
// the straights between them twist from one corner's tilt to the next. Cartoon deformation as a design motif, not
// extreme; and it gives real driving physics: banked corners carry speed, off-camber ones make the car slide wide.
// More floor spacing (9 m per lap instead of 6) so a raised corner never sits on the lap above.
// Everything else = TD04 (layout/td04.mjs).
import fs from 'node:fs';
import { compileRecipe, runChecks } from '../track-core.mjs';
import { recipe as td04, balcony, K3 } from './td04.mjs';
import { B } from './td03.mjs';

// corner order per lap: tip-north, tip-south, hub-south, hub-north. bank > 0 = into the (right) turn, < 0 = off-camber.
export const TWIST = {
  lapRise: 9,          // floors 9 m apart (TD04: 6), so a lifted corner never meets the lap above
  ease: 10,            // longer clothoids: plan and vertical bend build up together without a kink
  corners: [
    { bank: 18, bump: 1.2 },   // lap 1 · tip N: banked and lifted, the corner "rears up"
    { bank: -6, bump: -0.5 },  // lap 1 · tip S: off-camber, dips: the car drifts wide
    { bank: 12, bump: 0.8 },
    { bank: 20, bump: 0.0 },   // lap 1 · hub N: steepest bank, fast
    { bank: -6, bump: -0.4 },  // lap 2 · tip N: the corner that reared up on lap 1 now leans out
    { bank: 16, bump: 1.2 },
    { bank: -4, bump: 0.5 },
    { bank: 14, bump: -0.4 },
  ],
};

export function recipe(v = {}) {
  const r = td04({ ...v, balcony: v.balcony ?? TWIST });
  return { ...r, id: 'TD05_UNICENTER_TWIST', label: 'Tokyo Drift · Uni-Center · S6 twisted balcony circuit v1' };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const A = compileRecipe(recipe());
  const K = balcony(B.roof + 0.3, TWIST);
  console.log('balcony grade %', (100 * K.grade).toFixed(2), 'lap m', K.lapLen.toFixed(1), 'rise m', K.rise.toFixed(2));
  const bal = A.samples.filter((q) => q.tags.includes('balcony'));
  console.log('bank range deg', Math.min(...bal.map((q) => q.bank)) * 180 / Math.PI, Math.max(...bal.map((q) => q.bank)) * 180 / Math.PI);
  for (const c of runChecks(A).results) console.log(c.pass ? 'ok  ' : 'FAIL', c.id.padEnd(18), c.value, c.note ?? '');
  fs.writeFileSync('out/td05.stream.json', JSON.stringify(A));
}
