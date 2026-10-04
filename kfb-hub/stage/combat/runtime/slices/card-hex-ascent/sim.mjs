// Card-Hex Ascent · deterministic Chill & Fun ascent simulation (harness evidence, not a gate).
// Drives the REAL PlayerController + SupportGraph with human-equivalent input: a direction and a jump key.
import { SupportGraph } from './support.mjs';
import { PlayerController } from './player.mjs';
import { buildSupports, INCREMENTS } from './route.mjs';

export function simulateAscent({ seed = 0, inc = 'S3', maxSeconds = 150, sprint = false, noise = 0.05 } = {}) {
  const g = new SupportGraph(); buildSupports(g, inc);
  const p = new PlayerController(g, { spawn: { x: 0, y: 0, z: 0 } });
  const routeIds = [...new Set(g.items.filter(s => s.route >= 0).sort((a, b) => a.route - b.route).map(s => s.islet || s.id))];
  const goalId = INCREMENTS[inc].finale;
  let r = (seed * 2654435761) >>> 0 || 7; const rand = () => { r ^= r << 13; r >>>= 0; r ^= r >> 17; r ^= r << 5; r >>>= 0; return r / 4294967296; };
  const log = []; let t = 0; const dt = 1 / 60; let goalIdx = 1; let jumpDelay = -1; const misses = [];
  const curIdx = () => { const s = p.support; return s ? routeIds.indexOf(s.islet || s.id) : -1; };
  for (let step = 0; step < maxSeconds * 60; step++) {
    t += dt; const ci = curIdx(); if (ci >= 0) goalIdx = Math.max(goalIdx, ci + 1);
    const goal = routeIds[goalIdx]; if (!goal) break;
    let best = null, bd = 1e9; for (const s of g.items) if ((s.islet || s.id) === goal) { const d = Math.hypot(s.x - p.pos.x, s.z - p.pos.z); if (d < bd) { bd = d; best = s; } }
    let ix = best.x - p.pos.x, iz = best.z - p.pos.z; const l = Math.hypot(ix, iz) || 1; ix /= l; iz /= l;
    const a = (rand() - 0.5) * 2 * noise; const cx = ix * Math.cos(a) - iz * Math.sin(a), cz = ix * Math.sin(a) + iz * Math.cos(a);
    const near = p.grounded && p.support && (p.edgeHold || g.edgeDistance(p.support, p.pos.x, p.pos.z) > -(0.45 + rand() * 0.5)) && p.state !== 'ANTICIPATE' && (p.support.islet || p.support.id) !== goal;
    let jump = false; if (near) { if (jumpDelay < 0) jumpDelay = rand() * 0.15; jumpDelay -= dt; if (jumpDelay <= 0) { jump = true; jumpDelay = -1; } } else jumpDelay = -1;
    p.update(dt, { x: cx, z: cz, jump, sprint }, t);
    for (const e of p.drainEvents()) {
      if (e.type === 'land' && e.jump.hitTarget === false) misses.push(`${e.jump.kind}:${e.jump.target}→${e.support}`);
      if (e.type === 'rescueStart') log.push(`RESCUE→${e.to.id} (goal ${goal})`);
    }
    if (p.support?.id === goalId) { log.push('GOAL'); break; }
  }
  return { seed, goal: p.support?.id === goalId, seconds: +t.toFixed(1), stats: { ...p.stats }, misses: misses.slice(0, 6), log: log.slice(0, 8), reached: p.support?.islet || p.support?.id };
}

export function batch(n = 20, opts = {}) {
  const runs = []; for (let s = 0; s < n; s++) runs.push(simulateAscent({ ...opts, seed: s + 1, sprint: s % 4 === 3 }));
  return { n, goals: runs.filter(x => x.goal).length, rescues: runs.reduce((a, x) => a + x.stats.rescues, 0), mean: +(runs.reduce((a, x) => a + x.seconds, 0) / n).toFixed(1), runs };
}
