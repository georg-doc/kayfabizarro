/**
 * race-secondary-facts.v1.js
 *
 * Pure presentation adapter for the existing Stunt Race -> actor secondary-motion seam.
 *
 * OWNERSHIP:
 * - Race owns world/root motion, contact physics and the presentation signals.
 * - This module only normalizes those signals into dimensionless target facts.
 * - actor-wobble / the eventual approved ear adapter owns spring application.
 * - Ear geometry is deliberately not part of KCC-1A.
 *
 * No internal time, no random source, no integration, no mutation.
 */
export const SCHEMA = 'kfb.secondary-motion.race-facts/0.1';

export const RACE_FIELDS = Object.freeze([
  'longitudinalAcceleration',
  'lateralAcceleration',
  'angularVelocity',
  'impactImpulse',
  'relativeAirflowVector',
  'speedNormalized',
  'stuntState',
]);

export const DEFAULTS = Object.freeze({
  airflowReference: 41,       // current Race maxForward; normalization only, not physics ownership
  deadZone: 0.035,
  longAccelScale: 0.075,
  lateralAccelScale: 0.055,
  angularScale: 0.45,
  flutterGain: 0.34,
  flutterHzMin: 2.8,
  flutterHzMax: 8.6,
  impactPitchGain: 0.12,
  impactRollGain: 0.18,
});

const TAU = Math.PI * 2;
const EPS = 1e-9;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const number = (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
const mix = (a, b, t) => a + (b - a) * t;
const smoothstep = (edge0, edge1, x) => {
  const span = Math.max(EPS, edge1 - edge0);
  const t = clamp((x - edge0) / span, 0, 1);
  return t * t * (3 - 2 * t);
};
const r6 = (v) => {
  const n = Math.abs(v) < 5e-8 ? 0 : v;
  return +n.toFixed(6);
};

function vec3(v) {
  if (Array.isArray(v)) {
    return { x: number(v[0]), y: number(v[1]), z: number(v[2]) };
  }
  if (v && typeof v === 'object') {
    return { x: number(v.x), y: number(v.y), z: number(v.z) };
  }
  return { x: 0, y: 0, z: 0 };
}

function angular3(v) {
  if (Number.isFinite(Number(v))) {
    // Scalar compatibility: current consumer may expose yaw-only angular velocity.
    return { x: 0, y: Number(v), z: 0 };
  }
  return vec3(v);
}

function impactInfo(v) {
  if (Number.isFinite(Number(v))) {
    const n = Number(v);
    return { strength: clamp(Math.abs(n), 0, 1), side: Math.sign(n) || 1 };
  }
  if (v && typeof v === 'object') {
    const s = number(v.strength, number(v.impulse, 0));
    return {
      strength: clamp(Math.abs(s), 0, 1),
      side: Math.sign(number(v.side, s)) || 1,
    };
  }
  return { strength: 0, side: 1 };
}

function seedPhase(seed) {
  const s = String(seed ?? 'frizzlebob');
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return (h / 0xffffffff) * TAU;
}

function cloneJson(value) {
  if (value == null) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return String(value);
  }
}

/**
 * @param {object} facts Existing Race presentation facts.
 * @param {object} [options] Presentation normalization/tuning only.
 * @returns {object} Stateless dimensionless secondary-motion facts.
 */
