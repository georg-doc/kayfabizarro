/* kfb-sfx-layers.js · Lagen-Bank fuer den KFB-Mech-Slice (S1, v6)
 *
 * WARUM
 * v5 spielte je Cue EIN Sample: ein Puffer, ein Gain, ein Rate-Jitter. 42 von 43 Cues
 * ohne Varianten, `pick()` war Zufall statt Round-Robin, ein Bus, kein Ducking, Distanz
 * nur ueber Pegel. Der Befund hiess „Ping-Pong" (docs/KRITIK_combat-v5_SPRINT_v6.md §2.1).
 *
 * WAS DIESE SCHICHT TUT — und nichts weiter
 *   Lagen      ein Cue = attack + body + tail (jede Lage eigene Dateien, Gain, Verzoegerung)
 *   Round-Robin je Lage ein Zeiger, der weiterrueckt — nie zweimal dieselbe Datei hintereinander
 *   Phrase     Tonhoehe eines Cues kommt aus `o.seed` (Schuss-Objekt): Launch und Impact
 *              desselben Schusses teilen den Jitter, das Ohr verbucht sie als Paar
 *   Busse      master → { sfx → { player, enemy, world }, ui, music } — Wichtigkeit statt Pegel
 *   Ducking    ein Cue darf einen Bus fuer n ms um x dB druecken (Rakete drueckt `world`)
 *   Distanz    Pegel UND Tiefpass UND Panorama — das Ohr liest Entfernung ueber Hoehenverlust
 *   Loops      Dauerwaffe = Loop mit Attack/Release, Start- und Stop-Cue (kein 16-Hz-Zap)
 *   Prioritaet hoechstens N Cues im Fenster; ein wichtigerer verdraengt einen schwaecheren
 *
 * DER LADER BLEIBT `kfb-mech-audio.js` (SampleBank._fetchBuffer): Host-Kette, Content-Type-
 * Pruefung, EINE Meldezeile. Diese Datei laedt nichts selbst — sie ordnet nur.
 */
import { SampleBank, ALIAS, HOSTS } from './kfb-mech-audio.js';

const dB = (x) => Math.pow(10, x / 20);
/* Deterministischer Jitter aus einem Seed (mulberry32-Schritt) — zwei Aufrufe mit
   demselben Seed geben denselben Wert. Ohne Seed: Math.random. */
