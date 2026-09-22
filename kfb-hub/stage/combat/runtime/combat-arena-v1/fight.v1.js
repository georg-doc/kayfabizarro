/**
 * fight.v1.js — die Choreographie: 1v1 sequentiell, Gun zuerst, Melee danach, dann die Etage höher.
 *
 * @kfb name        Fight, Auto-Fight-Choreograph für Arena-Ring
 * @kfb category    game
 * @kfb capability  three@0.160
 * @kfb capability  clock
 * @kfb capability  rng
 * @kfb view        3d
 * @kfb determinism seeded
 * @kfb since       combat-arena v1 (CA-3)
 *
 * Eigentum (§8.3 der Motion-SOP): das Spiel besitzt Lage und Ereignis, der Deformer die Sicht-Hülle,
 * die Clips den Körper. Kein Ereignis ohne Rückweg: jeder Zustand hat eine Dauer und einen Folgezustand.
 * Zufall nur aus ctx.rng (Gegnerzahl 3–6, Trefferwürfe) — gleicher Seed, gleicher Kampf.
 * Budget je Ereignis (§10): EIN Deformer-Preset, EIN Clip, keine Wörter/Partikel (VFX/SFX eigene Scheibe).
 */
import { Deformer } from './cartoon-deform.v1.js';

export const SPEC = {
  player: { height: 1.7, hp: 6, x: -1.7, clips: { idle: 'Idle_Gun', shoot: 'Idle_Shoot', punch: 'Punch', hit: 'HitReact', death: 'Death', jump: 'Jump', land: 'Jump_Land', win: 'Wave', run: 'Run_Gun' } },
  enemy: { spawnX: 3.6, standoffX: 2.0, meleeDist: 1.35, walkSpeed: 1.25, stepPerHit: 0.42 },
  timing: { shot: 1.05, shotToHit: 0.14, melee: 0.95, death: 1.45, ko: 2.2, clear: 1.1, jump: 0.95, spawn: 0.6 },
  perCard: [3, 6], enemyReturnFire: 0.4, playerBlock: 0.35, storey: 3.2,
};

export default class Fight {
  static describe() { return { name: 'Fight', capabilities: ['three@0.160', 'clock', 'rng'], view: '3d', determinism: 'seeded', spec: SPEC }; }
  async init(ctx) { this.THREE = ctx.three; this.rng = ctx.rng; this.camera = ctx.camera; this.log = (s) => (ctx.log || console.info)('[fight] ' + s); this.events = []; this.t = 0; this.phase = 'off'; this.level = 0; this.cards = 0; }

  /** Verdrahten: Spieler-Modul, Gegner-Modul, Ring, Kamera-Controls, Gegnerwahl. */
  attach({ player, enemies, ring, controls, roster, vfx }) {
    const T = this.THREE;
    this.player = player; this.enemies = enemies; this.ring = ring; this.controls = controls; this.roster = roster || ['skel_warrior', 'orc_brute']; this.vfx = vfx || null;
    if (this.vfx) this.vfx.protected = () => this._protected();
    // Sicht-Hülle um die Spielerfigur — das Spiel fasst sie nie an, nur der Deformer
    if (!player.shell) { const sh = new T.Group(); sh.name = 'deform-shell'; player.root.add(sh); sh.add(player.figure); player.shell = sh; }
    player.root.scale.setScalar(SPEC.player.height / player.m.height);
    this.pDef = new Deformer(T, player.shell, { mixer: player.mixer, onPhase: (n, ph, t) => this._ev('player', n, ph, t) });
    this.php = SPEC.player.hp;
    this.bouts = 0; this.kills = 0;
    return this;
  }
  _ev(who, name, ph, t) { this.events.unshift({ t: +this.t.toFixed(2), who, name, ph, at: t }); if (this.events.length > 40) this.events.length = 40; }
  /* Geschützte Flächen (SOP §2.3/§6.5): die Köpfe beider Kämpfer, als NDC-Rechtecke. */
  _protected() {
    const T = this.THREE, out = [], cam = this.camera;
    const head = (obj, h) => { if (!obj) return; const p = obj.getWorldPosition(new T.Vector3()); p.y += h * 0.82; const n = p.clone().project(cam); out.push({ x: n.x, y: n.y, w: 0.22, h: 0.26 }); };
    head(this.player.root, SPEC.player.height); if (this.enemy) head(this.enemy.node, this.enemy.height);
    return out;
  }
  _muzzle() { const T = this.THREE, p = this.player.root.getWorldPosition(new T.Vector3()); p.y += SPEC.player.height * 0.56; p.x += 0.55; return p; }
  _chest(f) { const T = this.THREE, p = f.node.getWorldPosition(new T.Vector3()); p.y += f.height * 0.58; return p; }
  _say(s) { this.log(s); this._ev('game', s, '', 0); }

