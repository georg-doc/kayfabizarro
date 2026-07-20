/* pet-face.v1.js — KFB MIENENSPIEL v1 (2026-07-19). Sprint: uploads/SPRINT_mienenspiel.md
   Kontinuierlicher Emote-Raum statt 6 Presets: der Zielpunkt (lidUpper/lidLower/slant/gaze)
   SPRINGT nicht, er WANDERT — plus feines Zittern, das nie ganz zur Ruhe kommt. Halbwegs
   zwischen thinking und angry liegt ein Gesicht ohne Namen; genau die machen lebendig.
   Reaktiv statt gewuerfelt: set() haelt ein Gesicht (hard = sofortiger Attack, Augen sind
   schneller als der Koerper), danach Release zurueck in den Drift (neutral<->thinking).
   VERTRAG: update(dt) NACH PetMotion.update(dt), VOR rig.update(dt). Treibt das EyeRig NUR
   ueber die Public API: applyEmote (Lider/Slant) + setGazeFollow(true)+pointTo (Pupillen,
   kontinuierlich — die enum-GAZES des Rigs werden damit bewusst umgangen). */

export const FACE_DEFAULTS = {
  emotes: {  // Vokabular aus dem Sprint-Briefing (= Contract-Werte, motion-LIBRARY v2 face.emotes)
    neutral:   { lidUpper: -0.4,  lidLower: 0,    slant: 0,     gaze: [0, 0] },
    happy:     { lidUpper: 0,     lidLower: 0.3,  slant: 0,     gaze: [0, 0] },
    angry:     { lidUpper: 0.25,  lidLower: 0.1,  slant: -0.4,  gaze: [0, 0] },
    sad:       { lidUpper: 0.15,  lidLower: 0.05, slant: 0.35,  gaze: [0, -0.85] },
    surprised: { lidUpper: -0.2,  lidLower: -0.1, slant: 0,     gaze: [0, 0] },
    thinking:  { lidUpper: 0.4,   lidLower: 0,    slant: 0.05,  gaze: [0.9, 0.2] },
  },
  drift: { speed: 0.09, tremor: 0.045, tremorHz: 5.0, pair: ['neutral', 'thinking'] },
  react: { smoothTime: 0.16, hardTime: 0.03, hold: 1.5 },
};

