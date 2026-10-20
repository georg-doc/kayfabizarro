/* KFB · RESIDENT-COLLIDE-01 · weiche Körperkollision, Standard für Residents und Mobs
   Keine three.js-Abhängigkeit: alles in Welt-xz, der Host liest Versatz und Neigung und hängt
   sie an eine eigene Zwischengruppe (nie an Bones, nie an die Platzierung).

   makeCrowd  · Tänzer, Ensemble: Körper haben ein Zuhause (die Platzierung). Überlappen zwei
                Körper, werden beide auseinandergeschubst — Impuls + Neigung weg vom Kontakt —
                und federn danach nach Hause zurück. Ergebnis: sie „klicken sich weg", statt
                ineinander zu stecken. Statische Hindernisse (Boxen, Radio, Grabsteine) geben nicht nach.
   makeWalker · Mobs: laufen geradeaus mit leichtem Schlendern. Treffen sie ein Hindernis oder
                einander, prallen sie zurück (Rückstoß + Taumeln), drehen weg — gespiegelt an der
                Kontaktnormalen plus Zufallswinkel — und laufen weiter.

   Zufall ist geseedet (mulberry32), damit ein Lauf wiederholbar ist. */
export const SCHEMA = 'kfb.resident-collide/1';
export const CROWD_DEFAULTS = { stiffness: 12, damping: 5, bounce: 7, restitution: 0.4, correct: 0.55, maxOffset: 0.9, lean: 14, leanMax: 16, leanDecay: 5 };
export const WALKER_DEFAULTS = { speed: 1, r: 0.4, wander: 25, turnJitter: 40, recoil: 0.4, knock: 1.8, lean: 18 };

export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const at = (c) => (typeof c === 'function' ? c() : c);
const len = (x, z) => Math.hypot(x, z);

export function makeCrowd(opts = {}) {
  const C = { ...CROWD_DEFAULTS, ...opts };
  const bodies = new Map(), obstacles = new Map();
  const touching = new Set();
  const stat = { contacts: 0, hits: 0, maxPen: 0 };
  const api = {
    cfg: C, bodies, obstacles, stat,
    add(id, { r, m = 1, center }) { bodies.set(id, { id, r, m, center, off: [0, 0], vel: [0, 0], lean: [0, 0], kick: 0 }); return api; },
    obstacle(id, { r, center }) { obstacles.set(id, { id, r, center }); return api; },
    reset() { for (const b of bodies.values()) { b.off = [0, 0]; b.vel = [0, 0]; b.lean = [0, 0]; b.kick = 0; } touching.clear(); stat.contacts = 0; stat.maxPen = 0; },
    get: (id) => bodies.get(id),
    step(dt) {
      if (!(dt > 0)) return stat;
      dt = Math.min(dt, 1 / 20);
      const B = [...bodies.values()], cs = B.map((b) => at(b.center));
      const acc = B.map((b) => [-C.stiffness * b.off[0] - C.damping * b.vel[0], -C.stiffness * b.off[1] - C.damping * b.vel[1]]);
      const now = new Set();
      stat.contacts = 0; stat.maxPen = 0;
      const hit = (bi, ci, cj, rj, wi, key, other) => {
        let dx = ci[0] - cj[0], dz = ci[1] - cj[1], d = len(dx, dz);
        const pen = bi.r + rj - d;
        if (pen <= 0) return null;
        if (d < 1e-5) { dx = 1; dz = 0; d = 1; }
        const nx = dx / d, nz = dz / d;
        stat.contacts++; stat.maxPen = Math.max(stat.maxPen, pen);
        now.add(key); if (!touching.has(key)) stat.hits++;
        bi.off[0] += nx * pen * C.correct * wi; bi.off[1] += nz * pen * C.correct * wi;
        const into = -(bi.vel[0] - (other ? other.vel[0] : 0)) * nx - (bi.vel[1] - (other ? other.vel[1] : 0)) * nz;
        const j = (C.bounce * pen + Math.max(0, into) * (1 + C.restitution)) * wi;
        bi.vel[0] += nx * j; bi.vel[1] += nz * j;
        bi.lean[0] += nx * pen * C.lean * wi * 2; bi.lean[1] += nz * pen * C.lean * wi * 2;
        bi.kick = Math.max(bi.kick, Math.min(1, pen / bi.r));
        return [nx, nz];
      };
      for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
        const a = B[i], b = B[j], wa = b.m / (a.m + b.m), wb = a.m / (a.m + b.m), key = a.id + '|' + b.id;
        const va = [...a.vel];
        if (hit(a, cs[i], cs[j], b.r, wa, key, b)) hit(b, cs[j], cs[i], a.r, wb, key + '~', { vel: va });
      }
      for (const o of obstacles.values()) {
        const oc = at(o.center);
        for (let i = 0; i < B.length; i++) hit(B[i], cs[i], oc, o.r, 1, B[i].id + '#' + o.id, null);
      }
      touching.clear(); for (const k of now) touching.add(k);
      const decay = Math.exp(-C.leanDecay * dt);
      B.forEach((b, i) => {
        b.vel[0] += acc[i][0] * dt; b.vel[1] += acc[i][1] * dt;
        b.off[0] += b.vel[0] * dt; b.off[1] += b.vel[1] * dt;
        const L = len(b.off[0], b.off[1]);
        if (L > C.maxOffset) { b.off[0] *= C.maxOffset / L; b.off[1] *= C.maxOffset / L; }
        b.lean[0] *= decay; b.lean[1] *= decay; b.kick *= decay;
        const T = len(b.lean[0], b.lean[1]);
        if (T > C.leanMax) { b.lean[0] *= C.leanMax / T; b.lean[1] *= C.leanMax / T; }
      });
      return stat;
    }
  };
  return api;
}

