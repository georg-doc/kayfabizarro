// Card-Hex Ascent · in-page verification harness. Consumes the REAL activity (no parallel debug game).
// window.__ascent: ready · evidence() · preset(name) · input(o) · teleport(id) · jumpTo(from, to) · restart()
const errors = [];
addEventListener('error', e => errors.push({ kind: 'page', msg: String(e.message), src: e.filename ? e.filename.split('/').pop() + ':' + e.lineno : '' }));
addEventListener('unhandledrejection', e => errors.push({ kind: 'promise', msg: String(e.reason?.message || e.reason) }));
const _ce = console.error.bind(console); console.error = (...a) => { errors.push({ kind: 'console', msg: a.map(String).join(' ').slice(0, 300) }); _ce(...a); };

export const PRESETS = ['source-card', 'source-hex-medieval', 'source-hex-builder', 'source-hex-snow', 'source-weapons', 'traversal-direct', 'traversal-long', 'traversal-double',
  'combat-blaster', 'combat-rifle', 'combat-minigun', 'impact-close', 'lower-level', 'mid-level', 'upper-level', 'final-card', 'play'];

export function installHarness(ctx) {
  const { THREE, run, graph, level, fx, audio, follow, camera, renderer, scene, BUILD, INC, SEED, PIN, SRC, loadLog, CARDS } = ctx;
  let source = null; fetch(new URL('./SOURCE.json', import.meta.url)).then(r => r.ok ? r.json() : null).then(j => { source = j; }).catch(() => {});
  const A = window.__ascent ?? (window.__ascent = {});
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const visibility = new Map();
  function isolate(pred) {
    level.root.traverse(o => { if (o === level.root) return; if (!visibility.has(o)) visibility.set(o, o.visible); });
    for (const o of level.root.children) o.visible = pred(o);
    for (const a of ctx.combat?.actors ?? []) a.root.visible = false;
  }
  function unisolate() { for (const [o, v] of visibility) o.visible = v; visibility.clear(); for (const a of ctx.combat?.actors ?? []) a.root.visible = a.alive || a.team === 'player'; level.highlight && (level.highlight.visible = false); }
  function frame(objs, dir = new THREE.Vector3(-0.8, 0.55, -1)) {
    const box = new THREE.Box3(); for (const o of objs) box.expandByObject(o);
    const c = box.getCenter(new THREE.Vector3()), r = box.getSize(new THREE.Vector3()).length() * 0.62 + 2;
    follow.override = { pos: c.clone().add(dir.normalize().multiplyScalar(r)), look: c };
  }
  const famGroups = fam => level.root.children.filter(o => o.userData?.family === fam);

  Object.assign(A, {
    BUILD, inc: INC, seed: SEED, presets: PRESETS, errors, ctx,
    state() { const c = ctx.ctrl; return c ? { run: run.state, pos: [c.pos.x, c.pos.y, c.pos.z].map(v => +v.toFixed(3)), yaw: +c.yaw.toFixed(3), grounded: c.grounded, support: c.support?.id ?? null, traversal: c.state, mode: c.mode, hp: ctx.player?.hp } : { run: run.state }; },
    input(o) { if (o) run.harness = true; ctx.input.synthetic = o ? { x: 0, z: 0, ...o } : null; },
    teleport(id, face = null) {
      const s = graph.get(id); const c = ctx.ctrl; if (!s) throw new Error('no support ' + id);
      c.reset({ x: s.x, y: s.top, z: s.z }, face ?? c.yaw); follow.snap(); return A.state();
    },
    // Human-equivalent assisted jump: stand on `from`, hold direction toward `to`, press Space once.
    jumpTo(from, to, { maxSec = 2.5, pauseAt = null, dt = 1 / 60 } = {}) {
      const c = ctx.ctrl, s0 = graph.get(from); const targets = graph.items.filter(s => (s.islet || s.id) === to);
      if (!s0 || !targets.length) throw new Error('bad jump ' + from + '→' + to);
      let best = targets[0]; for (const s of targets) if (Math.hypot(s.x - s0.x, s.z - s0.z) < Math.hypot(best.x - s0.x, best.z - s0.z)) best = s;
      const dx = best.x - s0.x, dz = best.z - s0.z, l = Math.hypot(dx, dz);
      const p = graph.landingPoint(s0, s0.x + dx / l * 9, s0.z + dz / l * 9, 0.35); // 0.35 u inside the edge, facing the target
      c.reset({ x: p.x, y: s0.top, z: p.z }, Math.atan2(dx, dz)); follow.yaw = Math.atan2(dx, dz) + Math.PI; follow.snap();
      const runUp = arguments[2]?.runUp ?? 0;
      if (runUp) { const back = graph.landingPoint(s0, s0.x - dx / l * 9, s0.z - dz / l * 9, 0.4); c.reset({ x: back.x, y: s0.top, z: back.z }, Math.atan2(dx, dz)); follow.snap(); }
      ctx.input.synthetic = { x: 0, z: 1, jump: !runUp, sprint: !!runUp }; // camera-forward intent + one Space press (after the run-up)
      let t = 0, landed = false;
      for (; t < maxSec; t += dt) { if (runUp && !c.lastJumpTrace && c.grounded && c.state === 'MOVE' && (c.edgeHold || ((c.pos.x - s0.x) * dx + (c.pos.z - s0.z) * dz) / l > 0.45)) ctx.input.synthetic.jump = true; ctx.step(dt); if (pauseAt != null && t >= pauseAt) break; if (c.grounded && c.lastJumpTrace && t > 0.2) { landed = true; if (t > 0.6) break; } }
      ctx.input.synthetic = null; ctx.advance(0);
      return { from, to, t: +t.toFixed(2), landed, support: c.support?.id ?? null, traversal: c.state, jump: c.lastJumpTrace ? { ...c.lastJumpTrace, trace: (c.lastJumpTrace.trace || []).filter((_, i, a) => i % 6 === 0 || i === a.length - 1) } : null };
    },
    async preset(name) {
      unisolate(); follow.override = null;
      const card = id => level.cards.get(id)?.group;
      switch (name) {
        case 'play': break;
        case 'source-card': isolate(o => o === card('card1') || o === card('card0')); frame([card('card1')], new THREE.Vector3(0.0, 1.6, -0.55)); break;
        case 'source-hex-medieval': isolate(o => o.userData?.family === 'hexagon'); frame(famGroups('hexagon').slice(0, 6), new THREE.Vector3(1, 0.7, -0.6)); break;
        case 'source-hex-builder': isolate(o => o.userData?.family === 'builder'); frame(famGroups('builder').slice(0, 6), new THREE.Vector3(1, 0.7, -0.6)); break;
        case 'source-hex-snow': isolate(o => o.userData?.family === 'snow'); frame(famGroups('snow'), new THREE.Vector3(1, 0.5, -0.8)); break;
        case 'source-weapons': {
          const p = ctx.player; A.teleport('card0', Math.PI); p.anim.play('kfb_action_aim_blaster_a', { mode: 'clamp', from: 1.0 });
          await wait(400); const h = p.root.position; follow.override = { pos: new THREE.Vector3(h.x + 2.2, h.y + 1.9, h.z - 1.3), look: new THREE.Vector3(h.x, h.y + 1.4, h.z - 0.3) }; break;
        }
        case 'traversal-direct': return A.jumpTo('card0', 'A1');
        case 'traversal-long': return A.jumpTo('B2.0', 'B3', { runUp: true });
        case 'traversal-double': return A.jumpTo('B3.0', 'B4');
        case 'combat-blaster': case 'combat-rifle': case 'combat-minigun': {
          const id = { 'combat-blaster': 'card1', 'combat-rifle': 'card2', 'combat-minigun': 'card3' }[name]; if (!graph.get(id)) return { skipped: id + ' not in ' + INC };
          const c = CARDS.find(k => k.id === id), s = graph.get(id); ctx.ctrl.reset({ x: c.x, y: c.top, z: c.z - s.hd + 1.5 }, 0); follow.yaw = Math.PI; follow.snap();
          ctx.ctrl.events.push({ type: 'land', support: id, jump: null }); // arrival through the real onSupport path
          break;
        }
        case 'impact-close': { const e = ctx.combat.actors.find(a => a.team === 'enemy' && a.alive && a.weapon); if (!e) return { skipped: 'no enemy' };
          const p = e.root.position; follow.override = { pos: new THREE.Vector3(p.x + 3.2, p.y + 2.2, p.z - 3.4), look: new THREE.Vector3(p.x, p.y + 1.2, p.z) }; break; }
        case 'lower-level': follow.override = { pos: new THREE.Vector3(-16, 7, -12), look: new THREE.Vector3(2, 2, 14) }; break;
        case 'mid-level': follow.override = { pos: new THREE.Vector3(36, 16, 14), look: new THREE.Vector3(12, 7, 32) }; break;
        case 'upper-level': follow.override = { pos: new THREE.Vector3(2, 30, 30), look: new THREE.Vector3(21, 16, 50) }; break;
        case 'final-card': { const id = INCREMENTS_LAST(INC); const c = CARDS.find(k => k.id === id); follow.override = { pos: new THREE.Vector3(c.x - 12, c.top + 9, c.z - 14), look: new THREE.Vector3(c.x, c.top, c.z) }; break; }
        default: throw new Error('unknown preset ' + name);
      }
      return { preset: name, state: A.state() };
    },
    restart() { ctx.restart(); return A.state(); },
    // Scripted whole-run with human-equivalent input (camera direction + keys). EVIDENCE ONLY — never a gate.
    autoplay({ maxSec = 240, dt = 1 / 60, log = [], practice = 'face' } = {}) {
      run.harness = true;
      const c = ctx.ctrl, cb = ctx.combat, step = s => { ctx.step(dt); return s + dt; };
      const routeIds = [...new Set(graph.items.filter(s => s.route >= 0).sort((a, b) => a.route - b.route).map(s => s.islet || s.id))];
      let t = 0, goalIdx = 1, jd = -1, phase = 'practice', k = 0;
      const face = (x, z) => { follow.yaw = Math.atan2(x - c.pos.x, z - c.pos.z) + Math.PI; };
      while (t < maxSec && ctx.run.state === 'PLAY') {
        const die = cb.actors.find(a => a.kind === 'die' && a.alive);
        if (phase === 'practice') { if (!die) { phase = 'climb'; log.push(`${t.toFixed(1)} practice done`); continue; } face(die.root.position.x, die.root.position.z); ctx.input.synthetic = { x: 0, z: 0, fire: true }; t = step(t); if (t > 12) phase = 'climb'; continue; }
        const enc = cb.encounter && !cb.encounter.cleared ? cb.encounter : null;
        if (enc) { // fight: face nearest alive enemy, alternate strafe / fire, dodge every few cycles
          const e = cb.enemiesOf(enc.card).filter(a => a.alive && a.weapon).sort((a, b) => a.root.position.distanceTo(ctx.player.root.position) - b.root.position.distanceTo(ctx.player.root.position))[0];
          if (e) face(e.root.position.x, e.root.position.z);
          if (enc.card !== 'card1' && run.weapons.includes('rifle') && run.weapon !== 'rifle' && ctx.setWeapon) ctx.setWeapon('rifle'); // evidence for the player Rifle
          const cyc = (k++ % 150); ctx.input.synthetic = cyc < 40 ? { x: (Math.floor(k / 150) % 2 ? 1 : -1) * 0.8, z: 0 } : { x: 0, z: 0, fire: true, dodge: cyc === 41 && (k / 150 | 0) % 3 === 2 };
          t = step(t); continue;
        }
        const s0 = c.support; const ci = s0 ? routeIds.indexOf(s0.islet || s0.id) : -1; if (ci >= 0) goalIdx = Math.max(goalIdx, ci + 1);
        const goal = routeIds[goalIdx]; if (!goal) { ctx.input.synthetic = null; t = step(t); continue; }
        let best = null, bd = 1e9; for (const s of graph.items) if ((s.islet || s.id) === goal) { const d = Math.hypot(s.x - c.pos.x, s.z - c.pos.z); if (d < bd) { bd = d; best = s; } }
        face(best.x, best.z);
        const near = c.grounded && s0 && (c.edgeHold || graph.edgeDistance(s0, c.pos.x, c.pos.z) > -0.6) && c.state !== 'ANTICIPATE' && (s0.islet || s0.id) !== goal;
        let jump = false; if (near) { if (jd < 0) jd = 0.08; jd -= dt; if (jd <= 0) { jump = true; jd = -1; } } else jd = -1;
        // walk onto the card centre before the duel triggers fully
        ctx.input.synthetic = { x: 0, z: 1, jump };
        const before = c.support?.id; t = step(t); if (c.support?.id !== before && c.support && c.grounded) log.push(`${t.toFixed(1)} on ${c.support.id}`);
      }
      ctx.input.synthetic = null; ctx.advance(0);
      return { seconds: +t.toFixed(1), runState: ctx.run.state, result: ctx.run.result, log: log.slice(-40) };
    },
    advance(sec, dt) { const n = ctx.advance(sec, dt); return { steps: n, state: A.state() }; },
    // hold synthetic input for `sec` seconds of deterministic simulation
    hold(o, sec, dt = 1 / 60) { A.input(o); const n = Math.round(sec / dt); let k = 0; for (; k < n; k++) { ctx.step(dt); if (o.jump || o.fireEdge || o.dodge) ctx.input.synthetic = { ...ctx.input.synthetic, jump: false, fireEdge: false, dodge: false }; } A.input(null); ctx.advance(0); return A.state(); },
    start() { ctx.start(); return A.state(); },
    evidence() {
      const c = ctx.ctrl, cb = ctx.combat; let mixers = 0; if (cb) for (const a of cb.actors) if (a.anim?.mixer) mixers++;
      return {
        schema: 'kfb.card-hex-ascent.evidence/1', at: new Date().toISOString(), build: BUILD, source,
        route: { increment: INC, seed: SEED, url: location.href }, runState: run.state,
        player: A.state(), lastJump: c?.lastJumpTrace ? { ...c.lastJumpTrace, trace: undefined, traceLen: c.lastJumpTrace.trace?.length } : null,
        supportFacts: c?.support ? { id: c.support.id, family: c.support.family, top: c.support.top, edgeDistance: +graph.edgeDistance(c.support, c.pos.x, c.pos.z).toFixed(3) } : null,
        traversalStats: c ? { ...c.stats } : null,
        perf: { fps: run.fps, drawCalls: run.drawCalls, triangles: run.triangles, frame: run.frame, pixelRatio: renderer.getPixelRatio() },
        counts: { mixers, activeEnemies: cb?.activeEnemies().length ?? 0, activeProjectiles: cb?.projectiles.length ?? 0, actors: cb?.actors.length ?? 0 },
        combat: cb?.stats() ?? null, vfx: fx.stats(), audio: audio.report(),
        sources: { pins: PIN, actors: SRC, level: level.audit(), loads: loadLog.slice(), loadFailures: loadLog.filter(l => !l.ok) },
        result: run.result, coins: run.coins, errors: errors.slice(0, 20), degraded: run.degraded.slice(0, 20),
      };
    },
  });
  function INCREMENTS_LAST(inc) { return { S1: 'card1', S2: 'card2', S3: 'card3' }[inc]; }
}
