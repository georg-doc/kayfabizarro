// frizzlebob-voice.v3.js — Kayfabulate POC, Ebenen 0 + 1 (kein LLM).
// Browser-TTS, Englisch. Umsetzt KAYFABULATE_POC.md:
//  · 3 Regler (rate/pitch/volume), lang='en-US'. NIE Markup im Text (macOS liest SSML vor).
//  · Pausen = Text in mehrere Utterances zerlegen, per onend + setTimeout verketten.
//  · Stimmen unzuverlässig: getVoices() erst nach onvoiceschanged; erste en-Stimme; sonst stumm weiter.
//  · rate/pitch pro Utterance leicht variieren (Punch schneller+höher, Nachsatz langsamer+tiefer).
//  · nie zweimal hintereinander dieselbe Zeile. Stillstand ist still.
// Ebene 0 = Reflex-Pool (Kurve/Drop/Mode), Ebene 1 = Karte (power=Punch, lore=Nachsatz). Ebene 2 (LLM) = Kür.

const CURVE = [                       // Ebene 0 — starke Kurve, hohes c
  'Lean into it!',
  'Round we go, folks!',
  'Stay fluffy!',
  'Hold onto your ears!',
  'Feel that pull!',
  'Here comes the bend!',
];
const DROP = [                        // Ebene 0 — Drop, hohes j
  'What the fluff?!',
  'Down we go!',
  'Stomach, say goodbye!',
  'Yikes and away!',
  'Hang on, sugar!',
  'Bottom drops out!',
];
const MODE_LINES = {                  // Ebene 0 — ein Zuruf pro Story-Mode (D6)
  TRAGIC:    'Ah, the sad stuff. Bring a hanky.',
  COMIC:     'Comedy hour! Try to keep up.',
  ABSURD:    'None of this makes a lick of sense. Perfect.',
  HEROIC:    'Chins up, heroes. A big one is coming.',
  MYSTICAL:  'Ooh. Something is in the air tonight.',
  FORBIDDEN: 'We are not supposed to be here. Delicious.',
};

export class FrizzleBobVoice {
  constructor() {
    this.synth = (typeof window !== 'undefined' && window.speechSynthesis) || null;
    this.voice = null;
    this.voices = [];                 // ranked en candidates (best first)
    this.forcedURI = null;            // user override from the UI picker
    this.ready = false;               // eine englische Stimme ist da
    this.on = false;                  // vom VOICE-Toggle gesteuert
    this.speaking = false;
    this.curPriority = 0;
    this.onActivity = null;           // (speaking:bool) => ... — Ride duckt die Drohne
    this.onVoicesChanged = null;      // () => ... — UI füllt das Dropdown nach
    this._last = {};                  // pro Pool: zuletzt gezogener Index (kein Doppel)
    this._lastCurve = 0; this._lastDrop = 0;
    if (this.synth) this._initVoice();
  }

  // Jux-/Novelty-Stimmen (macOS) klingen dünn oder schrill — nie automatisch wählen.
  // **S70 · Auch lokalisiert.** Die Liste war englisch, das Betriebssystem ist es nicht: auf einem
  // deutschen System heißt „Bad News" **Schlechte Neuigkeiten** und rutschte damit durch die
  // Aussortierung — im Auswahlmenü stand eine Jux-Stimme vor den guten. Gemessen an Georgs Gerät
  // (41 englische Stimmen, „Schlechte Neuigkeiten" auf Platz 6). Ein Filter, der die Sprache des
  // Nutzers nicht kennt, filtert die Hälfte.
  static get NOVELTY() {
    return /albert|bad news|good news|bahh|bells|boing|bubbles|cellos|deranged|hysterical|jester|organ|superstar|trinoids|whisper|wobble|zarvox|junior|kathy|ralph|fred|princess|schlechte neuigkeiten|gute neuigkeiten|glocken|seifenblasen|spa(ß|ss)vogel|orgel|fl(ü|ue)stern|monster|verr(ü|ue)ckt|hysterisch|zellos|blubber|quietsch/i;
  }
  // Bekannt gute en-Stimmen zuerst; Netzwerk-/Enhanced-Varianten schlagen lokale Legacy-Stimmen.
  _score(v) {
    const n = (v.name || '') + ' ' + (v.voiceURI || '');
    let s = 0;
    if (/en[-_]US/i.test(v.lang)) s += 30; else if (/^en/i.test(v.lang)) s += 18;
    if (/google/i.test(n)) s += 40;                                   // Chrome: sehr gut
    if (/natural|neural|premium|enhanced|siri/i.test(n)) s += 45;       // hochwertige System-Stimmen
    if (/microsoft/i.test(n)) s += 25;
    if (/samantha|alex|daniel|karen|moira|tessa|serena|aaron|nicky|allison|ava|tom/i.test(n)) s += 22;
    if (v.default) s += 6;
    if (v.localService === false) s += 8;                              // Netzwerk-Stimmen oft natürlicher
    if (FrizzleBobVoice.NOVELTY.test(n)) s -= 80;                       // Jux-Stimmen ganz nach hinten
    return s;
  }

  _initVoice() {
    const pick = () => {
      const all = this.synth.getVoices();
      if (!all || !all.length) return;
      this.voices = all
        .filter(v => /^en/i.test(v.lang))
        .map(v => ({ v, s: this._score(v) }))
        .sort((a, b) => b.s - a.s)
        .map(x => x.v);
      const forced = this.forcedURI && this.voices.find(v => v.voiceURI === this.forcedURI);
      this.voice = forced || this.voices[0] || null;
      this.ready = !!this.voice;      // keine en-Stimme → stumm, Ride läuft trotzdem
      if (this.onVoicesChanged) { try { this.onVoicesChanged(); } catch (e) {} }
    };
    pick();
    this.synth.onvoiceschanged = pick;
    // Firefox/Safari feuern voiceschanged nicht immer — einmal nachfassen, dann aufgeben.
    setTimeout(pick, 1000);
  }

