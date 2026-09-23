export const SCHEMA = 'kfb.environment-profile/1';
export const SOURCE_MAIN_SHA = 'fa5275ff2d881461f57bcfcaac45e4155e2862d9';

export const DAY_DIAGNOSTIC = Object.freeze({
  schema: SCHEMA,
  id: 'KAYKIT_BASELINE_DIAGNOSTIC',
  label: 'DAY',
  background: 0x1b1030,
  toneMapping: 'none',
  exposure: 1,
  fog: Object.freeze({ type: 'none', density: 0 }),
  world: Object.freeze({
    hemiSky: 0xdcd6ff,
    hemiGround: 0x2a2140,
    hemiIntensity: 1.9,
    keyColor: 0xfff3e0,
    keyIntensity: 2.1,
    fillColor: 0x9f8cff,
    fillIntensity: 0.602
  }),
  torch: Object.freeze({
    color: 0xff8c3a,
    intensity: 30,
    range: 18,
    decay: 2,
    poolMax: 6,
    phaseStep: 1.7,
    flicker: Object.freeze({ base: 0.84, a: 0.10, aHz: 11.3, b: 0.06, bHz: 6.7, phaseMul: 2.3 })
  }),
  localVisibility: Object.freeze({ color: 0xffe9c8, intensityMax: 46, range: 26, decay: 1.6, defaultValue: 0 })
});

export const WHACKMAN_DUSK_CANDIDATE = Object.freeze({
  schema: SCHEMA,
  id: 'WHACKMAN_DUSK_CANDIDATE',
  label: 'DUSK',
  background: 0x151322,
  toneMapping: 'aces-filmic',
  exposure: 1.0,
  fog: Object.freeze({ type: 'exp2', density: 0.019 }),
  world: Object.freeze({
    hemiSky: 0x3f4a66,
    hemiGround: 0x1f1917,
    hemiIntensity: 0.48,
    keyColor: 0x9db4e8,
    keyIntensity: 0.68,
    fillColor: 0x6478a8,
    fillIntensity: 0.12
  }),
  torch: Object.freeze({
    color: 0xff8c3a,
    intensity: 30,
    range: 18,
    decay: 2,
    poolMax: 6,
    phaseStep: 1.7,
    flicker: Object.freeze({ base: 0.84, a: 0.10, aHz: 11.3, b: 0.06, bHz: 6.7, phaseMul: 2.3 })
  }),
  localVisibility: Object.freeze({ color: 0xffe9c8, intensityMax: 46, range: 26, decay: 1.6, defaultValue: 0 })
});

export const ENVIRONMENTS = Object.freeze({ DAY: DAY_DIAGNOSTIC, DUSK: WHACKMAN_DUSK_CANDIDATE });

export function clamp01(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0;
}

export function torchIntensityAt(profile, timeSec, lightIndex, flickerAmount = 1) {
  const amount = clamp01(flickerAmount);
  const t = profile.torch;
  const f = t.flicker;
  const phase = Number(lightIndex || 0) * t.phaseStep;
  const wave = f.base + f.a * Math.sin(timeSec * f.aHz + phase) + f.b * Math.sin(timeSec * f.bHz + phase * f.phaseMul);
  return t.intensity * ((1 - amount) + amount * wave);
}

function coord(p, key, index) {
  if (Array.isArray(p)) return Number(p[index] || 0);
  return Number(p?.[key] || 0);
}

export function selectNearestSources(sources, focus, maxCount = 6) {
  const fx = coord(focus, 'x', 0), fy = coord(focus, 'y', 1), fz = coord(focus, 'z', 2);
  const limit = Math.max(0, Math.floor(Number(maxCount) || 0));
  return sources
    .map((source, index) => {
      const x = coord(source, 'x', 0), y = coord(source, 'y', 1), z = coord(source, 'z', 2);
      const dx = x - fx, dy = y - fy, dz = z - fz;
      return { index, distanceSq: dx * dx + dy * dy + dz * dz };
    })
    .sort((a, b) => a.distanceSq - b.distanceSq || a.index - b.index)
    .slice(0, limit);
}

export function resolveLocalVisibility(profile, value) {
  const amount = clamp01(value);
  return Object.freeze({
    amount,
    intensity: amount * profile.localVisibility.intensityMax,
    range: profile.localVisibility.range,
    decay: profile.localVisibility.decay,
    color: profile.localVisibility.color
  });
}

export function diagnosticSnapshot({ mode = 'DUSK', torchEnabled = true, localVisibility = 0 } = {}) {
  const profile = ENVIRONMENTS[mode] || WHACKMAN_DUSK_CANDIDATE;
  return Object.freeze({
    schema: SCHEMA,
    environmentId: profile.id,
    background: profile.background,
    fog: Object.freeze({ ...profile.fog }),
    torchEnabled: Boolean(torchEnabled),
    poolMax: profile.torch.poolMax,
    localVisibility: resolveLocalVisibility(profile, localVisibility)
  });
}
