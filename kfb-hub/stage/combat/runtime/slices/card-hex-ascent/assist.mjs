// Card-Hex Ascent · Chill & Fun jump assist (Babel MECHANISM re-implemented, constants re-measured).
// Consumed by the player movement owner; never writes position itself. Pure, node-testable.

export const JUMP = Object.freeze({
  gravity: 24,          // u/s²
  v0: 9.4,              // first impulse → apex 1.84 u
  v2: 7.6,              // planned/manual second impulse → +1.20 u
  runSpeed: 3.303,      // KAYKIT_LOCO_SET_01 run anchor
  sprintSpeed: 5.255,   // sprint anchor
  assistMaxH: 6.2,      // ceiling for assisted horizontal speed (long jump)
  coyote: 0.12,
  buffer: 0.14,
  cone: 50 * Math.PI / 180,   // half-angle of the intent cone
  clearance: 0.45,      // arc must clear the target top by this much
  magnetRadius: 0.9,
  maxDrop: 7.0,
});

export function apexSingle(J = JUMP) { return J.v0 * J.v0 / (2 * J.gravity); }
export function apexDouble(J = JUMP) { return apexSingle(J) + J.v2 * J.v2 / (2 * J.gravity); }

// Time of flight for a single jump landing at height dy relative to takeoff (null if unreachable).
export function flightSingle(dy, J = JUMP) {
  const g = J.gravity, v = J.v0, disc = v * v - 2 * g * dy;
  if (disc < 0) return null;
  return (v + Math.sqrt(disc)) / g;
}
// Time of flight with a second impulse at the first apex.
export function flightDouble(dy, J = JUMP) {
  const g = J.gravity, h1 = apexSingle(J), v2 = J.v2;
  const disc = v2 * v2 + 2 * g * (h1 - dy);
  if (disc < 0) return null;
  return J.v0 / g + (v2 + Math.sqrt(disc)) / g;
}

// Classify a gap → {kind:'direct'|'long'|'double', T, vh} or null when not physically reachable.
export function classifyJump(d, dy, J = JUMP) {
  const h1 = apexSingle(J), h2 = apexDouble(J);
  if (dy < -J.maxDrop) return null;
  if (dy <= h1 - J.clearance) {
    const T = flightSingle(dy, J); const vh = d / T;
    if (vh <= J.runSpeed * 1.05) return { kind: 'direct', T, vh, apex: h1 };
    if (vh <= J.assistMaxH) return { kind: 'long', T, vh, apex: h1 };
  }
  if (dy <= h2 - J.clearance) {
    const T = flightDouble(dy, J); const vh = d / T;
    if (vh <= J.assistMaxH) return { kind: 'double', T, vh, apex: h2, impulseAt: J.v0 / J.gravity };
  }
  return null;
}

// Pick the support the player intends to reach.
// graph: SupportGraph; from: {x,y,z}; dir: unit intent vector {x,z} (input or facing); current: support id.
export function chooseTarget(graph, from, dir, currentId, J = JUMP, routeHint = -1, speed = Infinity) {
  let best = null;
  const dl = Math.hypot(dir.x, dir.z); if (dl < 1e-3) return null;
  const ux = dir.x / dl, uz = dir.z / dl;
  const cur = currentId ? graph.get(currentId) : null;
  for (const s of graph.items) {
    if (!s.solid || s.id === currentId || s.assist === false) continue;
    if (cur && cur.islet && s.islet === cur.islet) continue; // same islet = walkable, never a jump target
    const p = graph.landingPoint(s, from.x, from.z);
    const dx = p.x - from.x, dz = p.z - from.z, d = Math.hypot(dx, dz);
    if (d < 0.6 || d > 9) continue;
    // already-standing-on-equivalent surfaces (same height, touching) are walkable, not jump targets
    const dy = s.top - from.y;
    if (Math.abs(dy) < 0.2 && graph.edgeDistance(s, from.x, from.z) < 0.5) continue;
    const ang = Math.acos(Math.max(-1, Math.min(1, (dx * ux + dz * uz) / d)));
    if (ang > J.cone) continue;
    const jump = classifyJump(d, dy, J); if (!jump) continue;
    if (jump.kind === 'long' && speed < J.runSpeed * 0.45) continue; // long jumps are earned with a run-up
    // score: aligned, near, upward-route preference, prefer single over double
    let score = ang * 2.2 + d * 0.22 + (jump.kind === 'double' ? 0.7 : 0) + (jump.kind === 'long' ? 0.25 : 0);
    if (dy > 0.3) score -= 0.35;
    if (routeHint >= 0 && s.route >= 0) score += Math.abs(s.route - routeHint - 1) * 0.12;
    if (!best || score < best.score) best = { support: s, point: p, d, dy, ang, score, ...jump };
  }
  return best;
}

// Takeoff velocity for a plan (computed arc — no teleport, no mid-air snap).
export function takeoffVelocity(plan, from) {
  const dx = plan.point.x - from.x, dz = plan.point.z - from.z, d = Math.hypot(dx, dz) || 1;
  return { x: dx / d * plan.vh, z: dz / d * plan.vh };
}

// Bounded near-target landing magnet: horizontal correction accel toward the planned point,
// active only while descending close to a real support top.
export function magnetAccel(plan, pos, vy, J = JUMP) {
  if (!plan || vy > 0) return null;
  const dyTop = pos.y - plan.point.y;
  if (dyTop < -0.05 || dyTop > 1.4) return null;
  const dx = plan.point.x - pos.x, dz = plan.point.z - pos.z, d = Math.hypot(dx, dz);
  if (d > J.magnetRadius || d < 1e-3) return null;
  const a = 9 * (d / J.magnetRadius);
  return { x: dx / d * a, z: dz / d * a };
}