  start() {
    this.level = this.ring.level; this.left = this._perCard(); this.phase = 'spawn'; this.pt = 0; this.total = this.left;
    this._place(); this.player.play(SPEC.player.clips.idle, { loop: true });
    this._say('level ' + (this.level + 1) + ' · ' + this.left + ' enemies');
    this._spawn();
  }
  _perCard() { const [a, b] = SPEC.perCard; return a + Math.floor(this.rng() * (b - a + 1)); }
  _floor() { return this.ring.floorY(); }
  _place() { const p = this.player.root; p.position.set(SPEC.player.x, this._floor(), 0); p.rotation.y = Math.PI / 2; }
  async _spawn() {
    const id = this.roster[this.bouts % this.roster.length];
    this.phase = 'spawn'; this.pt = 0; this.spawning = true;
    const f = await this.enemies.spawn(id);
    this.enemy = f; f.node.position.set(SPEC.enemy.spawnX, this._floor(), 0); f.node.rotation.y = -Math.PI / 2;
    f.def2 = new Deformer(this.THREE, f.shell, { mixer: f.mixer, onPhase: (n, ph, t) => this._ev(f.label, n, ph, t) });
    f.play('walk', { loop: true }) || f.play('idle', { loop: true });
    this.spawning = false; this.phase = 'enter'; this.bouts++;
    this._say(f.label + ' enters (' + (this.total - this.left + 1) + '/' + this.total + ')');
  }
  _dist() { return this.enemy ? this.enemy.node.position.x - this.player.root.position.x : 99; }
  _playOnce(name, then) { const a = this.player.play(name, { loop: false }); const dur = a ? a.getClip().duration : 0.6; this._pOnce = { t: dur / (a ? a.timeScale : 1), then }; return dur; }

