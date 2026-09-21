/* pet-puppet.v1.js — KFB TREIBER-VERTRAG v1 (2026-07-30, Handover PetStudio v3->v4 §2b).

   WOZU: eine externe Timeline soll den Pet treiben, OHNE seine Interna zu kennen. Sechs Methoden,
   fertig. Wer sie ruft, weiss nichts von EyeRig-`(gx,gy)`, von Decal-Keys oder davon, wie der
   Host seine Emotes benennt — genau das war die Falle, in die der Travel-Cut getappt ist.

   EIGENTUM (nicht verhandelbar, Handover §2b):
     PetFace/EyeRig = Augen · PetMouth = Mund · PetMotion = Koerper · Host = Clips + Emote-Tabelle.
   Der Puppet ruft ausschliesslich deren OEFFENTLICHE API. Er greift nie hinein, er haelt keine
   zweite Wahrheit. Was er selbst besitzt, ist genau drei Dinge:
     1. die UHR der Sprech-Timeline,
     2. die NAMENS-ZUORDNUNG der Vertrags-Begriffe auf das, was der Host kann,
     3. die Kamera- und Hintergrund-Presets.

   ADDITIV: keine bestehende Signatur aendert sich. Ohne `createPuppet` merkt niemand etwas.

   PRIME DIRECTIVE: Animation ist Interpunktion der Rede und loest sich in Ruhe auf. Deshalb
   endet `speak()` immer im Ruhe-Mund, und `orbit` ist das EINZIGE Preset, das dauerhaft laeuft
   (und muss ausdruecklich gewaehlt werden). Kein Idle-Fidget aus diesem Modul.

   NICHT hier drin (Handover §4): Audio, Phonem-Alignment, Video-Export, Timeline-Erzeugung. Das
   ist das separate „Cube Puppet Studio", das diesen Vertrag KONSUMIERT. */

export const VISEME_IDS = ['closed', 'open', 'wide', 'round', 'smile'];
export const EXPRESSIONS = ['idle', 'smile', 'sad', 'happy', 'thinking', 'confused'];
export const STATES = ['idle', 'blink', 'lookL', 'lookR', 'talking'];
export const CAMERAS = ['static', 'close', 'wide', 'orbit', 'zoom', 'presentation'];
export const BACKGROUNDS = ['transparent', 'studio', 'world'];

// Vertrags-Name -> Host-Emote. Der Vertrag nennt sechs Ausdruecke; die Pet-Library kennt sechs
// Emotes mit anderen Namen. Diese Tabelle ist die Naht, und sie gehoert HIERHER: sonst muesste
// jeder Treiber die Library-Namen kennen. Ueberschreibbar via opts.expressionMap.
export const EXPRESSION_MAP = {
  idle: 'neutral', smile: 'happy', sad: 'sad',
  happy: 'happy', thinking: 'thinking', confused: 'surprised',
};

