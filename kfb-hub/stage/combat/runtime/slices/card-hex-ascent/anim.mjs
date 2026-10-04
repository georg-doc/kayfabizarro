// Card-Hex Ascent · animation presenter. Exactly one AnimationMixer per actor.
// Presentation only: never writes the actor's world position (the controller / combat owner does).
import * as THREE from 'three';

// KAYKIT_LOCO_SET_01 phase-synced 1D speed blend (Motion SSOT PR #344).
export const LOCO = Object.freeze([
  { key: 'walk', clip: 'Walking_B', speed: 0.98, T: 1.067, lfd: 0 },
  { key: 'run', clip: 'Running_A', speed: 3.303, T: 0.8, lfd: 0.0833 },
  { key: 'sprint', clip: 'Running_B', speed: 5.255, T: 0.8, lfd: 0.125 },
]);
// carry_convert.json (BLENDER-DUEL-01), xyzw, applied on the weapon root under handslot.r during locomotion
export const CARRY = Object.freeze({
  pistol_carry_walk: [0.45449, -0.1937, 0.20524, 0.84486],
  pistol_carry_run: [0.24179, -0.13472, -0.06101, 0.95899],
  rifle_staff_walk: [0.20672, -0.16147, 0.73533, 0.62489],
  rifle_staff_run: [0.21404, -0.07063, 0.43171, 0.8734],
  rifle_staff_sprint: [0.14609, -0.21458, 0.50171, 0.82517],
});

export function locoWeights(speed) {
  const w = { idle: 0, walk: 0, run: 0, sprint: 0 };
  const [W, R, S] = LOCO;
  if (speed <= 0.05) w.idle = 1;
  else if (speed < W.speed) { const k = speed / W.speed; w.idle = 1 - k; w.walk = k; }
  else if (speed < R.speed) { const k = (speed - W.speed) / (R.speed - W.speed); w.walk = 1 - k; w.run = k; }
  else if (speed < S.speed) { const k = (speed - R.speed) / (S.speed - R.speed); w.run = 1 - k; w.sprint = k; }
  else w.sprint = 1;
  return w;
}

export class ActorAnimator {
  constructor(root, clips, { weapon = null, weaponKind = null } = {}) {
    this.root = root; this.mixer = new THREE.AnimationMixer(root); this.clips = clips;
    this.actions = new Map(); this.phase = 0; this.speed = 0; this.overlays = []; this.locoScale = 1; this.time = 0;
    for (const L of LOCO) { const a = this.action(L.clip); if (a) { a.play(); a.timeScale = 0; a.setEffectiveWeight(0); } }
    const idle = this.action('Idle_A'); if (idle) { idle.play(); idle.setEffectiveWeight(1); }
    this.handR = null; root.traverse(n => { if (!this.handR && /^handslot\.?r$/i.test(n.name)) this.handR = n; }); // GLTFLoader sanitizes 'handslot.r' → 'handslotr'
    this.weapon = null; this.weaponKind = null; if (weapon) this.mountWeapon(weapon, weaponKind);
  }
  action(name) {
    if (this.actions.has(name)) return this.actions.get(name);
    const clip = this.clips[name]; if (!clip) return null;
    const a = this.mixer.clipAction(clip); this.actions.set(name, a); return a;
  }
  has(name) { return !!this.clips[name]; }
  // Identity mount: the _KFB file root socket_grip_r goes onto handslot.r with no runtime roll/offset.
  mountWeapon(weaponRoot, kind) {
    if (this.weapon) this.weapon.removeFromParent();
    this.weapon = weaponRoot; this.weaponKind = kind;
    if (!weaponRoot) return;
    weaponRoot.position.set(0, 0, 0); weaponRoot.quaternion.identity(); weaponRoot.scale.set(1, 1, 1);
    (this.handR ?? this.root).add(weaponRoot);
    this.muzzle = null; this.barrel = null;
    weaponRoot.traverse(n => { if (n.name === 'socket_muzzle') this.muzzle = n; if (n.name === 'CombatMech_Minigun_Barrel') this.barrel = n; });
  }
  // Start an overlay clip. mode: 'once' (returns to loco), 'clamp' (hold last frame), 'loop'.
  play(name, { mode = 'once', fade = 0.15, timeScale = 1, from = 0, exclusive = true } = {}) {
    const a = this.action(name); if (!a) return null;
    a.reset(); a.enabled = true; a.timeScale = timeScale; a.time = from;
    a.setLoop(mode === 'loop' ? THREE.LoopRepeat : THREE.LoopOnce, Infinity); a.clampWhenFinished = mode !== 'loop';
    a.play();
    if (exclusive) for (const o of this.overlays) o.target = 0;
    let o = this.overlays.find(x => x.action === a);
    if (!o) { o = { action: a, name, w: 0, target: 1, fade, mode }; this.overlays.push(o); }
    o.target = 1; o.fade = fade; o.mode = mode; o.started = this.time;
    return a;
  }
  stop(name, fade = 0.2) { for (const o of this.overlays) if (!name || o.name === name) { o.target = 0; o.fade = fade; } }
  current() { let best = null; for (const o of this.overlays) if (o.target > 0 && (!best || o.started > best.started)) best = o; return best?.name ?? null; }
  isPlaying(name) { return this.overlays.some(o => o.name === name && o.target > 0); }
  progress(name) { const a = this.actions.get(name); return a ? a.time / a.getClip().duration : 0; }