const jit = (seed, salt) => {
  if (seed == null) return Math.random() * 2 - 1;
  let t = ((seed | 0) + (salt | 0) * 0x9e3779b9 + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return (((t ^ (t >>> 14)) >>> 0) / 4294967296) * 2 - 1;
};

class Layer {
  constructor(rec) {
    this.role = rec.role || 'body';
    this.files = rec.files || (rec.file ? [rec.file] : []);
    this.bufs = [];
    this.gain = rec.gain == null ? 0.5 : rec.gain;
    this.pitch = rec.pitch || 0;          // Zusatz-Jitter dieser Lage (klein)
    this.rate = rec.rate || 1;
    this.delayMs = rec.delayMs || 0;
    this.rr = 0; this.last = -1;
  }
  /* Round-Robin mit No-Repeat: der Zeiger rueckt weiter; bei nur einer Datei ist
     Wiederholung unvermeidlich und ehrlich. */
  next() {
    if (!this.bufs.length) return null;
    if (this.bufs.length === 1) return this.bufs[0];
    let i = this.rr % this.bufs.length;
    if (i === this.last) i = (i + 1) % this.bufs.length;
    this.rr = i + 1; this.last = i;
    return this.bufs[i];
  }
}

class Cue {
  constructor(key, rec) {
    this.key = key;
    this.bus = rec.bus || 'world';
    this.prio = rec.prio == null ? 1 : rec.prio;
    this.pitch = rec.pitch == null ? 0.05 : rec.pitch;   // Phrasen-Jitter (geteilt ueber Lagen)
    this.gainVar = rec.gainVar == null ? 1.5 : rec.gainVar; // ± dB
    this.gain = rec.gain == null ? 1 : rec.gain;
    this.spatial = rec.spatial !== false;
    this.debounceMs = rec.debounce_ms == null ? 40 : rec.debounce_ms;
    this.taktMs = rec.takt_ms || 0;
    this.duck = rec.duck || null;
    this.layers = (rec.layers || []).map((l) => new Layer(l));
    this.loop = rec.loop ? new Layer(Object.assign({ role: 'loop' }, rec.loop)) : null;
    this.loopCfg = rec.loop || null;
    this.lastPlay = -1e9; this.lastTakt = -1e9;
  }
  files() { const f = []; for (const l of this.layers) f.push(...l.files); if (this.loop) f.push(...this.loop.files); return f; }
}

export class LayerBank {
  /* ac · bestehender AudioContext · master · Gain des Wirts · opts.distMax, opts.distFloor */
  constructor(ac, master, opts) {
    const o = opts || {};
    this.ac = ac;
    this.fetcher = new SampleBank(ac, null, { hosts: o.hosts || HOSTS });  // nur fuer _fetchBuffer + Ledger
    try { this.fetcher.out.disconnect(); } catch (e) { /* haengt sonst still am destination */ }
    this.distMax = o.distMax || 55; this.distFloor = o.distFloor || 0.12;
    this.buses = {};
    const mk = (name, parent, g) => { const n = ac.createGain(); n.gain.value = g == null ? 1 : g; n.connect(parent); this.buses[name] = n; return n; };
    const sfx = mk('sfx', master || ac.destination, 1);
    mk('player', sfx, 1); mk('enemy', sfx, 0.85); mk('world', sfx, 0.9);
    mk('ui', master || ac.destination, 1); mk('music', master || ac.destination, 1);
    this.cues = new Map();
    this.loops = new Map();
    this.ready = false;
    this.poly = { cap: 4, windowMs: 90, recent: [] };
    this.ducks = {};
    this.ledger = this.fetcher.ledger;
    this.rules = {};
    this.line = () => this.fetcher.line();
  }

  /* Manifest v2: { _rules, cues: { "launch.stinger": {...}, ... } }  — oder URL. */
  async load(manifestUrlOrObject, opts) {
    const t0 = performance.now();
    let man = manifestUrlOrObject;
    if (typeof man === 'string') {
      const urls = [man, ...HOSTS.map((h) => h + 'modules/kfb-combat-sfx.v2.json')];
      let ok = null;
      for (const u of urls) { try { const r = await fetch(u); if (r.ok) { ok = await r.json(); break; } } catch (e) { /* naechster */ } }
      if (!ok) { console.warn('[audio·v6] Manifest v2 nicht ladbar'); return this.ledger; }
      man = ok;
    }
    this.rules = man._rules || {};
    if (this.rules.cap_polyphony) this.poly.cap = this.rules.cap_polyphony;
    if (this.rules.fenster_ms) this.poly.windowMs = this.rules.fenster_ms;
    if (man._buses) for (const [k, v] of Object.entries(man._buses)) if (this.buses[k]) this.buses[k].gain.value = v;

    const entries = Object.entries(man.cues || {});
    const cache = new Map();   // dieselbe Datei in zwei Cues = ein Download, ein Puffer
    const get = (path) => { if (!cache.has(path)) cache.set(path, this.fetcher._fetchBuffer(path).then((b) => { this._norm(b); return b; }).catch((e) => ({ err: e.message }))); return cache.get(path); };
    const jobs = [];
    for (const [key, rec] of entries) {
      const cue = new Cue(key, rec);
      this.cues.set(key, cue);
      jobs.push(cue);
    }
    this.ledger.total = jobs.length;
    const LANES = (opts && opts.lanes) || 8;
    let idx = 0;
    const lane = async () => {
      while (idx < jobs.length) {
        const cue = jobs[idx++];
        let any = false;
        for (const L of [...cue.layers, ...(cue.loop ? [cue.loop] : [])]) {
          const bufs = await Promise.all(L.files.map(get));
          L.bufs = bufs.filter((b) => b && !b.err);
          const bad = bufs.filter((b) => b && b.err);
          if (bad.length) this.ledger.missing.push(cue.key + '/' + L.role + ' (' + bad.length + '× ' + bad[0].err + ')');
          if (L.bufs.length) any = true;
        }
        if (any) this.ledger.loaded++; else this.cues.delete(cue.key);
      }
    };
    await Promise.all(Array.from({ length: LANES }, lane));
    this.ledger.ms = Math.round(performance.now() - t0);
    this.ready = this.ledger.loaded > 0;
    const N = this.normStats || { min: 1, max: 1 };
    console.log('[audio·v6] ' + this.line() + ' · ' + cache.size + ' Dateien · Lautheit normalisiert ×' + N.min.toFixed(2) + '–×' + N.max.toFixed(2));
    if (this.ledger.missing.length) console.warn('[audio·v6] fehlende Lagen:\n  ' + this.ledger.missing.join('\n  '));
    return this.ledger;
  }

  /* LAUTHEIT · drei Kits, ein Pegel. RMS der lautesten 30 % Fenster (46 ms) auf -16 dBFS
     gezogen, Korrektur 0,25–4×. Peak-Normalisierung waere falsch (ein Klick waere so laut
     wie eine Explosion); Gesamt-RMS auch (lange Tails druecken den Wert). Der Faktor haengt
     am Puffer und wird in play() multipliziert — die Datei selbst bleibt unangetastet. */
  _norm(buf) {
    if (!buf || buf.__kfbGain) return;
    const ch = buf.getChannelData(0), W = 2048, rms = [];
    for (let i = 0; i + W <= ch.length; i += W) { let s = 0; for (let j = i; j < i + W; j++) s += ch[j] * ch[j]; rms.push(Math.sqrt(s / W)); }
    if (!rms.length) { buf.__kfbGain = 1; return; }
    rms.sort((a, b) => b - a);
    const top = rms.slice(0, Math.max(1, Math.ceil(rms.length * 0.3)));
    const loud = top.reduce((a, b) => a + b, 0) / top.length;
    const g = loud > 1e-5 ? Math.min(4, Math.max(0.25, 0.158 / loud)) : 1;
    buf.__kfbGain = g;
    this.normStats = this.normStats || { n: 0, min: 9, max: 0 };
    this.normStats.n++; this.normStats.min = Math.min(this.normStats.min, g); this.normStats.max = Math.max(this.normStats.max, g);
  }

  /* ═══ KEIN STILLER ERSATZ MEHR (Georg 06.09.) ════════════════════════
     GEMESSEN, und es ist die ganze Erklaerung: angefordert `impact.kinetic.glass`,
     gespielt `impact.kinetic.earth×1`. Diese Zeile ersetzte JEDE unbekannte
     Oberflaeche durch Erde — und `play()` meldete `true`, womit der Wirt seinen
     Synth-Rueckfall unterdrueckte. Ergebnis: Glas, Fleisch und Schleim klangen wie
     ein dumpfer Erdschlag, und der richtige Anschlag lag ungenutzt daneben.
     Ein Ersatz, der sich als Treffer ausgibt, ist schlimmer als ein Fehlen: das
     Fehlen haette den Synth geweckt, der elf eigene Anschlaege hat.
     Ersatz bleibt moeglich, aber nur BENANNT — er wird gezaehlt, und der Wirt
     erfaehrt ueber `play()`, dass nichts Passendes da war. */
  resolve(name) {
    if (this.cues.has(name)) return this.cues.get(name);
    const a = ALIAS[name];
    if (a && this.cues.has(a)) return this.cues.get(a);
    const key = a || name;
    if (key.startsWith('impact.')) {
      this.fehlend = this.fehlend || {};
      this.fehlend[key] = (this.fehlend[key] || 0) + 1;
      return null;                     // der Wirt synthetisiert — mit dem RICHTIGEN Material
    }
    return null;
  }

  /* Distanz → Pegel, Tiefpass, Panorama. `o.cam` (three-Kamera) liefert die Hoerrichtung. */
  _spatial(o) {
    const out = { g: 1, lp: 20000, pan: 0 };
    if (!o.at || !o.listener) return out;
    const d = o.at.distanceTo(o.listener);
    const k = Math.min(1, d / this.distMax);
    out.g = Math.max(this.distFloor, 1 - k);
    out.lp = 20000 * Math.pow(0.045, k);            // 20 kHz nah → ~900 Hz an der Grenze
    if (o.cam) {
      const dx = o.at.x - o.cam.position.x, dz = o.at.z - o.cam.position.z;
      const e = o.cam.matrixWorld.elements;          // Rechtsvektor der Kamera (Welt)
      const rx = e[0], rz = e[2];
      const len = Math.hypot(dx, dz) || 1;
      out.pan = Math.max(-0.8, Math.min(0.8, ((dx * rx + dz * rz) / len) * 0.8));
    }
    return out;
  }

  _chain(bus, sp, spatial) {
    const ac = this.ac, g = ac.createGain();
    let head = g;
    if (spatial && sp.lp < 19000) { const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = sp.lp; f.Q.value = 0.4; g.connect(f); head = f; }
    if (spatial && sp.pan !== 0 && ac.createStereoPanner) { const p = ac.createStereoPanner(); p.pan.value = sp.pan; head.connect(p); head = p; }
    head.connect(this.buses[bus] || this.buses.world);
    return g;
  }

  _duck(d) {
    const bus = this.buses[d.bus]; if (!bus) return;
    const ac = this.ac, now = ac.currentTime, base = this.ducks[d.bus] == null ? bus.gain.value : this.ducks[d.bus];
    this.ducks[d.bus] = base;
    bus.gain.cancelScheduledValues(now);
    bus.gain.setValueAtTime(bus.gain.value, now);
    bus.gain.linearRampToValueAtTime(base * dB(d.db == null ? -6 : d.db), now + 0.012);
    bus.gain.setValueAtTime(base * dB(d.db == null ? -6 : d.db), now + (d.ms || 140) / 1000);
    bus.gain.linearRampToValueAtTime(base, now + (d.ms || 140) / 1000 + 0.18);
  }

  /* Rueckgabe FALSE = nichts geladen, Wirt synthetisiert. TRUE = erledigt (auch „verdraengt"). */
  play(name, o) {
    if (!this.ready) return false;
    const cue = this.resolve(name);
    if (!cue) return false;
    o = o || {};
    const nowMs = performance.now();
    if (cue.taktMs) { if (nowMs - cue.lastTakt < cue.taktMs) return true; cue.lastTakt = nowMs; }
    if (nowMs - cue.lastPlay < cue.debounceMs) return true;
    cue.lastPlay = nowMs;

    /* Prioritaet: Fenster voll → nur ein WICHTIGERER Cue kommt noch durch. */
    const w = cue.prio + (o.weight || 0);
    this.poly.recent = this.poly.recent.filter((c) => nowMs - c.t < this.poly.windowMs);
    if (this.poly.recent.length >= this.poly.cap) {
      let weakest = Infinity; for (const c of this.poly.recent) weakest = Math.min(weakest, c.w);
      if (w <= weakest) return true;
    }
    this.poly.recent.push({ t: nowMs, w });

    const sp = this._spatial(cue.spatial ? o : {});
    let V = (o.vol == null ? 1 : o.vol) * cue.gain * sp.g * dB(jit(o.seed, 3) * cue.gainVar);
    if (V <= 0.0008) return true;
    const ac = this.ac;
    if (ac.state === 'suspended') ac.resume();
    const t0 = ac.currentTime;
    const phrase = 1 + jit(o.seed, 1) * cue.pitch;       // geteilt ueber alle Lagen dieses Cues
    let played = 0;
    for (const L of cue.layers) {
      const buf = L.next(); if (!buf) continue;
      const src = ac.createBufferSource(); src.buffer = buf;
      src.playbackRate.value = L.rate * phrase * (1 + jit(o.seed, 11 + played) * L.pitch) * (o.rate || 1);
      const g = this._chain(cue.bus, sp, cue.spatial);
      g.gain.value = V * L.gain * (buf.__kfbGain || 1);
      src.connect(g);
      src.start(t0 + L.delayMs / 1000);
      src.onended = () => { try { src.disconnect(); g.disconnect(); } catch (e) { /* weg */ } };
      played++;
    }
    if (played && cue.duck) this._duck(cue.duck);
    /* ⚠ NULL LAGEN IST KEIN ERFOLG. `play` gab bisher am Ende immer `true` zurueck,
       also auch dann, wenn `L.next()` fuer jede Lage leer war — der Wirt hielt den
       Cue fuer gespielt und liess seinen Synth aus. Stille, die sich als Ton
       ausgibt. Wer nichts gestartet hat, sagt das. */
    if (!played) { this.leer = (this.leer || 0) + 1; return false; }
    this.played = (this.played || 0) + 1; this.lastKey = cue.key + '×' + played;
    return true;
  }

  /* Dauerwaffe: Loop laeuft, solange `loopKeep` innerhalb `holdMs` erneut gerufen wird. */
  loopKeep(name, o) {
    if (!this.ready) return false;
    const cue = this.resolve(name); if (!cue || !cue.loop || !cue.loop.bufs.length) return false;
    const nowMs = performance.now();
    let L = this.loops.get(cue.key);
    if (!L) {
      const ac = this.ac, cfg = cue.loopCfg;
      const src = ac.createBufferSource(); src.buffer = cue.loop.next(); src.loop = true;
      src.playbackRate.value = cue.loop.rate;
      const g = ac.createGain(); g.gain.value = 0;
      let head = g;
      if (cfg.lowpass) { const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = cfg.lowpass; g.connect(f); head = f; }
      head.connect(this.buses[cue.bus] || this.buses.world);
      src.connect(g); src.start();
      g.gain.linearRampToValueAtTime(cue.loop.gain * (src.buffer.__kfbGain || 1) * (o && o.vol != null ? o.vol : 1), ac.currentTime + (cfg.attackMs || 60) / 1000);
      L = { src, g, cfg, since: 0 };
      this.loops.set(cue.key, L);
      if (cfg.start) this.play(cfg.start, o);
    }
    L.since = 0;   // Simulationszeit, nicht Wanduhr — sonst laesst sich der Slice nicht deterministisch fahren
    return true;
  }
  /* Vom Wirt einmal pro Schritt gerufen (mit dt): Loops, die nicht mehr gehalten werden, klingen aus. */
  step(dt) {
    for (const [key, L] of this.loops) {
      L.since += dt == null ? 1 / 60 : dt;
      if (L.since * 1000 < (L.cfg.holdMs || 160)) continue;
      const ac = this.ac, rel = (L.cfg.releaseMs || 140) / 1000;
      L.g.gain.cancelScheduledValues(ac.currentTime);
      L.g.gain.setValueAtTime(L.g.gain.value, ac.currentTime);
      L.g.gain.linearRampToValueAtTime(0, ac.currentTime + rel);
      try { L.src.stop(ac.currentTime + rel + 0.02); } catch (e) { /* schon aus */ }
      this.loops.delete(key);
      if (L.cfg.stop) this.play(L.cfg.stop, {});
    }
  }

  /* Pause, Tod, Deck: kein Loop darf ueberleben. Ausklingen in 80 ms, ohne Stop-Cue. */
  stopLoops() {
    const ac = this.ac;
    for (const [key, L] of this.loops) {
      L.g.gain.cancelScheduledValues(ac.currentTime); L.g.gain.setValueAtTime(L.g.gain.value, ac.currentTime);
      L.g.gain.linearRampToValueAtTime(0, ac.currentTime + 0.08);
      try { L.src.stop(ac.currentTime + 0.1); } catch (e) { /* schon aus */ }
      this.loops.delete(key);
    }
  }
  setBus(name, v) { if (this.buses[name]) { this.buses[name].gain.value = v; this.ducks[name] = v; } }
  stats() { return { cues: this.cues.size, loops: this.loops.size, recent: this.poly.recent.length, cap: this.poly.cap, played: this.played || 0, last: this.lastKey || '—', fehlend: Object.keys(this.fehlend || {}), leer: this.leer || 0 }; }
  dispose() {
    for (const [, L] of this.loops) { try { L.src.stop(); } catch (e) { /* weg */ } }
    this.loops.clear();
    for (const k in this.buses) { try { this.buses[k].disconnect(); } catch (e) { /* weg */ } }
    this.cues.clear(); this.ready = false;
  }
}
