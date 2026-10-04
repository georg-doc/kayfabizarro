/* pet-motion.v2.js — KFB PET MOTION LIBRARY v2 (2026-07-19). Fork von pet-motion.v1.js.
   NEU in v2 (Auftrag Motion-Editor v2, Sprint uploads/SPRINT_mienenspiel.md):
   - CLIP-LAYER: direkter Zugriff auf ALLE 8 Kenney-GLB-Clips (static/idle/walk/run/eat/
     dance/gesture±) via playClip(name,{speed,loop}) — v1 zeigte nur die prozedurale Schicht.
   - TRIGGER-BUS: trigger('drop'|'brake'|'curveL'|'curveR'|'card'|'still') = Game-Events aus
     dem Briefing. Gesicht reagiert VOR dem Koerper (Augen sind schneller), FX interpunktieren.
   - COMBOS: combo('doubleTake'|'shiver'|'tada'|'random') — Baukasten Anticipation->Aktion->
     Recover nach den 12 Prinzipien; random wuerfelt NUR auf Anforderung (Zufall ist der
     Feind von lebendig — Briefing).
   - SEKUNDAER-MOTION: benannte GLB-Knoten (ear/tail/antler/horn/wing) bekommen Follow-
     Through-Federn: sie hinken dem Koerper nach und schwingen aus (Prinzip 5). Additiv NACH
     dem Mixer (pro Frame Offset auf die Clip-Rotation), keine Knoten gefunden = stiller Skip.
   - opts.face (PetFace, pet-face.v1.js) + opts.fx (PetFX, pet-fx.v1.js) — beide optional.
   VERTRAG unveraendert: update(dt) NACH ch.update(dt), VOR face.update(dt), VOR rig.update(dt).
   Prime Directive: jede Motion ist Interpunktion, settlet in Ruhe. */

export const MOTION_DEFAULTS = {
  idle:       { breathe: 0.03, period: 2.8, sway: 0.010 },
  hop:        { height: 0.30, dur: 0.66, anticip: 0.16, squash: 0.72, stretch: 1.26, land: 0.68, rebound: 1.10 },
  powerJump:  { height: 1.05, dur: 1.24, anticip: 0.26, squash: 0.58, stretch: 1.44, hang: 0.16, land: 0.52, rebound: 1.18 },
  locomotion: { hops: 3, height: 0.24, hopDur: 0.46, anticip: 0.12, squash: 0.76, stretch: 1.20, land: 0.72 },
  loading:    { height: 0.16, period: 0.54, squash: 0.78, stretch: 1.16 },
  transition: { anticip: 0.30, out: 0.44, rise: 0.85, shrink: 0.06, spin: 0.7, hold: 0.06, in: 0.5 },
  turn:       { dur: 0.5, overshoot: 0.18, squash: 0.86 },
  celebrate:  { hops: 3, height: 0.28, dur: 1.7, squash: 0.70, stretch: 1.24 },
  reactPos:   { height: 0.22, dur: 0.52, squash: 0.82, stretch: 1.22 },
  reactNeg:   { dur: 0.55, squash: 0.50, sink: 0.10 },
  secondary:  { amp: 1.0, freq: 7.0, damp: 7.5 },   // Ohren/Tail/Geweih-Federn
};