  update(dt, speed) {
    this.time += dt; this.speed = speed;
    // overlay weights
    let sum = 0;
    for (const o of this.overlays) {
      if (o.mode === 'once' && o.target > 0) { const d = o.action.getClip().duration; if (o.action.time >= d - 1e-3 || !o.action.isRunning()) o.target = 0; }
      const rate = dt / Math.max(0.01, o.fade);
      o.w += Math.sign(o.target - o.w) * Math.min(Math.abs(o.target - o.w), rate);
      sum += o.w;
    }
    if (sum > 1) for (const o of this.overlays) o.w /= sum;
    this.overlays = this.overlays.filter(o => { if (o.w <= 1e-3 && o.target === 0) { o.action.stop(); o.action.setEffectiveWeight(0); return false; } o.action.setEffectiveWeight(o.w); return true; });
    sum = Math.min(1, this.overlays.reduce((s, o) => s + o.w, 0));
    this.locoScale = 1 - sum;
    // loco: phase-synced speed blend
    const w = locoWeights(speed); let num = 0, den = 0;
    for (const L of LOCO) { num += w[L.key] / L.T; den += w[L.key]; }
    if (den > 0) this.phase = (this.phase + dt * num / den) % 1;
    for (const L of LOCO) { const a = this.actions.get(L.clip); if (!a) continue; a.time = ((this.phase + L.lfd) % 1) * L.T; a.setEffectiveWeight(w[L.key] * this.locoScale); }
    const idle = this.actions.get('Idle_A'); if (idle) idle.setEffectiveWeight(w.idle * this.locoScale);
    this.mixer.update(dt);
    // carry mount blends toward identity as aim/shoot overlays take over
    if (this.weapon) {
      const key = this.weaponKind === 'blaster' ? (speed > 2 ? 'pistol_carry_run' : 'pistol_carry_walk')
        : this.weaponKind === 'rifle' ? (speed > 4.2 ? 'rifle_staff_sprint' : speed > 2 ? 'rifle_staff_run' : 'rifle_staff_walk') : null;
      if (key) { _q.fromArray(CARRY[key]); this.weapon.quaternion.slerpQuaternions(_id, _q, this.carryWeight ?? this.locoScale); }
    }
    if (this.barrel && this.spin) this.barrel.rotateZ(this.spin * dt * Math.PI * 2);
  }
  muzzleWorld(outPos, outDir) {
    if (!this.muzzle) return false;
    this.muzzle.updateWorldMatrix(true, false);
    outPos.setFromMatrixPosition(this.muzzle.matrixWorld);
    outDir.set(0, 0, 1).transformDirection(this.muzzle.matrixWorld);
    return true;
  }
  dispose() { this.mixer.stopAllAction(); this.mixer.uncacheRoot(this.root); }
}
const _q = new THREE.Quaternion(), _id = new THREE.Quaternion();
