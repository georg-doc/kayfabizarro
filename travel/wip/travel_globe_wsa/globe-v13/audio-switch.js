// ============================================================================
// audio-switch.js — EIN Ausgang, zwei Motoren
// ----------------------------------------------------------------------------
// Georg, 27.8.: „AUDIO komplett von KFB Travel v17 übernehmen → umschaltbar mit
// AUDIO (original) von tinyskies."  Genau das, und nicht mehr:
//
//   'kfb'  → `travel-audio.js` aus v17, unverändert kopiert (Jukebox, Drohne,
//            Fahrtwind, Böen, Rumpeln, synthetische Einsätze, Erzähler-Ducking)
//   'tiny' → `tiny-audio.js`, Portierung von tinyskies `AudioManager.ts`
//            (drei Musik-Ebenen mit Gewichten, Schleifen, Sample-Einsätze)
//
// **Warum eine Fassade und nicht zwei Aufrufstellen:** der Runner darf nur EINEN
// Klang-Ausgang kennen (Regel aus v17 S1). Ein zweites System im Frame-Pfad wäre
// die dritte Sorte Fehler aus dem Globe-v1-Handover — zwei Wahrheiten, die man
// erst hört, wenn beide laufen.
//
// **Der Umschalter ist kein Rebuild.** Beide Motoren bleiben gebaut; umgeschaltet
// wird die Lautstärke (`setEnabled`). Ein AudioContext, der wieder hochgefahren
// wird, braucht sonst erneut eine Nutzergeste — und die hat man beim Drücken von
// `U` nicht garantiert (Tastendruck zählt, Umschalten aus dem Menü nicht).
//
// **Fehlende Töne werden benannt, nicht ersetzt.** tinyskies liefert im Repo KEINE
// Audiodateien (gemessen: 0 von 201 Dateien mit Audio-Endung). Ohne eingehängte
// Quellen hat 'tiny' Musik-Ebenen ohne Puffer. Damit das Spiel dabei nicht stumm
// ist, gehen EINSÄTZE in dem Fall durch den synthetischen Zweig der KFB-Fassung —
// sichtbar in der Marke als `tiny(synth)`. Das ist eine Rückfallebene mit Etikett,
// keine Behauptung, es klinge wie das Original.
//
// ⚠ **Und deshalb wird der KFB-Graph in 'tiny' NICHT stillgelegt.** Erste Fassung rief
// dafür `kfb.setEnabled(false)` — das fährt in `travel-audio` den MASTER auf 0, und der
// Einsatz-Fallback hängt hinter demselben Master. Die Rückfallebene war damit stumm,
// während die Marke `tiny(synth)` versprach (Nachprüfung 27.8.: `kfbRunning: false`).
// Richtig ist: in 'tiny' nur die DAUEREBENEN nullen (Musik, Drohne, Fahrtwind, Rumpeln),
// Master und `fxBus` offen lassen. `setEnabled(false)` bleibt dem echten Ton-aus
// vorbehalten. Beim Zurückschalten müssen die vier Pegel auf ihre Ausgangswerte zurück —
// sonst bleibt die Jukebox nach einem Hin-und-Zurück leise (dieselbe Fehlerklasse wie die
// absoluten Konstanten in v1: ein Wert, der gesetzt, aber nie zurückgesetzt wird).
// ============================================================================

import { createTravelAudio } from './travel-audio.js';
import { createTinyAudio } from './tiny-audio.js';

// Ereignisnamen dieses Spiels → Namen der beiden Motoren. Die KFB-Seite kennt
// `boost|land|jump|roll|card|step|dice-*`; für den Schuss gibt es dort keinen
// eigenen Einsatz, also läuft er leiser durch den Whoosh (und wird zur echten
// Datei, sobald in `sfx.json` eine Zeile `"shoot"` steht — Daten, kein Code).
const MAP = {
  shoot: { kfb: ['boost', 0.5], tiny: ['shoot_1', 0.82] },
  boost: { kfb: ['boost', 1.0], tiny: ['speed_boost_1', 0.7] },
  card:  { kfb: ['card', 1.0],  tiny: ['chime_1', 0.6] },
  land:  { kfb: ['land', 1.0],  tiny: ['splash_1', 0.7] },
  jump:  { kfb: ['jump', 1.0],  tiny: ['portal_1', 0.5] },
  roll:  { kfb: ['roll', 0.9],  tiny: ['portal_1', 0.45] },
  water: { kfb: ['land', 0.7],  tiny: ['splash_1', 0.6] },
  click: { kfb: ['step', 0.7],  tiny: ['click_1', 0.42] },
};

