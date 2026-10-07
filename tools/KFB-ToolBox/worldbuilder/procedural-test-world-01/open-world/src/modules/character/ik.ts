// Analytic two-bone leg IK (upperleg → lowerleg → foot) for the Rig_Medium skeleton. Visual only: runs after the
// mixer has posed the model each frame (the mixer resets the bones next frame), keeps the foot's world orientation.
import * as THREE from 'three';

const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3();
const _ab = new THREE.Vector3(), _cb = new THREE.Vector3(), _axis = new THREE.Vector3();
const _q = new THREE.Quaternion(), _pq = new THREE.Quaternion(), _fq = new THREE.Quaternion();
const _v1 = new THREE.Vector3(), _v2 = new THREE.Vector3();

export interface Leg {
  upper: THREE.Object3D;
  lower: THREE.Object3D;
  foot: THREE.Object3D;
}

export function findLegs(model: THREE.Object3D): { l: Leg; r: Leg } | null {
  const g = (n: string) => model.getObjectByName(n) ?? null;
  const ul = g('upperlegl'), ll = g('lowerlegl'), fl = g('footl');
  const ur = g('upperlegr'), lr = g('lowerlegr'), fr = g('footr');
  if (!ul || !ll || !fl || !ur || !lr || !fr) return null;
  return { l: { upper: ul, lower: ll, foot: fl }, r: { upper: ur, lower: lr, foot: fr } };
}

/** Rotate a bone by a WORLD-space rotation q (about its own pivot). */
function rotateWorld(bone: THREE.Object3D, q: THREE.Quaternion): void {
  bone.parent!.getWorldQuaternion(_pq);
  // local' = parentW⁻¹ · q · parentW · local
  const inv = _pq.clone().invert();
  bone.quaternion.premultiply(_pq).premultiply(q).premultiply(inv);
  bone.updateMatrixWorld(true);
}

/** Move the ankle (foot bone origin) to `target` (world). Foot world orientation = `footWorldQ` or the animated one. */
export function solveLeg(leg: Leg, target: THREE.Vector3, footWorldQ?: THREE.Quaternion): void {
  if (footWorldQ) _fq.copy(footWorldQ);
  else leg.foot.getWorldQuaternion(_fq);
  leg.upper.getWorldPosition(_a);
  leg.lower.getWorldPosition(_b);
  leg.foot.getWorldPosition(_c);
  const la = _a.distanceTo(_b), lb = _b.distanceTo(_c);
  const lt = THREE.MathUtils.clamp(_a.distanceTo(target), Math.abs(la - lb) + 1e-3, la + lb - 1e-3);
  // 1. knee: set the angle at the knee for the hip→target distance
  _ab.subVectors(_a, _b);
  _cb.subVectors(_c, _b);
  const cur = _ab.angleTo(_cb);
  const want = Math.acos(THREE.MathUtils.clamp((la * la + lb * lb - lt * lt) / (2 * la * lb), -1, 1));
  _axis.crossVectors(_cb, _ab);
  if (_axis.lengthSq() < 1e-10) {
    // straight leg: bend about the hip's sideways axis
    _axis.set(1, 0, 0).applyQuaternion(leg.upper.getWorldQuaternion(_q));
  }
  _axis.normalize();
  // rotating (c−b) about axis by +θ moves it toward (a−b) (smaller angle)
  _q.setFromAxisAngle(_axis, cur - want);
  rotateWorld(leg.lower, _q);
  // 2. hip: swing the whole leg so the ankle lands on the target
  leg.foot.getWorldPosition(_c);
  _v1.subVectors(_c, _a).normalize();
  _v2.subVectors(target, _a).normalize();
  _q.setFromUnitVectors(_v1, _v2);
  rotateWorld(leg.upper, _q);
  // 3. foot keeps its animated world orientation
  leg.lower.getWorldQuaternion(_pq);
  leg.foot.quaternion.copy(_pq.invert().multiply(_fq));
  leg.foot.updateMatrixWorld(true);
}
