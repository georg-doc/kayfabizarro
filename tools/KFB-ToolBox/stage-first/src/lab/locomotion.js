/* lab/locomotion.js · KFB Animation Lab v1 · Sprint 3
   Lab-only locomotion test bed. Not a game controller, not a production input contract.

   One owner rule: this module owns the CharacterRoot transform. Clips are played for looks only —
   root motion inside the clips is never applied, it is measured and reported elsewhere.

   All speeds are lab values for judging animations, not tuned gameplay numbers. */

export const PARAMS = { walk: 1.45, run: 3.4, back: 1.0, strafe: 1.6, turn: 2.4, jumpV: 4.4, gravity: -11.5, fade: 0.16,
  /* held Space stretches the rise (Mario rule: input answers at once, airtime scales with hold) */
  holdMax: 0.30, holdGravity: 0.42, longAfter: 0.15, runJumpBoost: 1.15 };

/* Semantic state → candidate clip names, in order of preference. Real KayKit names only. */
export const CANDIDATES = {
  idle: ['Idle_A', 'Idle_B'],
  walk: ['Walking_A', 'Walking_B', 'Walking_C'],
  run: ['Running_A', 'Running_B'],
  back: ['Walking_Backwards'],
  strafeL: ['Running_Strafe_Left'],
  strafeR: ['Running_Strafe_Right'],
  jumpStart: ['Jump_Start'],
  jumpAir: ['Jump_Idle'],
  jumpLand: ['Jump_Land'],
  jumpFull: ['Jump_Full_Short', 'Jump_Full_Long'],
  jumpFullLong: ['Jump_Full_Long'],
};

export class Locomotion {
  constructor(opts) {
    this.THREE = opts.THREE; this.root = opts.root; this.mixer = opts.mixer;
    this.clips = opts.clips || {}; this.p = Object.assign({}, PARAMS, opts.params);
    this.facing = opts.facing || 1;
    this.mode = opts.mode === 'full' ? 'full' : 'chain';
    this.actions = {}; this.cur = null; this.phase = 'ground'; this.vy = 0; this.y = 0;
    this.state = 'idle'; this.wantJump = false; this.holdT = 0; this.swapped = false;
    this.home = { x: this.root.position.x, z: this.root.position.z, ry: this.root.rotation.y };
    for (const k of Object.keys(this.clips)) {
      const cl = this.clips[k]; if (!cl) continue;
      const a = this.mixer.clipAction(cl);
      a.loop = (k === 'jumpStart' || k === 'jumpLand' || k === 'jumpFull' || k === 'jumpFullLong') ? this.THREE.LoopOnce : this.THREE.LoopRepeat;
      a.clampWhenFinished = a.loop === this.THREE.LoopOnce;
      this.actions[k] = a;
    }
  }
  has(k) { return !!this.actions[k]; }
  setMode(m) { this.mode = m === 'full' ? 'full' : 'chain'; }
  jump() { this.wantJump = true; }
  reset() { this.root.position.set(this.home.x, 0, this.home.z); this.root.rotation.y = this.home.ry; this.vy = 0; this.y = 0; this.phase = 'ground'; }
  dispose() { for (const k in this.actions) this.actions[k].stop(); this.root.position.y = 0; }

  play(key, restart) {
    const a = this.actions[key]; if (!a) { this.state = key; return; }
    if (this.cur === a && !restart) { this.state = key; return; }
    a.reset(); a.enabled = true; a.setEffectiveWeight(1); a.play();
    if (this.cur && this.cur !== a) a.crossFadeFrom(this.cur, this.p.fade, false);
    this.cur = a; this.state = key;
  }
  done(key) { const a = this.actions[key]; return !a || !a.isRunning() || a.time >= a.getClip().duration - 1e-3; }

  update(dt, keys) {
    const { THREE } = this, p = this.p, r = this.root;
    const turn = (keys.q ? 1 : 0) - (keys.e ? 1 : 0);
    if (turn) r.rotation.y += turn * p.turn * dt;
    const fwd = (keys.w ? 1 : 0) - (keys.s ? 1 : 0);
    const side = (keys.a ? 1 : 0) - (keys.d ? 1 : 0);
    const running = !!keys.shift && fwd > 0;
    let speed = 0;
    if (fwd > 0) speed = running ? p.run : p.walk; else if (fwd < 0) speed = p.back; else if (side) speed = p.strafe;
    if (speed) {
      const v = new THREE.Vector3(side * this.facing, 0, fwd * this.facing).normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), r.rotation.y);
      r.position.addScaledVector(v, speed * dt);
    }
    /* jump: the lab owns the arc, the clip only dresses it */
    if (this.wantJump) {
      this.wantJump = false;
      if (this.phase === 'ground') {
        this.vy = p.jumpV * (running ? p.runJumpBoost : 1);
        this.holdT = 0; this.swapped = false;
        this.phase = this.mode === 'full' ? 'full' : 'start';
        this.play(this.mode === 'full' ? 'jumpFull' : 'jumpStart', true);
      }
    }
    if (this.phase === 'start' || this.phase === 'air' || this.phase === 'full') {
      const holding = !!keys.space && this.vy > 0 && this.holdT < p.holdMax;
      if (holding) this.holdT += dt;
      this.vy += p.gravity * (holding ? p.holdGravity : 1) * dt;
      this.y += this.vy * dt;
      /* a long hold earns the long clip, if the pack has one */
      if (this.phase === 'full' && !this.swapped && this.holdT >= p.longAfter && this.has('jumpFullLong') && this.actions.jumpFullLong !== this.cur) { this.play('jumpFullLong', true); this.swapped = true; }
      if (this.y <= 0) { this.y = 0; this.vy = 0; this.phase = this.mode === 'full' ? 'ground' : 'land'; if (this.phase === 'land') this.play('jumpLand', true); }
      else if (this.phase === 'start' && this.done('jumpStart')) { this.phase = 'air'; this.play('jumpAir', true); }
    }
    if (this.phase === 'land' && this.done('jumpLand')) this.phase = 'ground';
    if (this.phase === 'full' && this.y <= 0) this.phase = 'ground';
    r.position.y = this.y;

    if (this.phase === 'ground') {
      if (fwd > 0) this.play(running && this.has('run') ? 'run' : 'walk');
      else if (fwd < 0) this.play(this.has('back') ? 'back' : 'walk');
      else if (side > 0) this.play(this.has('strafeL') ? 'strafeL' : 'walk');
      else if (side < 0) this.play(this.has('strafeR') ? 'strafeR' : 'walk');
      else this.play('idle');
    }
    return { state: this.state, phase: this.phase, speed, hold: this.holdT, clip: this.cur ? this.cur.getClip().name : null, pos: r.position, airborne: this.y > 0.001 };
  }
}
