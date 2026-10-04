// Card-Hex Ascent · Combat owner: fire decision, projectile/hit truth, damage, enemy lifecycle, rewards.
// Consequence invariant (PR #17): confirmed hit → exactly 1 damage intent + 1 VFX + 1 SFX; miss → 0/0/0.
import * as THREE from 'three';
import { closestSegmentSegment, AttackLedger } from '../ca2-melee-lab/contact.v1.js';

export const FPS = 30;
export const WEAPONS = Object.freeze({
  blaster: { aim: 'kfb_action_aim_blaster_a', shoot: 'kfb_action_shoot_blaster_a', fireFrame: 2, aimFrom: 0.55, dmg: 1, speed: 24, enemySpeed: 11, cooldown: 0.3, heavy: false, energy: 'kinetic', label: 'Blaster' },
  rifle: { aim: 'kfb_action_aim_rifle_a', shoot: 'kfb_action_shoot_rifle_a', fireFrame: 0, aimFrom: 0.9, dmg: 2, speed: 34, enemySpeed: 15, cooldown: 0.6, heavy: true, energy: 'kinetic', label: 'Rifle' },
  minigun: { aim: 'kfb_action_hold_minigun_a', shoot: 'kfb_action_fire_minigun_a', fireEvery: 0.11, aimFrom: 0, dmg: 1, speed: 20, enemySpeed: 13, cooldown: 0.11, heavy: false, energy: 'kinetic', label: 'Minigun' },
});
const PROJ_CAP = 24, PROJ_R = 0.13, BODY_R = 0.42, BODY_H = 2.0;

