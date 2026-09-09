// ============================================================================
// narrator.js — KFB Travel v12 · Slice S70 · Der Erzähler (Ebene 0+1, ohne LLM)
// ----------------------------------------------------------------------------
// Die Welt hatte Regie (S56), ein Gesetz (S60) und Beweisstücke (S61) — aber keine
// STIMME. Das Pet ist der Träger: es fliegt mit, es schaut den Spieler an, es hat
// Kinetik. Was fehlte, war ein Mund.
//
// **Portiert, nicht nachgebaut.** Die Sprechmaschine ist `frizzlebob-voice.js`,
// unverändert aus `rollercoaster-v11` (Stimmenwahl, Prioritäten, Pausen als Timer
// statt Markup, Fluffo-Lekt). Dieses Modul ist nur der TAKT darüber: wann etwas
// gesagt wird und wann besser nichts.
//
// DIE VIER REGELN, die aus der Achterbahn gelernt sind:
//  1. **Ein Satz pro Anlass, nie zwei gleichzeitig.** Prioritäten regeln, wer
//     unterbricht (2 schlägt 1, gleiche Prio wartet nicht — sie schweigt).
//  2. **Stillstand ist still.** Kein Tempo, kein Reflex. Ein Erzähler, der beim
//     Parken redet, ist ein Radio.
//  3. **Ein Anlass, der ins Leere läuft, bleibt still.** Kein „ähm", kein Füller.
//  4. **Es läuft ohne alles.** Keine englische Stimme im System → das Modul ist
//     stumm und die Welt fliegt weiter. Keine Netzverbindung → Ebene 0+1 reichen,
//     denn beide sind Text im Code. (Die LLM-Ebene kommt in S71 OBEN DRAUF, nie
//     darunter — sonst hängt der Mund am Netz.)
//
// Ducking gehört NICHT hierher: dieses Modul sagt nur „ich rede jetzt" (`onVoice`),
// und wer die Musik besitzt, macht Platz. Ein Erzähler, der selbst am Mischpult
// dreht, ist der nächste Eigentumsfehler.
//
//   const narr = createNarrator({ onVoice: (on) => audio.duck(on) });
//   narr.setEnabled(true);
//   narr.update(dt, { v: speed01, agl, turn, warp });   // Reflexe
//   narr.arrival(card); narr.cardPass(card); narr.judge(mode);
// ============================================================================

import { FrizzleBobVoice } from './frizzlebob-voice.js';

// ---------------------------------------------------------------- Ebene 0: Reflexe
// Kurz, sprechbar, KFB-Sprache. Englisch, weil die Story-Modi englisch sind und
// die Browser-Stimmen es auch sind (deutsche TTS-Stimmen sind seltener installiert).
const LOW = [                       // Tiefflug über den Dächern
  'Mind the rooftops!',
  'Low and fluffy!',
  'Scraping the chimneys, folks!',
];
const HIGH = [                      // hoch über der Welt
  'Look at all that nothing.',
  'Thin air up here.',
  'The world got small.',
];
const WARP = [                      // Boost / Tempo
  'Hold onto your ears!',
  'Faster than sense!',
  'Now we are travelling!',
];
const TURN = [                      // enge Kurve
  'Lean into it!',
  'Round we go!',
  'Feel that pull!',
];
// Der Himmelswürfel spricht Recht: King Kayfabian ist der rotierende Richter.
const JUDGE = {
  TRAGIC:    'The judge says: sad. Bring a hanky.',
  COMIC:     'The judge says: funny. Try to keep up.',
  ABSURD:    'The judge says: nonsense. BLÖDSINN!',
  HEROIC:    'The judge says: brave. Chins up.',
  MYSTICAL:  'The judge says: strange. Something is in the air.',
  FORBIDDEN: 'The judge says: forbidden. Delicious.',
};