export const PARAM_META = {
  idle:       [['breathe', 'Atem', 0, 0.08, 0.002], ['period', 'Periode s', 1.4, 5, 0.1], ['sway', 'Wiegen', 0, 0.04, 0.002]],
  hop:        [['height', 'Hoehe', 0.05, 0.7, 0.01], ['dur', 'Dauer s', 0.3, 1.2, 0.02], ['anticip', 'Anticip', 0.05, 0.4, 0.01], ['squash', 'Squash', 0.4, 1, 0.02], ['stretch', 'Stretch', 1, 1.7, 0.02], ['land', 'Land-Squash', 0.4, 1, 0.02], ['rebound', 'Rebound', 1, 1.4, 0.02]],
  powerJump:  [['height', 'Hoehe', 0.4, 2, 0.02], ['dur', 'Dauer s', 0.7, 2, 0.02], ['anticip', 'Anticip', 0.1, 0.45, 0.01], ['squash', 'Squash', 0.4, 1, 0.02], ['stretch', 'Stretch', 1, 1.8, 0.02], ['hang', 'Hang', 0, 0.35, 0.01], ['land', 'Land-Squash', 0.35, 1, 0.02], ['rebound', 'Rebound', 1, 1.5, 0.02]],
  locomotion: [['hops', 'Huepfer', 1, 6, 1], ['height', 'Hoehe', 0.05, 0.5, 0.01], ['hopDur', 'Dauer/Huepfer', 0.28, 0.9, 0.02], ['anticip', 'Anticip', 0.05, 0.3, 0.01], ['squash', 'Squash', 0.5, 1, 0.02], ['stretch', 'Stretch', 1, 1.5, 0.02], ['land', 'Land-Squash', 0.5, 1, 0.02]],
  loading:    [['height', 'Hoehe', 0.05, 0.4, 0.01], ['period', 'Periode s', 0.3, 1, 0.02], ['squash', 'Squash', 0.5, 1, 0.02], ['stretch', 'Stretch', 1, 1.4, 0.02]],
  transition: [['anticip', 'Anticip', 0.1, 0.5, 0.02], ['out', 'Raus s', 0.25, 0.8, 0.02], ['rise', 'Steigung', 0.3, 1.6, 0.02], ['shrink', 'Rest-Groesse', 0.01, 0.4, 0.01], ['spin', 'Drehung', 0, 2, 0.05], ['in', 'Rein s', 0.25, 0.9, 0.02]],
  turn:       [['dur', 'Dauer s', 0.25, 1, 0.02], ['overshoot', 'Overshoot', 0, 0.4, 0.02], ['squash', 'Squash', 0.6, 1, 0.02]],
  celebrate:  [['hops', 'Huepfer', 1, 6, 1], ['height', 'Hoehe', 0.1, 0.6, 0.01], ['dur', 'Dauer s', 0.8, 3, 0.05], ['squash', 'Squash', 0.5, 1, 0.02], ['stretch', 'Stretch', 1, 1.5, 0.02]],
  reactPos:   [['height', 'Hoehe', 0.05, 0.5, 0.01], ['dur', 'Dauer s', 0.3, 1, 0.02], ['squash', 'Squash', 0.5, 1, 0.02], ['stretch', 'Stretch', 1, 1.5, 0.02]],
  reactNeg:   [['dur', 'Dauer s', 0.3, 1, 0.02], ['squash', 'Squash', 0.35, 1, 0.02], ['sink', 'Absacken', 0, 0.25, 0.01]],
  secondary:  [['amp', 'Amplitude', 0, 2.5, 0.05], ['freq', 'Frequenz Hz', 3, 14, 0.2], ['damp', 'Daempfung', 3, 16, 0.2]],
};