// Kamera-Presets. dist = Vielfaches des Pet-Radius, el = Hoehenwinkel °, az = Seitenwinkel °.
// `orbit` laeuft weiter (spin °/s), alle anderen fahren einmal hin und stehen dann still.
// Hoehenwinkel bewusst FLACH (2..10°): ein Cube-Pet ist knapp ueber kniehoch, jeder groessere
// Winkel schaut ihm auf den Kopf statt ins Gesicht (am Bild geprueft 30.7.).
export const CAMERA_PRESETS = {
  static:       null,                                              // nichts anfassen (Nutzer hat die Maus)
  close:        { dist: 2.55, el: 2,  az: 14, ease: 0.9 },
  wide:         { dist: 5.20, el: 8,  az: 22, ease: 1.1 },
  zoom:         { dist: 2.05, el: 0,  az: 8,  ease: 1.6 },         // naeher als close, aber langsam gefahren
  presentation: { dist: 3.10, el: 10, az: 34, ease: 1.2 },
  orbit:        { dist: 3.40, el: 8,  az: 0,  ease: 1.0, spin: 9 },
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// kritisch gedaempft, kein Overshoot, framerate-unabhaengig (dieselbe Feder wie pet-face/pet-motion)
function sd(cur, target, vel, st, dt) {
  st = Math.max(1e-4, st);
  const w = 2 / st, x = w * dt;
  const e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const ch = cur - target, tmp = (vel.v + w * ch) * dt;
  vel.v = (vel.v - w * tmp) * e;
  return target + (ch + tmp) * e;
}

export class PetPuppet {
  /* parts (alles optional — fehlt ein Kanal, bleibt die zugehoerige Methode wirkungslos und sagt
     das auch): { THREE, mouth, rig, face, motion, cam, controls, renderer, scene,
                  focus:()=>Vector3, radius:()=>number,
                  emote:(hostName)=>void, clip:(name)=>void, background:(mode)=>void } */
  constructor(parts = {}, opts = {}) {
    this.parts = parts;
    this.THREE = parts.THREE || (parts.mouth && parts.mouth.THREE);
    this.expressionMap = Object.assign({}, EXPRESSION_MAP, opts.expressionMap || {});
    this.cameras = Object.assign({}, CAMERA_PRESETS, opts.cameras || {});
    this.expression = 'idle'; this.state = 'idle'; this.camera = 'static'; this.background = null;
    this._emph = [];                       // Zuhoerer fuer Betonungs-Marker (das ist die Naht zu §2c)
    this._run = null;                      // laufende Sprech-Timeline
    this.lastRun = null;                   // Messwerte der letzten speak()-Fahrt
    this._cs = { d: 0, az: 0, el: 0 };     // Ist-Werte der Kamerafahrt
    this._cv = { d: { v: 0 }, az: { v: 0 }, el: { v: 0 } };
    this._cTarget = null; this._spin = 0;
    this.warn = opts.warn || ((m) => console.warn('[PetPuppet] ' + m));
  }

  // --- 1 · Mund ---------------------------------------------------------------------------------
  /** Eines der fuenf Viseme. pop = Sprech-Plopp (bei getriebener Rede erwuenscht). */
  setViseme(id, o = {}) {
    const m = this.parts.mouth;
    if (!m) { this.warn('kein Mund'); return null; }
    if (VISEME_IDS.indexOf(id) < 0) { this.warn('unbekanntes Visem: ' + id); return null; }
    return m.setViseme(id, o);
  }

  // --- 2 · Ausdruck (Augen + Ruhe-Mund folgen dem Host-Emote) -----------------------------------
  setExpression(name) {
    if (EXPRESSIONS.indexOf(name) < 0) { this.warn('unbekannter Ausdruck: ' + name); return this; }
    const host = this.expressionMap[name];
    this.expression = name;
    if (this.parts.face && this.parts.face.set) this.parts.face.set(host);   // PetFace besitzt die Augen
    else if (this.parts.emote) this.parts.emote(host);                       // sonst die Emote-Tabelle des Hosts
    else this.warn('kein Kanal fuer Ausdruecke');
    return this;
  }

  // --- 3 · Zustand ------------------------------------------------------------------------------
  /** idle | blink | lookL | lookR | talking. Jeder Zustand geht ueber die Public API seines
      Eigentuemers; `talking` ist der Silbentakt-Shuffle, NICHT die getriebene Timeline. */
  playState(name) {
    if (STATES.indexOf(name) < 0) { this.warn('unbekannter Zustand: ' + name); return this; }
    const { mouth, rig, clip } = this.parts;
    this.state = name;
    if (name !== 'talking' && mouth && mouth.talking) mouth.talk(false);
    if (name === 'idle') { if (clip) clip('idle'); if (rig && rig.pointTo) rig.pointTo(0, 0); }
    else if (name === 'blink') { if (rig && typeof rig.blinkNow === 'function') rig.blinkNow(); else this.warn('Rig kann nicht blinken'); }
    else if (name === 'lookL') { if (rig && rig.pointTo) rig.pointTo(-0.85, 0.05); }
    else if (name === 'lookR') { if (rig && rig.pointTo) rig.pointTo(0.85, 0.05); }
    else if (name === 'talking') { if (mouth) mouth.talk(true); }
    return this;
  }

  // --- 4 · speak(timeline) — das Herz -----------------------------------------------------------
  /* timeline = [{ t, viseme, emphasis? }] — t in Sekunden ab Start, viseme aus den fuenf Namen,
     emphasis = true|Zahl (Stärke 0..1) fuer die Betonungs-Marker. Die UHR gehoert diesem Modul:
     `update(dt)` schiebt sie, damit Sprechen und Bild denselben Takt haben (ein setTimeout-Takt
     laeuft bei Frame-Einbruch aus dem Bild). speak() endet IMMER im Ruhe-Mund (Prime Directive).
     Rueckgabe: Handle mit stop()/progress/duration. */
  speak(timeline, o = {}) {
    const m = this.parts.mouth;
    if (!m) { this.warn('kein Mund — speak() tut nichts'); return null; }
    const evs = (timeline || [])
      .map((e, i) => ({
        t: Math.max(0, +e.t || 0), i,
        viseme: VISEME_IDS.indexOf(e.viseme) >= 0 ? e.viseme : null,
        emph: e.emphasis === true ? 1 : (typeof e.emphasis === 'number' ? clamp(e.emphasis, 0, 1) : 0),
      }))
      .filter((e) => e.viseme || e.emph > 0)
      .sort((a, b) => a.t - b.t);
    if (!evs.length) { this.warn('leere Timeline'); return null; }
    this.stop();
    if (m.talking) m.talk(false);                 // zwei Besitzer am Mund waeren ein Fehler
    const tail = o.tail != null ? o.tail : 0.18;  // Nachlauf, dann Ruhe
    const dur = evs[evs.length - 1].t + tail;
    const run = this._run = {
      evs, i: 0, t: 0, dur, rate: o.rate > 0 ? o.rate : 1, done: false,
      fired: 0, emph: 0, errs: [],
      stop: () => this.stop(), get progress() { return clamp(run.t / (run.dur || 1), 0, 1); }, duration: dur,
      onDone: o.onDone || null,
    };
    return run;
  }
  /** Zuhoerer fuer Betonungs-Marker. DAS ist die Naht zu §2c („der ganze Koerper spricht"):
      PetMotion abonniert hier und punktiert; dieses Modul weiss nichts vom Koerper. */
  onEmphasis(cb) { if (typeof cb === 'function') this._emph.push(cb); return () => { const i = this._emph.indexOf(cb); if (i >= 0) this._emph.splice(i, 1); }; }
  get speaking() { return !!(this._run && !this._run.done); }
  stop() {
    const r = this._run;
    if (!r || r.done) { this._run = null; return this; }
    r.done = true; this._run = null;
    const m = this.parts.mouth;
    if (m) { m.viseme = null; m.setTex(m.rest || 'neutral', false); }   // loest sich in Ruhe auf
    this.lastRun = { events: r.evs.length, fired: r.fired, emphasis: r.emph, maxErrMs: r.errs.length ? Math.round(Math.max.apply(null, r.errs) * 1000) : 0, duration: +r.dur.toFixed(3) };
    if (r.onDone) r.onDone(this.lastRun);
    return this;
  }

  // --- 5 · Kamera -------------------------------------------------------------------------------
  setCamera(preset) {
    if (CAMERAS.indexOf(preset) < 0) { this.warn('unbekanntes Kamera-Preset: ' + preset); return this; }
    this.camera = preset;
    const p = this.cameras[preset];
    if (!p) { this._cTarget = null; return this; }          // static = Finger weg
    const { cam, controls } = this.parts;
    if (!cam) { this.warn('keine Kamera'); return this; }
    const f = this._focus(), r = this._radius();
    // Ist-Werte EINMAL aus der aktuellen Kamera lesen, damit die Fahrt dort beginnt, wo der
    // Nutzer die Maus gelassen hat (sonst springt das Bild im ersten Frame).
    const T = this.THREE, d0 = cam.position.clone().sub(f);
    this._cs.d = d0.length() / (r || 1);
    this._cs.az = Math.atan2(d0.x, d0.z) * 180 / Math.PI;
    this._cs.el = Math.asin(clamp(d0.y / (d0.length() || 1), -1, 1)) * 180 / Math.PI;
    this._cv = { d: { v: 0 }, az: { v: 0 }, el: { v: 0 } };
    // Seitenwinkel RELATIV zur Blickrichtung des Pets, nicht zur Welt-Z-Achse: sonst zeigt
    // `presentation` beim einen Pet ins Gesicht und beim anderen auf den Ruecken (am Bild geprueft
    // 30.7. — der Studio-Hase stand mit dem Ruecken zu az=34°). Der Host liefert die Richtung, der
    // Treiber muss die Weltlage nicht kennen.
    const az0 = this._facingAz();
    this._spin = this._cs.az;
    this._cTarget = { d: p.dist, az: az0 + p.az, el: p.el, ease: p.ease || 1, spin: p.spin || 0 };
    if (controls) controls.target.copy(f);
    return this;
  }
  _focus() {
    const T = this.THREE;
    if (this.parts.focus) { const v = this.parts.focus(); if (v) return v.clone ? v.clone() : new T.Vector3(v.x, v.y, v.z); }
    return new T.Vector3(0, 0.4, 0);
  }
  _radius() { const r = this.parts.radius ? this.parts.radius() : 0; return r > 0.001 ? r : 0.5; }
  /** Weltwinkel der Pet-Blickrichtung in Grad (0 = +Z). Kommt vom Host — gemessen, nicht geraten. */
  _facingAz() {
    const fn = this.parts.facing;
    if (!fn) return 0;
    const v = fn(); if (!v) return 0;
    return Math.atan2(v.x, v.z) * 180 / Math.PI;
  }

  // --- 6 · Hintergrund --------------------------------------------------------------------------
  /** transparent | studio | world. Wenn der Host `background` mitgibt, gewinnt er — der Studio
      hat Stimmungen/Skydome und darf seine Wahrheit behalten (ein Eigentuemer je Kanal). */
  setBackground(mode) {
    if (BACKGROUNDS.indexOf(mode) < 0) { this.warn('unbekannter Hintergrund: ' + mode); return this; }
    this.background = mode;
    if (this.parts.background) { this.parts.background(mode); return this; }
    const { scene, renderer } = this.parts;
    if (!scene) { this.warn('keine Szene'); return this; }
    if (mode === 'transparent') { this._bgKeep = scene.background; scene.background = null; if (renderer) renderer.setClearAlpha(0); }
    else { if (renderer) renderer.setClearAlpha(1); if (this._bgKeep) scene.background = this._bgKeep; }
    return this;
  }

  // --- Uhr --------------------------------------------------------------------------------------
  /** Pro Frame rufen, NACH dem Motor-Update der Kanaele (der Puppet korrigiert nur, er rechnet
      nichts nach). Schiebt die Sprech-Timeline und die Kamerafahrt. */
  update(dt) {
    const r = this._run;
    if (r && !r.done) {
      r.t += dt * r.rate;
      while (r.i < r.evs.length && r.evs[r.i].t <= r.t) {
        const e = r.evs[r.i++];
        r.errs.push(Math.abs(r.t - e.t));                   // Zeitfehler = Frame-Rest, die Messzahl
        if (e.viseme) { this.setViseme(e.viseme, { pop: true, rest: false }); r.fired++; }
        if (e.emph > 0) { r.emph++; for (const cb of this._emph) { try { cb(e.emph, e.t); } catch (err) { console.warn('[PetPuppet] Betonungs-Zuhoerer:', err); } } }
      }
      if (r.t >= r.dur) this.stop();
    }
    const t = this._cTarget;
    if (t && this.parts.cam) {
      const cam = this.parts.cam, controls = this.parts.controls, T = this.THREE;
      if (t.spin) { this._spin += t.spin * dt; t.az = this._spin; }
      const st = 0.42 * (t.ease || 1);
      this._cs.d = sd(this._cs.d, t.d, this._cv.d, st, dt);
      this._cs.az = sd(this._cs.az, t.az, this._cv.az, t.spin ? 0.08 : st, dt);
      this._cs.el = sd(this._cs.el, t.el, this._cv.el, st, dt);
      const f = this._focus(), r2 = this._radius() * this._cs.d;
      const a = this._cs.az * Math.PI / 180, el = this._cs.el * Math.PI / 180;
      cam.position.set(f.x + Math.sin(a) * Math.cos(el) * r2, f.y + Math.sin(el) * r2, f.z + Math.cos(a) * Math.cos(el) * r2);
      if (controls) { controls.target.copy(f); controls.update(); } else cam.lookAt(f);
      // fertig gefahren = Finger weg (kein Dauer-Nachregeln gegen die Maus des Nutzers)
      if (!t.spin && Math.abs(this._cs.d - t.d) < 0.002 && Math.abs(this._cs.az - t.az) < 0.05 && Math.abs(this._cs.el - t.el) < 0.05) this._cTarget = null;
    }
    return this;
  }

  dispose() { this.stop(); this._emph.length = 0; this._cTarget = null; }
}

/** Bequemer Einstieg. Gibt ein Objekt mit GENAU den sechs Vertrags-Methoden (+ Uhr/Naht) zurueck. */
export function createPuppet(parts, opts) { return new PetPuppet(parts, opts); }

/* Hilfe fuers spaetere „Cube Puppet Studio": eine Timeline aus Silben bauen (Platzhalter, bis
   echtes Phonem-Alignment existiert). Bewusst hier und nicht in speak(): speak() nimmt Timelines,
   es ERZEUGT keine. */
export function timelineFromSyllables(syllables, opts = {}) {
  const per = opts.per > 0 ? opts.per : 0.16, stress = opts.stress || [];
  const OPEN = ['open', 'wide', 'round'];
  const out = [];
  syllables.forEach((s, i) => {
    const v = typeof s === 'string' ? s : (s && s.viseme);
    out.push({ t: i * per, viseme: VISEME_IDS.indexOf(v) >= 0 ? v : OPEN[i % OPEN.length], emphasis: stress.indexOf(i) >= 0 ? 1 : 0 });
    out.push({ t: i * per + per * 0.62, viseme: 'closed' });
  });
  return out;
}

try { if (typeof window !== 'undefined') { window.PetPuppet = PetPuppet; window.createPuppet = createPuppet; } } catch (e) {}
