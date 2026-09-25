// ear-dangle.v1.js · KFB secondary motion for floppy chains (bunny ears, nose, antennae, tails)
// Runtime SSOT for the ear rig. Pure three.js, no mixer ownership: it LAYERS on top of whatever the
// AnimationMixer wrote this frame. Call update() after mixer.update() and after the character moved.
//
//   const ears = rigEars(characterRoot, rigJson);            // finds ear.l.* / ear.r.* (or a unit ear)
//   function tick(dt){ mixer.update(dt); controller.update(dt); root.updateMatrixWorld(true);
//                      ears.update(dt, { wind: carVelocityWorld.clone().negate() }); renderer.render(...) }
//
// Model: one damped angular spring per bone (pitch = forward/back, roll = sideways). The spring target is
// the "acted" pose (droop/fold/curl from the rig JSON or from an animation) plus the forces:
//   inertia from the linear acceleration of the chain's parent, lag from its angular velocity,
//   wind (world vector, m/s) as lean + speed-scaled flutter, optional gravity sag, and impulses (landings).
// Bone 1 can squash/stretch along the ear ("rubber").
import * as THREE from 'three';

export const DANGLE_DEFAULTS = Object.freeze({
  stiffness: [60, 38, 24],      // per bone, 1/s²  (lower = floppier)
  damping: [7, 5, 3.5],         // per bone, 1/s
  maxDeg: [40, 65, 80],         // per bone clamp of the spring offset
  inertia: 0.016,               // rad per (m/s²) of parent acceleration, grows along the chain
  spin: 0.05,                   // rad per (rad/s) of parent angular velocity (nod/shake throw)
  wind: 0.012,                  // rad per m/s of relative wind (lean)
  flutter: 0.0045,              // rad per m/s, noise amplitude
  gravity: 0.0,                 // 0..1 sag towards world-down when the head tilts (0 = cartoon stiff)
  elastic: 0.6,                 // rubber stretch of bone 1 (0 = off)
  stretchLimits: [0.65, 1.4],
  substep: 1 / 120,
});

const _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _qi = new THREE.Quaternion(), _e = new THREE.Euler();
const _p = new THREE.Vector3(), _s = new THREE.Vector3();
const defined = o => Object.fromEntries(Object.entries(o || {}).filter(([, v]) => v !== undefined && v !== null));

// distribute an acted pose over the chain (same rules as the Ear Rig Studio)
export function poseToAngles(pose, i, n = 3){
  const D = Math.PI / 180, p = { droop: 0, fold: 0, foldAt: 0.55, curl: 0, ...pose };
  const segC = (i + 0.5) / n;
  const w = Math.exp(-(((segC - p.foldAt) / 0.22) ** 2));
  return [((i === 0 ? p.droop : 0) + p.fold * w / 1.3) * D, -p.curl * (i === 0 ? 0.2 : 0.4) * D];
}

export class DangleChain {
  /** @param {THREE.Bone[]} bones root→tip; @param {{side?:'L'|'R', params?:object, pose?:object}} opt */
  constructor(bones, opt = {}){
    this.bones = bones.filter(Boolean);
    this.side = opt.side || 'L';
    // a right ear built as a mirrored copy of the left (negative scale, like the Ear Rig Studio) needs no sign flip
    this.mirror = this.side === 'R' && !opt.mirroredTransform ? -1 : 1;
    this.params = { ...DANGLE_DEFAULTS, ...defined(opt.params) };
    this.pose = { droop: 0, fold: 0, foldAt: 0.55, curl: 0, ...defined(opt.pose) };
    this.enabled = true;
    this.state = this.bones.map(b => ({ q0: b.quaternion.clone(), s0: b.scale.clone(), written: null, x: 0, z: 0, vx: 0, vz: 0 }));
    this.stretch = { s: 1, v: 0 };
    this._prevPos = null; this._prevVel = new THREE.Vector3(); this._acc = new THREE.Vector3();
    this._prevQ = null; this._omega = new THREE.Vector3();
    this._kick = new THREE.Vector2(); this._t = Math.random() * 10; this._acc0 = 0;
  }
  setPose(p){ Object.assign(this.pose, defined(p)); }
  setParams(p){ Object.assign(this.params, defined(p)); }
  /** one-off hit, e.g. landing: impulse({pitch: 1}) throws the tips forward/down by ~1 rad/s */
  impulse({ pitch = 0, roll = 0 } = {}){ for (const s of this.state) { s.vx += pitch; s.vz += roll * this.mirror; } }
  reset(){ for (const s of this.state) { s.x = s.z = s.vx = s.vz = 0; } this.stretch = { s: 1, v: 0 }; this._prevPos = null; }