// ---- v2: Clip-Layer (die 8 Kenney-GLB-Clips, kanonische our-Namen) ----
export const CLIPS = [
  ['static', 'Static', true], ['idle', 'Idle', true], ['walk', 'Walk', true], ['run', 'Run', true],
  ['eat', 'Eat', false], ['dance', 'Dance', true], ['gesture-positive', 'Gest +', false], ['gesture-negative', 'Gest −', false],
];
export const CLIP_DEFAULTS = {
  'static': { speed: 1 }, idle: { speed: 1 }, walk: { speed: 1 }, run: { speed: 1.1 },
  eat: { speed: 1 }, dance: { speed: 1 }, 'gesture-positive': { speed: 1 }, 'gesture-negative': { speed: 1 },
};
// ---- v2: Game-Events (Fahrwerte-Ausloeser aus dem Briefing) + Combos ----
export const EVENTS = [
  ['drop', 'Drop', 'j schlaegt aus: surprised hart + Impact'],
  ['brake', 'Bremse', 'a negativ: Richtung sad + Skid'],
  ['curveL', 'Kurve ←', 'hohes c: Blick + Lean in die Kurve'],
  ['curveR', 'Kurve →', 'hohes c: Blick + Lean in die Kurve'],
  ['card', 'Karte', 'Karte passiert: kurz hingucken'],
];
export const COMBOS = [
  ['doubleTake', 'Double-Take'], ['shiver', 'Shiver'], ['tada', 'Tada!'], ['random', 'Zufalls-Combo'],
];
// Deklaratives Trigger-Mapping (wandert in den Contract, damit Apps es lesen koennen)
export const TRIGGER_INFO = {
  drop:   { face: 'surprised', hard: true, body: 'impact', fx: ['star', 'dust'], eye: 'pop' },
  brake:  { face: 'sad', body: 'skid', fx: ['dust'], eye: 'oval' },
  curveL: { face: 'gaze-out', body: 'lean' },
  curveR: { face: 'gaze-out', body: 'lean' },
  card:   { face: 'glance', body: 'bob', eye: 'pop-soft' },
  still:  { face: 'drift' },
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (t) => t * t * (3 - 2 * t);
const easeOutBack = (t) => { const c = 2.2; return 1 + c * Math.pow(t - 1, 3) + (c - 1) * Math.pow(t - 1, 2); };
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function kf(frames, t) {
  if (t <= frames[0][0]) return frames[0][1];
  const n = frames.length;
  if (t >= frames[n - 1][0]) return frames[n - 1][1];
  for (let i = 1; i < n; i++) {
    if (t <= frames[i][0]) {
      const a = frames[i - 1], b = frames[i];
      const k = (t - a[0]) / Math.max(1e-4, b[0] - a[0]);
      return a[1] + (b[1] - a[1]) * smooth(k);
    }
  }
  return frames[n - 1][1];
}
function merge(base, over) {
  const out = {};
  for (const k in base) out[k] = (over && typeof over[k] === 'object') ? merge(base[k], over[k]) : (over && over[k] != null ? over[k] : base[k]);
  if (over) for (const k in over) if (!(k in out)) out[k] = over[k];
  return out;
}

export class PetMotion {
  constructor(ch, opts = {}) {
    this.ch = ch; this.THREE = ch.THREE;
    this.rig = opts.rig || null;
    this.face = opts.face || null;   // v2: PetFace (Mienenspiel)
    this.fx = opts.fx || null;       // v2: PetFX (Staub/Stern/Speedlines)
    this.eyeReact = opts.eyeReact !== false;
    this.params = merge(MOTION_DEFAULTS, opts.params || {});
    this.clipParams = merge(CLIP_DEFAULTS, opts.clipParams || {});
    this.master = opts.squashStretch != null ? opts.squashStretch : 1;
    this.front = opts.front || { x: 0, z: 1.1 };
    this.back = opts.back || { x: 0, z: -1.3 };
    this._tw = null;
    this._loop = null;
    this._lt = 0;
    this._sy = 1;
    this._sySmooth = 1; this._syVel = { v: 0 };
    this._smoothTime = opts.smoothTime != null ? opts.smoothTime : 0.07;
    this._baseGroupS = null;
    this._parts = null;              // Sekundaer-Teile (lazy nach ch.load via initParts())
    this._prevY = null; this._prevYaw = null;
  }
  setParams(p) { this.params = merge(this.params, p || {}); }
  setClipParams(p) { this.clipParams = merge(this.clipParams, p || {}); }
  setMaster(x) { this.master = x; }
  setSmooth(t) { this._smoothTime = Math.max(0.005, t); }
  setEyeReact(on) { this.eyeReact = !!on; }
  loop(name, on) { if (on) { this._loop = name; this._lt = 0; } else if (this._loop === name) this._loop = null; }
  stopLoops() { this._loop = null; }
  get busy() { return !!this._tw; }

  // ---- v2: Clip-Layer — roher Zugriff auf die GLB-Clips, an ch.play vorbei (aliast nichts weg) ----
  playClip(name, o = {}) {
    const ch = this.ch;
    if (!ch || !ch.mixer || !ch._clip) return null;
    const cl = ch._clip(name);
    if (!cl) return null;
    const T = this.THREE;
    const p = this.clipParams[name] || {};
    const a = ch.mixer.clipAction(cl);
    a.reset();
    a.setLoop(o.loop === false ? T.LoopOnce : T.LoopRepeat, Infinity);
    a.clampWhenFinished = o.loop === false;
    a.timeScale = o.speed != null ? o.speed : (p.speed != null ? p.speed : 1);
    if (ch._action && ch._action !== a) ch._action.fadeOut(0.18);
    a.fadeIn(0.18).play();
    ch._action = a;
    this._activeClip = name;
    return a;
  }
  stopClip() { this._activeClip = null; if (this.ch && this.ch.play) this.ch.play('idle'); }

  // ---- v2: Sekundaer-Motion — benannte Teile (Ohren/Tail/Geweih) als Follow-Through-Federn ----
  initParts() {
    this._parts = [];
    if (!this.ch || !this.ch.inner) return this._parts;
    const rx = /ear|tail|antler|horn|wing|tusk|trunk|mane/i;
    const taken = new Set();
    this.ch.inner.traverse((n) => {
      if (!n.name || n.userData.petOverlay || !rx.test(n.name)) return;
      let a = n.parent; while (a) { if (taken.has(a)) return; a = a.parent; }   // nur oberste Treffer
      taken.add(n);
      this._parts.push({ n, kx: { s: 0, v: 0 }, kz: { s: 0, v: 0 }, seed: Math.random() * Math.PI * 2, g: 0.8 + Math.random() * 0.4 });
    });
    if (this._parts.length) console.info('[pet-motion.v2] Sekundaer-Teile:', this._parts.map((p) => p.n.name).join(', '));
    else console.info('[pet-motion.v2] keine benannten Sekundaer-Teile (ear/tail/…) im GLB gefunden');
    return this._parts;
  }
  _updateParts(dt) {
    if (!this._parts || !this._parts.length) return;
    const P = this.params.secondary, g = this.ch.group;
    const y = g.position.y, yaw = g.rotation.y;
    if (this._prevY == null) { this._prevY = y; this._prevYaw = yaw; return; }
    const vy = clamp((y - this._prevY) / Math.max(1e-4, dt), -6, 6);
    let dyaw = yaw - this._prevYaw; while (dyaw > Math.PI) dyaw -= Math.PI * 2; while (dyaw < -Math.PI) dyaw += Math.PI * 2;
    const vyaw = clamp(dyaw / Math.max(1e-4, dt), -12, 12);
    this._prevY = y; this._prevYaw = yaw;
    const w = P.freq, d = P.damp;
    for (const p of this._parts) {
      // Anregung: Teil hinkt dem Koerper nach (steigt er, klappt das Teil zurueck) + Dreh-Schwung
      const tx = clamp(-vy * 0.10 * P.amp * p.g, -0.45, 0.45);
      const tz = clamp(-vyaw * 0.05 * P.amp * p.g, -0.35, 0.35);
      p.kx.v += ((tx - p.kx.s) * w * w * dt) - p.kx.v * d * dt;
      p.kz.v += ((tz - p.kz.s) * w * w * dt) - p.kz.v * d * dt;
      p.kx.s += p.kx.v * dt; p.kz.s += p.kz.v * dt;
      // ADDITIV nach dem Mixer: der Clip hat die Rotation dieses Frames schon geschrieben
      p.n.rotation.x += p.kx.s;
      p.n.rotation.z += p.kz.s;
    }
  }

  // ---- Squash (wie v1) ----
  _msy(sy) { return 1 + (sy - 1) * this.master; }
  _applySquash(sy) {
    const ch = this.ch; if (!ch.inner) return;
    const s = clamp(this._msy(sy), 0.45, 1.8);
    const sxz = 1 + (1 - s) * 0.6;
    ch._squash.s = s; ch._squash.v = 0;
    ch.inner.scale.set(ch._baseS * sxz, ch._baseS * s, ch._baseS * sxz);
  }
  _smoothDamp(cur, target, vel, st, dt) {
    st = Math.max(1e-4, st);
    const omega = 2 / st, x = omega * dt;
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    const change = cur - target;
    const temp = (vel.v + omega * change) * dt;
    vel.v = (vel.v - omega * temp) * exp;
    return target + (change + temp) * exp;
  }
  _ground() { return this.ch._home ? this.ch._home.y : 0; }
  _face(dx, dz) { if (Math.hypot(dx, dz) > 1e-3) this.ch.group.rotation.y = Math.atan2(dx, dz); }
  _eyeBlink() { if (this.eyeReact && this.rig && this.rig.blinkNow) this.rig.blinkNow(); }
  _wait(d) { return new Promise((res) => { this._tw = { t: 0, dur: d, done: res, fn: () => {} }; }); }

  // ---- Sprung-Primitive (wie v1) + v2: Staub bei Landung ab height>=0.3 ----
  _jumpFrames(a, p) {
    const air = a + (1 - a) * 0.80;
    const rb = p.rebound || 1.08, midStretch = (p.stretch + 1) * 0.5;
    return {
      air0: a, air1: air,
      sy: [
        [0, 1], [a * 0.5, p.squash], [a, p.stretch],
        [a + (air - a) * 0.26, 1.02], [a + (air - a) * 0.5, 1.0 + (p.hang || 0)], [a + (air - a) * 0.74, midStretch],
        [air, p.land],
        [air + (1 - air) * 0.30, rb],
        [air + (1 - air) * 0.58, 1 - (rb - 1) * 0.42],
        [air + (1 - air) * 0.82, 1 + (rb - 1) * 0.16],
        [1, 1],
      ],
    };
  }
  _jump(cfg) {
    const ch = this.ch, g = ch.group;
    const from = g.position.clone();
    const toX = cfg.toX != null ? cfg.toX : from.x, toZ = cfg.toZ != null ? cfg.toZ : from.z;
    const gy = this._ground();
    if (cfg.face !== false) this._face(toX - from.x, toZ - from.z);
    const fr = this._jumpFrames(cfg.anticip, cfg.p);
    const eye = cfg.eye !== false;
    let ph = 0, phFx = 0;
    return new Promise((res) => {
      this._tw = {
        t: 0, dur: cfg.dur, done: res,
        fn: (k) => {
          this._sy = kf(fr.sy, k);
          let px = from.x, pz = from.z, py = gy;
          if (k > fr.air0) {
            const aa = clamp((k - fr.air0) / (fr.air1 - fr.air0), 0, 1);
            px = from.x + (toX - from.x) * smooth(aa);
            pz = from.z + (toZ - from.z) * smooth(aa);
            py = gy + 4 * aa * (1 - aa) * cfg.p.height;
          }
          if (k >= fr.air1) {
            px = toX; pz = toZ;
            const kb = (k - fr.air1) / Math.max(1e-4, 1 - fr.air1);
            py = gy + Math.sin(kb * Math.PI) * cfg.p.height * 0.11 * (1 - kb);
          }
          g.position.set(px, py, pz);
          if (eye && ph === 0 && k >= fr.air1 * 0.96) { this._eyeBlink(); ph = 1; }
          if (this.fx && cfg.dust !== false && phFx === 0 && k >= fr.air1 && cfg.p.height >= 0.3) {
            this.fx.dust({ x: px, y: gy, z: pz }, Math.round(4 + cfg.p.height * 6), 0.25 + cfg.p.height * 0.35);
            phFx = 1;
          }
        },
      };
    }).then(() => { g.position.set(toX, gy, toZ); this._sy = 1; });
  }

  hop(o = {}) {
    const p = merge(this.params.hop, o.params);
    return this._jump({ dur: o.dur || p.dur, anticip: p.anticip, p, toX: o.toX, toZ: o.toZ, face: o.face });
  }
  powerJump(o = {}) {
    const p = merge(this.params.powerJump, o.params);
    return this._jump({ dur: o.dur || p.dur, anticip: p.anticip, p, toX: o.toX, toZ: o.toZ });
  }
  async jumpTo(x, z, o = {}) {
    const p = merge(this.params.locomotion, o.params);
    const hops = Math.max(1, Math.round(o.hops || p.hops));
    const ch = this.ch, from = ch.group.position.clone();
    this._face(x - from.x, z - from.z);
    for (let i = 1; i <= hops; i++) {
      const tx = from.x + (x - from.x) * (i / hops);
      const tz = from.z + (z - from.z) * (i / hops);
      await this._jump({ dur: p.hopDur, anticip: p.anticip, p: { height: p.height, squash: p.squash, stretch: p.stretch, land: p.land, rebound: 1.06, hang: 0 }, toX: tx, toZ: tz, face: i === 1, eye: i === 1, dust: false });
    }
  }
  locomotion(o = {}) { return this.jumpTo(o.toX != null ? o.toX : this.front.x, o.toZ != null ? o.toZ : this.front.z, o); }

  turnTo(rad, o = {}) {
    const p = merge(this.params.turn, o.params);
    const ch = this.ch, r0 = ch.group.rotation.y;
    let d = rad - r0; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
    return new Promise((res) => {
      this._tw = {
        t: 0, dur: p.dur, done: res,
        fn: (k) => {
          ch.group.rotation.y = r0 + d * easeOutBack(k);
          this._sy = 1 - (1 - p.squash) * Math.sin(k * Math.PI);
        },
      };
    }).then(() => { ch.group.rotation.y = rad; this._sy = 1; });
  }
  turn180() { return this.turnTo(this.ch.group.rotation.y + Math.PI); }

  async celebrate() {
    const p = merge(this.params.celebrate, this.params.celebrate);
    if (this.ch.play) this.ch.play('celebrate');
    if (this.ch.emote) this.ch.emote('celebrate');
    if (this.face) this.face.set('happy', { hold: p.dur + 0.5 });
    const per = p.dur / p.hops;
    for (let i = 0; i < p.hops; i++) {
      await this._jump({ dur: per, anticip: 0.14, p: { height: p.height, squash: p.squash, stretch: p.stretch, land: p.squash + 0.06, rebound: 1.12, hang: 0 }, face: false, eye: i === 0, dust: false });
    }
    this._restoreBase();
  }
  async react(kind) {
    if (kind === 'negative') {
      const p = this.params.reactNeg;
      if (this.ch.play) this.ch.play('react-negative');
      if (this.ch.emote) this.ch.emote('negative');
      if (this.face) this.face.set('sad', { hold: p.dur + 0.6 });
      const gy = this._ground(), g = this.ch.group;
      this._eyeBlink();
      await new Promise((res) => {
        this._tw = { t: 0, dur: p.dur, done: res, fn: (k) => {
          this._sy = kf([[0, 1], [0.3, p.squash], [0.75, p.squash + 0.05], [1, 1]], k);
          g.position.y = gy - Math.sin(Math.min(k / 0.4, 1) * Math.PI * 0.5) * p.sink * (1 - Math.max(0, (k - 0.6) / 0.4));
        } };
      }).then(() => { g.position.y = gy; this._sy = 1; });
      this._restoreBase();
    } else {
      const p = this.params.reactPos;
      if (this.ch.play) this.ch.play('react-positive');
      if (this.ch.emote) this.ch.emote('positive');
      if (this.face) this.face.set('happy', { hold: p.dur + 0.6 });
      await this._jump({ dur: p.dur, anticip: 0.14, p: { height: p.height, squash: p.squash, stretch: p.stretch, land: p.squash + 0.05, rebound: 1.12, hang: 0 }, face: false, dust: false });
      this._restoreBase();
    }
  }
  // nach One-Shots: aktiver Clip-Pad gewinnt, sonst idle
  _restoreBase() {
    if (this._activeClip) this.playClip(this._activeClip);
    else if (this.ch.play) this.ch.play('idle');
  }

  // ---- v2: TRIGGER-BUS — Game-Events. Reihenfolge: Augen -> Gesicht -> Koerper -> FX ----
  async trigger(name, o = {}) {
    const F = this.face, X = this.fx, g = this.ch.group, gy = this._ground();
    if (name === 'drop') {
      if (F) { F.set('surprised', { hard: true, hold: 1.2 }); F.eyePop(0.55); }   // Augen zuerst, hart und sofort
      const h = o.height != null ? o.height : 0.55;
      await new Promise((res) => { this._tw = { t: 0, dur: 0.2, done: res, fn: (k) => { g.position.y = gy + h * (1 - k * k); this._sy = 1.3 - 0.12 * k; } }; });
      this._sy = 0.45;
      if (X) { X.star({ x: g.position.x, y: gy + 0.85, z: g.position.z + 0.25 }); X.dust(g.position, 10, 0.55); }
      this._eyeBlink();
      await new Promise((res) => { this._tw = { t: 0, dur: 0.5, done: res, fn: (k) => { this._sy = kf([[0, 0.45], [0.3, 1.18], [0.6, 0.92], [1, 1]], k); } }; });
    } else if (name === 'brake') {
      if (F) { F.set('sad', { hold: 1.4 }); F.eyeOval(0.55, 0.7); }               // Gesicht VOR dem Koerper
      const from = g.position.clone(), d = o.dist != null ? o.dist : 0.5, yaw = g.rotation.y;
      const dx = Math.sin(yaw) * d, dz = Math.cos(yaw) * d;
      if (X) { X.dust({ x: from.x, y: gy, z: from.z }, 6, 0.4); }
      await new Promise((res) => {
        this._tw = { t: 0, dur: 0.55, done: res, fn: (k) => {
          const e = 1 - Math.pow(1 - k, 3);
          g.position.set(from.x + dx * e, gy, from.z + dz * e);
          g.rotation.x = -0.16 * Math.sin(Math.min(k * 1.4, 1) * Math.PI);        // Nase kippt in die Bremsung
          this._sy = 1 - 0.16 * Math.sin(k * Math.PI);
        } };
      });
      g.rotation.x = 0;
      if (X) X.dust({ x: g.position.x, y: gy, z: g.position.z }, 5, 0.3);
      this._restoreBase();
    } else if (name === 'curveL' || name === 'curveR') {
      const s = name === 'curveL' ? 1 : -1;
      if (F) F.nudgeGaze(-s * 0.9, 0.15, 1.1);                                    // Blick nach aussen, in die Kurve
      await new Promise((res) => {
        this._tw = { t: 0, dur: 1.0, done: res, fn: (k) => {
          g.rotation.z = s * 0.22 * Math.sin(Math.min(k * 1.25, 1) * Math.PI);
          this._sy = 1 + 0.05 * Math.sin(k * Math.PI);
        } };
      });
      g.rotation.z = 0;
    } else if (name === 'card') {
      if (F) { F.nudgeGaze((o.side != null ? o.side : 1) * 0.75, 0.1, 0.7); F.eyePop(0.22); }
      await new Promise((res) => { this._tw = { t: 0, dur: 0.4, done: res, fn: (k) => { this._sy = 1 + 0.10 * Math.sin(k * Math.PI); } }; });
    } else if (name === 'still') {
      if (F) F.still();
    }
  }

  // ---- v2: COMBOS — Baukasten Anticipation -> Aktion -> Recover ----
  async combo(name) {
    const F = this.face, X = this.fx, g = this.ch.group;
    if (name === 'doubleTake') {
      if (F) { F.set('thinking', { hold: 0.6 }); F.nudgeGaze(0.9, 0.2, 0.55); }   // wegschauen …
      await this._wait(0.5);
      if (F) { F.set('surprised', { hard: true, hold: 1.4 }); F.eyePop(0.65); }   // … Snap zurueck, Augen ploppen
      this._eyeBlink();
      await this._jump({ dur: 0.36, anticip: 0.18, p: { height: 0.17, squash: 0.8, stretch: 1.28, land: 0.8, rebound: 1.12, hang: 0 }, face: false, dust: false });
    } else if (name === 'shiver') {
      if (F) { F.set('sad', { hold: 1.6 }); F.eyeOval(0.4, 1.2); }
      await new Promise((res) => {
        this._tw = { t: 0, dur: 1.1, done: res, fn: (k) => {
          const decay = 1 - k;
          g.rotation.z = Math.sin(k * 46) * 0.06 * decay;
          this._sy = 1 + Math.sin(k * 52) * 0.05 * decay;
        } };
      });
      g.rotation.z = 0;
    } else if (name === 'tada') {
      if (F) { F.set('happy', { hard: true, hold: 2.4 }); F.eyePop(0.4); }
      if (X) {
        const p = g.position;
        X.star({ x: p.x - 0.55, y: 1.15, z: p.z + 0.3 }, 0.45);
        X.star({ x: p.x + 0.55, y: 1.35, z: p.z + 0.2 }, 0.6);
      }
      await this.powerJump();
      await this.celebrate();
    } else if (name === 'random') {
      // Zufall NUR auf Anforderung (Briefing): Anticipation -> Aktion -> Recover gewuerfelt
      const antic = [
        () => { if (F) { F.set('thinking', { hold: 0.6 }); F.nudgeGaze(0.8, 0.2, 0.5); } },
        () => { if (F) { F.set('surprised', { hold: 0.5 }); F.eyePop(0.3); } },
        () => { this._eyeBlink(); if (F) F.eyeOval(0.5, 0.4); },
      ];
      const act = [
        () => this.hop(),
        () => this.powerJump(),
        () => this.turn180(),
        () => this.combo('shiver'),
        () => this.trigger('drop'),
        () => this.combo('doubleTake'),
      ];
      const rec = [
        () => { if (F) F.set('happy', { hold: 1.3 }); },
        () => { if (F) F.set('neutral', { hold: 0.8 }); },
        () => this.react('positive'),
      ];
      pick(antic)();
      await this._wait(0.45);
      await pick(act)();
      const r = pick(rec)();
      if (r && r.then) await r;
    }
  }

  // ---- Whoosh raus/rein (wie v1) + v2: Speedlines ----
  _groupBaseS() { if (this._baseGroupS == null) this._baseGroupS = this.ch.group.scale.x; return this._baseGroupS; }
  transitionOut(o = {}) {
    const p = merge(this.params.transition, o.params);
    const ch = this.ch, g = ch.group, gy = this._ground();
    const from = g.position.clone(), r0 = g.rotation.y, bs = this._groupBaseS();
    let fx0 = 0;
    return new Promise((res) => {
      this._tw = { t: 0, dur: p.anticip + p.out, done: res, fn: (k) => {
        const a = p.anticip / (p.anticip + p.out);
        if (k <= a) {
          const kk = k / a; this._sy = 1 - (1 - 0.6) * smooth(kk);
          g.position.y = gy;
        } else {
          if (this.fx && fx0 === 0) { this.fx.speedlines(() => ({ x: g.position.x, y: g.position.y + 0.4, z: g.position.z }), { x: 0, y: 1.6, z: 0.5 }, p.out); fx0 = 1; }
          const kk = (k - a) / (1 - a);
          this._sy = 1.4 - 0.4 * kk;
          g.position.set(from.x, gy + p.rise * kk * 2.4, from.z + kk * 0.6);
          const sc = bs * (1 - (1 - p.shrink) * smooth(kk));
          g.scale.setScalar(sc);
          g.rotation.y = r0 + p.spin * Math.PI * kk;
        }
      } };
    }).then(() => { this._sy = 1; });
  }
  transitionIn(o = {}) {
    const p = merge(this.params.transition, o.params);
    const ch = this.ch, g = ch.group, gy = this._ground(), bs = this._groupBaseS();
    const startY = gy + p.rise * 2.0;
    g.scale.setScalar(bs * p.shrink); g.position.set(this.back.x, startY, this.back.z); g.rotation.y = 0;
    if (this.fx) this.fx.speedlines(() => ({ x: g.position.x, y: g.position.y + 0.4, z: g.position.z }), { x: 0, y: -1.6, z: -0.3 }, p.in * 0.7);
    let fxL = 0;
    return new Promise((res) => {
      this._tw = { t: 0, dur: p.in, done: res, fn: (k) => {
        g.scale.setScalar(bs * (p.shrink + (1 - p.shrink) * smooth(k)));
        g.position.set(this.back.x, gy + (startY - gy) * (1 - smooth(Math.min(k / 0.82, 1))), this.back.z);
        this._sy = k < 0.82 ? 1.25 : kf([[0.82, 1.25], [0.9, 0.62], [1, 1]], k);
        if (k > 0.88) {
          this._eyeBlink();
          if (this.fx && fxL === 0) { this.fx.dust({ x: this.back.x, y: gy, z: this.back.z }, 7, 0.4); fxL = 1; }
        }
      } };
    }).then(() => { g.scale.setScalar(bs); g.position.set(this.back.x, gy, this.back.z); this._sy = 1; });
  }

  async roomTransition() {
    if (this.ch) this.ch.busy = true;
    this.stopLoops();
    await this.jumpTo(this.front.x, this.front.z, { hops: 3 });
    await this.turnTo(this.ch.group.rotation.y, {});
    await this.transitionOut();
    await this.transitionIn();
    if (this.ch) this.ch.busy = false;
  }

  reset() {
    const ch = this.ch, gy = this._ground();
    this._tw = null; this._sy = 1; this._sySmooth = 1; this._syVel.v = 0;
    ch.group.scale.setScalar(this._groupBaseS());
    ch.group.position.set(0, gy, 0); ch.group.rotation.set(0, 0, 0);
    if (ch._squash) { ch._squash.s = 1; ch._squash.v = 0; }
  }

  // ---- pro Frame; NACH ch.update(dt), VOR face.update(dt)/rig.update(dt) ----
  update(dt) {
    if (this._loop !== 'idle' && this.ch && !this._tw && Math.abs(this.ch.group.rotation.z) > 1e-4) {
      this.ch.group.rotation.z += (0 - this.ch.group.rotation.z) * Math.min(1, dt * 10);
    }
    let target = 1;
    if (this._tw) {
      this._tw.t += dt;
      const k = Math.min(this._tw.t / this._tw.dur, 1);
      this._tw.fn(k, dt);
      target = this._sy;
      if (k >= 1) { const d = this._tw; this._tw = null; if (d.done) d.done(); }
    } else if (this._loop === 'loading') {
      const p = this.params.loading, gy = this._ground();
      this._lt += dt; const ph = (this._lt % p.period) / p.period;
      const arc = Math.sin(ph * Math.PI);
      this.ch.group.position.y = gy + arc * p.height;
      target = ph < 0.10 ? kf([[0, p.squash], [0.10, p.stretch]], ph) : (ph > 0.90 ? kf([[0.90, p.stretch], [1, p.squash]], ph) : 1 + (p.stretch - 1) * (1 - arc) * 0.4);
    } else if (this._loop === 'idle') {
      const p = this.params.idle;
      this._lt += dt; const a = (this._lt / p.period) * Math.PI * 2;
      target = 1 + Math.sin(a) * p.breathe;
      this.ch.group.rotation.z = Math.sin(a * 0.5) * p.sway;
    }
    this._sy = target;
    this._sySmooth = this._smoothDamp(this._sySmooth, target, this._syVel, this._smoothTime, dt);
    this._applySquash(this._sySmooth);
    this._updateParts(dt);   // Sekundaer-Federn ADDITIV nach Mixer + Squash
  }
}

try {
  if (typeof window !== 'undefined') window.PetMotion = PetMotion;
} catch (e) {}