  update(dt) {
    if (this.phase === 'off') return;
    this.t += dt; this.pt += dt;
    const P = this.player, E = this.enemy, T = SPEC.timing;
    this.pDef.update(dt); if (E && E.def2) E.def2.update(dt);
    if (this._pOnce) { this._pOnce.t -= dt; if (this._pOnce.t <= 0) { const th = this._pOnce.then; this._pOnce = null; if (th) th(); } }
    if (this._eOnce && E) { this._eOnce.t -= dt; if (this._eOnce.t <= 0) { const th = this._eOnce.then; this._eOnce = null; if (th) th(); } }
    if (this._delays) { this._delays = this._delays.filter((d) => { d.t -= dt; if (d.t <= 0) { d.fn(); return false; } return true; }); }
    // Boden folgt der atmenden Karte
    P.root.position.y = this._floor() + (this._jumpY || 0); if (E && E.alive) E.node.position.y = this._floor();

    switch (this.phase) {
      case 'enter': {
        E.node.position.x -= SPEC.enemy.walkSpeed * dt;
        if (E.node.position.x <= SPEC.enemy.standoffX) { E.play('idle', { loop: true }); this.phase = 'ranged'; this.pt = T.shot * 0.5; this._say('ranged phase — gun first'); }
        break;
      }
      case 'ranged': {
        if (this.pt >= T.shot && !this._pOnce) {
          this.pt = 0;
          this.pDef.fire('fire'); this._playOnce(SPEC.player.clips.shoot, () => P.play(SPEC.player.clips.idle, { loop: true }));
          if (this.vfx) this.vfx.fire(this._muzzle(), new this.THREE.Vector3(1, 0, 0));
          this._later(T.shotToHit, () => this._hitEnemy());
          if (E.def.ranged && this.rng() < SPEC.enemyReturnFire) this._later(0.55, () => this._enemyShoots());
        }
        if (E.alive && E.node.position.x - P.root.position.x <= SPEC.enemy.meleeDist) { this.phase = 'melee'; this.pt = 0; this.turn = 'player'; this._say('melee phase'); }
        break;
      }
      case 'melee': {
        if (this.pt >= T.melee && !this._pOnce && !this._eOnce) {
          this.pt = 0;
          if (this.turn === 'player') { this._playOnce(SPEC.player.clips.punch, () => P.play(SPEC.player.clips.idle, { loop: true })); this._later(0.28, () => this._hitEnemy()); this.turn = 'enemy'; }
          else { const a = E.play('attack', { loop: false }); this._eOnce = { t: a ? a.getClip().duration : 0.8, then: () => E.play('idle', { loop: true }) }; this._later(0.32, () => this._hitPlayer()); this.turn = 'player'; }
        }
        break;
      }
      case 'death': if (this.pt >= T.death) { this.enemies.despawn(E); this.enemy = null; this.kills++; this.left--; if (this.left > 0) this._spawn(); else { this.phase = 'clear'; this.pt = 0; this.cards++; P.play(SPEC.player.clips.win, { loop: true }); this._say('card cleared → collected ' + this.cards); } } break;
      case 'ko': if (this.pt >= T.ko) { this.php = SPEC.player.hp; this.pDef.rest.op = 1; this.pDef._apply(this.pDef.rest); P.play(SPEC.player.clips.idle, { loop: true }); this.phase = this._dist() <= SPEC.enemy.meleeDist ? 'melee' : 'ranged'; this.pt = 0; this._say('player back up'); } break;
      case 'clear': if (this.pt >= T.clear) this._transition(); break;
      case 'jump': {
        const k = Math.min(1, this.pt / T.jump), s = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const from = this._jumpFrom, to = from + SPEC.storey;
        this._jumpY = (from + (to - from) * s + Math.sin(k * Math.PI) * 1.1) - this._floor();
        if (this.controls) { this.controls.target.y = 0.9 + from + (to - from) * s; this.camera.position.y = this._camY0 + (to - from) * s; }
        if (k >= 1) { this._jumpY = 0; this.phase = 'landed'; this.pt = 0; P.play(SPEC.player.clips.land, { loop: false }); if (this.onLevel) this.onLevel(this.level); this._later(0.5, () => { this.left = this._perCard(); this.total = this.left; this._say('level ' + (this.level + 1) + ' · ' + this.left + ' enemies'); P.play(SPEC.player.clips.idle, { loop: true }); this._spawn(); }); }
        break;
      }
    }
    if (this.controls && this.phase !== 'jump') { const tx = E ? (P.root.position.x + E.node.position.x) / 2 : 0; this.controls.target.x += (tx - this.controls.target.x) * Math.min(1, dt * 3); this.controls.target.y += ((this._floor() + 0.9) - this.controls.target.y) * Math.min(1, dt * 3); }
  }
  _later(t, fn) { (this._delays = this._delays || []).push({ t, fn }); }
  _hitEnemy() {
    const E = this.enemy; if (!E || !E.alive) return;
    E.hp--; E.def2.fire('hit');
    if (this.vfx) { if (E.hp <= 0) this.vfx.down(this._chest(E), 'down'); else this.vfx.hit(this._chest(E), new this.THREE.Vector3(1, 0, 0)); }
    if (E.hp <= 0) { E.alive = false; this.phase = 'death'; this.pt = 0; E.def2.fire('death'); E.play('death', { loop: false }); this._say(E.label + ' down'); return; }
    const a = E.play('hit', { loop: false }); this._eOnce = { t: a ? Math.min(a.getClip().duration, 0.8) : 0.6, then: () => { if (E.alive) { if (this.phase === 'ranged') { E.node.position.x = Math.max(SPEC.enemy.meleeDist - 0.05 + this.player.root.position.x, E.node.position.x - SPEC.enemy.stepPerHit); } E.play('idle', { loop: true }); } } };
  }
  _enemyShoots() { const E = this.enemy; if (!E || !E.alive) return; const a = E.play('shoot', { loop: false }) || E.play('attack', { loop: false }); this._eOnce = { t: a ? a.getClip().duration : 0.7, then: () => E.alive && E.play('idle', { loop: true }) }; this._later(0.3, () => this._hitPlayer()); }
  _hitPlayer() {
    if (this.phase === 'ko' || this.phase === 'death') return;
    if (this.rng() < SPEC.playerBlock) { this._ev('player', 'block', 'no damage', 0); return; }
    this.php--; this.pDef.fire(this.php > 0 && this.rng() < 0.3 ? 'stun' : 'hit');
    if (this.vfx) { const p = this.player.root.getWorldPosition(new this.THREE.Vector3()); p.y += SPEC.player.height * 0.55; if (this.php <= 0) this.vfx.down(p, 'ko'); else this.vfx.hit(p, new this.THREE.Vector3(-1, 0, 0)); }
    if (this.php <= 0) { this.phase = 'ko'; this.pt = 0; this.pDef.fire('death'); this._playOnce(SPEC.player.clips.death, null); this._say('FrizzleBob KO'); return; }
    this._playOnce(SPEC.player.clips.hit, () => this.player.play(SPEC.player.clips.idle, { loop: true }));
  }
  _transition() {
    this.level++; this.ring.newCard(this.level);
    this.phase = 'jump'; this.pt = 0; this._jumpFrom = this._floor() - SPEC.storey; this._camY0 = this.camera.position.y;
    this.player.play(SPEC.player.clips.jump, { loop: false });
    this._say('jump to level ' + (this.level + 1));
  }
  state() {
    const E = this.enemy;
    return { phase: this.phase, level: this.level + 1, cards: this.cards, kills: this.kills, left: this.left, total: this.total, php: this.php, pmax: SPEC.player.hp, enemy: E ? { label: E.label, hp: E.hp, max: E.maxHp, clip: E.current, compat: E.compat, own: E.own } : null, pclip: this.player && this.player.current ? this.player.current.name : null, events: this.events.slice(0, 12), dist: +this._dist().toFixed(2) };
  }
  dispose() { this.phase = 'off'; }
}