  listVoices() { return this.voices.slice(); }
  setVoiceURI(uri) {
    this.forcedURI = uri || null;
    const found = uri && this.voices.find(v => v.voiceURI === uri);
    if (found) { this.voice = found; this.ready = true; }
    else if (!uri) { this.voice = this.voices[0] || null; this.ready = !!this.voice; }
  }

  setEnabled(on) {
    this.on = on;
    if (!on && this.synth) { try { this.synth.cancel(); } catch (e) {} this.speaking = false; this.curPriority = 0; if (this.onActivity) { try { this.onActivity(false); } catch (e) {} } }
  }

  setVolume(v) { this.volume = Math.max(0, Math.min(1, v)); }

  _pick(pool, key) {
    if (pool.length < 2) return pool[0];
    let idx, guard = 0;
    do { idx = Math.floor(Math.random() * pool.length); } while (idx === this._last[key] && guard++ < 8);
    this._last[key] = idx;
    return pool[idx];
  }

  // priority: 1 = Reflex/Nachsatz, 2 = Drop/Karten-Punch (darf einen laufenden 1er abbrechen)
  speak(text, opt = {}) {
    if (!this.on || !this.synth || !this.ready || !text) return;
    const priority = opt.priority || 1;
    if (this.speaking) {
      if (priority <= this.curPriority) return;     // laufende Zeile gleicher/höherer Prio nicht unterbrechen
      try { this.synth.cancel(); } catch (e) {}
    }
    // Gedankenstriche → Komma (TTS liest sie mal als Pause, mal gar nicht). Kein Markup.
    const clean = String(text).replace(/[—–-]+/g, ', ').replace(/\s+/g, ' ').trim();
    const parts = clean.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 3);
    if (!parts.length) return;
    this.speaking = true; this.curPriority = priority;
    if (this.onActivity) { try { this.onActivity(true); } catch (e) {} }
    let i = 0;
    const finish = () => { this.speaking = false; this.curPriority = 0; if (this.onActivity) { try { this.onActivity(false); } catch (e) {} } };
    const sayNext = () => {
      if (!this.on || i >= parts.length) { finish(); return; }
      const first = i === 0;
      const u = new SpeechSynthesisUtterance(parts[i]);
      u.voice = this.voice; u.lang = (this.voice && this.voice.lang) || 'en-US';
      const base = opt.punch ? 0.85 : 0.78;              // slow & clear (understandable for non-native ears)
      u.rate  = (first ? base + 0.03 : base - 0.05) + (Math.random() * 0.04 - 0.03);
      u.pitch = (first ? 1.0 : 0.88) + (Math.random() * 0.06 - 0.03);
      u.volume = this.volume != null ? this.volume : 1.0;   // VOICE-Fader (Mischpult); 0 = stumm
      u.onend = () => { i++; setTimeout(sayNext, first ? 190 : 120); };   // Pause = Timer, nicht Markup
      u.onerror = () => { finish(); };
      try { this.synth.speak(u); } catch (e) { finish(); }
    };
    sayNext();
  }

  // ---- Ebene 0: Reflexe ----
  curve()      { this.speak(this._pick(CURVE, 'curve'), { priority: 1, punch: true }); }
  drop()       { this.speak(this._pick(DROP,  'drop'),  { priority: 2, punch: true }); }
  mode(name)   { const l = MODE_LINES[name]; if (l) this.speak(l, { priority: 1 }); }

  // ---- Fluffo-Lekt (BRIEF): EIN Wort ersetzt das tragende Wort — Ma als Wort, Closure in einer
  // Silbe. Selten (~jede 4. Zeile): ein Tic, kein Dialekt. Die Kayfabe-Rufe bleiben getrennt.
  fluff(line) {
    if (!line) return line;
    this._fluffN = (this._fluffN || 0) + 1;
    if (this._fluffN % 4 !== 0) return line;
    const words = String(line).split(/\b/);
    let best = -1, bl = 4;
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      if (/^[A-Za-z]{5,}$/.test(w) && w.length > bl && !/^(should|would|could|there|their|about|which|every|after|before)$/i.test(w)) { bl = w.length; best = i; }
    }
    if (best < 0) return line;
    const w = words[best], cap = /^[A-Z]/.test(w);
    const suf = (w.match(/(ier|iest|ing|ed|er|ly|s)$/i) || [])[1] || '';
    let f = { ier: 'fluffier', iest: 'fluffiest', ing: 'fluffing', ed: 'fluffed', er: 'fluffer', ly: 'fluffily', s: 'fluffs' }[suf.toLowerCase()] || 'fluff';
    if (cap) f = f[0].toUpperCase() + f.slice(1);
    words[best] = f;
    return words.join('');
  }

  // ---- Ebene 1: Karte ----
  cardPunch(power) { this.speak(power, { priority: 2, punch: true }); }
  cardLore(lore)   { this.speak(lore,  { priority: 1 }); }

  // pro Frame: Reflexe aus dem Drive-Bus (v/c/j). Stillstand = still.
  update(drive, now) {
    if (!this.on || !this.ready || !drive) return;
    if ((drive.v || 0) < 0.03) return;                          // Stillstand ist still
    const c = Math.abs(drive.c || 0), j = Math.abs(drive.j || 0);
    if (c > 0.55 && now - this._lastCurve > 3200) { this._lastCurve = now; this.curve(); }
    if (j > 0.60 && now - this._lastDrop  > 2600) { this._lastDrop  = now; this.drop(); }
  }
}