export function sampleRaceSecondaryFacts(facts = {}, options = {}) {
  const P = { ...DEFAULTS, ...(options || {}) };

  const speed = clamp(number(facts.speedNormalized), 0, 1);
  const air = vec3(facts.relativeAirflowVector);
  const airMag = Math.hypot(air.x, air.y, air.z);
  const invAir = airMag > EPS ? 1 / airMag : 0;
  const dir = {
    x: air.x * invAir,
    y: air.y * invAir,
    z: air.z * invAir,
  };

  // Airflow strength is only a presentation fallback when speedNormalized is absent/low.
  const airStrength = clamp(airMag / Math.max(EPS, number(P.airflowReference, DEFAULTS.airflowReference)), 0, 1);
  const rawEnergy = Math.max(speed, airStrength);
  const energy = smoothstep(clamp(number(P.deadZone, DEFAULTS.deadZone), 0, 0.95), 1, rawEnergy);

  // Local convention: +X right, +Y up, +Z forward. Forward travel normally sees airflow toward -Z.
  const drag = clamp(-dir.z, -1, 1);
  const side = clamp(dir.x, -1, 1);
  const lift = clamp(dir.y, -1, 1);

  const longN = Math.tanh(number(facts.longitudinalAcceleration) * number(P.longAccelScale, DEFAULTS.longAccelScale));
  const latN = Math.tanh(number(facts.lateralAcceleration) * number(P.lateralAccelScale, DEFAULTS.lateralAccelScale));

  const av = angular3(facts.angularVelocity);
  const angularScale = number(P.angularScale, DEFAULTS.angularScale);
  const pitchRateN = Math.tanh(av.x * angularScale);
  const yawRateN = Math.tanh(av.y * angularScale);
  const rollRateN = Math.tanh(av.z * angularScale);

  const impact = impactInfo(facts.impactImpulse);

  const rootPitch = clamp(
    energy * (0.72 * drag - 0.18 * lift)
      + longN * 0.18
      - pitchRateN * 0.12
      + impact.strength * number(P.impactPitchGain, DEFAULTS.impactPitchGain),
    -1, 1,
  );
  const rootRoll = clamp(
    -energy * side * 0.62
      - latN * 0.18
      + rollRateN * 0.12
      + impact.side * impact.strength * number(P.impactRollGain, DEFAULTS.impactRollGain),
    -1, 1,
  );
  const rootYaw = clamp(
    -energy * side * 0.18
      - yawRateN * 0.18,
    -1, 1,
  );

  const frequencyHz = mix(
    number(P.flutterHzMin, DEFAULTS.flutterHzMin),
    number(P.flutterHzMax, DEFAULTS.flutterHzMax),
    energy,
  );
  const flutterAmplitude = clamp(
    Math.pow(energy, 1.35)
      * number(P.flutterGain, DEFAULTS.flutterGain)
      * (0.55 + 0.45 * Math.abs(drag)),
    0, 1,
  );

  const timeSeconds = number(facts.timeSeconds);
  const phase = seedPhase(facts.seed) + timeSeconds * TAU * frequencyHz;
  const rawWave = 0.72 * Math.sin(phase) + 0.28 * Math.sin(phase * 1.71 + 1.3);
  const flutterValue = flutterAmplitude === 0 ? 0 : clamp(rawWave, -1, 1);

  const tipPitch = clamp(
    rootPitch * 1.28
      + lift * energy * 0.18
      + flutterValue * 0.32,
    -1, 1,
  );
  const tipRoll = clamp(
    rootRoll * 1.35
      + flutterValue * (0.14 + Math.abs(side) * 0.18),
    -1, 1,
  );
  const tipYaw = clamp(
    rootYaw * 1.2
      - flutterValue * side * 0.12,
    -1, 1,
  );

  return {
    schema: SCHEMA,
    source: 'kfb.stunt-race.flow-runtime/0.1:presentationHooks',
    energy: r6(energy),
    airflow: {
      direction: { x: r6(dir.x), y: r6(dir.y), z: r6(dir.z) },
      strength: r6(airStrength),
      drag: r6(drag),
      side: r6(side),
      lift: r6(lift),
    },
    normalized: {
      longitudinalAcceleration: r6(longN),
      lateralAcceleration: r6(latN),
      angularVelocity: {
        pitch: r6(pitchRateN),
        yaw: r6(yawRateN),
        roll: r6(rollRateN),
      },
    },
    root: {
      pitch: r6(rootPitch),
      roll: r6(rootRoll),
      yaw: r6(rootYaw),
    },
    tip: {
      pitch: r6(tipPitch),
      roll: r6(tipRoll),
      yaw: r6(tipYaw),
    },
    flutter: {
      value: r6(flutterValue),
      amplitude: r6(flutterAmplitude),
      frequencyHz: r6(frequencyHz),
    },
    impact: {
      strength: r6(impact.strength),
      side: impact.side,
    },
    stuntState: cloneJson(facts.stuntState),
  };
}

export default sampleRaceSecondaryFacts;