// Slider-Metadaten fuer die Bench. [gruppe, key, label, min, max, step]
export const FACE_META = [
  ['drift', 'speed', 'Drift-Tempo', 0.02, 0.3, 0.005],
  ['drift', 'tremor', 'Zittern', 0, 0.12, 0.002],
  ['drift', 'tremorHz', 'Zitter-Frequenz', 1, 12, 0.2],
  ['react', 'smoothTime', 'Reaktion weich s', 0.04, 0.4, 0.005],
  ['react', 'hardTime', 'Reaktion hart s', 0.01, 0.12, 0.005],
  ['react', 'hold', 'Halten s', 0.3, 3.5, 0.05],
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function merge(base, over) {
  const out = {};
  for (const k in base) out[k] = (over && typeof over[k] === 'object' && !Array.isArray(over[k])) ? merge(base[k], over[k]) : (over && over[k] != null ? over[k] : base[k]);
  if (over) for (const k in over) if (!(k in out)) out[k] = over[k];
  return out;
}
// SmoothDamp wie in pet-motion: kritisch gedaempft, kein Overshoot, framerate-unabhaengig
function sd(cur, target, vel, st, dt) {
  st = Math.max(1e-4, st);
  const w = 2 / st, x = w * dt;
  const e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const ch = cur - target;
  const tmp = (vel.v + w * ch) * dt;
  vel.v = (vel.v - w * tmp) * e;
  return target + (ch + tmp) * e;
}

export class PetFace {
  constructor(rig, opts = {}) {
    this.rig = rig;
    this.p = merge(FACE_DEFAULTS, opts.params || {});
    this.enabled = true;
    this.drifting = opts.drift !== false;
    this.cur = { u: -0.4, l: 0, s: 0, gx: 0, gy: 0 };
    this.vel = { u: { v: 0 }, l: { v: 0 }, s: { v: 0 }, gx: { v: 0 }, gy: { v: 0 } };
    this._t = Math.random() * 90;
    this._st = this.p.react.smoothTime;
    this._hold = null; this._nudge = null; this._cursor = null; this._curT = 0;
    // Augen-Skala-Feder (Pop/Oval): rig.scale kompensiert nur den Body-Squash, e.scale pro Auge ist frei
    this._pop = { s: 1, v: 0 };      // uniformer Pop, federt nach 1 zurueck (unterdaempft = Bounce)
    this._oval = { s: 0, v: 0 };     // 0 = rund, 1 = flachgedrueckt; kritischer gedaempft
    this._ovalT = 0;
    if (rig && rig.setGazeFollow) rig.setGazeFollow(true);   // Pupillen gehoeren ab jetzt diesem Modul
  }
  setParams(p) { this.p = merge(this.p, p || {}); }
  anchor(n) { const e = this.p.emotes[n] || this.p.emotes.neutral; return { u: e.lidUpper, l: e.lidLower, s: e.slant, gx: e.gaze[0], gy: e.gaze[1] }; }
  // Gesicht setzen. hard = Augen zucken SOFORT (Attack ~1 Frame), sonst weich. Haelt hold s, dann Drift.
  set(n, o = {}) {
    this._hold = { a: this.anchor(n), t: o.hold != null ? o.hold : this.p.react.hold };
    this._st = o.hard ? this.p.react.hardTime : this.p.react.smoothTime;
    if (this.onSet) this.onSet(n);   // Hook (z.B. PetMouth.setRest — Ruhe-Mund folgt dem Emote)
  }
  nudgeGaze(gx, gy, hold = 1) { this._nudge = { gx, gy, t: hold }; }   // Blick-Impuls (Kurve, Karte) ohne Lid-Wechsel
  still() { this._hold = null; this._nudge = null; }
  setDrift(on) { this.drifting = !!on; }
  setCursor(nx, ny) { this._cursor = { x: nx, y: ny }; this._curT = 2.4; }   // loest sich nach 2.4s in Ruhe auf
  // Augen ploppen GROESSER auf und bouncen zurueck (unterdaempfte Feder). k ~ 0.2..0.8
  eyePop(k = 0.5) { this._pop.v += k * 14; }
  // Augen oval stauchen (Anstrengung/Bremsen/Zukneifen) fuer hold s, dann zurueck
  eyeOval(k = 0.5, hold = 0.7) { this._oval.t = Math.max(0, Math.min(1, k)); this._ovalT = hold; }
  _noise(t, o) { return (Math.sin(t * 0.31 + o) + Math.sin(t * 0.113 + o * 2.7) * 0.7) / 1.7 * 0.5 + 0.5; }
  update(dt) {
    if (!this.enabled || !this.rig) return;
    this._t += dt;
    const P = this.p, t = this._t;
    let T;
    if (this._hold) {
      T = Object.assign({}, this._hold.a);
      this._hold.t -= dt; if (this._hold.t <= 0) this._hold = null;
    } else if (this.drifting) {
      // dazwischen WANDERN statt auswaehlen (Sprint-Kern): langsames Pendeln neutral<->thinking
      const a = this.anchor(P.drift.pair[0]), b = this.anchor(P.drift.pair[1]);
      const k = this._noise(t * P.drift.speed * 10, 1.7);
      T = { u: a.u + (b.u - a.u) * k, l: a.l + (b.l - a.l) * k, s: a.s + (b.s - a.s) * k, gx: (a.gx + (b.gx - a.gx) * k) * 0.7, gy: (a.gy + (b.gy - a.gy) * k) * 0.7 };
    } else T = this.anchor('neutral');
    this._st += (P.react.smoothTime - this._st) * Math.min(1, dt * 2.5);   // hard-Attack klingt in weich aus
    if (this._nudge) { T.gx = this._nudge.gx; T.gy = this._nudge.gy; this._nudge.t -= dt; if (this._nudge.t <= 0) this._nudge = null; }
    if (this._cursor) {
      this._curT -= dt;
      const w = clamp(this._curT / 0.7, 0, 1) * 0.9;
      T.gx = T.gx * (1 - w) + this._cursor.x * w; T.gy = T.gy * (1 - w) + this._cursor.y * w;
      if (this._curT <= 0) this._cursor = null;
    }
    // feines Zittern, kommt nie ganz zur Ruhe — Bildfrage aus dem Briefing, deshalb tweakbar
    const tr = P.drift.tremor, hz = P.drift.tremorHz;
    T.u += Math.sin(t * hz * 2.1) * tr;
    T.l += Math.sin(t * hz * 1.7 + 2) * tr * 0.6;
    T.s += Math.sin(t * hz * 1.3 + 4) * tr * 0.8;
    const c = this.cur;
    c.u = sd(c.u, clamp(T.u, -0.5, 1), this.vel.u, this._st, dt);
    c.l = sd(c.l, clamp(T.l, -0.5, 1), this.vel.l, this._st, dt);
    c.s = sd(c.s, clamp(T.s, -0.8, 0.8), this.vel.s, this._st, dt);
    c.gx = sd(c.gx, clamp(T.gx, -1, 1), this.vel.gx, this._st, dt);
    c.gy = sd(c.gy, clamp(T.gy, -1, 1), this.vel.gy, this._st, dt);
    this.rig.applyEmote({ lidUpper: c.u, lidLower: c.l, slant: c.s, pupil: 'normal', gaze: 'front' });
    this.rig.pointTo(c.gx, c.gy);
    // ---- Augen-Skala: Pop (unterdaempft, bouncet) + Oval (gedaempft) auf e.scale ----
    const pop = this._pop;                                    // Feder um 1, wenig Daempfung = Cartoon-Boing
    pop.v += (1 - pop.s) * 90 * dt; pop.v *= Math.exp(-6.5 * dt); pop.s += pop.v * dt;
    pop.s = clamp(pop.s, 0.55, 1.9);
    const ov = this._oval;                                    // Ziel: gehalten oder 0
    this._ovalT -= dt; const ovT = this._ovalT > 0 ? (ov.t || 0) : 0;
    ov.v += (ovT - ov.s) * 140 * dt; ov.v *= Math.exp(-14 * dt); ov.s += ov.v * dt;
    if (this.rig.eyes) {
      const sy = pop.s * (1 - clamp(ov.s, -0.2, 1) * 0.42);   // oval: y runter …
      const sx = pop.s * (1 + clamp(ov.s, -0.2, 1) * 0.18);   // … x leicht rauf (Volumen-Gefuehl)
      for (const e of this.rig.eyes) e.scale.set(sx, sy, sx);
    }
  }
  dispose() { if (this.rig && this.rig.setGazeFollow) this.rig.setGazeFollow(false); }
}
try { if (typeof window !== 'undefined') window.PetFace = PetFace; } catch (e) {}
