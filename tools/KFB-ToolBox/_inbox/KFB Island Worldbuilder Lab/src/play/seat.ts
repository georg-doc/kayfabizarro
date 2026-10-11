// Stufe 2 · sichtbarer Fahrer (Steuerung 10.10.): the walking figure sits visibly in the car. Seat point from the figure card
// (kfb.character-card/1 `seat`, SPEC_CHARACTER_INTEGRITY_R1 §2), never by scaling the figure; the car adapts.
// Template: J17 VEHICLE_SEAT_CONTRACT (driver hips socket in the car frame, clip kfb_interaction_driving_a, Rig_Medium,
// local copy of KFB's motion library i06). This file measures the driving pose on the figure's own rig and the car's
// cabin, so card and seat can be written from numbers, not by eye.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const DRIVE_CLIP_URL = '/assets/kfb-motion/KFB_Motion_interaction_i06.glb', DRIVE_CLIP = 'kfb_interaction_driving_a';
let CLIP: Promise<THREE.AnimationClip | undefined> | null = null;
export const loadDriveClip = () => (CLIP ??= new GLTFLoader().loadAsync(DRIVE_CLIP_URL).then((g) => g.animations.find((a) => a.name === DRIVE_CLIP)));

/** the driving pose on this figure, in the figure root's frame (lab, +z forward): seat contact, hips, head top, knees, feet */
export async function measureDrivePose(figRoot: THREE.Object3D, obj: THREE.Object3D) {
  const clip = await loadDriveClip(); if (!clip) return null;
  const mx = new THREE.AnimationMixer(obj), a = mx.clipAction(clip); a.play(); mx.setTime(0.5);
  figRoot.updateMatrixWorld(true);
  const inv = figRoot.matrixWorld.clone().invert(), v = new THREE.Vector3();
  const hipsBone = obj.getObjectByName('hips')!, hips = hipsBone.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv);
  const sh = (obj.getObjectByName('upperarml') ?? obj.getObjectByName('upperarm.l'))!.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv);
  let seatY = Infinity, top = -Infinity, feetY = Infinity, kneeZ = -Infinity, backZ = Infinity, halfX = 0;
  obj.traverse((o) => {
    const m = o as THREE.SkinnedMesh; if (!m.isSkinnedMesh) return;
    const SI = m.geometry.attributes.skinIndex, SW = m.geometry.attributes.skinWeight, n = m.geometry.attributes.position.count;
    for (let i = 0; i < n; i++) {
      m.getVertexPosition(i, v); v.applyMatrix4(m.matrixWorld).applyMatrix4(inv);
      let bi = 0, bw = -1; for (let k = 0; k < 4; k++) { const w = SW.getComponent(i, k); if (w > bw) { bw = w; bi = SI.getComponent(i, k); } }
      const bn = m.skeleton.bones[bi]?.name ?? '';
      if (/^hips$|^upperleg/.test(bn) && v.y < hips.y) seatY = Math.min(seatY, v.y);   // the seat carries pelvis and thighs
      top = Math.max(top, v.y); feetY = Math.min(feetY, v.y); kneeZ = Math.max(kneeZ, v.z); backZ = Math.min(backZ, v.z); halfX = Math.max(halfX, Math.abs(v.x));
    }
  });
  a.stop(); mx.uncacheRoot(obj);
  return { hips: hips.toArray(), seatY, hipsAboveSeat: hips.y - seatY, shoulderAboveSeat: sh.y - seatY, headAboveSeat: top - seatY, feetBelowSeat: seatY - feetY, kneeFwd: kneeZ - hips.z, backBehind: hips.z - backZ, halfWidth: halfX };
}

/** the car's cabin in its own frame (lab): roof, window line (lowest glass), body, width at the cabin */
export function measureCabin(car: THREE.Object3D) {
  const q = car.quaternion.clone(), p = car.position.clone(); car.quaternion.identity(); car.position.set(0, 0, 0); car.updateMatrixWorld(true);
  const body = new THREE.Box3().setFromObject(car), glass = new THREE.Box3();
  car.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh && /glass/i.test(m.name)) glass.union(new THREE.Box3().setFromObject(m)); });   // Retro FBX: glass is a mesh (CICADA_LOW_GLASS), its material is not named
  car.quaternion.copy(q); car.position.copy(p); car.updateMatrixWorld(true);
  return { body: { min: body.min.toArray(), max: body.max.toArray() }, glass: glass.isEmpty() ? null : { min: glass.min.toArray(), max: glass.max.toArray() }, height: body.max.y - body.min.y, length: body.max.z - body.min.z, width: body.max.x - body.min.x };
}

export type SeatMode = 'closed' | 'open';
/** the driver's seat in the car frame (lab, +x left, +z forward): seat surface point under the hips, and the car scale the
 *  figure needs (the car adapts, never the figure). closed = the head stays under the roof, shoulders at the window sill;
 *  open = roof cut at the window line (cartoon cabrio, car keeps its size), shoulders a little above the sill. */
export function seatFor(cabin: ReturnType<typeof measureCabin>, pose: NonNullable<Awaited<ReturnType<typeof measureDrivePose>>>, mode: SeatMode) {
  const g = cabin.glass!, g0 = g.min[1], g1 = g.max[1], CLR = 0.02 * 3.64;   // head clearance under the roof: 0.02 H
  const s = mode === 'closed' ? Math.max(1, (pose.headAboveSeat - pose.shoulderAboveSeat + CLR) / (g1 - g0)) : 1;
  const y = mode === 'closed' ? s * g1 - CLR - pose.headAboveSeat : g0 - 0.75 * pose.shoulderAboveSeat;
  const x = 0.4 * s * (cabin.width / 3.113), z = -0.25 * s;   // driver left of centre (Retro cars: European), hips behind the cabin centre
  return { carScale: s, socket: [x, y, z] as [number, number, number], beltY: s * g0, roofInner: s * g1, headTop: y + pose.headAboveSeat, feetBottom: y - pose.feetBelowSeat, kneeZ: z + pose.kneeFwd, windshieldZ: s * g.max[2] };
}
