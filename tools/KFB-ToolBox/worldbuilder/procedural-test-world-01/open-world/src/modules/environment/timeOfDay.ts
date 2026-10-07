// Time-of-day model: sun path + a keyframed "look" (light colours/intensities, sky, fog, exposure).
// All colours are authored as sRGB hex and converted by THREE.Color into the linear working space.
import * as THREE from 'three';

export interface LookKey {
  h: number;
  sun: string; sunI: number;
  sky: string; ground: string; hemiI: number;
  zenith: string; horizon: string; fog: string;
  exposure: number;
  /** max camera-distance haze (0..1) */
  haze: number;
}

/** Keyframes (hours). Tuned against docs/reference (see NOTES.md). */
export const KEYS: LookKey[] = [
  // night: moonlight; post grade desaturates further (post.ts uNight)
  { h: 0,    sun: '#9fb4ff', sunI: 0.75, sky: '#5d74b4', ground: '#262e44', hemiI: 0.75, zenith: '#0b1735', horizon: '#2b3e68', fog: '#24365e', exposure: 1.0, haze: 0.35 },
  { h: 4.8,  sun: '#9fb4ff', sunI: 0.75, sky: '#5d74b4', ground: '#262e44', hemiI: 0.75, zenith: '#0e1c40', horizon: '#33476f', fog: '#2c3f68', exposure: 1.0, haze: 0.35 },
  { h: 6.2,  sun: '#ffb88a', sunI: 1.6,  sky: '#cdc6dc', ground: '#6a6a50', hemiI: 1.2,  zenith: '#5a86c8', horizon: '#f2cbb0', fog: '#e6cdb8', exposure: 1.1,  haze: 0.3 },
  { h: 7.5,  sun: '#fbf6e2', sunI: 3.3,  sky: '#eaf0f4', ground: '#97a060', hemiI: 1.45, zenith: '#68a8e2', horizon: '#f4e2c8', fog: '#eee4d2', exposure: 1.38, haze: 0.22 },
  { h: 9.5,  sun: '#f8fae6', sunI: 3.1,  sky: '#e6f4f2', ground: '#8e9a5a', hemiI: 1.3,  zenith: '#46a2ea', horizon: '#d2eefa', fog: '#cdeaf5', exposure: 1.24, haze: 0.2 },
  { h: 14.5, sun: '#f8fae6', sunI: 3.0,  sky: '#e6f4f2', ground: '#8e9a5a', hemiI: 1.25, zenith: '#46a2ea', horizon: '#d2eefa', fog: '#cdeaf5', exposure: 1.12, haze: 0.2 },
  { h: 16.3, sun: '#fbf6e2', sunI: 3.2,  sky: '#e6f0f8', ground: '#96a05c', hemiI: 1.3,  zenith: '#4f9de4', horizon: '#d6eaf4', fog: '#e4ebe4', exposure: 1.25, haze: 0.2 },
  { h: 17.5, sun: '#fdeccc', sunI: 3.4,  sky: '#e8ecf0', ground: '#929a5c', hemiI: 1.45,  zenith: '#5b98da', horizon: '#d8e2ea', fog: '#f0e2cc', exposure: 1.4 , haze: 0.18 },
  { h: 18.5, sun: '#ffb47c', sunI: 2.0,  sky: '#c4accc', ground: '#5a5050', hemiI: 1.1,  zenith: '#3e5a98', horizon: '#f2b08e', fog: '#e6b49a', exposure: 1.1,  haze: 0.25 },
  { h: 19.6, sun: '#9fb4ff', sunI: 0.75, sky: '#6278b8', ground: '#2a3248', hemiI: 0.8,  zenith: '#122150', horizon: '#3a4e80', fog: '#30446f', exposure: 1.0,  haze: 0.35 },
  { h: 24,   sun: '#9fb4ff', sunI: 0.75, sky: '#5d74b4', ground: '#262e44', hemiI: 0.75, zenith: '#0b1735', horizon: '#2b3e68', fog: '#24365e', exposure: 1.0, haze: 0.35 },
];

