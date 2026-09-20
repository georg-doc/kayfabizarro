// KFB Cologne Race · Option C · Fahren, Fahrzeug, VFX, Kameras
//
// EIN Bewegungsbesitzer. Die Zahlen stammen unveraendert aus den gepinnten
// oeffentlichen Race-v0.8-Spiegeln — hier wird nichts nachgeregelt (§5, §14):
//   kfb-hub/stunt-race/track-lab/RACE_FLOW_RUNTIME_CONFIG.json  blob 27ce5d67b1aa
//   kfb-hub/stunt-race/track-lab/RACE_FEEL_V08_CONFIG.json      blob 38afec4b9eaf
//
// Fahrzeug gemessen aus den glTF-Accessoren, nicht geschaetzt:
//   car_hatchback  0,419 x 0,380 x 0,806 u   Radradius 0,072  Spur +-0,176
//                  Radstand 0,2454 / -0,2562  Karosserie y -0,030..0,308
//   Massstab 5,155 = proxyHalfWidth 1,08 / halbe Modellbreite 0,2095
//               -> 2,16 x 1,96 x 4,15 m, Bodenkontakt 0,313 m unter dem Ursprung

import { C } from './option-c-style.v1.js';
import { RAW } from './cologne-world.v1.js';

export const FLOW = {   // RACE_FLOW_RUNTIME_CONFIG.json · flow
  accel: 18.5, brake: 28, reverseAccel: 10.5, drag: 0.95,
  maxForward: 41, maxReverse: 9, steerBase: -13.8,
  lateralDamping: 3.05, centrifugalGain: 0.085, proxyHalfWidth: 1.08,
  softStart: 0.76, softBase: 5, softGain: 19,
  bounceBase: 4.6, bounceLat: 0.76, bounceSpeed: 0.085,
  retention: 0.985, cooldown: 0.2
};

export const FEEL = {   // RACE_FEEL_V08_CONFIG.json · feel
  driftMinSpeed: 7.5, driftSteerScale: 1.28, driftDampingScale: 0.28,
  driftKickScale: 0.035, driftYawGain: 1.32, regripSeconds: 0.34,
  regripDampingScale: 1.85, accelPitchGain: 0.0075, lateralRollGain: 0.0028,
  surfaceSpring: 34, surfaceDamping: 8.2, hoverBase: 0.045,
  boostAccelScale: 1.55, boostMaxForward: 48.5, boostPitchBias: 0.035,
  jumpImpulse: 7.8, jumpGravity: 19.0
};

export const CONTROLS = {   // RACE_FEEL_V08_CONFIG.json · controls
  gas: ['KeyW', 'ArrowUp'], brakeReverse: ['KeyS', 'ArrowDown'],
  steerLeft: ['KeyA', 'ArrowLeft'], steerRight: ['KeyD', 'ArrowRight'],
  driftLeft: ['KeyQ'], driftRight: ['KeyE'],
  boost: ['ShiftLeft', 'ShiftRight'], jump: ['Space']
};

export const VEHICLES = [
  { id: 'car_hatchback', label: 'Hatchback', path: 'media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_hatchback.gltf', lengthU: 0.806 },
  { id: 'car_sedan', label: 'Sedan', path: 'media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_sedan.gltf', lengthU: 0.938 },
  { id: 'car_stationwagon', label: 'Station Wagon', path: 'media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_stationwagon.gltf', lengthU: 0.938 }
];

const MODEL_HALF_WIDTH_U = 0.2095;
const WHEEL_R_U = 0.072;
const WHEEL_CY_U = 0.011257;

export async function loadVehicle(THREE, GLTFLoader, spec) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(RAW(spec.path));
  const root = gltf.scene;
  const scale = FLOW.proxyHalfWidth / MODEL_HALF_WIDTH_U;   // 5,155

  const wheels = [];
  root.traverse(o => {
    if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; }
    if (/wheel_/.test(o.name)) wheels.push(o);
  });
  const front = wheels.filter(w => /front/.test(w.name));
  const rear = wheels.filter(w => /rear/.test(w.name));

  const holder = new THREE.Group();
  holder.name = 'vehicle:' + spec.id;
  root.scale.setScalar(scale);
  root.position.y = -(WHEEL_CY_U - WHEEL_R_U) * scale;  // Radunterkante auf y=0
  holder.add(root);

  const box = new THREE.Box3().setFromObject(root);
  return {
    holder, root, wheels, front, rear, spec,
    measured: {
      scale: +scale.toFixed(4),
      sizeM: {
        x: +(box.max.x - box.min.x).toFixed(3),
        y: +(box.max.y - box.min.y).toFixed(3),
        z: +(box.max.z - box.min.z).toFixed(3)
      },
      wheelRadiusM: +(WHEEL_R_U * scale).toFixed(3),
      wheelCount: wheels.length,
      trackM: +(0.352 * scale).toFixed(3),
      wheelbaseM: +(0.5016 * scale).toFixed(3),
      groundOffsetM: +(-(WHEEL_CY_U - WHEEL_R_U) * scale).toFixed(3),
      forwardAxis: '+Z'
    }
  };
}

