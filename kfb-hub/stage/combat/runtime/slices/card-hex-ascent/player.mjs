// Card-Hex Ascent · Player movement owner (the ONLY writer of player world position).
// Physics owns trajectory and contact; animation only presents the semantic traversal state.
// Pure logic (no three.js) — node-testable.
import { JUMP, chooseTarget, classifyJump, takeoffVelocity, magnetAccel, apexSingle } from './assist.mjs';
import { PLAYER_RADIUS } from './support.mjs';

export const TRAVERSAL = Object.freeze(['MOVE', 'ANTICIPATE', 'TAKEOFF', 'AIRBORNE', 'DOUBLE_IMPULSE', 'LAND_CONTACT', 'COMPRESSION', 'RECOVERY', 'RESCUE']);
const ANTICIPATE_S = 0.07;   // pre-takeoff crouch, hidden inside the jump buffer feel
const COMPRESSION_S = 0.10;
const RECOVERY_S = 0.18;
const SAFE_DWELL_S = 0.25;
const SAFE_INSET = 0.45;

export class PlayerController {
  constructor(graph, opts = {}) {
    this.graph = graph; this.J = opts.jump ?? JUMP; this.mode = opts.mode ?? 'chill';
    this.events = []; this.stats = { jumps: 0, assisted: 0, doubles: 0, longs: 0, landings: 0, rescues: 0 };
    this.reset(opts.spawn ?? { x: 0, y: 0, z: 0 }, opts.yaw ?? 0);
  }
  reset(spawn, yaw = 0) {
    this.pos = { x: spawn.x, y: spawn.y, z: spawn.z };
    this.vel = { x: 0, y: 0, z: 0 };
    this.yaw = yaw; this.speed = 0;
    this.grounded = true; this.support = this.graph.groundAt(spawn.x, spawn.z, spawn.y + 0.05);
    if (this.support) this.pos.y = this.support.top;
    this.coyote = 0; this.buffer = 0; this.jumpsUsed = 0;
    this.state = 'MOVE'; this.stateT = 0; this.plan = null; this.pendingTakeoff = null;
    this.lastSafe = { x: this.pos.x, y: this.pos.y, z: this.pos.z, id: this.support?.id ?? null };
    this.safeDwell = 0; this.lastJumpTrace = null; this.trace = null; this.locked = false; this.dodgeT = 0;
    this.rescueY = this.graph.lowestTop() - 9;
    this.preview = null;
  }
  // facing request from the combat owner (aim/fire); the controller stays the only yaw writer
  face(yaw, maxStep = Infinity) { this.yaw = turnToward(this.yaw, yaw, maxStep); }
  emit(type, data = {}) { this.events.push({ type, t: this.time ?? 0, ...data }); }
  drainEvents() { const e = this.events; this.events = []; return e; }
  setState(s) { if (this.state !== s) { this.state = s; this.stateT = 0; } }