export function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export class CombatDirector {
  constructor({ scene, graph, fx, audio, seed = 1 }) {
    this.scene = scene; this.graph = graph; this.fx = fx; this.audio = audio; this.rng = mulberry32(seed);
    this.actors = []; this.projectiles = []; this.events = []; this.encounter = null; this.shotSerial = 0; this.time = 0;
    this.ledgerTotals = { shots: 0, hits: 0, misses: 0, dodges: 0, damageIntents: 0, vfx: 0, sfx: 0, defeats: 0, rewards: 0, playerHits: 0, blocked: 0 };
    this.deviation = []; // muzzle-vs-target lane evidence
    const geo = new THREE.SphereGeometry(PROJ_R, 10, 8);
    this.projMat = { player: new THREE.MeshStandardMaterial({ color: 0xfff1c9, emissive: 0xffb84a, emissiveIntensity: 0.9, roughness: 0.6 }),
      enemy: new THREE.MeshStandardMaterial({ color: 0xff6a3d, emissive: 0xd8361f, emissiveIntensity: 1.1, roughness: 0.6 }) };
    this.pool = []; for (let i = 0; i < PROJ_CAP; i++) { const m = new THREE.Mesh(geo, this.projMat.player); m.visible = false; m.scale.setScalar(1); scene.add(m); this.pool.push(m); }
  }
  emit(type, data = {}) { this.events.push({ type, t: +this.time.toFixed(3), ...data }); }
  drainEvents() { const e = this.events; this.events = []; return e; }

  addActor(a) { // {id, team, root, anim, weapon, hp, card, support, ai?}
    Object.assign(a, { alive: true, maxHp: a.hp, hitT: 0, dodgeT: 0, aimHold: 0, lastShot: -9, queued: null, state: 'IDLE', stateT: 0, burst: 0, kills: 0 });
    a.rng = mulberry32((this.rng() * 1e9) | 0); this.actors.push(a); return a;
  }
  removeActor(a) { this.actors = this.actors.filter(x => x !== a); }
  enemiesOf(card) { return this.actors.filter(a => a.team === 'enemy' && (!card || a.card === card)); }
  activeEnemies() { return this.actors.filter(a => a.team === 'enemy' && a.alive && a.active); }

  startEncounter(card) {
    if (this.encounter?.card === card) return;
    const list = this.enemiesOf(card).filter(a => a.alive); if (!list.length) return;
    this.encounter = { card, t0: this.time, cleared: false };
    for (const a of list) { a.active = true; a.state = 'IDLE'; a.stateT = 0; a.cool = 0.9 + a.rng() * 0.8; }
    this.emit('encounterStart', { card, enemies: list.length });
  }

  // ---- firing -------------------------------------------------------------------------
  // Player/enemy request: raise aim (clamped hold), then the shoot clip; the projectile spawns on the fire frame.
  requestFire(actor, target) {
    const W = WEAPONS[actor.weapon]; if (!W || !actor.alive || actor.hitT > 0) return false;
    if (this.time - actor.lastShot < W.cooldown) return false;
    actor.queued = { target, at: this.time }; return true;
  }
  aimHeld(actor) { const W = WEAPONS[actor.weapon]; return actor.anim.isPlaying(W.aim) || actor.anim.isPlaying(W.shoot); }

  tickShooter(a, dt) {
    const W = WEAPONS[a.weapon]; const anim = a.anim;
    if (a.queued && a.alive && a.hitT <= 0) {
      const tgt = a.queued.target;
      if (tgt) this.faceTarget(a, tgt);
      if (a.weapon === 'minigun') {
        if (!anim.isPlaying(W.shoot)) { anim.play(W.shoot, { mode: 'loop', fade: 0.18 }); a.burstNext = this.time + 0.12; }
        anim.spin = 2.4;
        a.firingUntil = this.time + 0.2; a.queued = null;
      } else if (!anim.isPlaying(W.aim) && !anim.isPlaying(W.shoot)) {
        anim.play(W.aim, { mode: 'clamp', fade: 0.12, from: W.aimFrom * anim.clips[W.aim].duration, timeScale: 1.6 });
        a.raiseUntil = this.time + (1 - W.aimFrom) * anim.clips[W.aim].duration / 1.6;
      } else if (this.time >= (a.raiseUntil ?? 0) && !(anim.isPlaying(W.shoot) && anim.progress(W.shoot) < 0.85)) {
        anim.play(W.shoot, { mode: 'once', fade: 0.05 }); a.shotFired = false; a.shotStart = this.time; a.shotTarget = tgt; a.queued = null; a.lastShot = this.time;
      }
    }
    // fire frame of the one-shot clip
    if (a.weapon !== 'minigun' && anim.isPlaying(W.shoot) && !a.shotFired) {
      const a2 = anim.actions.get(W.shoot);
      if (a2 && a2.time >= W.fireFrame / FPS - 1e-4) { a.shotFired = true; this.spawnShot(a, a.shotTarget); }
    }
    if (a.weapon === 'minigun') {
      if (anim.isPlaying(W.shoot) && this.time < (a.firingUntil ?? 0)) {
        while (this.time >= a.burstNext) { a.burstNext += W.fireEvery; this.spawnShot(a, a.shotTarget ?? a.lastTarget); }
      } else if (anim.isPlaying(W.shoot)) { anim.play(W.aim, { mode: 'loop', fade: 0.2 }); anim.spin = 0.6; }
    }
    // release the aim hold after a quiet period
    if (a.team === 'player' && anim.isPlaying(W.aim) && !a.queued && this.time - a.lastShot > 1.1 && !a.aimButton) anim.stop(W.aim, 0.22);
  }
  faceTarget(a, tgt) { const p = a.root.position, t = tgt.root ? tgt.root.position : tgt; a.wantYaw = Math.atan2(t.x - p.x, t.z - p.z); a.lastTarget = tgt; }

  spawnShot(a, target) {
    const W = WEAPONS[a.weapon]; const pos = new THREE.Vector3(), dir = new THREE.Vector3();
    if (!a.anim.muzzleWorld(pos, dir)) { a.root.getWorldPosition(pos); pos.y += 1.4; dir.set(Math.sin(a.root.rotation.y), 0, Math.cos(a.root.rotation.y)); }
    // lane evidence: barrel (+Z of socket_muzzle) vs. muzzle→target
    let aimDir = dir.clone();
    if (target) {
      const tp = target.root ? target.root.position.clone().add(new THREE.Vector3(0, 1.2, 0)) : target.clone();
      const toT = tp.clone().sub(pos).normalize();
      const hb = Math.hypot(dir.x, dir.z) || 1, ht = Math.hypot(toT.x, toT.z) || 1;
      const yawDev = Math.acos(Math.max(-1, Math.min(1, (dir.x * toT.x + dir.z * toT.z) / (hb * ht)))) * 180 / Math.PI;
      this.deviation.push({ actor: a.id, weapon: a.weapon, yawDeg: +yawDev.toFixed(2) }); if (this.deviation.length > 40) this.deviation.shift();
      // barrel yaw is the authored truth; pitch is solved toward the target so elevated targets are reachable
      aimDir.set(dir.x / hb * ht, toT.y, dir.z / hb * ht).normalize();
      if (yawDev > 8) aimDir.copy(toT); // safety: never let a mid-blend pose spray sideways
    }
    if (a.weapon === 'minigun') aimDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), (a.rng() - 0.5) * 0.12);
    this.fx.muzzle(pos, dir, a.weapon);
    this.audio.play(a.team === 'player' ? 'launch.acid' : 'launch.enemy', { at: pos });
    const speed = a.team === 'player' ? W.speed : W.enemySpeed;
    const m = this.pool.find(p => !p.visible); if (!m) return;
    m.visible = true; m.material = this.projMat[a.team === 'player' ? 'player' : 'enemy']; m.position.copy(pos);
    m.scale.setScalar(a.weapon === 'rifle' ? 0.8 : a.weapon === 'minigun' ? 0.7 : 1);
    const id = `${a.id}-${++this.shotSerial}`;
    const trail = this.fx.trail?.({ color: a.team === 'player' ? 0xffe2a0 : 0xff7a50, width: a.weapon === 'rifle' ? 0.06 : 0.09, life: 0.16 });
    this.projectiles.push({ id, mesh: m, trail, prev: pos.clone(), vel: aimDir.multiplyScalar(speed), owner: a, team: a.team, weapon: a.weapon, life: 2.4, ledger: new AttackLedger(id), dodgeChecked: new Set() });
    this.ledgerTotals.shots++; this.emit('shot', { id, actor: a.id, weapon: a.weapon });
  }

  // ---- projectiles: hit truth -------------------------------------------------------------
  tickProjectiles(dt) {
    for (const p of this.projectiles) {
      p.prev.copy(p.mesh.position); p.mesh.position.addScaledVector(p.vel, dt); p.life -= dt; p.age = (p.age ?? 0) + dt;
      if (p.trail) this.fx.trails?.feed(p.trail, p.mesh.position, dt);
      const a0 = p.prev, a1 = p.mesh.position;
      let done = false;
      for (const t of this.actors) {
        if (!t.alive || t.team === p.team || p.ledger.consumed(t.id)) continue;
        if (t.team === 'enemy' && t.weapon && !t.active) continue; // armed enemies only take part inside their Card encounter
        const base = t.root.position, capA = { x: base.x, y: base.y + BODY_R, z: base.z }, capB = { x: base.x, y: base.y + BODY_H - BODY_R, z: base.z };
        // enemy dodge decision on approach (seeded, bounded)
        if (t.team === 'enemy' && !p.dodgeChecked.has(t.id)) {
          const toT = new THREE.Vector3(base.x - a1.x, 0, base.z - a1.z), dist = toT.length();
          if (dist < 6.5) { p.dodgeChecked.add(t.id); this.maybeDodge(t, p); }
        }
        const q = closestSegmentSegment(a0, a1, capA, capB);
        if (q.distance > BODY_R + PROJ_R) continue;
        if (t.team === 'player' && t.invulnerable?.()) { p.ledger.confirm(t.id, null, { dodged: true }); this.ledgerTotals.dodges++; this.emit('dodge', { actor: t.id, shot: p.id }); continue; }
        const hit = p.ledger.confirm(t.id, q.pointA, { damageIntent: 1, weapon: p.weapon });
        if (!hit) continue;
        this.consequence(p, t, new THREE.Vector3(q.pointA.x, q.pointA.y, q.pointA.z)); done = true; break;
      }
      if (!done && this.blockedBySupport(a1)) { done = true; this.ledgerTotals.blocked++; this.miss(p, 'support'); }
      if (!done && p.life <= 0) { done = true; this.miss(p, 'expired'); }
      if (done) { p.mesh.visible = false; p.dead = true; if (p.trail) this.fx.trails?.release(p.trail); }
    }
    this.projectiles = this.projectiles.filter(p => !p.dead);
  }
  blockedBySupport(pos) { for (const s of this.graph.items) { if (pos.y > s.top + 0.02 || pos.y < s.bottom) continue; if (this.graph.contains(s, pos.x, pos.z)) return true; } return false; }
  miss(p, why) { if (p.team === 'player') { this.ledgerTotals.misses++; this.emit('miss', { shot: p.id, why }); } }

  consequence(p, t, point) {
    const W = WEAPONS[p.weapon]; const dmg = p.team === 'player' ? W.dmg : 1;
    // exactly one damage intent, one VFX, one SFX
    this.ledgerTotals.damageIntents++;
    const vfx = this.fx.impact(point, { energy: W.energy, surface: t.team === 'player' ? 'flesh' : 'bone', heavy: W.heavy && p.team === 'player' });
    const sfx = this.audio.play(t.team === 'player' ? 'impact.wet.ink' : t.kind === 'die' ? 'dice.bounce' : 'impact.kinetic.bone', { at: point });
    if (vfx) this.ledgerTotals.vfx++; else this.ledgerTotals.vfxDropped = (this.ledgerTotals.vfxDropped || 0) + 1;
    if (sfx) this.ledgerTotals.sfx++; else this.ledgerTotals.sfxDropped = (this.ledgerTotals.sfxDropped || 0) + 1;
    t.hp = Math.max(0, t.hp - dmg);
    const fromFront = (() => { const yaw = t.root.rotation.y; const f = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)); return f.dot(p.vel.clone().setY(0).normalize()) < 0; })();
    if (t.team === 'player') { this.ledgerTotals.playerHits++; this.emit('playerHit', { shot: p.id, hp: t.hp }); }
    else { this.ledgerTotals.hits++; this.emit('hit', { shot: p.id, target: t.id, hp: t.hp, weapon: p.weapon, point: [+point.x.toFixed(2), +point.y.toFixed(2), +point.z.toFixed(2)] }); }
    if (t.hp <= 0) this.defeat(t, fromFront, p.owner);
    else if (t.team === 'player' || (t.state !== 'ATTACK' && this.time - (t.lastStagger ?? -9) > (t.poise ?? 1.4))) { // armored while attacking
      const big = W.heavy && p.team === 'player'; t.lastStagger = this.time;
      t.anim.play(big ? 'kfb_reaction_hit_front_big_a' : 'kfb_reaction_hit_front_small_a', { mode: 'once', fade: 0.06 }); t.hitT = big ? 0.6 : 0.4; t.queued = null;
    }
  }
  defeat(t, fromFront, by) {
    t.alive = false; t.queued = null; t.hitT = 0;
    t.anim.play(fromFront ? 'Death_A' : 'Death_B', { mode: 'clamp', fade: 0.08 });
    t.deadAt = this.time;
    if (t.team === 'enemy') {
      this.ledgerTotals.defeats++; if (by) by.kills++;
      const at = t.root.position.clone().add(new THREE.Vector3(0, 0.8, 0)); this.fx.defeat(at); this.audio.play(t.kind === 'die' ? 'launch.dice' : 'locomotion.die', { at });
      this.emit('defeat', { target: t.id, card: t.card, fromFront });
    }
    else this.emit('playerDown', {});
  }
  maybeDodge(t, p) {
    if (!t.alive || t.dodgeT > 0 || t.hitT > 0 || (this.time - (t.lastDodge ?? -9)) < 2.2) return;
    if (t.rng() > (t.dodgeChance ?? 0.3)) return;
    const fwd = p.vel.clone().setY(0).normalize(); const side = new THREE.Vector3(-fwd.z, 0, fwd.x).multiplyScalar(t.rng() < 0.5 ? 1 : -1);
    // only dodge onto real support
    for (const sgn of [1, -1]) {
      const d = side.clone().multiplyScalar(sgn * 1.25); const nx = t.root.position.x + d.x, nz = t.root.position.z + d.z;
      if (t.support && this.graph.contains(t.support, nx, nz, 0.35)) {
        t.dodgeT = 0.4; t.dodgeVel = d.multiplyScalar(1 / 0.4); t.lastDodge = this.time; t.queued = null;
        const local = (() => { const yaw = t.root.rotation.y; const r = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw)); return r.dot(d) > 0 ? 'Dodge_Left' : 'Dodge_Right'; })();
        t.anim.play(local, { mode: 'once', fade: 0.06 });
        this.ledgerTotals.dodges++; this.emit('enemyDodge', { actor: t.id, shot: p.id, clip: local }); return;
      }
    }
  }

  // ---- enemy brain ----------------------------------------------------------------------
  tickEnemy(a, dt, player) {
    if (!a.alive) return;
    if (a.dodgeT > 0) { a.dodgeT -= dt; a.root.position.addScaledVector(a.dodgeVel, dt); }
    if (!a.active || !player.alive) return;
    a.stateT += dt; this.faceTarget(a, player);
    if (a.hitT > 0) return;
    switch (a.state) {
      case 'IDLE': case 'RECOVER': {
        a.cool -= dt;
        if (a.strafe !== false && a.support && !a.anim.isPlaying(WEAPONS[a.weapon].aim)) { // lateral repositioning, stays on real support
          a.strafeT = (a.strafeT ?? 0) - dt; if (a.strafeT <= 0) { a.strafeDir = a.rng() < 0.5 ? -1 : 1; a.strafeT = 0.8 + a.rng() * 0.8; }
          const yaw = a.root.rotation.y, rx = Math.cos(yaw), rz = -Math.sin(yaw), sp = 1.1 * a.strafeDir;
          const nx = a.root.position.x + rx * sp * dt, nz = a.root.position.z + rz * sp * dt;
          if (this.graph.contains(a.support, nx, nz, 0.9)) { a.root.position.x = nx; a.root.position.z = nz; a.moveSpeed = Math.abs(sp); } else { a.strafeDir *= -1; a.moveSpeed = 0; }
        } else a.moveSpeed = 0;
        if (a.cool <= 0) { a.state = 'ATTACK'; a.stateT = 0; a.moveSpeed = 0; a.burstLeft = a.weapon === 'minigun' ? 1 : (a.weapon === 'rifle' ? 1 : 2); }
        break;
      }
      case 'ATTACK':
        if (a.weapon === 'minigun') {
          if (a.stateT < 1.4) { a.shotTarget = player; this.requestFire(a, player); }
          else { a.state = 'IDLE'; a.stateT = 0; a.cool = 1.6 + a.rng() * 0.9; }
        } else {
          if (!a.queued && !a.anim.isPlaying(WEAPONS[a.weapon].shoot) && this.time - a.lastShot > 0.45) {
            if (a.burstLeft-- > 0) this.requestFire(a, player);
            else { a.state = 'IDLE'; a.stateT = 0; a.cool = 1.3 + a.rng() * 1.2; a.anim.stop(WEAPONS[a.weapon].aim, 0.3); }
          }
        }
        break;
    }
  }

  update(dt, player) {
    this.time += dt;
    for (const a of this.actors) {
      if (a.hitT > 0) a.hitT -= dt;
      if (a.team === 'enemy') this.tickEnemy(a, dt, player);
      if (a.alive && a.weapon) this.tickShooter(a, dt);
      if (a.team === 'enemy' && a.wantYaw != null && a.alive) a.root.rotation.y = turn(a.root.rotation.y, a.wantYaw, 8 * dt);
    }
    this.tickProjectiles(dt); this.tickCorpses(dt);
    if (this.encounter && !this.encounter.cleared && this.enemiesOf(this.encounter.card).every(e => !e.alive)) {
      this.encounter.cleared = true; this.emit('encounterClear', { card: this.encounter.card, seconds: +(this.time - this.encounter.t0).toFixed(2) });
    }
  }
  reset() {
    for (const p of this.projectiles) { p.mesh.visible = false; p.trail && this.fx.trails?.release?.(p.trail); } this.projectiles = []; this.encounter = null;
    for (const a of this.actors) if (a.team === 'enemy' && a.spawn) {
      Object.assign(a, { alive: true, active: false, hp: a.spawn.hp, hitT: 0, queued: null, state: 'IDLE', stateT: 0, deadAt: null, dodgeT: 0, lastStagger: -9, moveSpeed: 0, lastShot: -9 });
      a.root.position.copy(a.spawn.pos); a.root.rotation.set(0, Math.PI, 0); a.root.visible = true; a.anim.stop?.(null, 0.01);
    }
    for (const k of Object.keys(this.ledgerTotals)) this.ledgerTotals[k] = 0; this.deviation.length = 0;
  }
  // corpse presentation after defeat (the only other enemy-position change besides AI/dodge)
  tickCorpses(dt) {
    for (const a of this.actors) if (a.team === 'enemy' && !a.alive && a.deadAt != null) {
      const k = this.time - a.deadAt;
      if (a.kind === 'die') { const d = a.root.children[0]; if (d && k < 0.8) { d.rotation.x += dt * 9; d.rotation.z += dt * 5; } if (k > 1.2) a.root.visible = false; }
      else if (k > 2.2) { a.root.position.y -= dt * 1.2; if (k > 3.2) a.root.visible = false; }
    }
  }
  stats() { return { ...this.ledgerTotals, activeProjectiles: this.projectiles.length, activeEnemies: this.activeEnemies().length, encounter: this.encounter ? { ...this.encounter } : null, laneDeviation: this.deviation.slice(-8) }; }
}
function turn(a, b, max) { let d = ((b - a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; return a + Math.max(-max, Math.min(max, d)); }
