// ============================================================================
// travel-audio.js — KFB Travel · Slice S20 · Jukebox + Drone
// ----------------------------------------------------------------------------
// PORTIERT aus `rollercoaster-v11/rollercoaster-ride.v11.js` (Mood-Matrix,
// 4-Ebenen-Graph, Jukebox-Loader, Takt-Uhr) — nicht neu erfunden. Was dort über
// mehrere Runden geradegezogen wurde, kommt hier als Modul mit der Disziplin des
// restlichen `terrain-vN/`: `update(dt, …)` · `reset()` · `dispose()`.
//
// DIE VIER EBENEN (Rollercoaster §Audio-Bauweise):
//   bed    — Drone: der Story-Mode IST eine spektrale Identität (AUDIO_MOODS)
//   motion — Fahrtwind: Rauschen, Pegel ∝ heat², Bandpass öffnet mit dem Tempo
//   event  — Einsätze: Boost, Landung, Sprung, später Kartendurchflug
//   space  — ein geteilter Reverb-Bus (Feedback-Delay), Wet aus dem Mood
//
// WARUM DAS FÜR TRAVEL MEHR IST ALS TON: unser Takt war bisher eine Zahl im
// Runner (`synthPhase`, `bpm 104`). Ab jetzt kommt die Eins aus dem Track, den
// man hört — Cube-Tanz und Blinken hängen also an echter Musik. `beat` ist
// weiterhin EIN Ausgang (Prime Directive aus S1: eine Quelle, kein zweites
// System); ohne Ton fällt der Runner auf seinen synthetischen Takt zurück.
//
// DREI DINGE, DIE IN v11 TEUER GELERNT WURDEN — hier von Anfang an drin:
//  1. **Audio braucht eine Nutzergeste.** `start()` wird aus pointerdown/keydown
//     gerufen; vorher existiert kein AudioContext.
//  2. **Reverb-Send POST-Fader.** Sonst hört man den Hall noch, wenn der Regler
//     auf 0 steht.
//  3. **Beim Track-Wechsel zuerst `onended = null`, dann `stop()`.** Sonst feuert
//     der Restart-Timer und legt eine zweite Quelle drüber (Flamming).
//
//   const audio = createTravelAudio({ storyIndex: 3 });
//   audio.start();                        // aus einer Nutzergeste
//   audio.update(dt, { heat, rate, mode, agl, camera });
//   audio.beat · audio.level · audio.bpm · audio.tracks
//   audio.sfx('boost' | 'land' | 'jump' | 'step' | 'roll' | 'card')
//
// S21 · SAMPLE-ERST-DANN-SYNTHESE: `sfx()` spielt eine echte Datei, wenn für das Ereignis eine
// im Manifest steht (`media/3D_Assets/Audio/sfx.json` im Repo, lokaler Fallback daneben),
// sonst den synthetischen Einsatz. Georgs ElevenLabs- und Kenney-Dateien sind damit eine
// DATENÄNDERUNG, kein Code: Datei ins Repo, Zeile ins Manifest, fertig.
// ============================================================================

// Ein Mood = eine spektrale Identität. Indizes = MODES 0..5 (TRAGIC … FORBIDDEN).
// root: Grundton (Hz) · ratios: Partialsatz · type: Wellenform · detune: Chorus-Breite
// bright: Tiefpass-Eckfrequenz · rev: Hall-Anteil · pulse: Event-Puls (Hz, 0 = keiner)
// air: Charakter des Fahrtwind-Rauschens (Bandpass, Hz)
export const AUDIO_MOODS = [
  { name: 'TRAGIC',    root: 47,   ratios: [1, 1.005, 1.5, 2.0],   type: 'sine',     detune: 4,  bright: 300, rev: 0.62, pulse: 0,   air: 420 },
  { name: 'COMIC',     root: 65.4, ratios: [1, 1.01, 2.0, 3.0],    type: 'sawtooth', detune: 7,  bright: 620, rev: 0.34, pulse: 0,   air: 900 },
  { name: 'ABSURD',    root: 58,   ratios: [1, 1.06, 1.414, 2.05], type: 'square',   detune: 22, bright: 520, rev: 0.40, pulse: 3.7, air: 700 },
  { name: 'HEROIC',    root: 55,   ratios: [1, 1.5, 2.0, 3.0],     type: 'sawtooth', detune: 5,  bright: 700, rev: 0.42, pulse: 0,   air: 1050 },
  { name: 'MYSTICAL',  root: 52,   ratios: [1, 1.5, 1.6667, 2.0],  type: 'sine',     detune: 6,  bright: 480, rev: 0.74, pulse: 0,   air: 560 },
  { name: 'FORBIDDEN', root: 46,   ratios: [1, 1.414, 1.98, 2.67], type: 'sawtooth', detune: 9,  bright: 360, rev: 0.30, pulse: 1.6, air: 480 },
];