export function createNarrator(opts = {}) {
  const P = Object.assign({
    // Anlässe dürfen sich nicht stapeln. Ein Reflex frühestens alle `gap` ms, und
    // NIE, während schon geredet wird (das regelt die Stimme über Prioritäten).
    gap: 5200,
    // Schwellen für die Reflexe. Faktoren, keine Schalter — jede Zahl ist einzeln
    // verstellbar, ohne dass ein Verhalten kippt.
    lowAgl: 14, highAgl: 120, warpV: 0.72, turnRate: 0.35,
    // S73 · Die drei Beats des Anflugs, in Welteinheiten Entfernung. Weit → Titel, mittel → Punch,
    // nah → Nachsatz. Faktoren, keine Schalter: wer sie zusammenschiebt, bekommt drei Sätze auf
    // einmal (und die Stimme verschluckt zwei davon — sichtbar im Zähler).
    beatFar: 190, beatMid: 95, beatNear: 38,
    // S81 · **Anflug schlägt Reflex.** Georgs Entscheidung: solange ein Anflug läuft, gehört das Wort
    // den Beats — gemessen hatte ein Reflex den Titel-Beat verschluckt. `approachHold` ist die
    // Nachwirkzeit nach dem letzten `approach()`-Aufruf: der Anflug ruft jeden Frame, also reicht
    // eine knappe Frist, um Bildaussetzer zu überbrücken, ohne nach dem Ende stumm zu bleiben.
    approachMute: true, approachHold: 1200,
    volume: 0.95,
  }, opts.params || {});

  const voice = new FrizzleBobVoice();
  let enabled = false;
  const stat = { gesagt: 0, verschluckt: 0, reflexe: 0, anlässe: 0, unterdrückt: 0, zuletzt: '' };
  const last = { low: 0, high: 0, warp: 0, turn: 0 };
  let apT = 0;                       // wann der Anflug zuletzt getaktet hat (S81)
  // S80 · Die LLM-Ebene liegt DARÜBER, nie darunter. `src` ist ein SYNCHRONER Blick ins Fach —
  // sie darf einen Beat ersetzen, nie verzögern; ist das Fach leer, spricht die Karte ihren eigenen
  // Text. `cue` stellt die Frage für einen Beat, der noch kommt (vorziehen statt warten).
  const src = (card, kind) => { try { return opts.lineSource ? opts.lineSource(card, kind) : null; } catch (e) { return null; } };
  const cue = (card, kind) => { if (opts.onCue) { try { opts.onCue(card, kind); } catch (e) {} } };

  voice.setVolume(P.volume);
  // „Ich rede jetzt" — der Besitzer der Musik macht Platz. Wir drehen nichts selbst.
  voice.onActivity = (speaking) => {
    if (opts.onVoice) { try { opts.onVoice(!!speaking); } catch (e) {} }
  };

  // Jede Zeile geht durch EINE Tür: hier wird gezählt, was gesagt und was
  // verschluckt wurde. Ohne diese zwei Zahlen ist „der Erzähler redet zu viel"
  // eine Meinung.
  function say(text, priority, punch) {
    if (!enabled || !text) return false;
    const konnte = voice.on && voice.ready && !(voice.speaking && (priority || 1) <= voice.curPriority);
    if (!konnte) { stat.verschluckt++; return false; }
    voice.speak(text, { priority: priority || 1, punch: !!punch });
    stat.gesagt++; stat.zuletzt = String(text);
    if (opts.onLine) { try { opts.onLine(String(text)); } catch (e) {} }
    return true;
  }

  function pick(pool, key) {
    if (pool.length < 2) return pool[0];
    let i, g = 0;
    do { i = (Math.random() * pool.length) | 0; } while (i === last['p_' + key] && g++ < 8);
    last['p_' + key] = i;
    return pool[i];
  }

  return {
    name: 'narrator',
    get voice() { return voice; },      // die UI braucht die Stimmenliste
    get enabled() { return enabled; },

    setEnabled(on) {
      enabled = !!on;
      voice.setEnabled(enabled);        // aus = laufender Satz wird abgebrochen
    },
    setVolume(v) { P.volume = Math.max(0, Math.min(1, v)); voice.setVolume(P.volume); },
    setVoiceURI(uri) { voice.setVoiceURI(uri); },
    setParams(p) { Object.assign(P, p || {}); if (p && p.volume != null) voice.setVolume(P.volume); },
    get params() { return P; },

    // ------------------------------------------------------------ Ebene 1: Anlässe
    // S73 · **Anflug in drei Beats statt einer Zeile.** Georgs Befund: der Erzähler nannte nur den
    // Titel. Der Rollercoaster macht es richtig — eine Karte ist kein Zuruf, sie hat eine Dramaturgie:
    //   Ki   (weit)  der Titel kündigt an
    //   Shō  (näher) die POWER-Zeile ist der Punch
    //   Ten  (nah)   die LORE-Zeile ist der Nachsatz — sie kippt die Bedeutung
    // Die Beats hängen an der ENTFERNUNG, nicht an einem Timer: wer langsam anfliegt, bekommt Zeit;
    // wer durchrauscht, bekommt den Punch und sonst nichts. Jeder Beat feuert genau einmal pro Karte
    // (`_beat` auf der Karte, nicht in diesem Modul — er soll einen Neubesuch überleben).
    // S73 · **Alle drei Anlässe lesen dieselbe Karte.** Nachprüfung fand den Fehler: der Anflug merkte
    // den Fortschritt auf dem echten Karten-Objekt, Ankunft und Durchflug bekamen ein FRISCHES Literal
    // — dort war `_beat` immer leer, also sprach die Ankunft die LORE-Zeile ein zweites Mal und
    // schnitt (mit höherer Priorität) den laufenden Satz mitten durch. Deshalb: immer die Karte selbst
    // hereingeben, `_beat` liegt auf ihr, und der Fortschritt überlebt Ankunft und Neubesuch.
    approach(card, dist) {
      if (!enabled || !card || dist == null) return;
      apT = performance.now();        // S81 · der Anflug taktet: Reflexe halten sich zurück
      const d = card.data || card, st = card._beat || 0;
      const near = P.beatNear, mid = P.beatMid, far = P.beatFar;
      if (st < 1 && dist < far && d.title) {
        card._beat = 1; stat.anlässe++;
        cue(card, 'punch');            // die Frage JETZT, gesprochen wird sie beim nächsten Beat
        say(src(card, 'title') || ('Coming up: ' + d.title + '.'), 1, false);
      } else if (st < 2 && dist < mid && d.power) {
        card._beat = 2; stat.anlässe++;
        cue(card, 'arrival');
        say(src(card, 'punch') || voice.fluff(d.power), 2, true);
      } else if (st < 3 && dist < near && d.lore) {
        card._beat = 3; stat.anlässe++;
        say(src(card, 'lore') || voice.fluff(d.lore), 1, false);
      }
    },
    // Der Anflug ist vorbei — was noch nicht gesagt wurde, wird jetzt gesagt (der Nachsatz ist der
    // Grund, warum man angekommen ist). Eine Karte ohne Text bleibt still: kein Füller.
    arrival(card) {
      if (!card) return;
      const d = card.data || card, st = card._beat || 0;
      stat.anlässe++;
      // Was der Anflug schon gesagt hat, wird nicht wiederholt — aber der NACHSATZ muss fallen: er ist
      // der Grund, warum man angekommen ist. Priorität 1, nicht 2: die Ankunft darf einen laufenden
      // Beat nicht abschneiden (gemessen als abgehackter Satz). Eine Karte ohne Text bleibt still.
      if (st >= 3) { const l = src(card, 'arrival'); if (l) say(l, 1, false); return; }
      if (st < 3 && d.lore) { card._beat = 3; say(src(card, 'arrival') || voice.fluff(d.lore), 1, false); return; }
      if (st < 2 && d.power) { card._beat = 2; say(src(card, 'punch') || voice.fluff(d.power), 2, true); return; }
      if (st < 1 && d.title) { card._beat = 1; say(src(card, 'title') || ('Here we are. ' + d.title + '.'), 1, true); }
    },
    cardPass(card) {
      if (!card) return;
      const d = card.data || card;
      stat.anlässe++;
      // Durchflug ist die schnelle Ankunft: der Punch, wenn er noch nicht gefallen ist — sonst nichts.
      if ((card._beat || 0) >= 2) return;
      const line = d.power || d.lore || d.title;
      if (line) { card._beat = 2; say(src(card, 'punch') || voice.fluff(line), 2, true); }
    },
    cardLore(card) {
      if (!card || !card.lore) return;
      stat.anlässe++;
      say(voice.fluff(card.lore), 1, false);
    },
    // Der Würfel im Himmel hat entschieden.
    judge(mode) {
      const l = JUDGE[String(mode || '').toUpperCase()];
      if (!l) return;
      stat.anlässe++;
      say(l, 2, true);
    },
    // Beliebiger Satz von außen (S71: die LLM-Ebene spricht hierüber).
    line(text, priority) { stat.anlässe++; return say(text, priority || 1, false); },

    // ------------------------------------------------------------ Ebene 0: Reflexe
    // `drive`: v = Tempo 0..1 · agl = Höhe über Boden · turn = Drehrate rad/s · warp
    update(dt, drive) {
      if (!enabled || !voice.ready || !drive) return;
      const v = drive.v || 0;
      if (v < 0.04) return;                                  // Stillstand ist still
      const now = performance.now();
      // S81 · Anflug schlägt Reflex. **Ehrlich gezählt:** nicht jedes Bild, sondern jeder Reflex, der
      // wirklich fällig war — und sein Timer wird gestempelt, als hätte er gesprochen. Sonst prasseln
      // die zurückgehaltenen Sätze in der Sekunde nach dem Anflug alle nach.
      if (P.approachMute && now - apT < P.approachHold) {
        const due = [];
        if (drive.agl != null && drive.agl < P.lowAgl && now - (last.low || 0) >= P.gap) due.push('low');
        else if (drive.agl != null && drive.agl > P.highAgl && now - (last.high || 0) >= P.gap) due.push('high');
        if ((drive.warp || v > P.warpV) && now - (last.warp || 0) >= P.gap) due.push('warp');
        if (Math.abs(drive.turn || 0) > P.turnRate && now - (last.turn || 0) >= P.gap) due.push('turn');
        if (due.length) { due.forEach((k) => { last[k] = now; }); stat.unterdrückt++; }
        return;
      }
      const fire = (key, pool, prio) => {
        if (now - (last[key] || 0) < P.gap) return;
        last[key] = now;
        if (say(pick(pool, key), prio, prio > 1)) stat.reflexe++;
      };
      if (drive.agl != null && drive.agl < P.lowAgl) fire('low', LOW, 2);
      else if (drive.agl != null && drive.agl > P.highAgl) fire('high', HIGH, 1);
      if (drive.warp || v > P.warpV) fire('warp', WARP, 2);
      if (Math.abs(drive.turn || 0) > P.turnRate) fire('turn', TURN, 1);
    },

    // Abnahme: was gesagt, was verschluckt, ob überhaupt eine Stimme da ist.
    // `stimme: null` heißt: das System hat keine englische Stimme — dann ist
    // Schweigen das richtige Verhalten, nicht ein Fehler.
    report() {
      return {
        an: enabled,
        stimme: voice.voice ? voice.voice.name : null,
        stimmen: voice.listVoices().length,
        redet: !!voice.speaking,
        gesagt: stat.gesagt, verschluckt: stat.verschluckt,
        reflexe: stat.reflexe, anlässe: stat.anlässe,
        unterdrückt: stat.unterdrückt, imAnflug: performance.now() - apT < P.approachHold,
        zuletzt: stat.zuletzt.slice(0, 80),
      };
    },
  };
}