  // input: {x,z} world-space intent (|v|≤1), sprint, walk, jump (edge), dodge (edge)
  update(dt, input, time = 0) {
    this.time = time; this.stateT += dt;
    const J = this.J, g = J.gravity;
    if (input.jump) this.buffer = J.buffer; else this.buffer = Math.max(0, this.buffer - dt);
    const ix = this.locked ? 0 : input.x || 0, iz = this.locked ? 0 : input.z || 0;
    const mag = Math.min(1, Math.hypot(ix, iz));

    // Intent preview (subtle Chill & Fun highlight) while grounded.
    this.preview = null;
    if (this.mode === 'chill' && this.grounded && !this.locked) {
      const dir = mag > 0.2 ? { x: ix, z: iz } : { x: Math.sin(this.yaw), z: Math.cos(this.yaw) };
      this.preview = chooseTarget(this.graph, this.pos, dir, this.support?.id, J, this.support?.route ?? -1, this.speed);
    }

    if (this.state === 'RESCUE') { this.vel.x = this.vel.z = 0; if (this.stateT > 0.45) this.finishRescue(); return; }

    // Dodge: short authored KayKit roll (0.4 s); controller owns displacement.
    if (input.dodge && this.grounded && this.dodgeT <= 0 && !this.locked) {
      const dx = mag > 0.2 ? ix / mag : Math.sin(this.yaw), dz = mag > 0.2 ? iz / mag : Math.cos(this.yaw);
      this.dodgeT = 0.4; this.dodgeDir = { x: dx, z: dz }; this.emit('dodge', { dir: this.dodgeDir });
    }

    if (this.grounded) {
      if (this.dodgeT > 0) {
        this.dodgeT -= dt; const sp = 1.25 / 0.4;
        this.vel.x = this.dodgeDir.x * sp; this.vel.z = this.dodgeDir.z * sp;
      } else {
        const target = mag < 0.05 ? 0 : (input.walk ? 0.98 : input.sprint ? J.sprintSpeed : J.runSpeed) * (input.walk ? 1 : Math.max(0.35, mag));
        const acc = target > this.speed ? 14 : 18;
        this.speed += Math.sign(target - this.speed) * Math.min(Math.abs(target - this.speed), acc * dt);
        if (mag > 0.05) { const want = Math.atan2(ix, iz); this.yaw = turnToward(this.yaw, want, 12 * dt); }
        this.vel.x = Math.sin(this.yaw) * this.speed; this.vel.z = Math.cos(this.yaw) * this.speed;
      }
      if (this.state === 'COMPRESSION' && this.stateT > COMPRESSION_S) this.setState('RECOVERY');
      if (this.state === 'RECOVERY' && this.stateT > RECOVERY_S) this.setState('MOVE');
      if (this.state === 'ANTICIPATE') { if (this.stateT >= ANTICIPATE_S) this.takeoff(); }
      else if (this.buffer > 0 && !this.locked) this.beginJump(ix, iz, mag);
    } else {
      this.coyote = Math.max(0, this.coyote - dt);
      // manual double jump (planned doubles fire automatically at their apex)
      if (this.buffer > 0 && this.jumpsUsed < 2 && !this.plan?.double && this.coyote <= 0) {
        this.buffer = 0; this.jumpsUsed = 2; this.vel.y = J.v2; this.stats.doubles++;
        this.setState('DOUBLE_IMPULSE'); this.emit('double', { planned: false });
      } else if (this.buffer > 0 && this.coyote > 0 && this.jumpsUsed === 0) {
        this.beginJump(ix, iz, mag, true);
      }
      if (this.plan?.double && !this.plan.impulseDone && this.stateT + 1e-6 >= 0 && (time - this.plan.t0) >= this.plan.impulseAt) {
        this.plan.impulseDone = true; this.vel.y = J.v2; this.jumpsUsed = 2; this.stats.doubles++;
        this.setState('DOUBLE_IMPULSE'); this.emit('double', { planned: true });
      }
      if (this.state === 'DOUBLE_IMPULSE' && this.stateT > 0.12) this.setState('AIRBORNE');
      if (this.state === 'TAKEOFF' && this.stateT > 0.1) this.setState('AIRBORNE');
      // air control: bounded steering when no computed arc is active
      if (!this.plan && mag > 0.05) {
        const ax = ix * 9, az = iz * 9; this.vel.x += ax * dt; this.vel.z += az * dt;
        const hv = Math.hypot(this.vel.x, this.vel.z), cap = Math.max(J.runSpeed * 1.1, this.airCap ?? 0);
        if (hv > cap) { this.vel.x *= cap / hv; this.vel.z *= cap / hv; }
        this.yaw = turnToward(this.yaw, Math.atan2(ix, iz), 5 * dt);
      }
      const m = magnetAccel(this.plan, this.pos, this.vel.y, J);
      if (m) { this.vel.x += m.x * dt; this.vel.z += m.z * dt; this.plan.magnetUsed = true; }
      this.vel.y -= g * dt;
    }

    // Chill & Fun edge protection (Babel mechanism): never walk off into a fall; slide along the edge instead.
    if (this.grounded && (this.mode === 'chill' || this.state === 'ANTICIPATE') && this.support) {
      const nx = this.pos.x + this.vel.x * dt, nz = this.pos.z + this.vel.z * dt;
      const safe = (x, z) => { const s = this.graph.groundAt(x, z, this.pos.y + 0.02); return s && s.top >= this.pos.y - 1.25; };
      if (!safe(nx, nz)) {
        if (safe(nx, this.pos.z)) this.vel.z = 0; else if (safe(this.pos.x, nz)) this.vel.x = 0; else { this.vel.x = 0; this.vel.z = 0; }
        this.edgeHold = true;
      } else this.edgeHold = false;
    }
    // integrate
    const prevY = this.pos.y;
    this.pos.x += this.vel.x * dt; this.pos.z += this.vel.z * dt;
    if (!this.grounded) this.pos.y += this.vel.y * dt;
    this.graph.resolveSides(this.pos, this.pos.y, 2.2, PLAYER_RADIUS);
    // body blockers (actors) supplied by the integrator: circles {x,z,r,y}
    if (this.obstacles) for (const o of this.obstacles()) {
      if (Math.abs(o.y - this.pos.y) > 1.8) continue;
      const dx = this.pos.x - o.x, dz = this.pos.z - o.z, d = Math.hypot(dx, dz), m = o.r + PLAYER_RADIUS;
      if (d < m && d > 1e-4) { this.pos.x = o.x + dx / d * m; this.pos.z = o.z + dz / d * m; }
    }
    if (this.trace) this.trace.push([+this.pos.x.toFixed(3), +this.pos.y.toFixed(3), +this.pos.z.toFixed(3)]);

    if (this.grounded) {
      const s = this.graph.groundAt(this.pos.x, this.pos.z, this.pos.y + 0.02);
      if (s && s.top >= this.pos.y - 0.36) {
        this.pos.y = s.top; this.support = s;
        // last verified safe support (well inside the edge, after a short dwell)
        if (this.graph.contains(s, this.pos.x, this.pos.z, SAFE_INSET)) {
          this.safeDwell += dt;
          if (this.safeDwell > SAFE_DWELL_S && s.safe !== false) this.lastSafe = { x: this.pos.x, y: s.top, z: this.pos.z, id: s.id };
        } else this.safeDwell = 0;
      } else {
        if (this.pendingTakeoff) { this.takeoff(); return; } // slid off during anticipation: launch now
        // walked off an edge: coyote window starts
        this.grounded = false; this.support = null; this.coyote = J.coyote; this.vel.y = 0; this.jumpsUsed = 0;
        this.setState('AIRBORNE'); this.emit('leaveEdge');
      }
    } else if (this.vel.y <= 0) {
      const s = this.graph.landingBetween(this.pos.x, this.pos.z, prevY, this.pos.y);
      if (s) this.land(s);
    }
    if (!this.grounded && this.pos.y < this.rescueY) this.beginRescue();
  }