export interface Look {
  sun: THREE.Color; sunI: number;
  sky: THREE.Color; ground: THREE.Color; hemiI: number;
  zenith: THREE.Color; horizon: THREE.Color; fog: THREE.Color;
  exposure: number;
  hazeMax: number;
  /** Direction from the scene toward the light (sun by day, moon by night). */
  lightDir: THREE.Vector3;
  /** Direction toward the sun (may be below the horizon). */
  sunDir: THREE.Vector3;
  /** 0 = night (moon light), 1 = day. */
  day: number;
}

const _a = new THREE.Color();
const _b = new THREE.Color();

function lerpColor(out: THREE.Color, a: string, b: string, t: number): THREE.Color {
  _a.set(a);
  _b.set(b);
  return out.copy(_a).lerp(_b, t);
}

/**
 * Sun direction at the given hour. +Z is "south" (noon sun), +X east (morning), −X west (evening).
 * Solar noon 12:30, max elevation ≈ 51°, 14:00 ≈ 47° from the SW, 8:00/17:00 ≈ 20°, 18:00 ≈ 9°, sunset ≈ 18:50.
 */
export function sunDirection(hours: number, out = new THREE.Vector3()): THREE.Vector3 {
  const t = ((hours - 12.5) / 13) * Math.PI;
  const el = Math.asin(THREE.MathUtils.clamp(0.82 * Math.cos(t) - 0.04, -1, 1));
  // azimuth swings from east through south to west, fast enough that at the default 14:00 the sun comes from the
  // south-west → shadows fall to the right of the default yaw-30 cameras instead of hiding behind objects
  const az = t * 1.6;
  return out.set(-Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).normalize();
}

/** Moon: fixed, high in the south-west, so night shadows read well. */
const MOON = new THREE.Vector3(-0.45, 0.72, 0.53).normalize();

export function lookAt(hours: number, out?: Look): Look {
  const h = ((hours % 24) + 24) % 24;
  let i = 0;
  while (i < KEYS.length - 2 && KEYS[i + 1].h <= h) i++;
  const A = KEYS[i], B = KEYS[i + 1];
  const t = B.h > A.h ? THREE.MathUtils.smoothstep(h, A.h, B.h) : 0;
  const o: Look = out ?? {
    sun: new THREE.Color(), sunI: 0, sky: new THREE.Color(), ground: new THREE.Color(), hemiI: 0,
    zenith: new THREE.Color(), horizon: new THREE.Color(), fog: new THREE.Color(), exposure: 1, hazeMax: 0.2,
    lightDir: new THREE.Vector3(), sunDir: new THREE.Vector3(), day: 1,
  };
  lerpColor(o.sun, A.sun, B.sun, t);
  lerpColor(o.sky, A.sky, B.sky, t);
  lerpColor(o.ground, A.ground, B.ground, t);
  lerpColor(o.zenith, A.zenith, B.zenith, t);
  lerpColor(o.horizon, A.horizon, B.horizon, t);
  lerpColor(o.fog, A.fog, B.fog, t);
  o.sunI = THREE.MathUtils.lerp(A.sunI, B.sunI, t);
  o.hemiI = THREE.MathUtils.lerp(A.hemiI, B.hemiI, t);
  o.exposure = THREE.MathUtils.lerp(A.exposure, B.exposure, t);
  o.hazeMax = THREE.MathUtils.lerp(A.haze, B.haze, t);

  sunDirection(h, o.sunDir);
  // Day light follows the sun down to ~3° elevation; below that we cross-fade to the moon. The single
  // directional light switches direction while its intensity is near zero, so no visible pop.
  const el = o.sunDir.y;
  const DAY_MIN = Math.sin(THREE.MathUtils.degToRad(3));
  if (el >= DAY_MIN) {
    o.day = 1;
    o.lightDir.copy(o.sunDir);
    // fade the sun as it approaches the horizon (keeps long golden shadows soft, avoids a pop at the switch)
    const k = THREE.MathUtils.smoothstep(el, DAY_MIN, Math.sin(THREE.MathUtils.degToRad(9)));
    o.sunI *= 0.08 + 0.92 * k;
  } else {
    const k = THREE.MathUtils.smoothstep(-el, -DAY_MIN, Math.sin(THREE.MathUtils.degToRad(8)));
    o.day = 1 - k;
    o.lightDir.copy(MOON);
    o.sunI *= 0.08 + 0.92 * k; // ramps the moon in
  }
  return o;
}
