/* Domino toppling · real rigid-body pivot physics, not a scripted rotation tween.
   Each domino is a rod of length L pivoting about its bottom-front edge under gravity:
     theta'' = (3g)/(2L) sin(theta)                      (standard falling-rod ODE)
   integrated with substeps so the frame rate doesn't change the fall speed. A domino stops
   forward rotation at its CONTACT ANGLE — the angle at which its top edge reaches the next
   standing tile's near face — derived from measured spacing/thickness, not assumed. On contact
   it hands the next domino a fraction of its angular velocity (the physical push) and enters a
   short damped wobble (Nachwippen) before settling dead still (Endlage). */

export const G = 9.81;

/* contact angle: the falling tile's top point travels a horizontal reach of L·sin(theta) from
   its own pivot; it meets the neighbour's near face once that reach covers (spacing - thickness).
   Clamped to 85° so a spacing/thickness combo that would never touch still falls flat, not stalls. */
export function contactAngle(spacing, thickness, length) {
  const reach = Math.max(0, spacing - thickness);
  const s = Math.min(0.996, reach / length);
  return Math.asin(s);
}

export function makeDomino(length) {
  return { theta: 0, omega: 0, phase: 'standing', triggered: false, restAngle: null, wobbleAmp: 0, wobbleT: 0, length };
}

/* advance one domino by dt seconds. It falls all the way to `finalAngle` (flat) regardless of its
   neighbour — a chain reaction knocks pieces OVER, it doesn't park them leaning. `triggerAngle` only
   marks the moment it has fallen far enough to have struck the next piece(s): `onContact` fires once
   then, so the caller can kick children while THIS domino keeps falling to the floor. */
export function stepDomino(d, dt, triggerAngle, finalAngle, onContact) {
  if (d.phase === 'falling') {
    const sub = 4, h = dt / sub;
    for (let i = 0; i < sub; i++) {
      const alpha = ((3 * G) / (2 * d.length)) * Math.sin(d.theta);
      d.omega += alpha * h;
      d.theta += d.omega * h;
      if (!d.triggered && d.theta >= triggerAngle) { d.triggered = true; onContact?.(d.omega); }
      if (d.theta >= finalAngle) {
        d.theta = finalAngle;
        d.phase = 'settling';
        d.restAngle = finalAngle;
        d.wobbleAmp = Math.min(0.1, d.omega * 0.04);
        d.wobbleT = 0;
        break;
      }
    }
  } else if (d.phase === 'settling') {
    d.wobbleT += dt;
    const zeta = 6, freq = 18;
    const env = d.wobbleAmp * Math.exp(-zeta * d.wobbleT);
    d.theta = d.restAngle - Math.abs(env * Math.cos(freq * d.wobbleT));
    if (env < 0.0015) { d.theta = d.restAngle; d.phase = 'rest'; }
  }
  return d.theta;
}

export function kickFalling(d, omega0) { d.phase = 'falling'; d.omega = Math.max(d.omega, omega0); if (d.theta === 0) d.theta = 0.01; }