  /** @param {number} dt seconds @param {{wind?:THREE.Vector3}} env wind = air velocity relative to the character, world m/s */
  update(dt, env = {}){
    if (!this.bones.length || !(dt > 0)) return;
    const parent = this.bones[0].parent;
    parent.updateWorldMatrix(true, false);
    parent.matrixWorld.decompose(_p, _q, _s);
    const inv = _qi.copy(_q).invert();                            // world → parent space (rotation only)

    // base pose: what the mixer wrote this frame, or the rest pose if no clip touches these bones
    this.state.forEach((s, i) => {
      const b = this.bones[i];
      if (s.written && b.quaternion.equals(s.written)) b.quaternion.copy(s.q0);
      else if (s.written) s.q0.copy(b.quaternion);                 // animated: follow the clip
    });

    // parent kinematics (finite differences, low-passed)
    if (!this._prevPos) { this._prevPos = _p.clone(); this._prevQ = _q.clone(); }
    const vel = _v.copy(_p).sub(this._prevPos).divideScalar(dt);
    const acc = vel.clone().sub(this._prevVel).divideScalar(dt);
    this._acc.lerp(acc, 0.25); this._prevVel.copy(vel); this._prevPos.copy(_p);
    const dq = this._prevQ.clone().invert().premultiply(_q);       // rotation since last frame (world)
    const ang = 2 * Math.acos(THREE.MathUtils.clamp(dq.w, -1, 1));
    const axis = new THREE.Vector3(dq.x, dq.y, dq.z); if (axis.lengthSq() > 1e-12) axis.normalize();
    this._omega.lerp(axis.multiplyScalar((ang > Math.PI ? ang - 2 * Math.PI : ang) / dt), 0.3);
    this._prevQ.copy(_q);

    const P = this.params, M = this.mirror;
    const aL = this._acc.clone().applyQuaternion(inv);             // parent-space acceleration
    const wL = this._omega.clone().applyQuaternion(inv);
    const windL = (env.wind || new THREE.Vector3()).clone().applyQuaternion(inv);
    const wspeed = windL.length();
    const downL = new THREE.Vector3(0, -1, 0).applyQuaternion(inv);

    let steps = Math.max(1, Math.ceil(dt / P.substep)); const h = dt / steps;
    while (steps--) {
      this._t += h;
      this.state.forEach((s, i) => {
        if (!this.enabled) { s.x = s.z = s.vx = s.vz = 0; return; }
        const g = 1 + i * 0.6;
        // + pitch = tip forward (+z), + roll = tip inward (towards -x for the left ear)
        let tx = (-aL.y * P.inertia - aL.z * P.inertia * 1.2) * g - wL.x * P.spin * g;
        let tz = (aL.x * P.inertia * 0.75 * M) * g + wL.z * P.spin * g * M;
        tx += windL.z * P.wind * (0.6 + i * 0.4);                  // air flowing backwards (-z, i.e. driving forward) pushes the tips back
        tz += -windL.x * P.wind * 0.5 * M;
        const fl = wspeed * P.flutter * (1 + i) * (Math.sin(this._t * (7 + i * 3.1) + i + (M < 0 ? 1.7 : 0)) + 0.5 * Math.sin(this._t * (13.3 + i * 5)));
        tx += fl; tz += fl * 0.6;
        if (P.gravity) { tx += downL.z * P.gravity * 0.8 * g; tz += -downL.x * P.gravity * 0.8 * M * g; }
        const k = P.stiffness[i] ?? P.stiffness.at(-1), c = P.damping[i] ?? P.damping.at(-1);
        s.vx += (k * (tx - s.x) - c * s.vx) * h; s.x += s.vx * h;
        s.vz += (k * (tz - s.z) - c * s.vz) * h; s.z += s.vz * h;
        const lim = (P.maxDeg[i] ?? P.maxDeg.at(-1)) * Math.PI / 180;
        s.x = THREE.MathUtils.clamp(s.x, -lim, lim); s.z = THREE.MathUtils.clamp(s.z, -lim, lim);
      });
      const st = this.stretch;
      if (!this.enabled || !P.elastic) { st.s = 1; st.v = 0; }
      else {
        const tgt = 1 - THREE.MathUtils.clamp(aL.y * 0.0035 * P.elastic, -0.35, 0.35);
        st.v += (90 * (tgt - st.s) - 6 * st.v) * h;
        st.s = THREE.MathUtils.clamp(st.s + st.v * h, P.stretchLimits[0], P.stretchLimits[1]);
      }
    }

    // write: base ∘ acted pose ∘ spring
    this.state.forEach((s, i) => {
      const b = this.bones[i];
      const [px, pz] = poseToAngles(this.pose, i, this.bones.length);
      b.quaternion.copy(s.q0).multiply(_q.setFromEuler(_e.set(px + s.x, 0, pz * this.mirror + s.z)));
      s.written = b.quaternion.clone();
    });
    const b0 = this.bones[0], s0 = this.state[0].s0, sq = 1 / Math.sqrt(Math.max(0.3, this.stretch.s));
    b0.scale.set(s0.x * sq, s0.y * this.stretch.s, s0.z * sq);
  }
}