// Unsere Höhe über Grund liegt zwischen 0,03 (Schweben) und ~0,64 (Schub + Gleiten);
// `travel-audio` erwartet die v17-Skala, wo `low` bei 2 voll und bei 18 aus ist.
// Ohne diese Umrechnung stünde `low` dauerhaft auf 1 und das Bodenrumpeln immer
// voll auf — das ist genau Fehlerklasse 3 aus dem Globe-v1-Handover („absolute
// Konstanten im Frame-Pfad überleben einen Weltmaßstabswechsel nicht").
//   2 + (agl − 0,03) · 16 / 0,61  →  Faktor 26,2
const AGL_BASIS = 2, AGL_SKALA = 26.2, AGL_NULL = 0.03;

export function createAudioSwitch(opts = {}) {
  const kfb = createTravelAudio({ storyIndex: opts.storyIndex != null ? opts.storyIndex : 3 });
  const tiny = createTinyAudio({ base: opts.tinyBase || '', sources: opts.tinySources });
  let motor = opts.engine === 'tiny' ? 'tiny' : 'kfb';
  let an = false;                 // Ton überhaupt gewollt
  let tinyBereit = false;
  const zeit = opts.timeOfDay || 'day';
  // Die Ausgangspegel der Dauerebenen, EINMAL vor der ersten Umschaltung gelesen.
  const AUS = { music: kfb.params.music, drone: kfb.params.drone,
                wind: kfb.params.wind, rumble: kfb.params.rumble };

  // Dauerebenen der KFB-Fassung an/aus, ohne den Master anzufassen: `fxBus` bleibt offen,
  // also klingen Einsätze weiter (das ist die ganze Rückfallebene in 'tiny').
  function kfbBetten(offen) {
    kfb.setMusicVol(offen ? AUS.music : 0);
    kfb.setDroneVol(offen ? AUS.drone : 0);
    kfb.setWindVol(offen ? AUS.wind : 0);
    kfb.setRumbleVol(offen ? AUS.rumble : 0);
  }

  // Beide Graphen entstehen erst in einer Nutzergeste (Autoplay-Regel), danach
  // wird nur noch der Pegel bewegt.
  function arm() {
    if (!an) return;
    if (!kfb.ready) kfb.start(); else kfb.resume();
    kfb.setEnabled(true);           // Master offen — auch in 'tiny' (Einsatz-Fallback)
    kfbBetten(motor === 'kfb');
    if (!tiny.ready) {
      tiny.init().then(() => {
        tinyBereit = true;
        // Was diese Kugelwelt auslösen kann — der Rest von Game.ts' ~60 Einsätzen
        // gehört zu Spielinhalten, die es hier nicht gibt.
        for (const id of ['shoot_1', 'chime_1', 'splash_1', 'portal_1', 'click_1',
                          'engine_carpet', 'ocean_waves_1', 'crickets_loop']) tiny.loadSFX(id);
        tiny.startMusic();
        tiny.startLoop('engine_carpet', 0);
        tiny.startLoop('ocean_waves_1', 0);
        tiny.setEnabled(motor === 'tiny');
      });
    } else {
      tiny.resumeContextIfNeeded();
      tiny.setEnabled(motor === 'tiny');
    }
  }

  function setEngine(m) {
    motor = m === 'tiny' ? 'tiny' : 'kfb';
    kfb.setEnabled(an);
    kfbBetten(an && motor === 'kfb');
    tiny.setEnabled(an && motor === 'tiny');
    if (an) arm();
  }

  function update(dt, src) {
    src = src || {};
    const heat = Math.max(0, Math.min(1, src.heat || 0));
    if (motor === 'kfb') {
      const aglRoh = src.agl != null ? src.agl : 0.3;
      kfb.update(dt, { heat, rate: src.rate || 0, mode: src.mode || 'fly',
                       agl: AGL_BASIS + Math.max(0, aglRoh - AGL_NULL) * AGL_SKALA,
                       camera: src.camera });
      return;
    }
    // tinyskies-Seite: Gewichte je Tageszeit (die Kugelwelt hat eine feste
    // Tageszeit je Sitzung, das Original blendet über den Sonnenstand), Motor-
    // schleife am Tempo, Brandung über Wasser.
    tiny.setWeights(zeit === 'day' ? 1 : 0, zeit === 'evening' ? 1 : 0, zeit === 'night' ? 1 : 0);
    tiny.setLoopVolume('engine_carpet', 0.06 + heat * 0.5);
    tiny.setLoopVolume('ocean_waves_1', src.ueberWasser ? 0.35 : 0);
    tiny.update(dt);
  }

  // Einsatz. In 'tiny' zuerst die echte Datei; liegt keine vor, der synthetische
  // Zweig der KFB-Fassung — mit Etikett in der Marke, nicht stillschweigend.
  //
  // ── Slice B (30.8.) · `rate`: die Tonhöhen-Varianz, die die Maschine schon konnte ──────────
  // D-08 §13.2a, gemessen: `tiny-audio.playSFX(name, volume, playbackRate, endFadeFraction)`
  // nimmt eine Abspielrate und klemmt sie auf 0,35…2,0 — **und `sfx()` hat sie nie übergeben.**
  // Also spielte jede Karte dieselbe Datei in derselben Höhe, sechzigmal in zwei Minuten. Der
  // ERZÄHLER variiert seit v2 Rate und Pitch je Äußerung (±0,03); die Karte nicht. Das war der
  // Widerspruch in einer Zeile.
  // `rate` darf eine Zahl oder ein Intervall `[min, max]` sein — ein Intervall wird je Einsatz
  // neu gezogen. ±6 % sind etwa ein Halbton auf und ab: hörbar verschieden, nicht verstimmt.
  // ⚠ Der synthetische KFB-Zweig hat keine Datei, also keine Abspielrate. Dort wird `rate` auf
  // die FREQUENZ nicht angewandt — das wäre ein zweiter Eingriff in ein fremdes Modul. Statt
  // dessen zählt `rateOhneWirkung`, damit im Bericht steht, wo die Varianz verpufft.
  let rateOhneWirkung = 0, rateAngewandt = 0;
  function zieheRate(r) {
    if (r == null) return null;
    if (Array.isArray(r)) {
      const a = +r[0], b = +r[1];
      return a + Math.random() * (b - a);
    }
    return +r;
  }
  function sfx(kind, strength, opt) {
    if (!an) return;
    const m = MAP[kind] || { kfb: [kind, 1], tiny: [kind, 0.7] };
    const rate = zieheRate(opt && opt.rate);
    if (motor === 'tiny') {
      const [id, vol] = m.tiny;
      if (tiny.playSFX(id, vol * (strength == null ? 1 : strength), rate)) {
        if (rate != null) rateAngewandt++;
        return;
      }
      if (!kfb.ready) return;
      const [kid, kv] = m.kfb;
      if (rate != null) rateOhneWirkung++;
      kfb.sfx(kid, kv * (strength == null ? 1 : strength));
      return;
    }
    const [id, vol] = m.kfb;
    if (rate != null) rateOhneWirkung++;
    kfb.sfx(id, vol * (strength == null ? 1 : strength));
  }

  return {
    name: 'audio-switch', arm, update, sfx, setEngine,
    get engine() { return motor; },
    get enabled() { return an; },
    get kfb() { return kfb; },
    get tiny() { return tiny; },
    // Takt: nur die KFB-Fassung hat einen Analyser. In 'tiny' bleibt der Runner
    // auf seinem synthetischen Takt — EIN Ausgang, andere Quelle.
    get beat() { return motor === 'kfb' ? kfb.beat : 0; },
    get pulse() { return motor === 'kfb' ? kfb.pulse : 0; },
    setEnabled(on) {
      an = !!on;
      if (an) arm();
      kfb.setEnabled(an);                       // aus heißt aus, an heißt Master offen
      kfbBetten(an && motor === 'kfb');
      if (tiny.ready) tiny.setEnabled(an && motor === 'tiny');
    },
    toggleEngine() { setEngine(motor === 'kfb' ? 'tiny' : 'kfb'); return motor; },
    nextTrack() {
      if (motor !== 'kfb') return null;
      const list = kfb.tracks;
      if (!list.length) return null;
      const i = Math.max(0, list.findIndex((t) => t.file === kfb.track));
      const next = list[(i + 1) % list.length];
      kfb.setTrack(next.file);
      return next.title || next.id || next.file;
    },
    duck(on, amount) { if (motor === 'kfb') kfb.duck(on, amount); },
    // Für die Marke: was läuft, und ob es überhaupt Töne hat.
    get label() {
      if (!an) return 'sound off';
      if (motor === 'kfb') return 'kfb' + (kfb.running ? '' : '·' + kfb.state);
      // 'tiny' ohne Quellen: die Einsätze kommen aus dem KFB-Synth — nur behaupten,
      // wenn dessen Graph wirklich offen ist.
      const r = tiny.report();
      return 'tiny' + (r.quellen ? '·' + r.quellen + ' Quellen'
                                 : (kfb.running ? '(synth)' : '(stumm)'));
    },
    report() {
      return { motor, an, kfb: { zustand: kfb.state, track: kfb.track, bpm: kfb.bpm },
               tiny: tiny.report(), tinyBereit,
               // Slice B: wo die Tonhöhen-Varianz wirkt und wo sie verpufft. `rateOhneWirkung`
               // ist keine Warnung, sondern eine Bedingung — der Synth-Zweig HAT keine Datei.
               rateAngewandt, rateOhneWirkung };
    },
    dispose() { kfb.dispose(); tiny.dispose(); },
  };
}
