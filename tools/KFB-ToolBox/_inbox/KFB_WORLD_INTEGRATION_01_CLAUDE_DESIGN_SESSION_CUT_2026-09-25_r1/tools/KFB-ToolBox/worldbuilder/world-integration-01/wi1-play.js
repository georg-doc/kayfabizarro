/* KFB WorldBuilder · WORLD-INTEGRATION-01 · PLAY in the same world
   Movement owner: travel/KFB Travel Combat v25/terrain-v25/walk-controller.js — imported UNCHANGED.
   Only its documented `params` are set, in metres, from measurements of the actor and its clips:
     speed = planted-foot speed of the Walk clip · sprintMul = Run ÷ Walk · body radius / step /
     hop heights for a 1.85 m figure (the controller's defaults are cube-pet units: speed 5.4,
     jump apex 4.7 — that is why the old world walker read as a sliding giant hopper).
   Ground truth for the walker = the WorldBuilder's own terrainHeightAt (base + sculpt strokes) +
   OSM footprints + the edited scene objects. One state, read by both Edit and Play.
   Animation follows the movement state, never the reverse: state from the controller's measured
   travel, playback rate = measured speed ÷ clip speed. */
import * as THREE from 'three';
import { makeActor } from './wi1-actor.js';

const WALK_URL = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/travel/KFB%20Travel%20Combat%20v25/terrain-v25/walk-controller.js';
const r2 = (v) => +(+v).toFixed(2);
const med = (a) => { if (!a.length) return 0; const b = a.slice().sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; };
const angLerp = (a, b, k) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return a + d * k; };

