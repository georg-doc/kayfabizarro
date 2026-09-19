import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { juggleTiming, clubState, handPulse } from '../lib/juggle-math.js';
import { RESIDENTS } from '../data/cast.js';

const eps = 1e-9;
const close = (a, b, e = eps) => assert.ok(Math.abs(a - b) <= e, `${a} != ${b}`);

const timing = juggleTiming({
  count: 3,
  apex: 0.85,
  gravity: 9.81,
  dwellBeats: 0.45,
  spinHalfTurns: 2
});

assert.equal(timing.count, 3);
assert.ok(timing.flightSec > 0);
assert.ok(timing.beatSec > 0);
assert.ok(timing.cycleSec > timing.flightSec);
assert.equal(timing.cycleBeats, 6);
close(handPulse(0, 'l', timing), 1);
close(handPulse(timing.beatSec, 'r', timing), 1);

assert.equal(clubState(0, 0, timing).from, 'l');
assert.equal(clubState(timing.beatSec, 1, timing).from, 'r');
assert.equal(clubState(timing.beatSec * 2, 2, timing).from, 'l');
assert.equal(clubState(timing.beatSec * 3, 0, timing).from, 'r');

for (let club = 0; club < 3; club++) {
  const a = clubState(0.137, club, timing);
  const b = clubState(0.137 + timing.cycleSec, club, timing);
  assert.equal(a.airborne, b.airborne);
  assert.equal(a.from, b.from);
  assert.equal(a.to, b.to);
  close(a.u, b.u, 1e-8);
  close(a.arc, b.arc, 1e-8);
  close(a.spin, b.spin, 1e-8);
}

const mid = clubState((timing.flightBeats * 0.5) * timing.beatSec, 0, timing);
assert.equal(mid.airborne, true);
close(mid.arc, 1, 1e-8);
close(mid.spin, Math.PI, 1e-8);

assert.throws(() => juggleTiming({ count: 6 }), /exactly 3 clubs/);
assert.throws(() => juggleTiming({ count: 3, spinHalfTurns: 1.5 }), /integer/);

const clown = RESIDENTS.find((r) => r.residentId === 'clown');
assert.ok(clown, 'clown recipe');
assert.equal(clown.actor.rig, 'Rig_Medium');
assert.equal(clown.actor.poseFreeze, true);
assert.deepEqual(clown.juggle.props, ['pin_blue', 'pin_green', 'pin_red']);
assert.equal(clown.juggle.spinHalfTurns, 2);
for (const id of clown.juggle.props) assert.ok(clown.signatureProps.some((p) => p.id === id), id);

const manifestUrl = new URL('../../resident_atlas/modules/clown-juggling-island.module.json', import.meta.url);
const manifest = JSON.parse(await fs.readFile(manifestUrl, 'utf8'));
assert.equal(manifest.schema, 'kfb.resident-scene-module/1');
assert.equal(manifest.source.residentId, 'clown');
assert.equal(manifest.activity.count, 3);
assert.equal(manifest.support.owner, 'consumer');
assert.equal(manifest.support.collisionOwnedByConsumer, true);
assert.deepEqual(manifest.support.minFlatFootprintCells, [4, 4]);

console.log(JSON.stringify({
  ok: true,
  beatSec: +timing.beatSec.toFixed(4),
  cycleSec: +timing.cycleSec.toFixed(4),
  throwsPerMinute: +(60 / timing.beatSec).toFixed(1),
  resident: clown.residentId,
  module: manifest.id
}, null, 2));