/* ---- Mobs ---- */
export function makeWalker(o = {}) {
  const W = { ...WALKER_DEFAULTS, ...o };
  return { id: W.id, x: W.x || 0, z: W.z || 0, heading: W.heading || 0, cfg: W, state: 'walk', t: 0, vel: [0, 0], lean: [0, 0], bumps: 0 };
}
/* heading in Grad, 0 = +z. world: { obstacles:[{r, center}], walkers:[…], bounds:{min:[x,z],max:[x,z]}, rnd } */
export function stepWalker(w, dt, world = {}) {
  if (!(dt > 0)) return w;
  dt = Math.min(dt, 1 / 20);
  const W = w.cfg, rnd = world.rnd || Math.random, D = Math.PI / 180;
  const decay = Math.exp(-6 * dt);
  if (w.state === 'walk') {
    w.heading += (rnd() - 0.5) * W.wander * dt * 2;
    w.x += Math.sin(w.heading * D) * W.speed * dt; w.z += Math.cos(w.heading * D) * W.speed * dt;
  } else {
    w.x += w.vel[0] * dt; w.z += w.vel[1] * dt; w.vel[0] *= decay; w.vel[1] *= decay;
    if ((w.t -= dt) <= 0) w.state = 'walk';
  }
  w.lean[0] *= decay; w.lean[1] *= decay;
  const bump = (nx, nz, pen) => {
    w.x += nx * pen; w.z += nz * pen;
    if (w.state === 'recoil') return;
    const fx = Math.sin(w.heading * D), fz = Math.cos(w.heading * D), dot = fx * nx + fz * nz;
    const rx = fx - 2 * dot * nx, rz = fz - 2 * dot * nz;
    w.heading = Math.atan2(rx, rz) / D + (rnd() - 0.5) * 2 * W.turnJitter;
    w.state = 'recoil'; w.t = W.recoil; w.vel = [nx * W.knock, nz * W.knock];
    w.lean = [nx * W.lean, nz * W.lean]; w.bumps++;
  };
  const test = (cx, cz, r) => { let dx = w.x - cx, dz = w.z - cz, d = len(dx, dz); const pen = W.r + r - d; if (pen > 0) { if (d < 1e-5) { dx = 1; dz = 0; d = 1; } bump(dx / d, dz / d, pen); } };
  for (const o of world.obstacles || []) { const c = at(o.center); test(c[0], c[1], o.r); }
  for (const v of world.walkers || []) if (v !== w) test(v.x, v.z, v.cfg.r);
  const b = world.bounds;
  if (b) {
    if (w.x < b.min[0] + W.r) bump(1, 0, b.min[0] + W.r - w.x); else if (w.x > b.max[0] - W.r) bump(-1, 0, w.x - (b.max[0] - W.r));
    if (w.z < b.min[1] + W.r) bump(0, 1, b.min[1] + W.r - w.z); else if (w.z > b.max[1] - W.r) bump(0, -1, w.z - (b.max[1] - W.r));
  }
  return w;
}