// ------------------------------------------------------------- Bewegung
export function createDriver(route) {
  const start = route.sampleAt(0);
  return {
    x: start.x, z: start.z, y: start.y,
    yaw: Math.atan2(start.tx, start.tz),
    speed: 0, lateralV: 0, airY: 0, airV: 0, onGround: true,
    drift: 0, driftDir: 0, regrip: 0,
    s: 0, lap: 1, lastIndex: 0, bestLap: null, lapStart: 0,
    boosting: false, pitch: 0, roll: 0, wheelSpin: 0, steerAngle: 0,
    hitCooldown: 0, offTrack: false
  };
}

export function stepDriver(d, route, keys, dt, t) {
  const down = list => list.some(k => keys.has(k));
  const gas = down(CONTROLS.gas);
  const brake = down(CONTROLS.brakeReverse);
  const left = down(CONTROLS.steerLeft);
  const right = down(CONTROLS.steerRight);
  const driftL = down(CONTROLS.driftLeft);
  const driftR = down(CONTROLS.driftRight);
  const boost = down(CONTROLS.boost);
  const jump = down(CONTROLS.jump);

  d.boosting = boost && d.speed > 4;
  const maxF = d.boosting ? FEEL.boostMaxForward : FLOW.maxForward;
  const acc = FLOW.accel * (d.boosting ? FEEL.boostAccelScale : 1);

  if (gas) d.speed += acc * dt;
  else if (brake) d.speed -= (d.speed > 0 ? FLOW.brake : FLOW.reverseAccel) * dt;
  else d.speed *= Math.pow(FLOW.drag, dt * 60 / 60 * 4);
  d.speed = Math.max(-FLOW.maxReverse, Math.min(maxF, d.speed));

  // Lenken. Vorzeichenregel: positives yawRate dreht nach RECHTS (bei yaw=0 zeigt
  // vorwaerts auf +Z, rechts auf +X). FLOW.steerBase ist im Spender NEGATIV.
  //
  // Zwei gemessene Fehler aus Georgs Fahrt, beide hier:
  //
  // 1 Die Lenkrate war viel zu klein. Mit dem alten Faktor 2,4 ergab sich bei
  //   41 m/s eine Gierrate von 0,195 rad/s, also ein Kurvenradius von 210 m.
  //   Auf einer 2-km-Runde mit einer technischen Passage fuehlt sich das nicht
  //   nach Lenken an, sondern nach Rutschen. Zielradius bei Hoechstgeschwindigkeit
  //   rund 60 m -> 41/60 = 0,68 rad/s. Der Faktor ist entsprechend gesetzt.
  //
  // 2 Der Seitenanteil der Kurve wurde OHNE dt aufaddiert. Bei 120 Bildern je
  //   Sekunde war die Zentrifugalkraft damit rund 120-fach zu gross — das war
  //   das Wegschmieren beim blossen Lenken.
  const steerIn = (left ? 1 : 0) - (right ? 1 : 0);
  const speedFactor = 1 / (1 + Math.abs(d.speed) * 0.048);
  const STEER_GAIN = 8.2;
  // GEMESSEN, nicht hergeleitet. Meine Herleitung war dreimal falsch, weil ich
  // Bildschirm-rechts mit +X gleichgesetzt habe. Die Verfolgerkamera blickt aber
  // MIT der Fahrtrichtung, dadurch kehrt sich die Seite um.
  // Messung: A gedrueckt, Bewegung auf den Kamera-Rechtsvektor projiziert.
  //   mit steerIn * steerBase  ->  +16,09  (rechts)   FALSCH
  //   mit -steerIn * steerBase ->  negativ (links)    richtig
  let yawRate = -steerIn * FLOW.steerBase * Math.PI / 180 * speedFactor * STEER_GAIN;

  // Drift. Der alte Anstoss war ein Impuls von |v|*0,035*12 = 17 m/s quer —
  // ein Schlag, der das Fahrzeug aus der Bahn und die Kamera durch die Fassade
  // geworfen hat. Drift ist jetzt das, was es sein soll: die Kurve zieht enger,
  // das Heck kommt geregelt nach, und die Querbewegung baut sich als
  // Beschleunigung auf, gedeckelt.
  const wantDrift = (driftL ? -1 : 0) + (driftR ? 1 : 0);
  const DRIFT_LAT_ACCEL = 9.0;      // m/s^2
  const DRIFT_LAT_MAX = 7.5;        // m/s
  if (wantDrift && Math.abs(d.speed) > FEEL.driftMinSpeed) {
    if (!d.drift) d.driftDir = wantDrift;
    d.drift = Math.min(1, d.drift + dt * 3.4);
    d.regrip = FEEL.regripSeconds;
    yawRate *= FEEL.driftSteerScale;
    // Gleiche Seitenregel wie die Lenkung: Q zieht nach links, E nach rechts.
    yawRate += -d.driftDir * FEEL.driftYawGain * 0.42 *
      Math.min(1, Math.abs(d.speed) / 22) * d.drift;
    const target = d.driftDir * DRIFT_LAT_MAX * d.drift;
    d.lateralV += (target - d.lateralV) * Math.min(1, DRIFT_LAT_ACCEL * dt / Math.max(1, DRIFT_LAT_MAX));
  } else {
    d.drift = Math.max(0, d.drift - dt * 2.6);
    d.regrip = Math.max(0, d.regrip - dt);
  }
  d.yaw += yawRate * dt * (d.speed >= 0 ? 1 : -1);
  d.steerAngle += (steerIn * 0.42 - d.steerAngle) * Math.min(1, dt * 9);

  // Vorwaerts
  const fx = Math.sin(d.yaw), fz = Math.cos(d.yaw);
  d.x += fx * d.speed * dt;
  d.z += fz * d.speed * dt;

  // Seitliche Bewegung: Zentrifugal MIT dt, dann gedaempft
  const damp = FLOW.lateralDamping *
    (d.drift > 0.05 ? FEEL.driftDampingScale : (d.regrip > 0 ? FEEL.regripDampingScale : 1));
  d.lateralV += -yawRate * d.speed * FLOW.centrifugalGain * dt;
  d.lateralV -= d.lateralV * Math.min(1, damp * dt);
  d.lateralV = Math.max(-11, Math.min(11, d.lateralV));
  const rx = fz, rz = -fx;
  d.x += rx * d.lateralV * dt;
  d.z += rz * d.lateralV * dt;

  // Strecke lesen
  const near = route.nearest(d.x, d.z, d.lastIndex);
  d.lastIndex = near.index;
  const p = near.point;
  const lateral = (d.x - p.x) * p.nx + (d.z - p.z) * p.nz;
  const limit = p.w * 0.5 - FLOW.proxyHalfWidth;
  // Mit der harten Kante kann das Fahrzeug die Bahn nicht verlassen. Der Zustand
  // meldet deshalb WAND, wenn es an der Kante schleift — nicht faelschlich OFF TRACK.
  d.atWall = Math.abs(lateral) > limit - 0.25;
  d.offTrack = false;

  // Weiche Bande: Rueckhalt statt harter Wand (Spender-Zahlen)
  const over = Math.abs(lateral) - limit * FLOW.softStart;
  if (over > 0) {
    const push = (FLOW.softBase + FLOW.softGain * (over / Math.max(1, limit))) * Math.sign(-lateral);
    d.x += p.nx * push * dt;
    d.z += p.nz * push * dt;
    if (Math.abs(lateral) > limit && d.hitCooldown <= 0) {
      d.lateralV = -Math.sign(lateral) * (FLOW.bounceBase + Math.abs(d.speed) * FLOW.bounceSpeed);
      d.speed *= FLOW.retention;
      d.hitCooldown = FLOW.cooldown;
    }
  }
  // Harte Grenze auf der Bandkante. Gemessener Befund: bei 41 m/s reicht der weiche
  // Rueckhalt allein nicht — das Fahrzeug verliess das Rheindeck und blieb in der Luft
  // stehen, weil die Hoehe am Streckenband haengt. Ein Bauwerk hat eine Kante.
  if (Math.abs(lateral) > limit) {
    const corr = (Math.abs(lateral) - limit) * Math.sign(lateral);
    d.x -= p.nx * corr;
    d.z -= p.nz * corr;
  }
  d.hitCooldown = Math.max(0, d.hitCooldown - dt);

  // Sprung und Hoehe — Strecke ist die Bezugsflaeche (Spender: route-relative proxy)
  const surfaceY = p.y + Math.sin(p.bank) * lateral;
  if (jump && d.onGround) { d.airV = FEEL.jumpImpulse; d.onGround = false; }
  if (!d.onGround) {
    d.airV -= FEEL.jumpGravity * dt;
    d.airY += d.airV * dt;
    if (d.airY <= 0) { d.airY = 0; d.airV = 0; d.onGround = true; }
  }
  const targetY = surfaceY + FEEL.hoverBase + d.airY;
  d.y += (targetY - d.y) * Math.min(1, FEEL.surfaceSpring * dt / FEEL.surfaceDamping * 2.4);

  // Lage
  d.pitch += ((gas ? -1 : brake ? 1 : 0) * Math.abs(d.speed) * FEEL.accelPitchGain * 0.55 +
    (d.boosting ? -FEEL.boostPitchBias : 0) - d.pitch) * Math.min(1, dt * 6);
  d.roll += (-d.lateralV * FEEL.lateralRollGain * 6 + p.bank * 0.75 - d.roll) * Math.min(1, dt * 5);
  d.wheelSpin += d.speed * dt / 0.371;

  // Runden
  const prevS = d.s;
  d.s = p.s !== undefined ? p.s : d.s;
  const here = near.index / route.points.length;
  if (d.lastFrac !== undefined && d.lastFrac > 0.85 && here < 0.15) {
    const lapTime = t - d.lapStart;
    if (lapTime > 8) {
      if (d.bestLap === null || lapTime < d.bestLap) d.bestLap = lapTime;
      d.lap++; d.lapStart = t;
    }
  }
  d.lastFrac = here;
  d.progress = here;
  return d;
}