export async function makePlay({ scene, camera, dom, groundAt, obstacles, hud, log = () => {} }) {
  const WC = await import(WALK_URL);
  const actor = await makeActor({ scene, camera, log });
  /* Walk cadence: KayKit Walking_A plants its feet at ~0.56 m/s on this chibi body (short stride,
     measured). Walking faster is done with a faster step rate, never with a longer slide: movement
     speed = clip speed × cadence, and the clip plays at exactly that cadence. Host prop walkCadence. */
  const cad = THREE.MathUtils.clamp(+((window.__wb2dProps || {}).walkCadence ?? 1.35), 0.8, 2);
  const V = {
    cadence: cad,
    walk: (actor.native('Walk') || 1.0) * cad,
    run: actor.native('Run') || 2.4,
    back: (actor.native('WalkBack') || 0.6) * cad,
    runBack: actor.native('RunBack') || actor.native('WalkBack') || 1.1
  };
  if (V.run < V.walk * 1.15) V.run = V.walk * 1.15;
  const params = {
    speed: V.walk, sprintMul: V.run / V.walk, gravity: 22, eyeUp: 1.45, turnRate: 2.4,
    stepMax: 0.36, autoJumpMax: 0.75, hopClear: 0.22, radius: 0.32, probeStep: 0.15, probeMax: 1.6,
    windup: 1 / 120, windupSlow: 1,   // no controller windup: Jump_Start carries the anticipation (Lab rule) — a second crouch read as a double jump stepUpSpeed: 5, bounce: 0, bounceMin: 99, bounceMax: 0,
    floatMin: 2, floatMax: 8, minD: 2.2, maxD: 16, minP: 0.05, maxP: 1.25
  };
  const walker = WC.createWalkController({ THREE, params });
  walker.setCamDist(6.2);
  function retune() {
    V.walk = (actor.native('Walk') || 1.0) * V.cadence; V.back = (actor.native('WalkBack') || 0.6) * V.cadence;
    V.run = Math.max(V.walk * 1.15, actor.native('Run') || 2.4); V.runBack = actor.native('RunBack') || V.back * 1.6;
    walker.setParams({ speed: V.walk, sprintMul: V.run / V.walk });
  }
  addEventListener('wb2d-props', (e) => {
    const d = e.detail || {};
    if (d.walkCadence != null) V.cadence = THREE.MathUtils.clamp(+d.walkCadence, 0.8, 2);
    if (d.motionSet && d.motionSet !== actor.motionSet) actor.setMotionSet(d.motionSet);
    retune();
  });

  /* obstacles: edited scene objects as boxes (refreshed, not cached forever — Move/Scale changes them) */
  const obs = []; let obsT = 0;
  const refreshObstacles = () => { obs.length = 0; for (const r of obstacles()) { const b = new THREE.Box3().setFromObject(r, false); if (Number.isFinite(b.min.x)) obs.push(b); } };
  const ground = (x, z) => {
    let h = groundAt(x, z);
    for (const b of obs) if (x >= b.min.x && x <= b.max.x && z >= b.min.z && z <= b.max.z) h = Math.max(h, b.max.y);
    return h;
  };

  const keys = {}; let on = false, drag = null;
  const M = { state: 'Idle', ts: 1, speed: 0, yaw: 0, airT: 0, jump: 'ground', restart: false, wasGround: true, prev: new THREE.Vector3(), dir: new THREE.Vector3() };
  const slip = {};   // per state: planted-foot world speed while in contact
  const feet = ['l', 'r'].map((s) => { let b = null; actor.figure.traverse((o) => { if (!b && o.isBone && new RegExp('^foot[._]?' + s + '$', 'i').test(o.name)) b = o; }); return b; }).filter(Boolean);
  const footPrev = feet.map(() => new THREE.Vector3()), footMin = feet.map(() => Infinity), tmp = new THREE.Vector3();
  const contact = feet.map(() => ({ on: false, t: 0, p: new THREE.Vector3(), state: null }));

  function input() {
    if (!on) return { ix: 0, iy: 0, turn: 0, sprint: false };
    const sprint = !!(keys.ShiftLeft || keys.ShiftRight);
    const fw = keys.KeyW || keys.ArrowUp, bk = keys.KeyS || keys.ArrowDown;
    let iy = fw ? 1 : 0;
    if (bk && !fw) iy = -(sprint ? V.runBack / V.run : V.back / V.walk);   // backward clips are slower; input scales, controller unchanged
    const ix = (keys.KeyE ? 1 : 0) - (keys.KeyQ ? 1 : 0);
    const turn = ((keys.KeyA || keys.ArrowLeft) ? 1 : 0) - ((keys.KeyD || keys.ArrowRight) ? 1 : 0);
    return { ix, iy, turn, sprint };
  }

  function step(dt, inp) {
    obsT -= dt; if (obsT <= 0) { obsT = 0.25; refreshObstacles(); }
    M.prev.copy(walker.state.position);
    walker.setInput(inp.ix, inp.iy);
    walker.update(dt, { turn: inp.turn, sprint: inp.sprint }, ground);
    const st = walker.state;
    M.dir.subVectors(st.position, M.prev).setY(0);
    const inst = M.dir.length() / Math.max(dt, 1e-4);
    M.speed += (inst - M.speed) * Math.min(1, dt * 14);
    /* semantic state from the MOVEMENT */
    let next;
    const fwdDot = M.dir.lengthSq() > 1e-8 ? M.dir.clone().normalize().dot(st.forward) : 1;
    /* Jump chain = KFB Animation Lab v1 (lab/locomotion.js): the controller owns the arc, the clips only
       dress it — Jump_Start once at take-off, Jump_Idle when it is done, Jump_Land at touch-down until it
       is done. One chain per take-off, clips at their authored rate (no stretched second rise). */
    const done = (k) => { const x = actor.actions[k]; return !x || !x.isRunning() || x.time >= x.getClip().duration - 1e-3; };
    const moving = M.speed > 0.06, back = moving && fwdDot < -0.3;
    const run = moving && (back ? M.speed > (V.back + V.runBack) / 2 : M.speed > (V.walk + V.run) / 2);
    const loco = !moving ? 'Idle' : back ? (run ? 'RunBack' : 'WalkBack') : (run ? 'Run' : 'Walk');
    if (!st.onGround && M.jump === 'ground' && (st.vy > 0.5 || M.airT > 0.12)) { M.jump = 'start'; M.restart = true; }
    if (M.jump === 'start' && done('JumpStart') && !M.restart) M.jump = 'air';
    if ((M.jump === 'start' || M.jump === 'air') && st.onGround) { M.jump = actor.actions.JumpLand ? 'land' : 'ground'; M.restart = true; }
    if (M.jump === 'land' && !M.restart && (done('JumpLand') || (moving && actor.actions.JumpLand.time > 0.25))) M.jump = 'ground';
    next = M.jump === 'start' ? 'JumpStart' : M.jump === 'air' ? 'JumpAir' : M.jump === 'land' ? 'JumpLand' : loco;
    M.airT = st.onGround ? 0 : M.airT + dt;
    M.wasGround = st.onGround;
    /* playback rate follows the measured movement speed */
    let ts = 1;
    if (['Walk', 'Run', 'WalkBack', 'RunBack'].includes(next)) {
      const nat = actor.native(next) || (next.startsWith('Run') ? V.run : V.walk);
      ts = THREE.MathUtils.clamp((st.onGround ? inst : M.speed) / nat, 0.55, 1.6);
      if (next === 'WalkBack' && !actor.actions.WalkBack) { next = 'Walk'; ts = -ts; }
    }
    actor.play(next, ts, next.startsWith('Jump') ? 0.08 : 0.16, M.restart);
    M.restart = false;
    M.state = next; M.ts = ts;
    /* presentation: holder follows the controller; the body turns toward sideways travel (no strafe clip) */
    let yawT = st.heading;
    if (inst > 0.05 && M.speed > 0.06 && fwdDot > -0.3 && st.onGround) yawT = Math.atan2(M.dir.x, M.dir.z);   // only while actually travelling: a zero delta has no direction
    M.yaw = angLerp(M.yaw, yawT, Math.min(1, dt * 12));
    actor.holder.position.copy(st.position);
    actor.holder.rotation.set(0, M.yaw, 0);
    actor.update(dt);
    measureSlip(dt, st);
    return st;
  }

  function measureSlip(dt, st) {
    actor.holder.updateMatrixWorld(true);
    const s = slip[M.state] || (slip[M.state] = { v: [], speed: 0, n: 0, drift: 0, time: 0, steps: 0 });
    feet.forEach((f, i) => {
      f.getWorldPosition(tmp);
      const rel = tmp.y - st.position.y;
      footMin[i] = Math.min(footMin[i] + dt * 0.02, rel);
      const c = contact[i], inC = st.onGround && rel < footMin[i] + 0.03;
      if (inC && footPrev[i].lengthSq() > 0) {
        const v = Math.hypot(tmp.x - footPrev[i].x, tmp.z - footPrev[i].z) / Math.max(dt, 1e-4);
        if (v < 20 && s.v.length < 4000) { s.v.push(v); s.n++; s.speed += M.speed; }
        if (!c.on) { c.on = true; c.t = 0; c.p.copy(tmp); c.state = M.state; }
        else c.t += dt;
      } else if (c.on) {
        c.on = false;
        const cs = slip[c.state];
        if (cs && c.t > 0.08) { cs.drift += Math.hypot(tmp.x - c.p.x, tmp.z - c.p.z); cs.time += c.t; cs.steps++; }
      }
      footPrev[i].copy(tmp);
    });
  }

  /* follow camera: own orbit state, no yaw limit (walker.cam clamps ±2.6 rad) */
  const C = { yawOff: 0, pitch: 0.38, dist: 6.2 };
  const camTarget = new THREE.Vector3(), camWant = new THREE.Vector3();
  function follow(dt, snap) {
    const st = walker.state, c = C, yaw = st.heading + c.yawOff;
    camTarget.copy(st.position); camTarget.y += params.eyeUp;
    camWant.set(-Math.sin(yaw) * Math.cos(c.pitch) * c.dist, Math.sin(c.pitch) * c.dist, -Math.cos(yaw) * Math.cos(c.pitch) * c.dist).add(camTarget);
    camWant.y = Math.max(camWant.y, ground(camWant.x, camWant.z) + 0.6);
    if (snap) camera.position.copy(camWant); else camera.position.lerp(camWant, 1 - Math.exp(-dt * 9));
    camera.lookAt(camTarget);
  }

  const kd = (e) => {
    if (!on) return;
    const t = String(e.target?.tagName || '').toLowerCase(); if (t === 'input' || t === 'textarea' || t === 'select') return;
    keys[e.code] = true;
    if (e.code === 'Space') { e.preventDefault(); if (!e.repeat) walker.jump(); }
    if (/^Key[WASDQE]$|^Arrow|^Space$/.test(e.code)) e.preventDefault();
  };
  const ku = (e) => { keys[e.code] = false; };
  addEventListener('keydown', kd); addEventListener('keyup', ku);
  addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
  dom.addEventListener('pointerdown', (e) => { if (!on) return; drag = { x: e.clientX, y: e.clientY }; });
  addEventListener('pointermove', (e) => { if (!on || !drag) return; C.yawOff -= (e.clientX - drag.x) * 0.006; C.pitch = THREE.MathUtils.clamp(C.pitch + (e.clientY - drag.y) * 0.005, -0.45, 1.5); drag = { x: e.clientX, y: e.clientY }; });
  addEventListener('pointerup', () => { drag = null; });
  dom.addEventListener('wheel', (e) => { if (!on) return; e.preventDefault(); C.dist = THREE.MathUtils.clamp(C.dist * Math.exp(Math.max(-240, Math.min(240, e.deltaY)) * 0.0015), 1.2, 80); }, { passive: false });

  function paintHud() {
    if (!hud) return;
    const s = slip[M.state], sl = s && s.time > 0.3 ? r2(s.drift / s.time) : null;
    hud.textContent = M.state + ' · ' + r2(M.speed) + ' m/s · clip ×' + r2(Math.abs(M.ts)) + (sl != null && M.speed > 0.2 ? ' · foot skate ' + sl + ' m/s' : '');
  }

  const P = {
    actor, walker, cam: C, retune, get params() { return walker.params; }, speeds: V, get on() { return on; }, get motion() { return { ...M, prev: undefined, dir: undefined }; },
    get position() { return walker.state.position; },
    slipReport() { const o = {}; for (const [k, s] of Object.entries(slip)) if (s.n) o[k] = { skateMs: s.time ? r2(s.drift / s.time) : null, steps: s.steps, instantMedianMs: r2(med(s.v)), bodySpeedMs: r2(s.speed / s.n), method: 'skate = planted-foot world drift per contact ÷ contact time · contact = lowest 3 cm of the ankle' }; return o; },
    resetSlip() { for (const k in slip) delete slip[k]; for (const c of contact) c.on = false; },
    place(x, z, heading) { walker.reset(x, z, ground(x, z), heading || 0); M.yaw = heading || 0; M.speed = 0; actor.holder.position.copy(walker.state.position); follow(0, true); },
    setOn(v) {
      on = !!v; for (const k in keys) keys[k] = false; drag = null;
      if (on) { const st = walker.state; walker.lift(Math.max(st.position.y, ground(st.position.x, st.position.z))); follow(0, true); }
      if (hud) hud.parentElement.hidden = !on;
    },
    handToOrbit(controls) { controls.target.copy(walker.state.position).add(new THREE.Vector3(0, 1, 0)); controls.update(); },
    writeDoc(doc) { if (!doc.world) return; const p = walker.state.position; doc.world.player = { position: [+p.x.toFixed(3), +p.y.toFixed(3), +p.z.toFixed(3)], heading: +walker.state.heading.toFixed(5) }; },
    readDoc(doc) { const pl = doc.world && doc.world.player; if (pl) P.place(pl.position[0], pl.position[2], pl.heading); },
    /* one frame · edit mode keeps the walker alive with zero input so the figure rides edited terrain */
    update(dt) { const st = step(dt, input()); if (on) { if (!drag && M.speed > 0.2) { let d = C.yawOff % (2 * Math.PI); if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; C.yawOff = d * (1 - Math.min(1, dt * 1.6)); } follow(dt, false); paintHud(); } return st; },
    /* deterministic driving for the self-test — the same step() the player uses */
    drive({ ix = 0, iy = 0, turn = 0, sprint = false, jump = false }, seconds, dt = 1 / 60) {
      if (jump) walker.jump();
      const n = Math.round(seconds / dt); for (let i = 0; i < n; i++) step(dt, { ix, iy, turn, sprint });
      return walker.state;
    },
    ground,
    refreshObstacles
  };
  return P;
}
