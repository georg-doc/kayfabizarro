/* Pure timing/state math for the Resident Atlas clown cascade.
   No Three.js dependency: deterministic and unit-testable.

   Contract v1 deliberately supports the 3-club cascade only. The Atlas brief says three
   clubs are geometrically safe; 6 must be collision-checked before promotion. */

export function mod(n, d) {
  return ((n % d) + d) % d;
}

export function juggleTiming(opts = {}) {
  const count = opts.count ?? 3;
  if (count !== 3) throw new Error('juggle-cascade-v1 supports exactly 3 clubs; larger counts need collision proof');
  const apex = opts.apex ?? 0.85;
  const gravity = opts.gravity ?? 9.81;
  const dwellBeats = opts.dwellBeats ?? 0.45;
  const spinHalfTurns = opts.spinHalfTurns ?? 2;
  if (!(apex > 0) || !(gravity > 0)) throw new Error('apex and gravity must be positive');
  if (!(dwellBeats >= 0 && dwellBeats < count)) throw new Error('dwellBeats must be >=0 and < club count');
  if (!Number.isInteger(spinHalfTurns)) throw new Error('spinHalfTurns must be an integer so catch orientation closes');

  /* Symmetric ballistic flight: h = g*T²/8. A given apex therefore owns the timing.
     One club is thrown again three beats later; dwell occupies the remainder. */
  const flightSec = Math.sqrt((8 * apex) / gravity);
  const flightBeats = count - dwellBeats;
  const beatSec = flightSec / flightBeats;
  const cycleBeats = count * 2; // L→R and R→L before the whole state repeats
  const cycleSec = beatSec * cycleBeats;
  return { count, apex, gravity, dwellBeats, spinHalfTurns, flightSec, flightBeats, beatSec, cycleBeats, cycleSec };
}

export function clubState(t, clubIndex, timing) {
  const beat = t / timing.beatSec;
  const phase = mod(beat - clubIndex, timing.cycleBeats);
  const secondHalf = phase >= timing.count;
  const within = secondHalf ? phase - timing.count : phase;
  const from = secondHalf ? 'r' : 'l';
  const to = secondHalf ? 'l' : 'r';

  if (within < timing.flightBeats) {
    const u = within / timing.flightBeats;
    return {
      airborne: true,
      from, to, u,
      arc: 4 * u * (1 - u),
      spin: timing.spinHalfTurns * Math.PI * u
    };
  }
  return {
    airborne: false,
    from: to,
    to,
    u: 1,
    arc: 0,
    spin: timing.spinHalfTurns * Math.PI
  };
}

export function handPulse(t, side, timing, windowBeats = 0.42) {
  /* Throws alternate every beat: left on even beats, right on odd beats.
     Distance to the nearest same-hand event is measured on a 2-beat cycle. */
  const parity = side === 'r' ? 1 : 0;
  const p = mod(t / timing.beatSec - parity, 2);
  const dist = Math.min(p, 2 - p);
  if (dist >= windowBeats) return 0;
  const x = 1 - dist / windowBeats;
  return x * x * (3 - 2 * x); // smoothstep pulse, exactly 1 at throw/catch event
}
