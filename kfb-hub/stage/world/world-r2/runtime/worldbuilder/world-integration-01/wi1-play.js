/* KFB WorldBuilder · WORLD-INTEGRATION-01 · PLAY in the same world · r2 (continuation 2026-09-25)
   Movement owner: travel/KFB Travel Combat v25/terrain-v25/walk-controller.js — imported UNCHANGED.
   Only its documented `params` / setParams are used. The controller translates; this module decides the
   commanded ground speed per frame (gait governor) and lets the animation FOLLOW the measured travel.

   r2 findings / changes
   · walk-controller normalises the input vector (`_move.normalize()`), so r1's "scaled iy" for backward did
     nothing: backward walked at full walk speed. Speed is now commanded through `setParams({speed})` —
     the controller's own parameter — every frame; `sprintMul` stays 1 (tiers are explicit).
   · Tiers (KayKit 1.1 canon, see wi1-actor.js): idle · walk · walk.fast* · run · sprint* · backward ·
     backward.fast* · strafe.walk* · strafe · crouch · sneak · crawl · jump.start/air/land  (* = playback variant)
   · World speed of a tier = measured planted-foot speed of its source clip × playback rate. Playback rate
     at runtime = measured travel ÷ measured clip speed → feet stay planted during ramps too.
   · State from MOVEMENT with hysteresis bands + minimum dwell; cyclic → cyclic crossfades are phase-synced
     on the left-foot touchdown (wi1-actor play()).
   Controls: W/S forward/back · A/D turn · Q/E strafe · Shift run (hold → sprint) · hold W → walk.fast ·
   C crouch · Z sneak · X crawl (toggles) · Space jump. */
import * as THREE from 'three';
import { makeActor, VARIANTS } from './wi1-actor.js';

const WALK_URL = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@053bc922bfb7f3ee22195e22c35a62eb9aada4eb/travel/KFB%20Travel%20Combat%20v25/terrain-v25/walk-controller.js';
const r2 = (v) => +(+v).toFixed(2);
const med = (a) => { if (!a.length) return 0; const b = a.slice().sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; };
const angLerp = (a, b, k) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return a + d * k; };
const CYC = new Set(['walk', 'run', 'sprint', 'backward', 'strafe.left', 'strafe.right', 'crouch', 'sneak', 'crawl']);
/* the clip a tier plays + its variant rate relative to the World's base tier rate */
const TIER = {
  idle: { clip: 'idle' }, walk: { clip: 'walk' }, 'walk.fast': { clip: 'walk', variant: 'walk.fast' },
  run: { clip: 'run' }, sprint: { clip: 'sprint' },
  backward: { clip: 'backward' }, 'backward.fast': { clip: 'backward', variant: 'backward.fast' },
  'strafe.walk': { clip: 'strafe', variant: 'strafe.walk' }, strafe: { clip: 'strafe' },
  crouch: { clip: 'crouch' }, sneak: { clip: 'sneak' }, crawl: { clip: 'crawl' }
};
export const TRANSITIONS = [
  ['idle → walk', 'move input · crossfade 0.20 s'],
  ['walk ↔ walk.fast', 'same clip · playback follows speed · label band ±4 %'],
  ['walk.fast ↔ run', 'speed band (mid ±5 %) · min dwell 0.12 s · phase-synced crossfade 0.24 s'],
  ['run ↔ sprint', 'ToolBox profile source clip · Shift held ≥ paceUp · label band ±4 %'],
  ['forward ↔ backward / strafe', 'travel direction relative to heading · phase-synced 0.20 s'],
  ['stand ↔ crouch / sneak / crawl', 'C / Z / X toggle · crossfade 0.25 s · hold = double-support frame'],
  ['any ground → jump.start', 'controller take-off (vy > 0.5 or airborne > 0.12 s)'],
  ['jump.start → jump.air', 'apex (controller vy ≤ 0) or clip end, whichever first'],
  ['jump.air → jump.land', 'controller onGround (contact)'],
  ['jump.land → ground state', 'clip end, or 0.25 s when moving'],
  ['loco → idle', 'travel < 0.06 m/s · crossfade 0.22 s · decel coast ≤ 5.5 m/s²']
];