// VFX und Antrieb sind nach lab-v9/cologne-drive.v1.js umgezogen. Der Antrieb ist
// dort die QUELLE fuer Spur und Speedlines; hier bleibt nur die Bewegung. Ein
// Bewegungsbesitzer, ein Antriebsbesitzer, keine zweite Fassung nebenher.

// -------------------------------------------------------------- Kameras
export const REVIEW_MODES = ['CHASE', 'CLOSE ORBIT', 'HIGH OBLIQUE', 'TRACK SURFACE', 'LANDMARK HERO'];

export function applyCamera(THREE, cam, mode, d, route, dom, t, cctv) {
  const fx = Math.sin(d.yaw), fz = Math.cos(d.yaw);
  const look = new THREE.Vector3(d.x, d.y + 1.4, d.z);
  if (mode === 'CHASE') {
    const sp = Math.abs(d.speed) / FLOW.maxForward;
    cam.fov = 58 + sp * 14 + (d.boosting ? 7 : 0);
    cam.position.lerp(new THREE.Vector3(
      d.x - fx * (8.6 + sp * 3.4), d.y + 3.5 + sp * 0.9, d.z - fz * (8.6 + sp * 3.4)), 0.14);
    cam.lookAt(look.x + fx * 11, look.y - 0.2, look.z + fz * 11);
  } else if (mode === 'CLOSE ORBIT') {
    cam.fov = 38;
    const a = t * 0.45;
    cam.position.set(d.x + Math.sin(a) * 14.5, d.y + 4.4, d.z + Math.cos(a) * 14.5);
    cam.lookAt(d.x, d.y + 1.0, d.z);
  } else if (mode === 'HIGH OBLIQUE') {
    cam.fov = 40;
    cam.position.lerp(new THREE.Vector3(d.x - fx * 250 + 90, d.y + 330, d.z - fz * 250 + 90), 0.06);
    cam.lookAt(look);
  } else if (mode === 'TRACK SURFACE') {
    cam.fov = 40;
    cam.position.lerp(new THREE.Vector3(d.x + fz * 13 - fx * 7.5, d.y + 1.35, d.z - fx * 13 - fz * 7.5), 0.16);
    cam.lookAt(d.x, d.y + 0.55, d.z);
  } else if (mode === 'LANDMARK HERO') {
    cam.fov = 44;
    const a = t * 0.12;
    const dx = dom.x, dz = dom.z;
    cam.position.lerp(new THREE.Vector3(dx + Math.sin(a) * 270, 120, dz + Math.cos(a) * 270), 0.05);
    cam.lookAt(dx, 78, dz);
  } else if (mode.startsWith('CCTV')) {
    const c = cctv[Number(mode.slice(4)) - 1] || cctv[0];
    cam.fov = c.fov;
    cam.position.set(c.position.x, c.position.y, c.position.z);
    cam.lookAt(d.x, d.y + 1.2, d.z);
  }
  cam.updateProjectionMatrix();
}