/** Find ear chains in a character and build both dangles from a kfb.ear-rig.v0 JSON (optional). */
export function rigEars(root, rigJson){
  const found = { L: [], R: [] };
  root.traverse(o => {
    if (!o.isBone) return;
    const k = o.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    let m = k.match(/^ear([lr])([123])$/);                         // ear.l.1 … (combined model)
    if (m) found[m[1].toUpperCase()][+m[2] - 1] = o;
  });
  const cfg = rigJson && rigJson.ears ? rigJson.ears : {};
  const mk = side => {
    const e = cfg[side] || {};
    const stiff = e.stiff ?? 1, damp = e.damp ?? 1;
    return new DangleChain(found[side], {
      side,
      pose: { droop: e.droop, fold: e.fold, foldAt: e.foldAt, curl: e.curl },
      params: {
        stiffness: DANGLE_DEFAULTS.stiffness.map(k => k * stiff),
        damping: DANGLE_DEFAULTS.damping.map(c => c * damp * Math.sqrt(stiff)),
        elastic: e.elastic ?? DANGLE_DEFAULTS.elastic,
        wind: DANGLE_DEFAULTS.wind * (e.wind ?? 1), flutter: DANGLE_DEFAULTS.flutter * (e.wind ?? 1),
      },
    });
  };
  const L = mk('L'), R = mk('R');
  return {
    L, R,
    update(dt, env){ L.update(dt, env); R.update(dt, env); },
    impulse(p){ L.impulse(p); R.impulse(p); },
    setEnabled(on){ L.enabled = R.enabled = on; },
  };
}

/**
 * Bake the dangle into a clip (for GLB export or engines without the runtime module).
 * Plays `clip` on `mixer` at `fps`, runs the dangle each frame and records ear quaternion/scale tracks.
 * Returns a new AnimationClip = original tracks + ear tracks.
 */
export function bakeDangle(mixer, clip, chains, { fps = 60, env = () => ({}) } = {}){
  const action = mixer.clipAction(clip); action.reset().play();
  const root = mixer.getRoot();
  const n = Math.max(2, Math.round(clip.duration * fps) + 1), dt = 1 / fps;
  const rec = new Map();
  for (const ch of chains) for (const b of ch.bones) rec.set(b, { t: [], q: [], s: [] });
  mixer.setTime(0); chains.forEach(c => c.reset());
  for (let f = 0; f < n; f++) {
    if (f) mixer.update(dt);
    root.updateMatrixWorld(true);
    for (const c of chains) c.update(dt, env(f * dt));
    for (const [b, r] of rec) { r.t.push(f * dt); r.q.push(...b.quaternion.toArray()); r.s.push(...b.scale.toArray()); }
  }
  action.stop();
  const tracks = clip.tracks.filter(t => ![...rec.keys()].some(b => t.name.startsWith(b.name + '.')));
  for (const [b, r] of rec) {
    tracks.push(new THREE.QuaternionKeyframeTrack(b.name + '.quaternion', r.t, r.q));
    tracks.push(new THREE.VectorKeyframeTrack(b.name + '.scale', r.t, r.s));
  }
  return new THREE.AnimationClip(clip.name + '+dangle', clip.duration, tracks);
}
