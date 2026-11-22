import * as THREE from "three";
// Aus 06-orrery/index.tsx Zeilen 34–152 (Konstanten, Pose-Helfer, arrangeSign), nur Typen entfernt und exportiert. Sonst unverändert.
import { SIGNS } from "./signs.js";
import { pointHash } from "./random.js";
                                    
const UP = new THREE.Vector3(0, 1, 0);
const FORWARD_X = new THREE.Vector3(1, 0, 0);
const ONE = new THREE.Vector3(1, 1, 1);
export const BLEND = 1.5;
// How long after letting go of the Sun the machine starts to come back together.
const RETURN_AFTER = 5;
export const SPREAD = 0.55;
const FORM_CENTRE = new THREE.Vector3(0, 3.1, 0);
const FORM_SIZE = 4.4;
const FASTEST = 9;
const GROUP_SOLID = (1 << 16) | 0xffff;
const GROUP_GHOST = (4 << 16) | 2;

const wrap = (angle        ) => Math.atan2(Math.sin(angle), Math.cos(angle));
export const easeInOut = (t        ) => t * t * t * (t * (t * 6 - 15) + 10);

                                                                                            
const newPose = ()       => ({ position: new THREE.Vector3(), quaternion: new THREE.Quaternion(), scale: new THREE.Vector3(1, 1, 1) });

// Where everything goes for a sign: the planets on the stars, a wheel behind each, bars along the lines between them, and
// the remaining small gears threaded along those lines as beads.
export function arrangeSign(parts        , signName        , viewer               ) {
  const sign = SIGNS.find((candidate) => candidate.name === signName) ?? SIGNS[0];
  const normal = viewer.clone().sub(FORM_CENTRE).normalize();
  const right = new THREE.Vector3().crossVectors(UP, normal).normalize();
  const above = new THREE.Vector3().crossVectors(normal, right);
  const place = ([x, y]                  ) => FORM_CENTRE.clone().addScaledVector(right, x * FORM_SIZE).addScaledVector(above, y * FORM_SIZE);
  const stars = sign.stars.map(place);
  // Real stars can sit close together, so nothing placed on one may be bigger than the gap to its nearest neighbour allows.
  const room = stars.map((star) => stars.reduce((nearest, other) => (other === star ? nearest : Math.min(nearest, star.distanceTo(other))), Infinity));
  // Facing: a wheel's axle, its local y, along the normal.
  const facing = new THREE.Quaternion().setFromUnitVectors(UP, normal);
  const targets = new Map                                 ();
  const set = (part      , position               , quaternion                  , scale                        , faced = false) => {
    const pose = { ...newPose(), faced };
    pose.position.copy(position);
    pose.quaternion.copy(quaternion);
    if (typeof scale === "number") pose.scale.setScalar(scale);
    else pose.scale.copy(scale);
    targets.set(part, pose);
  };

  const balls = parts.filter((part) => part.kind === "ball" && part.id !== "crankKnob").sort((a, b) => b.size - a.size);
  const wheels = parts.filter((part) => part.kind === "gear" || part.kind === "plate").sort((a, b) => b.size - a.size);
  const bars = parts.filter((part) => part.kind === "bar").sort((a, b) => (b.long?.length ?? 0) - (a.long?.length ?? 0));
  const knob = parts.find((part) => part.id === "crankKnob");

  // One planet per star, biggest first, with the Sun on the brightest. Any left over wait halfway along a line.
  const lineMiddle = (index        ) => {
    const [a, b] = sign.lines[index % sign.lines.length];
    return stars[a].clone().lerp(stars[b], 0.5);
  };
  balls.forEach((part, index) => {
    const at = index < stars.length ? stars[index] : lineMiddle(index - stars.length);
    const nearby = index < stars.length ? room[index] : 1;
    const scale = part.id === "sun" ? Math.min(0.9, (0.72 * nearby) / part.size) : Math.min(Math.max(0.24, 0.3 * nearby), 0.28) / part.size;
    set(part, at.clone().addScaledVector(normal, 0.26), facing, Math.min(scale, 3.2), part.id !== "sun");
  });

  // Behind each star, the biggest wheels in turn. Each is sized so that it is a star, not a whole gear train.
  let wheel = 0;
  stars.forEach((star, index) => {
    const part = wheels[wheel++];
    if (!part) return;
    const wanted = Math.min(index === 0 ? 0.74 : 0.34 + pointHash(index, 3) * 0.14, Math.max(0.16, 0.46 * room[index])) / part.size;
    set(part, star, facing, Math.min(1.1, wanted), true);
  });

  // Walk each line, laying bars end to end, then scatter the rest of the wheels along them.
  const lengths = sign.lines.map(([a, b]) => stars[a].distanceTo(stars[b]));
  // Every line gets a bar, and any left over strengthen the longest.
  const share = lengths.map(() => 1);
  for (let spare = bars.length - lengths.length; spare > 0; spare--) {
    let longest = 0;
    lengths.forEach((value, line) => {
      if (value / share[line] > lengths[longest] / share[longest]) longest = line;
    });
    share[longest] += 1;
  }
  let bar = 0;
  const quaternion = new THREE.Quaternion();
  const direction = new THREE.Vector3();
  const point = new THREE.Vector3();
  sign.lines.forEach(([a, b], line) => {
    direction.subVectors(stars[b], stars[a]);
    const each = direction.length() / share[line];
    direction.normalize();
    for (let i = 0; i < share[line] && bar < bars.length; i++) {
      const part = bars[bar++];
      const long = part.long                                       ;
      const girth = 0.62;
      if (long.axis === "y") {
        quaternion.setFromUnitVectors(UP, direction);
        point.copy(stars[a]).addScaledVector(direction, each * (i + 0.5));
        set(part, point, quaternion, new THREE.Vector3(girth, (each / long.length) * 1.01, girth));
      } else {
        quaternion.setFromUnitVectors(FORWARD_X, direction);
        point.copy(stars[a]).addScaledVector(direction, each * i);
        set(part, point, quaternion, new THREE.Vector3((each / long.length) * 1.01, girth, girth));
      }
    }
  });

  const beads = wheels.slice(wheel);
  beads.forEach((part, index) => {
    const line = index % sign.lines.length;
    const pass = Math.floor(index / sign.lines.length);
    const [a, b] = sign.lines[line];
    const t = 0.2 + ((pass * 0.618 + 0.13 * line) % 0.6);
    point.copy(stars[a]).lerp(stars[b], t).addScaledVector(normal, 0.06);
    set(part, point, facing, Math.min(1, 0.13 / part.size), true);
  });
  if (knob) {
    const [a, b] = sign.lines[sign.lines.length - 1];
    set(knob, point.copy(stars[a]).lerp(stars[b], 0.5).addScaledVector(normal, 0.1), facing, 1);
  }
  return targets;
}