const RAW_ALT = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/';
const SOUNDS = 'media/3D_Assets/Sounds/';
const AUDIO_DIR = 'media/3D_Assets/Audio/';   // Kenney-Set + ElevenLabs-Einsätze (S21)
const LOCAL = (p) => new URL(p, import.meta.url).href;

export function createTravelAudio(opts = {}) {
  const P = Object.assign({
    master: 0.9,
    music: 0.26,        // Bett, kein Vordergrund
    musicHead: 2.4,     // die produzierten Tracks sind leise gemastert
    drone: 1,
    fx: 1,
    duckAmount: 0.62,   // S70 · wie weit Musik und Bett zurückgehen, während der Erzähler redet
    wind: 1,
    rumble: 1,          // tiefe Luft — wird nah am Boden lauter (Reflexion)
    gust: 1,            // Böen: langsame Modulation, damit der Wind nicht als Rauschteppich steht
    sfx: 1,             // Trim NUR für Sample-Einsätze (ElevenLabs/Kenney kommen mit sehr
                        // unterschiedlichen Pegeln); die synthetischen hängen am FX-Fader
    beatDecay: 5.5,     // 1/s — wie schnell der Beat-Impuls abfällt
  }, opts.params || {});

  let ctx = null, A = null, moodIdx = opts.storyIndex != null ? opts.storyIndex : 3;
  let enabled = opts.enabled !== false;
  let beatImpulse = 0, prevPhase = 0, level = 0, levelAvg = 0, bpm = 104, beat0 = 0;
  let tracks = null, trackFile = null, musicState = null, restartT = 0;
  let duckAmt = 0;   // S70 · 0 = niemand redet
  const bufs = new Map();
  // S21 · Einsatz-Ebene: Manifest + dekodierte Puffer je Ereignis-Id
  let sfxManifest = null;
  const sfxBufs = new Map();
  let gustPhase = 0, gustVal = 0, gustTarget = 0;

  const mood = () => AUDIO_MOODS[((moodIdx % 6) + 6) % 6] || AUDIO_MOODS[3];
  // „läuft die Uhr wirklich?" — nicht „ist der Graph gebaut?". Jede Nutzergeste darf resumen:
  // ein Context kann auch SPÄTER suspendieren (Tab-Wechsel, Autoplay-Policy).
  const resume = () => { if (ctx && ctx.state !== 'running' && ctx.resume) ctx.resume(); };
  const isRunning = () => !!(A && ctx && enabled && ctx.state === 'running');

  // ---------------------------------------------------------------- JUKEBOX
  const DEFAULT_TRACKS = [{ id: 'van_metronome', title: 'Van Metronome (Instrumental)',
    file: SOUNDS + 'Van_Metronome_2026-07-17T163547.mp3', bpm: 104, loop: true }];
  async function loadJukebox() {
    if (tracks) return tracks;
    const norm = (j) => (Array.isArray(j) ? j : (j && Array.isArray(j.tracks) ? j.tracks : null));
    let list = null;
    for (const url of [RAW_ALT + SOUNDS + 'jukebox.json', LOCAL('./jukebox.json')]) {
      if (list) break;
      try { list = norm(await (await fetch(url)).json()); }
      catch (e) { /* nächster Versuch */ }
    }
    tracks = (list && list.length ? list.filter((t) => t && t.file) : DEFAULT_TRACKS);
    if (!tracks.length) tracks = DEFAULT_TRACKS;
    return tracks;
  }

  function trackUrl(file) {
    return encodeURI(RAW_ALT + (file.includes('/') ? file : SOUNDS + file));
  }

  // ---------------------------------------------------------------- SFX-MANIFEST (S21)
  // Form: { "sfx": { "boost": { "file": "media/…/boost_riser.mp3", "gain": 0.9, "rate": 1 },
  //                  "step": { "variants": ["…/step_a.mp3", "…/step_b.mp3"], "jitter": 0.14 } } }
  // Fehlt eine Id, spielt der synthetische Einsatz — nie Stille.
  async function loadSfxManifest() {
    if (sfxManifest) return sfxManifest;
    const norm = (j) => (j && (j.sfx || j.events || (j.id ? null : j))) || null;
    let m = null;
    for (const url of [RAW_ALT + AUDIO_DIR + 'sfx.json', LOCAL('./sfx.json')]) {
      if (m) break;
      try { m = norm(await (await fetch(url)).json()); } catch (e) { /* nächster Versuch */ }
    }
    sfxManifest = m || {};
    return sfxManifest;
  }

  function sfxUrl(file) {
    return encodeURI(RAW_ALT + (file.includes('/') ? file : AUDIO_DIR + file));
  }

  async function loadSfxBuffer(file) {
    if (sfxBufs.has(file)) return sfxBufs.get(file);
    sfxBufs.set(file, null);                       // Platzhalter: nicht zweimal laden
    try {
      const res = await fetch(sfxUrl(file));
      const buf = await ctx.decodeAudioData(await res.arrayBuffer());
      sfxBufs.set(file, buf);
      return buf;
    } catch (e) { return null; }
  }

  // beim Start alles vorladen, was im Manifest steht — ein Einsatz darf nicht erst beim
  // zweiten Mal klingen
  async function preloadSfx() {
    const m = await loadSfxManifest();
    for (const id of Object.keys(m)) {
      const e = m[id];
      const list = e && (e.variants || (e.file ? [e.file] : []));
      for (const f of list || []) loadSfxBuffer(f);
    }
  }

  // Sample spielen, wenn eins da ist. Rückgabe false = Aufrufer nimmt den synthetischen Einsatz.
  function playSample(id, strength) {
    if (!A || !ctx || !sfxManifest) return false;
    const e = sfxManifest[id];
    if (!e) return false;
    const list = e.variants || (e.file ? [e.file] : []);
    if (!list.length) return false;
    const file = list[(Math.random() * list.length) | 0];
    const buf = sfxBufs.get(file);
    if (!buf) { loadSfxBuffer(file); return false; }   // noch nicht da → diesmal synthetisch
    const t = ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const jit = e.jitter != null ? e.jitter : 0.06;
    src.playbackRate.value = (e.rate || 1) * (1 + (Math.random() * 2 - 1) * jit);
    const g = ctx.createGain();
    g.gain.value = (e.gain != null ? e.gain : 0.8) * P.sfx * (strength == null ? 1 : strength);
    src.connect(g); g.connect(A.fxBus);
    src.start(t);
    return true;
  }

  async function startMusic() {
    if (!ctx || !A) return;
    try {
      await loadJukebox();
      if (!trackFile) {
        const pick = tracks[0];
        trackFile = pick.file;
        if (pick.bpm) bpm = pick.bpm;
      }
      // laufende Quelle sauber killen — onended ZUERST, sonst legt der Restart-Timer eine
      // zweite Quelle drauf (Flamming; in v11 zwei Runden gejagt)
      if (musicState) { try { musicState.src.onended = null; musicState.src.stop(); } catch (e) {} musicState = null; }
      clearTimeout(restartT);
      const file = trackFile;
      const meta = tracks.find((t) => t.file === file);
      const doLoop = !meta || meta.loop !== false;
      let buf = bufs.get(file);
      if (!buf) {
        const res = await fetch(trackUrl(file));
        buf = await ctx.decodeAudioData(await res.arrayBuffer());
        bufs.set(file, buf);
      }
      const gain = ctx.createGain();
      gain.gain.value = P.music * P.musicHead;
      gain.connect(A.master);
      if (A.analyser) gain.connect(A.analyser);
      A.musicGain = gain;
      const play = () => {
        clearTimeout(restartT);
        if (!A || trackFile !== file) return;         // Graph tot oder Track gewechselt
        const src = ctx.createBufferSource(); src.buffer = buf; src.connect(gain);
        beat0 = ctx.currentTime;                      // die Eins fällt auf den Track-Start
        src.start();
        src.onended = () => { if (doLoop) restartT = setTimeout(play, 5000); };
        musicState = { src, file };
      };
      play();
    } catch (e) { console.warn('[travel-audio] Musikbett fehlgeschlagen', e); }
  }

  // ---------------------------------------------------------------- GRAPH
  function start() {
    if (A) { resume(); return true; }
    if (!enabled) return false;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return false;
    ctx = new Ctx();
    // Ein frisch angelegter Context kommt in vielen Browsern SUSPENDIERT hoch. Ohne resume()
    // läuft `ctx.currentTime` nicht — also feuert der Phasenvergleich nie und der Analyser liest
    // Stille. Das ist die Falle, die den ganzen Slice tot aussehen lässt.
    ctx.resume && ctx.resume();
    const M = mood();
    const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    const fxBus = ctx.createGain(); fxBus.gain.value = P.fx; fxBus.connect(master);
    const analyser = ctx.createAnalyser(); analyser.fftSize = 256; analyser.smoothingTimeConstant = 0.3;
    const freq = new Uint8Array(analyser.frequencyBinCount);

    // SPACE: ein geteilter Hall (Feedback-Delay), Wet aus dem Mood
    const reverbIn = ctx.createGain();
    const rvDelay = ctx.createDelay(1.5); rvDelay.delayTime.value = 0.14 + M.rev * 0.16;
    const rvFb = ctx.createGain(); rvFb.gain.value = 0.28 + M.rev * 0.22;
    const rvDamp = ctx.createBiquadFilter(); rvDamp.type = 'lowpass'; rvDamp.frequency.value = 1100 + M.bright * 0.5;
    const rvWet = ctx.createGain(); rvWet.gain.value = 0.22 + M.rev * 0.3;
    reverbIn.connect(rvDelay); rvDelay.connect(rvDamp); rvDamp.connect(rvFb); rvFb.connect(rvDelay);
    rvDamp.connect(rvWet); rvWet.connect(master);
    fxBus.connect(reverbIn);                          // POST-Fader: FX auf 0 = auch Hall aus

    // BED: der Partialsatz des Moods, tiefpassgefiltert
    const droneGain = ctx.createGain(); droneGain.gain.value = 0.14 * P.drone; droneGain.connect(master);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = M.bright;
    lp.connect(droneGain); droneGain.connect(reverbIn);
    const oscs = [], baseF = M.ratios.map((r) => M.root * r);
    baseF.forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = M.type; o.frequency.value = f;
      o.detune.value = (i % 2 ? 1 : -1) * M.detune;
      const g = ctx.createGain(); g.gain.value = i === 0 ? 0.6 : 0.42 / i;
      o.connect(g); g.connect(lp); o.start();
      oscs.push(o);
    });

    // MOTION: Breitbandrauschen, Pegel ∝ heat², Bandpass öffnet mit dem Tempo
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource(); noise.buffer = noiseBuf; noise.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = M.air; bp.Q.value = 0.6;
    const windGain = ctx.createGain(); windGain.gain.value = 0;
    noise.connect(bp); bp.connect(windGain); windGain.connect(master); noise.start();
    // S21 · zweite Luftschicht: tiefes Rumpeln aus demselben Rauschen, Tiefpass. Es wird NAH AM
    // BODEN lauter — dort reflektiert die Luft, und genau das macht Tiefflug körperlich.
    const rumbleLp = ctx.createBiquadFilter(); rumbleLp.type = 'lowpass'; rumbleLp.frequency.value = 180; rumbleLp.Q.value = 0.4;
    const rumbleGain = ctx.createGain(); rumbleGain.gain.value = 0;
    const noise2 = ctx.createBufferSource(); noise2.buffer = noiseBuf; noise2.loop = true;
    noise2.connect(rumbleLp); rumbleLp.connect(rumbleGain); rumbleGain.connect(master); noise2.start();

    // EVENT: Mood-Puls (Absurd stottert, Forbidden pocht) — atmet mit dem Tempo ein
    let pulseGain = null, pulseDepth = null;
    if (M.pulse > 0) {
      pulseGain = ctx.createGain(); pulseGain.gain.value = 0; pulseGain.connect(fxBus);
      const po = ctx.createOscillator(); po.type = moodIdx === 2 ? 'square' : 'sawtooth';
      po.frequency.value = M.root * 2;
      const pf = ctx.createBiquadFilter(); pf.type = 'lowpass'; pf.frequency.value = M.bright * 1.4;
      const lfo = ctx.createOscillator(); lfo.type = 'square'; lfo.frequency.value = M.pulse;
      pulseDepth = ctx.createGain(); pulseDepth.gain.value = 0;
      lfo.connect(pulseDepth); pulseDepth.connect(pulseGain.gain);
      po.connect(pf); pf.connect(pulseGain); po.start(); lfo.start();
    }

    A = { master, fxBus, reverbIn, droneGain, lp, oscs, baseF, windGain, bp,
          rumbleGain, rumbleLp,
          noiseBuf, pulseGain, pulseDepth, analyser, freq, mood: M, musicGain: null };
    beat0 = ctx.currentTime;
    startMusic();
    preloadSfx();
    master.gain.linearRampToValueAtTime(P.master, ctx.currentTime + 1.2);
    return true;
  }

  // Mood-Wechsel OHNE Rebuild: Wellenform, Frequenzen und Filter lassen sich live umstellen.
  // (v11 baute den Graph neu — hier ist der Story-Wechsel ein Regler, das darf nicht knacken.)
  function setMood(i) {
    moodIdx = ((i % 6) + 6) % 6;
    if (!A || !ctx) return;
    const M = mood(), t = ctx.currentTime;
    A.mood = M;
    A.baseF = M.ratios.map((r) => M.root * r);
    for (let k = 0; k < A.oscs.length; k++) {
      A.oscs[k].type = M.type;
      A.oscs[k].detune.setTargetAtTime((k % 2 ? 1 : -1) * M.detune, t, 0.3);
      A.oscs[k].frequency.setTargetAtTime(A.baseF[k], t, 0.4);
    }
    A.lp.frequency.setTargetAtTime(M.bright, t, 0.4);
    A.bp.frequency.setTargetAtTime(M.air, t, 0.4);
  }

  function update(dt, src) {
    src = src || {};
    if (!A || !ctx) return;
    const t = ctx.currentTime, M = A.mood;
    const h = Math.max(0, Math.min(1, src.heat || 0));
    const rate = src.rate || 0;

    // BED: Tonhöhe reitet den Regie-Skalar, Cutoff öffnet bei Beschleunigung
    for (let i = 0; i < A.oscs.length; i++) {
      A.oscs[i].frequency.setTargetAtTime(A.baseF[i] * (1 + h * 0.5 + Math.max(0, rate) * 0.05), t, 0.12);
    }
    A.droneGain.gain.setTargetAtTime((0.13 + h * 0.10) * P.drone, t, 0.15);
    A.lp.frequency.setTargetAtTime(M.bright * (0.85 + h * 1.1) + Math.max(0, rate) * 300, t, 0.12);
    // MOTION: Fahrtwind ∝ heat², im Walk-Modus deutlich leiser (kein Fahrtwind zu Fuß)
    const windScale = src.mode === 'walk' ? 0.35 : 1;
    // S21 · Böen: ein langsamer Zufallsgang (alle ~0,9 s ein neues Ziel, weich angefahren).
    // Ohne das steht der Wind als Rauschteppich — mit ihm atmet er.
    gustPhase += dt;
    if (gustPhase > 0.9) { gustPhase = 0; gustTarget = 0.72 + Math.random() * 0.56; }
    gustVal += (gustTarget - gustVal) * Math.min(1, dt * 1.6);
    const gust = 1 + (gustVal - 1) * P.gust;
    // Bodennähe: `agl` in Weltunits. Tief → mehr Rumpeln, dunklerer Bandpass (Reflexion).
    const agl = src.agl != null ? src.agl : 30;
    const low = Math.max(0, Math.min(1, 1 - (agl - 2) / 16));
    A.windGain.gain.setTargetAtTime(h * h * 0.32 * P.wind * windScale * gust, t, 0.07);
    A.bp.frequency.setTargetAtTime(M.air * (1 - low * 0.35) + h * 1400, t, 0.07);
    if (A.rumbleGain) {
      A.rumbleGain.gain.setTargetAtTime(h * (0.05 + low * 0.16) * P.rumble * windScale, t, 0.12);
      A.rumbleLp.frequency.setTargetAtTime(140 + h * 120 + low * 90, t, 0.15);
    }
    if (A.pulseDepth) A.pulseDepth.gain.setTargetAtTime(h * 0.45, t, 0.25);

    // TAKT: die Eins kommt aus der Track-BPM, die Uhr hängt am AudioContext (nie am Track)
    const spb = 60 / Math.max(30, bpm);
    const phase = ((t - beat0) % spb) / spb;
    if (phase < prevPhase) beatImpulse = 1;
    prevPhase = phase;
    beatImpulse *= Math.exp(-dt * P.beatDecay);

    // PEGEL: Bassband des laufenden Tracks. Der ROHE Pegel taugt nicht als Beat — er steht bei
    // einem gemasterten Track dauerhaft hoch (gemessen 0,70) und ließe die Cubes durchtanzen.
    // Was zählt, ist der AUSSCHLAG über dem langsamen Mittel: das ist ein Onset, kein Grundrauschen.
    if (A.analyser) {
      A.analyser.getByteFrequencyData(A.freq);
      let s = 0; for (let i = 0; i < 8; i++) s += A.freq[i];
      const lv = s / (8 * 255);
      level += (lv - level) * Math.min(1, dt * 8);
      levelAvg += (level - levelAvg) * Math.min(1, dt * 0.6);
    }

    // Hörer mit der Kamera bewegen (vorbereitet für die Sky-Karten in S22)
    const cam = src.camera, L = ctx.listener;
    if (cam && L && L.positionX) {
      const p = cam.position;
      L.positionX.setTargetAtTime(p.x, t, 0.05);
      L.positionY.setTargetAtTime(p.y, t, 0.05);
      L.positionZ.setTargetAtTime(p.z, t, 0.05);
    }
  }

  // ---------------------------------------------------------------- EVENTS
  function sfx(kind, strength) {
    if (!A || !ctx) return;
    // S21: erst die echte Datei (Georgs ElevenLabs/Kenney), dann die synthetische Rückfallebene
    if (playSample(kind, strength)) return;
    const t = ctx.currentTime, s = strength == null ? 1 : Math.max(0, Math.min(1.5, strength));
    // S60 (v11) · Die drei Würfel am Himmel. Holz auf Holz, nicht Kristall: kurze, trockene
    // Anschläge mit Bandpass um 300–900 Hz und einem tiefen Körper darunter. Drei Ereignisse,
    // dreimal dieselbe Familie in verschiedener Härte — der Wurf ist ein Rutschen, das Taumeln ein
    // Klacken, das Einrasten ein Setzen mit Nachhall. Echte Samples ersetzen das später
    // (`docs/SFX_elevenlabs_prompts.md`), die Namen bleiben.
    if (kind === 'dice-roll' || kind === 'dice-tumble' || kind === 'dice-lock') {
      const lock = kind === 'dice-lock', rollStart = kind === 'dice-roll';
      const src = ctx.createBufferSource(); src.buffer = A.noiseBuf;
      src.playbackRate.value = rollStart ? 0.7 : (lock ? 0.55 : 1.05 + Math.random() * 0.35);
      const f = ctx.createBiquadFilter(); f.type = 'bandpass';
      f.Q.value = lock ? 1.1 : 2.2;
      const base = rollStart ? 300 : (lock ? 240 : 620 + Math.random() * 260);
      f.frequency.setValueAtTime(base, t);
      f.frequency.exponentialRampToValueAtTime(rollStart ? 900 : base * 0.6, t + (rollStart ? 0.34 : 0.12));
      const g = ctx.createGain();
      const peak = (rollStart ? 0.085 : (lock ? 0.13 : 0.07)) * s;
      const dur = rollStart ? 0.42 : (lock ? 0.7 : 0.16);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(peak, t + (lock ? 0.004 : 0.012));
      g.gain.exponentialRampToValueAtTime(0.0004, t + dur);
      src.connect(f); f.connect(g); g.connect(A.fxBus);
      src.start(t); src.stop(t + dur + 0.05);
      // Körper: ein kurzer tiefer Ton, damit die Würfel Masse haben. Beim Einrasten tiefer und länger.
      const o = ctx.createOscillator(); o.type = 'triangle';
      o.frequency.setValueAtTime(lock ? 116 : 168, t);
      o.frequency.exponentialRampToValueAtTime(lock ? 74 : 132, t + (lock ? 0.34 : 0.1));
      const og = ctx.createGain();
      og.gain.setValueAtTime(0.0001, t);
      og.gain.linearRampToValueAtTime((lock ? 0.075 : 0.032) * s, t + 0.01);
      og.gain.exponentialRampToValueAtTime(0.0003, t + (lock ? 0.5 : 0.16));
      o.connect(og); og.connect(A.fxBus);
      o.start(t); o.stop(t + (lock ? 0.55 : 0.2));
      return;
    }
    if (kind === 'step') {
      // Schritt: sehr kurzer gefilterter Rauschklick, Tonhöhe gejittert — zwei gleiche Schritte
      // klingen sofort mechanisch
      const src2 = ctx.createBufferSource(); src2.buffer = A.noiseBuf;
      src2.playbackRate.value = 0.8 + Math.random() * 0.5;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass';
      f.frequency.value = 520 + Math.random() * 260; f.Q.value = 1.6;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.1 * s, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0004, t + 0.11);
      src2.connect(f); f.connect(g); g.connect(A.fxBus);
      src2.start(t); src2.stop(t + 0.14);
      return;
    }
    if (kind === 'roll') {
      // Barrel-Roll: ein Swish, der über die Stereobreite wandert — die Drehung wird hörbar
      const src2 = ctx.createBufferSource(); src2.buffer = A.noiseBuf; src2.playbackRate.value = 1.3;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.4;
      f.frequency.setValueAtTime(700, t);
      f.frequency.exponentialRampToValueAtTime(2200, t + 0.3);
      f.frequency.exponentialRampToValueAtTime(600, t + 0.8);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.2 * s, t + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0006, t + 0.85);
      const pn = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (pn) { pn.pan.setValueAtTime(-1, t); pn.pan.linearRampToValueAtTime(1, t + 0.8); src2.connect(f); f.connect(pn); pn.connect(g); }
      else { src2.connect(f); f.connect(g); }
      g.connect(A.fxBus); src2.start(t); src2.stop(t + 0.9);
      return;
    }
    if (kind === 'boost' || kind === 'card') {
      // Whoosh: gebandpasstes Rauschen, hoch und wieder runter
      const src = ctx.createBufferSource(); src.buffer = A.noiseBuf;
      src.playbackRate.value = kind === 'card' ? 1.4 : 1.15;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = kind === 'card' ? 1.1 : 0.9;
      f.frequency.setValueAtTime(360, t);
      f.frequency.exponentialRampToValueAtTime(2600, t + 0.18);
      f.frequency.exponentialRampToValueAtTime(560, t + 0.55);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.42 * s, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0008, t + 0.6);
      src.connect(f); f.connect(g); g.connect(A.fxBus);
      src.start(t); src.stop(t + 0.65);
      if (kind === 'card') {
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(1318, t); o.frequency.exponentialRampToValueAtTime(880, t + 0.28);
        const pg = ctx.createGain();
        pg.gain.setValueAtTime(0.0001, t); pg.gain.linearRampToValueAtTime(0.3, t + 0.01);
        pg.gain.exponentialRampToValueAtTime(0.0006, t + 0.7);
        o.connect(pg); pg.connect(A.fxBus); o.start(t); o.stop(t + 0.8);
      }
      return;
    }
    if (kind === 'land') {
      // Thump: kurzer tiefer Aufprall, Stärke = Impact
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(170, t); o.frequency.exponentialRampToValueAtTime(46, t + 0.18);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.3 * s, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 0.32);
      o.connect(g); g.connect(A.fxBus); o.start(t); o.stop(t + 0.36);
      return;
    }
    if (kind === 'jump') {
      // Pop: kurzer aufsteigender Ton — Cartoon-Absprung, keine Melodie
      const o = ctx.createOscillator(); o.type = 'triangle';
      o.frequency.setValueAtTime(320, t); o.frequency.exponentialRampToValueAtTime(880, t + 0.13);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.16 * s, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 0.2);
      o.connect(g); g.connect(A.fxBus); o.start(t); o.stop(t + 0.24);
    }
  }

  return {
    name: 'travel-audio', start, update, setMood, sfx, loadJukebox, resume,
    get ready() { return !!A; },
    // DAS ist das Gate für den Runner: Graph gebaut UND Uhr läuft UND nicht stummgeschaltet.
    // `ready` allein heißt nur „Graph existiert" — damit würde der synthetische Takt beim ersten
    // Ton-Einschalten dauerhaft verworfen, auch wenn danach nichts spielt.
    get running() { return isRunning(); },
    get state() { return ctx ? ctx.state : 'off'; },
    get beat() { return beatImpulse; },
    get level() { return level; },
    // Onset aus der Musik: Ausschlag über dem langsamen Mittel, nicht der Pegel selbst
    get pulse() { return Math.max(0, Math.min(1, (level - levelAvg) * 4)); },
    get bpm() { return bpm; },
    get tracks() { return tracks || []; },
    get track() { return trackFile; },
    get enabled() { return enabled; },
    get params() { return P; },
    // S70 · **Platz machen für die Stimme.** Nicht ein zweiter Lautstärkeregler, sondern ein FAKTOR
    // auf die bestehenden Pegel: Musik und Bett gehen zurück, während geredet wird, und kommen von
    // selbst zurück. Der Erzähler dreht hier NICHT selbst — er sagt nur, dass er redet.
    // Warum zwei Zeitkonstanten: runter muss schnell (sonst frisst der Anfang des Satzes den Pegel),
    // rauf muss langsam (sonst pumpt es zwischen zwei Sätzen). 0,08 s / 0,45 s, gemessen an v11.
    duck(on, amount) {
      const a = amount != null ? amount : P.duckAmount;
      duckAmt = on ? Math.max(0, Math.min(1, a)) : 0;
      if (!A || !ctx) return;
      const f = 1 - duckAmt, t = ctx.currentTime, tau = on ? 0.08 : 0.45;
      if (A.musicGain) A.musicGain.gain.setTargetAtTime(P.music * P.musicHead * f, t, tau);
      A.droneGain.gain.setTargetAtTime(0.14 * P.drone * f, t, tau);
    },
    get ducked() { return duckAmt; },
    setEnabled(on) {
      enabled = !!on;
      if (!ctx || !A) { if (enabled) start(); return; }
      A.master.gain.setTargetAtTime(enabled ? P.master : 0, ctx.currentTime, enabled ? 0.3 : 0.2);
      if (enabled) resume();
    },
    setTrack(file) {
      if (!file || file === trackFile) return;
      trackFile = file;
      const meta = (tracks || []).find((t) => t.file === file);
      if (meta && meta.bpm) bpm = meta.bpm;
      if (A) startMusic();
    },
    setMusicVol(v) {
      P.music = Math.max(0, v);
      if (!A || !ctx) return;
      if (A.musicGain) A.musicGain.gain.setTargetAtTime(P.music * P.musicHead, ctx.currentTime, 0.1);
      if (P.music <= 0.001 && musicState) {
        try { musicState.src.onended = null; musicState.src.stop(); } catch (e) {}
        musicState = null; clearTimeout(restartT);
      } else if (P.music > 0.001 && !musicState) startMusic();
    },
    setDroneVol(v) { P.drone = Math.max(0, v); },
    setRumbleVol(v) { P.rumble = Math.max(0, v); },
    setGustVol(v) { P.gust = Math.max(0, v); },
    setSfxVol(v) { P.sfx = Math.max(0, v); },
    setFxVol(v) { P.fx = Math.max(0, v); if (A && ctx) A.fxBus.gain.setTargetAtTime(P.fx, ctx.currentTime, 0.1); },
    setWindVol(v) { P.wind = Math.max(0, v); },
    setBpm(v) { bpm = Math.max(30, v || 104); },
    reset() { beatImpulse = 0; level = 0; levelAvg = 0; },
    dispose() {
      clearTimeout(restartT);
      if (musicState) { try { musicState.src.onended = null; musicState.src.stop(); } catch (e) {} musicState = null; }
      if (ctx) { try { ctx.close(); } catch (e) {} }
      ctx = null; A = null;
    },
  };
}