export async function makePlay({ scene, camera, dom, groundAt, obstacles, hud, log = () => {} }) {
  const WC = await import(WALK_URL);
  const actor = await makeActor({ scene, camera, log });
  const prop = (k, d) => { const v = (window.__wb2dProps || {})[k]; return v == null ? d : v; };
  const TUNE = {
    cadence: THREE.MathUtils.clamp(+prop('walkCadence', 1.35), 0.8, 2),
    paceUp: !!prop('paceUp', true), paceUpAfter: 1.1,
    sprint: !!prop('sprint', true),
    accel: 3.2, decel: 5.5
  };
  const V = {};
  function retune() {
    const nat = (s, d) => actor.native(s) || d;
    const sl = actor.measured('strafe.left'), sr = actor.measured('strafe.right');
    V.cadence = TUNE.cadence;
    V.walk = nat('walk', 0.55) * TUNE.cadence;
    V['walk.fast'] = V.walk * VARIANTS['walk.fast'].rate;
    V.run = nat('run', 2.2);
    V.sprint = TUNE.sprint ? nat('sprint', V.run * 1.15) : V.run;
    V.backward = nat('backward', 0.55) * TUNE.cadence;
    V['backward.fast'] = V.backward * VARIANTS['backward.fast'].rate;
    V.strafe = ((sl ? sl.speed : 0) + (sr ? sr.speed : 0)) / ((sl ? 1 : 0) + (sr ? 1 : 0) || 1) || 2.0;
    V['strafe.walk'] = V.strafe * VARIANTS['strafe.walk'].rate;
    for (const p of ['crouch', 'sneak', 'crawl']) { const m = actor.measured(p); V[p] = m && !m.inPlace ? m.speed : 0; }
    if (V['walk.fast'] > V.run * 0.8) V['walk.fast'] = V.run * 0.8;
    const mid = (V['walk.fast'] + V.run) / 2;
    V.upRun = mid * 1.05; V.downRun = mid * 0.95;
    V.back = V.backward;   // r1 name (Scene facts)
  }
  retune();
  const params = {
    speed: V.walk, sprintMul: 1, gravity: 22, eyeUp: 1.45, turnRate: 2.4,
    stepMax: 0.36, autoJumpMax: 0.75, hopClear: 0.22, radius: 0.32, probeStep: 0.15, probeMax: 1.6,
    windup: 1 / 120, windupSlow: 1,   // Jump_Start carries the anticipation (Lab rule)
    stepUpSpeed: 5, bounce: 0, bounceMin: 99, bounceMax: 0,
    floatMin: 2, floatMax: 8, minD: 2.2, maxD: 16, minP: 0.05, maxP: 1.25
  };
  const walker = WC.createWalkController({ THREE, params });
  walker.setCamDist(6.2);
  addEventListener('wb2d-props', (e) => {
    const d = e.detail || {};
    if (d.walkCadence != null) TUNE.cadence = THREE.MathUtils.clamp(+d.walkCadence, 0.8, 2);
    if (d.paceUp != null) TUNE.paceUp = !!d.paceUp;
    if (d.sprint != null) TUNE.sprint = !!d.sprint;
    if (d.motionSet && d.motionSet !== actor.motionSet) actor.setMotionSet(d.motionSet);
    retune();
  });

  const obs = []; let obsT = 0;
  const refreshObstacles = () => { obs.length = 0; for (const r of obstacles()) { const b = new THREE.Box3().setFromObject(r, false); if (Number.isFinite(b.min.x)) obs.push(b); } };
  const ground = (x, z) => {
    let h = groundAt(x, z);
    for (const b of obs) if (x >= b.min.x && x <= b.max.x && z >= b.min.z && z <= b.max.z) h = Math.max(h, b.max.y);
    return h;
  };

  const keys = {}; let on = false, drag = null;
  const M = {
    state: 'idle', tier: 'idle', clip: 'idle', ts: 1, speed: 0, vis: 0, yaw: 0, airT: 0, jump: 'ground', restart: false,
    cmd: 0, last: { ix: 0, iy: 0 }, cls: null, holdW: 0, holdShift: 0, dwell: 0, family: 'idle', posture: 'stand', eye: 1.45,
    prev: new THREE.Vector3(), dir: new THREE.Vector3()
  };
  const slip = {};
  const feet = ['l', 'r'].map((s) => { let b = null; actor.figure.traverse((o) => { if (!b && o.isBone && new RegExp('^foot[._]?' + s + '$', 'i').test(o.name)) b = o; }); return b; }).filter(Boolean);
  const footPrev = feet.map(() => new THREE.Vector3()), footMin = feet.map(() => Infinity), tmp = new THREE.Vector3(), right = new THREE.Vector3();
  const contact = feet.map(() => ({ on: false, t: 0, p: new THREE.Vector3(), state: null }));

  function input() {
    if (!on) return { ix: 0, iy: 0, turn: 0, shift: false };
    const fw = keys.KeyW || keys.ArrowUp, bk = keys.KeyS || keys.ArrowDown;
    return { ix: (keys.KeyE ? 1 : 0) - (keys.KeyQ ? 1 : 0), iy: fw && !bk ? 1 : bk && !fw ? -1 : 0, turn: ((keys.KeyA || keys.ArrowLeft) ? 1 : 0) - ((keys.KeyD || keys.ArrowRight) ? 1 : 0), shift: !!(keys.ShiftLeft || keys.ShiftRight) };
  }
  function setPosture(p) { M.posture = M.posture === p || !actor.actions[p] ? 'stand' : p; }

  /* intent → tier + target speed (the governor). Movement then happens in the controller. */
  function intent(dt, inp) {
    const moving = inp.ix !== 0 || inp.iy !== 0;
    const cls = !moving ? null : inp.iy > 0 ? 'fwd' : inp.iy < 0 ? 'back' : 'lat';
    M.holdW = cls === 'fwd' && !inp.shift ? M.holdW + dt : 0;
    M.holdShift = moving && inp.shift ? M.holdShift + dt : 0;
    let tier = 'idle';
    if (moving) {
      if (M.posture !== 'stand') tier = V[M.posture] > 0 ? M.posture : ['sneak', 'crouch'].find((p) => V[p] > 0) || 'walk';
      else if (cls === 'fwd') tier = inp.shift ? (TUNE.sprint && M.holdShift > TUNE.paceUpAfter ? 'sprint' : 'run') : (TUNE.paceUp && M.holdW > TUNE.paceUpAfter ? 'walk.fast' : 'walk');
      else if (cls === 'back') tier = inp.shift ? 'backward.fast' : 'backward';
      else tier = inp.shift ? 'strafe' : 'strafe.walk';
    }
    if (cls && M.cls && cls !== M.cls) M.cmd = Math.min(M.cmd, V[tier] || 0);   // direction class change: no carried-over run speed
    if (cls) M.cls = cls;
    const target = moving ? (V[tier] || 0) : 0;
    const dv = target - M.cmd; M.cmd += THREE.MathUtils.clamp(dv, -TUNE.decel * dt, TUNE.accel * dt);
    let ix = inp.ix, iy = inp.iy;
    if (moving) M.last = { ix, iy };
    else if (M.cmd > 0.3 && walkerOnGround()) { ix = M.last.ix; iy = M.last.iy; }   // coast down: decel is travel, not a cut
    else { M.cmd = 0; M.cls = null; }
    M.intentTier = tier;
    return { ix, iy };
  }
  const walkerOnGround = () => walker.state.onGround;

  function step(dt, inp) {
    obsT -= dt; if (obsT <= 0) { obsT = 0.25; refreshObstacles(); }
    M.prev.copy(walker.state.position);
    const mv = intent(dt, inp);
    walker.setParams({ speed: Math.max(M.cmd, 0.02), sprintMul: 1 });
    walker.setInput(mv.ix, mv.iy);
    walker.update(dt, { turn: inp.turn, sprint: false }, ground);
    const st = walker.state;
    M.dir.subVectors(st.position, M.prev).setY(0);
    const inst = M.dir.length() / Math.max(dt, 1e-4);
    M.speed += (inst - M.speed) * Math.min(1, dt * 14);
    M.vis += ((st.onGround ? inst : M.speed) - M.vis) * Math.min(1, dt * 20);
    M.dwell += dt;
    const done = (k) => { const x = actor.actions[k]; return !x || !x.isRunning() || x.time >= x.getClip().duration - 1e-3; };
    /* jump chain = KFB Animation Lab v1 rule: the controller owns the arc, the clips dress it */
    if (!st.onGround && M.jump === 'ground' && (st.vy > 0.5 || M.airT > 0.12)) { M.jump = 'start'; M.restart = true; M.posture = 'stand'; }
    if (M.jump === 'start' && !M.restart && (done('jump.start') || (!st.onGround && st.vy <= 0))) M.jump = 'air';   // rising = start · falling (past apex) = air · contact = land
    if ((M.jump === 'start' || M.jump === 'air') && st.onGround) { M.jump = actor.actions['jump.land'] ? 'land' : 'ground'; M.restart = true; }
    const moving = M.speed > (M.family === 'idle' ? 0.1 : 0.06);
    if (M.jump === 'land' && !M.restart && (done('jump.land') || (moving && actor.actions['jump.land'].time > 0.25))) M.jump = 'ground';
    M.airT = st.onGround ? 0 : M.airT + dt;
    /* ground state from the MOVEMENT (direction relative to heading + measured speed, hysteresis) */
    const d = M.dir.lengthSq() > 1e-8 ? M.dir.clone().normalize() : null;
    const fwdDot = d ? d.dot(st.forward) : 1;
    right.set(-Math.cos(st.heading), 0, Math.sin(st.heading));
    const latDot = d ? d.dot(right) : 0;
    let tier = 'idle', clip = 'idle', family = 'idle', hold = null;
    if (M.posture !== 'stand') {
      const p = M.posture;
      if (moving && V[p] > 0) { tier = p; clip = p; family = p; }
      else if (moving) { tier = M.intentTier; clip = TIER[tier] ? TIER[tier].clip : 'walk'; family = tier; }
      else { tier = p + '.hold'; clip = p; family = p + '.hold'; const m = actor.measured(p); hold = m ? m.holdPhase : 0; }
    } else if (moving) {
      const S = M.vis;
      if (fwdDot < -0.5) { family = 'backward'; tier = S > (V.backward + V['backward.fast']) / 2 ? 'backward.fast' : 'backward'; clip = 'backward'; }
      else if (Math.abs(latDot) > 0.8 && Math.abs(fwdDot) < 0.5) {
        family = 'strafe';
        /* pick the strafe clip whose MEASURED travel direction matches the actual travel (heading-local x) */
        const rel = d ? Math.atan2(d.x, d.z) - st.heading : 0, localX = Math.sin(rel);
        const L = actor.measured('strafe.left'), Rr = actor.measured('strafe.right');
        clip = L && Rr ? (Math.sign(L.dir[0]) === Math.sign(localX) ? 'strafe.left' : 'strafe.right') : localX > 0 ? 'strafe.left' : 'strafe.right';
        tier = S > (V.strafe + V['strafe.walk']) / 2 ? 'strafe' : 'strafe.walk';
      } else {
        const inRun = M.family === 'run';
        const run = inRun ? S > V.downRun : S > V.upRun;
        family = run ? 'run' : 'walk';
        if (family !== M.family && M.dwell < 0.12 && (M.family === 'run' || M.family === 'walk')) family = M.family;
        clip = family;
        if (family === 'run') { const b = (V.run + V.sprint) / 2; tier = V.sprint > V.run * 1.02 && (M.tier === 'sprint' ? S > b * 0.96 : S > b * 1.04) ? 'sprint' : 'run'; }
        else { const b = (V.walk + V['walk.fast']) / 2; tier = M.tier === 'walk.fast' ? (S > b * 0.96 ? 'walk.fast' : 'walk') : (S > b * 1.04 ? 'walk.fast' : 'walk'); }
      }
    }
    const enteredFamily = family !== M.family;
    if (enteredFamily) M.dwell = 0;
    M.family = family;
    let next = M.jump === 'start' ? 'jump.start' : M.jump === 'air' ? 'jump.air' : M.jump === 'land' ? 'jump.land' : clip;
    let ts = 1;
    if (!next.startsWith('jump') && CYC.has(clip)) {
      const nat = actor.native(clip);
      ts = hold != null ? 0 : nat ? THREE.MathUtils.clamp(M.vis / nat, 0.35, 2.4) : 1;
    }
    const fade = next.startsWith('jump') ? 0.08 : next === 'idle' ? 0.22 : M.posture !== 'stand' || hold != null ? 0.25 : (clip === 'run' || clip === 'walk') && (actor.state === 'run' || actor.state === 'walk') ? 0.24 : 0.2;
    actor.play(next, ts, fade, M.restart, hold != null && enteredFamily ? { hold } : {});
    M.restart = false;
    M.state = next.startsWith('jump') ? next : tier; M.clip = next; M.tier = tier; M.ts = ts;
    /* presentation: body faces heading; forward diagonals turn toward travel (no diagonal clip in the source).
       Strafe: KayKit Running_Strafe_* sweep the planted foot at ±61° from forward (measured), not 90° —
       the body turns so the clip's own travel direction lies on the actual travel: no sideways skate. */
    let yawT = st.heading;
    if (d && inst > 0.05 && M.speed > 0.06 && fwdDot > 0.3 && st.onGround && family !== 'strafe') yawT = Math.atan2(M.dir.x, M.dir.z);
    if (d && family === 'strafe' && M.speed > 0.06) { const m = actor.measured(clip); yawT = Math.atan2(d.x, d.z) - (m ? m.dirDeg * Math.PI / 180 : 0); }
    M.yaw = angLerp(M.yaw, yawT, Math.min(1, dt * 12));
    M.eye += ((M.posture === 'crawl' ? 0.7 : M.posture === 'crouch' ? 1.05 : M.posture === 'sneak' ? 1.2 : 1.45) - M.eye) * Math.min(1, dt * 6);
    actor.holder.position.copy(st.position);
    actor.holder.rotation.set(0, M.yaw, 0);
    actor.update(dt);
    measureSlip(dt, st);
    return st;
  }

  function measureSlip(dt, st) {
    actor.holder.updateMatrixWorld(true);
    const key = M.state;
    const s = slip[key] || (slip[key] = { v: [], speed: 0, n: 0, drift: 0, time: 0, steps: 0 });
    feet.forEach((f, i) => {
      f.getWorldPosition(tmp);
      const rel = tmp.y - st.position.y;
      footMin[i] = Math.min(footMin[i] + dt * 0.02, rel);
      const c = contact[i], inC = st.onGround && rel < footMin[i] + 0.03;
      if (inC && footPrev[i].lengthSq() > 0) {
        const v = Math.hypot(tmp.x - footPrev[i].x, tmp.z - footPrev[i].z) / Math.max(dt, 1e-4);
        if (v < 20 && s.v.length < 4000) { s.v.push(v); s.n++; s.speed += M.speed; }
        if (!c.on) { c.on = true; c.t = 0; c.p.copy(tmp); c.state = key; }
        else c.t += dt;
      } else if (c.on) {
        c.on = false;
        const cs = slip[c.state];
        if (cs && c.t > 0.08) { cs.drift += Math.hypot(tmp.x - c.p.x, tmp.z - c.p.z); cs.time += c.t; cs.steps++; }
      }
      footPrev[i].copy(tmp);
    });
  }

  const C = { yawOff: 0, pitch: 0.38, dist: 6.2 };
  const camTarget = new THREE.Vector3(), camWant = new THREE.Vector3();
  function follow(dt, snap) {
    const st = walker.state, c = C, yaw = st.heading + c.yawOff;
    camTarget.copy(st.position); camTarget.y += M.eye;
    camWant.set(-Math.sin(yaw) * Math.cos(c.pitch) * c.dist, Math.sin(c.pitch) * c.dist, -Math.cos(yaw) * Math.cos(c.pitch) * c.dist).add(camTarget);
    camWant.y = Math.max(camWant.y, ground(camWant.x, camWant.z) + 0.6);
    if (snap) camera.position.copy(camWant); else camera.position.lerp(camWant, 1 - Math.exp(-dt * 9));
    camera.lookAt(camTarget);
  }

  const kd = (e) => {
    if (!on) return;
    const t = String(e.target?.tagName || '').toLowerCase(); if (t === 'input' || t === 'textarea' || t === 'select') return;
    keys[e.code] = true;
    if (e.code === 'Space') { e.preventDefault(); if (!e.repeat) { if (M.posture !== 'stand') M.posture = 'stand'; walker.jump(); } }
    if (!e.repeat && e.code === 'KeyC') setPosture('crouch');
    if (!e.repeat && e.code === 'KeyZ') setPosture('sneak');
    if (!e.repeat && e.code === 'KeyX') setPosture('crawl');
    if (/^Key[WASDQECZX]$|^Arrow|^Space$/.test(e.code)) e.preventDefault();
  };
  const ku = (e) => { keys[e.code] = false; };
  addEventListener('keydown', kd); addEventListener('keyup', ku);
  addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
  dom.addEventListener('pointerdown', (e) => { if (!on) return; drag = { x: e.clientX, y: e.clientY }; });
  addEventListener('pointermove', (e) => { if (!on || !drag) return; C.yawOff -= (e.clientX - drag.x) * 0.006; C.pitch = THREE.MathUtils.clamp(C.pitch + (e.clientY - drag.y) * 0.005, -0.45, 1.5); drag = { x: e.clientX, y: e.clientY }; });
  addEventListener('pointerup', () => { drag = null; });
  dom.addEventListener('wheel', (e) => { if (!on) return; e.preventDefault(); C.dist = THREE.MathUtils.clamp(C.dist * Math.exp(Math.max(-240, Math.min(240, e.deltaY)) * 0.0015), 1.2, 80); }, { passive: false });

  function clipLabel() {
    const c = actor.report.clips[M.clip]; if (!c) return M.clip;
    const t = TIER[M.tier], v = t && t.variant ? ' · variant' : '';
    return c.name + v;
  }
  function paintHud() {
    if (!hud) return;
    const s = slip[M.state], sl = s && s.time > 0.3 ? r2(s.drift / s.time) : null;
    hud.textContent = M.state + (M.posture !== 'stand' && !M.state.startsWith(M.posture) ? ' [' + M.posture + ']' : '') + ' · ' + clipLabel() + ' ×' + r2(Math.abs(M.ts)) + ' · ' + r2(M.speed) + ' m/s' + (sl != null && M.speed > 0.2 ? ' · skate ' + sl : '');
  }

  /* the consumed locomotion profile, one row per tier (facts, not a second Animation Lab) */
  function profile() {
    const rows = [];
    for (const [tier, t] of Object.entries(TIER)) {
      const clipKeys = t.clip === 'strafe' ? ['strafe.left', 'strafe.right'] : [t.clip];
      for (const ck of clipKeys) {
        const c = actor.report.clips[ck], m = actor.measured(ck); if (!c) continue;
        const speed = tier === 'idle' ? 0 : (V[tier] ?? 0), rate = m && m.speed ? speed / m.speed : 1;
        rows.push({
          state: t.clip === 'strafe' ? ck + (t.variant ? ' (' + tier + ')' : '') : tier, role: tier === 'idle' ? 'rest' : CYC.has(ck) ? 'cyclic ground locomotion' : 'pose',
          sourceClip: c.name, source: c.source, variant: t.variant ? VARIANTS[t.variant].note : null,
          playbackRate: r2(rate), cycleS: c.dur, strideM: m ? m.strideM : null,
          cadenceStepsPerMin: m ? Math.round(2 / c.dur * 60 * rate) : null, worldSpeedMs: r2(speed), clipSpeedMs: m ? m.speed : null,
          loop: c.loop, contactShare: m ? m.contactShare : null, leftTouchdown: m ? m.leftTouchdown : null, inPlace: m ? m.inPlace : null
        });
      }
    }
    for (const j of ['jump.start', 'jump.air', 'jump.land']) { const c = actor.report.clips[j]; if (c) rows.push({ state: j, role: 'jump chain (physics owns vertical travel)', sourceClip: c.name, source: c.source, variant: null, playbackRate: 1, cycleS: c.dur, loop: c.loop }); }
    return { id: 'kfb.wi1.locomotion-consumed/2', owner: 'consumer · canonical profile truth = ToolBox Animation Lab', rows, transitions: TRANSITIONS, tune: { ...TUNE }, bands: { upRun: r2(V.upRun), downRun: r2(V.downRun) } };
  }

  const P = {
    actor, walker, cam: C, retune, get params() { return walker.params; }, speeds: V, tune: TUNE, get on() { return on; },
    get motion() { return { state: M.state, tier: M.tier, clip: M.clip, ts: M.ts, speed: M.speed, cmd: M.cmd, posture: M.posture, jump: M.jump, family: M.family }; },
    get position() { return walker.state.position; },
    profile,
    setPosture(p) { M.posture = p === 'stand' || !actor.actions[p] ? 'stand' : p; },
    slipReport() { const o = {}; for (const [k, s] of Object.entries(slip)) if (s.n) o[k] = { skateMs: s.time ? r2(s.drift / s.time) : null, steps: s.steps, instantMedianMs: r2(med(s.v)), bodySpeedMs: r2(s.speed / s.n), method: 'skate = planted-foot world drift per contact ÷ contact time · contact = lowest 3 cm of the ankle' }; return o; },
    resetSlip() { for (const k in slip) delete slip[k]; for (const c of contact) c.on = false; },
    place(x, z, heading) { walker.reset(x, z, ground(x, z), heading || 0); M.yaw = heading || 0; M.speed = 0; M.vis = 0; M.cmd = 0; M.cls = null; M.holdW = M.holdShift = 0; M.jump = 'ground'; M.posture = 'stand'; actor.holder.position.copy(walker.state.position); follow(0, true); },
    setOn(v) {
      on = !!v; for (const k in keys) keys[k] = false; drag = null;
      if (on) { const st = walker.state; walker.lift(Math.max(st.position.y, ground(st.position.x, st.position.z))); follow(0, true); }
      if (hud) hud.parentElement.hidden = !on;
    },
    handToOrbit(controls) { controls.target.copy(walker.state.position).add(new THREE.Vector3(0, 1, 0)); controls.update(); },
    writeDoc(doc) { if (!doc.world) return; const p = walker.state.position; doc.world.player = { position: [+p.x.toFixed(3), +p.y.toFixed(3), +p.z.toFixed(3)], heading: +walker.state.heading.toFixed(5) }; },
    readDoc(doc) { const pl = doc.world && doc.world.player; if (pl) P.place(pl.position[0], pl.position[2], pl.heading); },
    update(dt) { const st = step(dt, input()); if (on) { if (!drag && M.speed > 0.2) { let d = C.yawOff % (2 * Math.PI); if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; C.yawOff = d * (1 - Math.min(1, dt * 1.6)); } follow(dt, false); paintHud(); } return st; },
    /* deterministic driving for the self-test — the same step() the player uses. `sprint` = Shift. */
    drive({ ix = 0, iy = 0, turn = 0, sprint = false, jump = false }, seconds, dt = 1 / 60, each = null) {
      if (jump) walker.jump();
      const n = Math.round(seconds / dt); for (let i = 0; i < n; i++) { step(dt, { ix, iy, turn, shift: sprint }); if (each) each(M); }
      return walker.state;
    },
    ground,
    refreshObstacles
  };
  return P;
}