  beginJump(ix, iz, mag, fromCoyote = false) {
    this.buffer = 0;
    let plan = null;
    if (this.mode === 'chill') {
      const dir = mag > 0.2 ? { x: ix, z: iz } : { x: Math.sin(this.yaw), z: Math.cos(this.yaw) };
      plan = chooseTarget(this.graph, this.pos, dir, this.support?.id, this.J, this.support?.route ?? -1, this.speed);
      if (!plan && this.support) { // targetless jump returns to its own support (Babel: steer home)
        const hx = this.pos.x + dir.x * Math.min(1.2, this.speed * 0.6), hz = this.pos.z + dir.z * Math.min(1.2, this.speed * 0.6);
        const p = this.graph.landingPoint(this.support, hx, hz, 0.5); const d = Math.hypot(p.x - this.pos.x, p.z - this.pos.z);
        const T = (2 * this.J.v0) / this.J.gravity; plan = { support: this.support, point: p, d, dy: 0, T, vh: d / T, kind: 'hop', score: 0 };
      }
    }
    this.pendingTakeoff = { plan, fromCoyote };
    if (fromCoyote) { this.takeoff(); return; }
    this.setState('ANTICIPATE'); this.emit('anticipate', { plan: plan ? planFacts(plan) : null });
  }
  takeoff() {
    let { plan } = this.pendingTakeoff ?? {}; this.pendingTakeoff = null;
    const J = this.J; const from = { ...this.pos };
    if (plan) { // re-solve the arc from the actual takeoff point (anticipation may have moved us)
      const p = this.graph.landingPoint(plan.support, from.x, from.z);
      const d = Math.hypot(p.x - from.x, p.z - from.z), dy = plan.support.top - from.y;
      const j = plan.kind === 'hop' ? { kind: 'hop', T: 2 * J.v0 / J.gravity, vh: d / (2 * J.v0 / J.gravity) } : classifyJump(d, dy, J); plan = j ? { ...plan, ...j, point: p, d, dy } : null;
    }
    this.grounded = false; this.jumpsUsed = 1; this.coyote = 0; this.vel.y = J.v0; this.stats.jumps++;
    if (plan) {
      // bounded takeoff heading correction toward the computed arc
      const v = takeoffVelocity(plan, from); this.vel.x = v.x; this.vel.z = v.z;
      this.yaw = Math.atan2(v.x, v.z); this.airCap = plan.vh;
      this.plan = { ...plan, t0: this.time, from, double: plan.kind === 'double', impulseDone: false, magnetUsed: false };
      if (plan.kind !== 'hop') this.stats.assisted++; else this.stats.hops = (this.stats.hops || 0) + 1; if (plan.kind === 'long') this.stats.longs++;
    } else { this.plan = null; this.airCap = Math.hypot(this.vel.x, this.vel.z); }
    this.trace = [[from.x, from.y, from.z]];
    this.setState('TAKEOFF'); this.emit('takeoff', { plan: this.plan ? planFacts(this.plan) : null, from });
  }
  land(s) {
    this.pos.y = s.top; this.vel.y = 0; this.grounded = true; this.support = s; this.jumpsUsed = 0; this.stats.landings++;
    const plan = this.plan; const err = plan ? Math.hypot(plan.point.x - this.pos.x, plan.point.z - this.pos.z) : null;
    this.lastJumpTrace = { kind: plan?.kind ?? 'free', target: plan?.support.id ?? null, landed: s.id, hitTarget: plan ? plan.support.id === s.id : null,
      landingError: err, flightTime: plan ? +(this.time - plan.t0).toFixed(3) : null, plannedT: plan ? +plan.T.toFixed(3) : null,
      magnet: plan?.magnetUsed ?? false, edgeDistance: +this.graph.edgeDistance(s, this.pos.x, this.pos.z).toFixed(3), trace: this.trace };
    this.trace = null; this.plan = null; this.airCap = 0;
    this.speed = Math.min(this.speed, Math.hypot(this.vel.x, this.vel.z));
    this.setState('LAND_CONTACT'); this.emit('land', { support: s.id, zone: s.zone, card: s.card, jump: this.lastJumpTrace });
    this.setState('COMPRESSION');
  }
  beginRescue() { this.stats.rescues++; this.setState('RESCUE'); this.emit('rescueStart', { to: this.lastSafe }); }
  finishRescue() {
    const L = this.lastSafe; this.pos = { x: L.x, y: L.y, z: L.z }; this.vel = { x: 0, y: 0, z: 0 };
    this.grounded = true; this.support = this.graph.get(L.id) ?? this.graph.groundAt(L.x, L.z, L.y + 0.05);
    this.plan = null; this.speed = 0; this.setState('RECOVERY'); this.emit('rescued', { at: L });
  }
}

export function turnToward(a, b, maxStep) {
  let d = ((b - a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
  return a + Math.max(-maxStep, Math.min(maxStep, d));
}
function planFacts(p) { return { kind: p.kind, target: p.support.id, d: +p.d.toFixed(3), dy: +p.dy.toFixed(3), T: +p.T.toFixed(3), vh: +p.vh.toFixed(3) }; }
export { apexSingle };
